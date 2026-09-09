import type { Metadata } from 'next';
import BlogTypeTabs from '@/components/BlogTypeTabs';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { getBlogListPage, getBlogTotalPages } from '../../shared';

export async function generateStaticParams() {
  const totalPages = await getBlogTotalPages();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
  return {
    title: `ブログ（${params.page}ページ目） | しゅう | Webコーダー ポートフォリオ`,
    description: 'Web制作の学習記録・実装tipsから、日々の記録まで。',
  };
}

export default async function BlogPagedPage({ params }: { params: { page: string } }) {
  const page = Number(params.page);
  const { items, totalPages } = await getBlogListPage(page);

  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="pb-10 pt-16">
        <p className="kicker">// blog</p>
        <h1 className="mt-3 text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.2] tracking-[-.01em] [text-wrap:balance]">
          ブログ
        </h1>
        <p className="mt-3 font-mono text-[13px] text-muted">Page {page} / {totalPages}</p>
        <div className="mt-6">
          <BlogTypeTabs />
        </div>
      </section>

      <section className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlogList posts={items} />
          <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
        </div>
      </section>
    </main>
  );
}
