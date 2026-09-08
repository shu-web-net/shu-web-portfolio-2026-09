// 本文HTMLからアフィリエイト要素を安全に除去する。
// - 商品カード/バナーブロックは要素ごと削除
// - 計測用の1x1ピクセル画像は削除（本文は残す）
// - 文中のアフィリンクはリンク解除（アンカーの語は本文に残す）
// - 画像だけのアフィリンク（バナー）はまるごと削除
import * as cheerio from 'cheerio';

// アフィリエイトとみなすリンク先ホスト/パターン
const AFFILIATE_HREF =
  /(moshimo\.com|a8\.net|a8\.to|a8mat=|amzn\.to|amzn\.asia|amazon\.co\.jp\/(dp|gp)|amazon-adsystem|hb\.afl\.rakuten|hbb?\.afl\.rakuten|room\.rakuten|link-a\.net|valuecommerce|ck\.jp\.ap\.valuecommerce|accesstrade|felmat|rentracks|dokusho-ojikan|px\.a8)/i;

// アフィリの計測/バナー画像
const AFFILIATE_IMG =
  /(i\.moshimo\.com|image\.moshimo\.com|\.a8\.net|a8mat=|amazon-adsystem|ck\.jp\.ap\.valuecommerce|felmat|link-a\.net)/i;

// 要素ごと削除する広告ブロックのセレクタ
const BLOCK_SELECTORS = [
  '.pochipp-box', '.pchpp-box', '[class*="pochipp"]', '[class*="pchpp"]',
  '.affiliate', '.kanren', '.kaerebar', '.booklink', '.cateibox',
  'ins.adsbygoogle', '.rakuten-room',
].join(', ');

export function cleanAffiliate(html) {
  const $ = cheerio.load(html, null, false); // fragmentモード
  const stat = { blocks: 0, imgs: 0, unlinked: 0, bannerLinks: 0 };

  // 1) 広告ブロックごと削除
  $(BLOCK_SELECTORS).each((_, el) => { $(el).remove(); stat.blocks++; });

  // 2) 計測/バナー画像を削除
  $('img').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (AFFILIATE_IMG.test(src)) { $(el).remove(); stat.imgs++; }
  });

  // 3) アフィリンクのアンカー処理
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (!AFFILIATE_HREF.test(href)) return;
    const $el = $(el);
    if ($el.text().trim().length > 0) {
      $el.replaceWith($el.contents()); // 語は残してリンクだけ解除
      stat.unlinked++;
    } else {
      $el.remove(); // 画像バナー等（テキスト無し）はまるごと削除
      stat.bannerLinks++;
    }
  });

  // 4) 中身が空になった要素を掃除（空pや空divの残骸）
  $('p, div, figure, li, span').each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0 && $el.text().trim() === '' && $el.find('img,iframe').length === 0) {
      $el.remove();
    }
  });

  return { html: $.html(), stat };
}
