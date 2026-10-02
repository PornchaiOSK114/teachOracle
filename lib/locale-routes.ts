import { getArticleSlugs } from './content';
import { products } from './site';
import { localizedPath } from './i18n';

/** Only published counterparts become links. Server modules stay outside the client. */
export function getLanguagePairs(): Record<string, string> {
  const paths = ['/', '/articles', '/courses', '/about', '/products', '/contact', '/lab', '/download'];
  for (const product of products) paths.push('/products/' + product.slug, '/products/' + product.slug + '/thank-you');
  const english = new Set(getArticleSlugs('en'));
  paths.push(...getArticleSlugs('th').filter(slug => english.has(slug)).map(slug => '/articles/' + slug));
  const pairs: Record<string, string> = {};
  for (const path of paths) {
    const translated = localizedPath(path, 'en');
    pairs[path] = translated;
    pairs[translated] = path;
  }
  return pairs;
}
