import { languageAlternates } from '@/lib/i18n';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { author, trainingPartner, site } from '@/lib/site-en';

export const metadata: Metadata = {
  title: 'Contact Tee',
  description:
    'Contact Tee about Oracle Database courses, public training dates, quotations and in-house training.',
  alternates: languageAlternates('/english/contact'),
  openGraph: {
    locale: 'en_US', alternateLocale: 'th_TH',
    title: `Contact Tee | ${site.name}`,
    description: 'Ask about courses, quotations and in-house training for your team.',
    url: `${site.url}/english/contact`,
    type: 'website',
  },
};

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <section className="container-narrow section-tight">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px,5vw,56px)' }}>
        {/* ---------- Contact Teeโดยตรง ---------- */}
        <div style={{ flex: '1 1 320px', minWidth: 'min(100%,300px)' }}>
          <span className="eyebrow">Contact</span>
          <h1 className="h1-page">Let’s talk</h1>
          <p className="muted" style={{ fontSize: 16.5, lineHeight: 1.7, margin: '0 0 30px' }}>
            Have an Oracle Database question? Get in touch.
          </p>

          <div className="stack" style={{ gap: 14 }}>
            <a
              href={author.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <span className="contact-icon" style={{ background: '#1877f2' }} aria-hidden="true">
                f
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="contact-label">Facebook Page</span>
                <span className="contact-value">{author.facebookLabel}</span>
              </span>
            </a>

            <a href={`mailto:${author.email}`} className="contact-item">
              <span className="contact-icon" style={{ background: 'var(--accent)' }}>
                <MailIcon />
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="contact-label">Email</span>
                <span className="contact-value">{author.email}</span>
              </span>
            </a>
          </div>
        </div>

        {/* ---------- Contactผ่านผู้ดูแลงานอบรม ---------- */}
        <div style={{ flex: '1 1 320px', minWidth: 'min(100%,300px)' }}>
          <h2 className="h2-sm" style={{ marginTop: 8 }}>
            Courses · Quotations · In-house training
          </h2>
          <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.75, margin: '0 0 24px' }}>
            {trainingPartner.note} Contact {trainingPartner.name}, which coordinates my training.
          </p>

          <div className="stack" style={{ gap: 14 }}>
            <a href={`mailto:${trainingPartner.email}`} className="contact-item">
              <span className="contact-icon" style={{ background: 'var(--accent)' }}>
                <MailIcon />
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="contact-label">Email TTC</span>
                <span className="contact-value">{trainingPartner.email}</span>
              </span>
            </a>

            <a href={trainingPartner.phoneHref} className="contact-item">
              <span className="contact-icon" style={{ background: 'var(--accent)' }}>
                <PhoneIcon />
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="contact-label">Call TTC</span>
                <span className="contact-value">{trainingPartner.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: `${site.url}/english/contact`,
            mainEntity: { '@id': `${site.url}/#person` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: `${site.url}/english/contact` },
            ],
          },
        ]}
      />
    </section>
  );
}
