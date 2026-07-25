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

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map((ua) => ({ userAgent: ua, allow: '/' })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
