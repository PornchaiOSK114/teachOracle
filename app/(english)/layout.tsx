import type { Metadata } from 'next';
import SiteLayout, { metadata as thaiMetadata } from '@/components/SiteLayout';
import { site, author } from '@/lib/site';
import { languageAlternates } from '@/lib/i18n';
export { viewport } from '@/components/SiteLayout';
const description = 'Practical Oracle Database articles, SQL tuning, courses and Thai-language eBooks by Pornchai Krongthammachart (Tee), Oracle Certified Professional.';
export const metadata: Metadata = {
 ...thaiMetadata,
 title: { default: 'teeDBA — Oracle with Tee', template: '%s | teeDBA' },
 description,
 authors: [{ name: author.nameEn, url: site.url + '/english/about' }],
 creator: author.nameEn,
 alternates: { ...languageAlternates('/english'), types: { 'application/rss+xml': [{ url: '/english/feed.xml', title: 'teeDBA in English' }] } },
 openGraph: { type: 'website', locale: 'en_US', alternateLocale: 'th_TH', siteName: 'teeDBA', url: site.url + '/english', title: 'teeDBA — Oracle with Tee', description, images: ['/english/opengraph-image'] },
 twitter: { card: 'summary_large_image', title: 'teeDBA — Oracle with Tee', description },
};
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
 return <SiteLayout locale="en">{children}</SiteLayout>;
}
