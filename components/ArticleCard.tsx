import Link from 'next/link';
import Image from 'next/image';
import type { ArticleMeta } from '@/lib/types';
import { dateLabel, localizedPath, type Locale } from '@/lib/i18n';

export default function ArticleCard({
  article,
  index,
  locale = 'th',
}: {
  article: ArticleMeta;
  locale?: Locale;
  /** ลำดับการ์ด ใช้ทำเลข 01, 02 มุมขวาบนตามดีไซน์ */
  index: number;
}) {
  const glyph = String(index + 1).padStart(2, '0');

  return (
    <article className="card card-hover">
      {article.cover ? (
        <div className="card-cover">
          <Image
            src={article.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 400px"
            style={{ objectFit: 'contain' }}
          />
        </div>
      ) : (
        <div className="card-banner">
          <span className="card-glyph" aria-hidden="true">
            {glyph}
          </span>
          <span className="card-cat">{article.category}</span>
        </div>
      )}
      <div className="card-body">
        {article.cover && <span className="card-cat card-cover-category">{article.category}</span>}
        <h3 className="card-title">
          <Link href={localizedPath(`/articles/${article.slug}`, locale)} className="card-link">
            {article.title}
          </Link>
        </h3>
        <p className="card-excerpt">{article.description}</p>
        <div className="card-meta">
          <time dateTime={article.date}>{dateLabel(article.date, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} {locale === 'en' ? 'min read' : 'นาที'}</span>
        </div>
      </div>
    </article>
  );
}
