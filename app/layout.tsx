import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Analytics from '@/components/Analytics';
import { site, author } from '@/lib/site';
import './globals.css';

/* ฟอนต์ต้องโหลดผ่าน next/font — ถ้าใช้ @import ใน CSS จะ render-blocking
   และต้องมี subset 'thai' ไม่งั้นภาษาไทยจะกลายเป็นฟอนต์ระบบสุ่มตามเครื่องผู้อ่าน */
const sans = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Oracle Database',
    'Oracle DBA',
    'SQL Tuning',
    'PL/SQL',
    'RMAN',
    'Oracle RAC',
    'Oracle Linux',
    'สอน Oracle',
    'อบรม Oracle Database',
    'อาจารย์ตี๋',
  ],
  authors: [{ name: author.name, url: site.url + '/about' }],
  creator: author.name,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: site.name }] },
  },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b0271a' },
    { media: '(prefers-color-scheme: dark)', color: '#8f1e12' },
  ],
};

/* อ่านธีมและ set attribute ให้เสร็จ "ก่อน paint" เพื่อกันหน้าจอกระพริบ (FOUC) */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} data-theme="light" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          ข้ามไปเนื้อหาหลัก
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${site.url}/#website`,
              url: site.url,
              name: site.name,
              description: site.description,
              inLanguage: 'th-TH',
              publisher: { '@id': `${site.url}/#person` },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': `${site.url}/#person`,
              name: author.name,
              alternateName: author.nickname,
              url: `${site.url}/about`,
              email: author.email,
              jobTitle: author.jobTitle,
              knowsAbout: [
                'Oracle Database',
                'Oracle DBA',
                'SQL Performance Tuning',
                'PL/SQL',
                'RMAN Backup and Recovery',
                'Oracle RAC',
                'Oracle Linux',
              ],
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'certification',
                name: author.credential,
              },
              sameAs: [author.facebook],
            },
          ]}
        />
      </body>
    </html>
  );
}
