import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import {
  loadContentOverrides,
  saveContentOverrides,
  addCustomEntityItem,
  updateCustomEntityItem,
  deleteCustomEntityItem,
  getCustomEntityItems,
} from '@/lib/data/custom-content-store';
import {
  getBooks,
  getCareerEntries,
  getMediaAppearances,
} from '@/lib/data/repository';
import { POST, PUT, DELETE } from '@/app/api/admin/[entity]/route';
import type { Book, BlogPost, CareerEntry, MediaAppearance } from '@/types/domain';

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer kmk-governance-2026!',
};

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

describe('Admin Studio Dual-Layer CRUD & Overrides Suite', () => {
  beforeEach(() => {
    saveContentOverrides(CLEAN_STORE);
  });

  afterEach(() => {
    saveContentOverrides(CLEAN_STORE);
  });

  afterAll(() => {
    saveContentOverrides(CLEAN_STORE);
  });

  describe('Local Content Store Mutations', () => {
    it('successfully persists and retrieves custom books', () => {
      const mockBook: Book = {
        id: 'test-book-001',
        slug: 'test-sovereign-debt-treatise',
        isbn: '978-0-123456-78-9',
        title: { en: 'Sovereign Debt Operations', fr: 'Opérations de Dette Souveraine' },
        subtitle: { en: 'CEMAC Framework', fr: 'Cadre CEMAC' },
        synopsis: { en: 'Comprehensive analysis.', fr: 'Analyse complète.' },
        academic_category: 'Sovereign Debt & PFM',
        publish_date: '2026-01-01',
        publisher: 'Institutional Press',
        total_pages: 350,
        cover_image_url: '/images/books/test.jpg',
        chapters: [],
        key_takeaways: [],
        is_featured: true,
        status: 'published',
        book_formats: [],
        third_party_retailers: [],
      };

      addCustomEntityItem('books', mockBook);
      const retrieved = getCustomEntityItems<Book>('books');

      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].id).toBe('test-book-001');
      expect(retrieved[0].title.en).toBe('Sovereign Debt Operations');
    });

    it('updates custom book metadata', () => {
      const mockBook: Book = {
        id: 'test-book-002',
        slug: 'test-book-slug',
        isbn: '978-0-999999-99-9',
        title: { en: 'Original Title', fr: 'Titre Original' },
        subtitle: { en: 'Sub', fr: 'Sous-titre' },
        synopsis: { en: 'Syn', fr: 'Syn' },
        academic_category: 'Forensic Accounting',
        publish_date: '2025-05-01',
        publisher: 'Press',
        total_pages: 200,
        cover_image_url: '/test.jpg',
        chapters: [],
        key_takeaways: [],
        is_featured: false,
        status: 'draft',
        book_formats: [],
        third_party_retailers: [],
      };

      addCustomEntityItem('books', mockBook);
      updateCustomEntityItem<Book>('books', 'test-book-002', {
        title: { en: 'Updated Monograph Title', fr: 'Titre Modifié' },
        status: 'published',
      });

      const list = getCustomEntityItems<Book>('books');
      expect(list[0].title.en).toBe('Updated Monograph Title');
      expect(list[0].status).toBe('published');
    });

    it('deletes an item and marks its ID in deletedIds', () => {
      const mockPost: BlogPost = {
        id: 'post-delete-test',
        slug: 'test-post',
        title: { en: 'Test Brief', fr: 'Note Test' },
        excerpt: { en: 'Excerpt', fr: 'Extrait' },
        content_sections: [],
        category: 'Capital Markets',
        tags: ['CEMAC'],
        estimated_read_minutes: 10,
        published_at: '2025-01-01',
        status: 'published',
      };

      addCustomEntityItem('blog', mockPost);
      expect(getCustomEntityItems('blog')).toHaveLength(1);

      deleteCustomEntityItem('blog', 'post-delete-test');
      expect(getCustomEntityItems('blog')).toHaveLength(0);

      const store = loadContentOverrides();
      expect(store.deletedIds.blog).toContain('post-delete-test');
    });
  });

  describe('Repository Seamless Merge', () => {
    it('merges custom book into getBooks() in sorted order', async () => {
      const customNewestBook: Book = {
        id: 'custom-2026-book',
        slug: 'future-state-debt-2026',
        isbn: '978-1-234567-89-0',
        title: { en: 'Future Statecraft 2026', fr: 'Gouvernance du Futur 2026' },
        subtitle: { en: 'CEMAC Horizon', fr: 'Horizon CEMAC' },
        synopsis: { en: 'Future perspectives.', fr: 'Perspectives futures.' },
        academic_category: 'Sovereign Debt',
        publish_date: '2026-12-01',
        publisher: 'International Press',
        total_pages: 400,
        cover_image_url: '/test.jpg',
        chapters: [],
        key_takeaways: [],
        is_featured: true,
        status: 'published',
        book_formats: [],
        third_party_retailers: [],
      };

      addCustomEntityItem('books', customNewestBook);
      const allBooks = await getBooks();

      // Custom 2026 book should be at the very top because of publish_date sort
      expect(allBooks[0].id).toBe('custom-2026-book');
      expect(allBooks[0].title.en).toBe('Future Statecraft 2026');
    });

    it('filters out deleted base books from getBooks()', async () => {
      const baseBooks = await getBooks();
      const firstId = baseBooks[0].id;

      deleteCustomEntityItem('books', firstId);
      const updatedBooks = await getBooks();

      expect(updatedBooks.find((b) => b.id === firstId)).toBeUndefined();
    });

    it('merges custom career mandates into getCareerEntries()', () => {
      const customMandate: CareerEntry = {
        id: 'gov-custom-ministerial',
        organization: { en: 'Sovereign Advisory Council', fr: 'Conseil Souverain' },
        role_title: { en: 'Special Sovereign Envoy', fr: 'Envoyé Spécial Souverain' },
        category: 'sovereign',
        period: '2026 – Present',
        is_current: true,
        location: 'Yaoundé, Cameroon',
        description: { en: 'Mandate', fr: 'Mandat' },
        highlights: [],
        verification_status: 'verified',
        verification_note: { en: 'Official Record', fr: 'Registre Officiel' },
      };

      addCustomEntityItem('governance', customMandate);
      const list = getCareerEntries();

      expect(list.some((c) => c.id === 'gov-custom-ministerial')).toBe(true);
    });

    it('merges custom media appearances and respects is_pinned ordering', () => {
      const pinnedCustomMedia: MediaAppearance = {
        id: 'media-pinned-summit-2026',
        title: { en: 'World Economic Forum Keynote', fr: 'Discours Forum Économique Mondial' },
        type: 'Keynote Address',
        venue: 'Davos World Economic Forum',
        date: '2026',
        location: 'Davos, Switzerland',
        summary: { en: 'CEMAC Keynote Address', fr: 'Discours CEMAC' },
        category: 'governance',
        is_pinned: true,
      };

      addCustomEntityItem('media', pinnedCustomMedia);
      const mediaList = getMediaAppearances();

      expect(mediaList[0].id).toBe('media-pinned-summit-2026');
      expect(mediaList[0].is_pinned).toBe(true);
    });
  });

  describe('Unified Admin API Route Handlers (/api/admin/[entity])', () => {
    it('rejects unauthenticated requests with HTTP 401', async () => {
      const unauthReq = new Request('http://localhost:3000/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await POST(unauthReq, { params: { entity: 'books' } });
      expect(res.status).toBe(401);
    });

    it('handles POST /api/admin/books creation when authenticated', async () => {
      const request = new Request('http://localhost:3000/api/admin/books', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({
          title: { en: 'Api Created Monograph', fr: 'Monographie Créée par API' },
          isbn: '978-0-111111-11-1',
          slug: 'api-created-monograph',
          publish_date: '2025-06-01',
          academic_category: 'Forensic Audit',
        }),
      });

      const response = await POST(request, { params: { entity: 'books' } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.ok).toBe(true);
      expect(data.data.title.en).toBe('Api Created Monograph');
      expect(data.data.id).toBeDefined();
    });

    it('rejects malformed book payload with HTTP 400', async () => {
      const invalidReq = new Request('http://localhost:3000/api/admin/books', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({
          title: { en: 'A' }, // Too short
        }),
      });

      const response = await POST(invalidReq, { params: { entity: 'books' } });
      expect(response.status).toBe(400);
    });

    it('handles PUT /api/admin/blog updates when authenticated', async () => {
      // First create
      const createReq = new Request('http://localhost:3000/api/admin/blog', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({
          id: 'brief-update-test',
          slug: 'draft-policy-note',
          title: { en: 'Draft Policy Note', fr: 'Note Préliminaire' },
          excerpt: { en: 'Excerpt of policy note.', fr: 'Extrait note.' },
          category: 'Sovereign Debt',
        }),
      });
      await POST(createReq, { params: { entity: 'blog' } });

      // Update
      const updateReq = new Request('http://localhost:3000/api/admin/blog', {
        method: 'PUT',
        headers: AUTH_HEADERS,
        body: JSON.stringify({
          id: 'brief-update-test',
          slug: 'draft-policy-note',
          title: { en: 'Final Published Policy Brief', fr: 'Note Définitive' },
          excerpt: { en: 'Excerpt of policy note.', fr: 'Extrait note.' },
          status: 'published',
        }),
      });

      const response = await PUT(updateReq, { params: { entity: 'blog' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.data.title.en).toBe('Final Published Policy Brief');
    });

    it('handles DELETE /api/admin/governance when authenticated', async () => {
      const deleteReq = new Request(
        'http://localhost:3000/api/admin/governance?id=gov-mandate-to-delete',
        {
          method: 'DELETE',
          headers: AUTH_HEADERS,
        }
      );

      const response = await DELETE(deleteReq, { params: { entity: 'governance' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.deletedId).toBe('gov-mandate-to-delete');
    });

    it('rejects unsupported entity types with HTTP 400', async () => {
      const invalidReq = new Request('http://localhost:3000/api/admin/unsupported', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({}),
      });

      const response = await POST(invalidReq, { params: { entity: 'unsupported' } });
      expect(response.status).toBe(400);
    });
  });
});
