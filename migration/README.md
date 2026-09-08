# 記事移行スクリプト（WordPress → microCMS blogs）

shu-web.jp の全記事（約220件）を microCMS の `blogs` へ流し込む。

## 前提

- Node.js 18以上（`fetch` 標準搭載。外部依存なし＝`npm install` 不要）
- microCMSで `blogs` API作成済み（`docs/microcms/schema/blogs.json` をインポート）
- blogsで「任意のコンテンツID指定」を有効化済み

## セットアップ

```bash
cd migration
cp .env.example .env   # PowerShellなら: copy .env.example .env
# .env を編集:
#   MICROCMS_SERVICE_ID   = xxxx.microcms.io の xxxx
#   MICROCMS_WRITE_API_KEY = 書き込み用APIキー（移行後は無効化/削除）
#     ※blogsに GET / PUT / PATCH 権限が必要。
#       PUT=新規作成(作成専用)、PATCH=既存更新。再実行・上書きにはPATCH必須。
```

## 実行

```bash
# 1. ドライラン（先頭5件・POSTせず変換結果だけ表示）
npm run dry

# 2. 本番（全件）
npm run migrate
```

## 挙動

- **contentId** = WPスラッグ。URL `/blog/{slug}/` を維持。
  日本語スラッグ（日報3件）は `nippo-YYYY-MM-DD` に自動振替（slug内の日付を採用）。
- **type** = タイトルが「日報/週報/月報」で始まれば `日報`、それ以外は `記事`。
- **featured** = 既定 `false`（トップ掲載したい記事だけ後で手動ON）。
- **originalPublishedAt** = WPの公開日時（GMT基準でISO化）。表示・並び替えはこれを使う。
- **画像は移行しない**：本文中の `/wp-content/uploads/...` はそのまま。Xserverに残るので生き続ける。
- **レジューム**：登録済みcontentIdを `migrated.log` に追記。中断しても再実行で続きから（既存はスキップ）。
- **レート制限**：1件ごとに0.5秒待機（全220件で約2分）。

## 検証（本番後）

1. 件数突き合わせ：microCMSの `blogs` 総数が 220 か
2. ランダム数件でタイトル・本文長・日付・typeを現行サイトと比較
3. 本文に Pochipp（アフィリンク）ブロックの残骸が無いか数件チェック
4. リッチエディタでの見え方・本文中画像の表示確認

## 注意

- `.env` は絶対にコミットしない（`.gitignore` 済み）。誤混入したらmicroCMSでキー再発行。
- 下書き・非公開記事はWP REST APIの既定では取得されない（公開記事のみ移行）。
