// Render the real component (including next/image) without changing real content.
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness intentionally intercepts Module.require for the TS component. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function load(relative) {
  const filename = path.resolve(__dirname, '..', relative);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = name => name.startsWith('@/') ? load(name.slice(2) + '.ts') : original(name);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, filename);
  return mod.exports;
}
const Card = load('components/ArticleCard.tsx').default;
const article = {slug: 'fixture', title: 'Fixture title', description: 'Fixture description',
  category: 'SQL', date: '2026-09-24', readingMinutes: 3, tags: [], draft: true};
const covered = renderToStaticMarkup(React.createElement(Card, {
  article: {...article, cover: '/images/articles/fixture.webp'}, index: 0,
}));
assert.match(covered, /<img /);
assert.match(covered, /alt=""/);
assert.match(covered, /sizes="/);
assert.match(covered, /Fixture title/);
assert.match(covered, /Fixture description/);
assert.match(covered, /SQL/);
assert.match(covered, /href="\/articles\/fixture"/);
const fallback = renderToStaticMarkup(React.createElement(Card, {article, index: 0}));
assert.doesNotMatch(fallback, /<img /);
assert.match(fallback, /card-glyph/);
assert.match(fallback, /01/);
console.log('ArticleCard: real next/image, metadata, link and legacy fallback PASS');
