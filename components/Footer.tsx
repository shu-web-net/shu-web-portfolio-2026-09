export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-wrap flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-10 font-mono text-[12.5px] text-muted">
      <span>© 2026 しゅう ／ Webコーダー</span>
      <div className="flex flex-wrap items-center gap-4">
        <span>CS20年 × Webコーディング × AI活用</span>
        <a
          href="https://x.com/shu_web_net"
          target="_blank"
          rel="noopener"
          aria-label="X (Twitter)"
          className="inline-flex items-center gap-1.5 transition hover:text-accentink"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M9.53 6.78 15.17.5h-1.34l-4.9 5.45L5.02.5H.5l5.92 8.4L.5 15.5h1.34l5.18-5.76 4.14 5.76h4.52L9.53 6.78Zm-1.83 2.04-.6-.83L2.33 1.44h2.06l3.85 5.36.6.83 5 6.97H11.8L7.7 8.82Z" />
          </svg>
          X
        </a>
        <a
          href="https://github.com/shu-web-net"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          className="inline-flex items-center gap-1.5 transition hover:text-accentink"
        >
          <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
      </div>
    </footer>
  );
}
