import type { Metadata } from 'next';
import { dateLabel, languageAlternates, localizedPath, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import ArticleCard from '@/components/ArticleCard';
import JsonLd from '@/components/JsonLd';
import { mdxComponents } from '@/components/mdx';
import {
  getArticle,
  getRelatedArticles,
  extractHeadings,
} from '@/lib/content';
import { site, author } from '@/lib/site';

// Next 16: params เป็น Promise ใน dynamic route ต้อง await ก่อนใช้
type Props = { params: Promise<{ slug: string }>; locale: Locale };


export async function articleMetadata({ params, locale }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug, locale);
  if (!article) return { title: locale === 'en' ? 'Article not found' : 'ไม่พบบทความ', robots: { index: false, follow: false }, alternates: { canonical: null, languages: {} } };

  const url = `${site.url}${localizedPath(`/articles/${article.slug}`, locale)}`;
  return {
    title: article.title,
    description: article.description,
  alternates: languageAlternates(localizedPath(`/articles/${article.slug}`, locale), (['th', 'en'] as const).filter(lang => getArticle(slug, lang))),
    openGraph: {
      type: 'article',
      locale: locale === 'en' ? 'en_US' : 'th_TH',
      url,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: [(locale === 'en' ? author.nameEn : author.name)],
      tags: article.tags,
      images: article.cover ? [{ url: article.cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params, locale }: Props) {
  const { slug } = await params;
  const article = getArticle(slug, locale);
  if (!article) notFound();

  const related = getRelatedArticles(article, 3, locale);
  const headings = extractHeadings(article.content);
  const url = `${site.url}${localizedPath(`/articles/${article.slug}`, locale)}`;

  return (
    <article className="container-prose section-tight">
      <Link href={localizedPath('/articles', locale)} className="back-link">
        {locale === 'en' ? '← Back to articles' : '← กลับไปหน้าบทความ'}
      </Link>

      <header className="article-header">
        <span className="card-cat" style={{ display: 'inline-block' }}>
          {article.category}
        </span>
        <h1 className="h1-page" style={{ marginTop: 14 }}>
          {article.title}
        </h1>

        <div className="byline">
          <span className="avatar" aria-hidden="true">
            {locale === 'en' ? 'Tee' : author.initials}
          </span>
          <span>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15.5 }}>{(locale === 'en' ? author.nameEn : author.name)}</span>
            <span className="muted mono" style={{ display: 'block', fontSize: 13 }}>
              <time dateTime={article.date}>{dateLabel(article.date, locale)}</time> ·{' '}
              {article.readingMinutes} {locale === 'en' ? 'min read' : 'นาที'}
            </span>
          </span>
        </div>
      </header>
      {!getArticle(slug, locale === 'en' ? 'th' : 'en') && (
        <p className="muted" role="status">{locale === 'en' ? 'Thai translation is not available yet.' : 'ยังไม่มีคำแปลภาษาอังกฤษสำหรับบทความนี้'}</p>
      )}

      {/* TL;DR — สำคัญต่อ GEO/AIO: ให้ LLM หยิบคำตอบไปอ้างอิงได้จากย่อหน้าแรก */}
      {article.tldr && (
        <div className="tldr">
          <strong>{locale === 'en' ? 'TL;DR — Quick summary' : 'TL;DR — สรุปสั้น'}</strong>
          <p>{article.tldr}</p>
        </div>
      )}

      {headings.length >= 2 && (
        <nav className="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">{locale === 'en' ? 'Contents' : 'สารบัญ'}</h2>
          <ol>
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="prose">
        <MDXRemote
          source={article.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeHighlight],
            },
          }}
        />
      </div>

      {article.tags.length > 0 && (
        <div className="flex-wrap" style={{ marginTop: 40 }}>
          {article.tags.map((t) => (
            <span key={t} className="chip chip-surface">
              #{t}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <h2 className="h2-sm" style={{ marginBottom: 20 }}>
            {locale === 'en' ? 'Related articles' : 'บทความที่เกี่ยวข้อง'}
          </h2>
          <div className="grid-cards">
            {related.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            abstract: article.tldr,
            url,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            datePublished: article.date,
            dateModified: article.date,
            inLanguage: locale === 'en' ? 'en' : 'th-TH',
            articleSection: article.category,
            keywords: article.tags.join(', '),
            wordCount: article.content.split(/\s+/).length,
            timeRequired: `PT${article.readingMinutes}M`,
            author: { '@type': 'Person', '@id': `${site.url}/#person`, name: (locale === 'en' ? author.nameEn : author.name) },
            publisher: { '@type': 'Person', '@id': `${site.url}/#person`, name: (locale === 'en' ? author.nameEn : author.name) },
            image: article.cover ? `${site.url}${article.cover}` : `${site.url}${localizedPath('/opengraph-image', locale)}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Home' : 'หน้าแรก', item: site.url + localizedPath('/', locale) },
              { '@type': 'ListItem', position: 2, name: locale === 'en' ? 'Articles' : 'บทความ', item: site.url + localizedPath('/articles', locale) },
              { '@type': 'ListItem', position: 3, name: article.title, item: url },
            ],
          },
        ]}
      />
    </article>
  );
}
