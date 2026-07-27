# 🤖 Agent Playbook — สร้างเว็บบล็อก/คอร์สแบบ teedba.com

> เอกสารนี้เขียนให้ **AI agent ตัวถัดไป** ใช้ "โคลน" สถาปัตยกรรมของ `teedba.com`
> ไปสร้างเว็บใหม่ได้เร็วและสม่ำเสมอ
>
> **เว็บอ้างอิง:** https://teedba.com · repo `PornchaiOSK114/teachOracle`
> **บรรพบุรุษ:** เว็บนี้สร้างจาก playbook ของ `kruteekidcode-blog` แล้วปรับปรุงต่อ
> ทุกข้อใน "Gotchas" คือปัญหาที่**เจอจริง**ระหว่างสร้าง ไม่ใช่ทฤษฎี

---

## 0. ปรัชญาการทำงาน (อ่านก่อนเริ่ม)

1. **คุยโครงสร้างก่อนลงมือ** ใช้เครื่องมือถามแบบตัวเลือกกับเรื่องที่กระทบทิศทาง
   (stack, จำนวนหน้า, พฤติกรรมฟอร์ม, วิธี deploy) — อย่าเดาเรื่องใหญ่
2. **ตรวจของจริงก่อนพูด** อย่าบอกว่า "ทำแล้ว" ถ้ายังไม่ได้เปิดดู
   เช่น ก่อนตอบว่าเว็บมี analytics ไหม ให้ `grep` โค้ดและเรียก API ดูก่อน
3. **verification ต้องเป็นขั้นตอนจริง** ไม่ใช่คำพูด — type-check, build, ดึงหน้าเว็บจริงมาแกะ HTML
4. **ข้อความไทยที่ผู้ใช้ให้มาถือเป็น final** คงสตริงเป๊ะ ไม่แก้คำเอง
5. **ห้ามกุข้อมูล** ถ้าไม่มีข้อมูลให้ถาม หรือเว้นเป็นช่องว่างพร้อมบอกผู้ใช้ตรง ๆ
   ว่าเว้นไว้เพราะอะไร — อย่าเติมตัวเลขสถิติหรือชื่อลูกค้าเอง
6. **เขียนโค้ดให้ทำงานก่อน แล้วค่อยเขียนเอกสาร** ไม่งั้นเอกสารจะโกหก
   (เจอจริง: จะเขียนคู่มือฝังวิดีโอ แต่เว็บยังไม่รองรับ → ต้องเขียนโค้ดก่อน)

---

## 1. Tech Stack

| ส่วน | เทคโนโลยี | หมายเหตุ |
| :--- | :--- | :--- |
| Framework | **Next.js 16** (App Router) + React 19 | ⚠️ ต่างจาก 13–15 มาก อ่าน `node_modules/next/dist/docs/` ก่อนใช้ API ที่ไม่ชัวร์ |
| ภาษา | TypeScript 5 (`strict`) | |
| เนื้อหา | **MDX** ผ่าน `next-mdx-remote/rsc` | render ฝั่ง server |
| Frontmatter | `gray-matter` · เวลาอ่าน `reading-time` | |
| Markdown plugins | `remark-gfm`, `rehype-slug`, `rehype-highlight` | |
| ฟอนต์ | `next/font/google` | ต้องมี `subsets: ['thai','latin']` |
| สไตล์ | **CSS ธรรมดา** + CSS variables | ไม่มี Tailwind |
| Analytics | Cloudflare Web Analytics | ไม่ใช้ cookie → ไม่ต้องมี banner PDPA |
| Newsletter | MailerLite ผ่าน API route ฝั่ง server | |
| Hosting | **Vercel** auto-deploy จาก GitHub | |
| DNS | **Cloudflare** (DNS only ห้าม proxy) | |

> **หลักการเลือก stack:** เว็บเนื้อหาของครู/ธุรกิจเล็ก เน้น SEO + แก้ง่าย
> → Next.js แบบ static-ish + ไฟล์ MDX เป็น "ฐานข้อมูล" (ไม่ต้องมี DB/CMS) คือ sweet spot

---

## 2. โครงสร้างโปรเจ็ค

```text
<project>/
├── app/
│   ├── layout.tsx              ฟอนต์, metadata, theme script, Navbar/Footer, JSON-LD, Analytics
│   ├── globals.css             🎨 design system ทั้งหมด
│   ├── page.tsx  not-found.tsx
│   ├── icon.svg  favicon.ico  apple-icon.png  opengraph-image.tsx
│   ├── robots.ts  sitemap.ts
│   ├── feed.xml/route.ts       RSS
│   ├── llms.txt/route.ts       สรุปเว็บให้ LLM (AIO)
│   ├── api/subscribe/route.ts  newsletter → บริการภายนอก
│   ├── articles/page.tsx  articles/[slug]/page.tsx
│   └── <หน้าอื่นตามโจทย์>
├── components/
│   ├── Navbar  Footer  ThemeToggle          ('use client' เฉพาะที่ต้อง interactive)
│   ├── ArticleCard  ArticleList  CourseCard
│   ├── NewsletterForm  AssetImage  Analytics  JsonLd
│   └── mdx/index.tsx           component ที่เรียกจากใน .mdx ได้
├── content/articles/*.mdx
├── lib/
│   ├── site.ts                 📌 ข้อมูลจริงทั้งหมดที่เดียว
│   ├── content.ts              อ่าน MDX (ใช้ node:fs — server only)
│   ├── format.ts               ฟังก์ชันบริสุทธิ์ (client ใช้ได้)
│   └── types.ts                type ที่ใช้ร่วมกัน
├── scripts/new-post.mjs
├── public/images/
└── docs/
```

**การแยก `lib/` เป็น 3 ไฟล์คือหัวใจ** — ดู Gotcha C ว่าทำไม

---

## 3. ลำดับงานที่ได้ผล

```
1. คุยโครงสร้าง + ขอ green light
2. package.json / tsconfig / next.config / .gitignore
3. globals.css  (design tokens ก่อน แล้วค่อยคลาส)
4. lib/site.ts  (ข้อมูลจริงทั้งหมด)  →  lib/types.ts  →  lib/format.ts  →  lib/content.ts
5. layout.tsx + Navbar/Footer/ThemeToggle
6. หน้าเว็บทีละหน้า
7. SEO/GEO/AIO layer
8. verification (tsc → build → แกะ HTML)
9. เอกสาร
```

**อย่าเขียน component ก่อน `lib/site.ts`** — ไม่งั้นจะ hard-code ข้อมูลกระจายเต็มไปหมด

---

## 4. Design System

วาง tokens ทั้งหมดใน `globals.css` บล็อก `:root` + `[data-theme="dark"]`

```css
:root {
  --bg  --surface  --surface-2  --text  --muted  --border
  --accent  --accent-2  --accent-soft  --ring
  --code-bg  --code-text  --shadow
  --nav-bg  --nav-text  --nav-muted  --nav-border  --nav-hover
  --radius-btn:11px  --radius-card:16px  --radius-lg:22px  --radius-pill:999px
  --space-1..20   (ฐาน 4px)
  --container:1200px  --gutter:clamp(18px,5vw,40px)
}
```

### หลัก responsive

- **Mobile-first + `clamp()`** แทน media query หลายชั้น
- กริด `repeat(auto-fill, minmax(300px, 1fr))` — ไม่ต้องเขียน breakpoint
- media query **จุดเดียว** ที่ `min-width: 860px` (สลับ hamburger ↔ เมนูเต็ม)
- ปุ่ม/ลิงก์สูง ≥ 44px · ห่อ `:hover` ด้วย `@media (hover: hover)`
- `env(safe-area-inset-*)` ที่ header/footer · `100svh` ไม่ใช่ `100vh`
- เคารพ `prefers-reduced-motion`

### สลับธีมไม่ให้กระพริบ

สคริปต์ inline ใน `<head>` อ่าน `localStorage.theme ?? prefers-color-scheme`
แล้ว set `document.documentElement.dataset.theme` **ก่อน paint**

```js
(function(){try{var t=localStorage.getItem('theme');
if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();
```

ปุ่ม toggle เป็น `'use client'` และต้องกัน hydration mismatch
(ก่อน mount แสดงไอคอนกลาง ๆ ไว้ก่อน)

---

## 5. ระบบเนื้อหา

**Frontmatter มาตรฐาน**

```yaml
title  description  tldr  category  tags  date(YYYY-MM-DD)  cover  draft
```

`tldr` เป็นของที่เพิ่มจาก playbook เดิม — **สำคัญที่สุดต่อ GEO/AIO**
ให้ validate `date` และ `title` ตอนอ่านไฟล์ แล้ว throw พร้อมชื่อไฟล์
(Vercel จะขึ้น error ที่อ่านรู้เรื่องแทนที่จะพังเงียบ)

**ตรรกะที่ต้องมีใน `content.ts`:** กรอง draft ตอน production · sort ตามวันที่ ·
related-by-tag (แท็กตรง ×2 + หมวดเดียวกัน ×1) · ดึงหัวข้อ H2 ทำสารบัญ

⚠️ **slug ของสารบัญต้องตรงกับ `rehype-slug`** ไม่งั้นลิงก์ `#anchor` จะเสีย
ให้เลียนแบบ github-slugger: lowercase → ตัดเครื่องหมายวรรคตอน → เว้นวรรคเป็น `-`

---

## 6. SEO / GEO / AIO — ชุดมาตรฐาน

| ต้องมี | ไฟล์ |
| :--- | :--- |
| metadata ต่อหน้า + canonical + OG/Twitter | ทุก `page.tsx` |
| `metadataBase` + title template | `layout.tsx` |
| JSON-LD `WebSite` + `Person` | `layout.tsx` |
| JSON-LD `BlogPosting` + `BreadcrumbList` | `articles/[slug]` |
| JSON-LD ตามประเภทหน้า (`Course`, `ProfilePage`, `ContactPage`) | หน้าที่เกี่ยวข้อง |
| `sitemap.ts` `robots.ts` `feed.xml` `opengraph-image.tsx` | `app/` |
| **`llms.txt`** สร้างจากข้อมูลจริงอัตโนมัติ | `app/llms.txt/route.ts` |
| **TL;DR ต้นบทความทุกชิ้น** | frontmatter `tldr` |
| เปิดทาง AI crawler ชัดเจนใน robots | GPTBot, ClaudeBot, PerplexityBot, Google-Extended ฯลฯ |

หัวใจของ GEO: **เนื้อหาต้องอยู่ใน HTML จริง ไม่ซ่อนหลัง JS**
ตรวจได้โดยดึงหน้าเว็บมาแล้ว grep หาข้อความไทย

---

## 7. Deploy pipeline

**สภาพแวดล้อม:** โค้ดอยู่บนเครื่อง Windows ของผู้ใช้ · **git credentials อยู่บนเครื่องผู้ใช้เท่านั้น**
agent push เองไม่ได้

**วิธีที่ใช้จริง**

1. แก้โค้ดในโฟลเดอร์ที่ mount
2. type-check + build ให้ผ่าน (ดูหัวข้อ 8)
3. สร้าง `.bat` (**UTF-8 BOM + CRLF** + `chcp 65001`) ที่รัน `git add/commit/push`
   ตั้งชื่อขึ้นต้นด้วยเลขลำดับเป็นภาษาไทย เช่น `2-อัปเดตเว็บ.bat`
4. ให้ผู้ใช้ **double-click ไฟล์ .bat เอง** (terminal เป็น tier "click" พิมพ์ไม่ได้)
5. ยืนยันผ่าน Vercel MCP: `list_teams` → `list_projects` → `list_deployments` จนสถานะ **READY**
6. `web_fetch` หน้าเว็บจริงมาตรวจ

**เชื่อมโดเมน (Cloudflare + Vercel)**

1. Vercel › Settings › Domains › Add → **เอาติ๊ก "Redirect apex to www" ออก** ถ้าใช้ apex เป็น canonical
2. อ่านค่า DNS ที่ Vercel ให้ (`<hash>.vercel-dns-017.com`) — **เป็นค่าเฉพาะโครงการ**
3. Cloudflare DNS: CNAME `@` และ `www` → ค่านั้น · **Proxy = DNS only**
4. เพิ่ม `www` ใน Vercel เป็น **308 Permanent Redirect** → apex

---

## 8. Verification (ห้ามข้าม)

```bash
# 1) เตรียม node_modules ใน /tmp  (mount ช้ามาก อย่า symlink)
mkdir -p /tmp/build /tmp/npmtmp && cp <MOUNT>/package.json /tmp/build/
cd /tmp/build && TMPDIR=/tmp/npmtmp npm install --prefer-offline --no-audit --no-fund

# 2) คัดลอกซอร์สไป /tmp + strip NUL
rm -rf /tmp/tc && mkdir -p /tmp/tc
cd <MOUNT> && tar --exclude=node_modules --exclude=.next --exclude=.git -cf - . | (cd /tmp/tc && tar xf -)
cd /tmp/tc && find . -name "*.ts" -o -name "*.tsx" | xargs -r sed -i 's/\x00//g'
cp -al /tmp/build/node_modules ./node_modules      # hardlink เร็วกว่า cp -r มาก

# 3) type-check
./node_modules/.bin/tsc --noEmit

# 4) build จริง (stub ฟอนต์ + ย้าย opengraph-image ออกก่อน — ดู Gotcha A/B)
./node_modules/.bin/next build

# 5) แกะ HTML ที่ prerender ออกมาตรวจ JSON-LD / canonical / ข้อความไทย
python3 -c "..."   # อ่าน .next/server/app/*.html
```

**`tsc` อย่างเดียวไม่พอ** — Gotcha C เป็นบั๊กที่ type ถูกหมดแต่ build พัง

---

## 9. Gotchas (เจอจริงทั้งหมด)

### A. `next/font/google` build ไม่ผ่านในแซนด์บ็อกซ์

proxy บล็อก `fonts.googleapis.com` (HTTP 403) → build ล้ม
⇒ ตอนทดสอบให้ stub ฟอนต์ออกชั่วคราว บน Vercel ทำงานปกติ

### B. `next/og` ทำ build worker ตาย SIGBUS ในแซนด์บ็อกซ์

WASM renderer ใช้ mmap เกินที่แซนด์บ็อกซ์ให้ — **แม้ OG image ที่ง่ายที่สุดก็ตาย**
⇒ ย้าย `opengraph-image.tsx` ออกก่อน build ทดสอบ · บน Vercel ทำงานปกติ (ยืนยันด้วยตาแล้ว)

### C. 🔴 `node:fs` หลุดเข้า client bundle — **`tsc` จับไม่ได้**

client component (`'use client'`) ที่ import **ค่า** (ไม่ใช่ type) จากไฟล์ที่ใช้ `node:fs`
จะทำให้ Turbopack พังด้วย `the chunking context does not support external modules`

```
ArticleList ('use client') → ArticleCard → formatDateThai จาก lib/content.ts (มี fs) 💥
```

⇒ **แยกไฟล์ตามขอบเขต:** `lib/format.ts` (บริสุทธิ์) · `lib/types.ts` (type) · `lib/content.ts` (fs)
`import type` ถูกลบตอน compile จึงปลอดภัย แต่ **value import ไม่ปลอดภัย**

### D. Turbopack ไม่ยอมรับ symlink `node_modules`

`Symlink [project]/node_modules is invalid, it points out of the filesystem root`
⇒ ใช้ `cp -al` (hardlink) แทน `ln -s`

### E. ไฟล์ที่เพิ่งเขียนบน mount อาจอ่านเป็น NUL bytes

⇒ คัดลอกไป `/tmp` แล้ว `sed -i 's/\x00//g'` ก่อน type-check

### F. background process ไม่รอดข้าม bash call

แต่ละ call แยก PID namespace — `nohup`/`setsid` ก็ไม่ช่วย
และ **`pgrep -f` จะ match command line ของตัวเอง** ทำให้เข้าใจผิดว่ายังรันอยู่
⇒ ทุกอย่างต้องจบใน 1 call (< 45 วินาที) · เช็คผลจาก**ไฟล์** ไม่ใช่จาก process

### G. `/tmp` เร็ว แต่ `TMPDIR` ชี้ไปที่ mount ที่ช้า

⇒ ตั้ง `TMPDIR=/tmp/npmtmp` ตอน `npm install` ไม่งั้นช้ากว่าหลายเท่า

### H. Cloudflare Web Analytics "Automatic setup" ไม่ทำงานกับ Vercel

automatic ฉีดสคริปต์ผ่าน **proxy** เท่านั้น แต่ Vercel บังคับ **DNS only**
⇒ ไม่มีข้อมูลเข้าเลยทั้งที่หน้าเว็บดูปกติ
⇒ ต้องเข้า Manage site เปลี่ยนเป็น **"Enable with JS Snippet installation"** แล้วใส่เอง

### I. ฟอนต์ไทยใน `next/og`

ฟอนต์เริ่มต้นไม่มีสระไทย → ได้กล่องว่าง
⇒ fetch ฟอนต์ไทยจาก Google Fonts มาใส่ พร้อม `try/catch` fallback เป็นอักษรละติน

### J. Search Console เสนอยืนยันผ่าน OAuth เข้าถึง Cloudflare

⇒ เลือก **"Any DNS provider"** แล้วใส่ TXT record เอง จะได้ไม่ต้องให้สิทธิ์ข้ามบัญชี
⇒ sitemap ที่เพิ่งส่งจะขึ้น "Couldn't fetch" อยู่ครู่หนึ่ง — รีเฟรชแล้วเป็น Success

### K. `NEXT_PUBLIC_*` ห้ามตั้งเป็น Sensitive บน Vercel

ตัวแปรนี้ต้องฝังลง client bundle ⇒ ปิดสวิตช์ Sensitive
และตั้ง **Production เท่านั้น** เพื่อไม่ให้ยอด preview ปนสถิติจริง

---

## 10. Checklist สร้างเว็บใหม่

- [ ] ถามผู้ใช้: จุดประสงค์, จำนวนหน้า, stack, hosting, ฟอร์ม → รอ green light
- [ ] scaffold config + `.gitignore` (ใส่ `*.bat`, ไฟล์ดีไซน์ต้นฉบับ, `.env*`)
- [ ] `globals.css` — tokens ก่อน แล้วคลาส
- [ ] `lib/site.ts` → `types.ts` → `format.ts` → `content.ts` (แยก 3 ไฟล์ตาม Gotcha C)
- [ ] ฟอนต์ผ่าน `next/font` พร้อม `subsets: ['thai','latin']`
- [ ] theme no-flash script ใน `<head>`
- [ ] หน้าเว็บครบ + 404
- [ ] SEO/GEO/AIO ครบ (ตารางหัวข้อ 6)
- [ ] favicon 3 แบบ (`icon.svg` + `favicon.ico` หลายขนาด + `apple-icon.png`)
- [ ] `AssetImage` สำหรับรูปที่ยังไม่มีไฟล์
- [ ] verification: tsc ✅ → build ✅ → แกะ HTML ✅
- [ ] เอกสาร: `README.md` `WRITING_GUIDE.md` `AGENTS.md` `docs/ANALYTICS.md` `docs/CHANGELOG.md` playbook นี้
- [ ] deploy → เชื่อมโดเมน → analytics → Search Console + sitemap

---

_อัปเดตล่าสุด: กรกฎาคม 2026 — อ้างอิงจาก teedba.com_
_ถ้าเจอ gotcha ใหม่ ให้เพิ่มลงหัวข้อ 9 พร้อมอาการที่เห็นจริง เพื่อให้ agent ตัวถัดไปไม่ต้องเสียเวลาซ้ำ_
