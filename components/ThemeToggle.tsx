'use client';
import { useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n';
type Theme = 'light' | 'dark';
function subscribe(onChange: () => void) {
 const observer = new MutationObserver(onChange);
 observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
 return () => observer.disconnect();
}
function snapshot(): Theme { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }
export default function ThemeToggle({ locale = 'th' }: { locale?: Locale }) {
 const theme = useSyncExternalStore(subscribe, snapshot, () => null);
 function toggle() {
  const next: Theme = snapshot() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch { /* Private browsing may disallow persistence. */ }
 }
 return <button type="button" className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? (locale === 'en' ? 'Use light theme' : 'สลับเป็นโหมดสว่าง') : (locale === 'en' ? 'Use dark theme' : 'สลับเป็นโหมดมืด')}>
  <span aria-hidden="true">{theme === null ? '◐' : theme === 'dark' ? '☀' : '☾'}</span>
 </button>;
}
