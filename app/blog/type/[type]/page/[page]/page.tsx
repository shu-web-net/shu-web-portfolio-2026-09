import type { Metadata } from 'next';
import BlogTypeTabs from '@/components/BlogTypeTabs';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { getBlogListPage, getBlogTotalPages, TYPE_LABEL, type BlogTypeSlug } from '../../../../shared';

export async function generateStaticParams() {
  const types = Object.keys(TYPE_LABEL) as BlogTypeSlug[];
  const results: { type: string; page: string }[] = [];
  for (const type of types) {
    const totalPages = await getBlogTotalPages(type);
    for (let p = 2; p <= totalPages; p++) results.push({ type, page: String(p) });
  }
  return results;
}

export async function generateMetadata({
  params,
}: {
  params: { type: BlogTypeSlug; page: string };
}): Promise<Metadata> {
  return {
    title: `${TYPE_LABEL[params.type]}一覧（${params.page}ページ目） | しゅう | Webコーダー ポートフォリオ`,
  };
}

export default async function BlogTypePagedPage({
  params,
}: {
  params: { type: BlogTypeSlug; page: string };
}) {
  const page = Number(params.page);
  const { items, totalPages } = await getBlogListPage(page, params.type);

  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="pb-10 pt-16">
        <p className="kicker">// blog</p>
        <h1 className="mt-3 text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.2] tracking-[-.01em] [text-wrap:balance]">
          {TYPE_LABEL[params.type]}一覧
        </h1>
        <p className="mt-3 font-mono text-[13px] text-muted">Page {page} / {totalPages}</p>
        <div className="mt-6">
          <BlogTypeTabs active={params.type} />
        </div>
      </section>

      <section className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlogList posts={items} />
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/blog/type/${params.type}`} />
        </div>
      </section>
    </main>
  );
}
