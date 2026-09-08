// profile（オブジェクト形式）へ入稿する。内容は docs/microcms/profile-content.md 準拠。
// 実行: node input-profile.mjs   （書き込みキーに PUT/PATCH 権限が必要）
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '');
}
const S = process.env.MICROCMS_SERVICE_ID, K = process.env.MICROCMS_WRITE_API_KEY;

const catchcopy = 'CS20年 × Webコーディング × AI活用';

const introParas = [
  'Webコーダーのしゅうです。大手通信会社のドコモショップやアマゾンジャパンでの在宅カスタマーサポートなど、20年にわたる接客・CS経験に、Webコーディングの実装力とAIツールの活用を掛け合わせています。専門的な内容を予備知識のない相手へ伝わる言葉に置き換える力と、自分でコードを書ける技術的知見の両方を持つことが強みです。',
  '作業を進める中で出てきた疑問や確認したいことは、ためこまずにこまめに相談します。認識のずれは早めに解くほど小さく済むため、都度すり合わせながら進め、後からの大きな手戻りを防ぎます。',
  'AIコーディングツールを実務に組み込み、デザインデータからの初期実装を自動生成するなど、着手を高速化しています。生成物を鵜呑みにはせず、動くコード・引き継げるコードとしての最終的な責任は自分が持つ前提で扱っています。',
  'デイトラのWeb制作コース・アドバンスコースを修了し、2025年5月にフリーランスとして独立。現在は Next.js / TypeScript / microCMS を用いたサイト構築から、WordPress オリジナルテーマ制作、LP実装まで担当しています。',
  '在宅勤務での体調管理をきっかけに完全禁酒を達成し、ヨガ・瞑想・サイクリングを日課に心身を整えて働いています。チワワ1匹とネコ2匹との暮らしを大切にしたく、フルリモートでの実務に慣れていることもあり、働き方は完全リモートを希望しています。',
];
const introduction = introParas.map((p) => `<p>${p}</p>`).join('');

const skillGroups = [
  ['言語', [
    'HTML / CSS（SCSS）… コーディング、レスポンシブ / クロスブラウザ対応',
    'JavaScript / jQuery … スライダー・ドロップダウン・カウンター等の動的パーツ実装',
    'TypeScript … Next.js でのサイト構築、既存LPの改修',
    'PHP … WordPress テーマ開発の範囲',
  ]],
  ['フレームワーク / ライブラリ', [
    'Next.js … サイト構築、LP改修',
    'Tailwind CSS … ユーティリティベースのスタイリング',
  ]],
  ['CMS', [
    'microCMS … スキーマ設計、API連携、管理画面のカスタマイズ',
    'WordPress … オリジナルテーマ自作（デモ含め10件以上）、カスタム投稿 / カスタムフィールド',
  ]],
  ['デザイン / 制作ツール', [
    'Figma / Adobe XD … デザインデータからのコーディング、仕様の読み取り',
    'Photoshop … 画像の書き出し、簡易加工',
  ]],
  ['開発環境 / その他', [
    'Git / GitHub … バージョン管理、ブランチ運用',
    'AIコーディングツール（Claude Code 等）… 初期実装の自動生成、業務効率化',
    'Figma MCP … デザインデータからAIで初期実装を生成',
    'Google Maps API / Gemini API を用いた機能実装',
    'レスポンシブ / クロスブラウザ / SSL化 / 基本的なSEO対策',
  ]],
];
const skills = skillGroups
  .map(([h, items]) => `<h3>${h}</h3><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`)
  .join('');

// 構造化スキル（繰り返しフィールド skillItems / カスタムフィールド skillItem）
const skillItems = [
  ['言語', 'HTML / CSS（SCSS）', 'コーディング、レスポンシブ / クロスブラウザ対応'],
  ['言語', 'JavaScript / jQuery', 'スライダー・ドロップダウン・カウンター等の動的パーツ実装'],
  ['言語', 'TypeScript', 'Next.js でのサイト構築、既存LPの改修'],
  ['言語', 'PHP', 'WordPress テーマ開発の範囲'],
  ['フレームワーク・ライブラリ', 'Next.js', 'サイト構築、LP改修'],
  ['フレームワーク・ライブラリ', 'Tailwind CSS', 'ユーティリティベースのスタイリング'],
  ['CMS', 'microCMS', 'スキーマ設計、API連携、管理画面のカスタマイズ'],
  ['CMS', 'WordPress', 'オリジナルテーマ自作（デモ含め10件以上）、カスタム投稿 / カスタムフィールド'],
  ['デザイン・制作', 'Figma / Adobe XD', 'デザインデータからのコーディング、仕様の読み取り'],
  ['デザイン・制作', 'Photoshop', '画像の書き出し、簡易加工'],
  ['開発・その他', 'Git / GitHub', 'バージョン管理、ブランチ運用'],
  ['開発・その他', 'Claude Code（AI活用）', '初期実装の自動生成、業務効率化'],
  ['開発・その他', 'Figma MCP', 'デザインデータからAIで初期実装を生成'],
  ['開発・その他', 'Google Maps API / Gemini API', '機能実装'],
  ['開発・その他', 'レスポンシブ / SSL化 / SEO', 'レスポンシブ・クロスブラウザ対応、SSL化、基本的なSEO対策'],
].map(([category, name, description]) => ({ fieldId: 'skillItem', category: [category], name, description }));

const body = { catchcopy, introduction, skills, skillItems };

const url = `https://${S}.microcms.io/api/v1/profile`;
const headers = { 'Content-Type': 'application/json', 'X-MICROCMS-API-KEY': K };

// オブジェクト形式は PATCH で更新する（初期コンテンツは管理画面で1件作成済みが前提）。
const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
if (!res.ok) {
  const txt = await res.text();
  if (/not exists/i.test(txt)) {
    throw new Error('profileに初期コンテンツがありません。管理画面でprofileを1件作成（catchcopyに何か入力して公開）してから再実行してください。');
  }
  throw new Error(`PATCH ${res.status} ${txt}`);
}
console.log('[OK] profile を PATCH で更新しました');

// 検証
const check = await (await fetch(url, { headers })).json();
console.log('--- 入稿結果 ---');
console.log('catchcopy:', check.catchcopy);
console.log('introduction 文字数:', (check.introduction || '').length);
console.log('skills 文字数:', (check.skills || '').length);
