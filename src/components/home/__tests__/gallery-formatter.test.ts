import { describe, it, expect } from 'vitest';
import { formatGalleryCategory } from '@/lib/utils';

describe('EpicEventGallery Category Formatter', () => {
  it('should format governance category in both languages', () => {
    expect(formatGalleryCategory('governance', 'en')).toBe('GOVERNANCE & TREASURY');
    expect(formatGalleryCategory('governance', 'fr')).toBe('GOUVERNANCE & TRÉSOR');
  });

  it('should format summit category in both languages', () => {
    expect(formatGalleryCategory('summit', 'en')).toBe('SOVEREIGN SUMMITS');
    expect(formatGalleryCategory('summit', 'fr')).toBe('SOMMETS & CONFÉRENCES');
  });

  it('should format book_meetup category in both languages', () => {
    expect(formatGalleryCategory('book_meetup', 'en')).toBe('BOOK MEETUPS & SIGNINGS');
    expect(formatGalleryCategory('book_meetup', 'fr')).toBe('RENCONTRES AUTEUR & DÉDICACES');
  });

  it('should format academic category in both languages', () => {
    expect(formatGalleryCategory('academic', 'en')).toBe('ACADEMIC MASTERCLASSES');
    expect(formatGalleryCategory('academic', 'fr')).toBe('ENAM & ENSEIGNEMENT MAGISTRAL');
  });

  it('should format diplomatic category in both languages', () => {
    expect(formatGalleryCategory('diplomatic', 'en')).toBe('MULTILATERAL MISSIONS');
    expect(formatGalleryCategory('diplomatic', 'fr')).toBe('MISSIONS MULTILATÉRALES');
  });

  it('should gracefully uppercase fallback for unmapped categories', () => {
    expect(formatGalleryCategory('special_event', 'en')).toBe('SPECIAL EVENT');
    expect(formatGalleryCategory('special_event', 'fr')).toBe('SPECIAL EVENT');
  });
});
