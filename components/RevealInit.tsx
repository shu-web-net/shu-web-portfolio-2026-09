'use client';

import { useEffect } from 'react';

// .reveal 要素をスクロールで順にフェードイン表示させる（mock と同じ挙動）。
export default function RevealInit() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add('in');
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
