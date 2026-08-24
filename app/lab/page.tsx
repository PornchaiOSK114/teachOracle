import type { Metadata } from 'next';
import Link from 'next/link';
import { author, site, labKitTh, labLinks } from '@/lib/site';

/**
 * teedba.com/lab
 * ⚠️ URL นี้ถูกพิมพ์ในคำนำของหนังสือฉบับภาษาไทยไปแล้ว — ห้ามเปลี่ยน ห้ามลบ
 *    "ดาวน์โหลดชุดติดตั้งแล็บได้ที่ https://teedba.com/lab"
 * และบทติดตั้งแล็บในเล่มไม่ได้บอกแหล่งดาวน์โหลดไว้ที่อื่นเลย
 * หน้านี้จึงเป็นทางเดียวที่ผู้อ่านจะหาสคริปต์เจอ
 */
export const metadata: Metadata = {
  title: 'ชุดติดตั้งแล็บ — Oracle 26ai SQL Tuning',
  description:
    'ดาวน์โหลดสคริปต์ติดตั้งสภาพแวดล้อมแล็บสำหรับหนังสือ Oracle 26ai SQL Tuning พร้อมข้อกำหนดก่อนรันและวิธีรัน',
  alternates: { canonical: '/lab' },
  openGraph: {
    title: `ชุดติดตั้งแล็บ — Oracle 26ai SQL Tuning | ${site.name}`,
    description: 'สคริปต์ .sql สำหรับทำแล็บตามหนังสือ Oracle 26ai SQL Tuning',
    url: `${site.url}/lab`,
    type: 'website',
  },
};

const kit = labKitTh;
const links = labLinks(kit);

export default function LabPage() {
  return (
    <section className="container-prose section" style={{ maxWidth: 800 }}>
      <span className="eyebrow">ชุดติดตั้งแล็บ</span>
      <h1 className="h1-page">{kit.bookTitle}</h1>
      <p className="muted" style={{ fontSize: 17, lineHeight: 1.75, margin: '0 0 30px' }}>
        สคริปต์ SQL สำหรับทำแล็บตามหนังสือ แยกเป็นไฟล์ละบท รวม {kit.scriptCount} ไฟล์
        รันตามไปพร้อมกับที่อ่านได้ทุกบท
      </p>

      {/* ---------- ดาวน์โหลด ---------- */}
      {links ? (
        <div className="panel-dark" style={{ padding: 'clamp(24px,4vw,36px)', marginBottom: 40 }}>
          <h2 style={{ fontSize: 21, margin: '0 0 8px' }}>ดาวน์โหลดชุดสคริปต์</h2>
          <p style={{ margin: '0 0 20px', fontSize: 14.5, opacity: 0.85 }}>
            ไฟล์ .zip เดียวจบ ไม่ต้องสมัครสมาชิก ไม่ต้องล็อกอิน
          </p>
          <div className="flex-wrap" style={{ justifyContent: 'center' }}>
            <a className="btn btn-primary" href={links.zip} rel="noopener">
              ดาวน์โหลด .zip
            </a>
            <a
              className="btn btn-secondary"
              href={links.browseTh}
              target="_blank"
              rel="noopener noreferrer"
            >
              เปิดดูทีละไฟล์บน GitHub
            </a>
          </div>
        </div>
      ) : (
        <div className="callout callout-warning" style={{ marginBottom: 40 }}>
          <div className="callout-title">ชุดสคริปต์กำลังจัดเตรียม</div>
          <div className="callout-body">
            <p style={{ margin: 0 }}>
              ถ้าคุณซื้อหนังสือแล้ว ไฟล์ <span className="mono">.zip</span> ชุดเดียวกันนี้
              แนบไปกับอีเมลที่ผมส่งหนังสือให้แล้ว เปิดจากอีเมลได้เลย
              หรือทักมาที่{' '}
              <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                เพจ {author.facebookLabel}
              </a>{' '}
              ผมส่งให้ทันที
            </p>
          </div>
        </div>
      )}

      {/* ---------- ก่อนรัน ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">ก่อนรัน ตรวจสามอย่างนี้ก่อน</h2>
        <div className="product-prose">
          <ul className="product-bullets">
            <li>
              Oracle Database <strong>26ai</strong> หรือ <strong>23ai</strong> โดยมี PDB
              เปิดใช้งานอยู่
            </li>
            <li>
              สิทธิ์ <span className="mono">SYSDBA</span>
            </li>
            <li>
              แก้ค่าสามจุดในสคริปต์ให้ตรงกับเครื่องคุณ — จุดที่ต้องแก้มีคอมเมนต์{' '}
              <span className="mono">-- CHANGE THIS</span> กำกับไว้ทุกจุด
            </li>
          </ul>

          <h3>สามค่าที่ต้องแก้</h3>
          <table className="spec-table">
            <tbody>
              <tr>
                <td>ชื่อ PDB</td>
                <td>
                  ตัวอย่างในหนังสือใช้ <span className="mono">prod</span>
                </td>
              </tr>
              <tr>
                <td>พาธของ datafile และ tempfile</td>
                <td>ชี้ไปที่พาธจริงบนเครื่องคุณ</td>
              </tr>
              <tr>
                <td>
                  รหัสผ่านของ user <span className="mono">TUNE</span>
                </td>
                <td>ตั้งเอง</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- วิธีรัน ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">วิธีรัน</h2>
        <div className="product-prose">
          <pre>
            <code>{`cd ${kit.workDir}
sqlplus / as sysdba @${kit.entryScript}`}</code>
          </pre>
          <p>
            สคริปต์ตั้ง <span className="mono">WHENEVER SQLERROR EXIT</span> ไว้ ถ้าพลาดตรงไหนมันจะหยุดตรงนั้นเลย
            ไม่ทิ้ง schema ที่สร้างค้างครึ่ง ๆ กลาง ๆ ให้มานั่งไล่ทีหลัง
            และ<strong>รันซ้ำได้</strong> เพราะหัวสคริปต์ลบของเดิมทิ้งก่อนเสมอ
          </p>
        </div>
      </div>

      {/* ---------- สิ่งที่สคริปต์สร้าง ---------- */}
      <div className="product-section">
        <h2 className="h2-sm">สิ่งที่สคริปต์นี้สร้าง</h2>
        <div className="product-prose">
          <table className="spec-table">
            <tbody>
              <tr>
                <td className="mono">TUNE.PRODUCTS</td>
                <td>5,000 แถว</td>
              </tr>
              <tr>
                <td className="mono">TUNE.CUSTOMERS</td>
                <td>200,000 แถว</td>
              </tr>
              <tr>
                <td className="mono">TUNE.SALES</td>
                <td>ประมาณ 5,000,000 แถว</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- ทางสำรอง ---------- */}
      <div className="callout">
        <div className="callout-title">ถ้าองค์กรบล็อก GitHub</div>
        <div className="callout-body">
          <p style={{ margin: 0 }}>
            หลายองค์กรปิด <span className="mono">github.com</span> ไว้ที่ไฟร์วอลล์
            ถ้าโหลดจากหน้านี้ไม่ได้ ให้ใช้ไฟล์ <span className="mono">.zip</span> ที่แนบมากับอีเมลตอนที่ผมส่งหนังสือให้
            เป็นชุดเดียวกันทุกไฟล์ หรือโหลดจากเครื่องที่บ้านแล้วก๊อปเข้าไป
          </p>
        </div>
      </div>

      {/* ---------- ติดต่อ ---------- */}
      <div className="product-section" style={{ marginTop: 40, marginBottom: 0 }}>
        <h2 className="h2-sm">ติดขัดตรงไหน</h2>
        <div className="product-prose">
          <p>
            รันไม่ผ่าน เจอที่พิมพ์ผิดในเล่ม หรืออยากถามอะไรเกี่ยวกับหนังสือ
            ทักมาที่{' '}
            <a href={author.facebook} target="_blank" rel="noopener noreferrer">
              เพจ {author.facebookLabel}
            </a>{' '}
            หรืออีเมล <a href={`mailto:${author.email}`}>{author.email}</a> ได้เลยครับ
          </p>
          <p className="muted" style={{ fontSize: 14.5 }}>
            ยังไม่มีหนังสือ? ดูรายละเอียดได้ที่{' '}
            <Link href="/products/oracle-26-ai-sql-tuning">หน้าผลิตภัณฑ์</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
