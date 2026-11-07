import { describe, it, expect } from 'vitest';
import {
  t,
  formatDate,
  formatCategory,
  formatPeriod,
  formatDualPrice,
  formatGalleryCategory,
} from '../utils';

describe('Internationalization & Formatting Utilities', () => {
  it('should return correct localized strings using t()', () => {
    const localized = { en: 'Hello World', fr: 'Bonjour le Monde' };
    expect(t(localized, 'en')).toBe('Hello World');
    expect(t(localized, 'fr')).toBe('Bonjour le Monde');
  });

  it('should fallback to en or fr if one locale is missing', () => {
    const missingFr = { en: 'English Only', fr: '' };
    expect(t(missingFr, 'fr')).toBe('English Only');

    const missingEn = { en: '', fr: 'Français Seulement' };
    expect(t(missingEn, 'en')).toBe('Français Seulement');
  });

  it('should format ISO dates into localized formats', () => {
    const dateStr = '2025-06-15';
    const formattedEn = formatDate(dateStr, 'en');
    const formattedFr = formatDate(dateStr, 'fr');

    expect(formattedEn).toContain('2025');
    expect(formattedFr).toContain('2025');
  });

  it('should format dual pricing with USD and XAF conversions', () => {
    const priceCents = 3800; // $38.00
    const dualEn = formatDualPrice(priceCents, 'usd', 'en');
    const dualFr = formatDualPrice(priceCents, 'usd', 'fr');

    expect(dualEn.usdFormatted).toBe('$38.00');
    expect(dualEn.xafFormatted).toContain('FCFA');
    expect(dualFr.usdFormatted).toContain('38');
    expect(dualFr.xafFormatted).toContain('FCFA');
  });

  it('should format tripartite pricing for The Art of the Credible Signature (107 USD, 98 EUR, 73 955 FCFA)', () => {
    const priceCents = 10700; // $107.00
    const price = formatDualPrice(priceCents, 'USD', 'en');

    expect(price.usdFormatted).toBe('$107.00');
    expect(price.eurFormatted).toContain('98');
    expect(price.xafFormatted).toContain('73');
    expect(price.triCurrencyFormatted).toBe('107$ | 98 Euro | 73 955 FCFA');
  });

  it('should translate academic and statutory categories accurately', () => {
    expect(formatCategory('sovereign', 'en')).toBe('Sovereign Mandate');
    expect(formatCategory('sovereign', 'fr')).toBe('Mandat Souverain');
    expect(formatCategory('multilateral', 'en')).toBe('Multilateral Governance');
    expect(formatCategory('multilateral', 'fr')).toBe('Gouvernance Multilatérale');
  });

  it('should format career periods cleanly in en and fr', () => {
    expect(formatPeriod('2020 - Present', 'en')).toBe('2020 - Present');
    expect(formatPeriod('2020 - Present', 'fr')).toBe('2020 - Présent');
  });

  it('should format gallery categories in both locales', () => {
    expect(formatGalleryCategory('governance', 'en')).toBe('GOVERNANCE & TREASURY');
    expect(formatGalleryCategory('governance', 'fr')).toBe('GOUVERNANCE & TRÉSOR');
    expect(formatGalleryCategory('summit', 'en')).toBe('SOVEREIGN SUMMITS');
    expect(formatGalleryCategory('summit', 'fr')).toBe('SOMMETS & CONFÉRENCES');
  });
});
