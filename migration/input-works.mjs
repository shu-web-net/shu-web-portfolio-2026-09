// works（リスト形式）へ10件入稿する。内容は docs/microcms/works-content.md 準拠。
// 実行: node input-works.mjs   （works API に GET/PUT/PATCH 権限が必要）
// PUTで新規作成、既存ならPATCHで更新（upsert）。thumbnailは後日手動追加。
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '');
}
const S = process.env.MICROCMS_SERVICE_ID, K = process.env.MICROCMS_WRITE_API_KEY;
const headers = { 'Content-Type': 'application/json', 'X-MICROCMS-API-KEY': K };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const works = [
  {
    id: 'nursery-group-site', order: 10,
    title: '保育園グループサイト（全70園規模）',
    overview: '全70園規模の保育園グループのWebサイト。各園を microCMS 上の1コンテンツとして登録し、一覧・詳細ページを動的生成。条件による検索・絞り込みと、住所データからの Google マップ自動生成を実装した。',
    role: 'フロントエンド実装と microCMS のスキーマ設計を担当。リッチエディタにカスタムクラスを設定し、各園の担当者が表示崩れを起こさずに本文を装飾できる状態を用意した。',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'microCMS'],
    url: '',
  },
  {
    id: 'telecom-lpo', order: 50,
    title: '大手通信会社のLPO案件（LP改修）',
    overview: '大手通信会社のランディングページ改修（LPO）案件。制作チームの一員として、指示書をもとに既存LPの改修・コンポーネント修正を担当した。',
    role: 'Next.js によるLPの改修、コンポーネント単位の修正。',
    techStack: ['Next.js', 'TypeScript'],
    url: '',
  },
  {
    id: 'recruit-lp-construction', order: 20,
    title: '採用LP（建築関係企業）',
    overview: '建築関係企業の採用ランディングページ。Adobe XD のデザインカンプをもとにコーディング。片側に寄せたスライダーや、ボタンで開閉するドロップダウンなど動きのあるパーツを実装し、制作期間5日で納品した。',
    role: 'コーディング一式、動的パーツ実装、レスポンシブ対応。',
    techStack: ['HTML', 'CSS', 'Sass', 'JavaScript', 'jQuery'],
    url: 'https://shu-web.jp/uematsu-recruit/',
  },
  {
    id: 'photographer-portfolio', order: 30,
    title: '写真家（カメラマン）のポートフォリオサイト',
    overview: '写真家のポートフォリオサイト。デザインをもとにコーディングし、WordPress のオリジナルテーマとして構築。作品を見せる構成とレスポンシブ対応を行った。',
    role: 'コーディング、JavaScript 実装、WordPress オリジナルテーマ自作、レスポンシブ対応。',
    techStack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'PHP', 'WordPress', 'Figma'],
    url: 'https://ninchy.com/',
  },
  {
    id: 'sober-ai-media', order: 40,
    title: '禁酒サポートメディア（自社メディア・個人開発）',
    overview: '脳科学と AI を切り口にした禁酒サポートメディア。要件定義・デザイン・コーディング・WordPress テーマ化まで一貫して個人開発。JavaScript による禁酒日数カウンターや、Gemini API と連携して用語集から自動でプロンプトを生成する機能を実装した。',
    role: '企画・要件定義・デザイン・実装・運用（個人開発）。',
    techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'],
    url: 'https://sober-ai.com/',
  },
  {
    id: 'chrome-habit-tracker', order: 60,
    title: 'Chrome拡張機能「習慣トラッカー」',
    overview: '習慣を開始した日からの日数をカウントする Chrome ブラウザの拡張機能。複数の習慣カウントや編集にも対応。日本語版・英語版の2言語で Chrome ウェブストアに無料公開している。企画から実装、ストア公開まで個人で行った。',
    role: '企画・実装・ストア公開（個人開発）。',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://chromewebstore.google.com/detail/%E7%BF%92%E6%85%A3%E3%83%88%E3%83%A9%E3%83%83%E3%82%AB%E3%83%BC/mgcmopppljadhjbempepcbcmmjiljcgl',
  },
  {
    id: 'jitsuanken-challenge-lp', order: 70,
    title: '企業LP（実案件想定チャレンジ課題）',
    overview: '1週間の納期で実務レベルのLPを制作する想定課題。Figma のデザインカンプをピクセル単位で正確に再現し、アニメーションの挙動も含めて納期より前倒しで提出、修正なしで完了した。',
    role: 'コーディング一式、アニメーション実装、レスポンシブ対応。',
    techStack: ['HTML', 'CSS', 'Sass', 'JavaScript', 'jQuery', 'Figma'],
    url: 'https://shu-web.jp/jitsuanken-challenge/',
  },
  {
    id: 'mongolia-travel-lp', order: 80,
    title: 'モンゴル旅行サイト（デモLP）',
    overview: 'Figma のデザインカンプをもとに WordPress で構築したモンゴル旅行のデモLP。1ページに3つのスライダー、tableタグによる表組み、grid レイアウトによる不揃いな画像配置などを実装した。※デモは Basic 認証（ID: demo / PW: demo）',
    role: 'デザインカンプからのコーディング、WordPress 化、動的パーツ実装、レスポンシブ対応。',
    techStack: ['HTML', 'CSS', 'Sass', 'JavaScript', 'jQuery', 'PHP', 'WordPress', 'Figma'],
    url: 'https://shu-web.jp/mongolia',
  },
  {
    id: 'cafe-site-graduation', order: 90,
    title: 'カフェサイト（デモ・卒業制作）',
    overview: 'Figma のデザインカンプをもとに、WordPress 化を含めて構築したカフェサイトのデモ。商品購入ページを含む複数ページ構成で制作した。※デモは Basic 認証（ID: demo / PW: demo）',
    role: 'デザインカンプからのコーディング、WordPress 化。',
    techStack: ['HTML', 'CSS', 'Sass', 'JavaScript', 'jQuery', 'PHP', 'WordPress', 'Figma'],
    url: 'https://shu-web.jp/portfolio-cafe/',
  },
  {
    id: 'cafe-lp-free-task', order: 100,
    title: 'カフェのLP（デモ・自由課題）',
    overview: 'デイトラ実務編の自由課題として制作したカフェのランディングページ（架空のデモ）。小規模店舗を想定した、デザインからのコーディングとレスポンシブ対応を行った。※デモは Basic 認証（ID: demo / PW: demo）',
    role: 'デザインからのコーディング、レスポンシブ対応。',
    techStack: ['HTML', 'CSS', 'Sass', 'JavaScript', 'jQuery'],
    url: 'https://shu-web.jp/portfolio-cafe-lp/',
  },
];

async function upsert(w) {
  const { id, ...body } = w;
  const url = `https://${S}.microcms.io/api/v1/works/${id}`;
  let res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 400 && /already exists/i.test(txt)) {
      res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`PATCH ${res.status} ${await res.text()}`);
      return 'updated';
    }
    throw new Error(`PUT ${res.status} ${txt}`);
  }
  return 'created';
}

let ok = 0, fail = 0;
for (const w of works) {
  try {
    const r = await upsert(w);
    ok++;
    console.log(`[OK ${r}] ${w.id} (order:${w.order})`);
  } catch (e) {
    fail++;
    console.error(`[NG] ${w.id}: ${e.message}`);
  }
  await sleep(400);
}
console.log(`\n[完了] 成功=${ok} 失敗=${fail} / ${works.length}件`);
