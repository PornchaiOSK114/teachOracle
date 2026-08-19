/**
 * ระบบส่ง E-Book อัตโนมัติ — โปรราคาศิษย์เก่า Oracle 26ai SQL Tuning
 * ==================================================================
 *
 * วิธีติดตั้ง (ทำครั้งเดียว)
 *   1. เปิด Google Sheet ที่รับคำตอบจากฟอร์ม
 *   2. เมนู Extensions > Apps Script
 *   3. ลบโค้ดเดิมทิ้ง วางไฟล์นี้ลงไปทั้งหมด แล้วกด Save
 *   4. เลือกฟังก์ชัน setupOnce จาก dropdown ด้านบน แล้วกด Run
 *      ครั้งแรกจะขึ้นหน้าขออนุญาต ให้กด Advanced > Go to ... (unsafe) > Allow
 *      (ขึ้นคำว่า unsafe เพราะเป็นสคริปต์ที่เราเขียนเอง ไม่ได้ผ่านการรีวิวของ Google)
 *   5. กลับไปที่ Sheet จะเห็นเมนูใหม่ชื่อ "ส่งหนังสือ" โผล่ขึ้นมา
 *
 * วิธีใช้ประจำวัน
 *   เปิดแอปธนาคารเช็คว่าเงินเข้าครบ แล้วพิมพ์ OK ลงในคอลัมน์ "อนุมัติ" ของแถวนั้น
 *   สคริปต์จะส่งอีเมลพร้อมไฟล์แนบให้ทันที และเขียนสถานะกลับลงในชีตให้
 *
 * ข้อควรรู้
 *   - Gmail ธรรมดาส่งได้ 100 ฉบับต่อวัน (Google One ไม่ได้เพิ่มโควตาส่วนนี้)
 *   - ไฟล์แนบรวมกันต้องไม่เกิน 25 MB
 *   - สคริปต์กันการส่งซ้ำให้แล้ว พิมพ์ OK ซ้ำก็ไม่ส่งซ้ำ
 */

// ==================== ตั้งค่า ====================

var CONFIG = {
  /** โฟลเดอร์ Google Drive ที่เก็บไฟล์ที่จะส่ง (PDF + ZIP) */
  FOLDER_ID: '1-Mi2EuJD3dC9pA2ue2c_xdbm9sowKFfx',

  /** อีเมลที่จะได้รับแจ้งเตือนเมื่อมีออเดอร์ใหม่ */
  OWNER_EMAIL: 'pornchai.krong@gmail.com',

  /** ชื่อผู้ส่งที่ลูกค้าเห็นในกล่องจดหมาย */
  SENDER_NAME: 'อาจารย์ตี๋ที่สอน Oracle',

  BOOK_TITLE: 'Oracle 26ai SQL Tuning',
  PRICE_LABEL: '490 บาท (ราคาศิษย์เก่า)',
  DELIVER_DATE: '1 กันยายน 2569',
  SITE_URL: 'https://teedba.com',

  /** ต้องตรงกับ "ข้อความคำถาม" ในฟอร์มเป๊ะ ๆ เพราะ Google เอาไปตั้งเป็นหัวคอลัมน์ */
  COL_EMAIL: 'อีเมลของคุณ',
  COL_NAME: 'ชื่อ-นามสกุลผู้โอน',
  COL_TRANSFER_AT: 'วันและเวลาที่โอน',

  /** คอลัมน์ที่สคริปต์สร้างเพิ่มให้เอง */
  COL_APPROVE: 'อนุมัติ',
  COL_STATUS: 'สถานะส่ง',
  COL_SENT_AT: 'เวลาที่ส่ง',

  /** ปิดรับออเดอร์อัตโนมัติเมื่อถึงเวลานี้ (ISO 8601 เวลาไทย) */
  DEADLINE: '2026-08-31T23:59:59+07:00',

  /** คำที่พิมพ์แล้วถือว่าอนุมัติ (ไม่สนตัวพิมพ์เล็กใหญ่) */
  APPROVE_WORD: 'OK',
  STATUS_SENT: 'ส่งแล้ว',
};

// ==================== เมนูในชีต ====================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ส่งหนังสือ')
    .addItem('ส่งไฟล์ให้ทุกแถวที่พิมพ์ OK ไว้', 'sendPending')
    .addItem('ส่งอีเมลทดสอบมาหาตัวเอง', 'previewEmailToSelf')
    .addItem('เช็คโควตาส่งอีเมลที่เหลือวันนี้', 'showQuota')
    .addSeparator()
    .addItem('ติดตั้งระบบ (ทำครั้งเดียว)', 'setupOnce')
    .addToUi();
}

// ==================== ติดตั้งครั้งเดียว ====================

function setupOnce() {
  var sheet = getResponseSheet_();
  ensureColumns_(sheet);
  installTriggers_();

  var files = getAttachments_();
  var names = files
    .map(function (f) {
      return f.getName();
    })
    .join(', ');

  SpreadsheetApp.getUi().alert(
    'ติดตั้งเรียบร้อย\n\n' +
      'ไฟล์ที่จะแนบไปกับอีเมล (' + files.length + ' ไฟล์)\n' + (names || '(ยังไม่มีไฟล์ในโฟลเดอร์)') + '\n\n' +
      'วิธีใช้: พิมพ์ ' + CONFIG.APPROVE_WORD + ' ในคอลัมน์ "' + CONFIG.COL_APPROVE + '" ของแถวที่เงินเข้าแล้ว'
  );
}

/** เพิ่มคอลัมน์ที่ยังไม่มี ต่อท้ายหัวตาราง */
function ensureColumns_(sheet) {
  var headers = getHeaders_(sheet);
  var wanted = [CONFIG.COL_APPROVE, CONFIG.COL_STATUS, CONFIG.COL_SENT_AT];

  wanted.forEach(function (name) {
    if (headers.indexOf(name) === -1) {
      var col = sheet.getLastColumn() + 1;
      sheet.getRange(1, col).setValue(name).setFontWeight('bold');
      headers.push(name);
    }
  });
}

/** ติดตั้ง trigger แบบ installable (แบบธรรมดาส่งอีเมลไม่ได้) */
function installTriggers_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ลบ trigger เก่าของสคริปต์นี้ก่อน กันซ้อนกันตอนติดตั้งใหม่
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (fn === 'handleFormSubmit' || fn === 'handleEdit' || fn === 'closeFormIfPastDeadline') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('handleFormSubmit').forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger('handleEdit').forSpreadsheet(ss).onEdit().create();

  // เช็คทุกชั่วโมงว่าถึงเวลาปิดรับหรือยัง จะได้ไม่ต้องมานั่งกดปิดเอง
  ScriptApp.newTrigger('closeFormIfPastDeadline').timeBased().everyHours(1).create();
}

/** ปิดรับคำตอบอัตโนมัติเมื่อพ้นกำหนด แล้วส่งเมลแจ้งเจ้าของ */
function closeFormIfPastDeadline() {
  try {
    if (new Date().getTime() < new Date(CONFIG.DEADLINE).getTime()) return;

    var url = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
    if (!url) return;

    var form = FormApp.openByUrl(url);
    if (!form.isAcceptingResponses()) return;

    form.setAcceptingResponses(false);
    form.setCustomClosedFormMessage(
      'โปรโมชันราคาศิษย์เก่าปิดรับแล้วครับ สั่งซื้อในราคาปกติได้ที่ ' + CONFIG.SITE_URL + '/products'
    );
    GmailApp.sendEmail(CONFIG.OWNER_EMAIL, '[ระบบขายหนังสือ] ปิดรับออเดอร์แล้ว',
      'ถึงกำหนด ' + CONFIG.DEADLINE + ' ระบบปิดรับคำตอบให้เรียบร้อยแล้วครับ');
  } catch (err) {
    console.error('closeFormIfPastDeadline ล้มเหลว: ' + err);
  }
}

// ==================== มีออเดอร์ใหม่เข้ามา ====================

function handleFormSubmit(e) {
  try {
    var values = e && e.namedValues ? e.namedValues : {};
    var email = firstValue_(values[CONFIG.COL_EMAIL]);
    var name = firstValue_(values[CONFIG.COL_NAME]);
    var transferAt = firstValue_(values[CONFIG.COL_TRANSFER_AT]);

    if (email) sendAckEmail_(email, name);
    notifyOwner_(email, name, transferAt);
  } catch (err) {
    // ไม่ throw ต่อ เพราะถ้า trigger พังจะไม่มีใครเห็น ให้บันทึกไว้ใน log แทน
    console.error('handleFormSubmit ล้มเหลว: ' + err);
    safeNotifyOwnerError_('รับออเดอร์ใหม่', err);
  }
}

/** อีเมลตอบรับอัตโนมัติ ส่งทันทีที่ลูกค้ากด submit */
function sendAckEmail_(email, name) {
  var greeting = name ? 'สวัสดีครับ คุณ' + name : 'สวัสดีครับ';

  var body =
    greeting + '\n\n' +
    'ผมได้รับข้อมูลการสั่งซื้อของคุณเรียบร้อยแล้ว\n\n' +
    'หนังสือ: ' + CONFIG.BOOK_TITLE + ' (E-Book ไฟล์ PDF)\n' +
    'ราคา: ' + CONFIG.PRICE_LABEL + '\n' +
    'อีเมลที่จะใช้ส่งไฟล์: ' + email + '\n\n' +
    'ผมจะตรวจสอบยอดโอนแล้วส่งไฟล์ไปที่อีเมลนี้ ตั้งแต่วันที่ ' + CONFIG.DELIVER_DATE + ' เป็นต้นไป\n\n' +
    'ถ้าเลยวันดังกล่าวแล้วยังไม่ได้รับ ให้ดูในกล่อง Spam หรือ Junk ก่อนครับ ' +
    'อีเมลที่มีไฟล์แนบมักไปตกอยู่ตรงนั้น ถ้ายังไม่เจอจริง ๆ ตอบกลับอีเมลฉบับนี้มาได้เลย\n\n' +
    'พรชัย ครองธรรมชาติ (อาจารย์ตี๋)\n' +
    CONFIG.SITE_URL;

  GmailApp.sendEmail(email, 'ได้รับข้อมูลสั่งซื้อ ' + CONFIG.BOOK_TITLE + ' แล้วครับ', body, {
    name: CONFIG.SENDER_NAME,
    replyTo: CONFIG.OWNER_EMAIL,
  });
}

/** แจ้งเตือนเจ้าของร้าน */
function notifyOwner_(email, name, transferAt) {
  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var body =
    'มีออเดอร์ใหม่\n\n' +
    'อีเมลลูกค้า: ' + (email || '-') + '\n' +
    'ชื่อผู้โอน: ' + (name || '-') + '\n' +
    'เวลาที่แจ้งว่าโอน: ' + (transferAt || '-') + '\n\n' +
    'เช็คยอดในแอปธนาคาร แล้วพิมพ์ ' + CONFIG.APPROVE_WORD + ' ในคอลัมน์ "' + CONFIG.COL_APPROVE + '"\n' +
    url;

  GmailApp.sendEmail(CONFIG.OWNER_EMAIL, '[ออเดอร์ใหม่] ' + (name || email || 'ไม่ระบุชื่อ'), body, {
    name: 'ระบบรับออเดอร์',
  });
}

// ==================== อนุมัติแล้วส่งไฟล์ ====================

/** ทำงานเมื่อมีการแก้เซลล์ ถ้าเป็นคอลัมน์อนุมัติและพิมพ์ OK จะส่งไฟล์ทันที */
function handleEdit(e) {
  try {
    if (!e || !e.range) return;

    var sheet = e.range.getSheet();
    if (sheet.getName() !== getResponseSheet_().getName()) return;

    var headers = getHeaders_(sheet);
    var approveCol = headers.indexOf(CONFIG.COL_APPROVE) + 1;
    if (approveCol === 0 || e.range.getColumn() !== approveCol) return;

    var row = e.range.getRow();
    if (row === 1) return;

    var value = String(e.range.getValue() || '').trim().toUpperCase();
    if (value !== CONFIG.APPROVE_WORD) return;

    sendOne_(sheet, row, headers);
  } catch (err) {
    console.error('handleEdit ล้มเหลว: ' + err);
    safeNotifyOwnerError_('ส่งไฟล์อัตโนมัติ', err);
  }
}

/** เมนูสำรอง กวาดส่งทุกแถวที่พิมพ์ OK ไว้แต่ยังไม่ได้ส่ง */
function sendPending() {
  var sheet = getResponseSheet_();
  var headers = getHeaders_(sheet);
  var approveCol = headers.indexOf(CONFIG.COL_APPROVE) + 1;
  var statusCol = headers.indexOf(CONFIG.COL_STATUS) + 1;

  if (approveCol === 0 || statusCol === 0) {
    SpreadsheetApp.getUi().alert('ยังไม่มีคอลัมน์ที่ต้องใช้ กรุณารัน setupOnce ก่อน');
    return;
  }

  var lastRow = sheet.getLastRow();
  var sent = 0;
  var failed = 0;

  for (var row = 2; row <= lastRow; row++) {
    var approve = String(sheet.getRange(row, approveCol).getValue() || '').trim().toUpperCase();
    var status = String(sheet.getRange(row, statusCol).getValue() || '').trim();
    if (approve !== CONFIG.APPROVE_WORD || status === CONFIG.STATUS_SENT) continue;

    if (sendOne_(sheet, row, headers)) sent++;
    else failed++;
  }

  SpreadsheetApp.getUi().alert(
    'ส่งสำเร็จ ' + sent + ' ฉบับ' + (failed ? '\nส่งไม่สำเร็จ ' + failed + ' ฉบับ (ดูคอลัมน์สถานะส่ง)' : '')
  );
}

/**
 * ส่งอีเมลพร้อมไฟล์แนบให้ 1 แถว
 * คืน true ถ้าส่งสำเร็จ
 */
function sendOne_(sheet, row, headers) {
  var statusCol = headers.indexOf(CONFIG.COL_STATUS) + 1;
  var sentAtCol = headers.indexOf(CONFIG.COL_SENT_AT) + 1;
  var emailCol = headers.indexOf(CONFIG.COL_EMAIL) + 1;
  var nameCol = headers.indexOf(CONFIG.COL_NAME) + 1;

  // กันส่งซ้ำ
  if (statusCol > 0) {
    var current = String(sheet.getRange(row, statusCol).getValue() || '').trim();
    if (current === CONFIG.STATUS_SENT) return true;
  }

  var email = emailCol > 0 ? String(sheet.getRange(row, emailCol).getValue() || '').trim() : '';
  var name = nameCol > 0 ? String(sheet.getRange(row, nameCol).getValue() || '').trim() : '';

  if (!email) {
    writeStatus_(sheet, row, statusCol, sentAtCol, 'ไม่มีอีเมลในแถวนี้');
    return false;
  }

  try {
    if (MailApp.getRemainingDailyQuota() < 1) {
      writeStatus_(sheet, row, statusCol, sentAtCol, 'โควตาอีเมลวันนี้หมด รอพรุ่งนี้');
      return false;
    }

    var files = getAttachments_();
    if (files.length === 0) throw new Error('ไม่พบไฟล์ในโฟลเดอร์ Drive ที่ตั้งค่าไว้');

    var blobs = [];
    var total = 0;
    files.forEach(function (f) {
      var blob = f.getBlob();
      total += blob.getBytes().length;
      blobs.push(blob);
    });
    if (total > 24 * 1024 * 1024) throw new Error('ไฟล์แนบรวมเกิน 24 MB ส่งทางอีเมลไม่ได้');

    GmailApp.sendEmail(email, 'หนังสือ ' + CONFIG.BOOK_TITLE + ' ของคุณครับ', buildDeliveryBody_(name), {
      name: CONFIG.SENDER_NAME,
      replyTo: CONFIG.OWNER_EMAIL,
      attachments: blobs,
    });

    writeStatus_(sheet, row, statusCol, sentAtCol, CONFIG.STATUS_SENT);
    return true;
  } catch (err) {
    writeStatus_(sheet, row, statusCol, sentAtCol, 'ผิดพลาด: ' + err);
    console.error('ส่งแถว ' + row + ' ไม่สำเร็จ: ' + err);
    return false;
  }
}

/** เนื้อความอีเมลตอนส่งไฟล์ */
function buildDeliveryBody_(name) {
  var greeting = name ? 'สวัสดีครับ คุณ' + name : 'สวัสดีครับ';

  return (
    greeting + '\n\n' +
    'ไฟล์หนังสือ ' + CONFIG.BOOK_TITLE + ' แนบมากับอีเมลฉบับนี้แล้วครับ ' +
    'ในนั้นมีไฟล์ PDF ของหนังสือ และไฟล์ zip ที่เป็นสคริปต์ติดตั้งสภาพแวดล้อมแล็บ\n\n' +
    'ข้อแนะนำจากผมข้อเดียว อย่าอ่านอย่างเดียวครับ ติดตั้งแล็บแล้วรันตามไปด้วยทุกบท ' +
    'เนื้อหาเล่มนี้ผมออกแบบมาให้ลงมือทำตาม ไม่ได้ออกแบบมาให้อ่านผ่าน\n\n' +
    'ไฟล์ชุดนี้ผมส่งให้เฉพาะคุณ รบกวนไม่ส่งต่อนะครับ\n\n' +
    'ถ้าเจอตรงไหนที่พิมพ์ผิด อธิบายไม่ชัด หรือรันแล้วไม่ได้ผลอย่างที่เขียนไว้ ตอบกลับอีเมลนี้มาได้เลย ' +
    'ผมรวบรวมข้อแก้ไขไว้ที่เดียวกันหมด\n\n' +
    'ขอบคุณที่อุดหนุนครับ\n\n' +
    'พรชัย ครองธรรมชาติ (อาจารย์ตี๋)\n' +
    CONFIG.SITE_URL
  );
}

// ==================== เครื่องมือช่วย ====================

function getResponseSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

  // ชีตที่ผูกกับฟอร์มจะมี form url ติดอยู่
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getFormUrl()) return sheets[i];
  }
  return sheets[0];
}

function getHeaders_(sheet) {
  return sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
    .getValues()[0]
    .map(function (v) {
      return String(v || '').trim();
    });
}

function getAttachments_() {
  var out = [];
  var it = DriveApp.getFolderById(CONFIG.FOLDER_ID).getFiles();
  while (it.hasNext()) out.push(it.next());
  return out;
}

function writeStatus_(sheet, row, statusCol, sentAtCol, status) {
  if (statusCol > 0) sheet.getRange(row, statusCol).setValue(status);
  if (sentAtCol > 0) sheet.getRange(row, sentAtCol).setValue(new Date());
}

function firstValue_(v) {
  if (!v) return '';
  return String(Array.isArray(v) ? v[0] : v).trim();
}

function safeNotifyOwnerError_(where, err) {
  try {
    GmailApp.sendEmail(CONFIG.OWNER_EMAIL, '[ระบบขายหนังสือ] มีข้อผิดพลาด', where + '\n\n' + err);
  } catch (ignored) {
    // ถ้าส่งเมลแจ้ง error ไม่ได้ด้วย ก็ปล่อยไว้ใน log
  }
}

// ==================== ทดสอบ ====================

/** ส่งอีเมลตัวอย่างพร้อมไฟล์แนบจริงมาหาตัวเอง ใช้เช็คก่อนเปิดขาย */
function previewEmailToSelf() {
  var files = getAttachments_();
  var blobs = files.map(function (f) {
    return f.getBlob();
  });

  GmailApp.sendEmail(
    CONFIG.OWNER_EMAIL,
    '[ทดสอบ] หนังสือ ' + CONFIG.BOOK_TITLE + ' ของคุณครับ',
    buildDeliveryBody_('ทดสอบ'),
    { name: CONFIG.SENDER_NAME, attachments: blobs }
  );

  SpreadsheetApp.getUi().alert('ส่งอีเมลทดสอบไปที่ ' + CONFIG.OWNER_EMAIL + ' แล้ว (' + files.length + ' ไฟล์แนบ)');
}

function showQuota() {
  SpreadsheetApp.getUi().alert('วันนี้ยังส่งอีเมลได้อีก ' + MailApp.getRemainingDailyQuota() + ' ฉบับ');
}
