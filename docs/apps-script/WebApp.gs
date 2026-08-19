/**
 * ฟอร์มสั่งซื้อของเราเอง (Apps Script Web App)
 * ==================================================================
 *
 * ทำไมถึงเขียนเอง แทนที่จะใช้ Google Form
 *   Google Form ที่มีช่องอัปโหลดไฟล์ จะบังคับให้ลูกค้าล็อกอินบัญชี Google ก่อนเสมอ ปิดไม่ได้
 *   Web App ตัวนี้ deploy เป็นแบบ "Anyone" จึงเปิดกรอกได้เลย ไม่ต้องล็อกอินอะไรทั้งนั้น
 *   ไฟล์สลิปถูกสร้างด้วยบัญชีของเจ้าของสคริปต์ ไม่ใช่ของลูกค้า
 *
 * ไฟล์นี้ทำงานคู่กับ Code.gs (ใช้ CONFIG, ตัวช่วย และระบบส่งไฟล์ร่วมกัน)
 * ต้องมีทั้งสองไฟล์อยู่ในโปรเจกต์เดียวกัน พร้อมไฟล์ HTML ชื่อ Form
 *
 * วิธี deploy ดูใน docs/ALUMNI_PREORDER.md หัวข้อ "ขั้นที่ 3"
 */

// ==================== ค่าที่เก็บแบบไม่ขึ้น GitHub ====================

/**
 * รหัสศิษย์เก่าเก็บใน Script Properties ไม่ได้ hardcode ลงไฟล์
 * เพราะไฟล์นี้อยู่ในโฟลเดอร์ docs/ ของ repo ซึ่งถูก push ขึ้น GitHub
 * ถ้าพิมพ์รหัสลงไปตรง ๆ รหัสจะหลุดไปกับ repo
 *
 * ตั้งค่าครั้งแรกด้วยเมนู "ส่งหนังสือ > ตั้งรหัสศิษย์เก่า"
 */
function getAlumniCode_() {
  return (PropertiesService.getScriptProperties().getProperty('ALUMNI_CODE') || '').trim();
}

function setAlumniCode() {
  var ui = SpreadsheetApp.getUi();
  var current = getAlumniCode_();
  var res = ui.prompt(
    'ตั้งรหัสศิษย์เก่า',
    current ? 'รหัสปัจจุบันคือ ' + current + '\n\nพิมพ์รหัสใหม่ (เว้นว่างแล้วกด OK เพื่อคงรหัสเดิม)' : 'พิมพ์รหัสที่จะให้ศิษย์เก่าใช้ ตัวอักษรและตัวเลข ไม่ต้องมีเว้นวรรค',
    ui.ButtonSet.OK_CANCEL
  );
  if (res.getSelectedButton() !== ui.Button.OK) return;

  var code = res.getResponseText().trim();
  if (!code) {
    ui.alert(current ? 'คงรหัสเดิมไว้: ' + current : 'ยังไม่ได้ตั้งรหัส');
    return;
  }
  PropertiesService.getScriptProperties().setProperty('ALUMNI_CODE', code);
  ui.alert('ตั้งรหัสเรียบร้อย: ' + code + '\n\nรหัสนี้เก็บอยู่ใน Script Properties ไม่ได้อยู่ในไฟล์โค้ด');
}

/** โฟลเดอร์เก็บสลิป สร้างให้อัตโนมัติครั้งแรก และจำ id ไว้ */
function getSlipFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SLIP_FOLDER_ID');

  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (ignored) {
      // โฟลเดอร์ถูกลบไปแล้ว สร้างใหม่ด้านล่าง
    }
  }

  var folder = DriveApp.createFolder('สลิปโอนเงิน ' + CONFIG.BOOK_TITLE);
  props.setProperty('SLIP_FOLDER_ID', folder.getId());
  return folder;
}

// ==================== หน้าเว็บ ====================

function doGet() {
  var t = HtmlService.createTemplateFromFile('Form');
  t.closed = isPastDeadline_();
  t.price = CONFIG.PRICE_LABEL;
  t.bookTitle = CONFIG.BOOK_TITLE;
  t.deliverDate = CONFIG.DELIVER_DATE;
  t.siteUrl = CONFIG.SITE_URL;
  t.qrUrl = getQrImageUrl_();

  return t
    .evaluate()
    .setTitle('สั่งซื้อ ' + CONFIG.BOOK_TITLE + ' ราคาศิษย์เก่า')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ลิงก์รูป QR
 * วางไฟล์ชื่อ QR.jpg (หรือ .png) ไว้ในโฟลเดอร์เดียวกับไฟล์หนังสือ แล้วระบบหาให้เอง
 * ต้องตั้งการแชร์ไฟล์ QR เป็น "Anyone with the link" ไม่งั้นลูกค้าจะมองไม่เห็นรูป
 */
function getQrImageUrl_() {
  try {
    var it = DriveApp.getFolderById(CONFIG.FOLDER_ID).getFiles();
    while (it.hasNext()) {
      var f = it.next();
      if (/^QR\./i.test(f.getName())) {
        return 'https://drive.google.com/thumbnail?id=' + f.getId() + '&sz=w800';
      }
    }
  } catch (err) {
    console.error('หารูป QR ไม่เจอ: ' + err);
  }
  return '';
}

function isPastDeadline_() {
  return new Date().getTime() >= new Date(CONFIG.DEADLINE).getTime();
}

// ==================== ตรวจรหัส (เรียกจากหน้าเว็บ) ====================

/**
 * ตรวจรหัสฝั่ง server เท่านั้น
 * ห้ามส่งรหัสจริงไปให้ฝั่งเบราว์เซอร์เด็ดขาด ไม่งั้นลูกค้ากด View Source แล้วเห็นรหัสทันที
 */
function checkCode(code) {
  if (isPastDeadline_()) {
    return { ok: false, message: 'โปรโมชันปิดรับแล้วครับ สั่งซื้อในราคาปกติได้ที่ ' + CONFIG.SITE_URL + '/products' };
  }

  var expected = getAlumniCode_();
  if (!expected) {
    return { ok: false, message: 'ระบบยังไม่พร้อมรับออเดอร์ รบกวนติดต่อผมโดยตรงครับ' };
  }

  if (String(code || '').trim().toUpperCase() !== expected.toUpperCase()) {
    return {
      ok: false,
      message:
        'โปรโมชันนี้สำหรับศิษย์เก่าที่เคยอบรมกับผมเท่านั้นครับ ' +
        'ถ้าเคยเรียนกับผมแล้วจำรหัสไม่ได้ ทักมาถามได้ที่เพจ อาจารย์ตี๋ที่สอน Oracle ' +
        'หรือสั่งซื้อในราคาปกติได้ที่ ' + CONFIG.SITE_URL + '/products',
    };
  }

  return { ok: true, message: '' };
}

// ==================== รับออเดอร์ ====================

var MAX_SLIP_BYTES = 8 * 1024 * 1024;
var ALLOWED_SLIP_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

/**
 * รับข้อมูลจากฟอร์ม ตรวจซ้ำทุกอย่างฝั่ง server แล้วบันทึก
 * (ตรวจฝั่งเบราว์เซอร์อย่างเดียวไม่พอ เพราะใครก็แก้ JavaScript ในเครื่องตัวเองได้)
 */
function submitOrder(payload) {
  try {
    payload = payload || {};

    // กับดักบอท ช่องนี้ถูกซ่อนไว้ คนจริงจะไม่มีทางกรอก
    if (String(payload.website || '').length > 0) {
      return { ok: false, message: 'ส่งข้อมูลไม่สำเร็จ' };
    }

    var codeCheck = checkCode(payload.code);
    if (!codeCheck.ok) return codeCheck;

    var email = String(payload.email || '').trim();
    var name = String(payload.name || '').trim();
    var transferAt = String(payload.transferAt || '').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: 'อีเมลไม่ถูกต้อง ตรวจอีกครั้งนะครับ' };
    }
    if (name.length < 2) return { ok: false, message: 'กรุณากรอกชื่อผู้โอน' };
    if (transferAt.length < 2) return { ok: false, message: 'กรุณากรอกวันและเวลาที่โอน' };

    // ---- สลิป ----
    var slipUrl = '';
    if (payload.fileData) {
      if (ALLOWED_SLIP_TYPES.indexOf(payload.fileType) === -1) {
        return { ok: false, message: 'รับเฉพาะไฟล์รูปหรือ PDF ครับ' };
      }

      var bytes = Utilities.base64Decode(payload.fileData);
      if (bytes.length > MAX_SLIP_BYTES) {
        return { ok: false, message: 'ไฟล์สลิปใหญ่เกินไป รบกวนถ่ายใหม่หรือย่อขนาดก่อนครับ' };
      }

      var ext = payload.fileType === 'application/pdf' ? '.pdf' : '.jpg';
      var safeName = name.replace(/[\\/:*?"<>|]/g, '') || 'ไม่ระบุชื่อ';
      var stamp = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd-HHmmss');
      var blob = Utilities.newBlob(bytes, payload.fileType, stamp + ' ' + safeName + ext);

      slipUrl = getSlipFolder_().createFile(blob).getUrl();
    } else {
      return { ok: false, message: 'กรุณาแนบสลิปการโอนครับ' };
    }

    // ---- เขียนลงชีต ----
    // ใช้ lock กันกรณีมีคนกดส่งพร้อมกันแล้วเขียนทับแถวเดียวกัน
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      appendOrderRow_({ email: email, name: name, transferAt: transferAt, slipUrl: slipUrl });
    } finally {
      lock.releaseLock();
    }

    // ---- แจ้งเตือน ----
    // ส่งเมลไม่สำเร็จไม่ควรทำให้ลูกค้าเห็นว่าสั่งซื้อล้มเหลว เพราะข้อมูลลงชีตไปแล้ว
    try {
      sendAckEmail_(email, name);
    } catch (err) {
      console.error('ส่งอีเมลตอบรับไม่สำเร็จ: ' + err);
    }
    try {
      notifyOwner_(email, name, transferAt, slipUrl);
    } catch (err) {
      console.error('ส่งอีเมลแจ้งเตือนเจ้าของไม่สำเร็จ: ' + err);
    }

    return { ok: true, message: '' };
  } catch (err) {
    console.error('submitOrder ล้มเหลว: ' + err);
    safeNotifyOwnerError_('รับออเดอร์จากฟอร์ม', err);
    return { ok: false, message: 'ระบบขัดข้องชั่วคราว รบกวนลองใหม่อีกครั้ง หรือทักมาที่เพจได้ครับ' };
  }
}

/** เขียนแถวใหม่โดยอ้างอิงชื่อหัวคอลัมน์ ไม่ยึดลำดับ จะสลับคอลัมน์ทีหลังก็ไม่พัง */
function appendOrderRow_(data) {
  var sheet = getResponseSheet_();
  ensureColumns_(sheet);

  var headers = getHeaders_(sheet);
  var row = [];
  for (var i = 0; i < headers.length; i++) row.push('');

  function put(header, value) {
    var idx = headers.indexOf(header);
    if (idx >= 0) row[idx] = value;
  }

  put('วันที่รับออเดอร์', new Date());
  put(CONFIG.COL_EMAIL, data.email);
  put(CONFIG.COL_NAME, data.name);
  put(CONFIG.COL_TRANSFER_AT, data.transferAt);
  put(CONFIG.COL_SLIP, data.slipUrl);

  sheet.appendRow(row);
}

// ==================== เครื่องมือสำหรับเจ้าของ ====================

/** เปิดดู URL ของฟอร์มที่ deploy ไว้ */
function showWebAppUrl() {
  var url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert(
    url
      ? 'ลิงก์ฟอร์มของคุณคือ\n\n' + url + '\n\nเอาไปใส่ที่ Vercel เป็น NEXT_PUBLIC_ALUMNI_ORDER_URL'
      : 'ยังไม่ได้ deploy เป็น Web App\n\nไปที่ Deploy > New deployment > Web app'
  );
}

/** เปิดโฟลเดอร์สลิป (ครั้งแรกจะสร้างให้เลย) */
function showSlipFolder() {
  var folder = getSlipFolder_();
  SpreadsheetApp.getUi().alert('โฟลเดอร์เก็บสลิปคือ\n\n' + folder.getName() + '\n' + folder.getUrl());
}
