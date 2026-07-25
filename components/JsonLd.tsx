/**
 * ฝัง structured data (JSON-LD) — หัวใจของ SEO/GEO/AIO
 * เครื่องมือค้นหาและ LLM ใช้ข้อมูลชุดนี้เข้าใจว่าหน้านี้คืออะไร ใครเขียน เมื่อไหร่
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
