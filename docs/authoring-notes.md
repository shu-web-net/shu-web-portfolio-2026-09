# 記事執筆・運用メモ（microCMS運用後）

microCMSで記事を書く/移行済み記事を扱う際の、埋め込み・画像まわりの運用ルール。
リッチエディタ(richEditorV2)は `<script>` や独自class/data属性・iframeをサニタイズで除去するため、
「素のHTMLを貼る」運用は避け、以下の規約に統一する。

## 埋め込み（X / YouTube / Instagram）実装済み ✅

- **やること**：本文に **URLだけ** を1段落で貼る。
  例：`https://x.com/shu_web_net/status/2016577556708020711`
- **やらないこと**：各サービスの埋め込みコード（`<iframe>` や `<script>` 付きのもの）を貼る
  → リッチエディタでscript/iframeが除去され描画されない。
- 実装：`lib/embeds.ts`（`transformEmbeds`）が記事本文HTMLを解析し、URLを検出して埋め込みタグに変換する。

### X（Twitter）
- 検出パターン：`(twitter|x).com/{user}/status/{id}`
- 変換先：`<blockquote class="twitter-tweet">`（X公式ウィジェット形式）
- 移行済み145記事（約326ツイート）は、既存の引用blockquote（status URLを含む）に `class="twitter-tweet"` を付与するだけでよい（内容は変更しない）。
- 描画：`components/EmbedScripts.tsx` が `platform.twitter.com/widgets.js` を読み込み、`twttr.widgets.load()` を実行してカード化する。
  - **注意**：scriptを動的にDOM追加すると自動スキャンが効かないため `widgets.load()` を明示的に呼ぶ必要がある。
  - **注意**：widgets.jsは元のblockquoteを隠さず、別に `<div class="twitter-tweet twitter-tweet-rendered">` を追加するだけなので、`load()` 完了後に元のblockquoteを `display:none` にする後処理が必要（EmbedScripts.tsxで対応済み）。
- 公開ツイートのみ描画可。非公開/削除済みはフォールバックのblockquote（引用テキスト＋リンク）がそのまま表示される。

### YouTube
- 検出パターン：`youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`
- 変換先：`youtube-nocookie.com/embed/{id}` への素の `<iframe>`（`loading="lazy"`、レスポンシブ16:9枠）
- 外部スクリプト不要。移行済み記事にYouTube埋め込み目的の投稿は無かった（本文中の通常リンクが4件あるのみで、それらは意図的に変換対象外＝URL単体の段落でないため自動でスキップされる）。

### Instagram
- 検出パターン：`instagram.com/p/{id}`, `instagram.com/reel/{id}`
- 変換先：`<blockquote class="instagram-media" data-instgrm-permalink="...">`（Instagram公式ウィジェット形式）
- 描画：`instagram.com/embed.js` を読み込み `instgrm.Embeds.process()` を実行。
- 移行済み記事に該当なし（0件）。今後の新規記事のみ対象。

## 画像

- 既存記事の本文中画像は `https://shu-web.jp/wp-content/uploads/...`（絶対URL）。Xserverにuploadsを残す限り表示され続ける（移行しない）。
- 新規記事の画像は microCMS のメディアを使う。

## アフィリエイト

- ポートフォリオの方針として本文にアフィリンク/バナーは載せない（移行時に全除去済み）。
- ツール等の言及は、必要なら通常リンク（非アフィリ）で貼る。
