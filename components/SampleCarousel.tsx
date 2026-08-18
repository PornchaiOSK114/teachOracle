'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Carousel อ่านตัวอย่างหนังสือ
 *
 * ⚠️ component นี้เป็น 'use client' → **ห้าม** import อะไรที่แตะ `node:fs`
 *    (เช่น `@/components/AssetImage` หรือ `@/lib/assets`) เข้ามาที่นี่เด็ดขาด
 *    หน้าที่หาไฟล์รูปเป็นของ page ฝั่ง server แล้วส่ง `slides` ที่ resolve แล้วเข้ามาเป็น prop
 *    (ดู AGENTS.md ข้อ H — `tsc` จับบั๊กนี้ไม่ได้ ต้อง build ถึงจะเจอ)
 */
export type CarouselSlide = {
  src: string;
  alt: string;
  group: string;
};

export default function SampleCarousel({ slides }: { slides: CarouselSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const total = slides.length;

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(total - 1, next));
      track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
      setIndex(clamped);
    },
    [total],
  );

  /** อ่านตำแหน่งจริงหลังผู้ใช้ปัดนิ้ว (debounce ด้วย rAF ให้ไม่ยิงถี่เกิน) */
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const current = Math.round(track.scrollLeft / track.clientWidth);
    setIndex((prev) => (prev === current ? prev : current));
  }, []);

  /* คีย์บอร์ด: ←/→ เลื่อนสไลด์ · Esc ปิดโหมดขยาย */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setZoom(false);
        return;
      }
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, index]);

  /* ล็อกการเลื่อนหน้าเว็บตอนเปิดโหมดขยาย */
  useEffect(() => {
    if (!zoom) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [zoom]);

  /* จอเปลี่ยนขนาดแล้วต้องเลื่อนกลับมาให้ตรงสไลด์เดิม */
  useEffect(() => {
    function onResize() {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: index * track.clientWidth });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [index]);

  if (total === 0) return null;

  const current = slides[index];

  return (
    <div className="sample-carousel">
      <div className="carousel-top">
        <span className="carousel-group">
          <span className="carousel-group-label">{current.group}</span>
        </span>
        <span className="carousel-count mono" aria-live="polite">
          {index + 1} / {total}
        </span>
      </div>

      <div className="carousel-stage">
        <div
          className="carousel-track"
          ref={trackRef}
          onScroll={handleScroll}
          role="group"
          aria-roledescription="carousel"
          aria-label="ตัวอย่างหน้าในหนังสือ"
        >
          {slides.map((slide, i) => (
            <div
              className="carousel-slide"
              key={slide.src}
              aria-hidden={i === index ? undefined : true}
            >
              <button
                type="button"
                className="carousel-sheet"
                onClick={() => setZoom(true)}
                aria-label={`ขยายรูป: ${slide.alt}`}
                tabIndex={i === index ? 0 : -1}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  style={{ objectFit: 'contain' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-nav"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="รูปก่อนหน้า"
        >
          ‹
        </button>

        <div className="carousel-thumbs">
          {slides.map((slide, i) => (
            <button
              type="button"
              key={slide.src}
              className={`carousel-thumb${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`ไปที่รูปที่ ${i + 1}: ${slide.alt}`}
              aria-current={i === index ? 'true' : undefined}
            >
              <Image src={slide.src} alt="" fill sizes="60px" style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="carousel-nav"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          aria-label="รูปถัดไป"
        >
          ›
        </button>
      </div>

      <p className="carousel-hint muted">
        ปัดนิ้วซ้าย–ขวาได้บนมือถือ · กดปุ่ม ← → บนคีย์บอร์ดได้ · กดที่รูปเพื่อขยายเต็มจอ
      </p>

      {zoom && (
        <div
          className="carousel-zoom"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setZoom(false)}
        >
          <button type="button" className="carousel-zoom-close" aria-label="ปิด">
            ✕
          </button>
          <div className="carousel-zoom-inner">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
