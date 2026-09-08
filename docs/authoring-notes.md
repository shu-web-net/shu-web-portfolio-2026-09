# 記事執筆・運用メモ（microCMS運用後）

microCMSで記事を書く/移行済み記事を扱う際の、埋め込み・画像まわりの運用ルール。
リッチエディタ(richEditorV2)は `<script>` や独自class/data属性・iframeをサニタイズで除去するため、
「素のHTMLを貼る」運用は避け、以下の規約に統一する。

## X（Twitter）の埋め込み

- **やること**：本文に **ツイートのURLだけ** を1段落で貼る。
  例：`https://x.com/shu_web_net/status/2016577556708020711`
- **やらないこと**：X公式の埋め込みコード（`<blockquote class="twitter-tweet">…<script src="platform.twitter.com/widgets.js">`）を貼る
  → scriptとclassが消えて自動描画されない。
- **描画**：フロント側が本文中の `(twitter|x).com/{user}/status/{id}` を検出し、ツイートカードに変換する。
  - 移行済み145記事（約326ツイート）は、richEditor保存後も `<blockquote>` 内にstatus URLが残っている（検証済み）。
  - 新規記事のURL貼りと、移行済みのblockquote内リンクを、**同一ロジックで拾う**設計にする。
- 公開ツイートのみ描画可（非公開/削除済みはフォールバックで引用テキスト or リンク表示）。

## 実装工程での要件（フロント）

- 本文HTMLレンダラに「ツイートURL検出 → カード描画」を実装する（候補：`react-tweet`＝ビルド時取得・静的化。`output:'export'` と相性良）。
- `twitter.com` と `x.com` の両ドメインに対応。

## 画像

- 既存記事の本文中画像は `https://shu-web.jp/wp-content/uploads/...`（絶対URL）。Xserverにuploadsを残す限り表示され続ける（移行しない）。
- 新規記事の画像は microCMS のメディアを使う。

## アフィリエイト

- ポートフォリオの方針として本文にアフィリンク/バナーは載せない（移行時に全除去済み）。
- ツール等の言及は、必要なら通常リンク（非アフィリ）で貼る。

## 他の埋め込み（YouTube / Instagram / CodePen 等）

- 同様に script/iframe は除去されるため、Xと同じく「本文にURLを貼る → フロントが検出して描画」方式に統一する。

### TODO（後で実装する）※運用で使う予定あり

- [ ] **YouTube 埋め込み**：本文に動画URL（`youtube.com/watch?v=` / `youtu.be/`）を貼ると、埋め込みプレーヤー（またはサムネ+リンク）で描画。`output:'export'` 前提なので、遅延読み込み(lite-youtube等)推奨。
- [ ] **Instagram 埋め込み**：本文に投稿URL（`instagram.com/p/` / `instagram.com/reel/`）を貼ると、投稿カードで描画。InstagramはoEmbed利用に制約があるため、実装時に「公式oEmbed(要トークン) / サムネ+リンクのフォールバック」のどちらにするか判断する。
- 実装方針：X（ツイートURL検出）と同じ「本文HTML後処理でURLパターンを検出してコンポーネント差し替え」レンダラに、プロバイダを足す形で拡張する。
- いずれも運用ルールは共通：**執筆者は本文にURLを1行貼るだけ**。埋め込みコード/iframeは貼らない。
