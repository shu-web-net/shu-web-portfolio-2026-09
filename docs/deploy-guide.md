# 本番デプロイ手順ガイド（工程⑤⑥：GitHub Actions → Xserver）

`.github/workflows/deploy.yml` が「main へ push（またはmicroCMS公開）→ ビルド → FTPSでXserverへアップ」を自動実行する。
このガイドは、そのために **人間（しゅう）が一度だけやること** と **本番切り替え・確認・元に戻し方** をまとめる。

方式：**FTPS（FTP-Deploy-Action）** ／ **本番へ直接配置**（WP本体は消さず `.htaccess` の優先順位で切替 → いつでも即ロールバック可）。

---

## ① 事前バックアップ（切り替え前に必ず）

万一に備え、切り替え前の状態を保全する。

1. **Xserverサーバーパネル → バックアップ** で、対象ドメインの「Web」領域を手動バックアップ（またはコピー）。
2. 特に **ルートの `.htaccess`（現行WordPress版）** は必ず手元にダウンロードして保存する。
   - FTPソフトでルート（例：`/shu-web.jp/public_html/`）の `.htaccess` を落として `htaccess_wp_backup.txt` 等の名前で保管。
   - ← これがロールバックの要。戻すときはこのファイルをルートに `.htaccess` として戻すだけ。

## ② XserverのFTP情報を用意

Xserverサーバーパネル → **「FTPアカウント設定」** から取得（or 新規発行）：

| 項目 | 例 / 取得先 | GitHub Secret 名 |
|---|---|---|
| FTPホスト名 | `svXXXX.xserver.jp` | `FTP_SERVER` |
| FTPユーザー名 | `例：shuweb-jp` | `FTP_USERNAME` |
| FTPパスワード | （設定したもの） | `FTP_PASSWORD` |
| アップロード先ディレクトリ | `/shu-web.jp/public_html/` ※末尾スラッシュ必須 | `FTP_SERVER_DIR` |

> アップロード先はドメインのドキュメントルート。Xserverは通常 `/（FTPユーザーのホーム）/ドメイン名/public_html/`。
> FTPソフトで接続して、`wp-content` や `index.php` が見える階層がそこ。

## ③ microCMSのAPI情報を用意

ローカルの `.env.local` に入っている2つ。値をそのままSecretへ。

| 項目 | GitHub Secret 名 |
|---|---|
| サービスドメイン | `MICROCMS_SERVICE_DOMAIN` |
| APIキー（GET専用） | `MICROCMS_API_KEY` |

## ④ GitHub Secrets に6つ登録

リポジトリ → **Settings → Secrets and variables → Actions → New repository secret** で、②③の計6つを登録：

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`
- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`

> リポジトリはパブリックだが、Secretsは暗号化され、ログにも出ない。ワークフローは `${{ secrets.* }}` でのみ参照する。

---

## ⑤ 初回デプロイ（本番切り替え）

1. GitHub → **Actions タブ → 「Build & Deploy to Xserver」→ Run workflow**（手動実行）。
   - もしくは main へ push すれば自動で走る。
2. ジョブが緑になったら、`out/`（新サイト一式＋ `.htaccess`）がルートに配置される。
3. `.htaccess` の `DirectoryIndex index.html index.php` により、`shu-web.jp/` が **新Next.jsサイト** に切り替わる。

## ⑥ 切り替え後の確認チェックリスト

- [ ] `https://shu-web.jp/` … トップが新デザインで表示される
- [ ] 記事詳細 `https://shu-web.jp/blog/{既存スラッグ}/` … 旧URLがそのまま開く（SEO維持）
- [ ] 記事本文中の **画像** が表示される（`/wp-content/uploads/` 由来）
- [ ] `https://shu-web.jp/blog/` 一覧・ページネーションが動く
- [ ] `https://shu-web.jp/works/` 一覧が表示される
- [ ] works からのリンク疎通（`docs/deploy-notes.md` の一覧参照）：
  - [ ] `/uematsu-recruit/`（独立LP・残存）
  - [ ] `/jitsuanken-challenge/`（別WP・残存）
- [ ] 存在しないURL … `/404.html` が出る
- [ ] X / YouTube / Instagram 埋め込みが描画される（記事内）

---

## ⑦ ロールバック（問題が出たら）

WP本体は消していないので、**`.htaccess` を戻すだけ**で即座にWordPressへ復帰する。

1. FTPでルートの `.htaccess` を、①で保存した `htaccess_wp_backup.txt` の内容に戻す
   （＝ WordPressのrewriteルールに戻し、`index.php` 優先に戻す）。
2. これで `shu-web.jp/` はWordPressに戻る。新サイトのファイル（index.html等）は残っていても、
   WPの `.htaccess` が全リクエストを `index.php` に流すため表示されない。
3. 落ち着いてから原因を調査 → 直して再デプロイ。

> 完全に新サイトファイルも消したい場合は、`out/` 由来のファイル（index.html, _next/, blog/, works/, img/, 404.html, index.txt）を削除。
> **`wp-content/uploads/` とサブディレクトリサイトは絶対に消さない。**

---

## ⑧ microCMS公開で自動デプロイ（工程⑤の仕上げ・任意）

記事をmicroCMSで公開したら自動でビルド＆デプロイされるようにする。

1. GitHub の Personal Access Token（`repo` 権限）を発行。
2. microCMS → API設定 → **Webhook → 「Webhook（汎用）」** で、公開時に以下を叩く設定：
   - URL: `https://api.github.com/repos/shu-web-net/shu-web-portfolio-2026-09/dispatches`
   - ヘッダー: `Authorization: token <PAT>`, `Accept: application/vnd.github+json`
   - ボディ: `{"event_type":"microcms-publish"}`
   - ← これで `repository_dispatch(microcms-publish)` が発火し、deploy.yml が走る。

> ここは本番切替（⑤⑥）が安定してから最後にやればよい。
