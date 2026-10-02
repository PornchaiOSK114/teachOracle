/* eslint-disable @typescript-eslint/no-require-imports -- Node-only test harness. */
/* Synthetic, in-memory service responses only. Never contacts payment/email/storage services. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, mocks = {}) {
  const loadedModule = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(`(function(require,module,exports){${js}\n})`, { URL, Date, Response, console })((name) => {
    if (name in mocks) return mocks[name];
    throw new Error('Unmocked dependency: ' + name);
  }, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const i18n = load('lib/i18n.ts');
assert.equal(i18n.localizedPath('/', 'en'), '/english');
assert.equal(i18n.localizedPath('/english/articles/test', 'th'), '/articles/test');
assert.equal(i18n.localizedPath('/lab', 'en'), '/en/lab');
assert.equal(i18n.localizedPath('/en', 'en'), '/en');
assert.equal(i18n.languageAlternates('/articles/th-only', ['th']).languages.en, undefined);
const routes = load('lib/locale-routes.ts', {
  './content': { getArticleSlugs: locale => locale === 'th' ? ['paired', 'th-only'] : ['paired', 'en-only'] },
  './site': { products: [{ slug: 'book' }] }, './i18n': i18n,
}).getLanguagePairs();
assert.equal(routes['/articles/paired'], '/english/articles/paired');
assert.equal(routes['/articles/th-only'], undefined);
assert.equal(routes['/english/articles/en-only'], undefined);
assert.equal(routes['/admin/stamp'], undefined);
assert.equal(routes['/en'], undefined);
assert.equal(routes['/en/lab'], '/lab');
const { downloadError } = load('lib/download-messages.ts');
const NextResponse = { json: (body, init) => new Response(JSON.stringify(body), init) };
let purchases = [], issued, verified;
let mailCalls = 0;
const mocks = {
  'next/server': { NextResponse },
  '@/lib/delivery/db': { normalizeEmail: x => x.trim().toLowerCase(), listPurchasesByEmail: async () => purchases },
  '@/lib/delivery/mail': { sendOtpEmail: async () => { mailCalls++; } },
  '@/lib/delivery/otp': { issueOtp: async () => issued, verifyOtp: async () => verified },
  '@/lib/delivery/config': { OTP: { MAX_ATTEMPTS: 5, LOCK_MINUTES: 15, TTL_MINUTES: 10 } },
  '@/lib/delivery/grant': {},
};
const requestCode = load('app/api/download/request-code/route.ts', mocks).POST;
const verify = load('app/api/download/verify/route.ts', mocks).POST;
const request = () => new Request('http://localhost/test', { method: 'POST', body: JSON.stringify({ email: 'synthetic@example.invalid', code: '123456' }) });
(async () => {
  let response = await requestCode(request());
  assert.equal(response.status, 404);
  let body = await response.json();
  assert.match(downloadError(body, 'en', 'fallback'), /No order/);
  assert.equal(downloadError(body, 'th', 'fallback'), body.error);
  purchases = [{ id: 1 }];
  for (const reason of ['locked', 'cooldown', 'hourly']) {
    issued = { ok: false, reason, retryAfterSeconds: 42 };
    response = await requestCode(request()); body = await response.json();
    assert.equal(response.status, 429);
    assert.match(downloadError(body, 'en', 'fallback'), /42 seconds/);
    assert.notEqual(downloadError(body, 'en', 'fallback'), 'fallback');
  }
  for (const reason of ['locked', 'expired', 'no_code', 'wrong']) {
    verified = { ok: false, reason, attemptsLeft: 2 };
    response = await verify(request()); body = await response.json();
    assert.equal(response.status, 401);
    const text = downloadError(body, 'en', 'fallback');
    assert.notEqual(text, 'fallback');
    if (reason === 'wrong') assert.match(text, /remaining: 2/);
    if (reason === 'locked') assert.match(text, /900 seconds/);
  }
  assert.equal(mailCalls, 0);
  // These file response codes remain distinct; a generic retry must not hide lost eligibility.
  assert.match(downloadError({ code: 'quota_exhausted', limit: 5 }, 'en', ''), /allowance of 5/);
  assert.match(downloadError({ code: 'wrong_owner' }, 'en', ''), /does not belong/);
  assert.match(downloadError({ code: 'file_failed' }, 'en', ''), /restored/);
  // Exercise the shared UI hook with a mocked API response; no real fetch or email.
  const state = [];
  const hookModule = { exports: {} };
  const hookJs = ts.transpileModule(fs.readFileSync('components/delivery/useDownload.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(`(function(require,module,exports){${hookJs}\n})`, {
    fetch: async () => new Response(JSON.stringify({ code: 'otp_cooldown', retryAfterSeconds: 37, error: 'รอก่อน' }), { status: 429 }),
  })(name => {
    if (name === 'react') return { useState: initial => { const index = state.length; state.push(initial); return [initial, next => { state[index] = next; }]; } };
    if (name === '@/lib/download-messages') return { downloadError };
    throw Error(name);
  }, hookModule, hookModule.exports);
  await hookModule.exports.useDownload('en').requestCode();
  assert.ok(state.some(value => typeof value === 'string' && value.includes('37 seconds')));
  assert.ok(!state.includes('code'), 'Failed request must stay at the email step');
  console.log('PASS behavior: permanent book URLs, missing translations, admin switch, 8 API error cases, Thai preservation, quota/ownership messages and shared download hook. No real services called.');
})().catch(error => { console.error(error); process.exitCode = 1; });
