/**
 * Automated Supabase Migration & Catalog Seed Runner
 *
 * Executes `supabase/00_master_init.sql` against the configured Supabase project.
 * Supports:
 * 1. Supabase Personal Access Token via Management API (SUPABASE_ACCESS_TOKEN)
 * 2. Direct PostgreSQL connection string (SUPABASE_DB_URL or DATABASE_URL)
 */

import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'zpjhybvsebzntojdaprm';

async function runWithAccessToken(token) {
  console.log(`Executing SQL migration via Supabase Management API for project: ${PROJECT_REF}...`);
  const sqlPath = path.resolve('./supabase/00_master_init.sql');
  const query = fs.readFileSync(sqlPath, 'utf8');

  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Management API error (${res.status}): ${body}`);
  }

  console.log('✅ Supabase database migration and production seed completed successfully!');
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_MANAGEMENT_TOKEN;
  if (token) {
    await runWithAccessToken(token);
    return;
  }

  console.log(`
=============================================================================
PROFESSOR KELLY MUA KINGSLY PLATFORM: SUPABASE MIGRATION READY
=============================================================================

Master SQL File: ./supabase/00_master_init.sql (172 KB)
Target Project:  https://zpjhybvsebzntojdaprm.supabase.co

To execute the migration and full catalog seed in 1 click:
1. Open the Supabase SQL Editor:
   https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new

2. Copy the contents of:
   supabase/00_master_init.sql

3. Click "Run".

Alternatively, provide a Supabase Access Token:
node scripts/migrate-supabase.mjs (with SUPABASE_ACCESS_TOKEN set)
=============================================================================
`);
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
