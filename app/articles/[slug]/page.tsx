import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import ArticleCard from '@/components/ArticleCard';
import JsonLd from '@/components/JsonLd';
import {
  getArticle,
  getArticleSlugs,
  getRelatedArticles,
  formatDateThai,
  extractHeadings,
} from '@/lib/content';
import { site, author } from '@/lib/site';

// Next 16: params เป็น Promise ใน dynamic route ต้อง await ก่อนใช้
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'ไม่พบบทความ' };

  const url = `${site.url}/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: [author.name],
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const headings = extractHeadings(article.content);
  const url = `${site.url}/articles/${article.slug}`;

  return (
    <article className="container-prose section-tight">
      <Link href="/articles" className="back-link">
        ← กลับไปหน้าบทความ
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
            {author.initials}
          </span>
          <span>
            <span style={{ display: 'block', fontWeight: 600, fontSize: 15.5 }}>{author.name}</span>
            <span className="muted mono" style={{ display: 'block', fontSize: 13 }}>
              <time dateTime={article.date}>{formatDateThai(article.date)}</time> ·{' '}
              {article.readingMinutes} นาที
            </span>
          </span>
        </div>
      </header>

      {/* TL;DR — สำคัญต่อ GEO/AIO: ให้ LLM หยิบคำตอบไปอ้างอิงได้จากย่อหน้าแรก */}
      {article.tldr && (
        <div className="tldr">
          <strong>TL;DR — สรุปสั้น</strong>
          <p>{article.tldr}</p>
        </div>
      )}

      {headings.length >= 2 && (
        <nav className="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">สารบัญ</h2>
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
            บทความที่เกี่ยวข้อง
          </h2>
          <div className="grid-cards">
            {related.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
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
            inLanguage: 'th-TH',
            articleSection: article.category,
            keywords: article.tags.join(', '),
            wordCount: article.content.split(/\s+/).length,
            timeRequired: `PT${article.readingMinutes}M`,
            author: { '@type': 'Person', '@id': `${site.url}/#person`, name: author.name },
            publisher: { '@type': 'Person', '@id': `${site.url}/#person`, name: author.name },
            image: article.cover ? `${site.url}${article.cover}` : `${site.url}/opengraph-image`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: site.url },
              { '@type': 'ListItem', position: 2, name: 'บทความ', item: `${site.url}/articles` },
              { '@type': 'ListItem', position: 3, name: article.title, item: url },
            ],
          },
        ]}
      />
    </article>
  );
}
