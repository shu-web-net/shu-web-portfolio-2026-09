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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
