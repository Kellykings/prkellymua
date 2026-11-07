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
} from '@/lib/data/custom-content-store';
import type { Book, BlogPost, CareerEntry, MediaAppearance, GalleryPhotoItem, InstitutionalEvent } from '@/types/domain';

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
