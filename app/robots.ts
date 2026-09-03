import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * เปิดทางให้ทั้ง search engine และ AI crawler เข้ามาอ่านได้ (ส่วนหนึ่งของ GEO/AIO)
 * — ถ้าอนาคตไม่อยากให้ AI ดึงเนื้อหา ให้เปลี่ยน allow เป็น disallow ของ user-agent นั้น
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'Bytespider',
    'meta-externalagent',
  ];

  /*
   * ห้ามคลานเข้าหน้าเครื่องมือภายในและ API
   *
   * ⚠️ สังเกตว่าหน้า /download กับหน้าขอบคุณ ไม่ได้อยู่ในนี้ทั้งที่เป็นหน้าส่วนตัว
   * เพราะสองหน้านั้นใช้ noindex ในตัวหน้าเอง ซึ่งจะได้ผลก็ต่อเมื่อ crawler
   * เข้ามาอ่านหน้าได้ ถ้าห้ามคลานตรงนี้ด้วย crawler จะไม่มีวันเห็นคำสั่ง noindex
   * แล้วหน้าอาจไปโผล่ในผลค้นหาโดยไม่มีเนื้อหา ซึ่งแย่กว่าเดิม
   */
  const disallow = ['/admin/', '/api/'];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...aiCrawlers.map((ua) => ({ userAgent: ua, allow: '/', disallow })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
