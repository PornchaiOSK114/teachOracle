import type { Metadata } from 'next';
import ArticleList from '@/components/ArticleList';
import JsonLd from '@/components/JsonLd';
import { getAllArticles, getAllCategoriesInUse } from '@/lib/content';
import { categories as ALL_CATS, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'บทความ Oracle Database',
  description:
    'รวมบทความความรู้ Oracle Database เชิงลึกโดยอาจารย์ตี๋ — DBA, SQL Performance Tuning, PL/SQL, RMAN Backup & Recovery, Oracle RAC และ Oracle Linux',
  alternates: { canonical: '/articles' },
  openGraph: {
    title: `บทความ Oracle Database | ${site.name}`,
    description: 'รวมบทความความรู้ Oracle Database เชิงลึกที่นำไปใช้ได้จริง',
    url: `${site.url}/articles`,
    type: 'website',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const inUse = getAllCategoriesInUse();
  // เรียงหมวดตามลำดับที่กำหนดใน site.ts แต่แสดงเฉพาะหมวดที่มีบทความจริง
  const cats = ALL_CATS.filter((c) => inUse.includes(c));

  return (
    <section className="container section-tight">
      <div style={{ marginBottom: 26 }}>
        <h1 className="h1-page" style={{ marginTop: 0 }}>
          บทความทั้งหมด
        </h1>
      </div>

      <ArticleList articles={articles} categories={cats} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'บทความ Oracle Database',
          url: `${site.url}/articles`,
          isPartOf: { '@id': `${site.url}/#website` },
          about: 'Oracle Database',
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: articles.length,
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${site.url}/articles/${a.slug}`,
              name: a.title,
            })),
          },
        }}
      />
    </section>
  );
}
