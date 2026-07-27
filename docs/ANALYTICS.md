# 📊 การติดตามสถิติและ SEO — teedba.com

เว็บนี้ใช้ 2 เครื่องมือคู่กัน แต่ละตัวตอบคำถามคนละแบบ

| เครื่องมือ | ตอบคำถามว่า | ราคา | ลิงก์ |
| :--- | :--- | :--- | :--- |
| **Cloudflare Web Analytics** | คนเข้าเว็บกี่คน อ่านหน้าไหน มาจากไหน ใช้อุปกรณ์อะไร | ฟรีไม่จำกัด | [แดชบอร์ด](https://dash.cloudflare.com/?to=/:account/web-analytics) |
| **Google Search Console** | คนค้นคำว่าอะไรแล้วเจอเรา อยู่อันดับเท่าไหร่ Google เก็บหน้าไหนไปแล้วบ้าง | ฟรี | [แดชบอร์ด](https://search.google.com/search-console?resource_id=sc-domain:teedba.com) |

> ทั้งคู่จำเป็น — Cloudflare บอกว่าคนที่ **เข้ามาแล้ว** ทำอะไร
> ส่วน Search Console บอกว่าคนที่ **ยังไม่เข้ามา** กำลังค้นหาอะไรอยู่ ซึ่งใช้เลือกหัวข้อบทความต่อไปได้

---

## 1. Cloudflare Web Analytics

### ทำไมต้องติดตั้ง JS Snippet เอง

Cloudflare ฉีดสคริปต์ให้อัตโนมัติได้เฉพาะเว็บที่วิ่งผ่าน **proxy** ของ Cloudflare (เมฆสีส้ม)
แต่ DNS ของเราตั้งเป็น **DNS only** ตามที่ Vercel กำหนด — traffic จึงไม่ผ่าน Cloudflare
⇒ ต้องเลือกโหมด **"Enable with JS Snippet installation"** แล้วใส่สคริปต์เองใน `components/Analytics.tsx`

ตอนสร้าง site ครั้งแรก Cloudflare จะตั้งเป็น "Automatic setup" ให้เอง
ถ้าเผลอปล่อยไว้จะ **ไม่มีข้อมูลเข้าเลย** ทั้งที่หน้าเว็บดูปกติดี

### การตั้งค่าที่ใช้อยู่

| รายการ | ค่า |
| :--- | :--- |
| Hostname | `teedba.com` |
| โหมด | Enable with JS Snippet installation |
| Beacon token | เก็บใน env `NEXT_PUBLIC_CF_BEACON_TOKEN` |
| ตั้งบน Vercel | Environment = **Production เท่านั้น** |

ตั้งเป็น Production อย่างเดียวเพื่อไม่ให้ยอดจาก preview deployment หรือ `npm run dev` ปนกับสถิติจริง
(ถ้าไม่ตั้ง env ตัวนี้ `components/Analytics.tsx` จะไม่โหลดสคริปต์เลย)

### เรื่อง PDPA

Cloudflare Web Analytics **ไม่ใช้ cookie และไม่เก็บข้อมูลระบุตัวบุคคล**
จึงไม่ต้องขึ้นแบนเนอร์ขอความยินยอม ต่างจาก Google Analytics 4 ที่ใช้ cookie และต้องมีแบนเนอร์

> ⚠️ ถ้าอนาคตเพิ่ม GA4 หรือ Meta Pixel เข้ามา **ต้องทำแบนเนอร์ขอความยินยอมด้วย**

### เปลี่ยน token ใหม่ยังไง

1. Cloudflare › Analytics › Web Analytics › Manage site › Install JS Snippet
2. คัดลอกค่าใน `"token": "..."`
3. Vercel › Settings › Environment Variables › แก้ `NEXT_PUBLIC_CF_BEACON_TOKEN`
4. Redeploy (env var จะมีผลก็ต่อเมื่อ build ใหม่)

---

## 2. Google Search Console

### วิธียืนยันที่ใช้

**Domain property** (`sc-domain:teedba.com`) ยืนยันด้วย **DNS TXT record**
ครอบคลุมทุก subdomain และทั้ง http/https ในทีเดียว

| Type | Name | Content |
| :--- | :--- | :--- |
| TXT | `teedba.com` (@) | `google-site-verification=7SNtCMPbot8RrG68bpwidGhXBG-G7HZFyKycz9X4Y8A` |

> ⚠️ **ห้ามลบ TXT record นี้** ไม่งั้นจะเสียสิทธิ์การยืนยันและข้อมูลทั้งหมดหายไป

> หมายเหตุ: Google เสนอวิธียืนยันอัตโนมัติโดยขอสิทธิ์เข้าถึงบัญชี Cloudflare DNS ผ่าน OAuth
> เราเลือกไม่ใช้ และใส่ TXT record เองแทน เพื่อไม่ต้องให้สิทธิ์ Google เข้าถึงบัญชี Cloudflare

### Sitemap

ส่ง `https://teedba.com/sitemap.xml` แล้ว — สถานะ **Success** พบ 6 หน้า

`app/sitemap.ts` สร้าง sitemap ใหม่อัตโนมัติทุกครั้งที่ build
เขียนบทความใหม่แล้ว push → sitemap อัปเดตเอง **ไม่ต้องส่งซ้ำ**

---

## 📈 3. วิธีอ่านสถิติ Cloudflare

เข้าที่ **Cloudflare › Analytics › Web Analytics › teedba.com**

### ตัวเลขหลัก 4 ตัว

| ตัวเลข | แปลว่า | ดูยังไง |
| :--- | :--- | :--- |
| **Visits** | จำนวน **ครั้งที่มีคนเข้ามาเยี่ยม** (1 คนเข้า 3 รอบใน 1 วัน = 3 visits) | ตัวเลขนี้ใกล้เคียง "จำนวนคน" ที่สุด |
| **Page views** | จำนวน **หน้าที่ถูกเปิด** ทั้งหมด | สูงกว่า Visits เสมอ |
| **Page views ÷ Visits** | เฉลี่ยคนหนึ่งอ่านกี่หน้า | **> 1.5 ถือว่าดี** แปลว่าคนอ่านแล้วกดอ่านต่อ |
| **Page load time** | เว็บโหลดเร็วแค่ไหนบนเครื่องคนอ่านจริง | **< 2.5 วินาที ถือว่าดี** |

### Core Web Vitals — คะแนนที่ Google ใช้จัดอันดับด้วย

| ตัวย่อ | วัดอะไร | เกณฑ์ผ่าน |
| :--- | :--- | :--- |
| **LCP** | เนื้อหาชิ้นใหญ่สุดโผล่ครบเมื่อไหร่ | < 2.5 วินาที |
| **INP** | กดแล้วเว็บตอบสนองเร็วแค่ไหน | < 200 มิลลิวินาที |
| **CLS** | หน้าเว็บกระโดดตอนโหลดไหม | < 0.1 |

ถ้าตัวไหนแดง มักมาจาก **รูปที่ใหญ่เกินไป** — ลองย่อรูปก่อนอัปโหลด

### รายงานที่ใช้ตัดสินใจได้จริง

| ดูที่ | บอกอะไร | เอาไปทำอะไร |
| :--- | :--- | :--- |
| **Top pages** | บทความไหนคนอ่านเยอะสุด | 👉 **เขียนเรื่องแนวเดียวกันเพิ่ม** |
| **Referrers** | คนมาจากไหน (Google / Facebook / พิมพ์ URL เอง) | ถ้า Google น้อย = ต้องปรับ SEO · ถ้า Facebook เยอะ = โพสต์เพจได้ผล |
| **Countries** | คนอ่านอยู่ประเทศไหน | เช็คว่าตรงกลุ่มเป้าหมาย (ไทย + ลาว) ไหม |
| **Device type** | มือถือหรือคอม | ถ้ามือถือ > 60% ให้ทดสอบบนมือถือทุกครั้งก่อน push |
| **Browsers / OS** | เบราว์เซอร์อะไร | ใช้ตอนมีคนแจ้งว่าเว็บเพี้ยน |

<!-- prettier-ignore -->
> 💡 **ตัวเลขที่ควรจับตาที่สุดคือ Top pages** — บอกตรง ๆ ว่าคนสนใจเรื่องอะไร
> เขียนเรื่องที่คนอ่านอยู่แล้วเพิ่ม ได้ผลกว่าเดาหัวข้อใหม่เอง

---

## 🔎 4. วิธีอ่าน Google Search Console

เข้าที่ **[Search Console › teedba.com](https://search.google.com/search-console?resource_id=sc-domain:teedba.com)**

### หน้า Performance — สำคัญที่สุด

| ตัวเลข | แปลว่า |
| :--- | :--- |
| **Impressions** | เว็บเราโผล่ในผลค้นหากี่ครั้ง (คนอาจไม่ได้กด) |
| **Clicks** | คนกดเข้ามากี่ครั้ง |
| **CTR** | `Clicks ÷ Impressions` — โผล่แล้วคนกดกี่ % |
| **Position** | อันดับเฉลี่ยในผลค้นหา (1 = บนสุด) |

### อ่านตัวเลขให้เป็นการตัดสินใจ

| อาการ | แปลว่า | ทำอะไร |
| :--- | :--- | :--- |
| Impressions สูง แต่ CTR ต่ำ (< 2%) | คนเห็นแต่ไม่กด | ✏️ **แก้ `title` และ `description` ให้น่าคลิกกว่าเดิม** |
| Position 11–20 | อยู่หน้า 2 ของ Google | ✏️ **เพิ่มเนื้อหาให้ลึกขึ้น** มีโอกาสดันขึ้นหน้าแรกสูง |
| Position < 10 แต่ CTR ต่ำ | หัวข้อไม่ตรงกับที่คนหา | ปรับ `title` ให้ตรงคำค้นมากขึ้น |
| Impressions เป็น 0 | Google ยังไม่เก็บหน้านี้ | ใช้ URL inspection → Request indexing |

### 🎯 เทคนิคเลือกหัวข้อบทความถัดไป (ใช้ได้ผลจริง)

1. เข้า **Performance › Queries**
2. เรียงตาม **Impressions** จากมากไปน้อย
3. หาคำที่ **Impressions สูง แต่ Clicks น้อย**

คำเหล่านั้นคือเรื่องที่ **คนไทยกำลังค้นหาเยอะ แต่เว็บเรายังตอบได้ไม่ดีพอ**
เขียนบทความตอบคำถามนั้นให้ตรงจุด = โอกาสติดอันดับสูงมาก เพราะรู้แล้วว่ามีคนหาจริง

### หน้าอื่นที่ควรดู

| หน้า | ดูอะไร |
| :--- | :--- |
| **Pages** (Indexing) | Google เก็บหน้าไหนไปแล้ว หน้าไหนถูกข้าม พร้อมเหตุผล |
| **Sitemaps** | สถานะ sitemap ต้องเป็น **Success** |
| **Core Web Vitals** | คะแนนความเร็วในมุมมองของ Google |
| **Links** | เว็บอื่นลิงก์มาหาเรากี่แห่ง (ยิ่งเยอะยิ่งน่าเชื่อถือในสายตา Google) |

<!-- prettier-ignore -->
> ⏳ ข้อมูล Search Console **ช้ากว่าความจริง 2–3 วัน** เสมอ
> เปิดดูทุกวันไม่มีประโยชน์ — ดูสัปดาห์ละครั้งกำลังดี

---

## เช็คว่าทำงานจริงไหม

**Cloudflare** — เปิด teedba.com แล้วดู DevTools › Network ต้องเห็นคำขอไปที่
`static.cloudflareinsights.com/beacon.min.js` · ข้อมูลจะขึ้นแดชบอร์ดภายในไม่กี่นาที

**Search Console** — ข้อมูล Performance ใช้เวลา **2–3 วัน** ถึงจะเริ่มมี
ส่วนหน้า Pages (การเก็บ index) อาจใช้เวลาเป็นสัปดาห์ อย่าเพิ่งตกใจถ้ายังว่าง

---

## สิ่งที่ยังไม่ได้ทำ (ทางเลือกในอนาคต)

- **Bing Webmaster Tools** — import จาก Search Console ได้ในคลิกเดียว ครอบคลุมคนใช้ Edge
- **Google Analytics 4** — ถ้าอยากได้ข้อมูลลึก เช่น คนอ่านบทความจบกี่ % หรือกดปุ่ม "สอบถาม" กี่ครั้ง
  (ต้องทำแบนเนอร์ PDPA ด้วย)
- **Custom events บน Cloudflare** — ปัจจุบันเก็บแค่ page view
