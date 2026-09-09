import { getWorks, type Work } from '@/lib/microcms';

export const WORKS_PAGE_SIZE = 8;

export async function getWorksPageData(page: number): Promise<{ items: Work[]; totalPages: number; totalCount: number }> {
  const all = await getWorks({ orders: 'order', limit: 100 });
  const totalCount = all.contents.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / WORKS_PAGE_SIZE));
  const items = all.contents.slice((page - 1) * WORKS_PAGE_SIZE, page * WORKS_PAGE_SIZE);
  return { items, totalPages, totalCount };
}
