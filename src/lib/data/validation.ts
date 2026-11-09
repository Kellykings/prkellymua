import type {
  Book,
  BlogPost,
  CareerEntry,
  MediaAppearance,
  MediaAppearanceType,
  GalleryPhotoItem,
  EventCategory,
  HeroCopyConfig,
} from '@/types/domain';

export interface ValidationResult<T> {
  valid: boolean;
  error?: string;
  data?: T;
}

export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^\s"']*/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeSlug(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

function getRecord(val: unknown): Record<string, unknown> | undefined {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, unknown>;
  }
  return undefined;
}

function getLocalized(record: Record<string, unknown>, key: string): { en: string; fr: string } {
  const sub = getRecord(record[key]);
  const en = sanitizeText(sub?.en);
  const fr = sanitizeText(sub?.fr) || en;
  return { en, fr };
}

export function validateBookPayload(raw: unknown): ValidationResult<Partial<Book>> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Book payload must be a valid JSON object.' };
  }

  const title = getLocalized(r, 'title');
  if (!title.en || title.en.length < 3) {
    return { valid: false, error: 'Book title (English) is required (min 3 characters).' };
  }

  const slug = sanitizeSlug(r.slug) || sanitizeSlug(title.en);
  if (!slug) {
    return { valid: false, error: 'Valid URL slug is required.' };
  }

  const isbn = sanitizeText(r.isbn, 30);
  if (!isbn || isbn.length < 5) {
    return { valid: false, error: 'Valid ISBN-13 is required.' };
  }

  const totalPages = typeof r.total_pages === 'number' && r.total_pages > 0
    ? Math.min(r.total_pages, 5000)
    : parseInt(String(r.total_pages || 280), 10) || 280;

  const validStatus = ['draft', 'in_review', 'published', 'archived'].includes(String(r.status))
    ? (String(r.status) as Book['status'])
    : 'published';

  const subtitle = getLocalized(r, 'subtitle');
  const synopsis = getLocalized(r, 'synopsis');

  const sanitized: Partial<Book> = {
    ...(r as Partial<Book>),
    title: { en: title.en, fr: title.fr },
    subtitle: { en: subtitle.en, fr: subtitle.fr },
    synopsis: { en: synopsis.en, fr: synopsis.fr || synopsis.en },
    isbn,
    slug,
    academic_category: sanitizeText(r.academic_category || 'Forensic Auditing & Financial Integrity', 150),
    publisher: sanitizeText(r.publisher || 'Christian Faith Publishing', 150),
    publish_date: sanitizeText(r.publish_date || new Date().toISOString().slice(0, 10), 20),
    total_pages: totalPages,
    cover_image_url: sanitizeText(r.cover_image_url || '/images/books/sample.jpg', 300),
    status: validStatus,
  };

  return { valid: true, data: sanitized };
}

export function validateBlogPostPayload(raw: unknown): ValidationResult<Partial<BlogPost>> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Policy brief payload must be a valid JSON object.' };
  }

  const title = getLocalized(r, 'title');
  if (!title.en || title.en.length < 3) {
    return { valid: false, error: 'Policy brief title (English) is required (min 3 characters).' };
  }

  const slug = sanitizeSlug(r.slug) || sanitizeSlug(title.en);
  if (!slug) {
    return { valid: false, error: 'Valid URL slug is required.' };
  }

  const excerpt = getLocalized(r, 'excerpt');
  if (!excerpt.en) {
    return { valid: false, error: 'Abstract/excerpt (English) is required.' };
  }

  const readMinutes = typeof r.estimated_read_minutes === 'number' && r.estimated_read_minutes > 0
    ? Math.min(r.estimated_read_minutes, 180)
    : parseInt(String(r.estimated_read_minutes || 12), 10) || 12;

  const validStatus = ['draft', 'in_review', 'published', 'archived'].includes(String(r.status))
    ? (String(r.status) as BlogPost['status'])
    : 'published';

  const sanitized: Partial<BlogPost> = {
    ...(r as Partial<BlogPost>),
    title: { en: title.en, fr: title.fr },
    slug,
    excerpt: { en: excerpt.en, fr: excerpt.fr },
    category: sanitizeText(r.category || 'Sovereign Debt & Public Finance', 150),
    doi_reference: sanitizeText(r.doi_reference, 80),
    published_at: sanitizeText(r.published_at || new Date().toISOString().slice(0, 10), 20),
    estimated_read_minutes: readMinutes,
    status: validStatus,
    tags: Array.isArray(r.tags)
      ? r.tags.map((t: unknown) => sanitizeText(t, 50)).filter(Boolean)
      : [],
  };

  return { valid: true, data: sanitized };
}

export function validateCareerPayload(raw: unknown): ValidationResult<Partial<CareerEntry>> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Governance mandate payload must be a valid JSON object.' };
  }

  const roleTitle = getLocalized(r, 'role_title');
  if (!roleTitle.en || roleTitle.en.length < 3) {
    return { valid: false, error: 'Mandate role title (English) is required (min 3 characters).' };
  }

  const organization = getLocalized(r, 'organization');
  if (!organization.en || organization.en.length < 2) {
    return { valid: false, error: 'Institution name (English) is required.' };
  }

  const validCategory = ['sovereign', 'multilateral', 'academic', 'advisory'].includes(String(r.category))
    ? (String(r.category) as CareerEntry['category'])
    : 'sovereign';

  const description = getLocalized(r, 'description');

  const sanitized: Partial<CareerEntry> = {
    ...(r as Partial<CareerEntry>),
    role_title: { en: roleTitle.en, fr: roleTitle.fr },
    organization: { en: organization.en, fr: organization.fr },
    category: validCategory,
    period: sanitizeText(r.period || '2025 – Present', 60),
    is_current: Boolean(r.is_current),
    location: sanitizeText(r.location || 'Yaoundé, Cameroon', 120),
    tenure_note: sanitizeText(r.tenure_note, 300),
    description: {
      en: description.en || roleTitle.en,
      fr: description.fr || roleTitle.fr,
    },
    verification_status: 'verified',
    verification_note: {
      en: 'Official Sovereign Record.',
      fr: 'Registre Souverain Officiel.',
    },
    decree_reference: sanitizeText(r.decree_reference, 120) || undefined,
    official_reference: sanitizeText(r.official_reference, 120) || undefined,
    evidence_url: sanitizeText(r.evidence_url, 300) || undefined,
  };

  return { valid: true, data: sanitized };
}

const VALID_MEDIA_TYPES: MediaAppearanceType[] = [
  'Keynote Address',
  'Policy Interview',
  'Ministerial Panel',
  'Academic Lecture',
  'Broadcast Interview',
  'Press Feature',
  'Published Treatise',
  'Policy Fellowship',
  'Institutional Governance',
  'Academic Repository',
];

export function validateMediaPayload(raw: unknown): ValidationResult<Partial<MediaAppearance>> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Media appearance payload must be a valid JSON object.' };
  }

  const title = getLocalized(r, 'title');
  if (!title.en || title.en.length < 3) {
    return { valid: false, error: 'Media title / topic (English) is required (min 3 characters).' };
  }

  const venue = sanitizeText(r.venue, 150);
  if (!venue) {
    return { valid: false, error: 'Media broadcaster / venue is required.' };
  }

  const category = ['broadcast', 'press', 'governance', 'academic'].includes(String(r.category))
    ? (String(r.category) as MediaAppearance['category'])
    : 'broadcast';

  const type = VALID_MEDIA_TYPES.includes(r.type as MediaAppearanceType)
    ? (r.type as MediaAppearanceType)
    : 'Policy Interview';

  const summary = getLocalized(r, 'summary');

  const sanitized: Partial<MediaAppearance> = {
    ...(r as Partial<MediaAppearance>),
    title: { en: title.en, fr: title.fr },
    venue,
    category,
    type,
    date: sanitizeText(r.date || new Date().getFullYear().toString(), 40),
    location: sanitizeText(r.location || 'International Broadcast', 150),
    summary: {
      en: summary.en || title.en,
      fr: summary.fr || title.fr,
    },
    source_url: sanitizeText(r.source_url, 300) || undefined,
    image_url: sanitizeText(r.image_url, 300) || undefined,
    is_pinned: Boolean(r.is_pinned),
  };

  return { valid: true, data: sanitized };
}

const VALID_EVENT_CATEGORIES: EventCategory[] = [
  'summit',
  'academic',
  'book_meetup',
  'governance',
  'diplomatic',
];

export function validateGalleryPayload(raw: unknown): ValidationResult<Partial<GalleryPhotoItem>> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Gallery photo payload must be a valid JSON object.' };
  }

  const title = getLocalized(r, 'title');
  if (!title.en || title.en.length < 3) {
    return { valid: false, error: 'Photo title (English) is required (min 3 characters).' };
  }

  const imageUrl = sanitizeText(r.image_url, 300);
  if (!imageUrl || (!imageUrl.startsWith('/') && !imageUrl.startsWith('https://'))) {
    return { valid: false, error: 'Valid image asset URL is required (must start with / or https://).' };
  }

  const category = VALID_EVENT_CATEGORIES.includes(r.category as EventCategory)
    ? (r.category as EventCategory)
    : 'summit';

  const season = ['2025-2026', '2023-2024', 'archive'].includes(String(r.season))
    ? (String(r.season) as GalleryPhotoItem['season'])
    : '2025-2026';

  const eventName = getLocalized(r, 'event_name');
  const caption = getLocalized(r, 'caption');

  const sanitized: Partial<GalleryPhotoItem> = {
    ...(r as Partial<GalleryPhotoItem>),
    title: { en: title.en, fr: title.fr },
    event_name: {
      en: eventName.en || title.en,
      fr: eventName.fr || title.fr,
    },
    category,
    year: sanitizeText(r.year || new Date().getFullYear().toString(), 10),
    season,
    date: sanitizeText(r.date || new Date().toISOString().slice(0, 10), 20),
    location: sanitizeText(r.location || 'Yaoundé, Cameroon', 150),
    venue: sanitizeText(r.venue || 'State Assembly', 150),
    image_url: imageUrl,
    caption: {
      en: caption.en || title.en,
      fr: caption.fr || title.fr,
    },
    is_featured_monthly: Boolean(r.is_featured_monthly),
  };

  return { valid: true, data: sanitized };
}

export function validateInquiryPayload(raw: unknown): ValidationResult<Record<string, unknown>> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Inquiry payload must be a valid JSON object.' };
  }

  const validStatus = ['received', 'under_review', 'responded', 'archived'].includes(String(r.status))
    ? String(r.status)
    : 'received';

  const sanitized: Record<string, unknown> = {
    ...r,
    status: validStatus,
    admin_note: sanitizeText(r.admin_note, 1000) || undefined,
  };

  return { valid: true, data: sanitized };
}

function sanitizeSafeUrl(input: unknown, defaultUrl: string): string {
  if (typeof input !== 'string') return defaultUrl;
  const trimmed = input.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('https://')) {
    return trimmed.slice(0, 500);
  }
  return defaultUrl;
}

export function validateHeroCopyPayload(raw: unknown): ValidationResult<HeroCopyConfig> {
  const r = getRecord(raw);
  if (!r) {
    return { valid: false, error: 'Hero copy payload must be a valid JSON object.' };
  }

  const headline = getLocalized(r, 'headline');
  if (!headline.en || headline.en.length < 5) {
    return { valid: false, error: 'English headline must be at least 5 characters.' };
  }

  const subheadline = getLocalized(r, 'subheadline');
  if (!subheadline.en || subheadline.en.length < 15) {
    return { valid: false, error: 'English subheadline must be at least 15 characters.' };
  }

  const eyebrow = getLocalized(r, 'eyebrow');
  const ctaPrimary = getLocalized(r, 'ctaPrimary');
  const ctaSecondary = getLocalized(r, 'ctaSecondary');
  const role1 = getLocalized(r, 'role1');
  const role2 = getLocalized(r, 'role2');
  const role3 = getLocalized(r, 'role3');
  const independenceText = getLocalized(r, 'independenceText');
  const independenceLinkText = getLocalized(r, 'independenceLinkText');
  const caption = getLocalized(r, 'caption');

  const sanitized: HeroCopyConfig = {
    eyebrow: {
      en: eyebrow.en || 'SOVEREIGN FINANCE · GOVERNANCE · DEVELOPMENT',
      fr: eyebrow.fr || eyebrow.en || 'FINANCE SOUVERAINE · GOUVERNANCE · DÉVELOPPEMENT',
    },
    headline: {
      en: headline.en,
      fr: headline.fr || headline.en,
    },
    subheadline: {
      en: subheadline.en,
      fr: subheadline.fr || subheadline.en,
    },
    ctaPrimary: {
      en: ctaPrimary.en || 'Browse books',
      fr: ctaPrimary.fr || ctaPrimary.en || 'Parcourir les ouvrages',
    },
    ctaPrimaryLink: sanitizeSafeUrl(r.ctaPrimaryLink, '/books'),
    ctaSecondary: {
      en: ctaSecondary.en || 'About the Professor',
      fr: ctaSecondary.fr || ctaSecondary.en || 'À propos du Professeur',
    },
    ctaSecondaryLink: sanitizeSafeUrl(r.ctaSecondaryLink, '/about'),
    role1: {
      en: role1.en || 'Director of State Finance Operations · MINFI',
      fr: role1.fr || role1.en || 'Directeur des Opérations financières de l’État · MINFI',
    },
    role2: {
      en: role2.en || 'Chair of the Board · ATIDI',
      fr: role2.fr || role2.en || 'Président du Conseil d’administration · ATIDI',
    },
    role3: {
      en: role3.en || 'Senior Lecturer · ENAM',
      fr: role3.fr || role3.en || 'Maître de conférences · ENAM',
    },
    independenceText: {
      en: independenceText.en || 'Independent academic website. Not an official channel of any government body or institution.',
      fr: independenceText.fr || independenceText.en || 'Site académique indépendant. Ne constitue le canal officiel d’aucun organisme public ni d’aucune institution.',
    },
    independenceLinkText: {
      en: independenceLinkText.en || 'Read the independence charter',
      fr: independenceLinkText.fr || independenceLinkText.en || 'Lire la charte d’indépendance',
    },
    caption: {
      en: caption.en || 'Knight, National Order of Valor',
      fr: caption.fr || caption.en || 'Chevalier de l’Ordre de la Valeur',
    },
    portraitImageUrl: sanitizeSafeUrl(r.portraitImageUrl, '/images/portrait.jpeg'),
    updated_at: new Date().toISOString(),
  };

  return { valid: true, data: sanitized };
}

