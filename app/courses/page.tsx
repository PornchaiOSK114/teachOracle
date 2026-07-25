import type { Metadata } from 'next';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import JsonLd from '@/components/JsonLd';
import { courses, site, author, trainingPartner } from '@/lib/site';

export const metadata: Metadata = {
  title: 'หลักสูตร Oracle Database ที่เปิดสอน',
  description:
    'หลักสูตรอบรม Oracle Database แบบ In-house 6 หลักสูตร — Oracle DBA, SQL & SQL*Plus, PL/SQL Programming, SQL Performance Tuning, RMAN Backup & Recovery และ Oracle Linux for DBA',
  alternates: { canonical: '/courses' },
  openGraph: {
    title: `หลักสูตร Oracle Database ที่เปิดสอน | ${site.name}`,
    description: 'อบรม Oracle Database แบบ In-house ปรับเนื้อหาให้ตรงกับระบบและปัญหาจริงของทีมคุณ',
    url: `${site.url}/courses`,
    type: 'website',
  },
};

export default function CoursesPage() {
  return (
    <section className="container-narrow section-tight" style={{ maxWidth: 1100 }}>
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <span className="eyebrow">หลักสูตรที่เปิดสอน</span>
        <h1 className="h1-page">
          คอร์ส Oracle Database
          <br />
          สำหรับองค์กรและทีมงาน
        </h1>
        <p className="muted" style={{ fontSize: 16.5, lineHeight: 1.7, margin: 0 }}>
          ทุกหลักสูตรสอนแบบ In-house ปรับเนื้อหาให้ตรงกับระบบและปัญหาจริงของทีมคุณ เน้นลงมือทำ
          (hands-on) บนสถานการณ์จำลองจาก Production
        </p>
      </div>

      <div className="grid-courses">
        {courses.map((c) => (
          <CourseCard key={c.code} course={c} />
        ))}
      </div>

      <div className="panel-dark mt-8">
        <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', margin: '0 0 12px' }}>
          สนใจจัดอบรมให้ทีมของคุณ?
        </h2>
        <p style={{ margin: '0 auto 24px', fontSize: 15.5, maxWidth: 560, lineHeight: 1.7 }}>
          {trainingPartner.note} ติดต่อ {trainingPartner.name} ซึ่งดูแลเรื่องงานอบรมให้อาจารย์ตี๋
        </p>
        <div className="flex-wrap" style={{ justifyContent: 'center' }}>
          <Link href="/contact" className="btn btn-primary">
            ดูช่องทางติดต่อ
          </Link>
          <a href={trainingPartner.phoneHref} className="btn btn-secondary">
            โทร {trainingPartner.phone}
          </a>
        </div>
      </div>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: site.url },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'หลักสูตรที่สอน',
                item: `${site.url}/courses`,
              },
            ],
          },
          ...courses.map((c) => ({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: c.title,
            courseCode: c.code,
            description: c.desc,
            url: `${site.url}/courses`,
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
