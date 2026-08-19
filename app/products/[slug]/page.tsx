import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssetImage from '@/components/AssetImage';
import JsonLd from '@/components/JsonLd';
import SampleCarousel, { type CarouselSlide } from '@/components/SampleCarousel';
import { resolveAsset } from '@/lib/assets';
import { products, getProduct, isPromoOpen, site, author } from '@/lib/site';

const priceFormatter = new Intl.NumberFormat('th-TH');

/**
 * สร้างหน้าใหม่ทุก 15 นาที เพื่อให้กล่องโปรโมชันหายไปเองเมื่อหมดเวลา
 * โดยไม่ต้องกลับมา deploy ใหม่
 */
export const revalidate = 900;

/** สร้างหน้าแบบ static ตอน build ครบทุกสินค้า */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** ⚠️ Next 16: `params` เป็น Promise ต้อง await ก่อนใช้เสมอ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'ไม่พบสินค้า' };

  const url = `${site.url}/products/${product.slug}`;
  const cover = resolveAsset(`${product.imageDir}/${product.coverFile}`);

  return {
    title: product.title,
    description: product.metaDesc,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.title} | ${site.name}`,
      description: product.metaDesc,
      url,
      type: 'article',
      ...(cover ? { images: [{ url: cover, alt: `ปกหนังสือ ${product.title}` }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.metaDesc,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const url = `${site.url}/products/${product.slug}`;
  const priceText = priceFormatter.format(product.price);

  /* หาไฟล์รูปจริงฝั่ง server แล้วค่อยส่ง string ให้ client component (ห้าม client แตะ node:fs) */
  const cover =
    resolveAsset(`${product.imageDir}/${product.coverFile}`) ??
    `${product.imageDir}/${product.coverFile}.png`;

  const slides: CarouselSlide[] = product.samples
    .map((s) => {
      const src = resolveAsset(`${product.imageDir}/${s.file}`);
      return src ? { src, alt: s.alt, group: s.group } : null;
    })
    .filter((s): s is CarouselSlide => s !== null);

  const canBuy = product.buyUrl.length > 0;
  const promo = isPromoOpen(product.promo) ? product.promo : null;
  const promoOpen = promo !== null && promo.formUrl.length > 0;

  return (
    <section className="container-prose section" style={{ maxWidth: 860 }}>
      <p className="crumb muted">
        <Link href="/products">ผลิตภัณฑ์</Link> <span aria-hidden="true">/</span> {product.title}
      </p>

      {/* 1 · ชื่อหนังสือ */}
      <div className="product-hero">
        <span className="type-badge">{product.kind}</span>
        <h1 className="h1-page" style={{ margin: '14px 0 8px' }}>
          {product.title}
        </h1>
        <p className="muted" style={{ fontSize: 17.5, margin: '0 0 10px', lineHeight: 1.6 }}>
          {product.subtitle}
        </p>
        <p className="muted" style={{ fontSize: 15, margin: 0 }}>
          โดย <strong style={{ color: 'var(--text)' }}>{product.authorName}</strong>
        </p>
      </div>

      {/* 2 · รูปปก + ข้อมูลย่อ */}
      <div className="product-cover-wrap">
        <div className="product-cover">
          <AssetImage
            src={cover}
            alt={`ปกหนังสือ ${product.title}`}
            placeholder="ปกหนังสือ"
            sizes="(max-width: 640px) 72vw, 320px"
            priority
          />
        </div>
        <div className="fact-bar">
          <span className="fact fact-price">
            <strong className="mono">฿{priceText}</strong>
          </span>
          <span className="fact">
            <strong>{product.kind}</strong>
          </span>
          <span className="fact">
            <strong>{product.pages}</strong> หน้า
          </span>
          <span className="fact">
            ภาษา <strong>{product.language}</strong>
          </span>
          <span className="fact">
            + <strong>สคริปต์แล็บ .zip</strong>
          </span>
        </div>
      </div>

      {/* 2.5 · โปรโมชันราคาศิษย์เก่า — หายไปเองเมื่อพ้นกำหนด */}
      {promo && (
        <aside className="promo-box">
          <span className="promo-badge">{promo.label}</span>

          <div className="promo-price-row">
            <span className="promo-price mono">฿{priceFormatter.format(promo.price)}</span>
            <span className="promo-was mono">฿{priceText}</span>
          </div>

          <p className="promo-line">{promo.deadlineLabel}</p>
          <p className="promo-line">{promo.deliverNote}</p>

          <p className="promo-warning">{promo.warning}</p>

          {promoOpen ? (
            <a
              className="btn btn-primary promo-btn"
              href={promo.formUrl}
              rel="noopener nofollow"
              target="_blank"
            >
              สั่งซื้อราคาศิษย์เก่า
            </a>
          ) : (
            <button className="btn btn-primary promo-btn" type="button" disabled>
              กำลังเปิดรับเร็ว ๆ นี้
            </button>
          )}

          <p className="promo-hint muted">{promo.codeHint}</p>
        </aside>
      )}

      {/* 3 · รูปสารบัญ + รูปที่เหลือ */}
      {slides.length > 0 && (
        <div className="product-section">
          <h2 className="h2-sm">อ่านตัวอย่าง</h2>
          <p className="muted product-section-lead">
            สารบัญ · หน้าเกี่ยวกับผู้เขียน · ตัวอย่างเนื้อหาในเล่ม รวม {slides.length} หน้า
          </p>
          <SampleCarousel slides={slides} />
        </div>
      )}

      {/* 4 · รายละเอียด */}
      <div className="product-section">
        <h2 className="h2-sm">เกี่ยวกับหนังสือเล่มนี้</h2>
        <p className="muted product-section-lead">เรียบเรียงจากคำนำของหนังสือ</p>

        <div className="product-prose">
          {product.sections.map((section, i) => {
            if (section.kind === 'paragraphs') {
              return (
                <div key={i}>
                  {section.heading && <h3>{section.heading}</h3>}
                  {section.items.map((text, j) => (
                    <p key={j}>{text}</p>
                  ))}
                </div>
              );
            }
            if (section.kind === 'bullets') {
              return (
                <div key={i}>
                  {section.heading && <h3>{section.heading}</h3>}
                  <ul className={section.deny ? 'product-bullets is-deny' : 'product-bullets'}>
                    {section.items.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div className="callout" key={i}>
                {section.heading && <div className="callout-title">{section.heading}</div>}
                <div className="callout-body">
                  <p style={{ margin: 0 }}>{section.text}</p>
                </div>
              </div>
            );
          })}

          <h3>รายละเอียดสินค้า</h3>
          <table className="spec-table">
            <tbody>
              <tr>
                <td>ประเภท</td>
                <td>{product.kind}</td>
              </tr>
              <tr>
                <td>จำนวนหน้า</td>
                <td>{product.pages} หน้า</td>
              </tr>
              <tr>
                <td>ภาษา</td>
                <td>{product.language}</td>
              </tr>
              <tr>
                <td>ผู้เขียน</td>
                <td>{product.authorName}</td>
              </tr>
              <tr>
                <td>ไฟล์ที่ได้รับ</td>
                <td>{product.deliverables.join(' + ')}</td>
              </tr>
              <tr>
                <td>ราคา</td>
                <td>{priceText} บาท</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 · Call to action + ปุ่มสั่งซื้อ */}
      <div className="panel-dark product-cta">
        <div className="product-cta-copy">
          <h2 style={{ fontSize: 23, margin: '0 0 8px' }}>พร้อมเริ่มจูน SQL แล้วหรือยัง</h2>
          <p style={{ margin: 0, fontSize: 14.5, opacity: 0.85 }}>
            {product.pages} หน้า ภาษา{product.language} · {product.deliverables.join(' + ')}
          </p>
        </div>
        <div className="product-cta-action">
          <span className="product-cta-price mono">฿{priceText}</span>
          {canBuy ? (
            <a
              className="btn btn-primary"
              href={product.buyUrl}
              rel="noopener nofollow"
              target="_blank"
            >
              สั่งซื้อ E-Book
            </a>
          ) : (
            <button className="btn btn-primary" type="button" disabled>
              เปิดสั่งซื้อเร็ว ๆ นี้
            </button>
          )}
        </div>
      </div>

      {!canBuy && (
        <p className="muted product-cta-note">
          ระบบชำระเงินออนไลน์กำลังเปิดใช้งาน — ระหว่างนี้สั่งซื้อได้ที่{' '}
          <Link href="/contact">หน้าติดต่อ</Link>
        </p>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.metaDesc,
          url,
          image: cover.startsWith('/') ? `${site.url}${cover}` : cover,
          inLanguage: 'th',
          brand: { '@type': 'Brand', name: site.name },
          author: { '@type': 'Person', name: author.name },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency,
            availability: 'https://schema.org/InStock',
            url: canBuy ? product.buyUrl : url,
          },
        }}
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: site.url },
            { '@type': 'ListItem', position: 2, name: 'ผลิตภัณฑ์', item: `${site.url}/products` },
            { '@type': 'ListItem', position: 3, name: product.title, item: url },
          ],
        }}
      />
    </section>
  );
}
