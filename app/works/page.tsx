import type { Metadata } from 'next';
import WorkCard from '@/components/WorkCard';
import Pagination from '@/components/Pagination';
import { getWorksPageData } from './shared';

export const metadata: Metadata = {
  title: '制作実績 | しゅう | Webコーダー ポートフォリオ',
  description: 'Next.js / TypeScript / microCMS / WordPress での制作実績一覧。保育園グループサイト（全70園規模）、企業LP、個人開発など。',
};

export default async function WorksPage() {
  const { items, totalPages } = await getWorksPageData(1);

  return (
    <main className="mx-auto max-w-wrap px-6">
      <section className="pb-10 pt-16">
        <p className="kicker">// selected works</p>
        <h1 className="mt-3 text-[clamp(28px,4.6vw,44px)] font-extrabold leading-[1.2] tracking-[-.01em] [text-wrap:balance]">
          制作実績
        </h1>
        <p className="mt-4 max-w-[40em] text-[15px] leading-[1.9] text-muted">
          Next.js / TypeScript / microCMS でのサイト構築から、WordPress オリジナルテーマ制作、LP実装まで。守秘義務のある案件は非公開案件として概要のみ掲載しています。
        </p>
      </section>

      <section className="border-t border-line py-[46px]">
        <div className="mx-auto grid max-w-[600px] grid-cols-1 gap-4 min-[820px]:max-w-none min-[820px]:grid-cols-2">
          {items.map((w) => <WorkCard key={w.id} work={w} />)}
        </div>
        <Pagination currentPage={1} totalPages={totalPages} basePath="/works" />
      </section>
    </main>
  );
}
