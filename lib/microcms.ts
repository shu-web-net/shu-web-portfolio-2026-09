import {
  createClient,
  type MicroCMSImage,
  type MicroCMSListContent,
  type MicroCMSQueries,
} from 'microcms-js-sdk';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error('MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていません（.env.local を確認）');
}

// retry: 220記事分の静的生成を並行実行するとmicroCMS(Hobbyプラン)のレート制限(429)に
// 引っかかることがあるため、SDK標準のリトライを有効化して吸収する。
export const client = createClient({ serviceDomain, apiKey, retry: true });

// 開発時のみ no-store で常に最新を取得（fetchキャッシュで古い内容が固定されるのを防ぐ）。
// 本番の静的エクスポート(next build)では no-store は動的扱いになりexportが失敗するため付けない
// （CIはクリーンビルドのため毎回最新をビルド時取得できる）。
const NO_STORE = process.env.NODE_ENV === 'development' ? { cache: 'no-store' as const } : undefined;

// ---- 型定義（docs/microcms-schema.md / 実スキーマ準拠） ----

export type BlogType = '記事' | '日報';

export type Blog = {
  title: string;
  content: string;
  eyecatch?: MicroCMSImage; // 新規記事用（microCMSメディア）
  eyecatchUrl?: string; // 移行記事用（WP画像の絶対URL）
  originalPublishedAt: string; // 元の公開日（表示・並び替えはこちらを使う）
  description?: string;
  type?: BlogType[]; // セレクト（単一選択でも配列で返る）
  featured?: boolean;
} & MicroCMSListContent;

export type Work = {
  title: string;
  thumbnail?: MicroCMSImage;
  overview: string;
  role?: string;
  techStack?: string[];
  url?: string;
  order?: number;
} & MicroCMSListContent;

export type SkillItem = {
  fieldId: string;
  category: string[]; // セレクト（単一）だが配列で返る
  name: string;
  description?: string;
};

export type Profile = {
  avatar?: MicroCMSImage; // プロフィール画像（管理画面でアップロード。無ければ /public のフォールバックを使う）
  catchcopy?: string;
  introduction?: string;
  skills?: string; // 旧：リッチテキスト（フォールバック）
  skillItems?: SkillItem[]; // 構造化スキル（繰り返しフィールド）
};

// ---- 取得ヘルパー ----

export const getBlogs = (queries?: MicroCMSQueries) =>
  client.getList<Blog>({ endpoint: 'blogs', queries, customRequestInit: NO_STORE });

export const getBlogDetail = (contentId: string, queries?: MicroCMSQueries) =>
  client.getListDetail<Blog>({ endpoint: 'blogs', contentId, queries, customRequestInit: NO_STORE });

export const getWorks = (queries?: MicroCMSQueries) =>
  client.getList<Work>({ endpoint: 'works', queries, customRequestInit: NO_STORE });

export const getProfile = (queries?: MicroCMSQueries) =>
  client.getObject<Profile>({ endpoint: 'profile', queries, customRequestInit: NO_STORE });

// 記事のサムネURLを解決（新規: eyecatch / 移行: eyecatchUrl）
export const blogThumbnail = (blog: Blog): string | undefined =>
  blog.eyecatch?.url ?? (blog.eyecatchUrl || undefined);
