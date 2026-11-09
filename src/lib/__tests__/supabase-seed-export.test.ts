import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  SEED_BOOKS,
  SEED_BLOG_POSTS,
  CAREER_ENTRIES,
  MEDIA_APPEARANCES,
  SEED_GALLERY_PHOTOS,
} from '@/lib/data/seed-data';

function sqlVal(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') {
    const jsonStr = JSON.stringify(val);
    return `'${jsonStr.replace(/'/g, "''")}'::jsonb`;
  }
  const str = String(val);
  return `'${str.replace(/'/g, "''")}'`;
}

function sqlArray(arr?: string[]): string {
  if (!Array.isArray(arr) || arr.length === 0) return 'ARRAY[]::text[]';
  const elements = arr.map((item) => sqlVal(item)).join(', ');
  return `ARRAY[${elements}]::text[]`;
}

describe('Generate Full Production Supabase SQL Seed', () => {
  it('generates supabase/full_production_seed.sql with all official entities', () => {
    let sql = `-- ==============================================================================
-- PROFESSOR KELLY MUA KINGSLY PLATFORM
-- FULL PRODUCTION DATABASE SEED (EN & FR)
-- Compatible with Supabase PostgreSQL (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. BOOKS & MONOGRAPHIC TREATISES (${SEED_BOOKS.length} Volumes)
`;

    for (const book of SEED_BOOKS) {
      sql += `INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  ${sqlVal(book.slug)},
  ${sqlVal(book.isbn)},
  ${sqlVal(book.title)},
  ${sqlVal(book.subtitle)},
  ${sqlVal(book.synopsis)},
  ${sqlVal(book.academic_category)},
  ${sqlVal(book.cover_image_url)},
  ${sqlVal(book.total_pages)},
  ${book.publish_date ? `'${book.publish_date}'::date` : 'NULL'},
  ${sqlVal(book.publisher)},
  ${sqlVal(book.chapters || [])},
  ${sqlVal(book.is_featured || false)},
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;\n\n`;

      if (book.book_formats && book.book_formats.length > 0) {
        for (const fmt of book.book_formats) {
          sql += `INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, ${sqlVal(fmt.format)}::format_type, ${fmt.price_cents}, ${sqlVal(fmt.currency || 'USD')}, ${fmt.is_available ? 'true' : 'false'}, ${sqlVal(fmt.sku)}, ${sqlVal(fmt.file_storage_path)}
FROM public.books WHERE slug = ${sqlVal(book.slug)};\n`;
        }
      }

      if (book.third_party_retailers && book.third_party_retailers.length > 0) {
        for (const ret of book.third_party_retailers) {
          sql += `INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, ${sqlVal(ret.platform_name)}, ${sqlVal(ret.retail_url)}, ${ret.is_active ? 'true' : 'false'}
FROM public.books WHERE slug = ${sqlVal(book.slug)};\n`;
        }
      }
    }

    sql += `\n-- 2. POLICY BRIEFS & WORKING PAPERS (${SEED_BLOG_POSTS.length} Briefs)\n`;
    for (const post of SEED_BLOG_POSTS) {
      const contentMarkdown = {
        en: post.content_sections?.map((s) => `## ${s.heading?.en || ''}\n\n${s.body?.en || ''}`).join('\n\n') || '',
        fr: post.content_sections?.map((s) => `## ${s.heading?.fr || s.heading?.en || ''}\n\n${s.body?.fr || s.body?.en || ''}`).join('\n\n') || '',
      };
      const coverImageUrl = `/images/blog/${post.slug}.jpg`;
      sql += `INSERT INTO public.blog_posts (id, slug, title, excerpt, content_markdown, cover_image_url, category, tags, estimated_read_minutes, doi_reference, status)
VALUES (
  uuid_generate_v4(),
  ${sqlVal(post.slug)},
  ${sqlVal(post.title)},
  ${sqlVal(post.excerpt)},
  ${sqlVal(contentMarkdown)},
  ${sqlVal(coverImageUrl)},
  ${sqlVal(post.category)},
  ${sqlArray(post.tags)},
  ${post.estimated_read_minutes || 6},
  ${sqlVal(post.doi_reference)},
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_url = EXCLUDED.cover_image_url,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  estimated_read_minutes = EXCLUDED.estimated_read_minutes,
  doi_reference = EXCLUDED.doi_reference;\n\n`;
    }

    sql += `\n-- 3. SOVEREIGN & MULTILATERAL CAREER ENTRIES (${CAREER_ENTRIES.length} Mandates)\n`;
    for (let i = 0; i < CAREER_ENTRIES.length; i++) {
      const career = CAREER_ENTRIES[i];
      sql += `INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  ${sqlVal(career.organization)},
  ${sqlVal(career.role_title)},
  ${sqlVal(career.category)},
  ${sqlVal(career.period)},
  ${sqlVal(career.is_current || false)},
  ${sqlVal(career.location)},
  ${sqlVal(career.description)},
  ${sqlVal(career.verification_note)},
  ${i + 1},
  'published'
);\n`;
    }

    sql += `\n-- 4. MEDIA APPEARANCES & TV KEYNOTES (${MEDIA_APPEARANCES.length} Items)\n`;
    for (const media of MEDIA_APPEARANCES) {
      sql += `INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  ${sqlVal(media.id)},
  ${sqlVal(media.title)},
  ${sqlVal(media.type)},
  ${sqlVal(media.venue)},
  ${sqlVal(media.date)},
  ${sqlVal(media.location)},
  ${sqlVal(media.summary)},
  ${sqlVal(media.source_url)},
  ${sqlVal(media.image_url)},
  ${sqlVal(media.category || 'press')},
  ${sqlVal(media.caption)},
  ${sqlVal(media.is_pinned || false)},
  ${sqlVal(media.video_metadata)},
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;\n`;
    }

    sql += `\n-- 5. ARCHIVAL PHOTO GALLERY (${SEED_GALLERY_PHOTOS.length} Archival Artifacts)\n`;
    for (const photo of SEED_GALLERY_PHOTOS) {
      sql += `INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  ${sqlVal(photo.id)},
  ${sqlVal(photo.title)},
  ${sqlVal(photo.event_name)},
  ${sqlVal(photo.venue)},
  ${sqlVal(photo.date)},
  ${sqlVal(photo.year)},
  ${sqlVal(photo.season)},
  ${sqlVal(photo.location)},
  ${sqlVal(photo.category)},
  ${sqlVal(photo.image_url)},
  ${sqlVal(photo.thumbnail_url)},
  ${sqlVal(photo.caption)},
  ${sqlVal(photo.participants_note)},
  ${sqlVal(photo.external_ref_url)},
  ${sqlVal(photo.is_featured_monthly || false)}
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;\n`;
    }

    const outputPath = path.resolve('./supabase/full_production_seed.sql');
    fs.writeFileSync(outputPath, sql, 'utf8');

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(sql.length).toBeGreaterThan(10000);
  });
});
