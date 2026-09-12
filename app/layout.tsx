import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealInit from '@/components/RevealInit';

const SITE_NAME = 'しゅう | Webコーダー ポートフォリオ';
const SITE_DESC =
  'CS20年 × Webコーディング × AI活用。実装と進行でチームに長く伴走するWebコーダー「しゅう」のポートフォリオ。';

export const metadata: Metadata = {
  // 相対パスのOG画像などを絶対URLに解決するための基準
  metadataBase: new URL('https://shu-web.jp'),
  title: SITE_NAME,
  description: SITE_DESC,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
    site: '@shu_web_net',
    creator: '@shu_web_net',
    images: ['/og-image.png'],
  },
};

// 初期表示のちらつき防止：描画前に data-theme を確定させる
const themeScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  document.documentElement.dataset.theme=t;
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <RevealInit />
      </body>
    </html>
  );
}
