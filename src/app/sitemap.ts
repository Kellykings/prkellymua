import type { MetadataRoute } from 'next';
import { getBooks, getBlogPosts } from '@/lib/data/repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kellykingsly.com';
  const locales = ['en', 'fr'];
  const [books, posts] = await Promise.all([getBooks(), getBlogPosts()]);
  const staticPaths = [
    '',
    '/about',
    '/governance',
    '/expertise',
    '/books',
    '/blog',
    '/media',
    '/contact',
    '/legal/disclaimer',
    '/legal/privacy',
    '/legal/terms',
    '/legal/refunds',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }

    for (const book of books) {
      entries.push({
        url: `${baseUrl}/${locale}/books/${book.slug}`,
        lastModified: new Date(book.publish_date),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.published_at),
        changeFrequency: 'monthly',
        priority: 0.85,
      });
    }
  }

  return entries;
}
