/**
 * ข้อมูลคงที่ของเว็บทั้งหมดอยู่ที่ไฟล์นี้ที่เดียว — แก้ที่นี่ = เปลี่ยนทั้งเว็บ
 *
 * ⚠️ กติกา: ทุกค่าในไฟล์นี้ต้องเป็นข้อมูลจริงที่เจ้าของเว็บยืนยันแล้วเท่านั้น
 * ห้ามเติมตัวเลขสถิติ / ชื่อองค์กรลูกค้า / รีวิว ที่ไม่ได้รับการยืนยัน
 */

export const site = {
  name: 'อาจารย์ตี๋ที่สอน Oracle',
  shortName: 'อาจารย์ตี๋',
  // โดเมนจริง (จดที่ Cloudflare) — ตั้ง NEXT_PUBLIC_SITE_URL ทับได้ถ้าต้องการชี้ไปที่อื่น
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teedba.com',
  locale: 'th_TH',
  lang: 'th',
  description:
    'แชร์ความรู้ Oracle Database เชิงลึกโดยอาจารย์ตี๋ (พรชัย ครองธรรมชาติ) ผู้เชี่ยวชาญระดับ Oracle Certified Professional ประสบการณ์มากกว่า 20 ปี สำหรับ DBA, Developer และ Data Engineer',
  tagline: 'สอนด้วยประสบการณ์ Oracle Database มากกว่า 20 ปี',
} as const;

export const author = {
  name: 'พรชัย ครองธรรมชาติ',
  nickname: 'อาจารย์ตี๋',
  jobTitle: 'Oracle Database Expert / วิทยากรและที่ปรึกษา',
  credential: 'Oracle Certified Professional (OCP)',
  yearsExperience: '20+',
  email: 'pornchai.krong@gmail.com',
  facebook: 'https://www.facebook.com/teeDBA',
  facebookLabel: 'อาจารย์ตี๋ที่สอน Oracle',
  /** initials ใช้แทนรูปโปรไฟล์ตอนยังไม่มีไฟล์รูป */
  initials: 'ตี๋',
} as const;

/** ผู้ดูแลงานอบรม (ข้อมูลจากต้นแบบดีไซน์ที่เจ้าของเว็บกรอกเอง) */
export const trainingPartner = {
  name: 'Thailand Training Center (TTC)',
  email: 'thailandtrainingcenter@gmail.com',
  phone: '089-408-6789',
  phoneHref: 'tel:+66894086789',
  note: 'สอบถามข้อมูลหลักสูตร, ตารางอบรมแบบ public training, ขอใบเสนอราคา และจัดอบรม in-house training สำหรับองค์กร',
} as const;

export const expertise = [
  'Oracle DBA',
  'SQL Performance Tuning',
  'PL/SQL',
  'RMAN Backup & Recovery',
  'Oracle RAC',
  'Oracle Linux',
] as const;

export const stats = [
  { num: '20+', label: 'ปีประสบการณ์' },
  { num: 'OCP', label: 'Certified Professional' },
  { num: '6', label: 'หลักสูตรที่เปิดสอน' },
] as const;

export type Course = {
  slug: string;
  code: string;
  title: string;
  level: string;
  duration: string;
  desc: string;
  tags: string[];
};

/** 6 หลักสูตรจริงที่เปิดสอน */
export const courses: Course[] = [
  {
    slug: 'oracle-database-administrator',
    code: 'DBA-101',
    title: 'Oracle Database Administrator (DBA)',
    level: 'กลาง–สูง',
    duration: '5 วัน',
    desc: 'ครอบคลุมงานดูแลระบบฐานข้อมูลตั้งแต่ Architecture, การจัดการ Storage, User & Security ไปจนถึงการดูแลประจำวัน',
    tags: ['Architecture', 'Security', 'Tablespace'],
  },
  {
    slug: 'sql-and-sqlplus',
    code: 'SQL-101',
    title: 'SQL & SQL*Plus',
    level: 'เริ่มต้น',
    duration: '3 วัน',
    desc: 'พื้นฐานการเขียน SQL ตั้งแต่ SELECT, JOIN, Subquery จนถึงการใช้เครื่องมือ SQL*Plus อย่างมืออาชีพ',
    tags: ['SELECT', 'JOIN', 'SQL*Plus'],
  },
  {
    slug: 'plsql-programming',
    code: 'PLSQL-201',
    title: 'PL/SQL Programming',
    level: 'กลาง',
    duration: '4 วัน',
    desc: 'เขียนโปรแกรมในฐานข้อมูลด้วย PL/SQL — Procedure, Function, Package, Trigger และการจัดการ Exception',
    tags: ['Procedure', 'Package', 'Trigger'],
  },
  {
    slug: 'sql-performance-tuning',
    code: 'TUNE-301',
    title: 'SQL Performance Tuning',
    level: 'สูง',
    duration: '4 วัน',
    desc: 'วิเคราะห์และปรับปรุงประสิทธิภาพ SQL ด้วย Execution Plan, Index Strategy, Statistics และ Optimizer Hints',
    tags: ['Execution Plan', 'Index', 'AWR'],
  },
  {
    slug: 'rman-backup-and-recovery',
    code: 'RMAN-201',
    title: 'RMAN Backup & Recovery',
    level: 'กลาง–สูง',
    duration: '3 วัน',
    desc: 'วางแผนและปฏิบัติจริงเรื่องการสำรองและกู้คืนข้อมูลด้วย Recovery Manager (RMAN) พร้อมสถานการณ์กู้ระบบ',
    tags: ['RMAN', 'Restore', 'Flashback'],
  },
  {
    slug: 'oracle-linux-for-dba',
    code: 'LINUX-101',
    title: 'Oracle Linux for DBA',
    level: 'กลาง',
    duration: '3 วัน',
    desc: 'ทักษะ Linux ที่ DBA ต้องใช้ — การจัดการ Package, Storage, Kernel parameter และการเตรียมเครื่องสำหรับ Oracle',
    tags: ['Shell', 'Kernel', 'Storage'],
  },
];

/** เส้นทางและความเชี่ยวชาญ (หน้า /about) */
export const timeline = [
  {
    title: 'Oracle Certified Professional (OCP)',
    desc: 'ได้รับการรับรองความเชี่ยวชาญด้าน Oracle Database ในระดับมืออาชีพ',
  },
  {
    title: 'อาจารย์สอน Oracle Database ให้องค์กร (20+ ปี)',
    desc: 'ถ่ายทอดความรู้เชิงลึกให้ทีมงานและองค์กรจำนวนมาก เน้นการนำไปใช้จริงบน Production',
  },
  {
    title: 'คอลัมนิสต์นิตยสาร Windows IT Pro — คอลัมน์ DATABASE',
    desc: 'เขียนบทความเผยแพร่ความรู้ด้านฐานข้อมูลให้ผู้อ่านในวงกว้าง',
  },
  {
    title: 'นักเขียน Pocket Book ระดับ Best Seller',
    desc: 'ผลงานหนังสือด้านเทคโนโลยีและการสร้างแบรนด์ที่ได้รับความนิยม',
  },
] as const;

/**
 * ผลงานหนังสือ/คอลัมน์
 * image = path ใต้ /public — วางไฟล์รูปตามชื่อนี้แล้วรูปจะขึ้นเองโดยไม่ต้องแก้โค้ด
 */
export const books = [
  {
    type: 'คอลัมน์',
    title: 'นิตยสาร Windows IT Pro — คอลัมน์ DATABASE',
    image: '/images/books/windows-it-pro.jpg',
  },
  {
    type: 'Pocket Book · Best Seller',
    title: 'Apps ยอดฮิต ติดใจ',
    image: '/images/books/apps-yodhit.jpg',
  },
  {
    type: 'Pocket Book · Best Seller',
    title: 'สร้างแบรนด์ทำเงินด้วยโซเชียลมีเดีย',
    image: '/images/books/brand-social.jpg',
  },
] as const;

/**
 * โลโก้ลูกค้า 25 ช่อง — ยังไม่มีไฟล์รูป จึงเป็น placeholder ทั้งหมด
 * วางไฟล์ /public/images/customers/org-01.png ... org-25.png แล้วรูปจะขึ้นเอง
 * (ยังไม่ระบุ "ชื่อ" องค์กรใด ๆ เพราะยังไม่ได้รับการยืนยันจากเจ้าของเว็บ)
 */
export const customerLogoSlots = Array.from({ length: 25 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { id: `org-${n}`, image: `/images/customers/org-${n}.png` };
});

/* ============================================================
   ผลิตภัณฑ์ที่ "วางขายแล้ว"
   ------------------------------------------------------------
   ⚠️ ทุกค่าในนี้ต้องเป็นข้อมูลจริงที่เจ้าของเว็บยืนยันแล้ว
      (ราคา / จำนวนหน้า / ชื่อผู้เขียน / คำโปรย — ห้ามกุเพิ่มเอง)
   คำโปรยเรียบเรียงจากไฟล์ต้นฉบับ `03preface.md` ของหนังสือ
   ============================================================ */

/** ส่วนเนื้อหาในหน้ารายละเอียดสินค้า — ใช้ discriminated union เพื่อให้ TS ตรวจให้ครบทุกกรณี */
export type ProductSection =
  | { kind: 'paragraphs'; heading?: string; items: readonly string[] }
  | { kind: 'bullets'; heading: string; items: readonly string[]; deny?: boolean }
  | { kind: 'note'; heading?: string; text: string };

/** รูปตัวอย่างในเล่ม 1 ใบ (file = ชื่อไฟล์ "ไม่ต้องใส่นามสกุล" ระบบหาให้เองทั้ง .png/.jpg/.webp) */
export type ProductSample = {
  group: string;
  file: string;
  alt: string;
};

export type Product = {
  slug: string;
  title: string;
  subtitle: string;
  /** ประเภทแบบเต็ม ใช้ในตารางสเปก */
  kind: string;
  /** ประเภทแบบสั้น ใช้บนการ์ด */
  kindShort: string;
  authorName: string;
  price: number;
  currency: 'THB';
  pages: number;
  language: string;
  /** สิ่งที่ลูกค้าได้รับหลังชำระเงิน */
  deliverables: readonly string[];
  /** โฟลเดอร์รูปใต้ /public (ไม่มี / ปิดท้าย) */
  imageDir: string;
  /** ชื่อไฟล์ปก ไม่ต้องใส่นามสกุล */
  coverFile: string;
  /** คำโปรยสั้นบนการ์ดหน้า /products */
  cardDesc: string;
  /** คำอธิบายสำหรับ metadata/SEO */
  metaDesc: string;
  sections: readonly ProductSection[];
  samples: readonly ProductSample[];
  /**
   * ลิงก์หน้าชำระเงิน — อ่านจาก environment variable
   * ยังไม่ตั้งค่า = ปุ่มจะ disable อัตโนมัติ (ไม่มีปุ่มตายให้ลูกค้ากดแล้ว 404)
   * ตั้งค่าที่ Vercel › Settings › Environment Variables แล้ว redeploy = ปุ่มทำงานทันที
   */
  buyUrl: string;
  /** โปรโมชันราคาพิเศษแบบมีวันหมดอายุ — ไม่มีก็เว้นไว้ได้ */
  promo?: ProductPromo;
};

/**
 * โปรโมชันราคาพิเศษ (เช่น ราคาศิษย์เก่า)
 * กล่องโปรจะหายไปเองเมื่อพ้น `endsAt` ไม่ต้องกลับมาแก้โค้ด
 */
export type ProductPromo = {
  /** ชื่อโปรที่แสดงบนกล่อง */
  label: string;
  price: number;
  /** ลิงก์ฟอร์มสั่งซื้อ (Apps Script Web App) — ยังไม่ตั้งค่า = ปุ่ม disable */
  orderUrl: string;
  /** ข้อความบนปุ่ม */
  buttonLabel: string;
  /** ช่องทางสำรอง แสดงเป็นลิงก์ข้อความใต้ปุ่ม ใช้ได้เสมอแม้ฟอร์มยังไม่พร้อม */
  fallbackUrl: string;
  fallbackLabel: string;
  /** ขั้นตอนสั่งซื้อ แสดงเป็นรายการมีเลขกำกับ */
  steps: readonly string[];
  /**
   * อธิบายว่าต้องใช้รหัสอะไร
   * ⚠️ ห้ามใส่ตัวรหัสจริงลงในนี้ เพราะไฟล์นี้ขึ้นหน้าเว็บสาธารณะ
   *    ถ้าพิมพ์รหัสลงไป ใครเปิดหน้าเว็บก็ได้รหัสไปหมด รหัสจะไม่เหลือค่าเป็นตัวกรองศิษย์เก่าอีกต่อไป
   */
  codeHint: string;
  /** วันเวลาปิดรับ รูปแบบ ISO 8601 พร้อม offset ไทย +07:00 (ใช้ตัดสินว่าจะโชว์กล่องไหม) */
  endsAt: string;
  /** ข้อความวันปิดรับที่แสดงให้คนอ่าน เขียนเอง ไม่ต้องพึ่งการ format วันที่ */
  deadlineLabel: string;
  /** ข้อความบอกวันส่งไฟล์ */
  deliverNote: string;
  /** ข้อความเตือนเรื่องอีเมล แสดงเป็นสีแดง */
  warning: string;
};

/** โปรยังเปิดรับอยู่ไหม (ประเมินฝั่ง server ตอนสร้างหน้า) */
export function isPromoOpen(promo: ProductPromo | undefined): promo is ProductPromo {
  if (!promo) return false;
  const ends = new Date(promo.endsAt).getTime();
  return Number.isFinite(ends) && Date.now() < ends;
}

const ORACLE_26AI_DIR = '/images/products/oracle-26-ai-sql-tuning';

export const products: readonly Product[] = [
  {
    slug: 'oracle-26-ai-sql-tuning',
    title: 'Oracle 26ai SQL Tuning',
    subtitle: 'จูน SQL ให้เร็วขึ้น อย่างเป็นขั้นตอน — เข้าใจหลักการ ครอบคลุมตั้งแต่เวอร์ชั่น 19c ถึง 26ai',
    kind: 'E-Book (ไฟล์ PDF)',
    kindShort: 'E-Book · PDF',
    authorName: `${author.name} (${author.nickname})`,
    price: 790,
    currency: 'THB',
    pages: 173,
    language: 'ไทย',
    deliverables: ['ไฟล์ PDF 173 หน้า', 'สคริปต์ติดตั้งสภาพแวดล้อมแล็บ (.zip)'],
    imageDir: ORACLE_26AI_DIR,
    coverFile: 'cover',
    cardDesc: 'จูน SQL ให้เร็วขึ้นอย่างเป็นขั้นตอน ครอบคลุมตั้งแต่ 19c ถึง 26ai',
    metaDesc:
      'E-Book ภาษาไทย 173 หน้า ว่าด้วย SQL Tuning บน Oracle Database ครอบคลุม 19c ถึง 26ai — Cost-Based Optimizer, Execution Plan, Statistics, Index, Join, Hints, SQL Plan Management พร้อมเวิร์กช็อป 4 เคสจริง โดยอาจารย์ตี๋ (พรชัย ครองธรรมชาติ)',
    sections: [
      {
        kind: 'paragraphs',
        items: [
          'เท่าที่ผมหาดู ตอนนี้ยังไม่มีหนังสือภาษาไทยเล่มไหนที่เขียนเรื่อง SQL Tuning บน Oracle เวอร์ชัน 26ai ออกมาเลย และถ้ามองภาพกว้างกว่านั้น คนที่ออกมาถ่ายทอดความรู้เรื่อง Oracle Database เป็นภาษาไทยก็แทบจะหาไม่เจอ',
          'ผมไม่คิดว่าเป็นเพราะไม่มีคนเก่งนะครับ คนเก่งมีเยอะ แต่การนั่งเรียบเรียงองค์ความรู้ออกมาเป็นเล่มมันกินเวลามาก และคนที่เก่งพอจะเขียนได้มักจะยุ่งเกินกว่าจะมีเวลานั่งเขียน ผมเองก็เกือบไม่เขียนด้วยเหตุผลเดียวกัน',
          'ผลที่ตามมาคือ DBA และ Developer ไทยจำนวนมากต้องไปงมเอาเองจาก Oracle Documentation ซึ่งเป็นภาษาอังกฤษล้วน อ่านได้อยู่ครับ แต่กว่าจะปะติดปะต่อว่าเรื่องไหนต่อกับเรื่องไหนก็เสียเวลาไปหลายเดือน',
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'เล่มนี้เขียนให้ใคร',
        items: [
          'ผมเขียนให้คนที่เจอสถานการณ์นี้ — ระบบเคยเร็ว อยู่ดี ๆ ก็ช้าลง พอเปิด query ขึ้นมาดูแล้วยังไม่รู้ว่าจะเริ่มแก้ตรงไหน',
        ],
      },
      {
        kind: 'bullets',
        heading: '',
        items: [
          'DBA และ Developer ที่ทำงานกับ Oracle อยู่แล้ว',
          'คนที่เรียนวิชาฐานข้อมูลมาแล้ว และอยากรู้ว่าหน้างานจริงเป็นยังไง',
        ],
      },
      {
        kind: 'bullets',
        heading: 'พื้นฐานที่ต้องมี',
        items: [
          'เขียน SQL ได้ และอ่าน SELECT ที่มี join หลายตารางแล้วเข้าใจ',
          'เคยใช้ SQL*Plus หรือ SQLcl มาบ้าง',
        ],
      },
      {
        kind: 'note',
        text: 'ส่วน optimizer, execution plan และ statistics ไม่ต้องรู้มาก่อน เดี๋ยวผมสอนให้',
      },
      {
        kind: 'paragraphs',
        heading: 'ขอบเขตของเล่มนี้',
        items: [
          'เล่มนี้จูนที่ระดับคำสั่ง SQL เท่านั้น สิ่งที่ไม่อยู่ในเล่ม คือเรื่องที่ไม่ได้อยู่ในมือของโปรแกรมเมอร์:',
        ],
      },
      {
        kind: 'bullets',
        heading: '',
        deny: true,
        items: [
          'Instance tuning (การปรับ SGA/PGA ระดับ instance)',
          'System tuning (OS, storage, network)',
          'PL/SQL tuning',
        ],
      },
      {
        kind: 'paragraphs',
        heading: 'วิธีอ่านให้ได้ผล',
        items: [
          'อย่าอ่านอย่างเดียวครับ ติดตั้งแล็บแล้วรันตามไปด้วยทุกบท — ชุดติดตั้งแล็บแถมมาให้พร้อมกับหนังสือ ไม่ต้องไปหาที่อื่น',
        ],
      },
      {
        kind: 'note',
        heading: 'ในเล่มมีอะไรบ้าง',
        text:
          '10 บท + 2 ภาคผนวก — สถาปัตยกรรมการประมวลผลคำสั่ง SQL และ Cost-Based Optimizer · การอ่านและตีความ Execution Plan · Optimizer Statistics และ Histogram · การหา SQL ที่มาจากแอปพลิเคชัน (SQL Trace / TRCSESS / TKPROF) · การเข้าถึงข้อมูลและดัชนี · การเชื่อมโยงข้อมูลและการเรียงลำดับ · Optimizer Hints, Query Transformation และ Materialized View · Bind Variables และ Adaptive Execution · ทำให้เสถียรด้วยระบบอัตโนมัติ (AWR/ASH, SQL Plan Management, Automatic Indexing) · เวิร์กช็อปรวบยอด 4 เคสจริง · ภาคผนวก ก คำสั่งใหม่ (QUALIFY, GROUP BY ALL, VALUES) · ภาคผนวก ข Vector และ JSON Relational Duality',
      },
    ],
    samples: [
      { group: 'สารบัญ', file: 'toc-01', alt: 'สารบัญ หน้า i' },
      { group: 'สารบัญ', file: 'toc-02', alt: 'สารบัญ หน้า ii' },
      { group: 'สารบัญ', file: 'toc-03', alt: 'สารบัญ หน้า iii' },
      { group: 'สารบัญ', file: 'toc-04', alt: 'สารบัญ หน้า iv' },
      { group: 'สารบัญ', file: 'toc-05', alt: 'สารบัญ หน้า v' },
      { group: 'สารบัญ', file: 'toc-06', alt: 'สารบัญ หน้า vi' },
      { group: 'สารบัญ', file: 'toc-07', alt: 'สารบัญ หน้า vii' },
      { group: 'สารบัญ', file: 'toc-08', alt: 'สารบัญ หน้า viii' },
      { group: 'สารบัญ', file: 'toc-09', alt: 'สารบัญ หน้า ix' },
      { group: 'เกี่ยวกับผู้เขียน', file: 'author', alt: 'หน้าเกี่ยวกับผู้เขียน' },
      { group: 'ตัวอย่างเนื้อหา', file: 'sample-01', alt: 'ตัวอย่างเนื้อหา — บทที่ 1 หน้าเปิดบท' },
      { group: 'ตัวอย่างเนื้อหา', file: 'sample-02', alt: 'ตัวอย่างเนื้อหา — 1.1 วงจรชีวิตของคำสั่ง SQL' },
      { group: 'ตัวอย่างเนื้อหา', file: 'sample-03', alt: 'ตัวอย่างเนื้อหา — 1.2 Hard Parse กับ Soft Parse' },
      { group: 'ตัวอย่างเนื้อหา', file: 'sample-04', alt: 'ตัวอย่างเนื้อหา — ผลรันจริงจาก v$sql' },
      { group: 'ตัวอย่างเนื้อหา', file: 'sample-05', alt: 'ตัวอย่างเนื้อหา — ดูตัวเลขรวมของ session' },
    ],
    buyUrl: process.env.NEXT_PUBLIC_STRIPE_LINK_ORACLE26 ?? '',

    /* โปรราคาศิษย์เก่า — กล่องนี้จะหายไปเองหลัง 31 ส.ค. 2569 เวลา 23:59 */
    promo: {
      label: 'ราคาพิเศษสำหรับศิษย์เก่า',
      price: 490,
      /*
       * ลิงก์ฟอร์มสั่งซื้อ (Apps Script Web App — ดู docs/ALUMNI_PREORDER.md)
       * ใส่ค่าจริงไว้ตรงนี้เลย เพราะเป็น URL สาธารณะ ไม่ใช่ความลับ ใครกดปุ่มก็เห็นอยู่แล้ว
       * ถ้าวันหลัง deploy ใหม่แล้ว URL เปลี่ยน ตั้ง NEXT_PUBLIC_ALUMNI_ORDER_URL ที่ Vercel ทับได้
       * โดยไม่ต้องแก้ไฟล์นี้
       */
      orderUrl:
        process.env.NEXT_PUBLIC_ALUMNI_ORDER_URL ??
        'https://script.google.com/macros/s/AKfycbw4bhey5J1L91JrseFRbIsgdcH9l-3y8LCU90dPuNzCou7OfHvEHJP07UGASbFzmcWNYQ/exec',
      buttonLabel: 'สั่งซื้อราคาศิษย์เก่า',
      /* ช่องทางสำรอง ใช้ได้เสมอ ไม่ต้องรอ deploy อะไร */
      fallbackUrl: 'https://m.me/teeDBA',
      fallbackLabel: 'หรือทักมาที่เพจ Facebook',
      steps: [
        'กรอกอีเมลและรหัสศิษย์เก่าที่ผมให้ไว้ในห้องอบรม',
        'สแกน QR โอน 490 บาท แล้วแนบสลิปในฟอร์ม',
        'ผมส่งไฟล์ไปที่อีเมลที่คุณกรอก ตั้งแต่วันที่ 1 กันยายน 2569',
      ],
      codeHint: 'ไม่ต้องล็อกอินบัญชีอะไรทั้งนั้น ถ้ายังไม่มีรหัส ทักมาถามได้ครับ',
      endsAt: '2026-08-31T23:59:59+07:00',
      deadlineLabel: 'สั่งซื้อได้ถึงวันจันทร์ที่ 31 สิงหาคม 2569 เวลา 23:59',
      deliverNote: 'เริ่มส่งไฟล์ทางอีเมลวันที่ 1 กันยายน 2569',
      warning:
        'แจ้งอีเมลให้ถูกต้อง เพราะผมส่งไฟล์หนังสือไปทางอีเมลทางเดียว ถ้าไม่ได้รับให้ดูในกล่อง Spam ก่อน',
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** ผลิตภัณฑ์ที่ยังไม่วางขาย — แสดงในโซน "กำลังจะมา" ของหน้า /products */
export const upcomingProducts = [
  {
    icon: '🎥',
    title: 'Online Course: Oracle DBA พื้นฐานถึงใช้งาน',
    desc: 'คอร์สวิดีโอเรียนได้ด้วยตัวเอง พร้อม Lab ให้ฝึกทำตามทีละขั้น',
  },
  {
    icon: '🧰',
    title: 'Toolkit: Script สำหรับ DBA',
    desc: 'ชุด Script ตรวจสุขภาพฐานข้อมูลและงานประจำวันที่ใช้ได้จริง',
  },
] as const;

/** หมวดหมู่บทความ (ค่าแรก "ทั้งหมด" ใช้เป็นสถานะไม่กรอง) */
export const ALL_CATEGORY = 'ทั้งหมด';
export const categories = [
  'DBA',
  'Performance',
  'Backup & Recovery',
  'PL/SQL',
  'RAC',
  'Oracle Linux',
  'Data Engineer',
  'Data Science',
  'SQL',
] as const;

export const nav = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/articles', label: 'บทความ' },
  { href: '/courses', label: 'หลักสูตรที่สอน' },
  { href: '/about', label: 'เกี่ยวกับอาจารย์ตี๋' },
  { href: '/products', label: 'ผลิตภัณฑ์' },
  { href: '/contact', label: 'ติดต่อ' },
] as const;
