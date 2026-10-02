import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content';
import { site, products } from '@/lib/site';
import { localizedPath } from '@/lib/i18n';
export default function sitemap(): MetadataRoute.Sitemap {
 const entries: MetadataRoute.Sitemap = [];
 const paths = ['/', '/articles', '/courses', '/about', '/products', '/contact', '/lab', ...products.map(p => '/products/' + p.slug)];
 const addPair = (path: string, date?: string) => {
  const languages = { th: site.url + localizedPath(path, 'th'), en: site.url + localizedPath(path, 'en'), 'x-default': site.url + localizedPath(path, 'th') };
  for (const locale of ['th', 'en'] as const) entries.push({ url: languages[locale], alternates: { languages }, ...(date ? { lastModified: new Date(date) } : {}), changeFrequency: 'weekly', priority: path === '/' ? 1 : 0.8 });
 };
 paths.forEach(path => addPair(path));
 const english = new Set(getAllArticles('en').map(a => a.slug));
 for (const article of getAllArticles('th')) {
  if (english.has(article.slug)) addPair('/articles/' + article.slug, article.date);
  else entries.push({ url: site.url + '/articles/' + article.slug, lastModified: new Date(article.date) });
 }
 const thai = new Set(getAllArticles('th').map(a => a.slug));
 for (const article of getAllArticles('en')) if (!thai.has(article.slug)) entries.push({ url: site.url + '/english/articles/' + article.slug, lastModified: new Date(article.date) });
 entries.push({ url: site.url + '/en', changeFrequency: 'monthly', priority: 0.5 });
 return entries;
}
