import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';

// ルート絶対パス+アンカーにする（/blog/... 等の別ページからでもトップの該当セクションへ正しく遷移するため）
const NAV = [
  ['/#works', 'works'],
  ['/#strength', 'strength'],
  ['/#skills', 'skills'],
  ['/blog/', 'blog'],
  ['/#profile', 'profile'],
  ['/contact/', 'contact'],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line backdrop-blur-[8px] backdrop-saturate-150 bg-[color-mix(in_srgb,var(--bg)_82%,transparent)]">
      <div className="relative mx-auto flex max-w-wrap items-center justify-between px-6 py-[15px]">
        <a href="/" className="font-mono text-base font-bold tracking-[-.02em]">
          shu<b className="text-accentink">_web</b>
        </a>
        <nav className="hidden gap-6 font-mono text-[13px] text-muted sm:flex">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="transition hover:text-accentink">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://x.com/shu_web_net"
            target="_blank"
            rel="noopener"
            aria-label="X (Twitter)"
            className="text-muted transition hover:text-accentink"
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d="M9.53 6.78 15.17.5h-1.34l-4.9 5.45L5.02.5H.5l5.92 8.4L.5 15.5h1.34l5.18-5.76 4.14 5.76h4.52L9.53 6.78Zm-1.83 2.04-.6-.83L2.33 1.44h2.06l3.85 5.36.6.83 5 6.97H11.8L7.7 8.82Z" />
            </svg>
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
