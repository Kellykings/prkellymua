import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateHeroCopyPayload } from '@/lib/data/validation';
import {
  getStoredHeroConfig,
  saveStoredHeroConfig,
  resetStoredHeroConfig,
} from '@/lib/data/custom-content-store';
import { getDefaultHeroConfig, getHeroConfig } from '@/lib/data/repository';
import { GET, PUT, DELETE } from '@/app/api/admin/hero/route';
import type { HeroCopyConfig } from '@/types/domain';

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer kmk-governance-2026!',
};

describe('Hero Copy Editor Validation & Repository Tests', () => {
  beforeEach(() => {
    resetStoredHeroConfig();
  });

  afterEach(() => {
    resetStoredHeroConfig();
  });

  it('provides complete and valid factory defaults', () => {
    const defaults = getDefaultHeroConfig();
    expect(defaults.headline.en).toBe('Sovereign finance and governance for Africa’s development.');
    expect(defaults.headline.fr).toBe('Finance souveraine et gouvernance au service du développement de l’Afrique.');
    expect(defaults.ctaPrimary.en).toBe('Browse books');
    expect(defaults.ctaPrimaryLink).toBe('/books');
    expect(defaults.role1.en).toContain('MINFI');
    expect(defaults.role2.en).toContain('ATIDI');
  });

  it('rejects invalid or severely truncated headline payloads', () => {
    const invalid = {
      headline: { en: 'Hi' },
      subheadline: { en: 'This is a long enough subheadline that passes the length check.' },
    };
    const result = validateHeroCopyPayload(invalid);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('English headline must be at least 5 characters');
  });

  it('rejects invalid or severely truncated subheadline payloads', () => {
    const invalid = {
      headline: { en: 'Valid Headline' },
      subheadline: { en: 'Short' },
    };
    const result = validateHeroCopyPayload(invalid);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('English subheadline must be at least 15 characters');
  });

  it('sanitizes unsafe URLs to safe defaults', () => {
    const payload = {
      headline: { en: 'Valid Display Headline' },
      subheadline: { en: 'Valid executive lead paragraph with sufficient detail.' },
      ctaPrimaryLink: 'javascript:alert(1)',
      portraitImageUrl: 'http://malicious-site.com/fake.jpg',
    };
    const result = validateHeroCopyPayload(payload);
    expect(result.valid).toBe(true);
    expect(result.data?.ctaPrimaryLink).toBe('/books');
    // Relative or https paths are accepted; insecure http is reset to default
    expect(result.data?.portraitImageUrl).toBe('/images/portrait.jpeg');
  });

  it('persists and retrieves custom hero configuration in local store', () => {
    const customConfig: HeroCopyConfig = {
      ...getDefaultHeroConfig(),
      headline: {
        en: 'Strategic Sovereign Public Finance & Climate Governance',
        fr: 'Finance Publique Souveraine Stratégique et Gouvernance Climat',
      },
    };

    const saved = saveStoredHeroConfig(customConfig);
    expect(saved).toBe(true);

    const retrieved = getStoredHeroConfig();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.headline.en).toBe('Strategic Sovereign Public Finance & Climate Governance');
    expect(retrieved?.headline.fr).toBe('Finance Publique Souveraine Stratégique et Gouvernance Climat');
  });

  it('resets custom hero configuration back to null/defaults cleanly', () => {
    const customConfig: HeroCopyConfig = {
      ...getDefaultHeroConfig(),
      headline: {
        en: 'Temporary Custom Headline For Testing',
        fr: 'Titre Personnalisé Temporaire',
      },
    };
    saveStoredHeroConfig(customConfig);
    expect(getStoredHeroConfig()).not.toBeNull();

    const resetSuccess = resetStoredHeroConfig();
    expect(resetSuccess).toBe(true);
    expect(getStoredHeroConfig()).toBeNull();
  });

  describe('Admin Hero API Route Security & Persistence', () => {
    it('blocks unauthorized access with 401 status', async () => {
      const unauthReq = new Request('http://localhost:3000/api/admin/hero', {
        method: 'GET',
      });
      const res = await GET(unauthReq);
      expect(res.status).toBe(401);
    });

    it('retrieves default hero configuration when authenticated', async () => {
      const authReq = new Request('http://localhost:3000/api/admin/hero', {
        method: 'GET',
        headers: AUTH_HEADERS,
      });
      const res = await GET(authReq);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.headline.en).toBe('Sovereign finance and governance for Africa’s development.');
    });

    it('persists updates and validates payloads via PUT', async () => {
      const updatedPayload = {
        ...getDefaultHeroConfig(),
        headline: {
          en: 'Updated Executive Headline via Admin Studio',
          fr: 'Titre Exécutif Mis à Jour via Admin Studio',
        },
      };

      const putReq = new Request('http://localhost:3000/api/admin/hero', {
        method: 'PUT',
        headers: AUTH_HEADERS,
        body: JSON.stringify(updatedPayload),
      });

      const res = await PUT(putReq);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.headline.en).toBe('Updated Executive Headline via Admin Studio');

      // Verify repository reflects the update
      const active = await getHeroConfig();
      expect(active.headline.en).toBe('Updated Executive Headline via Admin Studio');
    });

    it('resets back to dictionary defaults via DELETE', async () => {
      // First save an override
      saveStoredHeroConfig({
        ...getDefaultHeroConfig(),
        headline: { en: 'Temporary Override', fr: 'Temporaire' },
      });

      const delReq = new Request('http://localhost:3000/api/admin/hero', {
        method: 'DELETE',
        headers: AUTH_HEADERS,
      });

      const res = await DELETE(delReq);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);

      const active = await getHeroConfig();
      expect(active.headline.en).toBe('Sovereign finance and governance for Africa’s development.');
    });
  });
});

