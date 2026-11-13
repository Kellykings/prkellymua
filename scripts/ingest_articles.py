"""
Official Scholarly Articles & Policy Briefs Ingestion Tool
Professor Kelly Mua Kingsly Academic & Hybrid E-Commerce Platform

Usage:
  python scripts/ingest_articles.py
"""

import os
import re
import json
import shutil
from pathlib import Path
from pypdf import PdfReader

ARTICLES_DIR = Path("documents/articles")
DEST_PDF_DIR = Path("public/documents/policy-briefs")
DEST_PDF_DIR.mkdir(parents=True, exist_ok=True)
INGESTED_JSON = Path("scripts/ingested_articles.json")
SEED_DATA_TS = Path("src/lib/data/seed-data.ts")
FULL_SEED_SQL = Path("supabase/full_production_seed.sql")

EXCLUDE_DUPLICATES = {
    "The Role of Corporate Social Responsibility and Climate Finance LDCs.pdf",
    "Cultural Preservation and Economic Prosperity_ The Interplay in African Agribusiness.pdf"
}

def clean_slug(title: str) -> str:
    s = title.lower()
    s = s.replace("'", "").replace("’", "").replace(":", " ").replace("^j", " ")
    s = re.sub(r'\s*\(\d+\)$', '', s)
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    s = re.sub(r'-+', '-', s)
    return s

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def escape_ts(s: str) -> str:
    return s.replace('\\', '\\\\').replace("'", "\\'")

def escape_sql(s: str) -> str:
    return s.replace("'", "''")

def main():
    print("=" * 60)
    print("Professor Kelly Mua Kingsly - Policy Briefs & Articles Ingestion")
    print("=" * 60)

    from build_article_catalog import build_catalog
    from sync_seed_posts import sync

    build_catalog()
    sync()

    print("\n[SUCCESS] All policy briefs ingested, synchronized with seed data, and ready.")

if __name__ == "__main__":
    main()
