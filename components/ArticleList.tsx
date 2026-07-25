'use client';

import { useMemo, useState } from 'react';
import type { ArticleMeta } from '@/lib/types';
import { ALL_CATEGORY } from '@/lib/site';
import ArticleCard from './ArticleCard';

export default function ArticleList({
  articles,
  categories,
}: {
  articles: ArticleMeta[];
  /** หมวดที่มีบทความอยู่จริงเท่านั้น — ไม่โชว์หมวดว่างเปล่า */
  categories: string[];
}) {
  const [cat, setCat] = useState<string>(ALL_CATEGORY);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return articles.filter((a) => {
      if (cat !== ALL_CATEGORY && a.category !== cat) return false;
      if (!needle) return true;
      return (
        a.title.toLowerCase().includes(needle) ||
        a.description.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [articles, cat, q]);

  const chips = [ALL_CATEGORY, ...categories];

  return (
    <>
      <p className="muted" style={{ margin: '0 0 24px', fontSize: 16 }} aria-live="polite">
        {filtered.length} บทความ
        {cat !== ALL_CATEGORY ? ` ในหมวด ${cat}` : ''}
      </p>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="article-search" className="sr-only">
          ค้นหาบทความ
        </label>
        <input
          id="article-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาบทความ เช่น Execution Plan, RMAN, Index…"
          style={{
            width: '100%',
            maxWidth: 460,
            minHeight: 44,
            padding: '13px 16px',
            borderRadius: 'var(--radius-btn)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontSize: 15,
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 30 }}
        role="group"
        aria-label="กรองตามหมวดหมู่"
      >
        {chips.map((name) => (
          <button
            key={name}
            type="button"
            className="filter-chip"
            aria-pressed={cat === name}
            onClick={() => setCat(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 17 }}>
            ยังไม่มีบทความที่ตรงกับเงื่อนไขนี้
          </p>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>
            ลองเปลี่ยนหมวดหมู่ หรือล้างคำค้นหาดูครับ
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
