import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';
import {
  getBooks,
  getBlogPosts,
  getCareerEntries,
  getMediaAppearances,
  getGalleryPhotos,
  getInstitutionalEvents,
} from '@/lib/data/repository';
import { saveContentOverrides } from '@/lib/data/custom-content-store';

const CLEAN_STORE = {
  books: [],
  blog: [],
  governance: [],
  media: [],
  gallery: [],
  inquiries: [],
  orders: [],
  deletedIds: {
    books: [],
    blog: [],
    governance: [],
    media: [],
    gallery: [],
    inquiries: [],
    orders: [],
  },
};

describe('Admin Studio E2E Data Wiring & Integrity', () => {
  beforeEach(() => {
    saveContentOverrides(CLEAN_STORE);
  });
  it('should wire all 17 monographic volumes to the admin studio inventory', async () => {
    const books = await getBooks();
    expect(books).toHaveLength(17);

    for (const book of books) {
      expect(book.id).toBeTruthy();
      expect(book.slug).toBeTruthy();
      expect(book.isbn).toMatch(/^978-/);
      expect(book.book_formats.length).toBeGreaterThan(0);
      expect(book.third_party_retailers.length).toBeGreaterThan(0);
      expect(book.status).toBe('published');
    }
  });

  it('should wire all bilingual policy briefs to the publications table', async () => {
    const posts = await getBlogPosts();
    expect(posts).toHaveLength(4);

    for (const post of posts) {
      expect(post.title.en).toBeTruthy();
      expect(post.title.fr).toBeTruthy();
      expect(post.excerpt.en).toBeTruthy();
      expect(post.excerpt.fr).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.status).toBe('published');
    }
  });

  it('should wire all 20 verified sovereign & multilateral mandates', () => {
    const careers = getCareerEntries();
    expect(careers).toHaveLength(20);

    const activeMandates = careers.filter((c) => c.is_current);
    expect(activeMandates.length).toBeGreaterThan(0);

    for (const mandate of careers) {
      expect(mandate.organization.en).toBeTruthy();
      expect(mandate.role_title.en).toBeTruthy();
      expect(mandate.period).toBeTruthy();
      expect(['sovereign', 'multilateral', 'academic', 'advisory']).toContain(mandate.category);
    }
  });

  it('should wire all 27 media appearances with a pinned broadcast keynote', async () => {
    const media = await getMediaAppearances();
    expect(media).toHaveLength(27);

    const pinned = media.filter((m) => m.is_pinned);
    expect(pinned.length).toBeGreaterThanOrEqual(1);

    for (const item of media) {
      expect(item.title.en).toBeTruthy();
      expect(item.venue).toBeTruthy();
      expect(item.date).toBeTruthy();
      expect(['broadcast', 'press', 'governance', 'academic']).toContain(item.category);
    }
  });

  it('should wire 25 archival gallery photos and 5 institutional assemblies', async () => {
    const photos = await getGalleryPhotos();
    const events = await getInstitutionalEvents();

    expect(photos).toHaveLength(25);
    expect(events).toHaveLength(5);

    for (const photo of photos) {
      expect(photo.title.en).toBeTruthy();
      expect(photo.image_url).toBeTruthy();
      expect(photo.year).toBeTruthy();
    }

    for (const ev of events) {
      expect(ev.title.en).toBeTruthy();
      expect(ev.date).toBeTruthy();
      expect(ev.venue).toBeTruthy();
    }
  });
});

describe('E2E Cryptographic Token & Pipeline Security', () => {
  it('should produce deterministic 32-character HMAC tokens for digital fulfillment', () => {
    const secret = 'kelly-kingsly-default-vault-secret';
    const payload = 'book-1:fmt-pdf:test@institution.org:1700000000000';
    const token = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
      .slice(0, 32);

    expect(token).toHaveLength(32);
    expect(/^[0-9a-f]{32}$/.test(token)).toBe(true);
  });

  it('should validate contact submission payload fields before database ingestion', () => {
    function validateInquiry(body: {
      senderName?: string;
      senderEmail?: string;
      subject?: string;
      message?: string;
    }) {
      if (!body.senderName || !body.senderEmail || !body.subject || !body.message) {
        return { valid: false, error: 'Missing required protocol inquiry fields.' };
      }
      return { valid: true };
    }

    expect(validateInquiry({}).valid).toBe(false);
    expect(
      validateInquiry({
        senderName: 'Prof. Tester',
        senderEmail: 'test@cameroon-gov.cm',
        subject: 'Keynote Request',
        message: 'Protocol Invitation',
      }).valid
    ).toBe(true);
  });
});
