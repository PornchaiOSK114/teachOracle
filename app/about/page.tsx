import type { Metadata } from 'next';
import AssetImage from '@/components/AssetImage';
import JsonLd from '@/components/JsonLd';
import { author, expertise, timeline, books, customerLogoSlots, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'เกี่ยวกับอาจารย์ตี๋',
  description:
    'พรชัย ครองธรรมชาติ ("อาจารย์ตี๋") ผู้เชี่ยวชาญ Oracle Database ระดับ Oracle Certified Professional (OCP) ประสบการณ์สอนและดูแลระบบฐานข้อมูลระดับ Production มากกว่า 20 ปี',
  alternates: { canonical: '/about' },
  openGraph: {
    title: `เกี่ยวกับอาจารย์ตี๋ | ${site.name}`,
    description: 'ผู้เชี่ยวชาญ Oracle Database ระดับ OCP ประสบการณ์มากกว่า 20 ปี',
    url: `${site.url}/about`,
    type: 'profile',
  },
};

export default function AboutPage() {
  return (
    <section className="container-narrow section-tight">
      {/* ---------- โปรไฟล์ ---------- */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(28px,5vw,52px)',
          alignItems: 'flex-start',
          marginBottom: 56,
        }}
      >
        <div style={{ flex: '0 1 280px', minWidth: 'min(100%,240px)' }}>
          <div className="about-photo">
            <AssetImage
              src="/images/profile.jpg"
              alt={`${author.name} (อาจารย์ตี๋)`}
              placeholder="รูปอาจารย์ตี๋"
              sizes="(max-width: 768px) 90vw, 280px"
              priority
            />
          </div>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 'min(100%,320px)' }}>
          <span className="eyebrow">เกี่ยวกับฉัน</span>
          <h1 className="h1-page" style={{ lineHeight: 1.15 }}>
            {author.name}
            <br />
            <span style={{ color: 'var(--muted)', fontSize: '.6em', fontWeight: 500 }}>
              &ldquo;อาจารย์ตี๋&rdquo; — Oracle Database Expert
            </span>
          </h1>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.8, margin: '0 0 16px' }}>
            ผู้เชี่ยวชาญและอาจารย์สอน Oracle Database ให้กับองค์กรต่าง ๆ ด้วยประสบการณ์{' '}
            <strong style={{ color: 'var(--text)' }}>มากกว่า 20 ปี</strong> ในระดับ{' '}
            <strong style={{ color: 'var(--text)' }}>{author.credential}</strong>
          </p>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.8, margin: '0 0 24px' }}>
            อาจารย์เชื่อว่าความรู้ที่ดีต้องนำไปใช้กับงานจริงได้
            จึงตั้งใจแชร์ประสบการณ์ตรงจากการดูแลระบบฐานข้อมูลระดับ Production ให้กับทุกคนที่สนใจ
          </p>
          <div className="flex-wrap" style={{ gap: 10 }}>
            {expertise.map((ex) => (
              <span key={ex} className="chip chip-surface" style={{ padding: '7px 15px', fontSize: 14 }}>
                {ex}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Timeline ---------- */}
      <div className="mb-14">
        <h2 className="h2-sm" style={{ marginBottom: 26 }}>
          เส้นทางและความเชี่ยวชาญ
        </h2>
        <div className="stack">
          {timeline.map((t, i) => (
            <div key={t.title} className="timeline-item">
              <div className="timeline-rail" aria-hidden="true">
                <span className="timeline-dot" />
                {i < timeline.length - 1 && <span className="timeline-line" />}
              </div>
              <div style={{ paddingBottom: 28 }}>
                <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 5 }}>{t.title}</div>
                <div className="muted" style={{ fontSize: 15, lineHeight: 1.6 }}>
                  {t.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- ผลงานเขียน ---------- */}
      <div>
        <h2 className="h2-sm">ผลงานหนังสือและคอลัมน์</h2>
        <p className="muted" style={{ fontSize: 15, margin: '0 0 26px' }}>
          ประสบการณ์การเขียนเผยแพร่ความรู้สู่สาธารณะ
        </p>
        <div className="grid-books">
          {books.map((b) => (
            <div key={b.title} className="card">
              <div className="book-cover">
                <AssetImage
                  src={b.image}
                  alt={`ปก${b.type} — ${b.title}`}
                  placeholder="รอรูปปก"
                  sizes="(max-width: 768px) 45vw, 220px"
                />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <span className="eyebrow" style={{ fontSize: 11.5 }}>
                  {b.type}
                </span>
                <div style={{ fontWeight: 600, fontSize: 15.5, lineHeight: 1.4, marginTop: 6 }}>
                  {b.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- ลูกค้า ---------- */}
      <div style={{ marginTop: 56 }}>
        <h2 className="h2-sm">Customers</h2>
        <p className="muted" style={{ fontSize: 15, margin: '0 0 26px' }}>
          บางส่วนของลูกค้าที่ไว้วางใจใช้บริการจากอาจารย์ตี๋ (ขออภัยที่ลงให้ไม่หมด
          พื้นที่เว็บมีจำกัด)
        </p>
        <div className="grid-logos">
          {customerLogoSlots.map((o, i) => (
            <div key={o.id} className="logo-slot">
              <AssetImage
                src={o.image}
                alt={`โลโก้ลูกค้าลำดับที่ ${i + 1}`}
                placeholder={`โลโก้ ${i + 1}`}
                fit="contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            url: `${site.url}/about`,
            mainEntity: { '@id': `${site.url}/#person` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: site.url },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'เกี่ยวกับอาจารย์ตี๋',
                item: `${site.url}/about`,
              },
            ],
          },
        ]}
      />
    </section>
  );
}
