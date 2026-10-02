import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Article, ArticleMeta } from './types';
import { slugifyHeading } from './format';

export type { Article, ArticleMeta };
export { formatDateThai, slugifyHeading } from './format';

import type { Locale } from './i18n';
const articlesDir = (locale: Locale) => path.join(process.cwd(), 'content', ...(locale === 'en' ? ['en'] : []), 'articles');


const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function readArticleFile(fileName: string, locale: Locale = 'th'): Article {
  const slug = fileName.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(articlesDir(locale), fileName), 'utf8');
  const { data, content } = matter(raw);

  const date = String(data.date ?? '');
  if (!DATE_RE.test(date)) {
    throw new Error(
      `[content] "${fileName}" ต้องมี frontmatter "date" รูปแบบ YYYY-MM-DD (ได้รับ: "${date}")`,
    );
  }
  if (!data.title) throw new Error(`[content] "${fileName}" ขาด frontmatter "title"`);

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ''),
    tldr: String(data.tldr ?? data.description ?? ''),
    category: String(data.category ?? 'DBA'),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    date,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    cover: data.cover ? String(data.cover) : undefined,
    draft: data.draft === true,
    content,
  };
}

function listFiles(locale: Locale = 'th'): string[] {
  const ARTICLES_DIR = articlesDir(locale);
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR).filter((f) => /\.mdx?$/.test(f));
}

/** draft จะซ่อนตอน production แต่เห็นตอน `npm run dev` */
function isVisible(a: Article): boolean {
  return !a.draft || process.env.NODE_ENV === 'development';
}

export function getAllArticles(locale: Locale = 'th'): ArticleMeta[] {
  return listFiles(locale)
    .map((file) => readArticleFile(file, locale))
    .filter(isVisible)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content, ...meta }) => { void content; return meta; });
}

export function getArticleSlugs(locale: Locale = 'th'): string[] {
  return listFiles(locale)
    .map((file) => readArticleFile(file, locale))
    .filter(isVisible)
    .map((a) => a.slug);
}

export function getArticle(slug: string, locale: Locale = 'th'): Article | null {
  const file = listFiles(locale).find((f) => f.replace(/\.mdx?$/, '') === slug);
  if (!file) return null;
  const article = readArticleFile(file, locale);
  return isVisible(article) ? article : null;
}

/** บทความที่เกี่ยวข้อง — จัดอันดับจากจำนวนแท็กที่ตรงกัน แล้วต่อด้วยหมวดเดียวกัน */
export function getRelatedArticles(current: ArticleMeta, limit = 3, locale: Locale = 'th'): ArticleMeta[] {
  return getAllArticles(locale)
    .filter((a) => a.slug !== current.slug)
    .map((a) => ({
      article: a,
      score:
        a.tags.filter((t) => current.tags.includes(t)).length * 2 +
        (a.category === current.category ? 1 : 0),
    }))
    .sort((x, y) => y.score - x.score || (x.article.date < y.article.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.article);
}


/** ดึงหัวข้อ H2 จาก markdown เพื่อทำสารบัญ (TOC) — slug ต้องตรงกับ rehype-slug */
export function extractHeadings(markdown: string): { id: string; text: string }[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '');
  const out: { id: string; text: string }[] = [];
  for (const line of withoutCode.split('\n')) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[1].replace(/[*_`]/g, '').trim();
    out.push({ id: slugifyHeading(text), text });
  }
  return out;
}


export function getAllCategoriesInUse(locale: Locale = 'th'): string[] {
  return [...new Set(getAllArticles(locale).map((a) => a.category))];
}
