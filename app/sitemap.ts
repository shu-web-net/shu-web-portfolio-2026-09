import type { MetadataRoute } from 'next';
import { getAllBlogIds, getBlogTotalPages, TYPE_LABEL, type BlogTypeSlug } from './blog/shared';
import { getWorksPageData } from './works/shared';

const BASE_URL = 'https://shu-web.jp';
const TYPE_SLUGS = Object.keys(TYPE_LABEL) as BlogTypeSlug[];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogIds, blogTotalPages, worksData] = await Promise.all([
    getAllBlogIds(),
    getBlogTotalPages(),
    getWorksPageData(1),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/works/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog/`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/contact/`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const worksPages: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, worksData.totalPages - 1) },
    (_, i) => ({ url: `${BASE_URL}/works/page/${i + 2}/`, changeFrequency: 'weekly', priority: 0.6 })
  );

  const blogPages: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, blogTotalPages - 1) },
    (_, i) => ({ url: `${BASE_URL}/blog/page/${i + 2}/`, changeFrequency: 'daily', priority: 0.6 })
  );

  const blogTypePages: MetadataRoute.Sitemap = await Promise.all(
    TYPE_SLUGS.map(async (slug) => {
      const totalPages = await getBlogTotalPages(slug);
      const pages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/blog/type/${slug}/`, changeFrequency: 'daily', priority: 0.6 },
      ];
      for (let p = 2; p <= totalPages; p++) {
        pages.push({ url: `${BASE_URL}/blog/type/${slug}/page/${p}/`, changeFrequency: 'daily', priority: 0.5 });
      }
      return pages;
    })
  ).then((arrs) => arrs.flat());

  const blogDetailPages: MetadataRoute.Sitemap = blogIds.map((id) => ({
    url: `${BASE_URL}/blog/${id}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...worksPages, ...blogPages, ...blogTypePages, ...blogDetailPages];
}
