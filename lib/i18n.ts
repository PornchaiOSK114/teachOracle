import type { Metadata } from 'next';

export type Locale = 'th' | 'en';
export const ENGLISH_PREFIX = '/english';
export function localizedPath(path: string, locale: Locale): string {
  if (path === '/en/lab' || path === '/lab') return locale === 'en' ? '/en/lab' : '/lab';
  if (path === '/en') return path; // Permanent book URL, not the website prefix.
  const bare = path.replace(/^\/english(?=\/|$)/, '') || '/';
  return locale === 'en' ? `${ENGLISH_PREFIX}${bare === '/' ? '' : bare}` : bare;
}
export function languageAlternates(path: string, locales: Locale[] = ['th', 'en']): Metadata['alternates'] {
  const locale = path === '/en' || path.startsWith('/en/') || path === ENGLISH_PREFIX || path.startsWith(ENGLISH_PREFIX + '/') ? 'en' : 'th';
  const languages: Record<string, string> = Object.fromEntries(locales.map(lang => [lang, localizedPath(path, lang)]));
  if (locales.includes('th')) languages['x-default'] = localizedPath(path, 'th');
  return { canonical: path, languages, types: { 'application/rss+xml': [{ url: localizedPath('/feed.xml', locale), title: locale === 'en' ? 'teeDBA in English' : 'teeDBA ภาษาไทย' }] } };
}
export function dateLabel(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'th-TH', { dateStyle: 'medium', timeZone: 'Asia/Bangkok' }).format(new Date(`${iso}T00:00:00+07:00`));
}
