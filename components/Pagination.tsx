// 表示するページ番号の並びを作る。先頭・末尾・現在ページの前後1つは常に出し、
// 間が空くところは '…'（省略）に置き換える。例: 1 … 5 [6] 7 … 11
function pageItems(current: number, total: number): (number | '…')[] {
  // 総ページが少ないうちは省略せず全部出す（… を挟むより数字を並べた方が押しやすい）
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const nums = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...nums].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const items: (number | '…')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push('…'); // 連続していない＝間が飛んでいる箇所に … を差し込む
    items.push(p);
    prev = p;
  }
  return items;
}

// 静的エクスポート向けページネーション（/base/ = 1ページ目、/base/page/2/ 以降）。
// works・blog 双方の一覧ページで共用する。
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => (p === 1 ? `${basePath}/` : `${basePath}/page/${p}/`);
  const pages = pageItems(currentPage, totalPages);

  return (
    <nav aria-label="ページネーション" className="mt-10 flex flex-wrap items-center justify-center gap-2 font-mono text-[13px]">
      {currentPage > 1 && (
        <a href={href(currentPage - 1)} className="rounded-md border border-line px-3 py-1.5 text-muted transition hover:border-accent hover:text-accentink">
          ← 前へ
        </a>
      )}
      <div className="flex flex-wrap items-center gap-1">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="min-w-[32px] px-1 py-1.5 text-center text-muted" aria-hidden>
              …
            </span>
          ) : (
            <a
              key={p}
              href={href(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={
                p === currentPage
                  ? 'min-w-[32px] rounded-md bg-accent px-2.5 py-1.5 text-center font-bold text-[#04231f]'
                  : 'min-w-[32px] rounded-md px-2.5 py-1.5 text-center text-muted transition hover:bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] hover:text-accentink'
              }
            >
              {p}
            </a>
          )
        )}
      </div>
      {currentPage < totalPages && (
        <a href={href(currentPage + 1)} className="rounded-md border border-line px-3 py-1.5 text-muted transition hover:border-accent hover:text-accentink">
          次へ →
        </a>
      )}
    </nav>
  );
}
