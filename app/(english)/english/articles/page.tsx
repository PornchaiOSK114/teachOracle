import { languageAlternates } from '@/lib/i18n';
import type { Metadata } from 'next';
import ArticleList from '@/components/ArticleList';
import JsonLd from '@/components/JsonLd';
import { getAllArticles, getAllCategoriesInUse } from '@/lib/content-en';
import { categories as ALL_CATS, site } from '@/lib/site-en';

export const metadata: Metadata = {
  title: 'Oracle Database articles',
  description:
    'Practical Oracle Database articles by Tee: DBA, SQL tuning, PL/SQL, RMAN, RAC and Oracle Linux.',
  alternates: languageAlternates('/english/articles'),
  openGraph: {
    locale: 'en_US', alternateLocale: 'th_TH',
    title: `Oracle Database articles | ${site.name}`,
    description: 'Practical, in-depth Oracle Database knowledge.',
    url: `${site.url}/english/articles`,
    type: 'website',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const inUse = getAllCategoriesInUse();
  // เรียงหมวดตามลำดับที่กำหนดใน site.ts แต่แสดงเฉพาะหมวดที่มีArticlesจริง
  const cats = ALL_CATS.filter((c) => inUse.includes(c));

  return (
    <section className="container section-tight">
      <div style={{ marginBottom: 26 }}>
        <h1 className="h1-page" style={{ marginTop: 0 }}>
          All articles
        </h1>
      </div>

      <ArticleList articles={articles} categories={cats} locale="en" />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Oracle Database articles',
          url: `${site.url}/english/articles`,
          isPartOf: { '@id': `${site.url}/#website` },
          about: 'Oracle Database',
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: articles.length,
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${site.url}/english/articles/${a.slug}`,
              name: a.title,
            })),
          },
        }}
      />
    </section>
  );
}
