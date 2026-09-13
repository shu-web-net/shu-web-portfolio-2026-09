import type { Work } from '@/lib/microcms';

export default function WorkCard({ work, className = '' }: { work: Work; className?: string }) {
  const isNda = work.isNda ?? false;
  const chips = work.techStack ?? [];
  const Chips = chips.length > 0 && (
    <div className="mt-3.5 flex flex-wrap gap-1.5">
      {chips.map((c) => <span key={c} className="chip">{c}</span>)}
    </div>
  );

  if (isNda) {
    return (
      <div className={`card card-nda ${className}`}>
        <span className="badge">🔒 非公開案件（NDA）</span>
        <h3 className="mb-2 text-[16.5px] font-bold">{work.title}</h3>
        <p className="text-[13.5px] leading-[1.72]">{work.overview}</p>
        {Chips}
      </div>
    );
  }

  const Tag = work.url ? 'a' : 'div';
  const linkProps = work.url ? { href: work.url, target: '_blank', rel: 'noopener' } : {};

  return (
    <Tag className={`card ${className}`} {...linkProps}>
      {work.thumbnail?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={work.thumbnail.url} alt={work.title} className="thumb w-full object-cover" />
      ) : (
        <div className="thumb" />
      )}
      <h3 className="mb-2 text-[16.5px] font-bold">{work.title}</h3>
      <p className="text-[13.5px] leading-[1.72] text-muted">{work.overview}</p>
      {Chips}
      {work.url && <span className="mt-3 inline-block font-mono text-[12px] text-accentink">サイトを見る →</span>}
    </Tag>
  );
}
