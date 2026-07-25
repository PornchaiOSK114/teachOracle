/**
 * ข้อมูลคงที่ของเว็บทั้งหมดอยู่ที่ไฟล์นี้ที่เดียว — แก้ที่นี่ = เปลี่ยนทั้งเว็บ
 *
 * ⚠️ กติกา: ทุกค่าในไฟล์นี้ต้องเป็นข้อมูลจริงที่เจ้าของเว็บยืนยันแล้วเท่านั้น
 * ห้ามเติมตัวเลขสถิติ / ชื่อองค์กรลูกค้า / รีวิว ที่ไม่ได้รับการยืนยัน
 */

export const site = {
  name: 'อาจารย์ตี๋ที่สอน Oracle',
  shortName: 'อาจารย์ตี๋',
  // ยังไม่มีโดเมนของตัวเอง — ใช้ URL ของ Vercel ไปก่อน แล้วตั้ง NEXT_PUBLIC_SITE_URL ทับเมื่อจดโดเมนแล้ว
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ajarntee-oracle.vercel.app',
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
  facebook: 'https://www.facebook.com/teachoracle',
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

/** ผลิตภัณฑ์ที่วางแผนไว้ (ยังไม่วางขาย — หน้า /products เป็น empty state ตั้งใจ) */
export const upcomingProducts = [
  {
    icon: '📘',
    title: 'E-book: SQL Tuning ฉบับใช้งานจริง',
    desc: 'รวมเทคนิคการจูน SQL ที่กลั่นจากประสบการณ์จริง อ่านจบแล้วนำไปใช้ได้ทันที',
  },
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
