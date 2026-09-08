# ポートフォリオサイト（shu-web.jp）リニューアル

Webコーダー「しゅう」のポートフォリオサイトを、WordPress（Xserver）から **Next.js + microCMS + Xserver静的配信** にリニューアルするプロジェクト。

## 全体構成

```
microCMS（記事・実績・プロフィールを入稿）
   │ 公開 → Webhook
   ▼
GitHub Actions（ビルド）
   │ npm run build（output: 'export' で静的書き出し）
   ▼
Xserver（FTP/SSHで out/ をアップ）
   → shu-web.jp で静的サイトとして配信
```

- Xserver上ではNode.jsは動かさない。ビルドはGitHub Actions上で行い、静的ファイルのみ配置する
- DNS変更不要。失敗しても静的ファイルを消せば元に戻せる低リスク移行
- ホスティング規約：Vercel Hobbyは商用NG寄りのため使わない。microCMS Hobbyは商用OK。Xserverは契約済み・追加費用ゼロ

## 技術スタック

- Next.js（App Router）/ TypeScript / Tailwind CSS
- microCMS（ヘッドレスCMS。ポートフォリオ用に新サービスを新規作成する）
- GitHub Actions（CI/CD。microCMS Webhook → ビルド → Xserverデプロイ）
- デプロイ：FTP-Deploy-Action（FTPS）またはSSH（Xserverはポート10022、要有効化）

## リポジトリ方針

- **GitHubでパブリックリポジトリにする**（コード自体を実力の証明にする。READMEに構成図・技術選定理由を書く）
- APIキーは絶対にコミットしない。`.env` を最初から `.gitignore` に入れる。誤混入時はmicroCMSでキー再発行
- クライアント情報をコード・コミットメッセージに書かない

## 現状（2026年9月時点）

- 現行ポートフォリオはWordPress（Xserver上）のみ。ローカルにコードなし
- デザインカンプ（Figma/XD）なし。現行はGemini Canvasで生成したもの。**今回デザインも新規に刷新する**
- 記事コンテンツが約220件あり、WordPress → microCMSへ移行する（工程の最初にやる）
- microCMSはポートフォリオ用の新サービスを本人が作成できる状態

## 作業順序

1. **microCMSのスキーマ作成**（docs/microcms-schema.md 参照）
2. **記事移行**（WordPress → microCMS。約220件をスクリプトで。docs/microcms-schema.md の移行方針参照）
3. Next.jsプロジェクト初期化（output: 'export'）
4. デザイン実装（新規。実績と記事が主役、デザインはシンプル・読みやすさ重視。凝りすぎない）
5. GitHub Actions構築（Webhook → ビルド → Xserverデプロイ）
6. Xserver配置（旧WPを退避、`wp-content/uploads` は残す、`.htaccess` で index.html 優先）

## 設計上の重要な決定

- **記事URLは維持する**：blogsのcontentIdにWordPressのスラッグを使い、`/blog/元スラッグ/` を維持（220件分のSEO流入を守る）
- **画像は移行しない**：Xserverの `/wp-content/uploads/` をそのまま残し、本文中の画像URLは現状維持。旧WP退避時もuploadsは残す。新規記事からmicroCMSメディアを使う
- **元の公開日**：Management APIで登録すると登録日が新しくなるため、originalPublishedAtフィールドに元の公開日を保存し、表示側はそちらを使う

## 編集・執筆時のルール（プロフィール管理フォルダから継承）

- **クライアント名は出さない**：守秘契約に触れうる。業種＋規模で表記（例：「採用LP」「保育園グループ（全70園規模）」）
- **事実を盛らない**：抽象的な自己評価の形容詞（「大規模」「圧倒的」等）を避け、読み手が判断できる事実を書く
- 実務経験：フリーランス開始は2025年5月

## 関連リンク

- 計画の詳細（調査経緯・規約・工数見積もり等）：Notion「ポートフォリオmicroCMS化」 https://app.notion.com/p/3d2c25ba278180ef8c64cfe7ed8425ff
- プロフィール文の素材（各媒体の実績・自己PR文）：`C:\Users\user\Downloads\営業活動2026_09\` の各mdファイル（実績記述・自己PRはここから流用可）
- 現行サイト：https://shu-web.jp/
