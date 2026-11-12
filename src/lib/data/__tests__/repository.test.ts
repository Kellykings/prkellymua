import { describe, it, expect } from 'vitest';
import {
  getGalleryPhotos,
  getFeaturedMonthlyPhoto,
  getInstitutionalEvents,
  getBooks,
  getExecutiveProfile,
  getExpertisePillars,
  getBlogPosts,
  getCareerEntries,
} from '../repository';

describe('Data Repository — Gallery & Events', () => {
  it('should return 25 curated gallery photos by default', () => {
    const photos = getGalleryPhotos();
    expect(photos).toBeDefined();
    expect(photos.length).toBe(25);
  });

  it('should return gallery photos sorted in reverse chronological order (newest first)', () => {
    const photos = getGalleryPhotos();
    for (let i = 0; i < photos.length - 1; i++) {
      const currentDate = new Date(photos[i].date).getTime();
      const nextDate = new Date(photos[i + 1].date).getTime();
      expect(currentDate).toBeGreaterThanOrEqual(nextDate);
    }
  });

  it('should ensure all 25 gallery photos have complete bilingual fields and metadata', () => {
    const photos = getGalleryPhotos();
    photos.forEach((photo) => {
      expect(photo.id).toMatch(/^gal-\d{2}$/);
      expect(photo.title.en).toBeTruthy();
      expect(photo.title.fr).toBeTruthy();
      expect(photo.caption.en).toBeTruthy();
      expect(photo.caption.fr).toBeTruthy();
      expect(photo.event_name.en).toBeTruthy();
      expect(photo.event_name.fr).toBeTruthy();
      expect(photo.image_url).toBeTruthy();
      expect(photo.venue).toBeTruthy();
      expect(photo.location).toBeTruthy();
      expect(photo.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['governance', 'summit', 'book_meetup', 'academic', 'diplomatic']).toContain(
        photo.category
      );
    });
  });

  it('should filter gallery photos by category accurately', () => {
    const governancePhotos = getGalleryPhotos('governance');
    expect(governancePhotos.length).toBeGreaterThan(0);
    governancePhotos.forEach((p) => {
      expect(p.category).toBe('governance');
    });

    const bookMeetupPhotos = getGalleryPhotos('book_meetup');
    expect(bookMeetupPhotos.length).toBeGreaterThan(0);
    bookMeetupPhotos.forEach((p) => {
      expect(p.category).toBe('book_meetup');
    });
  });

  it('should filter gallery photos by season accurately', () => {
    const currentSeason = getGalleryPhotos('all', '2025-2026');
    expect(currentSeason.length).toBeGreaterThan(0);
    currentSeason.forEach((p) => {
      expect(p.season === '2025-2026' || p.year === '2025-2026').toBe(true);
    });
  });

  it('should return a valid featured monthly photo', () => {
    const featured = getFeaturedMonthlyPhoto();
    expect(featured).toBeDefined();
    expect(featured.id).toBeTruthy();
    expect(featured.title.en).toBeTruthy();
  });

  it('should return complete institutional events with bilingual outlines', () => {
    const events = getInstitutionalEvents();
    expect(events.length).toBeGreaterThanOrEqual(4);
    events.forEach((evt) => {
      expect(evt.id).toBeTruthy();
      expect(evt.title.en).toBeTruthy();
      expect(evt.title.fr).toBeTruthy();
      expect(evt.description.en).toBeTruthy();
      expect(evt.description.fr).toBeTruthy();
      expect(evt.venue).toBeTruthy();
      expect(evt.location).toBeTruthy();
      expect(evt.organizer).toBeTruthy();
      expect(['upcoming', 'concluded']).toContain(evt.status);
    });
  });
});

describe('Data Repository — Monographic Books Catalog', () => {
  it('should return 17 reference books in reverse chronological order', async () => {
    const books = await getBooks();
    expect(books.length).toBe(17);

    for (let i = 0; i < books.length - 1; i++) {
      const currentYear = parseInt(books[i].publish_date.split('-')[0], 10);
      const nextYear = parseInt(books[i + 1].publish_date.split('-')[0], 10);
      expect(currentYear).toBeGreaterThanOrEqual(nextYear);
    }
  });

  it('should ensure each book has valid ISBN, chapters, takeaways, and retail formats', async () => {
    const books = await getBooks();
    books.forEach((book) => {
      expect(book.isbn).toMatch(/^97[89]-\d+/);
      expect(book.title.en).toBeTruthy();
      expect(book.title.fr).toBeTruthy();
      expect(book.chapters.length).toBeGreaterThanOrEqual(1);
      expect(book.key_takeaways.length).toBeGreaterThanOrEqual(1);
      expect(book.book_formats.length).toBeGreaterThan(0);
      expect(book.cover_image_url).toBeTruthy();
    });
  });
});

describe('Data Repository — Executive Profile & Pillars', () => {
  it('should return the canonical executive profile', () => {
    const profile = getExecutiveProfile();
    expect(profile.fullName).toBe('Professor Kelly Mua Kingsly');
    expect(profile.knighthood.en).toContain('Knight');
    expect(profile.knighthood.fr).toContain('Chevalier');
    expect(profile.coordinates.linkedIn).toBeTruthy();
  });

  it('should return 6 institutional expertise pillars', () => {
    const pillars = getExpertisePillars();
    expect(pillars.length).toBe(6);
    pillars.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.title.en).toBeTruthy();
      expect(p.title.fr).toBeTruthy();
      expect(p.key_mandates.length).toBeGreaterThan(0);
    });
  });

  it('should return blog posts with valid bilingual content and reading times', async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((p) => {
      expect(p.slug).toBeTruthy();
      expect(p.title.en).toBeTruthy();
      expect(p.title.fr).toBeTruthy();
      expect(p.estimated_read_minutes).toBeGreaterThan(0);
    });
  });

  it('should return career entries with proper statutory classification', () => {
    const entries = getCareerEntries();
    expect(entries.length).toBeGreaterThanOrEqual(15);
    entries.forEach((e) => {
      expect(e.id).toBeTruthy();
      expect(e.organization.en).toBeTruthy();
      expect(e.role_title.en).toBeTruthy();
      expect(['sovereign', 'multilateral', 'academic', 'advisory']).toContain(e.category);
    });

    // R1 / R2 Trust Layer: Ensure primary active mandates have verifiable official evidence references
    const minfi = entries.find((e) => e.id === 'career-1');
    expect(minfi?.evidence_url).toBe('https://minfi.gov.cm');
    expect(minfi?.official_reference).toContain('MINFI');

    const atidi = entries.find((e) => e.id === 'career-2');
    expect(atidi?.evidence_url).toContain('atidi.africa');
    expect(atidi?.decree_reference).toContain('ATIDI Constituent Treaty');

    const enam = entries.find((e) => e.id === 'career-12');
    expect(enam?.evidence_url).toBe('https://www.enam.cm');
    expect(enam?.official_reference).toContain('ENAM');
  });
});
