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

export function usePaymentStatus(sessionId: string) {
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
        if (res.ok && ['ready', 'failed', 'expired'].includes(data.state)) {
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

  return { state, info };
}
