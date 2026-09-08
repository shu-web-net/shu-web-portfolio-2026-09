// WordPress(shu-web.jp) → microCMS blogs 記事移行スクリプト
//
// 使い方:
//   1. .env.example を .env にコピーして値を埋める
//   2. ドライラン（5件・POSTせず変換結果を表示）: npm run dry
//   3. 本番（全件）:                              npm run migrate
//
// 設計:
//   - contentId = WPスラッグ（URL /blog/{slug}/ 維持）。日本語スラッグは nippo-YYYY-MM-DD に振替。
//   - type      = タイトルが 日報/週報/月報 で始まれば ["日報"]、それ以外は ["記事"]。
//   - featured  = 既定 false。
//   - 画像は移行しない。本文中の /wp-content/uploads/ URL はそのまま（Xserverに残す）。
//   - レジューム: 登録済みcontentIdを migrated.log に追記し、再実行時はスキップ。
//   - レート制限対策で1件ごとに待機。

import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cleanAffiliate } from './clean.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- .env 読み込み（依存ゼロの簡易パーサ） ----
function loadEnv() {
  const p = join(__dirname, '.env');
  if (!existsSync(p)) {
    console.error('[中断] .env が見つかりません。.env.example をコピーして値を入れてください。');
    process.exit(1);
  }
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const SERVICE_ID = process.env.MICROCMS_SERVICE_ID;
const API_KEY = process.env.MICROCMS_WRITE_API_KEY;
const WP_BASE = process.env.WP_BASE_URL || 'https://shu-web.jp';
if (!SERVICE_ID || !API_KEY || /your-/.test(SERVICE_ID + API_KEY)) {
  console.error('[中断] .env の MICROCMS_SERVICE_ID / MICROCMS_WRITE_API_KEY を設定してください。');
  process.exit(1);
}

// ---- 引数 ----
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const FORCE = args.includes('--force'); // レジュームログを無視して再登録（内容更新時）
const limitArg = args.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;
const onlyArg = args.find((a) => a.startsWith('--only=')); // 特定slugだけ処理（QA用）
const ONLY = onlyArg ? new Set(onlyArg.split('=')[1].split(',').map((s) => s.trim())) : null;
const WAIT_MS = 500;

// ---- レジュームログ ----
const LOG_PATH = join(__dirname, 'migrated.log');
const done = new Set(
  existsSync(LOG_PATH) ? readFileSync(LOG_PATH, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean) : []
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- HTMLエンティティのデコード（タイトル/抜粋用） ----
function decodeEntities(str = '') {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

const stripTags = (html = '') => decodeEntities(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

// ---- contentId 決定（日本語/エンコードslugは nippo-日付 に振替） ----
// contentIdの手動上書き（元スラッグが長すぎる等でmicroCMSに登録できないケースの例外管理）
// key = WP元スラッグ, value = 使用するcontentId
const SLUG_OVERRIDES = {
  // WPメンテナンスエラー対処法の記事。元スラッグ84文字はcontentID長上限超のため短縮。
  'troubleshooting-briefly-unavailable-for-scheduled-maintenance-check-back-in-a-minute':
    'wp-briefly-unavailable-maintenance-error',
};

const usedIds = new Set();
function toContentId(post) {
  const raw = post.slug || '';
  if (SLUG_OVERRIDES[raw]) return SLUG_OVERRIDES[raw];
  let id;
  if (/^[a-zA-Z0-9_-]+$/.test(raw)) {
    id = raw;
  } else {
    // 日本語/エンコードslug（日報系）: slug内の日付(YYYYMMDD/YYYY-MM-DD)を拾って nippo-YYYY-MM-DD に。
    // 拾えなければ公開日にフォールバック。
    const decoded = decodeURIComponent(raw);
    const m = decoded.match(/(\d{4})[-/]?(\d{2})[-/]?(\d{2})/);
    const d = m ? `${m[1]}-${m[2]}-${m[3]}` : (post.date || '').slice(0, 10) || 'unknown';
    id = `nippo-${d}`;
  }
  // 万一の衝突回避
  let unique = id, i = 2;
  while (usedIds.has(unique)) unique = `${id}-${i++}`;
  usedIds.add(unique);
  return unique;
}

// ---- type 判定 ----
const isDiary = (title) => /^\s*(日報|週報|月報)/.test(title);

// ---- アイキャッチ画像URLの解決（featured_media ID → source_url） ----
// microCMSのeyecatch(画像)はHobbyでAPI書込不可のため、URLをテキスト(eyecatchUrl)に格納する。
// 画像はXserverの /wp-content/uploads/ に残るのでURL参照で表示できる。
let MEDIA_MAP = {};
async function fetchMediaMap(ids) {
  const uniq = [...new Set(ids.filter((id) => id && id !== 0))];
  for (let i = 0; i < uniq.length; i += 100) {
    const batch = uniq.slice(i, i + 100);
    const url = `${WP_BASE}/wp-json/wp/v2/media?include=${batch.join(',')}&per_page=100&_fields=id,source_url`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const arr = await res.json();
    if (Array.isArray(arr)) for (const m of arr) MEDIA_MAP[m.id] = m.source_url || '';
  }
}

// ---- WP全記事取得 ----
async function fetchAllPosts() {
  const posts = [];
  for (let page = 1; ; page++) {
    const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,title,content,excerpt,date,date_gmt,featured_media`;
    const res = await fetch(url);
    if (res.status === 400) break; // 範囲外ページ
    if (!res.ok) throw new Error(`WP取得失敗 page=${page}: ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    posts.push(...batch);
    if (batch.length < 100) break;
  }
  return posts;
}

// ---- 1記事を blogs 形式へ変換 ----
function transform(post) {
  const title = decodeEntities(post.title?.rendered || '');
  const { html: content } = cleanAffiliate(post.content?.rendered || ''); // アフィリ除去
  return {
    contentId: toContentId(post),
    body: {
      title,
      content,
      originalPublishedAt: new Date((post.date_gmt || post.date) + 'Z').toISOString(),
      description: stripTags(post.excerpt?.rendered || '').slice(0, 120),
      type: [isDiary(title) ? '日報' : '記事'],
      featured: false,
      eyecatchUrl: MEDIA_MAP[post.featured_media] || '',
    },
  };
}

// ---- microCMS へ upsert（PUTで新規作成、既存ならPATCHで更新） ----
async function upsertContent(contentId, body) {
  const url = `https://${SERVICE_ID}.microcms.io/api/v1/blogs/${encodeURIComponent(contentId)}`;
  const headers = { 'Content-Type': 'application/json', 'X-MICROCMS-API-KEY': API_KEY };
  let res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 && /already exists/i.test(txt)) {
      res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`PATCH ${res.status} ${await res.text()}`);
      return res.json();
    }
    throw new Error(`PUT ${res.status} ${txt}`);
  }
  return res.json();
}

// ---- メイン ----
(async () => {
  console.log(`[開始] mode=${DRY ? 'DRY-RUN' : '本番'} limit=${LIMIT === Infinity ? '全件' : LIMIT}`);
  const posts = await fetchAllPosts();
  await fetchMediaMap(posts.map((p) => p.featured_media));
  console.log(`[取得] WP記事 ${posts.length}件 / アイキャッチURL ${Object.keys(MEDIA_MAP).length}件（登録済スキップ: ${done.size}件）`);

  let processed = 0, ok = 0, skipped = 0, failed = 0;
  const typeCount = { 記事: 0, 日報: 0 };

  for (const post of posts) {
    if (processed >= LIMIT) break;
    if (ONLY && !ONLY.has(post.slug)) continue;
    const { contentId, body } = transform(post);
    typeCount[body.type[0]]++;

    if (!FORCE && done.has(contentId)) { skipped++; continue; }
    processed++;

    if (DRY) {
      console.log(`\n--- [${processed}] ${contentId}`);
      console.log(`  title: ${body.title}`);
      console.log(`  type : ${body.type[0]} / featured: ${body.featured}`);
      console.log(`  date : ${body.originalPublishedAt}`);
      console.log(`  desc : ${body.description.slice(0, 60)}...`);
      console.log(`  content長: ${body.content.length}文字`);
      continue;
    }

    try {
      await upsertContent(contentId, body);
      appendFileSync(LOG_PATH, contentId + '\n');
      ok++;
      console.log(`[OK ${ok}] ${contentId} (${body.type[0]})`);
    } catch (e) {
      failed++;
      console.error(`[NG] ${contentId}: ${e.message}`);
    }
    await sleep(WAIT_MS);
  }

  console.log(`\n[完了] 処理=${processed} 成功=${ok} スキップ=${skipped} 失敗=${failed}`);
  console.log(`[内訳] 記事=${typeCount.記事} 日報=${typeCount.日報}`);
  if (DRY) console.log('※ドライランのためPOSTはしていません。問題なければ `npm run migrate` で本番実行。');
})().catch((e) => { console.error('[致命的エラー]', e); process.exit(1); });
