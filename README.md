# shu-web-portfolio

Webコーダー「しゅう」のポートフォリオサイト（[shu-web.jp](https://shu-web.jp/)）のソースコードです。
WordPress で運用していたサイトを、Next.js + microCMS + Xserver 静的配信の構成にリニューアルしました。

このリポジトリを公開しているのは、記事や実績の紹介だけでなく、**サイトそのものの実装をコードで見てもらうため**です。

## 技術スタック

| 領域 | 採用技術 | 理由 |
|---|---|---|
| フレームワーク | [Next.js](https://nextjs.org/)（App Router） | `output: 'export'` で完全な静的サイトとして書き出し、サーバーの用意なしに配信できるため |
| 言語 | TypeScript | |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) | CSS変数をトークンの真実の値とし、Tailwind設定で参照する構成。レイアウトはユーティリティ直書き、再利用コンポーネントは `@layer components` |
| CMS | [microCMS](https://microcms.io/) | ヘッドレスCMS。個人開発・Hobbyプランが商用利用可能な点も選定理由 |
| ホスティング | Xserver（静的配信のみ） | 既契約サーバーを追加費用なしで活用。Node.js等は動かさず、静的ファイルの配信のみ担わせる |
| CI/CD | GitHub Actions | push または microCMS の Webhook をトリガーに、ビルドから Xserver への FTPS デプロイまで自動化 |
| フォーム | [EmailJS](https://www.emailjs.com/) | 静的サイトにサーバー機能を持たせずに、お問い合わせフォームの送信・自動返信を実現するため |

## 全体構成

```
microCMS（記事・実績・プロフィールを入稿）
   │ 公開 → Webhook
   ▼
GitHub Actions（ビルド）
   │ npm run build（output: 'export' で静的書き出し）
   ▼
Xserver（FTPSで out/ をアップロード）
   → shu-web.jp で静的サイトとして配信
```

WordPress からの移行にあたり、次の方針をとりました。

- **記事URLを維持**：約220記事の WordPress スラッグを microCMS のコンテンツIDにそのまま採用し、`/blog/元スラッグ/` を維持。既存のSEO流入を守るため
- **画像は移行しない**：本文中の画像は Xserver の `/wp-content/uploads/` に残したまま参照。WordPress本体は退避しても、このフォルダだけは恒久的に残す
- **切り替えは `.htaccess` の優先順位変更のみ**：WordPress本体は削除せず、`DirectoryIndex` の設定で静的サイトを優先させる方式。問題が起きても `.htaccess` を戻すだけで即座に旧サイトへ復帰できる、低リスクな移行

## 主な機能

- 記事・実績一覧のページネーション（静的書き出しのためクエリパラメータではなく `/blog/page/2/` のようなURLベースの静的パスで実装）
- ブログのtype別絞り込み（同様にURLベース）
- 記事本文中の X（Twitter）/ YouTube / Instagram の埋め込みをカード化（URLを1行貼るだけで自動変換）
- ライト/ダークテーマ（`prefers-color-scheme` 追従、初期表示のちらつき対策込み）
- お問い合わせフォーム（EmailJS、通知メールと自動返信メールを送信）
- OGP / Twitterカード対応、記事ごとのアイキャッチ画像を自動反映
- microCMS の更新をトリガーにした自動ビルド・デプロイ

## ディレクトリ構成（抜粋）

```
app/            Next.js App Router のページ・レイアウト
  blog/         ブログ一覧・詳細・type別絞り込み
  works/        制作実績一覧
  contact/      お問い合わせフォーム
components/     再利用コンポーネント
lib/microcms.ts microCMS クライアント・型定義・取得関数
deploy/         Xserver配信用の .htaccess
.github/workflows/deploy.yml   ビルド〜デプロイの自動化
docs/           設計メモ・移行方針のドキュメント
```

## ローカルでの動かし方

```bash
npm install
cp .env.local.example .env.local  # microCMSのAPI情報を設定
npm run dev
```

## デプロイ

`main` ブランチへの push、または microCMS のコンテンツ公開をトリガーに GitHub Actions が自動でビルド・デプロイします。詳細は [`docs/deploy-guide.md`](./docs/deploy-guide.md) を参照してください。

## 本リポジトリについて

学習・参考目的での閲覧はご自由にどうぞ。コードの転載・商用利用・再配布はご遠慮ください。
