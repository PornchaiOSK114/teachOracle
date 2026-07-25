import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';

/**
 * รูปที่ "ยังไม่มีไฟล์ก็ไม่พัง"
 *
 * Server component — ตรวจว่ามีไฟล์จริงใน /public หรือยัง
 *  - มีไฟล์  → เรนเดอร์ <Image> ของ Next (สร้าง AVIF/WebP + srcset ให้อัตโนมัติ)
 *  - ไม่มีไฟล์ → เรนเดอร์กล่อง placeholder ตามดีไซน์
 *
 * ทำแบบนี้เพื่อให้เจ้าของเว็บแค่ "วางไฟล์รูปตามชื่อ" แล้วรูปขึ้นเอง โดยไม่ต้องแก้โค้ด
 */
export default function AssetImage({
  src,
  alt,
  placeholder,
  fill = true,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, 400px',
  priority = false,
  fit = 'cover',
}: {
  src: string;
  alt: string;
  placeholder: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}) {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));

  if (!exists) {
    return (
      <div className="img-placeholder" role="img" aria-label={placeholder}>
        <span>{placeholder}</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: fit }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 800}
      sizes={sizes}
      priority={priority}
      style={{ objectFit: fit, width: '100%', height: 'auto' }}
    />
  );
}
