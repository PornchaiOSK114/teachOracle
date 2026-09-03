'use client';

/**
 * หน้าดาวน์โหลด ฝั่งที่ทำงานในเบราว์เซอร์
 *
 * ⚠️ ไฟล์นี้เป็น client component ห้าม import อะไรจาก lib/delivery/ เด็ดขาด
 *    ไฟล์ในนั้นอ่านค่าลับและใช้ node:crypto ถ้าหลุดเข้ามาจะพังตอน build
 *    (ดู AGENTS.md ข้อ H — tsc จับบั๊กแบบนี้ไม่ได้ มีแต่ next build ที่จับได้)
 *
 * สามขั้น: กรอกอีเมล → กรอกรหัส 6 หลัก → เห็นรายการที่ซื้อแล้วกดโหลด
 */
import { useState } from 'react';

type PurchaseView = {
  id: number;
  orderRef: string;
  bookTitle: string;
  quantity: number;
  status: 'paid' | 'pending';
  downloadsUsed: number;
  downloadLimit: number;
  purchasedAt: string;
};

type Step = 'email' | 'code' | 'list';

export default function DownloadClient() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [items, setItems] = useState<PurchaseView[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/download/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string; ttlMinutes?: number };
      if (!res.ok) {
        setError(data.error ?? 'ขอรหัสไม่สำเร็จ ลองใหม่อีกครั้ง');
        return;
      }
      setStep('code');
      setNotice(`ส่งรหัสไปที่ ${email} แล้ว รหัสใช้ได้ ${data.ttlMinutes ?? 10} นาที`);
    } catch {
      setError('เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/download/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = (await res.json()) as { error?: string; items?: PurchaseView[] };
      if (!res.ok) {
        setError(data.error ?? 'รหัสไม่ถูกต้อง');
        return;
      }
      setItems(data.items ?? []);
      setStep('list');
      setNotice('');
    } catch {
      setError('เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dl-box">
      {step === 'email' && (
        <form onSubmit={requestCode}>
          <label className="dl-label" htmlFor="dl-email">
            อีเมลที่ใช้ตอนสั่งซื้อ
          </label>
          <input
            autoComplete="email"
            className="dl-input"
            id="dl-email"
            inputMode="email"
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
          <button className="btn btn-primary dl-submit" disabled={busy} type="submit">
            {busy ? 'กำลังส่งรหัส...' : 'ขอรหัสยืนยัน'}
          </button>
          <p className="dl-hint muted">
            ผมจะส่งรหัส 6 หลักไปที่อีเมลนี้ ต้องเอารหัสมากรอกก่อนถึงจะดาวน์โหลดได้
            ที่ต้องมีขั้นนี้เพราะไฟล์ผูกกับอีเมลของคุณคนเดียว
          </p>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verify}>
          <label className="dl-label" htmlFor="dl-code">
            รหัส 6 หลักจากอีเมล
          </label>
          <input
            autoComplete="one-time-code"
            className="dl-input dl-code"
            id="dl-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(ev) => setCode(ev.target.value.replace(/\D/g, ''))}
            pattern="\d{6}"
            placeholder="000000"
            required
            value={code}
          />
          <button className="btn btn-primary dl-submit" disabled={busy} type="submit">
            {busy ? 'กำลังตรวจ...' : 'ยืนยัน'}
          </button>
          <p className="dl-hint muted">
            ไม่ได้รับอีเมล ลองดูในกล่อง Spam ก่อน{' '}
            <button className="dl-linklike" disabled={busy} onClick={() => requestCode()} type="button">
              ส่งรหัสใหม่
            </button>
          </p>
          <p className="dl-hint muted">
            <button className="dl-linklike" onClick={() => { setStep('email'); setCode(''); setError(''); }} type="button">
              เปลี่ยนอีเมล
            </button>
          </p>
        </form>
      )}

      {step === 'list' && (
        <div>
          <p className="dl-verified">ยืนยันแล้ว: {email}</p>
          {items.length === 0 && <p className="muted">ไม่พบรายการที่พร้อมดาวน์โหลด</p>}
          {items.map((item) => {
            const left = item.downloadLimit - item.downloadsUsed;
            const out = left <= 0;
            return (
              <div className="dl-item" key={item.id}>
                <div className="dl-item-head">
                  <strong>{item.bookTitle}</strong>
                  <span className="dl-ref mono">{item.orderRef}</span>
                </div>
                <p className="dl-meta muted">
                  {item.quantity} สิทธิ์ · เหลือดาวน์โหลดได้ {Math.max(left, 0)} จาก{' '}
                  {item.downloadLimit} ครั้ง
                </p>
                {item.status === 'pending' ? (
                  <p className="dl-pending">กำลังรอยืนยันการชำระเงิน</p>
                ) : out ? (
                  <p className="dl-pending">
                    ดาวน์โหลดครบแล้ว ถ้ายังต้องการอีก ติดต่อ pornchai.krong@gmail.com ได้เลยครับ
                  </p>
                ) : (
                  <a
                    className="btn btn-primary"
                    href={`/api/download/file?purchase=${item.id}`}
                    onClick={() => {
                      /* นับให้ตรงกับที่เซิร์ฟเวอร์นับ โดยไม่ต้องรีเฟรชหน้า */
                      setItems((prev) =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, downloadsUsed: p.downloadsUsed + 1 } : p,
                        ),
                      );
                    }}
                  >
                    ดาวน์โหลด PDF
                  </a>
                )}
              </div>
            );
          })}
          <p className="dl-hint muted">
            ไฟล์ที่ได้จะมีอีเมลของคุณกำกับไว้ทุกหน้ายกเว้นหน้าปก
            ชุดติดตั้งแล็บอยู่ที่ <a href="/lab">teedba.com/lab</a> โหลดได้ไม่จำกัด ไม่ต้องใช้รหัส
          </p>
        </div>
      )}

      {error && <p className="form-err dl-msg">{error}</p>}
      {notice && !error && <p className="form-ok dl-msg">{notice}</p>}
    </div>
  );
}
