import * as cheerio from 'cheerio';

const TWEET_STATUS_RE = /(?:twitter|x)\.com\/[^/\s"]+\/status\/(\d+)/i;
const YOUTUBE_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i;
const INSTAGRAM_RE = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/i;

// 本文HTMLを解析し、X(Twitter)/YouTube/Instagramの埋め込みを検出して変換する。
// - 移行済み記事のツイート引用(blockquote)は class="twitter-tweet" を付け直すだけでよい
//   （Twitter公式のwidgets.jsが自動でスキャンしてカード化してくれるため）
// - 新規記事は「本文にURLだけの段落」を埋め込みプレースホルダに置き換える
export function transformEmbeds(html: string): string {
  const $ = cheerio.load(html, null, false);

  // 移行済みのツイート引用ブロック：末尾のstatusパーマリンクを持つblockquoteにクラスを付与
  $('blockquote').each((_, el) => {
    const $bq = $(el);
    if ($bq.hasClass('twitter-tweet') || $bq.hasClass('instagram-media')) return;
    const lastLink = $bq.find('a[href*="status/"]').last();
    const href = lastLink.attr('href') || '';
    if (TWEET_STATUS_RE.test(href)) {
      $bq.addClass('twitter-tweet').attr('data-dnt', 'true');
    }
  });

  // 新規記事向け：段落の中身が丸ごとURLだけの場合、埋め込みプレースホルダに置き換える
  $('p').each((_, el) => {
    const $p = $(el);
    if ($p.closest('blockquote').length) return; // 既存の引用ブロック内は対象外

    const text = $p.text().trim();
    if (!text || /\s/.test(text)) return; // 単一のURLのみを対象にする（文章はスキップ）

    let url = text;
    const onlyLink = $p.children('a');
    if (onlyLink.length === 1 && $p.contents().length === 1) {
      url = onlyLink.attr('href') || text;
    }

    const tweetMatch = url.match(TWEET_STATUS_RE);
    if (tweetMatch) {
      $p.replaceWith(
        `<blockquote class="twitter-tweet" data-dnt="true"><p><a href="${url}"></a></p></blockquote>`
      );
      return;
    }

    const igMatch = url.match(INSTAGRAM_RE);
    if (igMatch) {
      $p.replaceWith(
        `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"><a href="${url}" target="_blank" rel="noopener">Instagramで見る</a></blockquote>`
      );
      return;
    }

    const ytMatch = url.match(YOUTUBE_RE);
    if (ytMatch) {
      const id = ytMatch[1];
      $p.replaceWith(
        `<div class="embed-youtube"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
      );
      return;
    }
  });

  return $.html();
}
