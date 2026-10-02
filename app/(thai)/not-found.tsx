import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container section" style={{ textAlign: 'center', maxWidth: 640 }}>
      <p className="eyebrow mono" style={{ fontSize: 15 }}>
        ORA-01403: no data found
      </p>
      <h1 className="h1-page">ไม่พบหน้าที่คุณกำลังหา</h1>
      <p className="muted" style={{ fontSize: 16.5, lineHeight: 1.7, margin: '0 0 30px' }}>
        หน้านี้อาจถูกย้าย เปลี่ยนชื่อ หรือลิงก์อาจพิมพ์ผิด ลองกลับไปเริ่มที่หน้าแรก
        หรือค้นหาจากรายการบทความดูครับ
      </p>
      <div className="flex-wrap" style={{ justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">
          กลับหน้าแรก
        </Link>
        <Link href="/articles" className="btn btn-secondary">
          ดูบทความทั้งหมด
        </Link>
      </div>
    </section>
  );
}
