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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="ページネーション" className="mt-10 flex flex-wrap items-center justify-center gap-2 font-mono text-[13px]">
      {currentPage > 1 && (
        <a href={href(currentPage - 1)} className="rounded-md border border-line px-3 py-1.5 text-muted transition hover:border-accent hover:text-accentink">
          ← 前へ
        </a>
      )}
      <div className="flex flex-wrap items-center gap-1">
        {pages.map((p) => (
          <a
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={
              p === currentPage
                ? 'min-w-[32px] rounded-md bg-accent px-2.5 py-1.5 text-center font-bold text-[#04231f]'
                : 'min-w-[32px] rounded-md px-2.5 py-1.5 text-center text-muted transition hover:text-accentink'
            }
          >
            {p}
          </a>
        ))}
      </div>
      {currentPage < totalPages && (
        <a href={href(currentPage + 1)} className="rounded-md border border-line px-3 py-1.5 text-muted transition hover:border-accent hover:text-accentink">
          次へ →
        </a>
      )}
    </nav>
  );
}
