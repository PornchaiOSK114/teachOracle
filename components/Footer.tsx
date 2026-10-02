import Link from 'next/link';
import { nav as thaiNav, site, author } from '@/lib/site';

import { localizedPath, type Locale } from '@/lib/i18n';
export default function Footer({ locale = 'th' }: { locale?: Locale }) {
 const en = locale === 'en';
 const labels = ['Home', 'Articles', 'Courses', 'About Tee', 'Products', 'Contact'];
 const nav = thaiNav.map((item, i) => ({ href: localizedPath(item.href, locale), label: en ? labels[i] : item.label }));
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ flex: '1 1 320px', maxWidth: 420 }}>
          <strong style={{ fontSize: 17, display: 'block', marginBottom: 10 }}>{en ? 'teeDBA — Oracle with Tee' : site.name}</strong>
          <p className="muted" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7 }}>
            {en ? 'Practical Oracle Database knowledge with Tee — more than 20 years of experience.' : `แชร์ความรู้ Oracle Database เชิงลึก โดยอาจารย์ตี๋ (${author.name}) ผู้เชี่ยวชาญประสบการณ์มากกว่า 20 ปี`}
          </p>
        </div>

        <div>
          <strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>{en ? 'Explore' : 'เมนู'}</strong>
          <div className="footer-nav">
            {en && <Link href="/en">Book resources and corrections</Link>}
            {nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>{en ? 'Follow' : 'ติดตาม'}</strong>
          <div className="footer-nav">
            <a href={author.facebook} target="_blank" rel="noopener noreferrer">
              Facebook Page
            </a>
            <a href={`mailto:${author.email}`}>{author.email}</a>
            <Link href={localizedPath('/feed.xml', locale)}>RSS Feed</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {en ? author.nameEn : author.name} · {en ? 'teeDBA — Oracle with Tee' : site.name}
        </span>
        <span className="mono">Built for SEO · GEO · AIO</span>
      </div>
    </footer>
  );
}
