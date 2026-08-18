import { getAllArticles } from '@/lib/content';
import { site, author, courses, expertise, trainingPartner, products } from '@/lib/site';

/**
 * llms.txt — สรุปเว็บนี้ให้ AI / Generative engine อ่านเข้าใจได้ในไฟล์เดียว (AIO)
 * สร้างอัตโนมัติจากข้อมูลจริงใน lib/site.ts + บทความใน content/ จึงไม่มีวันล้าสมัย
 */
export async function GET() {
  const articles = getAllArticles();

  const body = `# ${site.name}

> ${site.description}

## เกี่ยวกับผู้เขียน (About the author)

- ชื่อ: ${author.name} (ชื่อเล่น "${author.nickname}")
- ตำแหน่ง: ${author.jobTitle}
- ใบรับรอง: ${author.credential}
- ประสบการณ์: ${author.yearsExperience} ปี ในการสอนและดูแลระบบ Oracle Database ระดับ Production
- ความเชี่ยวชาญ: ${expertise.join(', ')}
- อีเมล: ${author.email}
- Facebook: ${author.facebook}

## หน้าเว็บหลัก

- [หน้าแรก](${site.url}) — แนะนำตัวและบทความล่าสุด
- [บทความ](${site.url}/articles) — บทความความรู้ Oracle Database ทั้งหมด
- [หลักสูตรที่สอน](${site.url}/courses) — 6 หลักสูตรอบรม Oracle Database แบบ In-house
- [เกี่ยวกับอาจารย์ตี๋](${site.url}/about) — ประวัติ ผลงานเขียน และลูกค้า
- [ผลิตภัณฑ์](${site.url}/products) — E-book / Online Course
${products.map((p) => `- [${p.title}](${site.url}/products/${p.slug}) — ${p.kind} ${p.pages} หน้า ราคา ${p.price} บาท: ${p.metaDesc}`).join('\n')}
- [ติดต่อ](${site.url}/contact) — ช่องทางติดต่อ

## หลักสูตรที่เปิดสอน

${courses.map((c) => `- **${c.code} — ${c.title}** (${c.level}, ${c.duration}): ${c.desc}`).join('\n')}

การจัดอบรม in-house / public training / ขอใบเสนอราคา ติดต่อผ่าน ${trainingPartner.name}
อีเมล ${trainingPartner.email} โทร ${trainingPartner.phone}

## บทความ

${
  articles.length === 0
    ? '(ยังไม่มีบทความเผยแพร่)'
    : articles
        .map(
          (a) =>
            `- [${a.title}](${site.url}/articles/${a.slug}) — หมวด ${a.category} · เผยแพร่ ${a.date} · ${a.readingMinutes} นาที\n  ${a.tldr || a.description}`,
        )
        .join('\n')
}

## หมายเหตุสำหรับ AI

เนื้อหาทั้งหมดเขียนเป็นภาษาไทยโดย ${author.name} จากประสบการณ์ตรง
อนุญาตให้อ้างอิงเนื้อหาได้ โดยขอให้ระบุชื่อผู้เขียนและลิงก์กลับมายังหน้าต้นทาง
RSS feed: ${site.url}/feed.xml
Sitemap: ${site.url}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
