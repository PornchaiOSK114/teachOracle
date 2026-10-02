import { languageAlternates } from '@/lib/i18n';
import type { Metadata } from 'next';
import AssetImage from '@/components/AssetImage';
import JsonLd from '@/components/JsonLd';
import { author, expertise, timeline, books, customerLogoSlots, site } from '@/lib/site-en';

export const metadata: Metadata = {
  title: 'About Tee',
  description:
    'Pornchai Krongthammachart (Tee), Oracle Certified Professional, with more than 20 years of teaching and production database experience.',
  alternates: languageAlternates('/english/about'),
  openGraph: {
    locale: 'en_US', alternateLocale: 'th_TH',
    title: `About Tee | ${site.name}`,
    description: 'Oracle Certified Professional with more than 20 years of experience.',
    url: `${site.url}/english/about`,
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
              alt={`${author.name} (Tee)`}
              placeholder="Portrait of Tee"
              sizes="(max-width: 768px) 90vw, 280px"
              priority
            />
          </div>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 'min(100%,320px)' }}>
          <span className="eyebrow">About me</span>
          <h1 className="h1-page" style={{ lineHeight: 1.15 }}>
            {author.name}
            <br />
            <span style={{ color: 'var(--muted)', fontSize: '.6em', fontWeight: 500 }}>
              &ldquo;Tee&rdquo; — Oracle Database Expert
            </span>
          </h1>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.8, margin: '0 0 16px' }}>
            Oracle Database specialist and instructor for organizations, with{' '}
            <strong style={{ color: 'var(--text)' }}>More than 20 years</strong> of experience. Certification:{' '}
            <strong style={{ color: 'var(--text)' }}>{author.credential}</strong>
          </p>
          <p className="muted" style={{ fontSize: 17, lineHeight: 1.8, margin: '0 0 24px' }}>
            I believe useful knowledge should help with real work. Here I share lessons from working with production databases.
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
          Experience and expertise
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
        <h2 className="h2-sm">Books and columns</h2>
        <p className="muted" style={{ fontSize: 15, margin: '0 0 26px' }}>
          Sharing knowledge through published writing
        </p>
        <div className="grid-books">
          {books.map((b) => (
            <div key={b.title} className="card">
              <div className="book-cover">
                <AssetImage
                  src={b.image}
                  alt={`Cover: ${b.type} — ${b.title}`}
                  placeholder="Cover image"
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
          A selection of customers who have worked with me.
        </p>
        <div className="grid-logos">
          {customerLogoSlots.map((o, i) => (
            <div key={o.id} className="logo-slot">
              <AssetImage
                src={o.image}
                alt={`Customer logo ${i + 1}`}
                placeholder={`Logo ${i + 1}`}
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
            url: `${site.url}/english/about`,
            mainEntity: { '@id': `${site.url}/#person` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About Tee',
                item: `${site.url}/english/about`,
              },
            ],
          },
        ]}
      />
    </section>
  );
}
