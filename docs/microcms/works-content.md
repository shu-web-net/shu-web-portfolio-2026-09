# works 入稿テキスト（ドラフト・9件）

素材：職務経歴書（Notion）／remogu_profile.md ／現行WP works の本文。
方針：クライアント名は出さない（業種＋規模）／事実を盛らない／守秘URLは載せない。
thumbnail は後日スクショを用意（今回は空）。techStack はセレクト選択肢の範囲で付与し、
選択肢に無いツール（Adobe XD / Gemini API / Google Maps API 等）は overview/role で言及。

order は小さいほど上。実案件を上に配置。

---

## 1. 保育園グループサイト（全70園規模）  order:10  id:nursery-group-site
- **overview**：全70園規模の保育園グループのWebサイト。各園を microCMS 上の1コンテンツとして登録し、一覧・詳細ページを動的生成。条件による検索・絞り込みと、住所データからの Google マップ自動生成を実装した。
- **role**：フロントエンド実装と microCMS のスキーマ設計を担当。リッチエディタにカスタムクラスを設定し、各園の担当者が表示崩れを起こさずに本文を装飾できる状態を用意した。
- **techStack**：Next.js / TypeScript / Tailwind CSS / microCMS
- **url**：（空・守秘）

## 2. 大手通信会社のLPO案件（LP改修）  order:20  id:telecom-lpo
- **overview**：大手通信会社のランディングページ改修（LPO）案件。制作チームの一員として、指示書をもとに既存LPの改修・コンポーネント修正を担当した。
- **role**：Next.js によるLPの改修、コンポーネント単位の修正。
- **techStack**：Next.js / TypeScript
- **url**：（空・守秘）

## 3. 採用LP（建築関係企業）  order:30  id:recruit-lp-construction
- **overview**：建築関係企業の採用ランディングページ。Adobe XD のデザインカンプをもとにコーディング。片側に寄せたスライダーや、ボタンで開閉するドロップダウンなど動きのあるパーツを実装し、制作期間5日で納品した。
- **role**：コーディング一式、動的パーツ実装、レスポンシブ対応。
- **techStack**：HTML / CSS / Sass / JavaScript / jQuery
- **url**：⚠️要判断（既存URL `/uematsu-recruit/` はパスにクライアント名を含む）

## 4. 写真家（カメラマン）のポートフォリオサイト  order:40  id:photographer-portfolio
- **overview**：写真家のポートフォリオサイト。デザインをもとにコーディングし、WordPress のオリジナルテーマとして構築。作品を見せる構成とレスポンシブ対応を行った。
- **role**：コーディング、JavaScript 実装、WordPress オリジナルテーマ自作、レスポンシブ対応。
- **techStack**：HTML / CSS / JavaScript / jQuery / PHP / WordPress / Figma
- **url**：⚠️要判断（`ninchy.com` はクライアントの実サイト＝実名/現行に依存）

## 5. 禁酒サポートメディア（自社メディア・個人開発）  order:50  id:sober-ai-media
- **overview**：脳科学と AI を切り口にした禁酒サポートメディア。要件定義・デザイン・コーディング・WordPress テーマ化まで一貫して個人開発。JavaScript による禁酒日数カウンターや、Gemini API と連携して用語集から自動でプロンプトを生成する機能を実装した。
- **role**：企画・要件定義・デザイン・実装・運用（個人開発）。
- **techStack**：HTML / CSS / JavaScript / PHP / WordPress
- **url**：https://sober-ai.com/ （自社メディア・掲載可）

## 6. Chrome拡張機能「習慣トラッカー」  order:60  id:chrome-habit-tracker
- **overview**：習慣を開始した日からの日数をカウントする Chrome ブラウザの拡張機能。複数の習慣カウントや編集にも対応。日本語版・英語版の2言語で Chrome ウェブストアに無料公開している。企画から実装、ストア公開まで個人で行った。
- **role**：企画・実装・ストア公開（個人開発）。
- **techStack**：HTML / CSS / JavaScript
- **url**：日本語版 https://chromewebstore.google.com/detail/%E7%BF%92%E6%85%A3%E3%83%88%E3%83%A9%E3%83%83%E3%82%AB%E3%83%BC/mgcmopppljadhjbempepcbcmmjiljcgl
  （英語版 habit-tracker/kglcjphcooleepabaanldpogbgfiioio も公開。urlは単一のため日本語版を掲載）

## 7. 企業LP（実案件想定チャレンジ課題）  order:70  id:jitsuanken-challenge-lp
- **overview**：1週間の納期で実務レベルのLPを制作する想定課題。Figma のデザインカンプをピクセル単位で正確に再現し、アニメーションの挙動も含めて納期より前倒しで提出、修正なしで完了した。
- **role**：コーディング一式、アニメーション実装、レスポンシブ対応。
- **techStack**：HTML / CSS / Sass / JavaScript / jQuery / Figma
- **url**：https://shu-web.jp/jitsuanken-challenge/ （自ドメイン・中立スラッグ）※要確認

## 8. モンゴル旅行サイト（デモLP）  order:80  id:mongolia-travel-lp
- **overview**：Figma のデザインカンプをもとに WordPress で構築したモンゴル旅行のデモLP。1ページに3つのスライダー、tableタグによる表組み、grid レイアウトによる不揃いな画像配置などを実装した。
- **role**：デザインカンプからのコーディング、WordPress 化、動的パーツ実装、レスポンシブ対応。
- **techStack**：HTML / CSS / Sass / JavaScript / jQuery / PHP / WordPress / Figma
- **url**：⚠️要確認（デモ）

## 9. カフェサイト（デモ・卒業制作）  order:90  id:cafe-site-graduation
- **overview**：Figma のデザインカンプをもとに、WordPress 化を含めて構築したカフェサイトのデモ。商品購入ページを含む複数ページ構成で制作した。
- **role**：デザインカンプからのコーディング、WordPress 化。
- **techStack**：HTML / CSS / Sass / JavaScript / jQuery / PHP / WordPress / Figma
- **url**：⚠️要確認（デモ）

## 10. カフェのLP（デモ・自由課題）  order:100  id:cafe-lp-free-task
- **overview**：デイトラ実務編の自由課題として制作したカフェのランディングページ（架空のデモ）。小規模店舗を想定した、デザインからのコーディングとレスポンシブ対応を行った。
- **role**：デザインからのコーディング、レスポンシブ対応。
- **techStack**：HTML / CSS / Sass / JavaScript / jQuery
- **url**：⚠️要確認（デモ）

> 学習課題のclinic・尾道（中級）は、より作り込んだ上記デモに差し替えて不採用。

---

## 要判断（入稿前に確認したい点）

1. **クライアント名を含むURL**（採用LP `/uematsu-recruit/`、写真家 `ninchy.com`）：載せる/載せない。
   - 推奨：現段階では**URL非掲載**。新サイトで中立スラッグのデモページを用意できれば差し替え。
2. **デモURL**（チャレンジLP/clinic/Onomichi）：パスワード認証や架空サイトのため、リンク可否を確認。
3. **Chrome拡張のストアURL**：実URLを教えてもらえれば追記。
4. **thumbnail**：全件あとでスクショを用意して追加（今回は空で入稿）。
5. **techStack外のツール**：Adobe XD / Gemini API / Google Maps API はセレクト選択肢に無いため本文で言及。必要なら選択肢に追加も可。
