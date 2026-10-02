import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';

const read = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const articleDir = 'content/articles';
const englishDir = 'content/en/articles';
const published = fs.readdirSync(articleDir).filter(f => /\.mdx?$/.test(f)).filter(f => !matter(read(path.join(articleDir, f))).data.draft);
const english = fs.readdirSync(englishDir).filter(f => /\.mdx?$/.test(f)).filter(f => !matter(read(path.join(englishDir, f))).data.draft);
const migrationArticles = ['week01-01-mon-identity-column.mdx', 'week01-02-tue-startup-shutdown.mdx', 'week01-03-wed-noarchivelog.mdx'];
for (const file of migrationArticles) assert.ok(published.includes(file) && english.includes(file), 'Migration pair required: ' + file);
const paired = published.filter(file => english.includes(file));
const englishPath = bare => bare === '/lab' ? '/en/lab' : '/english' + (bare === '/' ? '' : bare);
for (const file of paired) {
 const th = matter(read(path.join(articleDir, file)));
 const en = matter(read(path.join(englishDir, file)));
 for (const field of ['date','category','cover']) assert.equal(en.data[field], th.data[field], file + ': ' + field);
 assert.equal(en.data.translationOf, file.replace(/\.mdx?$/, ''));
 assert.equal(en.data.translationSourceSha256, createHash('sha256').update(read(path.join(articleDir, file))).digest('hex'), file + ': review the translation after Thai source changes');
 assert.deepEqual(en.content.match(/\x60{3}[\s\S]*?\x60{3}/g), th.content.match(/\x60{3}[\s\S]*?\x60{3}/g), file + ': code/output blocks must be unchanged');
 assert.ok(en.data.title && en.data.description && en.data.tldr);
 assert.ok(!/[\u0e01-\u0e4f]/.test(en.content.replace(/\x60{3}[\s\S]*?\x60{3}/g, '')), file + ': untranslated prose');
 assert.equal((en.content.match(/^## /gm) || []).length, (th.content.match(/^## /gm) || []).length, file + ': preserve all sections');
 if (en.data.cover) assert.ok(fs.existsSync(path.join('public', en.data.cover)), file + ': cover exists');
}
console.log('PASS content: ' + paired.length + ' article pairs; same code/output, sections, dates, categories and covers.');

if (!process.env.BILINGUAL_BASE_URL) {
 console.log('Set BILINGUAL_BASE_URL=http://localhost:3107 to run read-only HTTP checks against a production build.');
 process.exit(0);
}
const base = new URL(process.env.BILINGUAL_BASE_URL);
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname), 'Tests must target localhost, never production.');
const get = async route => { const response = await fetch(new URL(route, base)); return { status: response.status, text: await response.text() }; };
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const paths = ['/', '/articles', '/about', '/courses', '/products', '/contact', '/lab', '/products/oracle-26-ai-sql-tuning', ...published.map(f => '/articles/' + f.replace(/\.mdx?$/, ''))];
const available = (bare, locale) => !bare.startsWith('/articles/') || (locale === 'th' ? published : english).some(file => bare === '/articles/' + file.replace(/\.mdx?$/, ''));
for (const file of english.filter(file => !published.includes(file))) paths.push('/articles/' + file.replace(/\.mdx?$/, ''));
let checked = 0;
for (const bare of paths) for (const locale of ['th','en']) {
 if (!available(bare, locale)) continue;
 const route = locale === 'en' ? englishPath(bare) : bare;
 const { status, text } = await get(route);
 assert.equal(status, 200, route);
 assert.ok(text.includes('<html lang="' + locale + '"'), route + ': server-rendered language');
 const links = [...text.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0]));
 const canonical = links.filter(l => l.rel === 'canonical');
 assert.equal(canonical.length, 1, route + ': exactly one canonical');
 assert.equal(new URL(canonical[0].href).href, new URL('https://teedba.com' + route).href, route + ': canonical');
 for (const lang of ['th','en']) {
  if (!available(bare, lang)) {
   assert.ok(!links.some(l => l.rel === 'alternate' && (l.hrefLang === lang || l.hreflang === lang)), route + ': no nonexistent translation');
   continue;
  }
  const href = 'https://teedba.com' + (lang === 'en' ? englishPath(bare) : bare);
  assert.ok(links.some(l => l.rel === 'alternate' && (l.hrefLang === lang || l.hreflang === lang) && new URL(l.href).href === new URL(href).href), route + ': ' + lang + ' alternate');
 }
 const jsonLd = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1])).flat();
 assert.ok(jsonLd.some(x => x['@type'] === 'WebSite'), route + ': WebSite schema');
 if (bare.startsWith('/articles/')) assert.ok(jsonLd.some(x => x['@type'] === 'BlogPosting' && x.inLanguage === (locale === 'en' ? 'en' : 'th-TH')), route + ': article language');
 if (locale === 'en') {
  const main = text.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  const prose = main.replace(/<pre\b[\s\S]*?<\/pre>/g,'').replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,'');
  assert.ok(!/[\u0e01-\u0e3a\u0e40-\u0e4f]/.test(prose), route + ': English main content (Thai baht symbol is allowed)');
 }
 checked++;
}
for (const route of ['/download','/english/download','/products/oracle-26-ai-sql-tuning/thank-you','/english/products/oracle-26-ai-sql-tuning/thank-you']) {
 const result = await get(route); assert.equal(result.status,200,route);
 assert.match(result.text, /name="robots" content="noindex, nofollow"/, route + ': private flow stays noindex');
}
for (const route of ['/english/articles/not-a-real-article','/english/products/not-a-product','/articles/_example-thai-charset','/english/articles/ora-01555-snapshot-too-old']) assert.equal((await get(route)).status,404,route);
for (const locale of ['th','en']) {
 const feed = await get(locale === 'th' ? '/feed.xml' : '/english/feed.xml');
 assert.equal(feed.status,200); assert.equal((feed.text.match(/<item>/g)||[]).length,locale === 'th' ? published.length : english.length);
 assert.ok(feed.text.includes('<language>' + locale + '</language>'));
 assert.ok(!feed.text.includes('_example') && !feed.text.includes('ora-01555'));
}
const sitemap = await get('/sitemap.xml');
assert.equal((sitemap.text.match(/<url>/g)||[]).length,checked + 1);
assert.ok(!sitemap.text.includes('/download') && !sitemap.text.includes('thank-you'));
const legacy = await get('/en');
assert.equal(legacy.status, 200); assert.match(legacy.text, /Errata/); assert.ok(legacy.text.includes('href="/en/lab"'));
for (const route of ['/english/missing-test', '/missing-test', '/en/missing-test', '/english/admin/stamp']) {
 const result = await get(route);
 assert.equal(result.status, 404, route);
 assert.match(result.text, /<html lang="en"/, route + ': global fallback language');
 assert.ok(result.text.includes('lang="th"'), route + ': Thai fallback available');
 assert.ok(!result.text.includes('http://localhost'), route + ': no localhost metadata');
 assert.match(result.text, /name="robots" content="noindex/, route + ': noindex');
}
const product = await get('/english/products/oracle-26-ai-sql-tuning');
assert.ok(product.text.includes('Language: Thai'));
assert.ok(product.text.includes('An English edition is not currently available'));
const llms = await get('/english/llms.txt');
assert.equal(llms.status,200); assert.ok(llms.text.includes('Language: Thai'));
const og = await fetch(new URL('/english/opengraph-image', base));
assert.equal(og.status,200); assert.match(og.headers.get('content-type'), /image\/png/);
console.log('PASS HTTP: ' + checked + ' paired public pages, preserved /en, reciprocal hreflang, self canonicals, language/schema, 4 noindex flows, 8 negative routes, feeds, sitemap, English OG and Thai product disclosure.');
