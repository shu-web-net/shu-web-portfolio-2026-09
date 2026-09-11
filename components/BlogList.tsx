import type { Blog } from '@/lib/microcms';

const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');

export default function BlogList({ posts }: { posts: Blog[] }) {
  return (
    <div className="flex flex-col">
      {posts.map((b) => (
        <a
          key={b.id}
          href={`/blog/${b.id}/`}
          className="group flex items-baseline gap-3.5 border-b border-line py-[15px] transition-[padding] duration-100 ease-out hover:pl-2.5"
        >
          <span className={b.type?.[0] === '日報' ? 'tag tag-diary' : 'tag'}>{b.type?.[0] ?? '記事'}</span>
          <span className="flex-1 text-[15px] transition group-hover:text-accentink">{b.title}</span>
          <span className="font-mono text-[12px] tabular-nums text-muted">{fmtDate(b.originalPublishedAt)}</span>
        </a>
      ))}
    </div>
  );
}
