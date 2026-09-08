import type { Work } from '@/lib/microcms';

// NDA（守秘）で非公開カード表示にする works の contentId。
export const NDA_IDS = ['nursery-group-site', 'telecom-lpo'];

export default function WorkCard({ work, className = '' }: { work: Work; className?: string }) {
  const isNda = NDA_IDS.includes(work.id);
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
  const thumbStyle = work.thumbnail?.url ? { backgroundImage: `url(${work.thumbnail.url})` } : undefined;

  return (
    <Tag className={`card ${className}`} {...linkProps}>
      <div className="thumb" style={thumbStyle} />
      <h3 className="mb-2 text-[16.5px] font-bold">{work.title}</h3>
      <p className="text-[13.5px] leading-[1.72] text-muted">{work.overview}</p>
      {Chips}
      {work.url && <span className="mt-3 inline-block font-mono text-[12px] text-accentink">サイトを見る →</span>}
    </Tag>
  );
}
