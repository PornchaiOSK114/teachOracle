import { getAllArticles } from '@/lib/content';
import { site, author } from '@/lib/site';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = getAllArticles();
  const updated = articles[0]?.date ?? new Date().toISOString().slice(0, 10);

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${site.url}/articles/${a.slug}</link>
      <guid isPermaLink="true">${site.url}/articles/${a.slug}</guid>
      <description>${escapeXml(a.description)}</description>
      <category>${escapeXml(a.category)}</category>
      <dc:creator>${escapeXml(author.name)}</dc:creator>
      <pubDate>${new Date(`${a.date}T00:00:00+07:00`).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>th</language>
    <lastBuildDate>${new Date(`${updated}T00:00:00+07:00`).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
