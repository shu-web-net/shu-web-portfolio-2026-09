import { getWorks, type Work } from '@/lib/microcms';

export const WORKS_PAGE_SIZE = 8;

// 1回のリクエストで全件取得する前提（limit上限のためworksが100件を超えたら要見直し）。
// totalCount はAPIが返す実際の総件数を使う（取得件数の頭打ちで総数を誤認しないため）。
export async function getAllWorks(): Promise<{ contents: Work[]; totalCount: number }> {
  const all = await getWorks({ orders: 'order', limit: 100 });
  if (all.totalCount > 100) {
    // eslint-disable-next-line no-console
    console.warn(`works総件数が${all.totalCount}件でlimit(100)を超えています。取得漏れが発生します。`);
  }
  return { contents: all.contents, totalCount: all.totalCount };
}

export async function getWorksPageData(page: number): Promise<{ items: Work[]; totalPages: number; totalCount: number }> {
  const { contents, totalCount } = await getAllWorks();
  const totalPages = Math.max(1, Math.ceil(totalCount / WORKS_PAGE_SIZE));
  const items = contents.slice((page - 1) * WORKS_PAGE_SIZE, page * WORKS_PAGE_SIZE);
  return { items, totalPages, totalCount };
}
