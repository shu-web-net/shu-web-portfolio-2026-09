# 本番デプロイ手順ガイド（工程⑤⑥：GitHub Actions → Xserver）

`.github/workflows/deploy.yml` が「main へ push（またはmicroCMS公開）→ ビルド → SSH+rsyncでXserverへアップ」を自動実行する。
このガイドは、そのために **人間（しゅう）が一度だけやること** と **本番切り替え・確認・元に戻し方** をまとめる。

方式：**SSH + rsync** ／ **本番へ直接配置**（WP本体は消さず `.htaccess` の優先順位で切替 → いつでも即ロールバック可）。

> 当初はFTPS（FTP-Deploy-Action）で構築したが、XserverのFTP制御コネクションが繰り返しタイムアウトし
> timeout延長・自動リトライでも解消しなかったため、SSH+rsyncに移行した（2026-09-13）。
> rsyncは差分転送のため、FTPSで8〜13分かかっていた転送が約6秒まで短縮された。

---

## ① 事前バックアップ（切り替え前に必ず）

万一に備え、切り替え前の状態を保全する。

1. **Xserverサーバーパネル → バックアップ** で、対象ドメインの「Web」領域を手動バックアップ（またはコピー）。
2. 特に **ルートの `.htaccess`（現行WordPress版）** は必ず手元にダウンロードして保存する。
   - ファイルマネージャーまたはSSH経由でルートの `.htaccess` を落として `htaccess_wp_backup.txt` 等の名前で保管。
   - ← これがロールバックの要。戻すときはこのファイルをルートに `.htaccess` として戻すだけ。

## ② 公開フォルダ（ドキュメントルート）の場所を確認

**罠：Xserverの標準的な `ドメイン/public_html/` が、実際の公開フォルダとは限らない。**

このサーバーでは、`shu-web.jp` の実際のドキュメントルートは `shu-web.jp/public_html/` だったが、
SSHでログインした直後の起点は `/home/fukudome79/`（アカウントのホームディレクトリ）になる。
つまり **rsyncの転送先パスは `shu-web.jp/public_html/`（ホームディレクトリからの相対パス）** を指定する。

判定方法：ホームディレクトリ直下にテストファイルを置いて `https://ドメイン/xxx.html` で見えるか確認する。
見えなければ `ドメイン/public_html/` を試す（今回はこちらが正解だった）。

## ③ SSH設定を有効化・鍵を登録

1. Xserverサーバーパネル → **「サーバー」グループ → 「SSH設定」**
2. SSH利用が無効なら「SSH設定を追加する」から有効化。**アクセス許可範囲は「すべてのアクセスを許可」にする**
   - ⚠️ **ハマりどころ**：デフォルトが「国内からのアクセスのみ許可」になっていることがある。
     GitHub Actionsは海外IPで動くため、これが原因で `Connection closed` / `rsync error (code 255)` が発生する。
     ローカルPCからは同じ鍵で繋がるのにActionsだけ失敗する場合、真っ先にこれを疑う。
     公開鍵認証のみ（パスワードログイン不可）なので、開放しても総当たり攻撃で突破される現実的リスクは低い。
3. デプロイ専用のSSH鍵ペアを生成する（ローカルで一度だけ）：
   ```bash
   ssh-keygen -t ed25519 -f xserver_deploy_key -N "" -C "github-actions-deploy"
   ```
4. 生成した **公開鍵**（`xserver_deploy_key.pub` の中身）を、SSH設定画面の公開鍵登録欄に貼り付けて登録。
5. 表示される **SSHホスト名**（例：`fukudome79.xsrv.jp`）と **ポート番号**（通常10022）を控える。
6. 秘密鍵（`xserver_deploy_key` の中身）はGitHub Secretsに登録したら、ローカルからは削除してよい。

## ④ microCMSのAPI情報を用意

ローカルの `.env.local` に入っている値。値をそのままSecretへ。

| 項目 | GitHub Secret 名 |
|---|---|
| サービスドメイン | `MICROCMS_SERVICE_DOMAIN` |
| APIキー（GET専用） | `MICROCMS_API_KEY` |

## ⑤ GitHub Secrets に登録

リポジトリ → **Settings → Secrets and variables → Actions → New repository secret** で登録：

- `XSERVER_SSH_HOST`（例：`fukudome79.xsrv.jp`）
- `XSERVER_SSH_PORT`（例：`10022`）
- `XSERVER_SSH_USER`（サーバーのメインアカウント名）
- `XSERVER_SSH_REMOTE_DIR`（例：`shu-web.jp/public_html/`　※末尾スラッシュ必須）
- `XSERVER_SSH_PRIVATE_KEY`（③で生成した秘密鍵。改行含めそのまま貼り付け）
- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`
- そのほかアプリ固有の環境変数（EmailJS・Google Analytics等。`.env.local.example` を参照）

> リポジトリはパブリックだが、Secretsは暗号化され、ログにも出ない。ワークフローは `${{ secrets.* }}` でのみ参照する。
> Secretsは一度登録すると値を読み返せない仕様なので、鍵を作り直した場合は必ず値ごと上書き登録すること。

---

## ⑥ 初回デプロイ（本番切り替え）

1. GitHub → **Actions タブ → 「Build & Deploy to Xserver」→ Run workflow**（手動実行）。
   - もしくは main へ push すれば自動で走る。
2. ジョブが緑になったら、`out/`（新サイト一式＋ `.htaccess`）がrsyncで転送される。
3. `.htaccess` の `DirectoryIndex index.html index.php` により、`shu-web.jp/` が **新Next.jsサイト** に切り替わる。

## ⑦ 切り替え後の確認チェックリスト

- [ ] `https://shu-web.jp/` … トップが新デザインで表示される
- [ ] 記事詳細 `https://shu-web.jp/blog/{既存スラッグ}/` … 旧URLがそのまま開く（SEO維持）
- [ ] 記事本文中の **画像** が表示される（`/wp-content/uploads/` 由来）
- [ ] `https://shu-web.jp/blog/` 一覧・ページネーションが動く
- [ ] `https://shu-web.jp/works/` 一覧が表示される
- [ ] `https://shu-web.jp/contact/` お問い合わせフォームが送信できる
- [ ] works からのリンク疎通（`docs/deploy-notes.md` の一覧参照）：
  - [ ] `/uematsu-recruit/`（独立LP・残存）
  - [ ] `/jitsuanken-challenge/`（別WP・残存）
- [ ] 存在しないURL … `/404.html` が出る
- [ ] X / YouTube / Instagram 埋め込みが描画される（記事内）
- [ ] `sitemap.xml` / `robots.txt` が返る
- [ ] Google Analyticsのタグが埋め込まれている

---

## ⑧ ロールバック（問題が出たら）

WP本体は消していないので、**`.htaccess` を戻すだけ**で即座にWordPressへ復帰する。

1. ファイルマネージャーまたはSSHでルートの `.htaccess` を、①で保存した `htaccess_wp_backup.txt` の内容に戻す
   （＝ WordPressのrewriteルールに戻し、`index.php` 優先に戻す）。
2. これで `shu-web.jp/` はWordPressに戻る。新サイトのファイル（index.html等）は残っていても、
   WPの `.htaccess` が全リクエストを `index.php` に流すため表示されない。
3. 落ち着いてから原因を調査 → 直して再デプロイ。

> 完全に新サイトファイルも消したい場合は、`out/` 由来のファイル（index.html, _next/, blog/, works/, img/, contact/, 404.html, index.txt, sitemap.xml, robots.txt）を削除。
> **`wp-content/uploads/` とサブディレクトリサイトは絶対に消さない。**

---

## ⑨ microCMS公開で自動デプロイ（工程⑤の仕上げ）

記事をmicroCMSで公開したら自動でビルド＆デプロイされる（設定済み・稼働確認済み）。

1. GitHub の Personal Access Token（`repo` 権限）を発行。
2. microCMS → API設定 → **Webhook → 「Webhook（汎用）」** で、公開時に以下を叩く設定：
   - URL: `https://api.github.com/repos/shu-web-net/shu-web-portfolio-2026-09/dispatches`
   - ヘッダー: `Authorization: token <PAT>`, `Accept: application/vnd.github+json`
   - ボディ: `{"event_type":"microcms-publish"}`
   - ← これで `repository_dispatch(microcms-publish)` が発火し、deploy.yml が走る。
3. Webhookの通知タイミングは、公開サイトの表示が変わる操作（公開・更新・非公開・削除・並び替え）のみONにする。
   下書き保存など表示に影響しない操作はOFFにして、無駄なデプロイを防ぐ。
