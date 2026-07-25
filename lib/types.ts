/** ชนิดข้อมูลที่ทั้งฝั่ง server และ client ใช้ร่วมกัน (ไม่มีโค้ดทำงานจริง) */

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** สรุปสั้น 1–2 ประโยคขึ้นต้นบทความ — สำคัญมากสำหรับ GEO/AIO (ให้ LLM ดึงไปตอบได้) */
  tldr: string;
  category: string;
  tags: string[];
  date: string;
  readingMinutes: number;
  cover?: string;
  draft: boolean;
  content: string;
};

export type ArticleMeta = Omit<Article, 'content'>;
