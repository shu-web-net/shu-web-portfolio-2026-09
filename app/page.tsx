import type { ReactNode } from 'react';
import { getProfile, getWorks, getBlogs } from '@/lib/microcms';
import WorkCard from '@/components/WorkCard';

const STRENGTHS = [
  ['対話', '顧客と開発チームの通訳', '20年のCS経験に、自分でコードを書ける知見を重ねる。専門用語を顧客に、漠然とした要望を実装可能な形で開発側に、双方向に翻訳します。'],
  ['協働', '働きやすい空気をつくる', 'CSで培った傾聴と気配りで、チーム内外のやり取りを円滑に。関わる人が動きやすい雰囲気づくりに貢献し、長く続く関係を大切にします。'],
  ['言語化', '要件もプロンプトも言葉にする', '曖昧な要望や頭の中の仕様を、精度高く言葉に落とす。同じ力で AI から狙った出力を引き出し着手を高速化。生成物は鵜呑みにせず、最終的な品質の責任は自分が持ちます。'],
  ['すり合わせ', '疑問はためこまず確認', '作業中に出てきた疑問や確認点は、ためこまずすぐ相談。認識のずれは早く解けば小さく済むので、都度すり合わせて後からの大きな手戻りを防ぎます。'],
  ['保守性', '引き継ぎ前提の設計', 'BEM等の命名規則と部品のコンポーネント化で、他の担当者が読んで修正・追加しやすい状態を徹底します。'],
];

const CATEGORY_ORDER = ['言語', 'フレームワーク・ライブラリ', 'CMS', 'デザイン・制作', '開発・その他'];
const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');
const D = ['', 'd1', 'd2', 'd3', 'd1', 'd2'];

function BlkHead({ title, href }: { title: string; href?: string }) {
  return (
    <div className="reveal mb-[26px] flex items-baseline justify-between gap-4">
      <h2 className="m-0 font-mono text-[15px] font-semibold uppercase tracking-[.06em] text-muted">
        <span className="text-accent">// </span>{title}
      </h2>
      {href && <a href={href} className="font-mono text-[12px] text-muted transition hover:text-accentink">all {title.split(' ').pop()} →</a>}
    </div>
  );
}

export default async function Home() {
  const [profile, works, blogs] = await Promise.all([
    getProfile(),
    getWorks({ orders: 'order', limit: 100 }),
    getBlogs({ orders: '-originalPublishedAt', limit: 4, filters: 'type[contains]記事', fields: 'id,title,type,originalPublishedAt' }),
  ]);

  const topWorks = works.contents.slice(0, 6);
  const avatar = profile.avatar?.url ?? '/img/profile-avatar.jpg';
  const skillItems = profile.skillItems ?? [];
  const grouped = CATEGORY_ORDER
    .map((cat) => [cat, skillItems.filter((s) => (s.category?.[0] ?? '') === cat)] as const)
    .filter(([, items]) => items.length > 0);
  const skillsFallbackHtml = (profile.skills ?? '').replace(
    /<li>([^<]*?)…\s*([^<]*)<\/li>/g,
    '<li><span class="sk-name">$1</span><span class="sk-use">$2</span></li>'
  );

  return (
    <main className="mx-auto max-w-wrap px-6">
      {/* hero */}
      <section className="pb-14 pt-20">
        <p className="kicker reveal">{profile.catchcopy ?? 'CS20年 × Webコーディング × AI活用'}</p>
        <h1 className="reveal d1 mt-5 text-[clamp(33px,5.6vw,60px)] font-extrabold leading-[1.14] tracking-[-.015em] [text-wrap:balance]">
          コードも、空気も、<em className="not-italic text-accentink">ととのえる</em>。
        </h1>
        <p className="reveal d2 mt-[22px] max-w-[40em] text-[17px] leading-[1.9] text-muted">
          20年のCS経験を土台に、顧客と開発チームの間で認識をそろえ、手戻りのない進行に貢献する Webコーダーです。実装は Next.js / TypeScript / microCMS / WordPress。
        </p>
        <div className="reveal d3 mt-[26px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-[5px] font-mono text-[12px] text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />長期・継続でチームに参画できる業務委託を探しています（可能であればフルリモートを希望）
          </span>
        </div>
        <div className="reveal d4 mt-8 flex flex-wrap gap-3">
          <a className="btn-primary" href="#works">制作実績を見る</a>
          <a className="btn-ghost" href="#blog">ブログを読む</a>
        </div>
      </section>

      {/* works */}
      <section id="works" className="border-t border-line py-[46px]">
        <BlkHead title="selected works" href="/works/" />
        <div className="mx-auto grid max-w-[600px] grid-cols-1 gap-4 min-[820px]:max-w-none min-[820px]:grid-cols-2">
          {topWorks.map((w, i) => <WorkCard key={w.id} work={w} className={`reveal ${D[i] ?? ''}`} />)}
        </div>
      </section>

      {/* strength */}
      <section id="strength" className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlkHead title="strength / 働き方" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STRENGTHS.map(([lab, h, p], i) => (
              <div key={lab} className={`reveal ${D[i] ?? ''} rounded-xl border border-line bg-surface p-5`}>
                <div className="font-mono text-[12px] tracking-[.04em] text-accentink">{lab}</div>
                <h3 className="my-2 text-base font-bold">{h}</h3>
                <p className="m-0 text-[13.5px] leading-[1.75] text-muted">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* skills */}
      <section id="skills" className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlkHead title="skill set" />
          {grouped.length > 0 ? (
            <>
              <div className="reveal mb-[18px] flex flex-wrap gap-2">
                {skillItems.map((s) => <span key={s.name} className="chip">{s.name}</span>)}
              </div>
              <div className="skills-doc reveal d1">
                {grouped.map(([cat, items]) => (
                  <div key={cat}>
                    <h3>{cat}</h3>
                    <ul>
                      {items.map((s) => (
                        <li key={s.name}>
                          <span className="sk-name">{s.name}</span>
                          {s.description && <span className="sk-use">{s.description}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="skills-doc reveal d1" dangerouslySetInnerHTML={{ __html: skillsFallbackHtml }} />
          )}
        </div>
      </section>

      {/* blog */}
      <section id="blog" className="border-t border-line py-[46px]">
        <div className="mx-auto max-w-3xl">
          <BlkHead title="latest posts" href="/blog/" />
          <div className="flex flex-col">
            {blogs.contents.map((b, i) => (
              <a key={b.id} href={`/blog/${b.id}/`} className={`reveal ${D[i] ?? ''} group flex items-baseline gap-3.5 border-b border-line py-[15px] transition-[padding] duration-100 ease-out hover:pl-2.5`}>
                <span className={b.type?.[0] === '日報' ? 'tag tag-diary' : 'tag'}>{b.type?.[0] ?? '記事'}</span>
                <span className="flex-1 text-[15px] transition group-hover:text-accentink">{b.title}</span>
                <span className="font-mono text-[12px] tabular-nums text-muted">{fmtDate(b.originalPublishedAt)}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* profile */}
      <section id="profile" className="border-t border-line py-[46px]">
        <BlkHead title="profile" />
        <div className="reveal grid grid-cols-1 items-start gap-6 md:grid-cols-[auto_1.3fr_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-[120px] w-[120px] rounded-full border border-line object-cover" src={avatar} alt="しゅうのプロフィール画像" />
          <div className="bio" dangerouslySetInnerHTML={{ __html: profile.introduction ?? '' }} />
          <div className="overflow-hidden rounded-xl border border-line bg-surface font-mono text-[13px]">
            {([
              ['稼働', '週30〜50h'],
              ['形態', 'フルリモート希望'],
              // チャット系/会議系をそれぞれ改行しない塊にし、境界のスペースだけで折り返す
              ['連絡', <><span className="whitespace-nowrap">Slack / Chatwork / Discord /</span> <span className="whitespace-nowrap">Zoom / Meet 等</span></>],
              ['レスポンス', '遅くとも3時間以内'],
              ['拠点', '兵庫県明石市'],
            ] as [string, ReactNode][]).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
                <span className="shrink-0 whitespace-nowrap text-muted">{k}</span><span className="text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
