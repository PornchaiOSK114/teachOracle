import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content';
import { site, products } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const latest = articles[0]?.date ? new Date(articles[0].date) : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: latest, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${site.url}/articles`,
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    { url: `${site.url}/courses`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/products`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/contact`, changeFrequency: 'yearly', priority: 0.7 },
  ];

  /* หน้ารายละเอียดสินค้าแต่ละเล่ม — เพิ่มสินค้าใน lib/site.ts แล้ว sitemap อัปเดตเอง */
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/products/${p.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...articles.map((a) => ({
      url: `${site.url}/articles/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
