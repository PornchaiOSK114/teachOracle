import { languageAlternates } from '@/lib/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';
import JsonLd from '@/components/JsonLd';
import AssetImage from '@/components/AssetImage';
import { resolveAsset } from '@/lib/assets';
import { products, upcomingProducts, site } from '@/lib/site-en';

export const metadata: Metadata = {
  title: 'Learning resources',
  description:
    'Oracle Database learning resources from Tee, starting with the 173-page Thai-language eBook Oracle 26ai SQL Tuning.',
  alternates: languageAlternates('/english/products'),
  openGraph: {
    locale: 'en_US', alternateLocale: 'th_TH',
    title: `Learning resources | ${site.name}`,
    description: 'Self-paced Oracle Database learning resources in Thai.',
    url: `${site.url}/english/products`,
    type: 'website',
  },
};

const priceFormatter = new Intl.NumberFormat('en-GB');

export default function ProductsPage() {
  /* หาไฟล์ปกจริงฝั่ง server (รองรับ .png / .jpg / .webp) — ไม่มีไฟล์ก็ไม่พัง ขึ้น placeholder แทน */
  const cards = products.map((p) => ({
    product: p,
    cover: resolveAsset(`${p.imageDir}/${p.coverFile}`) ?? `${p.imageDir}/${p.coverFile}.png`,
  }));

  return (
    <section className="container-narrow section" style={{ maxWidth: 940 }}>
      <div className="text-center" style={{ marginBottom: 44 }}>
        <span className="eyebrow">Learning resources</span>
        <h1 className="h1-page">Learning resources</h1>
        <p
          className="muted"
          style={{ fontSize: 16.5, lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}
        >
          Oracle Database learning resources for studying at your own pace. Language: Thai. An English edition of the eBook is not currently available.
        </p>
      </div>

      {cards.length > 0 && (
        <>
          <div className="zone-head">
            <span className="pill-live mono">AVAILABLE</span>
            <h2>Available now</h2>
            <span className="zone-line" />
          </div>

          <div className="grid-products" style={{ marginBottom: 52 }}>
            {cards.map(({ product, cover }) => (
              <Link
                key={product.slug}
                href={`/english/products/${product.slug}`}
                className="card card-hover card-link product-card"
              >
                <div className="product-card-thumb">
                  <AssetImage
                    src={cover}
                    alt={`Book cover ${product.title}`}
                    placeholder="Book cover"
                    sizes="120px"
                  />
                </div>
                <div className="product-card-body">
                  <span className="tag-mono" style={{ alignSelf: 'flex-start' }}>
                    {product.kindShort}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.35 }}>{product.title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                    {product.cardDesc}
                  </p>
                  <div className="product-card-price">
                    <span className="price mono">฿{priceFormatter.format(product.price)}</span>
                    <span className="muted" style={{ fontSize: 13 }}>
                      · {product.pages} pages · Language: Thai
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="zone-head">
        <span className="pill-soon mono">SOON</span>
        <h2>Coming next</h2>
        <span className="zone-line" />
      </div>

      <div className="grid-mini" style={{ marginBottom: 48 }}>
        {upcomingProducts.map((p) => (
          <div key={p.title} className="card" style={{ padding: 26, position: 'relative' }}>
            <span className="pill-soon mono" style={{ position: 'absolute', top: 14, right: 14 }}>
              SOON
            </span>
            <div style={{ fontSize: 32, marginBottom: 14 }} aria-hidden="true">
              {p.icon}
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700 }}>{p.title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="panel-dark" style={{ borderRadius: 20 }}>
        <h2 style={{ fontSize: 'clamp(20px,3vw,26px)', margin: '0 0 10px' }}>Stay informed</h2>
        <p style={{ margin: '0 0 22px', fontSize: 15 }}>
          Updates when new products are available. No spam.
        </p>
        <NewsletterForm locale="en" />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Products',
              item: `${site.url}/english/products`,
            },
          ],
        }}
      />

      {products.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Available learning resources',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.title,
              url: `${site.url}/english/products/${p.slug}`,
            })),
          }}
        />
      )}
    </section>
  );
}
