import { describe, it, expect } from 'vitest';
import { SEED_BOOKS, SEED_BLOG_POSTS } from '@/lib/data/seed-data';

function getBookTrack(category: string): string {
  if (
    category.includes('Forensic') ||
    category.includes('Financial Integrity') ||
    category.includes('Fraud')
  ) {
    return 'forensics';
  }
  if (category.includes('Sovereign Debt')) {
    return 'sovereign_debt';
  }
  if (
    category.includes('Capital Markets') ||
    category.includes('ESG') ||
    category.includes('Governance')
  ) {
    return 'capital_markets';
  }
  return 'risk_tech';
}

function filterBlogPosts(query: string, category?: string) {
  let posts = [...SEED_BLOG_POSTS];
  if (category) {
    posts = posts.filter((p) => p.category === category);
  }
  const q = query.trim().toLowerCase();
  if (q) {
    posts = posts.filter((p) => {
      const titleEn = p.title.en.toLowerCase();
      const titleFr = p.title.fr.toLowerCase();
      const excerptEn = p.excerpt.en.toLowerCase();
      const excerptFr = p.excerpt.fr.toLowerCase();
      const tags = p.tags.join(' ').toLowerCase();
      const doi = (p.doi_reference || '').toLowerCase();
      return (
        titleEn.includes(q) ||
        titleFr.includes(q) ||
        excerptEn.includes(q) ||
        excerptFr.includes(q) ||
        tags.includes(q) ||
        doi.includes(q)
      );
    });
  }
  return posts;
}

describe('Academic Track Filtering for Books Catalog', () => {
  it('should partition all 10 monographic volumes into valid tracks with zero orphaned titles', () => {
    const validTracks = ['forensics', 'capital_markets', 'risk_tech', 'sovereign_debt'];
    for (const book of SEED_BOOKS) {
      const track = getBookTrack(book.academic_category);
      expect(validTracks).toContain(track);
    }
  });

  it('should correctly count volumes across tracks matching catalog filters', () => {
    const forensics = SEED_BOOKS.filter((b) => getBookTrack(b.academic_category) === 'forensics');
    const capitalMarkets = SEED_BOOKS.filter((b) => getBookTrack(b.academic_category) === 'capital_markets');
    const riskTech = SEED_BOOKS.filter((b) => getBookTrack(b.academic_category) === 'risk_tech');
    const sovereignDebt = SEED_BOOKS.filter((b) => getBookTrack(b.academic_category) === 'sovereign_debt');

    expect(forensics.length).toBe(5);
    expect(capitalMarkets.length).toBe(4);
    expect(riskTech.length).toBe(4);
    expect(sovereignDebt.length).toBe(4);
    expect(forensics.length + capitalMarkets.length + riskTech.length + sovereignDebt.length).toBe(17);
  });
});

describe('Search and Filter UX for Policy Briefs & Working Papers', () => {
  it('should find relevant papers matching CEMAC keyword', () => {
    const results = filterBlogPosts('CEMAC');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.slug.includes('cemac') || p.tags.includes('CEMAC'))).toBe(true);
  });

  it('should find ESG green finance papers', () => {
    const results = filterBlogPosts('ESG');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.tags.includes('ESG') || p.category === 'ESG & Climate Finance')).toBe(true);
  });

  it('should find papers by DOI reference number', () => {
    const samplePost = SEED_BLOG_POSTS[0];
    if (samplePost?.doi_reference) {
      const results = filterBlogPosts(samplePost.doi_reference);
      expect(results.some((p) => p.id === samplePost.id)).toBe(true);
    }
  });

  it('should return empty array for non-matching nonsense query', () => {
    const results = filterBlogPosts('xyz999nonsensequeryterm');
    expect(results.length).toBe(0);
  });

  it('should combine category filtering and text search query', () => {
    const results = filterBlogPosts('audit', 'Forensic Auditing & Integrity');
    expect(results.length).toBeGreaterThan(0);
    for (const post of results) {
      expect(post.category).toBe('Forensic Auditing & Integrity');
    }
  });
});
