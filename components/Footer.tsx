import Link from 'next/link';
import { nav, site, author } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ flex: '1 1 320px', maxWidth: 420 }}>
          <strong style={{ fontSize: 17, display: 'block', marginBottom: 10 }}>{site.name}</strong>
          <p className="muted" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7 }}>
            แชร์ความรู้ Oracle Database เชิงลึก โดยอาจารย์ตี๋ ({author.name}) ผู้เชี่ยวชาญประสบการณ์
            มากกว่า 20 ปี
          </p>
        </div>

        <div>
          <strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>เมนู</strong>
          <div className="footer-nav">
            {nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>ติดตาม</strong>
          <div className="footer-nav">
            <a href={author.facebook} target="_blank" rel="noopener noreferrer">
              Facebook Page
            </a>
            <a href={`mailto:${author.email}`}>{author.email}</a>
            <Link href="/feed.xml">RSS Feed</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {author.name} · {site.name}
        </span>
        <span className="mono">Built for SEO · GEO · AIO</span>
      </div>
    </footer>
  );
}
