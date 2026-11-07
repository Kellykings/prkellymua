import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SEED_BOOKS, SEED_BLOG_POSTS } from '@/lib/data/seed-data';

describe('Search Engine Optimization (SEO) & XML Sitemap', () => {
  it('should generate localized URLs for both en and fr', async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(0);

    const enUrls = entries.filter((e) => e.url.includes('/en'));
    const frUrls = entries.filter((e) => e.url.includes('/fr'));

    expect(enUrls.length).toBe(frUrls.length);
    expect(enUrls.length).toBeGreaterThanOrEqual(25);
  });

  it('should include all required static paths including media and legal routes', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    const requiredPaths = [
      '/media',
      '/about',
      '/governance',
      '/expertise',
      '/books',
      '/blog',
      '/contact',
      '/legal/disclaimer',
      '/legal/privacy',
      '/legal/terms',
      '/legal/refunds',
    ];

    for (const path of requiredPaths) {
      expect(urls.some((u) => u.includes(`/en${path}`))).toBe(true);
      expect(urls.some((u) => u.includes(`/fr${path}`))).toBe(true);
    }
  });

  it('should include all 10 monographic book detail routes', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    for (const book of SEED_BOOKS) {
      expect(urls.some((u) => u.includes(`/en/books/${book.slug}`))).toBe(true);
      expect(urls.some((u) => u.includes(`/fr/books/${book.slug}`))).toBe(true);
    }
  });

  it('should include all policy brief blog detail routes', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    for (const post of SEED_BLOG_POSTS) {
      expect(urls.some((u) => u.includes(`/en/blog/${post.slug}`))).toBe(true);
      expect(urls.some((u) => u.includes(`/fr/blog/${post.slug}`))).toBe(true);
    }
  });

  it('should verify dictionary navigation keys for media in en and fr', () => {
    const enDict = getDictionary('en');
    const frDict = getDictionary('fr');

    expect(enDict.nav.media).toBe('Media');
    expect(frDict.nav.media).toBe('Médias');
    expect(enDict.nav.books).toBe('Books');
    expect(frDict.nav.books).toBe('Livres');
  });
});
