'use client';
import Link from 'next/link';
import { useDownload } from '@/components/delivery/useDownload';
export default function DownloadClient() {
 const { step, setStep, email, setEmail, code, setCode, busy, downloading, error, setError, notice, expired, requestCode, verify, download, groups } = useDownload('th');
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
            <Link href="/lab">teedba.com/lab</Link> โหลดได้ไม่จำกัด ไม่ต้องใช้รหัส
          </p>
        </div>
      )}

      {error && <p className="form-err dl-msg">{error}</p>}
      {notice && !error && <p className="form-ok dl-msg">{notice}</p>}
    </div>
  );
}
