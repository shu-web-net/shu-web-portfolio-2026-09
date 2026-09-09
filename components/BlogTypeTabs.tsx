import type { BlogTypeSlug } from '@/app/blog/shared';

const TABS: { slug?: BlogTypeSlug; label: string }[] = [
  { slug: undefined, label: 'すべて' },
  { slug: 'article', label: '記事' },
  { slug: 'diary', label: '日報' },
];

export default function BlogTypeTabs({ active }: { active?: BlogTypeSlug }) {
  return (
    <div className="flex flex-wrap gap-2 font-mono text-[13px]">
      {TABS.map((t) => {
        const href = t.slug ? `/blog/type/${t.slug}/` : '/blog/';
        const isActive = active === t.slug;
        return (
          <a
            key={t.label}
            href={href}
            className={
              isActive
                ? 'rounded-md bg-accent px-3 py-1.5 font-bold text-[#04231f]'
                : 'rounded-md border border-line px-3 py-1.5 text-muted transition hover:border-accent hover:text-accentink'
            }
          >
            {t.label}
          </a>
        );
      })}
    </div>
  );
}
