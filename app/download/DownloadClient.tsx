'use client';

/**
 * หน้าดาวน์โหลด ฝั่งที่ทำงานในเบราว์เซอร์
 *
 * ⚠️ ไฟล์นี้เป็น client component ห้าม import อะไรจาก lib/delivery/ เด็ดขาด
 *    ไฟล์ในนั้นอ่านค่าลับและใช้ node:crypto ถ้าหลุดเข้ามาจะพังตอน build
 *    (ดู AGENTS.md ข้อ H — tsc จับบั๊กแบบนี้ไม่ได้ มีแต่ next build ที่จับได้)
 *
 * สามขั้น: กรอกอีเมล → กรอกรหัส 6 หลัก → เห็นหนังสือของตัวเองแล้วกดโหลด
 *
 * ⚠️ กติกาที่เจ้าของเว็บกำหนดหลังลองใช้จริง 3 ก.ย. 2569
 *   1. หนังสือเล่มเดียวกัน = การ์ดเดียว ปุ่มเดียว ต่อให้ซื้อมาแล้วหลายออเดอร์
 *      ลูกค้าไม่ควรต้องมานั่งเลือกว่าจะโหลดจากออเดอร์ไหน เขาแค่อยากได้หนังสือ
 *   2. บอกตรง ๆ เหนือปุ่มว่าเหลือสิทธิ์กี่ครั้ง
 *   3. ห้ามให้กดปุ่มแล้วเจอหน้า error ดิบ ๆ ตอนใบผ่านหมดอายุ
 *      จึงโหลดผ่าน fetch เพื่อดักข้อผิดพลาดเองทั้งหมด
 *   4. ยังไม่กดปุ่ม = ยังไม่เสียสิทธิ์ · กดแล้วล้มเพราะฝั่งเรา = ได้สิทธิ์คืน
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

/** หนังสือหนึ่งเล่ม รวมทุกออเดอร์ของเล่มนั้นเข้าด้วยกัน */
type BookGroup = {
  title: string;
  /** ออเดอร์ทั้งหมดของเล่มนี้ เรียงใหม่สุดก่อน */
  orders: PurchaseView[];
  /** สิทธิ์ที่เหลือรวมทุกออเดอร์ */
  left: number;
};

function groupByBook(items: PurchaseView[]): BookGroup[] {
  const map = new Map<string, PurchaseView[]>();
  for (const item of items) {
    const list = map.get(item.bookTitle);
    if (list) list.push(item);
    else map.set(item.bookTitle, [item]);
  }
  return [...map.entries()].map(([title, orders]) => ({
    title,
    orders,
    left: orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + Math.max(o.downloadLimit - o.downloadsUsed, 0), 0),
  }));
}

export default function DownloadClient() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [items, setItems] = useState<PurchaseView[]>([]);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [expired, setExpired] = useState(false);

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
      setExpired(false);
      setCode('');
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
      setExpired(false);
      setStep('list');
      setNotice('');
    } catch {
      setError('เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  /**
   * ดึงชื่อไฟล์จากหัว Content-Disposition
   * ถ้าอ่านไม่ได้ก็ตั้งชื่อจากชื่อหนังสือแทน ไม่ปล่อยให้ไฟล์ไม่มีชื่อ
   */
  function filenameFrom(header: string | null, fallbackTitle: string): string {
    const star = header?.match(/filename\*=UTF-8''([^;]+)/i);
    if (star?.[1]) {
      try {
        return decodeURIComponent(star[1]);
      } catch {
        /* หัวเพี้ยน ใช้ชื่อสำรอง */
      }
    }
    const plain = header?.match(/filename="?([^";]+)"?/i);
    return plain?.[1] ?? `${fallbackTitle}.pdf`;
  }

  /**
   * โหลดไฟล์ผ่าน fetch แทนการเป็นลิงก์ธรรมดา
   *
   * เหตุผลเดียวคือเรื่องข้อผิดพลาด ลิงก์ธรรมดาพาลูกค้าไปหน้า JSON ดิบ ๆ
   * เมื่อใบผ่านหมดอายุ ซึ่งเป็นสิ่งที่ลูกค้าเจอจริงมาแล้ว
   */
  async function download(group: BookGroup) {
    const order = group.orders.find(
      (o) => o.status === 'paid' && o.downloadLimit - o.downloadsUsed > 0,
    );
    if (!order) return;

    setDownloading(group.title);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/download/file?purchase=${order.id}`);

      if (res.status === 401) {
        /* ⚠️ ตรงนี้เซิร์ฟเวอร์ยังไม่ได้ตัดโควตา ลูกค้าจึงไม่เสียสิทธิ์ */
        setExpired(true);
        setError('การยืนยันหมดอายุแล้ว กดขอรหัสใหม่ได้เลย สิทธิ์ดาวน์โหลดของคุณยังอยู่ครบ');
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? 'ดาวน์โหลดไม่สำเร็จ ลองใหม่อีกครั้ง');
        return;
      }

      const blob = await res.blob();
      const name = filenameFrom(res.headers.get('content-disposition'), group.title);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      /* คืนหน่วยความจำ ไฟล์เกือบ 2 MB ไม่ควรค้างไว้ */
      setTimeout(() => URL.revokeObjectURL(url), 60_000);

      /* นับเฉพาะตอนได้ไฟล์จริงเท่านั้น */
      setItems((prev) =>
        prev.map((p) => (p.id === order.id ? { ...p, downloadsUsed: p.downloadsUsed + 1 } : p)),
      );
      setNotice('บันทึกไฟล์แล้ว ถ้าเบราว์เซอร์ถามที่เก็บ ให้เลือกโฟลเดอร์ได้เลย');
    } catch {
      setError('เชื่อมต่อไม่ได้ระหว่างดาวน์โหลด ลองใหม่อีกครั้ง');
    } finally {
      setDownloading(null);
    }
  }

  const groups = groupByBook(items);

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
            <button
              className="dl-linklike"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
              type="button"
            >
              เปลี่ยนอีเมล
            </button>
          </p>
        </form>
      )}

      {step === 'list' && (
        <div>
          <p className="dl-verified">ยืนยันแล้ว: {email}</p>

          {groups.length === 0 && <p className="muted">ไม่พบรายการที่พร้อมดาวน์โหลด</p>}

          {groups.map((group) => {
            const pending = group.orders.some((o) => o.status === 'pending');
            const refs = group.orders.map((o) => o.orderRef).join(' · ');
            const isDownloading = downloading === group.title;

            return (
              <div className="dl-item" key={group.title}>
                <div className="dl-item-head">
                  <strong>{group.title}</strong>
                  <span className="dl-ref mono">{refs}</span>
                </div>

                {pending && <p className="dl-pending">มีออเดอร์ที่กำลังรอยืนยันการชำระเงิน</p>}

                {group.left > 0 ? (
                  <>
                    <p className="dl-meta">
                      คุณเหลือสิทธิดาวน์โหลดได้อีก <strong>{group.left}</strong> ครั้ง
                    </p>
                    <button
                      className="btn btn-primary"
                      disabled={isDownloading}
                      onClick={() => download(group)}
                      type="button"
                    >
                      {isDownloading ? 'กำลังเตรียมไฟล์...' : 'ดาวน์โหลด PDF'}
                    </button>
                    {isDownloading && (
                      <p className="dl-hint muted">
                        ไฟล์ราว 1.8 MB ระบบกำลังประทับอีเมลของคุณลงทุกหน้า รอสักครู่
                      </p>
                    )}
                  </>
                ) : (
                  !pending && (
                    <p className="dl-pending">
                      ใช้สิทธิ์ดาวน์โหลดครบแล้ว ถ้ายังต้องการอีก ติดต่อ pornchai.krong@gmail.com
                      ได้เลยครับ ผมเพิ่มให้
                    </p>
                  )
                )}
              </div>
            );
          })}

          {expired && (
            <p className="dl-hint">
              <button className="dl-linklike" disabled={busy} onClick={() => requestCode()} type="button">
                ขอรหัสใหม่เพื่อดาวน์โหลดต่อ
              </button>
            </p>
          )}

          <p className="dl-hint muted">
            ไฟล์ที่ได้จะมีอีเมลของคุณกำกับไว้ทุกหน้ายกเว้นหน้าปก ชุดติดตั้งแล็บอยู่ที่{' '}
            <a href="/lab">teedba.com/lab</a> โหลดได้ไม่จำกัด ไม่ต้องใช้รหัส
          </p>
        </div>
      )}

      {error && <p className="form-err dl-msg">{error}</p>}
      {notice && !error && <p className="form-ok dl-msg">{notice}</p>}
    </div>
  );
}
