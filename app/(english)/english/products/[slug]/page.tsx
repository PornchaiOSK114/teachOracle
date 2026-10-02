import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OracleBookLandingEn from '@/components/OracleBookLandingEn';
import { products, getProduct, site } from '@/lib/site-en';
import { resolveAsset } from '@/lib/assets';
import { languageAlternates } from '@/lib/i18n';
import type { CarouselSlide } from '@/components/SampleCarousel';
export const revalidate = 900;
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { slug } = await params; const product = getProduct(slug);
 if (!product) return { title: 'Product not found', robots: { index: false, follow: false }, alternates: { canonical: null, languages: {} } };
 const cover = resolveAsset(product.imageDir + '/' + product.coverFile);
 return { title: product.title, description: product.metaDesc,
 alternates: languageAlternates('/english/products/' + slug),
 openGraph: { type: 'website', locale: 'en_US', alternateLocale: 'th_TH', url: site.url + '/english/products/' + slug, title: product.title, description: product.metaDesc, ...(cover ? { images: [{ url: cover, alt: product.title + ' — Thai eBook' }] } : {}) },
 twitter: { card: 'summary_large_image', title: product.title, description: product.metaDesc, ...(cover ? { images: [cover] } : {}) } };
}
export default async function ProductPage({ params }: Props) {
 const { slug } = await params; const product = getProduct(slug);
 if (!product) notFound();
 const cover = resolveAsset(product.imageDir + '/' + product.coverFile) ?? product.imageDir + '/' + product.coverFile + '.png';
 const slides = product.samples.map(s => { const src = resolveAsset(product.imageDir + '/' + s.file); return src ? { src, alt: s.alt, group: s.group } : null; }).filter((s): s is CarouselSlide => s !== null);
 return <OracleBookLandingEn product={product} cover={cover} slides={slides} />;
}
