'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.dataset.theme as 'light' | 'dark' | undefined;
    setTheme(current ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="テーマ切替"
      className="cursor-pointer rounded-md border border-line bg-transparent px-2.5 py-1.5 font-mono text-[12px] text-muted transition hover:border-accent hover:text-accentink"
    >
      ◐ {theme === 'dark' ? 'light' : 'dark'}
    </button>
  );
}
