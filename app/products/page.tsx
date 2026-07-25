import type { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';
import JsonLd from '@/components/JsonLd';
import { upcomingProducts, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ผลิตภัณฑ์ความรู้',
  description:
    'E-book และ Online Course ด้าน Oracle Database จากอาจารย์ตี๋ กำลังจะเปิดตัวเร็ว ๆ นี้ ฝากอีเมลเพื่อรับข่าวก่อนใคร',
  alternates: { canonical: '/products' },
  openGraph: {
    title: `ผลิตภัณฑ์ความรู้ | ${site.name}`,
    description: 'E-book และ Online Course ด้าน Oracle Database กำลังจะมาเร็ว ๆ นี้',
    url: `${site.url}/products`,
    type: 'website',
  },
};

export default function ProductsPage() {
  return (
    <section className="container-narrow section" style={{ maxWidth: 900 }}>
      <div className="text-center" style={{ marginBottom: 44 }}>
        <span className="eyebrow">ผลิตภัณฑ์ความรู้</span>
        <h1 className="h1-page">กำลังจะมาเร็ว ๆ นี้</h1>
        <p
          className="muted"
          style={{ fontSize: 16.5, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}
        >
          ผมมีโครงการทำ E-book และ Online Course ด้าน Oracle Database
          ที่คุณเรียนรู้ได้ด้วยตัวเองทุกที่ทุกเวลา ฝากอีเมลไว้เพื่อเป็นคนแรกที่ได้รับข่าว
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
          gap: 18,
          marginBottom: 44,
        }}
      >
        {upcomingProducts.map((p) => (
          <div
            key={p.title}
            className="card"
            style={{ padding: 26, position: 'relative', overflow: 'hidden' }}
          >
            <span
              className="mono"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              SOON
            </span>
            <div style={{ fontSize: 32, marginBottom: 14 }} aria-hidden="true">
              {p.icon}
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>{p.title}</h2>
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
    </section>
  );
}
