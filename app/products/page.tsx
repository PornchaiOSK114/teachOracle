import type { Metadata } from 'next';
import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';
import JsonLd from '@/components/JsonLd';
import AssetImage from '@/components/AssetImage';
import { resolveAsset } from '@/lib/assets';
import { products, upcomingProducts, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ผลิตภัณฑ์ความรู้',
  description:
    'E-book และ Online Course ด้าน Oracle Database จากอาจารย์ตี๋ — เริ่มด้วย E-Book "Oracle 26ai SQL Tuning" 173 หน้า ภาษาไทย',
  alternates: { canonical: '/products' },
  openGraph: {
    title: `ผลิตภัณฑ์ความรู้ | ${site.name}`,
    description: 'E-book และ Online Course ด้าน Oracle Database ที่เรียนรู้ได้ด้วยตัวเอง',
    url: `${site.url}/products`,
    type: 'website',
  },
};

const priceFormatter = new Intl.NumberFormat('th-TH');

export default function ProductsPage() {
  /* หาไฟล์ปกจริงฝั่ง server (รองรับ .png / .jpg / .webp) — ไม่มีไฟล์ก็ไม่พัง ขึ้น placeholder แทน */
  const cards = products.map((p) => ({
    product: p,
    cover: resolveAsset(`${p.imageDir}/${p.coverFile}`) ?? `${p.imageDir}/${p.coverFile}.png`,
  }));

  return (
    <section className="container-narrow section" style={{ maxWidth: 940 }}>
      <div className="text-center" style={{ marginBottom: 44 }}>
        <span className="eyebrow">ผลิตภัณฑ์ความรู้</span>
        <h1 className="h1-page">ผลิตภัณฑ์ความรู้</h1>
        <p
          className="muted"
          style={{ fontSize: 16.5, lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}
        >
          E-book และ Online Course ด้าน Oracle Database ที่คุณเรียนรู้ได้ด้วยตัวเองทุกที่ทุกเวลา
        </p>
      </div>

      {cards.length > 0 && (
        <>
          <div className="zone-head">
            <span className="pill-live mono">พร้อมจำหน่าย</span>
            <h2>วางขายแล้ว</h2>
            <span className="zone-line" />
          </div>

          <div className="grid-products" style={{ marginBottom: 52 }}>
            {cards.map(({ product, cover }) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="card card-hover card-link product-card"
              >
                <div className="product-card-thumb">
                  <AssetImage
                    src={cover}
                    alt={`ปกหนังสือ ${product.title}`}
                    placeholder="ปกหนังสือ"
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
                      · {product.pages} หน้า
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
        <h2>กำลังจะมา</h2>
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
        <h2 style={{ fontSize: 'clamp(20px,3vw,26px)', margin: '0 0 10px' }}>รับข่าวสารก่อนใคร</h2>
        <p style={{ margin: '0 0 22px', fontSize: 15 }}>
          ไม่มีสแปม — ส่งเฉพาะเมื่อมีผลิตภัณฑ์ใหม่จริง ๆ
        </p>
        <NewsletterForm />
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: site.url },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'ผลิตภัณฑ์',
              item: `${site.url}/products`,
            },
          ],
        }}
      />

      {products.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'ผลิตภัณฑ์ความรู้ที่วางขายแล้ว',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.title,
              url: `${site.url}/products/${p.slug}`,
            })),
          }}
        />
      )}
    </section>
  );
}
