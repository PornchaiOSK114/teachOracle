import type { Metadata } from 'next';
import Link from 'next/link';
import { author, site, errataEn, labKitEn } from '@/lib/site';

/**
 * teedba.com/en/
 * ⚠️ URL นี้ถูกพิมพ์ในหนังสือฉบับภาษาอังกฤษ 3 จุด — ห้ามเปลี่ยน ห้ามลบ
 *    หน้าลิขสิทธิ์  "Corrections and the current errata list: https://teedba.com/en/"
 *    คำนำ          "tell me at: https://teedba.com/en/"
 *    ท้ายเล่ม       "Corrections and updates for this edition are collected at ..."
 * เล่มใช้คำว่า "errata list" ตรง ๆ หน้านี้จึงต้องมีรายการแก้ไขจริง ไม่ใช่หน้าเปล่า
 */
export const metadata: Metadata = {
  title: 'Oracle 26ai SQL Tuning — English edition',
  description:
    'Errata, corrections and downloads for the English edition of Oracle 26ai SQL Tuning by Pornchai Krongthammachart.',
  alternates: { canonical: '/en' },
  openGraph: {
    title: 'Oracle 26ai SQL Tuning — English edition',
    description: 'Errata, corrections and lab downloads for the English edition.',
    url: `${site.url}/en`,
    type: 'website',
  },
};

export default function EnglishEditionPage() {
  return (
    <section className="container-prose section" style={{ maxWidth: 800 }} lang="en">
      <span className="eyebrow">English edition</span>
      <h1 className="h1-page">{labKitEn.bookTitle}</h1>
      <p className="muted" style={{ fontSize: 17, lineHeight: 1.75, margin: '0 0 34px' }}>
        by {author.nameEn} (Tee) — First edition, 2026.
        <br />
        This page holds the errata and the lab downloads for the English edition.
      </p>

      {/* ---------- Errata ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">Errata</h2>
        <p className="muted product-section-lead">
          Corrections to the printed text, newest first.
        </p>

        {errataEn.length === 0 ? (
          <div className="callout">
            <div className="callout-title">No corrections have been reported yet</div>
            <div className="callout-body">
              <p style={{ margin: 0 }}>
                Nothing has been reported for this edition so far. If you find something, please tell
                me — see below. Every confirmed correction gets listed here with the date it was
                logged.
              </p>
            </div>
          </div>
        ) : (
          <div className="product-prose">
            <table className="spec-table">
              <tbody>
                {errataEn.map((e) => (
                  <tr key={`${e.where}-${e.loggedOn}`}>
                    <td>
                      {e.where}
                      <br />
                      <span className="muted" style={{ fontSize: 13 }}>
                        logged {e.loggedOn}
                      </span>
                    </td>
                    <td>
                      <s className="muted">{e.printed}</s>
                      <br />
                      <strong>{e.correction}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- Report ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">Report a mistake</h2>
        <div className="product-prose">
          <p>
            A technical book this long is not going to be free of errors. If you find something
            misprinted, unclear, or that does not behave the way I said it would when you run it,
            email me at <a href={`mailto:${author.email}`}>{author.email}</a>.
          </p>
          <p>
            It helps a lot if you include the chapter and page number, what the book says, and what
            you think it should say. I read every one of these myself.
          </p>
        </div>
      </div>

      {/* ---------- Lab ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">Lab setup</h2>
        <div className="product-prose">
          <p>
            The book is built to be run, not skimmed. The lab scripts — {labKitEn.scriptCount} files,
            one per chapter — are on their own page.
          </p>
          <p>
            <Link className="btn btn-secondary btn-sm" href="/en/lab">
              Go to the lab downloads
            </Link>
          </p>
        </div>
      </div>

      {/* ---------- About ---------- */}
      <div className="product-section" style={{ marginBottom: 0 }}>
        <h2 className="h2-sm">About the author</h2>
        <div className="product-prose">
          <p>
            {author.nameEn} has spent more than {author.yearsExperience} years working with Oracle
            Database as a trainer and consultant — mostly in-house training and going in to fix
            systems that are already live and already hurting.
          </p>
          <p className="muted" style={{ fontSize: 14.5 }}>
            The rest of this site is written in Thai. Questions about the book are welcome in English
            at <a href={`mailto:${author.email}`}>{author.email}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
