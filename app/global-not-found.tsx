import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: '404 — Page not found | teeDBA',
  robots: { index: false, follow: false },
};

/** Standalone fallback for multiple root layouts. Both audiences can return home without JS. */
export default function GlobalNotFound() {
  return <html lang="en"><body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 700, margin: '12vh auto', padding: 24, lineHeight: 1.7 }}>
    <p>teeDBA · 404</p><h1>Page not found</h1><p>This address does not match a page on the website.</p>
    <p><Link href="/english">English home</Link> · <Link href="/english/articles">Browse articles</Link> · <Link href="/en">Book resources</Link></p>
    <section lang="th"><h2>ไม่พบหน้าที่คุณกำลังหา</h2><p>ลองตรวจที่อยู่เว็บ หรือกลับไปเริ่มจากหน้าแรกครับ</p><p><Link href="/">หน้าแรกภาษาไทย</Link> · <Link href="/articles">บทความ</Link> · <Link href="/lab">ชุดติดตั้งแล็บ</Link></p></section>
  </body></html>;
}
