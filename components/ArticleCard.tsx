import Link from 'next/link';
import type { ArticleMeta } from '@/lib/types';
import { formatDateThai } from '@/lib/format';

export default function ArticleCard({
  article,
  index,
}: {
  article: ArticleMeta;
  /** ลำดับการ์ด ใช้ทำเลข 01, 02 มุมขวาบนตามดีไซน์ */
  index: number;
}) {
  const glyph = String(index + 1).padStart(2, '0');

  return (
    <article className="card card-hover">
      <div className="card-banner">
        <span className="card-glyph" aria-hidden="true">
          {glyph}
        </span>
        <span className="card-cat">{article.category}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">
          <Link href={`/articles/${article.slug}`} className="card-link">
            {article.title}
          </Link>
        </h3>
        <p className="card-excerpt">{article.description}</p>
        <div className="card-meta">
          <time dateTime={article.date}>{formatDateThai(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} นาที</span>
        </div>
      </div>
    </article>
  );
}
