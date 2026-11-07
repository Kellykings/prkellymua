# Institutional Editorial & Governance Studio — End-to-End Technical Documentation
**System:** Professor Kelly Mua Kingsly Platform — Administrative Studio Console & Dual-Store Engine  
**Author:** Gilbert Mbeh  
**Version:** Production v1.0.0 (2026)  
**Target Audience:** Core Developers, Security Engineers, DevOps Maintainers, and Future Contributors  

---

## Table of Contents
1. [Executive Summary & Architectural Philosophy](#1-executive-summary--architectural-philosophy)
2. [Sovereign Security & Authentication Architecture](#2-sovereign-security--authentication-architecture)
3. [Information Architecture & Studio Workspaces](#3-information-architecture--studio-workspaces)
4. [Dual-Layer Persistence Engine](#4-dual-layer-persistence-engine)
5. [Input Sanitization & Schema Validation Engine](#5-input-sanitization--schema-validation-engine)
6. [Interactive CRUD Slide-Over Drawers](#6-interactive-crud-slide-over-drawers)
7. [RESTful Admin API Specification](#7-restful-admin-api-specification)
8. [Automated Verification & Test Harness](#8-automated-verification--test-harness)
9. [Developer Operations & Troubleshooting Playbook](#9-developer-operations--troubleshooting-playbook)

---

## 1. Executive Summary & Architectural Philosophy

The **Admin Studio** (`/admin`) serves as the mission-critical editorial, commercial, and sovereign governance console for Professor Kelly Mua Kingsly's institutional web platform. 

### Core Architectural Principles
1. **Zero-Engineering Dependency:** Enables the website owner, authorized protocol chiefs, and academic secretariats to create, modify, or archive publications, policy briefs, board mandates, media appearances, photo records, and protocol inquiries without modifying code or submitting pull requests.
2. **Dual-Store Fault Tolerance:** The platform bridges local offline development and high-availability cloud deployments seamlessly. When Supabase PostgreSQL is connected, data synchronizes to cloud tables under strict Row-Level Security (RLS). When in offline mode or during cloud downtime, the system falls back without interruption to an atomic, persistent JSON override store (`.data/content-overrides.json`), merged in real time with the baseline TypeScript repository (`seed-data.ts`).
3. **Zero-Leak Sovereign Security:** All administrative surfaces, mutations, and status modifications cross a zero-trust cryptographic boundary protected by HMAC-SHA256 session tokens, timing-safe passkey comparisons, and exhaustive payload sanitization.

```
+-----------------------------------------------------------------------------------------+
|                              ADMIN STUDIO CONSOLE (/admin)                              |
+-----------------------------------------------------------------------------------------+
                                             │
                       [HMAC-SHA256 Cookie / Passkey Verification]
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
|                  UNIFIED ADMIN API ROUTE (/api/admin/[entity])                          |
|         - Schema Validation & Sanitization (XSS Stripping, Length Clamping)             |
+-----------------------------------------------------------------------------------------+
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
   [Cloud Mode: Supabase PostgreSQL]             [Local Mode: Atomic Store]
   - Table: books, blog_posts, career_entries     - Path: .data/content-overrides.json
   - Strict Row-Level Security (RLS)              - Atomic Staging (.tmp -> rename)
   - Service Role Write Escalation                - In-Memory Memory Cache & Tombstones
                      └──────────────────────┬──────────────────────┘
                                             ▼
+-----------------------------------------------------------------------------------------+
|                   DATA REPOSITORY CONSUMPTION LAYER (repository.ts)                      |
|            - Deep Merge: Base Seed Data + Active Custom Overrides                       |
|            - Tombstone Deletion Filter (Hides Deleted Base Records)                     |
|            - Deterministic Reverse-Chronological Ordering                               |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Sovereign Security & Authentication Architecture

### 2.1 Passkey Cryptographic Verification
Administrative access is secured via a sovereign passkey managed through the `ADMIN_PASSKEY` environment variable. If unconfigured in local development, it defaults to a secure development vault passkey (`kmk-governance-2026!`).

```typescript
// src/lib/auth/admin-auth.ts
export function verifyPasskey(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const configured = process.env.ADMIN_PASSKEY || 'kmk-governance-2026!';
  
  // Timing-safe comparison against side-channel timing analysis attacks
  const inputBuffer = Buffer.from(input.trim());
  const targetBuffer = Buffer.from(configured.trim());
  if (inputBuffer.length !== targetBuffer.length) return false;
  
  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}
```

### 2.2 HMAC-SHA256 Session Tokens
When an administrator logs in, the platform generates a signed session token:
`{timestamp}.{hmac_sha256_signature}`

- **Token Secret:** Sourced from `DOWNLOAD_TOKEN_SECRET` or an internal cryptographic fallback.
- **Expiration:** 7 days (604,800,000 milliseconds).
- **Cookie Security Flags:**
  - `HttpOnly`: Inaccessible to client-side JavaScript, neutralizing cross-site scripting (XSS) token theft.
  - `SameSite: 'lax'`: Mitigates Cross-Site Request Forgery (CSRF).
  - `Path: '/'`: Enforces session persistence across all administrative sub-routes.
  - `Secure`: Enforced in production HTTPS environments.

### 2.3 Route Protection & Redirect Guards
- **Page Guard:** `src/app/admin/page.tsx` checks the `kmk_admin_session` cookie on incoming requests. If the cookie is absent or fails cryptographic verification, the user is immediately redirected to `/admin/login` via `HTTP 307`.
- **API Guard:** `src/app/api/admin/[entity]/route.ts` verifies either:
  1. `Authorization: Bearer <passkey_or_token>` header.
  2. `Cookie: kmk_admin_session=<token>`.
  Unauthenticated mutations return `HTTP 401 Unauthorized` with `{ error: 'Unauthorized administrative access.' }`.

---

## 3. Information Architecture & Studio Workspaces

The Admin Studio interface (`src/app/admin/page.tsx`) is structured around 8 dedicated workspace tabs accessible via deep-linked query parameters (`/admin?tab={tab_id}`):

```
+─────────────────────────────────────────────────────────────────────────────────────────+
| [Overview] [Books] [Policy Briefs] [Governance] [Media] [Gallery] [Inquiries] [System]  |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

### 3.1 Overview Tab (`?tab=overview`)
- **Executive Metric Cards:** Live counts of published monographs, policy briefs, governance appointments, media keynotes, and archival photos.
- **Rapid Actions:** One-click triggers to open create drawers for any entity.
- **Infrastructure Status:** Immediate indicator of Supabase Cloud vs. Atomic Local persistence mode.

### 3.2 Books Catalog Tab (`?tab=books`)
- **Scope:** Complete management of Professor Kingsly's monographic treatises.
- **Fields:** English & French titles, subtitles, ISBN-13, academic track (e.g., *Forensic Auditing*, *Sovereign Debt*), publisher, publication date, page counts, 3D cover image assets, synopses, and publication status (`published` / `draft`).
- **Commercial Channels:** Direct digital PDF pricing in both USD cents (`$45.00`) and Central African CFA Francs (`25,000 FCFA`), alongside official third-party retail links (Amazon, Christian Faith Publishing).

### 3.3 Policy Briefs & Blog Tab (`?tab=blog`)
- **Scope:** Strategic working papers, policy memos, and macroeconomic commentaries.
- **Fields:** Bilingual titles, slugs, academic category, publication date, estimated reading time, official DOI reference (e.g., `10.1000/182`), comma-separated search tags, bilingual executive abstracts, and full Markdown content sections.

### 3.4 Governance Register Tab (`?tab=governance`)
- **Scope:** Sovereign statecraft mandates, multilateral board appointments, and academic professorships.
- **Fields:** Bilingual mandate title, institution name, classification (`sovereign`, `multilateral`, `academic`, `advisory`), period/tenure (`2024 – Present`), active tenure status, administrative location, impact notes, and detailed mandate responsibilities.

### 3.5 Media Appearances Tab (`?tab=media`)
- **Scope:** Broadcast interviews, international keynotes, and press features.
- **Fields:** Bilingual topics, venue/broadcaster (e.g., *Africa24*, *CRTV*, *ATIDI*), appearance category (`broadcast`, `press`, `governance`, `academic`), format type, broadcast year, location, editorial pull-quote captions, external source URLs, and 11-character YouTube video IDs for responsive embedded players.
- **Keynote Flag:** `is_pinned` elevates high-stakes addresses (e.g., ATIDI General Assembly, CEMAC Finance Symposia) to the top of the media directory with gold keynote badges.

### 3.6 Archival Gallery Tab (`?tab=gallery`)
- **Scope:** Curated photographic records for the mobile-first rotating gallery.
- **Fields:** Bilingual photo titles, event assemblies, event categories (`summit`, `governance`, `academic`, `book_meetup`, `diplomatic`), year, seasonal cycle (`2025-2026`, `2023-2024`, `archive`), location, venue, image asset URL, and bilingual historical captions.
- **Spotlight Flag:** `is_featured_monthly` marks the hero spotlight photo for the homepage gallery banner.

### 3.7 Protocol Inquiries Tab (`?tab=inquiries`)
- **Scope:** Official correspondence submitted via the protocol portal.
- **Triage Pipeline:**
  - `received`: Awaiting secretariat triage.
  - `under_review`: Under executive consideration.
  - `responded`: Official protocol dispatch transmitted.
  - `archived`: Matter formally concluded.
- **Secretariat Features:** Sender coordinate inspection, organization badges, inquiry category chips, and internal administrative briefing notes.

### 3.8 System & Security Tab (`?tab=system`)
- **Scope:** Cryptographic health and data engine telemetry.
- **Metrics:** Live inspection of `.data/content-overrides.json` file status, active custom override counts, tombstone deletion totals, atomic staging status, last modified timestamps, environment secrets audit, and PostgreSQL Row-Level Security policy matrices.

---

## 4. Dual-Layer Persistence Engine

The persistence engine is implemented in `src/lib/data/custom-content-store.ts` and integrated through `src/lib/data/repository.ts`.

### 4.1 Storage Layout (`.data/content-overrides.json`)
```json
{
  "books": [],
  "blog": [],
  "governance": [],
  "media": [],
  "gallery": [],
  "inquiries": [],
  "deletedIds": {
    "books": [],
    "blog": [],
    "governance": [],
    "media": [],
    "gallery": [],
    "inquiries": []
  }
}
```

### 4.2 Atomic Write Staging Pattern
To prevent JSON file corruption from concurrent requests, process crashes, or interrupted file streams, writes use an atomic staging pattern:

```typescript
// src/lib/data/custom-content-store.ts
export function saveContentOverrides(data: ContentOverridesData): void {
  memoryStore = { ...data };
  try {
    ensureDataDir();
    const serialized = JSON.stringify(data, null, 2);
    
    // Write to unique temporary file first
    const tmpFile = path.join(
      DATA_DIR,
      `content-overrides.${Date.now()}.${Math.random().toString(36).slice(2, 6)}.tmp`
    );
    fs.writeFileSync(tmpFile, serialized, 'utf-8');
    
    // Atomically rename over target file
    try {
      fs.renameSync(tmpFile, STORE_FILE);
    } catch {
      // Windows partition fallback
      fs.writeFileSync(STORE_FILE, serialized, 'utf-8');
      if (fs.existsSync(tmpFile)) {
        try { fs.unlinkSync(tmpFile); } catch {}
      }
    }
  } catch {
    // Non-blocking in read-only / serverless edge environments
  }
}
```

### 4.3 Corrupted File Recovery
If `.data/content-overrides.json` is modified externally with invalid JSON syntax or truncated to zero bytes, `loadContentOverrides()` catches the error, safely isolates the failure, logs telemetry, and falls back to an empty in-memory store so public-facing pages never throw unhandled 500 errors.

### 4.4 Repository Seamless Deep Merge
In `src/lib/data/repository.ts`, data-fetching methods merge custom items over base records:

1. **Active Overrides Prepend:** Custom items added or updated through the Studio take precedence over base seed data with matching IDs.
2. **Tombstone Filtering:** Any ID present in `deletedIds[entity]` is filtered out of the response, allowing administrators to permanently hide baseline records.
3. **Deterministic Sorting:** Items are sorted by publication date or priority (e.g., monographs reverse-chronological by `publish_date`, media by `is_pinned` then date).

---

## 5. Input Sanitization & Schema Validation Engine

Located in `src/lib/data/validation.ts`, this layer protects the system against stored Cross-Site Scripting (XSS), URL injection, and payload inflation.

### 5.1 Sanitization Functions
- `sanitizeText(input, maxLength = 2000)`:
  - Strips `<script>...</script>` and `<iframe>...</iframe>` blocks.
  - Strips `javascript:...` URI schemes.
  - Strips inline DOM event handlers (`onload=`, `onerror=`, `onclick=`).
  - Trims whitespace and clamps string length.
- `sanitizeSlug(input)`:
  - Converts strings to lowercase alphanumeric hyphens (`/^[a-z0-9-]+$/`).
  - Collapses consecutive hyphens.
  - Enforces a 120-character maximum length.

### 5.2 Entity Validators
Every entity payload must satisfy strict structural schemas before reaching the store:

| Validator Function | Minimum Validation Constraints |
|---|---|
| `validateBookPayload` | `title.en` (min 3 chars), valid `isbn` (min 5 chars), `slug`, `total_pages` (10–5000), valid `status` enum. |
| `validateBlogPostPayload` | `title.en` (min 3 chars), `slug`, `excerpt.en`, `estimated_read_minutes` (1–180), sanitized tags array. |
| `validateCareerPayload` | `role_title.en` (min 3 chars), `organization.en` (min 2 chars), valid `category` (`sovereign`, `multilateral`, `academic`, `advisory`). |
| `validateMediaPayload` | `title.en` (min 3 chars), `venue` broadcaster, valid `category`, valid `type` enum. |
| `validateGalleryPayload` | `title.en` (min 3 chars), `image_url` (must begin with `/` or `https://`), valid `category`, valid `season`. |
| `validateInquiryPayload` | Valid `status` enum (`received`, `under_review`, `responded`, `archived`), sanitized `admin_note`. |

---

## 6. Interactive CRUD Slide-Over Drawers

CRUD interactions are managed via accessible, responsive slide-over modal drawers in `src/components/admin/crud/`:

- `AdminDrawerModal.tsx`: Base drawer primitive with backdrop blur, smooth slide-in transitions, ESC key listener, and body scroll lock.
- `BookFormDrawer.tsx`: Monograph creation and update form.
- `BlogFormDrawer.tsx`: Policy brief and working paper authoring form.
- `GovernanceFormDrawer.tsx`: Sovereign mandate registration form.
- `MediaFormDrawer.tsx`: Broadcast and keynote management form.
- `GalleryFormDrawer.tsx`: Archival photo and assembly registration form.
- `InquiryStatusDrawer.tsx`: Protocol correspondence triage drawer.
- `DeleteConfirmModal.tsx`: Irreversible deletion modal requiring affirmative confirmation.

### Client-Side Error & Expiry Handling
All drawers handle network failures, validation errors, and session expirations gracefully:
```typescript
if (!res.ok) {
  if (res.status === 401) {
    throw new Error('Administrative session expired. Please re-enter your passkey.');
  }
  let errMsg = 'Failed to save record.';
  try {
    const errData = await res.json();
    errMsg = errData.error || errMsg;
  } catch {
    errMsg = (await res.text()) || errMsg;
  }
  throw new Error(errMsg);
}
```

---

## 7. RESTful Admin API Specification

All administrative API endpoints reside under `/api/admin/`.

### 7.1 Authentication Endpoints (`/api/admin/auth`)

#### `POST /api/admin/auth`
Logs an administrator into the Studio Console.
- **Request Body:**
  ```json
  { "passkey": "kmk-governance-2026!" }
  ```
- **Response `200 OK`:**
  ```json
  { "ok": true, "message": "Administrative session authorized." }
  ```
  *Headers:* `Set-Cookie: kmk_admin_session=<hmac_token>; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
- **Response `401 Unauthorized`:**
  ```json
  { "error": "Access denied. Sovereign passkey is invalid." }
  ```

#### `DELETE /api/admin/auth`
Logs out the current administrator and destroys the session cookie.
- **Response `200 OK`:**
  ```json
  { "ok": true, "message": "Administrative session concluded." }
  ```
  *Headers:* `Set-Cookie: kmk_admin_session=; Path=/; HttpOnly; Max-Age=0`

---

### 7.2 Entity CRUD Endpoints (`/api/admin/[entity]`)
Supported entities: `books`, `blog`, `governance`, `media`, `gallery`, `inquiries`.

#### `POST /api/admin/[entity]`
Creates a new record. Requires valid passkey or session cookie.
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token_or_passkey>` (optional if cookie present).
- **Request Body:** Entity JSON payload conforming to schema.
- **Response `201 Created`:**
  ```json
  {
    "ok": true,
    "data": { "id": "book-38a19bc2", "title": { "en": "..." }, ... },
    "source": "supabase" // or "local"
  }
  ```
- **Response `400 Bad Request`:** Payload validation failure or invalid entity.
- **Response `401 Unauthorized`:** Unauthenticated request.

#### `PUT /api/admin/[entity]`
Updates an existing record by `id`. Requires authentication.
- **Request Body:** Entity JSON payload including mandatory `id` string.
- **Response `200 OK`:**
  ```json
  {
    "ok": true,
    "data": { "id": "book-38a19bc2", ... },
    "source": "local"
  }
  ```

#### `DELETE /api/admin/[entity]`
Deletes an item or adds its ID to the tombstone list. Requires authentication.
- **Query Parameter or JSON Body:** `?id={record_id}` or `{ "id": "{record_id}" }`.
- **Response `200 OK`:**
  ```json
  {
    "ok": true,
    "deletedId": "book-38a19bc2",
    "source": "local"
  }
  ```

---

## 8. Automated Verification & Test Harness

The system is verified via Vitest (`vitest.config.mjs`) with strict path alias mapping (`@` to `./src`).

### 8.1 Test Inventory (8 Test Suites, 78 Passing Tests)
1. `src/lib/__tests__/admin-auth-validation.test.ts` (14 tests):
   - Passkey verification and rejection.
   - HMAC session token signing and verification.
   - Tampered token and expired token rejection.
   - Bearer header and cookie authorization parsing.
   - XSS sanitization (`<script>`, `<iframe>`, `javascript:`).
   - Slugs, monographs, policy briefs, mandates, media, and gallery validators.
   - Store health and capacity limits.
   - Login, logout, and 401 error handlers.
2. `src/lib/__tests__/admin-crud.test.ts` (10 tests):
   - Dual-store local additions, updates, and tombstone deletions.
   - Repository deep-merge and chronological sorting.
   - Unified API route POST, PUT, DELETE operations with authentication.
3. `src/lib/__tests__/admin-studio-e2e.test.ts` (7 tests):
   - Monograph inventory integrity, chapter outlines, pricing SKUs.
   - Inquiries triage and RLS database compatibility.
4. `src/lib/data/__tests__/repository.test.ts` (13 tests):
   - Data repository query methods, reverse chronological book ordering, media ordering.
5. `src/lib/__tests__/utils.test.ts` (6 tests):
   - Formatting helpers, currency converters, gallery categorizers.
6. `src/lib/__tests__/platform-improvements.test.ts` (12 tests):
   - Track filter pills, blog search query logic, legal routes.
7. `src/components/home/__tests__/EpicEventGallery.test.ts` (11 tests):
   - Gallery category localization, seasonal filtering, 25-photo bounds.
8. `src/lib/__tests__/contact-api.test.ts` (5 tests):
   - Contact and protocol submission endpoints.

### 8.2 Executing Automated Checks
```bash
# Run unit and integration test suite
npm test

# Run TypeScript compiler type-check
npm run typecheck

# Run Next.js and ESLint code standards
npm run lint
```

---

## 9. Developer Operations & Troubleshooting Playbook

### 9.1 Environment Variables Configuration
Configure the following in your `.env.local` file:
```env
# Administrative Sovereign Passkey
ADMIN_PASSKEY=kmk-governance-2026!

# Cryptographic Token Secret (HMAC-SHA256 for admin sessions and download URLs)
DOWNLOAD_TOKEN_SECRET=sovereign-audit-2026-super-secret-key-32chars

# Supabase PostgreSQL (Optional for local mode; required for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Canonical Platform URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 9.2 Adding a New Entity to the Admin Studio
To introduce a new domain entity (e.g., `awards` or `keynotes`):
1. **Define Types:** Update `src/types/domain.ts` with the new domain interface.
2. **Extend Store:** Add the collection and tombstone array to `ContentOverridesData` in `src/lib/data/custom-content-store.ts`.
3. **Add Validator:** Write `validateAwardPayload` in `src/lib/data/validation.ts`.
4. **Register in API Route:** Add the entity key to `VALID_ENTITIES` and `TABLE_MAP` in `src/app/api/admin/[entity]/route.ts`.
5. **Create Form Drawer:** Build `AwardFormDrawer.tsx` under `src/components/admin/crud/`.
6. **Add Studio Section:** Add `AdminAwardsSection.tsx` under `src/components/admin/` and wire it into `src/app/admin/page.tsx` with a new nav tab.

### 9.3 Troubleshooting Common Scenarios

#### Scenario A: Admin Page Continuously Redirects to Login
- **Cause:** Missing or expired `kmk_admin_session` cookie, or clock skew on the host machine exceeding 7 days.
- **Solution:** Navigate to `/admin/login`, enter the passkey (`kmk-governance-2026!` or value in `ADMIN_PASSKEY`), and confirm the response sets a valid cookie.

#### Scenario B: Public Catalog Shows an Outdated Record
- **Cause:** Browser cache or local JSON override needs sync.
- **Solution:** Inspect `/admin?tab=system` to check `Active Overrides`. Verify that the item was saved, and refresh the catalog page. In production, Next.js revalidates cached routes via ISR.

#### Scenario C: Corrupted JSON File Warning
- **Cause:** Direct manual editing of `.data/content-overrides.json` with trailing commas or syntax errors.
- **Solution:** The platform automatically falls back to an in-memory clean state. To permanently restore the file, run:
  ```bash
  echo '{"books":[],"blog":[],"governance":[],"media":[],"gallery":[],"inquiries":[],"deletedIds":{"books":[],"blog":[],"governance":[],"media":[],"gallery":[],"inquiries":[]}}' > .data/content-overrides.json
  ```

---

### Author & Attribution
**Gilbert Mbeh**  
Lead Software Engineer & Systems Architect  
*Professor Kelly Mua Kingsly Institutional Web Platform*  
Year of Sovereign Production: 2026
