# Scholarly Articles & Policy Briefs Ingestion Staging

Drop Professor Kelly Mua Kingsly's 26 scholarly working papers, research articles, and policy briefs into this folder in **Word (`.docx` / `.doc`)** or **PDF (`.pdf`)** format.

---

### File Types Supported:
* **`.docx` / `.doc`**: Academic manuscripts, research notes, and monographic chapters.
* **`.pdf`**: Final published working papers, conference proceedings, and formatted whitepapers.

---

### Ingestion Workflow:
1. **Drop files** into this directory (`documents/articles/`).
2. When ready, notify the assistant (e.g. *"I've copied the files, proceed with article ingestion"*).
3. The ingestion tool (`scripts/ingest_articles.py`) will automatically:
   * Parse titles, executive abstracts, publication dates, and sectional headings.
   * Generate academic citation metadata (APA, BibTeX, Harvard, Chicago).
   * Register the papers into the bilingual Policy Briefs hub (`/[locale]/blog`).
   * Copy downloadable PDF whitepapers into `public/documents/policy-briefs/` for public research downloads.
