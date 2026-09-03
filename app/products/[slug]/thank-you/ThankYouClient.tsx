'use client';

/**
 * หน้าขอบคุณหลังจ่ายเงิน ฝั่งที่ทำงานในเบราว์เซอร์
 *
 * ⚠️ ห้าม import อะไรจาก lib/delivery/ เด็ดขาด (ดู AGENTS.md ข้อ H)
 *
 * หน้าที่เดียวคือถามสถานะซ้ำจนกว่าเงินจะเข้า
 * เพราะพร้อมเพย์จ่ายแบบหน่วงเวลาได้ ถ้าโชว์ปุ่มดาวน์โหลดทันทีโดยไม่เช็ค
 * เท่ากับแจกไฟล์ให้คนที่ยังไม่ได้จ่ายจริง
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';

type State = 'waiting' | 'ready' | 'failed' | 'expired' | 'timeout';

type StatusResponse = {
  state: Exclude<State, 'timeout'>;
  orderRef?: string;
  bookTitle?: string;
  quantity?: number;
};

/** ถามซ้ำทุก 5 วินาที นานสุด 5 นาที แล้วให้ไปใช้ทางอีเมลแทน */
const POLL_MS = 5_000;
const MAX_POLLS = 60;

export default function ThankYouClient({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<State>('waiting');
  const [info, setInfo] = useState<StatusResponse | null>(null);

  useEffect(() => {
    let stopped = false;
    let tries = 0;

    async function check() {
      if (stopped) return;
      tries += 1;
      try {
        const res = await fetch(`/api/download/status?session=${encodeURIComponent(sessionId)}`);
        const data = (await res.json()) as StatusResponse;
        if (stopped) return;
        if (data.state !== 'waiting') {
          setInfo(data);
          setState(data.state);
          return;
        }
      } catch {
        /* เน็ตสะดุดชั่วคราว ถามใหม่รอบหน้า ไม่ต้องแจ้งอะไรให้ลูกค้าตกใจ */
      }
      if (tries >= MAX_POLLS) {
        setState('timeout');
        return;
      }
      setTimeout(check, POLL_MS);
    }

    check();
    return () => {
      stopped = true;
    };
  }, [sessionId]);

  if (state === 'ready') {
    return (
      <div className="dl-box">
        <p className="dl-verified">
          ชำระเงินเรียบร้อย {info?.orderRef && <span className="mono">{info.orderRef}</span>}
        </p>
        <p style={{ margin: '0 0 18px', lineHeight: 1.7 }}>
          ดาวน์โหลดได้เลยครับ และผมส่งลิงก์ไปที่อีเมลของคุณด้วยแล้ว เผื่อวันหลังอยากโหลดอีก
        </p>
        <a
          className="btn btn-primary dl-submit"
          href={`/api/download/file?session=${encodeURIComponent(sessionId)}`}
        >
          ดาวน์โหลด PDF
        </a>
        <p className="dl-hint muted">
          ไฟล์จะมีอีเมลของคุณกำกับไว้ทุกหน้ายกเว้นหน้าปก · ชุดติดตั้งแล็บอยู่ที่{' '}
          <Link href="/lab">teedba.com/lab</Link> โหลดได้ไม่จำกัด
        </p>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="dl-box">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          การชำระเงินไม่สำเร็จครับ ยังไม่มีการหักเงินจากบัญชีของคุณ
          ถ้าต้องการลองใหม่ กลับไปที่หน้าสินค้าแล้วกดสั่งซื้ออีกครั้งได้เลย
          ถ้าเงินถูกหักไปแล้วแต่ขึ้นข้อความนี้ ติดต่อ pornchai.krong@gmail.com
        </p>
      </div>
    );
  }

  if (state === 'expired' || state === 'timeout') {
    return (
      <div className="dl-box">
        <p style={{ margin: '0 0 14px', lineHeight: 1.7 }}>
          {state === 'expired'
            ? 'ลิงก์หน้านี้หมดอายุแล้วครับ'
            : 'ระบบยังยืนยันการชำระเงินไม่สำเร็จภายในเวลาที่กำหนด'}
        </p>
        <p style={{ margin: '0 0 18px', lineHeight: 1.7 }}>
          ไม่ต้องกังวล ถ้าเงินเข้าแล้วผมจะส่งอีเมลพร้อมลิงก์ไปให้ ดาวน์โหลดจากหน้ารับหนังสือได้เสมอ
        </p>
        <Link className="btn btn-primary dl-submit" href="/download">
          ไปหน้ารับหนังสือ
        </Link>
      </div>
    );
  }

  return (
    <div className="dl-box">
      <p style={{ margin: '0 0 12px', lineHeight: 1.7 }}>
        ได้รับคำสั่งซื้อแล้ว กำลังรอยืนยันการชำระเงิน
      </p>
      <p className="muted" style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>
        ถ้าจ่ายด้วยพร้อมเพย์อาจใช้เวลาสักครู่ หน้านี้จะเปลี่ยนเป็นปุ่มดาวน์โหลดให้เองเมื่อเงินเข้า
        ปิดหน้านี้ไปก็ได้ครับ ผมส่งลิงก์ไปทางอีเมลอยู่แล้ว
      </p>
    </div>
  );
}
