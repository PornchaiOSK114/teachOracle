# teeDBA bilingual website

Updated 2026-10-02 (Asia/Bangkok). Owner approved the five review fixes and selected `/english/` for the English website. The printed book URLs `/en` and `/en/lab` retain their original purpose.

## URL ownership

| Purpose | Thai | English |
|---|---|---|
| Website home | `/` | `/english` |
| Articles | `/articles/<slug>` | `/english/articles/<slug>` |
| Courses, about, contact, products | Existing URLs | `/english/...` |
| Download and thank-you | Existing URLs | `/english/...` |
| Book errata | Existing book resources | `/en` (preserved) |
| Book lab | `/lab` | `/en/lab` (preserved) |
| RSS / site summary | `/feed.xml`, `/llms.txt` | `/english/feed.xml`, `/english/llms.txt` |

Next.js may normalize a trailing slash; this does not change the page's role. Do not redirect `/en` to `/english`, and do not replace `/en` with the blog homepage. The English website links to the existing book resources. No PDF bytes or book lab download targets were changed.

## Source and rendering

- Thai routes: `app/(thai)/`; English website routes: `app/(english)/english/`; preserved book routes: `app/(english)/en/`.
- Root layouts share `components/SiteLayout.tsx`; the server renders the correct HTML language for ordinary pages. Switching between root layouts performs a full navigation and preserves query/hash, but unsent form input is not transferred.
- Original Thai articles stay in `content/articles/`; English translations in `content/en/articles/` use the same slug.
- `components/ArticlePage.tsx` renders both languages. `lib/content.ts` accepts a locale; its default remains Thai. `lib/content-en.ts` is a convenience wrapper.
- `lib/i18n.ts` centralizes the website prefix and the permanent lab exception. `lib/locale-routes.ts` supplies actual language pairs to navigation. Missing translations and admin pages do not get fabricated language links.
- Article metadata checks published counterparts before adding hreflang. Sitemap includes each published language independently. `/en` is a standalone book resource, not the translation of `/`.
- `lib/site.ts` remains the source for prices, purchase URLs, images and shared product facts. `lib/site-en.ts` supplies English copy; course translations are keyed by course code.
- `components/delivery/useDownload.ts` and `usePaymentStatus.ts` share client behavior. Localized route components supply the presentation.
- Download API errors retain the original Thai `error` and HTTP status. Additive `code`, wait/attempt/limit fields drive `lib/download-messages.ts`. No database, webhook, quota, watermark or authorization rules changed.
- Explicit `/english/opengraph-image` is a stable image route. English breadcrumb and fallback image URLs use the English website.
- `app/global-not-found.tsx` provides an English/Thai standalone 404 for unmatched paths with a real HTML language, noindex and home/book links. It uses the documented Next.js `experimental.globalNotFound` option for multiple root layouts. Slug-level not-found views retain their locale and noindex metadata. Recheck this option on framework upgrades.

## Articles and publishing

The release includes Identity Column, STARTUP/SHUTDOWN and ARCHIVELOG/NOARCHIVELOG translations. SQL/output blocks are unchanged; original Thai names and code comments stay inside those blocks. No Oracle execution was performed in this web release.

The release starts from `9240a02841c184692c9b44f92322e760cdd6fa23`, including the latest NOARCHIVELOG cover. That commit changes cover metadata only; the English cover and source hash were updated after inspecting the delta. Existing Thai draft/deleted files in the owner's older checkout are not part of this release.

`npm run new:post <slug> "Thai title"` creates a pair of drafts, not an automatic translation or publication approval. Translate the complete approved article and supply `translationOf` and `translationSourceSha256` (SHA-256 of the UTF-8 Thai file after CRLF-to-LF normalization). Review substantive source changes before updating that hash.

New Thai-only posts remain valid. They show a translation-unavailable status and do not advertise a nonexistent English counterpart. The migration test requires the three delivered pairs, and checks code/output and source hashes for existing pairs; it does not require every future post to already be bilingual. `test:i18n` is a release check, not a new Publisher scheduler or approval gate. Publisher queue integration and automatic translation remain separate work.

## Store and delivery boundaries

English product pages explicitly say `Language: Thai` and that an English edition is not currently offered by this storefront. The preserved book-resource page keeps its pre-existing edition information; it is not a new product listing.

External Stripe checkout, return-URL configuration and transactional emails remain as configured before this release. Clicking an English purchase link does not guarantee an English checkout/email/return page. The localized thank-you page exists, but checkout locale routing was not changed.

## Verification

```powershell
npm ci
npm run lint
npm run typecheck
npm run test:i18n
npm run build
npm run start -- --hostname 127.0.0.1 --port 3117
```

In another terminal:

```powershell
$env:BILINGUAL_BASE_URL = 'http://127.0.0.1:3117'
npm run test:i18n
```

Behavior tests mock services in memory: no real OTP, email, payment or private PDF request. HTTP tests allow localhost only and cover the paired public pages, permanent book URLs, canonical/hreflang, feeds, sitemap, English OG, private-flow noindex and invalid URLs. Browser checks cover desktop/mobile navigation, search/category/no-results, language switching, theme and public sample previews.

The local build can still emit Next.js metadataBase warnings while generating internal fallback artifacts. Release HTTP checks verify that served public pages and unmatched 404 responses do not use localhost metadata. Do not treat a build warning as evidence of a broken production URL, or a successful build as evidence of a verified production deployment.

## Working copy and deployment

Integration worktree: `C:\โปรเจ็คเล่นสนุกของตี๋\Web Blog\teedba-english-20261002`, branch `codex/english-web`, same `PornchaiOSK114/teachOracle` repository. The original checkout and Publisher's source worktree remain preserved. Continue web edits in this Web Blog worktree; do not maintain another website in Publisher.

Stage exact release paths. Confirm remote main before a non-force push. Existing GitHub-to-Vercel production linkage was verified through GitHub deployment records for base commit `9240a02`. Record the release commit, successful deployment record and real-domain HTTP/browser checks separately in `PROJECT_STATE.md`.

Rollback: if public routes, book URLs or delivery entry pages regress, revert the release commit on the current main and verify the replacement deployment and preserved URLs. There is no schema migration to reverse. Do not reset the owner's original working tree.
