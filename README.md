# Professor Kelly Mua Kingsly — Institutional Authority, Hybrid Bookstore & Academic Platform

Enterprise-grade bilingual (`EN` / `FR`) web application, hybrid e-commerce bookstore, and scholarly archive for **Professor Kelly Mua Kingsly (PhD, DBA, MPA, CFA)**, built in accordance with `system-documentation.md`.

## Key Architecture & Features

- **Modern Diplomatic Design System**: Sovereign Navy (`#0E1E28`), Warm Champagne Gold (`#C8A86B`), and Crisp Alabaster (`#F9FAF9`) engineered for WCAG 2.2 AA contrast compliance.
- **Bilingual (`EN` / `FR`) Routing**: Automatic locale resolution (`/en/*` and `/fr/*`) via Next.js Middleware (`src/middleware.ts`) with full localized dictionaries and JSONB content records.
- **Verified Institutional Chronology**:
  - Ministry of Finance of Cameroon (`MINFI`) — Director of Finance Operations of the State (`DFOE`)
  - African Trade & Investment Development Insurance (`ATIDI`) — Chairman of the Board of Directors (2020–Present)
  - COSUMAF, UNDP-GEF, ENAM, Harvard / Thunderbird / Copperbelt / Charisma doctoral & executive credentials
- **Hybrid E-Commerce Bookstore (`/books` & `/books/[slug]`)**:
  - **Mode 1 — Direct Digital & Print Checkout**: Instant 72-hour HMAC signed token vault (`/books/download/[token]`) backed by Stripe Checkout / Supabase Private Storage.
  - **Mode 2 — Verified 3rd-Party Retailers**: Direct outbound links to Amazon, Barnes & Noble, and Christian Faith Publishing with click telemetry (`/api/telemetry`).
  - **Academic Citation Export**: One-click `APA 7th` and `BibTeX` generator on every book and policy brief.
- **Supabase PostgreSQL Schema & RLS (`supabase/migrations/0001_initial_schema.sql`)**:
  - Complete relational schema (`profiles`, `books`, `book_formats`, `third_party_retailers`, `orders`, `download_tokens`, `blog_posts`, `career_entries`, `media_appearances`, `contact_inquiries`, `audit_logs`) with Row-Level Security (RLS) policies and seed data (`supabase/seed.sql`).
  - Automatic local fallback repository (`src/lib/data/repository.ts`) so the site builds and runs immediately even before live `.env.local` credentials are supplied.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables (optional for local preview):**
   Copy `.env.example` to `.env.local` and populate your keys:
   ```env
   ADMIN_PASSKEY=kmk-governance-2026!
   DOWNLOAD_TOKEN_SECRET=sovereign-audit-2026-super-secret-key-32chars
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (automatically redirects to `/en` or `/fr`).

4. **Run automated verification tests:**
   ```bash
   npm test          # Runs all 8 Vitest suites (78 passing tests)
   npm run typecheck # TypeScript compiler verification
   npm run lint      # ESLint validation
   ```

5. **Production build:**
   ```bash
   npm run build
   ```

## Admin Studio & Autonomous Content Console

The platform includes a zero-engineering dependency **Editorial & Governance Studio Console** located at `/admin` (protected by sovereign passkey at `/admin/login`).

- **Architecture Documentation:** Consult [`admin-studio-documentation.md`](./admin-studio-documentation.md) for full end-to-end technical documentation covering authentication cryptography, dual-layer persistence, schema validation, slide-over drawer primitives, and RESTful API endpoints.
- **Documentation Author:** Gilbert Mbeh (Lead Software Engineer & Systems Architect)

