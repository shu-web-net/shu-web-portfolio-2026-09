import type { Metadata } from 'next';
import BlogTypeTabs from '@/components/BlogTypeTabs';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { getBlogListPage, TYPE_LABEL, type BlogTypeSlug } from '../../shared';

export async function generateStaticParams() {
  return (Object.keys(TYPE_LABEL) as BlogTypeSlug[]).map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: { type: BlogTypeSlug } }): Promise<Metadata> {
  return {
    title: `${TYPE_LABEL[params.type]}一覧 | しゅう | Webコーダー ポートフォリオ`,
    description: `${TYPE_LABEL[params.type]}の一覧。`,
  };
}

export default async function BlogTypePage({ params }: { params: { type: BlogTypeSlug } }) {
  const { items, totalPages } = await getBlogListPage(1, params.type);

  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="pb-10 pt-16">
        <p className="kicker">// blog</p>
        <h1 className="mt-3 text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.2] tracking-[-.01em] [text-wrap:balance]">
          {TYPE_LABEL[params.type]}一覧
        </h1>
        <div className="mt-6">
          <BlogTypeTabs active={params.type} />
        </div>
      </section>

      <section className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlogList posts={items} />
          <Pagination currentPage={1} totalPages={totalPages} basePath={`/blog/type/${params.type}`} />
        </div>
      </section>
    </main>
  );
}
