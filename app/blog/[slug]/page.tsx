import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogDetail, blogThumbnail } from '@/lib/microcms';
import { transformEmbeds } from '@/lib/embeds';
import { getAllBlogIds } from '../shared';
import EmbedScripts from '@/components/EmbedScripts';

export async function generateStaticParams() {
  const ids = await getAllBlogIds();
  return ids.map((id) => ({ slug: id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogDetail(params.slug, {
    fields: 'title,description,eyecatch,eyecatchUrl',
  }).catch(() => null);
  if (!post) return {};
  const title = `${post.title} | しゅう | Webコーダー ポートフォリオ`;
  const description = post.description || undefined;
  // 記事にアイキャッチがあればそれを、無ければサイト共通のOG画像を使う
  const images = [blogThumbnail(post) ?? '/og-image.png'];
  return {
    title,
    description,
    openGraph: { type: 'article', url: `/blog/${params.slug}/`, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  // generateMetadataと同様、この記事だけの取得失敗がビルド全体を止めないようにする
  // （microCMSのレート制限でSDKのretryを使い切った場合等）。
  const post = await getBlogDetail(params.slug).catch(() => null);
  if (!post) notFound();
  const thumb = blogThumbnail(post);
  const typeLabel = post.type?.[0] ?? '記事';
  const contentHtml = transformEmbeds(post.content);

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
          <img src={thumb} alt={post.title} className="mt-8 w-full rounded-xl border border-line" />
        )}

        <div
          className="prose dark:prose-invert prose-a:text-accentink prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-accent mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
      <EmbedScripts />
    </main>
  );
}
