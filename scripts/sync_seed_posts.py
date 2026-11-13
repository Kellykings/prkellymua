import json
import re
from pathlib import Path

INGESTED_JSON = Path("scripts/ingested_articles.json")
SEED_DATA_TS = Path("src/lib/data/seed-data.ts")
FULL_SEED_SQL = Path("supabase/full_production_seed.sql")

def escape_ts(s: str) -> str:
    return s.replace('\\', '\\\\').replace("'", "\\'")

def escape_sql(s: str) -> str:
    return s.replace("'", "''")

def sync():
    with open(INGESTED_JSON, encoding="utf-8") as f:
        posts = json.load(f)
        
    print(f"Loaded {len(posts)} ingested policy briefs.")
    
    # 1. Format TypeScript code
    ts_entries = []
    for p in posts:
        sections_ts = []
        for s in p["content_sections"]:
            sections_ts.append(f"""      {{
        heading: {{
          en: '{escape_ts(s["heading"]["en"])}',
          fr: '{escape_ts(s["heading"]["fr"])}',
        }},
        body: {{
          en: '{escape_ts(s["body"]["en"])}',
          fr: '{escape_ts(s["body"]["fr"])}',
        }},
      }},""")
        sections_block = "\n".join(sections_ts)
        tags_str = ", ".join(f"'{escape_ts(t)}'" for t in p["tags"])
        
        pdf_field = f"\n    pdf_download_url: '{p['pdf_download_url']}',\n    pages: {p['pages']}," if p.get('pdf_download_url') else ""
        
        entry = f"""  {{
    id: '{p["id"]}',
    slug: '{p["slug"]}',
    title: {{
      en: '{escape_ts(p["title"]["en"])}',
      fr: '{escape_ts(p["title"]["fr"])}',
    }},
    excerpt: {{
      en: '{escape_ts(p["excerpt"]["en"])}',
      fr: '{escape_ts(p["excerpt"]["fr"])}',
    }},
    category: '{escape_ts(p["category"])}',
    tags: [{tags_str}],
    estimated_read_minutes: {p["estimated_read_minutes"]},
    doi_reference: '{p["doi_reference"]}',
    published_at: '{p["published_at"]}',
    status: '{p["status"]}',{pdf_field}
    content_sections: [
{sections_block}
    ],
  }},"""
        ts_entries.append(entry)
        
    all_ts = "export const SEED_BLOG_POSTS: BlogPost[] = [\n" + "\n".join(ts_entries) + "\n];"
    
    # 2. Update seed-data.ts
    with open(SEED_DATA_TS, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    pattern = r"export const SEED_BLOG_POSTS: BlogPost\[\] = \[[\s\S]*?\n\];"
    if not re.search(pattern, ts_content):
        raise ValueError("Could not find SEED_BLOG_POSTS in seed-data.ts")
        
    ts_updated = re.sub(pattern, all_ts, ts_content, count=1)
    with open(SEED_DATA_TS, "w", encoding="utf-8") as f:
        f.write(ts_updated)
    print(f"Updated {SEED_DATA_TS} with {len(posts)} policy briefs.")
    
    # 3. Format SQL statements
    sql_inserts = [f"-- 2. POLICY BRIEFS & WORKING PAPERS ({len(posts)} Briefs)"]
    for p in posts:
        title_json = json.dumps(p["title"], ensure_ascii=False)
        excerpt_json = json.dumps(p["excerpt"], ensure_ascii=False)
        
        # Build markdown
        md_en_parts = []
        md_fr_parts = []
        for s in p["content_sections"]:
            md_en_parts.append(f"## {s['heading']['en']}\n\n{s['body']['en']}")
            md_fr_parts.append(f"## {s['heading']['fr']}\n\n{s['body']['fr']}")
        
        md_json = json.dumps({
            "en": "\n\n".join(md_en_parts),
            "fr": "\n\n".join(md_fr_parts)
        }, ensure_ascii=False)
        
        tags_sql = "ARRAY[" + ", ".join(f"'{escape_sql(t)}'" for t in p["tags"]) + "]::text[]"
        
        sql_entry = f"""INSERT INTO public.blog_posts (id, slug, title, excerpt, content_markdown, cover_image_url, category, tags, estimated_read_minutes, doi_reference, status)
VALUES (
  uuid_generate_v4(),
  '{p["slug"]}',
  '{escape_sql(title_json)}'::jsonb,
  '{escape_sql(excerpt_json)}'::jsonb,
  '{escape_sql(md_json)}'::jsonb,
  '/images/blog/{p["slug"]}.jpg',
  '{escape_sql(p["category"])}',
  {tags_sql},
  {p["estimated_read_minutes"]},
  '{p["doi_reference"]}',
  '{p["status"]}'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_url = EXCLUDED.cover_image_url,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  estimated_read_minutes = EXCLUDED.estimated_read_minutes,
  doi_reference = EXCLUDED.doi_reference;"""
        sql_inserts.append(sql_entry)
        
    all_sql = "\n\n".join(sql_inserts)
    
    # Update full_production_seed.sql
    with open(FULL_SEED_SQL, "r", encoding="utf-8") as f:
        sql_content = f.read()
        
    sql_pattern = r"-- 2\. POLICY BRIEFS & WORKING PAPERS \(\d+ Briefs\)[\s\S]*?(?=\n-- 3\. SOVEREIGN & MULTILATERAL CAREER ENTRIES)"
    if not re.search(sql_pattern, sql_content):
        raise ValueError("Could not find policy briefs section in full_production_seed.sql")
        
    sql_updated = re.sub(sql_pattern, all_sql, sql_content, count=1)
    with open(FULL_SEED_SQL, "w", encoding="utf-8") as f:
        f.write(sql_updated)
    print(f"Updated {FULL_SEED_SQL} with {len(posts)} policy briefs SQL statements.")

if __name__ == "__main__":
    sync()
