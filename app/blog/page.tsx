import type { Metadata } from 'next';
import BlogTypeTabs from '@/components/BlogTypeTabs';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import { getBlogListPage } from './shared';

export const metadata: Metadata = {
  title: 'ブログ | しゅう | Webコーダー ポートフォリオ',
  description: 'Web制作の学習記録・実装tipsから、日々の記録まで。',
};

export default async function BlogPage() {
  const { items, totalPages } = await getBlogListPage(1);

  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="pb-10 pt-16">
        <p className="kicker">// blog</p>
        <h1 className="mt-3 text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.2] tracking-[-.01em] [text-wrap:balance]">
          ブログ
        </h1>
        <p className="mt-4 max-w-[40em] text-[15px] leading-[1.9] text-muted">
          Web制作の学習記録・実装tipsから、日々の記録まで。
        </p>
        <div className="mt-6">
          <BlogTypeTabs />
        </div>
      </section>

      <section className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlogList posts={items} />
          <Pagination currentPage={1} totalPages={totalPages} basePath="/blog" />
        </div>
      </section>
    </main>
  );
}
