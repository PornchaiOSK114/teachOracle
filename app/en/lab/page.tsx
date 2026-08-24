import type { Metadata } from 'next';
import Link from 'next/link';
import { author, site, labKitEn, labLinks } from '@/lib/site';

/**
 * teedba.com/en/lab
 * ⚠️ URL นี้ถูกพิมพ์ในคำนำของหนังสือฉบับภาษาอังกฤษไปแล้ว — ห้ามเปลี่ยน ห้ามลบ
 *    "Download the lab setup here: https://teedba.com/en/lab"
 */
export const metadata: Metadata = {
  title: 'Lab Setup — Oracle 26ai SQL Tuning',
  description:
    'Download the lab setup scripts for the book Oracle 26ai SQL Tuning, with prerequisites and instructions for running them.',
  alternates: { canonical: '/en/lab' },
  openGraph: {
    title: 'Lab Setup — Oracle 26ai SQL Tuning',
    description: 'SQL scripts for the hands-on labs in Oracle 26ai SQL Tuning.',
    url: `${site.url}/en/lab`,
    type: 'website',
  },
};

const kit = labKitEn;
const links = labLinks(kit);

export default function LabPageEn() {
  return (
    <section className="container-prose section" style={{ maxWidth: 800 }} lang="en">
      <p className="crumb muted">
        <Link href="/en">English edition</Link> <span aria-hidden="true">/</span> Lab setup
      </p>

      <span className="eyebrow">Lab setup</span>
      <h1 className="h1-page">{kit.bookTitle}</h1>
      <p className="muted" style={{ fontSize: 17, lineHeight: 1.75, margin: '0 0 30px' }}>
        The SQL scripts for the hands-on labs in the book — {kit.scriptCount} files, one per chapter,
        so you can keep the book open beside the terminal and run along.
      </p>

      {/* ---------- Download ---------- */}
      {links ? (
        <div className="panel-dark" style={{ padding: 'clamp(24px,4vw,36px)', marginBottom: 40 }}>
          <h2 style={{ fontSize: 21, margin: '0 0 8px' }}>Download the scripts</h2>
          <p style={{ margin: '0 0 20px', fontSize: 14.5, opacity: 0.85 }}>
            One .zip file. No sign-up, no account needed.
          </p>
          <div className="flex-wrap" style={{ justifyContent: 'center' }}>
            <a className="btn btn-primary" href={links.zip} rel="noopener">
              Download .zip
            </a>
            <a
              className="btn btn-secondary"
              href={links.browseEn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse the files on GitHub
            </a>
          </div>
        </div>
      ) : (
        <div className="callout callout-warning" style={{ marginBottom: 40 }}>
          <div className="callout-title">The download is being prepared</div>
          <div className="callout-body">
            <p style={{ margin: 0 }}>
              Email me at <a href={`mailto:${author.email}`}>{author.email}</a> and I will send you
              the scripts directly.
            </p>
          </div>
        </div>
      )}

      {/* ---------- Prerequisites ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">Before you run it</h2>
        <div className="product-prose">
          <ul className="product-bullets">
            <li>
              Oracle Database <strong>26ai</strong> or <strong>23ai</strong>, with a PDB open
            </li>
            <li>
              <span className="mono">SYSDBA</span> rights
            </li>
            <li>
              Three values in the script have to match your machine. Each one is marked with the
              comment <span className="mono">-- CHANGE THIS</span>
            </li>
          </ul>

          <h3>The three values</h3>
          <table className="spec-table">
            <tbody>
              <tr>
                <td>PDB name</td>
                <td>
                  the example uses <span className="mono">prod</span>
                </td>
              </tr>
              <tr>
                <td>Datafile and tempfile paths</td>
                <td>point them at real paths on your server</td>
              </tr>
              <tr>
                <td>
                  Password for user <span className="mono">TUNE</span>
                </td>
                <td>your choice</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- How to run ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">How to run it</h2>
        <div className="product-prose">
          <pre>
            <code>{`cd ${kit.workDir}
sqlplus / as sysdba @${kit.entryScript} | tee setup_lab.log`}</code>
          </pre>
          <p>
            The script sets <span className="mono">WHENEVER SQLERROR EXIT</span>, so if anything goes
            wrong it stops right there instead of leaving you a half-built schema to puzzle over
            later. You can run it again — the head of the script drops the old objects first.
          </p>
        </div>
      </div>

      {/* ---------- What it creates ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">What the script creates</h2>
        <div className="product-prose">
          <table className="spec-table">
            <tbody>
              <tr>
                <td className="mono">TUNE.PRODUCTS</td>
                <td>5,000 rows</td>
              </tr>
              <tr>
                <td className="mono">TUNE.CUSTOMERS</td>
                <td>200,000 rows</td>
              </tr>
              <tr>
                <td className="mono">TUNE.SALES</td>
                <td>about 5,000,000 rows</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Fallback ---------- */}
      <div className="callout">
        <div className="callout-title">If your company blocks GitHub</div>
        <div className="callout-body">
          <p style={{ margin: 0 }}>
            Plenty of corporate firewalls block <span className="mono">github.com</span>. If the
            download above does not work from your office, fetch it from a machine outside the
            network and copy it across, or email me and I will send the .zip to you.
          </p>
        </div>
      </div>

      {/* ---------- Contact ---------- */}
      <div className="product-section" style={{ marginTop: 40, marginBottom: 0 }}>
        <h2 className="h2-sm">Something not working</h2>
        <div className="product-prose">
          <p>
            If a script fails, or you found a mistake in the book, email me at{' '}
            <a href={`mailto:${author.email}`}>{author.email}</a>. Corrections are collected on the{' '}
            <Link href="/en">English edition page</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
