# UI/UX War Room: Home Page Audit

**Subject:** `localhost:3000/en` (Professor Kelly Mua Kingsly portfolio, EN, desktop 1920×1080)
**Date:** 31 October 2026
**Format:** Panel audit, prioritised findings, iteration ladder, verdict stamps

**Scope and limits.** This audit covers 8 static desktop screenshots. Mobile, hover/focus states, the FR locale, performance, and the code were not visible. Items marked *(verify)* need a tool check (axe, Lighthouse, doi.org) before being treated as confirmed.

---

## 1. The Panel

| Seat | Mandate |
|---|---|
| **P1 · UX Architect** | IA, conversion paths, navigation |
| **P2 · Visual & Brand Director** | Typography, color, hierarchy, rhythm |
| **P3 · Accessibility Lead** | WCAG 2.2, legibility, semantics |
| **P4 · Content & Credibility Editor** | Copy, consistency, bilingual quality |
| **P5 · Commerce UX Lead** | Bookstore, pricing, payments |
| **P6 · Frontend & Performance Engineer** | Next.js implementation, budgets, SEO |
| **P7 · Governance & Risk Reviewer** | Public-official context, disclosures, exposure |

---

## 2. What to Preserve

- The navy/gold identity is cohesive and fits the audience.
- The serif/sans pairing carries authority.
- The dark/light section rhythm works.
- The hero has a clear dual CTA, and the text and CTAs fit above the fold.
- Book cards show ISBN and price up front. All three ISBN-13 check digits validate, though registration should still be confirmed.
- Brief cards use a scholarly pattern (category, date, read time, identifier).
- EN/FR support exists from day one, and a disclaimer exists.

---

## 3. Findings

### P0: Fix before any public release

| ID | Finding (evidence) | Remediation |
|---|---|---|
| **P0-1** | **Identity is truncated in the header.** "Prof. Kelly Mua Kin…" and "PHD · DBA · MPA · C…". Eight nav items wrap onto two lines ("Books & Store", "Media & Speeches"). | Reduce to ≤6 nav items with `white-space: nowrap`. Show the full name on one line and move credentials to the hero. Never truncate a person's name. |
| **P0-2** | **Internal tooling is public.** The footer links "Editorial CMS Studio & RLS Audit Console" and "Digital Fulfillment Vault"; "Editorial Studio" is in the top bar; the copyright line names Supabase RLS and the tech stack. | Move admin to a separate noindex subdomain behind auth and remove it from public UI. Delete stack and "RLS" badges. Visitors gain nothing from them and they advertise your architecture. |
| **P0-3** | **Credibility data is inconsistent.** "Director of State Finance Operations" (hero) vs "Director of Finance Operations of the State" (card). "Professor" (hero card) vs "Senior Lectureship" (pillar 06). "Catalog (5)" vs "4 published volumes" vs 3 shown. Dates read "PRESENT", "2024 – PRESENT", "CURRENT MANDATE". | Create one `roles` and `publications` source of truth that every component reads from. Standardise one title string per role per locale and one date format. |
| **P0-4** | **"Verified" is claimed ~6 times with no evidence.** | Reserve "Verified" for items with a link to a decree, official page, or publisher record. Otherwise use plain labels like "Appointment" or "Mandate". |
| **P0-5** | **DOIs likely won't resolve.** `10.5281` is Zenodo's prefix, and Zenodo assigns its own numeric suffixes, so `kmk.policy.2026.01` is probably not a real DOI *(verify at doi.org)*. A fake-looking DOI on a scholarly site is a serious credibility risk. | Mint real DOIs (Zenodo) or relabel as "Ref. ID". |
| **P0-6** | **No human face.** The hero is a generated monogram card with ~7px tracked microtext ("SOVEREIGN FINANCE & SCHOLARLY ARCHIVE", "KNIGHT OF THE NATIONAL ORDER OF VALOR"), and the caption is truncated ("…National Orde…"). | Use a professional portrait in the hero, with the monogram as a small seal. Set a hard minimum of 12px for informative text. |
| **P0-7** | **Disclaimer and store legals.** The non-affiliation notice (MINFI/COSUMAF/UNDP/ATIDI) appears only at the very bottom, while the hero leads with those affiliations. A store with no visible Privacy, Terms of Sale, or Refund/Digital-delivery policy. "WCAG 2.2 AA" is claimed but contrast issues are visible. | Add a one-line independence strip under the hero stats linking to the full charter. Publish Privacy, Terms, and Refund pages before taking payments. Remove the WCAG badge until audited. Have counsel review the disclaimer wording. |

### P1: High-impact improvements

| ID | Finding | Remediation |
|---|---|---|
| **P1-1** | **Hero headline leading is too tight** (~0.95); descenders and ascenders touch between lines 1–2. Body text appears to use negative tracking, which hurts readability. | Display leading 1.08–1.12. Body tracking 0, line-height 1.6. |
| **P1-2** | **ALL-CAPS overuse.** Eyebrows, org names (COSUMAF…), card labels, links, buttons, and footer headings all use caps. Hierarchy flattens. | Caps only for one eyebrow per section. Org names in title case or small-caps. Buttons in sentence case. |
| **P1-3** | **Header is ~140px tall (13% of the viewport) and sticky.** | Condense to ~64px on scroll and drop the utility bar after scroll. Add `scroll-margin-top` so anchors don't hide headings. |
| **P1-4** | **Card misalignment.** Mandate eyebrows wrap ("01 · SOVEREIGN / PRESENT · SOVEREIGN MANDATE"). Pillar titles start at different heights (01 wraps to 2 lines). The ISBN wraps mid-number. Cards have uneven empty space. | Use a fixed card anatomy: eyebrow (1 line), title (≤2), body (≤3), meta pinned bottom. Use CSS grid/subgrid for equal rows. Add `white-space: nowrap` to ISBN. |
| **P1-5** | **Book cards are ~1000px tall.** The cover fills the viewport, and title and price only appear after a full scroll. Covers look like placeholders. "ACQUIRE" and "DIRECT EDITION" are jargon. Format (PDF/ePub), page count, and sample chapter are missing. The intro mentions retail partners but no links show. | Cover width ~240px beside or above the metadata so the price and CTA are visible without scrolling. Use real covers or a consistent mockup. CTA: "Buy PDF / ePub". Add format, pages, and "Read sample". Add partner links. |
| **P1-6** | **USD only** for a CEMAC audience, with no payment-method cues. | XAF/USD toggle (XAF without decimals). Show accepted methods (cards, mobile money) near the CTA. Explain the 72h download token on the product page. |
| **P1-7** | **Six identical "EXAMINE DOMAIN →" links** fail link-purpose clarity for screen readers. | Make the whole card a link with a unique accessible name ("Public Financial Management & State Treasury, examine domain"). |
| **P1-8** | **Contrast risks** *(verify with axe)*. Olive-gold text on white (eyebrows, "01 · SOVEREIGN"), light-grey notes ("Verified statutory…"), and muted gold links on navy. | Dark theme: keep bright gold. Light theme: use a deeper bronze (~#7A5A1A ≈ 6:1) and body grey ≥ #4B5563. Define separate tokens per surface. |
| **P1-9** | **Redundancy and missing sections.** ATIDI appears 3 times and the discipline list 3 times (top bar, eyebrow, pillars). The nav promises Biography and Media & Speeches, but the home page has no portrait/bio teaser, media section, endorsements, newsletter, or institutional-contact CTA. | Cut duplicates. Add: Bio teaser with portrait → Media/Speeches strip → Newsletter → "Institutional & protocol enquiries" CTA. |
| **P1-10** | **Copy voice is fortress-like.** "Sovereign Firewall", "Examine Verified Biography", "Acquire", "Examine Domain", "Protocol & Contact". The hero headline lists topics rather than stating a value. | Use plain verbs ("Read biography", "Browse books", "Contact"). Rename "Ethics & Sovereign Firewall" to "Independence & Ethics". Try a person-led headline, e.g. *"Treasury leadership, multilateral governance and forensic scholarship for Central Africa."* |
| **P1-11** | **Bilingual risk.** FR strings run ~15–25% longer, and the EN nav already wraps. | Test FR at 1280, 1024, and 390px. Show the target language ("Français") in the switcher. Format dates and currency with `Intl`. Add `hreflang`. Consider which locale should be the default for first-time visitors. |

### P2: Polish

- Show dates as "18 Sep 2026" / "18 sept. 2026" instead of ISO.
- Use one icon meaning: ↗ should mean external only.
- Replace the "XML Sitemap" footer link (not for humans).
- Add a "Cite this brief" block and a PDF download to briefs.
- Add a print stylesheet for briefs.
- Add `Person`, `Book`, and `ScholarlyArticle` JSON-LD, plus generated OG images.
- Add a visible focus ring and a skip link *(verify)*.

---

## 4. Iteration Ladder

| Rung | Window | Goal | Exit gate |
|---|---|---|---|
| **R1 · Hotfix** | 1–2 days | P0-1, P0-2, P0-3 strings, ISBN nowrap, leading/tracking, bronze/grey tokens, remove WCAG badge | No truncation at 1280–1920; no admin links public |
| **R2 · Trust layer** | Week 1 | Portrait, evidence links, real DOIs, independence strip, legal pages, hero microtext fix | Every "verified" item links to evidence |
| **R3 · Commerce & IA** | Week 2 | Book card redesign, XAF/payments, new home sections, condensed header, unique link names | Price and CTA visible without scrolling |
| **R4 · System** | Weeks 3–4 | Design tokens, card/section components, FR QA, axe + Lighthouse CI, schema.org | CI gates green on EN and FR |
| **R5 · Governance** | Ongoing | Content model ownership, quarterly credential review, visual regression suite | Zero content drift between pages |

---

## 5. Standards for All Other Pages

1. **Type scale:** Display 56/62, H2 40/48, H3 24/32, body 17–18/28. Body tracking 0, caps only for one 12–13px eyebrow, no informative text under 12px.
2. **Color tokens by surface:** separate `on-navy` and `on-white` palettes. Text ≥4.5:1, large text and UI ≥3:1.
3. **Spacing:** 8-pt scale, section padding 96–128px desktop and 56–72px mobile.
4. **Card anatomy:** the same structure everywhere (see P1-4), with the whole card clickable and one visible CTA.
5. **Header:** ≤6 items, no wrap, condensed on scroll, with a mobile drawer and ≥44px touch targets.
6. **Page template:** one H1, breadcrumbs, "last reviewed" date, independence strip, related content, and a clear CTA.
7. **A11y baseline:** landmarks, skip link, 2px visible gold focus ring, unique link names, `prefers-reduced-motion`, and alt text (decorative art `aria-hidden`).
8. **Performance budgets:** LCP ≤2.5s on Slow 4G, CLS <0.1, INP <200ms, ≤170KB gzipped JS per route. Use two font families (subset, preloaded), `next/image` with explicit sizes, and AVIF/WebP.
9. **i18n:** every string in dictionaries, a +30% expansion test, localized dates and currency, and mirrored slugs with `hreflang`.
10. **Commerce:** price, format, delivery method, refund policy, and payment methods on every product page, with receipts and token-expiry messaging.
11. **Content governance:** a single source of truth; "verified" requires an evidence URL; changes to titles or dates go through one reviewed model.
12. **CI gates:** axe, Lighthouse CI, Playwright snapshots at 360/768/1280/1920 in EN and FR, and a link and DOI checker.

---

## 6. Panel Verdicts

| Seat | Score | Stamp |
|---|---|---|
| P1 UX Architect | 5/10 | **CONDITIONAL**: strong shell, thin IA |
| P2 Visual Director | 7/10 | **APPROVED WITH FIXES**: type and caps discipline needed |
| P3 Accessibility | 5/10 | **CONDITIONAL**: unverified, contrast and microtext risks |
| P4 Content & Credibility | 4/10 | **HOLD**: inconsistencies and unproven "verified" claims |
| P5 Commerce UX | 5/10 | **CONDITIONAL**: card layout, currency, and legal pages |
| P6 Frontend/Perf | 6/10 | **PENDING**: needs Lighthouse and code review |
| P7 Governance & Risk | 4/10 | **HOLD**: admin exposure, disclaimer placement, store legals |

*Scores are judgment estimates from screenshots, not measurements.*

### OVERALL: CONDITIONAL PASS, NOT RELEASE-READY

Ship R1 and R2 first. The visual identity is already strong, and the gaps are mostly trust, consistency, and commerce basics.
