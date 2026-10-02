'use client';

/**
 * ฟอร์มประทับ watermark ด้วยมือ ฝั่งที่ทำงานในเบราว์เซอร์
 *
 * ⚠️ ห้าม import อะไรจาก lib/delivery/ เด็ดขาด (ดู AGENTS.md ข้อ H)
 *
 * ไม่จำรหัสผ่านไว้ในเบราว์เซอร์โดยเจตนา ปิดแท็บแล้วต้องพิมพ์ใหม่
 * เครื่องมือนี้ใช้นาน ๆ ครั้ง ความสะดวกไม่คุ้มกับความเสี่ยงที่รหัสจะค้างอยู่ในเครื่อง
 */
import { useState } from 'react';

type ProductOption = { id: string; title: string };

export default function StampClient({ products }: { products: ProductOption[] }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [orderRef, setOrderRef] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setDone('');
    try {
      const res = await fetch('/api/admin/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email, productId, orderRef }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `ทำงานไม่สำเร็จ (${res.status})`);
        return;
      }

      /*
       * ไฟล์ที่ประทับแล้วกลับมาเป็นข้อมูลดิบ ไม่ใช่ URL
       * ต้องแปลงเป็นลิงก์ชั่วคราวในเครื่องแล้วสั่งให้เบราว์เซอร์บันทึกเอง
       * ทำแบบนี้เพราะไฟล์ที่ประทับแล้วไม่ควรมี URL ที่ค้างอยู่บนเซิร์ฟเวอร์
       */
      const ref = res.headers.get('X-Order-Ref') ?? '';
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Oracle 26ai SQL Tuning.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setDone(`ประทับเรียบร้อย เลขอ้างอิง ${ref} — จดเลขนี้ไว้เผื่อต้องสืบย้อนภายหลัง`);
      setEmail('');
      setOrderRef('');
    } catch {
      setError('เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="dl-box" onSubmit={submit}>
      <label className="dl-label" htmlFor="ad-pass">
        รหัสผ่าน
      </label>
      <input
        autoComplete="current-password"
        className="dl-input"
        id="ad-pass"
        onChange={(ev) => setPassword(ev.target.value)}
        required
        type="password"
        value={password}
      />

      <label className="dl-label" htmlFor="ad-email" style={{ marginTop: 18 }}>
        อีเมลที่จะประทับลงไฟล์
      </label>
      <input
        className="dl-input"
        id="ad-email"
        inputMode="email"
        onChange={(ev) => setEmail(ev.target.value)}
        placeholder="somchai@example.com"
        required
        type="email"
        value={email}
      />

      <label className="dl-label" htmlFor="ad-product" style={{ marginTop: 18 }}>
        หนังสือ
      </label>
      <select
        className="dl-input"
        id="ad-product"
        onChange={(ev) => setProductId(ev.target.value)}
        value={productId}
      >
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      <label className="dl-label" htmlFor="ad-ref" style={{ marginTop: 18 }}>
        เลขอ้างอิง (เว้นว่างได้ ระบบจะสร้างให้เอง)
      </label>
      <input
        className="dl-input"
        id="ad-ref"
        onChange={(ev) => setOrderRef(ev.target.value)}
        placeholder="เว้นว่างไว้"
        value={orderRef}
      />

      <button className="btn btn-primary dl-submit" disabled={busy} type="submit">
        {busy ? 'กำลังประทับ...' : 'ประทับแล้วดาวน์โหลด'}
      </button>

      {error && <p className="form-err dl-msg">{error}</p>}
      {done && !error && <p className="form-ok dl-msg">{done}</p>}
    </form>
  );
}
