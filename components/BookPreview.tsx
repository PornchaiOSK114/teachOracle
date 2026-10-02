"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CarouselSlide } from "./SampleCarousel";
import styles from "./OracleBookLanding.module.css";

/** Public sample pages only. Native dialog supplies focus trapping and Escape. */
export default function BookPreview({ slides, locale = "th" }: { slides: CarouselSlide[]; locale?: "th" | "en" }) {
  const groups = [...new Set(slides.map((slide) => slide.group))];
  const [group, setGroup] = useState(
    groups.includes(locale === "en" ? "Sample pages" : "ตัวอย่างเนื้อหา") ? (locale === "en" ? "Sample pages" : "ตัวอย่างเนื้อหา") : groups[0],
  );
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filtered = slides.filter((slide) => slide.group === group);
  const current = filtered[index];

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!current) return null;

  function move(delta: number) {
    setIndex((value) =>
      Math.max(0, Math.min(filtered.length - 1, value + delta)),
    );
    dialogRef.current?.scrollTo({ top: 0 });
  }

  return (
    <div className={styles.preview}>
      <div className={styles.previewToolbar}>
        <div
          className={styles.filters}
          role="group"
          aria-label={locale === 'en' ? 'Sample page categories' : 'หมวดหน้าตัวอย่าง'}
        >
          {groups.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={group === name}
              onClick={() => {
                setGroup(name);
                setIndex(0);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <span className={styles.small}>{locale === 'en' ? 'Select a page to enlarge it' : 'กดที่หน้าเพื่ออ่านภาพขนาดใหญ่'}</span>
      </div>
      <div className={styles.pageGrid}>
        {filtered.map((slide, i) => (
          <button
            type="button"
            className={styles.pageButton}
            key={slide.src}
            aria-label={`${locale === "en" ? "Enlarge" : "ขยายรูป"}: ${slide.alt}`}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          >
            <span className={styles.pageImage}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 600px) 42vw, (max-width: 900px) 28vw, 220px"
                style={{ objectFit: "contain" }}
              />
              <span className={styles.zoomHint} aria-hidden="true">
                {locale === 'en' ? 'Read this page ↗' : 'อ่านหน้านี้ ↗'}
              </span>
            </span>
            <span className={styles.pageCaption}>
              {slide.alt.replace("ตัวอย่างเนื้อหา — ", "")}
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="book-preview-title"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className={styles.dialogHead}>
          <p id="book-preview-title">{current.alt}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={locale === 'en' ? 'Close enlarged page' : 'ปิดภาพขยาย'}
          >
            {locale === 'en' ? 'Close ×' : 'ปิด ×'}
          </button>
        </div>
        {open && (
          <Image
            src={current.src}
            alt={current.alt}
            width={1100}
            height={1605}
            sizes="(max-width: 800px) 94vw, 800px"
            className={styles.dialogImage}
          />
        )}
        <div className={styles.dialogControls}>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => move(-1)}
            aria-label={locale === 'en' ? 'Previous image' : 'รูปก่อนหน้า'}
          >
            {locale === 'en' ? '← Previous' : '← ก่อนหน้า'}
          </button>
          <span aria-live="polite">
            {index + 1} / {filtered.length}
          </span>
          <button
            type="button"
            disabled={index === filtered.length - 1}
            onClick={() => move(1)}
            aria-label={locale === 'en' ? 'Next image' : 'รูปถัดไป'}
          >
            {locale === 'en' ? 'Next →' : 'ถัดไป →'}
          </button>
        </div>
      </dialog>
    </div>
  );
}
