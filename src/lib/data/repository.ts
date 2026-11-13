import { createServerClient } from '@/lib/supabase/server';
import {
  SEED_BOOKS,
  SEED_BLOG_POSTS,
  CAREER_ENTRIES,
  EDUCATION_CREDENTIALS,
  EXPERTISE_PILLARS,
  MEDIA_APPEARANCES,
  EXECUTIVE_PROFILE,
  SEED_GALLERY_PHOTOS,
  INSTITUTIONAL_EVENTS,
} from '@/lib/data/seed-data';
import {
  getCustomEntityItems,
  getDeletedEntityIds,
  getStoredHeroConfig,
} from '@/lib/data/custom-content-store';
import type {
  Book,
  BlogPost,
  CareerEntry,
  MediaAppearance,
  GalleryPhotoItem,
  InstitutionalEvent,
  HeroCopyConfig,
} from '@/types/domain';

export async function getBooks(): Promise<Book[]> {
  try {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('books')
        .select('*, book_formats(*), third_party_retailers(*)')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as unknown as Book[]).sort(
          (a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
        );
      }
    }
  } catch {
    // Proceed to fallback dual-store merge
  }

  const deletedIds = new Set(getDeletedEntityIds('books'));
  const customBooks = getCustomEntityItems<Book>('books');
  const customIds = new Set(customBooks.map((b) => b.id));

  const baseFiltered = SEED_BOOKS.filter(
    (b) => !deletedIds.has(b.id) && !customIds.has(b.id)
  );

  const merged = [...customBooks, ...baseFiltered];
  return merged.sort(
    (a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.slug === slug) || null;
}

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient();
    if (supabase) {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as unknown as BlogPost[];
      }
    }
  } catch {
    // Fallback dual-store merge
  }

  const deletedIds = new Set(getDeletedEntityIds('blog'));
  const customPosts = getCustomEntityItems<BlogPost>('blog');
  const customIds = new Set(customPosts.map((p) => p.id));

  const baseFiltered = SEED_BLOG_POSTS.filter(
    (p) => !deletedIds.has(p.id) && !customIds.has(p.id)
  );

  let merged = [...customPosts, ...baseFiltered];
  if (category) {
    merged = merged.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  return merged.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getExecutiveProfile() {
  return EXECUTIVE_PROFILE;
}

export function getCareerEntries(): CareerEntry[] {
  const deletedIds = new Set(getDeletedEntityIds('governance'));
  const customCareers = getCustomEntityItems<CareerEntry>('governance');
  const customIds = new Set(customCareers.map((c) => c.id));

  const baseFiltered = CAREER_ENTRIES.filter(
    (c) => !deletedIds.has(c.id) && !customIds.has(c.id)
  );

  return [...customCareers, ...baseFiltered];
}

export function getEducationCredentials() {
  return EDUCATION_CREDENTIALS;
}

export function getExpertisePillars() {
  return EXPERTISE_PILLARS;
}

export function getMediaAppearances(filter?: string): MediaAppearance[] {
  const deletedIds = new Set(getDeletedEntityIds('media'));
  const customMedia = getCustomEntityItems<MediaAppearance>('media');
  const customIds = new Set(customMedia.map((m) => m.id));

  const baseFiltered = MEDIA_APPEARANCES.filter(
    (m) => !deletedIds.has(m.id) && !customIds.has(m.id)
  );

  let list = [...customMedia, ...baseFiltered];
  if (filter && filter !== 'all') {
    list = list.filter(
      (item) =>
        item.category === filter ||
        item.type.toLowerCase() === filter.toLowerCase()
    );
  }
  return list.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
}

export function getGalleryPhotos(
  category?: string,
  season?: string
): GalleryPhotoItem[] {
  const deletedIds = new Set(getDeletedEntityIds('gallery'));
  const customPhotos = getCustomEntityItems<GalleryPhotoItem>('gallery');
  const customIds = new Set(customPhotos.map((p) => p.id));

  const baseFiltered = SEED_GALLERY_PHOTOS.filter(
    (p) => !deletedIds.has(p.id) && !customIds.has(p.id)
  );

  let list = [...customPhotos, ...baseFiltered];

  if (category && category !== 'all') {
    list = list.filter((item) => item.category === category);
  }

  if (season && season !== 'all') {
    list = list.filter((item) => item.season === season || item.year === season);
  }

  return list.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedMonthlyPhoto(): GalleryPhotoItem {
  const photos = getGalleryPhotos();
  const featured = photos.find((p) => p.is_featured_monthly);
  return featured || photos[0];
}

export function getInstitutionalEvents(
  status?: 'upcoming' | 'concluded' | 'all'
): InstitutionalEvent[] {
  if (!status || status === 'all') {
    return INSTITUTIONAL_EVENTS;
  }
  return INSTITUTIONAL_EVENTS.filter((e) => e.status === status);
}

export function getDefaultHeroConfig(): HeroCopyConfig {
  return {
    eyebrow: {
      en: 'SOVEREIGN FINANCE · GOVERNANCE · DEVELOPMENT',
      fr: 'FINANCE SOUVERAINE · GOUVERNANCE · DÉVELOPPEMENT',
    },
    headline: {
      en: 'Sovereign finance and governance for Africa’s development.',
      fr: 'Finance souveraine et gouvernance au service du développement de l’Afrique.',
    },
    subheadline: {
      en: 'Professor Kelly Mua Kingsly is a finance engineer and climate finance specialist working where sovereign treasury execution meets multilateral risk governance and forensic investigation. Bringing executive leadership and three decades of practitioner rigor, he structures resilient financial architectures, guides sustainable capital mobilization, and directs advanced forensic oversight to safeguard public resources and accelerate economic transformation.',
      fr: 'Le Professeur Kelly Mua Kingsly est ingénieur financier et spécialiste de la finance climat, intervenant à la croisée de l’exécution de la trésorerie souveraine, de la gouvernance des risques multilatéraux et de l’investigation forensique. Fort d’un leadership reconnu et de trois décennies de rigueur opérationnelle, il conçoit des architectures financières résilientes, guide la mobilisation de capitaux durables et pilote des dispositifs avancés de contrôle pour préserver les ressources publiques et accélérer la transformation économique.',
    },
    ctaPrimary: {
      en: 'Browse books',
      fr: 'Parcourir les ouvrages',
    },
    ctaPrimaryLink: '/books',
    ctaSecondary: {
      en: 'About the Professor',
      fr: 'À propos du Professeur',
    },
    ctaSecondaryLink: '/about',
    role1: {
      en: 'Director of State Finance Operations · MINFI',
      fr: 'Directeur des Opérations financières de l’État · MINFI',
    },
    role2: {
      en: 'Chair of the Board · ATIDI',
      fr: 'Président du Conseil d’administration · ATIDI',
    },
    role3: {
      en: 'Senior Lecturer · ENAM',
      fr: 'Maître de conférences · ENAM',
    },
    independenceText: {
      en: 'Independent academic website. Not an official channel of any government body or institution.',
      fr: 'Site académique indépendant. Ne constitue le canal officiel d’aucun organisme public ni d’aucune institution.',
    },
    independenceLinkText: {
      en: 'Read the independence charter',
      fr: 'Lire la charte d’indépendance',
    },
    caption: {
      en: 'Knight, National Order of Valor',
      fr: 'Chevalier de l’Ordre de la Valeur',
    },
    portraitImageUrl: '/images/portrait.jpeg',
  };
}

export async function getHeroConfig(): Promise<HeroCopyConfig> {
  const defaults = getDefaultHeroConfig();

  // 1. Try Supabase site_settings
  try {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_copy')
        .single();

      if (!error && data?.value) {
        return {
          ...defaults,
          ...(data.value as Partial<HeroCopyConfig>),
        };
      }
    }
  } catch {
    // Failover to local store
  }

  // 2. Try local content store
  try {
    const local = getStoredHeroConfig();
    if (local) {
      return {
        ...defaults,
        ...local,
      };
    }
  } catch {
    // Failover to defaults
  }

  return defaults;
}

