import type { Metadata } from 'next';
import WorkCard from '@/components/WorkCard';
import Pagination from '@/components/Pagination';
import { getWorksPageData } from '../../shared';

export async function generateStaticParams() {
  const { totalPages } = await getWorksPageData(1);
  // 1ページ目は /works/ が担当するので、2ページ目以降だけ生成する
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  return {
    title: `制作実績（${params.page}ページ目） | しゅう | Webコーダー ポートフォリオ`,
    description: 'Next.js / TypeScript / microCMS / WordPress での制作実績一覧。',
  };
}

export default async function WorksPagedPage({ params }: { params: { page: string } }) {
  const page = Number(params.page);
  const { items, totalPages } = await getWorksPageData(page);

  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="pb-10 pt-16">
        <p className="kicker">// selected works</p>
        <h1 className="mt-3 text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.2] tracking-[-.01em] [text-wrap:balance]">
          制作実績
        </h1>
        <p className="mt-3 font-mono text-[13px] text-muted">Page {page} / {totalPages}</p>
      </section>

      <section className="border-t border-line py-[46px]">
        <div className="mx-auto grid max-w-[600px] grid-cols-1 gap-4 min-[820px]:max-w-none min-[820px]:grid-cols-2">
          {items.map((w) => <WorkCard key={w.id} work={w} />)}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} basePath="/works" />
      </section>
    </main>
  );
}
