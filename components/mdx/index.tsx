import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

/**
 * Component ที่เรียกใช้ได้จากในไฟล์ .mdx โดยตรง
 *
 * ออกแบบให้ "เขียนสั้น" — ผู้เขียนบทความไม่ต้องจำโค้ด iframe ยาว ๆ
 * แค่พิมพ์ <YouTube id="xxxx" /> ก็ได้วิดีโอที่ responsive + lazy load ครบ
 *
 * วิธีเพิ่ม component ใหม่: เขียนฟังก์ชันที่นี่ แล้วใส่ชื่อลงใน mdxComponents ท้ายไฟล์
 * แล้วอย่าลืมเขียนวิธีใช้ลง WRITING_GUIDE.md ด้วย
 */

/** กล่องกรอบ 16:9 สำหรับ iframe ทุกชนิด — ใช้ aspect-ratio จึงไม่เกิด CLS */
function EmbedFrame({
  src,
  title,
  allow,
}: {
  src: string;
  title: string;
  allow?: string;
}) {
  return (
    <div className="embed-16x9">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow={allow ?? 'accelerometer; encrypted-media; gyroscope; picture-in-picture'}
        allowFullScreen
      />
    </div>
  );
}

/**
 * วิดีโอ YouTube
 * <YouTube id="dQw4w9WgXcQ" title="อธิบาย Execution Plan" />
 *
 * ใช้ youtube-nocookie.com เพื่อไม่ให้ YouTube วาง cookie ติดตามผู้อ่าน
 * (สอดคล้องกับที่เว็บนี้ไม่มีแบนเนอร์ขอความยินยอม)
 */
export function YouTube({ id, title = 'วิดีโอ YouTube' }: { id: string; title?: string }) {
  return <EmbedFrame src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} />;
}

/**
 * วิดีโอ Vimeo
 * <Vimeo id="123456789" title="สาธิตการติดตั้ง RAC" />
 */
export function Vimeo({ id, title = 'วิดีโอ Vimeo' }: { id: string; title?: string }) {
  return <EmbedFrame src={`https://player.vimeo.com/video/${id}?dnt=1`} title={title} />;
}

/**
 * เสียงจาก SoundCloud
 * <SoundCloud url="https://soundcloud.com/user/track-name" />
 */
export function SoundCloud({ url, title = 'เสียงจาก SoundCloud' }: { url: string; title?: string }) {
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23b23a2b&auto_play=false&show_comments=false`;
  return (
    <div className="embed-audio">
      <iframe src={src} title={title} height={166} loading="lazy" allow="autoplay" />
    </div>
  );
}

/**
 * ไฟล์เสียงของเราเอง (วางไว้ใน public/audio/)
 * <Audio src="/audio/ep01.mp3" title="พอดแคสต์ตอนที่ 1" />
 */
export function Audio({ src, title }: { src: string; title?: string }) {
  return (
    <figure className="embed-audio">
      <audio controls preload="none" src={src} style={{ width: '100%' }}>
        เบราว์เซอร์ของคุณไม่รองรับการเล่นไฟล์เสียง —{' '}
        <a href={src}>ดาวน์โหลดไฟล์</a>
      </audio>
      {title && <figcaption className="embed-caption">{title}</figcaption>}
    </figure>
  );
}

/**
 * รูปภาพพร้อมคำบรรยายใต้ภาพ (ถ้าไม่ต้องการคำบรรยาย ใช้ ![alt](/path) ของ markdown ปกติได้)
 * <Figure src="/images/blog/awr.png" alt="ตัวอย่างรายงาน AWR" caption="ส่วน Top 10 Foreground Events" />
 */
export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure style={{ margin: '28px 0' }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 760px"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
        }}
      />
      {caption && <figcaption className="embed-caption">{caption}</figcaption>}
    </figure>
  );
}

/**
 * กล่องเน้นข้อความ — ใช้เตือนหรือแนะเคล็ดลับ
 * <Callout type="warning">อย่ารัน DROP TABLE บน Production โดยไม่สำรองข้อมูลก่อน</Callout>
 *
 * type: tip (ค่าเริ่มต้น) | warning | danger
 */
export function Callout({
  type = 'tip',
  title,
  children,
}: {
  type?: 'tip' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  const preset = {
    tip: { icon: '💡', label: 'เคล็ดลับ' },
    warning: { icon: '⚠️', label: 'ข้อควรระวัง' },
    danger: { icon: '🛑', label: 'อันตราย' },
  }[type];

  return (
    <div className={`callout callout-${type}`}>
      <strong className="callout-title">
        <span aria-hidden="true">{preset.icon}</span> {title ?? preset.label}
      </strong>
      <div className="callout-body">{children}</div>
    </div>
  );
}

/** ลิงก์ภายนอกที่เปิดแท็บใหม่และปลอดภัย (markdown ปกติจะเปิดทับแท็บเดิม) */
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (เปิดในแท็บใหม่)</span>
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  YouTube,
  Vimeo,
  SoundCloud,
  Audio,
  Figure,
  Callout,
  ExternalLink,
};
