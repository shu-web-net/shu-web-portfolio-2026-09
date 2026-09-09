'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const NAV = [
  ['/#works', 'works'],
  ['/#strength', 'strength'],
  ['/#skills', 'skills'],
  ['/blog/', 'blog'],
  ['/#profile', 'profile'],
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // メニューを開いている間はEscで閉じる、背景スクロールを止める
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="メニュー"
        className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-md border border-line"
      >
        <span
          className={`h-[1.5px] w-4 bg-current transition-transform ${open ? 'translate-y-[6.5px] rotate-45' : ''}`}
        />
        <span className={`h-[1.5px] w-4 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span
          className={`h-[1.5px] w-4 bg-current transition-transform ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`}
        />
      </button>

      {open &&
        createPortal(
          <>
            {/* ヘッダーのbackdrop-blurがposition:fixed子要素のcontaining blockを書き換えてしまうため、
                オーバーレイ/パネルはheader外（body直下）にportalで描画する */}
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-20 bg-black/30"
            />
            <nav className="fixed inset-x-0 top-16 z-30 border-b border-line bg-page px-6 py-4">
              <ul className="flex flex-col gap-1 font-mono text-[15px]">
                {NAV.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-2.5 text-muted transition hover:bg-surface hover:text-accentink"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </>,
          document.body
        )}
    </div>
  );
}
