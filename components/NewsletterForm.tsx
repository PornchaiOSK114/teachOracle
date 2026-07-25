'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data: { message?: string } = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('ok');
        setMessage(data.message ?? 'ขอบคุณครับ! กรุณาตรวจอีเมลเพื่อยืนยันการสมัคร');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message ?? 'สมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch {
      setStatus('error');
      setMessage('เชื่อมต่อไม่ได้ กรุณาลองใหม่อีกครั้ง');
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="form-row">
        <label htmlFor="newsletter-email" className="sr-only">
          อีเมลของคุณ
        </label>
        <input
          id="newsletter-email"
          className="field"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมลของคุณ"
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'กำลังส่ง…' : 'แจ้งเตือนฉัน'}
        </button>
      </form>

      {status === 'ok' && (
        <p className="form-ok" role="status">
          ✓ {message}
        </p>
      )}
      {status === 'error' && (
        <p className="form-err" role="alert">
          {message}
        </p>
      )}

      {/* ข้อความยินยอมตาม PDPA — จำเป็นสำหรับการเก็บอีเมลในไทย */}
      <p className="form-note">
        กรอกอีเมลเพื่อรับข่าวสารความรู้และผลิตภัณฑ์ใหม่เท่านั้น ไม่ส่งต่อให้บุคคลที่สาม
        และยกเลิกรับข่าวได้ทุกเมื่อจากลิงก์ท้ายอีเมล
      </p>
    </>
  );
}
