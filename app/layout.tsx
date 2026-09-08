import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealInit from '@/components/RevealInit';

export const metadata: Metadata = {
  title: 'しゅう | Webコーダー ポートフォリオ',
  description: 'CS20年 × Webコーディング × AI活用。実装と進行でチームに長く伴走するWebコーダー「しゅう」のポートフォリオ。',
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
