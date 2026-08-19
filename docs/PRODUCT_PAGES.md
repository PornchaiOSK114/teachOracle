# 🛒 คู่มือระบบหน้าผลิตภัณฑ์ (Product Pages)

เอกสารนี้อธิบายว่าหน้า `/products` และ `/products/[slug]` ทำงานยังไง
สร้างขึ้นมาด้วยหลักคิดอะไร และถ้าจะเพิ่มสินค้าเล่มที่ 2 ต้องแตะตรงไหนบ้าง

> **อยากเพิ่มสินค้าใหม่เร็ว ๆ ไม่ต้องอ่านทั้งหมด?**
> ข้ามไปที่ [`PRODUCT_TEMPLATE.md`](./PRODUCT_TEMPLATE.md) — เป็นแบบฟอร์มกรอกช่องว่างพร้อมใช้

---

## 1. ภาพรวม

```text
/products                          รายการสินค้า — 2 โซน
  ├─ โซน "พร้อมจำหน่าย"            การ์ดปกเล็ก + ราคา → คลิกไปหน้า detail
  └─ โซน "กำลังจะมา"               การ์ด SOON (ยังไม่มีหน้า detail)

/products/[slug]                   หน้ารายละเอียดสินค้า — เรียงบนลงล่าง 5 ส่วน
  1. ชื่อหนังสือ + ผู้เขียน
  2. รูปปก + แถบสรุป (ราคา / ประเภท / จำนวนหน้า / ภาษา / ของแถม)
  3. Carousel อ่านตัวอย่าง
  4. รายละเอียด (เรียบเรียงจากคำนำ) + ตารางสเปก
  5. Call to action + ปุ่มสั่งซื้อ
```

### หลักคิดที่อยู่เบื้องหลัง

| หลักคิด | ทำไม |
| :--- | :--- |
| **ข้อมูลสินค้าอยู่ใน `lib/site.ts` ที่เดียว** | ตรงกับกติกาของโปรเจกต์ — แก้ที่เดียวเปลี่ยนทั้งเว็บ ไม่มี CMS ไม่มี DB |
| **หน้า detail เป็น route เดียวใช้ซ้ำได้ (`[slug]`)** | เพิ่มเล่มที่ 2 = เติม object เดียวใน array ไม่ต้อง copy ไฟล์ |
| **รูปไม่ต้องระบุนามสกุล** | เจ้าของเว็บวางไฟล์ `.png` หรือ `.jpg` ก็ได้ ระบบหาให้เอง |
| **ไม่มีไฟล์รูป = ไม่พัง** | ขึ้นกล่อง placeholder แทน วางไฟล์ทีหลังรูปขึ้นเอง |
| **ปุ่มสั่งซื้ออ่านจาก environment variable** | เปลี่ยนลิงก์ชำระเงินได้โดยไม่ต้องแก้โค้ดและไม่ต้อง deploy ใหม่ |

---

## 2. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ | ต้องแตะตอนเพิ่มสินค้าไหม |
| :--- | :--- | :--- |
| `lib/site.ts` | ข้อมูลสินค้าทั้งหมด (`products`, `getProduct()`) | ✅ **ใช่ — ที่เดียว** |
| `public/images/products/<slug>/` | ปก + รูปตัวอย่าง | ✅ **ใช่ — วางไฟล์** |
| `lib/assets.ts` | หาไฟล์รูปโดยลองนามสกุลให้เอง (server-only) | ❌ ไม่ต้อง |
| `components/SampleCarousel.tsx` | Carousel อ่านตัวอย่าง (client component) | ❌ ไม่ต้อง |
| `app/products/page.tsx` | หน้ารายการสินค้า | ❌ ไม่ต้อง |
| `app/products/[slug]/page.tsx` | หน้ารายละเอียด + JSON-LD | ❌ ไม่ต้อง |
| `app/globals.css` หมวด 17 | สไตล์ทั้งหมดของหน้าผลิตภัณฑ์ | ❌ ไม่ต้อง |
| `app/sitemap.ts` | เพิ่ม URL สินค้าให้เอง | ❌ ไม่ต้อง (อัตโนมัติ) |
| `app/llms.txt/route.ts` | บอก AI crawler ว่ามีสินค้าอะไร | ❌ ไม่ต้อง (อัตโนมัติ) |

---

## 3. โครงสร้างข้อมูลสินค้า

อยู่ใน `lib/site.ts` — ทุกฟิลด์มี type กำกับ ถ้ากรอกผิด `tsc` จะฟ้องทันที

```ts
export type Product = {
  slug: string;          // ใช้เป็น URL: /products/<slug>
  title: string;
  subtitle: string;
  kind: string;          // 'E-Book (ไฟล์ PDF)' — ใช้ในตารางสเปกและ badge
  kindShort: string;     // 'E-Book · PDF' — ใช้บนการ์ด
  authorName: string;
  price: number;         // ตัวเลขล้วน ไม่ต้องใส่ ฿ หรือ comma
  currency: 'THB';
  pages: number;
  language: string;
  deliverables: readonly string[];   // สิ่งที่ลูกค้าได้รับหลังชำระเงิน
  imageDir: string;      // '/images/products/<slug>'
  coverFile: string;     // 'cover' — ไม่ต้องใส่นามสกุล
  cardDesc: string;      // คำโปรยสั้นบนการ์ด
  metaDesc: string;      // คำอธิบายสำหรับ SEO / OG / JSON-LD
  sections: readonly ProductSection[];
  samples: readonly ProductSample[];
  buyUrl: string;        // อ่านจาก process.env
};
```

### `sections` — เนื้อหาในหน้า detail

เป็น **discriminated union** 3 แบบ TypeScript จะบังคับให้กรอกครบตามชนิดที่เลือก

```ts
{ kind: 'paragraphs', heading?: string, items: string[] }        // ย่อหน้าธรรมดา
{ kind: 'bullets',    heading: string,  items: string[],
                      deny?: boolean }                            // deny: true = เครื่องหมาย ✕
{ kind: 'note',       heading?: string, text: string }            // กล่องเน้นข้อความ
```

- `heading` เป็น `''` (สตริงว่าง) = ไม่ขึ้นหัวข้อ ใช้ต่อจากย่อหน้าก่อนหน้าได้
- `deny: true` ใช้กับรายการ "สิ่งที่**ไม่**อยู่ในเล่มนี้" — เปลี่ยนหัวข้อย่อยจาก ▸ เป็น ✕

### `samples` — รูปตัวอย่างใน Carousel

```ts
{ group: 'สารบัญ', file: 'toc-01', alt: 'สารบัญ หน้า i' }
```

- `group` = ป้ายกำกับที่โชว์เหนือ carousel เปลี่ยนตามรูปที่เลื่อนถึง
- `file` = ชื่อไฟล์ **ไม่ต้องใส่นามสกุล**
- `alt` = คำบรรยายภาพ (จำเป็นต่อ accessibility และ SEO)
- ลำดับใน array = ลำดับใน carousel

---

## 4. ระบบรูปภาพ — `lib/assets.ts`

```ts
resolveAsset('/images/products/x/cover')
// เจอ  → '/images/products/x/cover.jpg'
// ไม่เจอ → null
```

ลองนามสกุลตามลำดับ: `.png` → `.jpg` → `.jpeg` → `.webp`

### ⚠️ กฎเหล็กข้อเดียวที่ห้ามลืม

`lib/assets.ts` ใช้ `node:fs` → **เป็น server-only**

```text
✅ ถูก:  page (server) เรียก resolveAsset() → ส่ง string ต่อเป็น prop → client component
❌ ผิด:  client component ('use client') import lib/assets.ts เข้าไปเอง
```

ถ้าทำผิด Turbopack จะพังตอน build ด้วย
`the chunking context does not support external modules (request: node:fs)`
และ **`tsc --noEmit` จับไม่ได้** — ต้องรัน `next build` ถึงจะเจอ

### ขนาดรูปที่แนะนำ

| รูป | ขนาด | นามสกุล | เหตุผล |
| :--- | :--- | :--- | :--- |
| ปก | กว้าง ~1024 px | `.jpg` คุณภาพ 88 | เป็นภาพถ่าย/กราฟิก JPEG คุ้มกว่า PNG มาก |
| หน้าในเล่ม | กว้าง ~1100 px | `.png` palette 64 สี | ตัวหนังสือบนพื้นขาว PNG palette คมเท่าเดิมแต่เล็กลง ~70% |

> เล่ม Oracle 26ai: 16 ไฟล์ ต้นฉบับ 6.82 MB → หลังบีบอัด **1.93 MB**
> Next.js `<Image>` จะแปลงเป็น AVIF/WebP ตอนเสิร์ฟให้อีกชั้นอยู่แล้ว

---

## 5. Carousel — `components/SampleCarousel.tsx`

เป็น `'use client'` component ที่รับ `slides: CarouselSlide[]` เข้ามาอย่างเดียว
**ไม่รู้จักระบบไฟล์เลย** — page ฝั่ง server เป็นคนหาไฟล์ให้ก่อน

ความสามารถ: scroll-snap ปัดนิ้วได้ · ปุ่ม ‹ › · แถบ thumbnail · ป้ายกลุ่ม + ตัวนับ ·
คีย์บอร์ด ← → · กดรูปเพื่อขยายเต็มจอ (Esc ปิด) · ล็อกการเลื่อนหน้าตอนขยาย

### 🐛 บั๊กที่เคยเจอ — อย่าทำซ้ำ

ต้นแบบแรกวาง carousel ไว้ในคอลัมน์ของ CSS Grid (layout แบบ 2 คอลัมน์)
สไลด์ที่กว้าง `100%` **ดันคอลัมน์จนล้นไปทับข้อความข้าง ๆ**

สาเหตุ: grid item มี `min-width: auto` เป็นค่าเริ่มต้น จึงหดต่ำกว่า min-content ไม่ได้

วิธีแก้ที่ใช้จริง:

1. หน้า detail เป็น **คอลัมน์เดียว** ไม่ใช้ grid หลายคอลัมน์
2. ใส่ `min-width: 0` ทุกชั้น: `.sample-carousel` → `.carousel-stage` → `.carousel-track` → `.carousel-slide`
3. ปุ่มลูกศรอยู่ **ใต้รูป** ไม่ลอยทับ

⚠️ ทั้ง `tsc` และ `next build` จับบั๊กนี้ไม่ได้ — ต้องเปิดดูหน้าจริงเท่านั้น

---

## 6. ปุ่มสั่งซื้อ

```ts
buyUrl: process.env.NEXT_PUBLIC_STRIPE_LINK_ORACLE26 ?? ''
```

| สถานะ | ผลลัพธ์บนหน้าเว็บ |
| :--- | :--- |
| ไม่ตั้งค่า env | ปุ่ม **disable** + ข้อความ "เปิดสั่งซื้อเร็ว ๆ นี้" + บรรทัดชี้ไป `/contact` |
| ตั้งค่าแล้ว | ปุ่ม **"สั่งซื้อ E-Book"** เปิดแท็บใหม่ไปหน้าชำระเงิน (`rel="noopener nofollow"`) |

ตั้งค่าที่ **Vercel › Settings › Environment Variables** แล้ว redeploy — ไม่ต้องแก้โค้ด

> ⚠️ ตัวแปรขึ้นต้น `NEXT_PUBLIC_` จะถูกฝังลง bundle ตอน build
> เปลี่ยนค่าแล้ว **ต้อง redeploy** ถึงจะมีผล (ไม่ใช่แค่ restart)
>
> วิธีตั้งค่า Stripe ทั้งหมด ดู [`STRIPE_SETUP.md`](./STRIPE_SETUP.md)

---

## 7. SEO ที่ติดมาให้อัตโนมัติ

| อย่าง | รายละเอียด |
| :--- | :--- |
| `generateStaticParams` | prerender หน้า detail ทุกเล่มเป็น static HTML ตอน build |
| `generateMetadata` | title / description / canonical / OG / Twitter card (ใช้ปกจริงเป็นรูป OG) |
| JSON-LD `Product` + `Offer` | ชื่อ ราคา สกุลเงิน THB สถานะ InStock ผู้เขียน รูปปก |
| JSON-LD `BreadcrumbList` | หน้าแรก → ผลิตภัณฑ์ → ชื่อหนังสือ |
| JSON-LD `ItemList` | รายการสินค้าในหน้า `/products` |
| `sitemap.xml` | เพิ่ม `/products/<slug>` ให้เองจาก array |
| `/llms.txt` | บอก AI crawler ว่ามีสินค้าอะไร ราคาเท่าไหร่ |

> ราคาใน JSON-LD `Offer` ทำให้ Google **อาจแสดงราคาในผลค้นหา** — ตั้งใจให้เป็นแบบนั้น

---

## 8. ขั้นตอนตรวจงานก่อน push (ทำครบทุกครั้ง)

```bash
npx tsc --noEmit     # 1. type ถูกไหม
npx next build       # 2. build ผ่านไหม — ตัวเดียวที่จับ node:fs หลุดเข้า client bundle
npx next start       # 3. เปิดดูหน้าจริง: desktop / มือถือ 390px / dark mode
```

**ข้อ 3 ข้ามไม่ได้** — บั๊ก layout ทับกันไม่มีเครื่องมือไหนจับได้นอกจากตาคน

เช็คลิสต์ตอนเปิดดูหน้าจริง:

- [ ] การ์ดในหน้า `/products` คลิกแล้วเข้าหน้า detail ถูกเล่ม
- [ ] รูปปกขึ้น ไม่ใช่กล่อง placeholder
- [ ] Carousel เลื่อนได้ครบทุกรูป ตัวนับตรง ป้ายกลุ่มเปลี่ยนตาม
- [ ] กดรูปแล้วขยายเต็มจอ กด Esc ปิดได้
- [ ] **ไม่มีส่วนไหนทับกัน** — เช็คทั้ง desktop และมือถือ 390px
- [ ] Dark mode อ่านออกทุกส่วน
- [ ] ปุ่มสั่งซื้อสถานะถูกต้อง (disable หรือลิงก์ไปถูกที่)

---

## 9. Deploy

โค้ดอยู่บนเครื่อง Windows ของเจ้าของเว็บ **git credentials อยู่บนเครื่องนั้นเท่านั้น**
agent/sandbox push เองไม่ได้ → ต้องทำไฟล์ `.bat` แล้วเจ้าของเว็บดับเบิลคลิก

ข้อกำหนดของไฟล์ `.bat`:

- บันทึกเป็น **UTF-8 with BOM** + ขึ้นบรรทัดใหม่แบบ **CRLF**
- ขึ้นต้นด้วย `chcp 65001` (ไม่งั้นภาษาไทยใน commit message เพี้ยน)
- ใส่ `if exist ".git\index.lock" del /f ".git\index.lock"` กัน lock ค้าง

### ⚠️ ห้ามใช้ `git add -A` ในโปรเจกต์นี้

โฟลเดอร์นี้มักมีการแก้ค้างที่ไม่เกี่ยวกับงานปัจจุบัน (เคยเจอไฟล์บทความถูกลบค้างไว้)
`git add -A` จะกวาดเข้า commit ทั้งหมด → ให้ `git add` ระบุ path ทีละไฟล์เสมอ
และให้สคริปต์พิมพ์ `git diff --cached --name-status` ให้ดูก่อน commit

---

## 10. อ่านต่อ

| ไฟล์ | เนื้อหา |
| :--- | :--- |
| [`PRODUCT_TEMPLATE.md`](./PRODUCT_TEMPLATE.md) | แบบฟอร์มกรอกช่องว่างสำหรับเพิ่มสินค้าใหม่ |
| [`STRIPE_SETUP.md`](./STRIPE_SETUP.md) | ตั้งค่าระบบชำระเงินและการส่งไฟล์ให้ลูกค้า |
| `../AGENTS.md` | สถาปัตยกรรมทั้งโปรเจกต์ + gotchas ทั้งหมด |
| [`CHANGELOG.md`](./CHANGELOG.md) | ประวัติการเปลี่ยนแปลงและเหตุผล |
