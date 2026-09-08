# デプロイ・移行メモ（工程6：Xserver配置で必須）

旧WordPress（親サイト）を退避し、ルートに Next.js の静的書き出し（`out/`）を置く際の注意点。

## 画像（/wp-content/uploads/）を絶対に消さない ← 最重要

blog本文中の画像・blogの `eyecatchUrl`・worksサムネ（一部）は、すべて
`https://shu-web.jp/wp-content/uploads/...`（静的ファイル）を参照している。
これらは**Apacheが直接配信する静的ファイルで、WordPress(PHP)が動いていなくても表示される**。
→ WP本体（wp-admin/wp-includes/ルートのindex.php等）は削除/退避してよいが、
   **`wp-content/uploads/` は物理的に同じパスに残すこと**。消すと全記事の画像が切れる（約220記事）。

### デプロイで消さないための必須設定
- **FTP-Deploy-Action：`dangerous-clean-slate` を使わない**（使うとサーバ側を全消しして uploads も消える）。
- **rsync/SSHの場合：`--delete` で `wp-content` を巻き込まない**（`--exclude=wp-content` 等で除外）。
- `out/`（新サイト）には wp-content が無いので、ルートに「新サイト一式 ＋ 残した wp-content/uploads/」が同居する形になる。競合しない。
- ルート `.htaccess` は実在ファイルを素通し（`RewriteCond %{REQUEST_FILENAME} -f`）するので uploads はそのまま配信される。

### 恒久的な依存であることの認識
- この方式は uploads フォルダを恒久的に残す前提。将来消すと画像が全切れ。移設したい場合は本文URL＋eyecatchUrlの一括書換＋ファイル移動が必要（現状は「残す」を推奨）。

## サブディレクトリの独立コンテンツを壊さない

shu-web.jp 配下には、親WordPressとは別に「残すべき」独立コンテンツがある。
これらは**ルートの静的サイトとは別物**なので、退避・.htaccess 設定で壊さないこと。

### 生かす（残す）もの
- **独立した静的LP**（例：`/uematsu-recruit/` … WP signalなしの素のHTML）→ フォルダごと残す
- **サブディレクトリの別WordPressインストール**（例：`/jitsuanken-challenge/` … 親とは別のWP）→ フォルダ＋DB（別テーブル接頭辞）を残す
- `/wp-content/uploads/`（本文中画像・worksサムネイル元）→ 残す（CLAUDE.md方針）

### ルート .htaccess の要件
静的サイトを配信しつつ、実在するサブディレクトリへのリクエストは横取りしない。

```apache
# 実在するファイル/ディレクトリはそのまま配信（サブディレクトリWP・静的LPを素通し）
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
# それ以外はルートの静的サイトへ（index.html優先）
DirectoryIndex index.html
```
- `/jitsuanken-challenge/` `/uematsu-recruit/` は実在ディレクトリ → 上の条件で素通しされ、各々のWP/静的HTMLが応答する。
- 退避作業で消してよいのは**親WPのコアのみ**（wp-admin, wp-includes, ルートの wp-config.php / index.php / テーマ）。サブディレクトリ配下には触れない。

## 退避前チェック
- 各サブディレクトリが「独立HTML」か「別WPインストール」か「親WPのページ/投稿」かを確認。
  - 親WPのページ/投稿（例：ルート直下のWP固定ページ）は退避で404になる → works等でリンクしているものは事前に静的保全 or リンク外す。
- works でリンクしている外部/サブディレクトリURLは、退避後に全て疎通確認する。

## works にリンク済みのURL（退避後の疎通確認対象）
- `https://shu-web.jp/uematsu-recruit/`（独立HTML・**要存置**）
- `https://shu-web.jp/jitsuanken-challenge/`（サブディレクトリの別WPインストール・**フォルダ＋DB要存置**）
- `https://ninchy.com/`（クライアントの別ドメイン実サイト・公開許可済み。移行の影響外）
- `https://sober-ai.com/`（自社メディア・別サイト。移行の影響外）
- Chrome拡張ストアURL（外部）

## Basic認証付きサブディレクトリ（現状リンクしない／将来リンクするなら認証解除）
- `/mongolia`、`/portfolio-cafe/`、`/portfolio-cafe-lp/` … 401 Basic認証。worksではスクショのみで掲載。
  退避時もフォルダは残す（将来認証を外して公開リンク化する可能性があるため）。
