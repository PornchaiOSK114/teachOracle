import { languageAlternates } from '@/lib/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import JsonLd from '@/components/JsonLd';
import { courses, site, author, trainingPartner } from '@/lib/site-en';

export const metadata: Metadata = {
  title: 'Oracle Database courses',
  description:
    'Six in-house Oracle courses: DBA, SQL & SQL*Plus, PL/SQL, SQL Performance Tuning, RMAN and Oracle Linux. Course language: Thai.',
  alternates: languageAlternates('/english/courses'),
  openGraph: {
    locale: 'en_US', alternateLocale: 'th_TH',
    title: `Oracle Database courses | ${site.name}`,
    description: 'In-house Oracle Database training tailored to your systems and practical problems. Course language: Thai.',
    url: `${site.url}/english/courses`,
    type: 'website',
  },
};

export default function CoursesPage() {
  return (
    <section className="container-narrow section-tight" style={{ maxWidth: 1100 }}>
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <span className="eyebrow">Available courses</span>
        <h1 className="h1-page">
          Oracle Database courses
          <br />
          For organizations and teams
        </h1>
        <p className="muted" style={{ fontSize: 16.5, lineHeight: 1.7, margin: 0 }}>
          In-house courses tailored to your systems and practical problems, with hands-on exercises based on production scenarios. Course language: Thai.
        </p>
      </div>

      <div className="grid-courses">
        {courses.map((c) => (
          <CourseCard key={c.code} course={c} locale="en" />
        ))}
      </div>

      <div className="panel-dark mt-8">
        <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', margin: '0 0 12px' }}>
          Interested in training for your team?
        </h2>
        <p style={{ margin: '0 auto 24px', fontSize: 15.5, maxWidth: 560, lineHeight: 1.7 }}>
          {trainingPartner.note} Contact {trainingPartner.name}, which coordinates my training.
        </p>
        <div className="flex-wrap" style={{ justifyContent: 'center' }}>
          <Link href="/english/contact" className="btn btn-primary">
            Contact details
          </Link>
          <a href={trainingPartner.phoneHref} className="btn btn-secondary">
            Call {trainingPartner.phone}
          </a>
        </div>
      </div>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Courses',
                item: `${site.url}/english/courses`,
              },
            ],
          },
          ...courses.map((c) => ({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: c.title,
            courseCode: c.code,
            description: c.desc,
            url: `${site.url}/english/courses`,
            inLanguage: 'th-TH',
            about: 'Oracle Database',
            teaches: c.tags,
            provider: {
              '@type': 'Person',
              '@id': `${site.url}/#person`,
              name: author.name,
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'onsite',
              courseWorkload: c.duration,
              inLanguage: 'th-TH',
            },
          })),
        ]}
      />
    </section>
  );
}
