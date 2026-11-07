import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import {
  verifyPasskey,
  createAdminSessionToken,
  verifyAdminSessionToken,
  verifyAdminRequest,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth/admin-auth';
import {
  sanitizeText,
  sanitizeSlug,
  validateBookPayload,
  validateBlogPostPayload,
  validateCareerPayload,
  validateMediaPayload,
  validateGalleryPayload,
} from '@/lib/data/validation';
import {
  getContentStoreHealth,
  saveContentOverrides,
  addCustomEntityItem,
} from '@/lib/data/custom-content-store';
import { POST as authPOST, DELETE as authDELETE } from '@/app/api/admin/auth/route';

import type { Book } from '@/types/domain';

const EMPTY_STORE = {
  books: [],
  blog: [],
  governance: [],
  media: [],
  gallery: [],
  inquiries: [],
  deletedIds: {
    books: [],
    blog: [],
    governance: [],
    media: [],
    gallery: [],
    inquiries: [],
  },
};

describe('Admin Security, Passkey Auth & Validation Engine', () => {
  afterAll(() => {
    saveContentOverrides(EMPTY_STORE);
  });
  describe('Passkey & Session Cryptography', () => {
    it('verifies valid passkey and rejects invalid ones', () => {
      expect(verifyPasskey('kmk-governance-2026!')).toBe(true);
      expect(verifyPasskey('wrong-password')).toBe(false);
      expect(verifyPasskey('')).toBe(false);
      // @ts-expect-error Testing invalid type
      expect(verifyPasskey(null)).toBe(false);
    });

    it('generates HMAC session token and verifies it', () => {
      const token = createAdminSessionToken();
      expect(token).toContain('.');
      expect(verifyAdminSessionToken(token)).toBe(true);
    });

    it('rejects tampered or forged session tokens', () => {
      const token = createAdminSessionToken();
      const [timestamp] = token.split('.');
      const forgedToken = `${timestamp}.deadbeef1234567890abcdef`;

      expect(verifyAdminSessionToken(forgedToken)).toBe(false);
      expect(verifyAdminSessionToken('random-string-without-dot')).toBe(false);
      expect(verifyAdminSessionToken('')).toBe(false);
    });

    it('rejects expired session tokens', () => {
      // 8 days ago
      const expiredTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000;
      const forgedExpired = `${expiredTimestamp}.signature`;
      expect(verifyAdminSessionToken(forgedExpired)).toBe(false);
    });

    it('authorizes requests with Bearer passkey', () => {
      const req = new Request('http://localhost:3000/api/admin/books', {
        headers: { Authorization: 'Bearer kmk-governance-2026!' },
      });
      expect(verifyAdminRequest(req)).toBe(true);
    });

    it('authorizes requests with valid session token header', () => {
      const token = createAdminSessionToken();
      const req = new Request('http://localhost:3000/api/admin/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(verifyAdminRequest(req)).toBe(true);
    });

    it('authorizes requests with valid session cookie', () => {
      const token = createAdminSessionToken();
      const req = new Request('http://localhost:3000/api/admin/books', {
        headers: { Cookie: `${ADMIN_COOKIE_NAME}=${token}; other=value` },
      });
      expect(verifyAdminRequest(req)).toBe(true);
    });

    it('rejects unauthenticated requests without header or cookie', () => {
      const req = new Request('http://localhost:3000/api/admin/books');
      expect(verifyAdminRequest(req)).toBe(false);
    });
  });

  describe('Input Sanitization & Boundary Limits', () => {
    it('strips dangerous XSS script tags and event handlers', () => {
      const dirty = '<script>alert("hack")</script>Sovereign Wealth<iframe src="malicious.com"></iframe>';
      const clean = sanitizeText(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('<iframe>');
      expect(clean).toContain('Sovereign Wealth');
    });

    it('truncates text to specified maximum length', () => {
      const longText = 'A'.repeat(500);
      const clean = sanitizeText(longText, 50);
      expect(clean).toHaveLength(50);
    });

    it('sanitizes dirty slugs to lowercase alphanumeric hyphens', () => {
      expect(sanitizeSlug('Sovereign Debt & Public Finance 2026!'))
        .toBe('sovereign-debt-public-finance-2026');
      expect(sanitizeSlug('---dirty---slug---')).toBe('dirty-slug');
    });
  });

  describe('Entity Schema Validators', () => {
    it('validates and sanitizes book payload', () => {
      const validBook = {
        title: { en: 'Sovereign Debt Audit', fr: 'Audit Dette' },
        isbn: '978-0-123456-78-9',
        slug: 'sovereign-debt-audit',
      };
      const result = validateBookPayload(validBook);
      expect(result.valid).toBe(true);
      expect(result.data?.title?.en).toBe('Sovereign Debt Audit');

      const invalidBook = {
        title: { en: 'Ab' }, // Less than 3 chars
        isbn: '978-0-123456-78-9',
      };
      const failResult = validateBookPayload(invalidBook);
      expect(failResult.valid).toBe(false);
      expect(failResult.error).toContain('title (English) is required');
    });

    it('validates and sanitizes blog post payload', () => {
      const validPost = {
        title: { en: 'CEMAC Monetary Policy', fr: 'Politique Monétaire CEMAC' },
        slug: 'cemac-monetary-policy',
        excerpt: { en: 'Analysis of regional banking.', fr: 'Analyse' },
      };
      const result = validateBlogPostPayload(validPost);
      expect(result.valid).toBe(true);
      expect(result.data?.estimated_read_minutes).toBe(12);

      const invalidPost = {
        title: { en: 'CEMAC Policy' },
        // missing excerpt
      };
      expect(validateBlogPostPayload(invalidPost).valid).toBe(false);
    });

    it('validates career governance payload', () => {
      const validCareer = {
        role_title: { en: 'State Inspector General', fr: 'Inspecteur Général' },
        organization: { en: 'State Audit Office', fr: 'Cour des Comptes' },
      };
      const result = validateCareerPayload(validCareer);
      expect(result.valid).toBe(true);
      expect(result.data?.category).toBe('sovereign');

      const invalidCareer = {
        role_title: { en: 'A' },
      };
      expect(validateCareerPayload(invalidCareer).valid).toBe(false);
    });

    it('validates media appearance payload', () => {
      const validMedia = {
        title: { en: 'Africa24 State Finance Interview', fr: 'Interview' },
        venue: 'Africa24 Television',
      };
      const result = validateMediaPayload(validMedia);
      expect(result.valid).toBe(true);
      expect(result.data?.category).toBe('broadcast');

      const invalidMedia = {
        title: { en: 'Interview' },
        // missing venue
      };
      expect(validateMediaPayload(invalidMedia).valid).toBe(false);
    });

    it('validates gallery photo payload and enforces valid URL paths', () => {
      const validPhoto = {
        title: { en: 'ATIDI 24th General Assembly', fr: 'Assemblée' },
        image_url: '/images/gallery/assembly.jpg',
      };
      expect(validateGalleryPayload(validPhoto).valid).toBe(true);

      const invalidPhoto = {
        title: { en: 'ATIDI Assembly' },
        image_url: 'javascript:alert(1)', // Not starting with / or https://
      };
      expect(validateGalleryPayload(invalidPhoto).valid).toBe(false);
    });
  });

  describe('Store Health & Resilience', () => {
    beforeEach(() => {
      saveContentOverrides(EMPTY_STORE);
    });

    afterEach(() => {
      saveContentOverrides(EMPTY_STORE);
    });

    it('reports accurate health metrics and active counts', () => {
      addCustomEntityItem('books', {
        id: 'health-test-book',
        title: { en: 'Health Book', fr: 'Livre' },
      } as unknown as Book);

      const health = getContentStoreHealth();
      expect(health.isHealthy).toBe(true);
      expect(health.counts.books).toBe(1);
      expect(health.totalActiveOverrides).toBe(1);
    });
  });

  describe('Auth API Handlers (/api/admin/auth)', () => {
    it('authenticates valid passkey and sets cookie', async () => {
      const req = new Request('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: 'kmk-governance-2026!' }),
      });

      const res = await authPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(res.headers.get('set-cookie')).toContain(ADMIN_COOKIE_NAME);
    });

    it('rejects invalid passkey with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: 'incorrect-passkey' }),
      });

      const res = await authPOST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toContain('Access denied');
    });

    it('clears session cookie on DELETE', async () => {
      const res = await authDELETE();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(res.headers.get('set-cookie')).toContain('Max-Age=0');
    });

    it('enforces IP rate limiting after 5 consecutive failures', async () => {
      const testIp = '203.0.113.88';
      for (let i = 0; i < 5; i++) {
        const req = new Request('http://localhost:3000/api/admin/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-real-ip': testIp,
          },
          body: JSON.stringify({ passkey: `bad-pass-${i}` }),
        });
        const res = await authPOST(req);
        expect(res.status).toBe(401);
      }

      // 6th attempt should be blocked with 429
      const blockedReq = new Request('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-real-ip': testIp,
        },
        body: JSON.stringify({ passkey: 'kmk-governance-2026!' }),
      });
      const blockedRes = await authPOST(blockedReq);
      expect(blockedRes.status).toBe(429);
      const data = await blockedRes.json();
      expect(data.error).toContain('Too many failed login attempts');
    });
  });

  describe('Administrative GET Endpoints & Public Form Interoperability', () => {
    it('serves authenticated GET entity datasets', async () => {
      const { GET: entityGET } = await import('@/app/api/admin/[entity]/route');
      const authReq = new Request('http://localhost:3000/api/admin/books', {
        headers: { Authorization: 'Bearer kmk-governance-2026!' },
      });

      const res = await entityGET(authReq, { params: { entity: 'books' } });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.count).toBeGreaterThanOrEqual(10);
    });

    it('processes contact submissions with snake_case and camelCase payloads', async () => {
      const { POST: contactPOST } = await import('@/app/api/contact/route');

      // snake_case
      const snakeReq = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: 'Dr. Test User',
          sender_email: 'test@example.com',
          organization: 'Test Org',
          inquiry_type: 'Speaking',
          subject: 'Keynote Lecture',
          message: 'Invitation for guest lecture.',
        }),
      });
      const snakeRes = await contactPOST(snakeReq);
      expect(snakeRes.status).toBe(200);

      // camelCase
      const camelReq = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Prof. Colleague',
          senderEmail: 'colleague@example.edu',
          subject: 'Academic Collab',
          message: 'Collaborative symposium proposal.',
        }),
      });
      const camelRes = await contactPOST(camelReq);
      expect(camelRes.status).toBe(200);
    });

    it('validates Stripe webhook signature when secret is configured', async () => {
      const { POST: stripePOST } = await import('@/app/api/webhooks/stripe/route');
      const origSecret = process.env.STRIPE_WEBHOOK_SECRET;

      try {
        process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret_123';
        const unverifiedReq = new Request('http://localhost:3000/api/webhooks/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'checkout.session.completed' }),
        });

        const res = await stripePOST(unverifiedReq);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toContain('Missing Stripe signature');
      } finally {
        if (origSecret !== undefined) {
          process.env.STRIPE_WEBHOOK_SECRET = origSecret;
        } else {
          delete process.env.STRIPE_WEBHOOK_SECRET;
        }
      }
    });
  });
});
