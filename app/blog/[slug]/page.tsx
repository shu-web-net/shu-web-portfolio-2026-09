import type { Metadata } from 'next';
import { getBlogDetail, blogThumbnail } from '@/lib/microcms';
import { getAllBlogIds } from '../shared';

export async function generateStaticParams() {
  const ids = await getAllBlogIds();
  return ids.map((id) => ({ slug: id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogDetail(params.slug, { fields: 'title,description' }).catch(() => null);
  if (!post) return {};
  return {
    title: `${post.title} | しゅう | Webコーダー ポートフォリオ`,
    description: post.description || undefined,
  };
}

const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogDetail(params.slug);
  const thumb = blogThumbnail(post);
  const typeLabel = post.type?.[0] ?? '記事';

  return (
    <main className="mx-auto max-w-wrap px-6">
      <article className="mx-auto max-w-3xl py-16">
        <a href="/blog/" className="font-mono text-[12px] text-muted transition hover:text-accentink">
          ← ブログ一覧へ
        </a>

        <div className="mt-6 flex items-center gap-3">
          <span className={typeLabel === '日報' ? 'tag tag-diary' : 'tag'}>{typeLabel}</span>
          <span className="font-mono text-[12px] tabular-nums text-muted">{fmtDate(post.originalPublishedAt)}</span>
        </div>

        <h1 className="mt-3 text-[clamp(26px,4.4vw,40px)] font-extrabold leading-[1.3] [text-wrap:balance]">
          {post.title}
        </h1>

        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="mt-8 w-full rounded-xl border border-line" />
        )}

        <div
          className="prose dark:prose-invert prose-a:text-accentink prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-accent mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
