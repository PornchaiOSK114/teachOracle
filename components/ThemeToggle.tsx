'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  // ค่าเริ่มต้นถูก set ไปแล้วโดยสคริปต์ใน <head> (กันจอกระพริบ) — ที่นี่แค่อ่านมาต่อ
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) ?? 'light';
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* โหมดส่วนตัวบางเบราว์เซอร์เขียน localStorage ไม่ได้ — ข้ามไป ธีมยังใช้ได้ในหน้านี้ */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
    >
      {/* กัน hydration mismatch: ก่อน mount แสดงไอคอนกลาง ๆ ไว้ก่อน */}
      <span aria-hidden="true">{!mounted ? '◐' : theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
