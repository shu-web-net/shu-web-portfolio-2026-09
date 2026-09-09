'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    twttr?: { widgets?: { load: () => Promise<unknown> } };
    instgrm?: { Embeds?: { process: () => void } };
  }
}

// X(Twitter)/Instagramの公式埋め込みスクリプトを一度だけ読み込む。
// blockquote.twitter-tweet / blockquote.instagram-media を自動でスキャンしてカード化してくれる…はずだが、
// scriptタグをJSで動的に追加した場合は自動スキャンが発火しないため、読み込み完了後に
// widgets.load() / Embeds.process() を明示的に呼び出す必要がある。
export default function EmbedScripts() {
  useEffect(() => {
    const loadOnce = (id: string, src: string, onReady: () => void) => {
      if (document.getElementById(id)) {
        onReady();
        return;
      }
      const s = document.createElement('script');
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = onReady;
      document.body.appendChild(s);
    };

    if (document.querySelector('blockquote.twitter-tweet')) {
      loadOnce('twitter-wjs', 'https://platform.twitter.com/widgets.js', () => {
        // widgets.jsは元のblockquoteを隠さず、別にiframeラッパーを追加するだけなので、
        // 変換完了後に元のフォールバックblockquoteを手動で隠す。
        window.twttr?.widgets?.load().then(() => {
          document.querySelectorAll('blockquote.twitter-tweet').forEach((bq) => {
            (bq as HTMLElement).style.display = 'none';
          });
        });
      });
    }
    if (document.querySelector('blockquote.instagram-media')) {
      loadOnce('instagram-embed-js', 'https://www.instagram.com/embed.js', () => {
        window.instgrm?.Embeds?.process();
      });
    }
  }, []);

  return null;
}
