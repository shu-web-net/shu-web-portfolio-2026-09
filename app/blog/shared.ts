import { getBlogs } from '@/lib/microcms';

export const BLOG_PAGE_SIZE = 20;

export type BlogTypeSlug = 'article' | 'diary';
export const TYPE_LABEL: Record<BlogTypeSlug, string> = {
  article: '記事',
  diary: '日報',
};

const LIST_FIELDS = 'id,title,type,originalPublishedAt,eyecatchUrl';

export async function getBlogListPage(page: number, typeSlug?: BlogTypeSlug) {
  const filters = typeSlug ? `type[contains]${TYPE_LABEL[typeSlug]}` : undefined;
  const res = await getBlogs({
    orders: '-originalPublishedAt',
    limit: BLOG_PAGE_SIZE,
    offset: (page - 1) * BLOG_PAGE_SIZE,
    fields: LIST_FIELDS,
    ...(filters ? { filters } : {}),
  });
  const totalPages = Math.max(1, Math.ceil(res.totalCount / BLOG_PAGE_SIZE));
  return { items: res.contents, totalPages, totalCount: res.totalCount };
}

export async function getBlogTotalPages(typeSlug?: BlogTypeSlug): Promise<number> {
  const filters = typeSlug ? `type[contains]${TYPE_LABEL[typeSlug]}` : undefined;
  const res = await getBlogs({ limit: 1, ...(filters ? { filters } : {}) });
  return Math.max(1, Math.ceil(res.totalCount / BLOG_PAGE_SIZE));
}

// generateStaticParams用：microCMSの1リクエストあたりlimit上限(100)があるためoffsetでループして全件のIDを集める
export async function getAllBlogIds(): Promise<string[]> {
  const ids: string[] = [];
  let offset = 0;
  for (;;) {
    const res = await getBlogs({ limit: 100, offset, fields: 'id' });
    ids.push(...res.contents.map((c) => c.id));
    offset += 100;
    if (offset >= res.totalCount) break;
  }
  return ids;
}
