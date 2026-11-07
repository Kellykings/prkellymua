import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getBookBySlug } from '@/lib/data/repository';
import { BookPurchaseSection } from '@/components/books/BookPurchaseSection';
import { BookCoverViewer } from '@/components/books/BookCoverViewer';
import { CitationExporter } from '@/components/shared/CitationExporter';
import { formatCategory, formatDate, formatDualPrice, t } from '@/lib/utils';
import type { Locale } from '@/types/domain';

interface BookDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const book = await getBookBySlug(params.slug);

  if (!book) {
    return { title: 'Book Not Found' };
  }

  const title = t(book.title, locale);
  const synopsis = t(book.synopsis, locale);
  const absoluteImageUrl = book.cover_image_url.startsWith('http')
    ? book.cover_image_url
    : `https://kellykingsly.com${book.cover_image_url}`;

  return {
    title: `${title} | Professor Kelly Mua Kingsly`,
    description: synopsis,
    openGraph: {
      title: `${title} | Professor Kelly Mua Kingsly`,
      description: synopsis,
      url: `https://kellykingsly.com/${locale}/books/${book.slug}`,
      siteName: 'Professor Kelly Mua Kingsly Official Platform',
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 1067,
          alt: title,
        },
      ],
      type: 'book',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Professor Kelly Mua Kingsly`,
      description: synopsis,
      images: [absoluteImageUrl],
    },
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const book = await getBookBySlug(params.slug);

  if (!book) {
    notFound();
  }

  const title = t(book.title, locale);
  const subtitle = t(book.subtitle, locale);
  const synopsis = t(book.synopsis, locale);
  const absoluteImageUrl = book.cover_image_url.startsWith('http')
    ? book.cover_image_url
    : `https://kellykingsly.com${book.cover_image_url}`;

  const primaryFormat = book.book_formats[0];
  const primaryPrice = primaryFormat
    ? formatDualPrice(
        primaryFormat.price_cents,
        primaryFormat.currency,
        locale,
        {
          priceEurCents: primaryFormat.price_eur_cents,
          priceXaf: primaryFormat.price_xaf,
        }
      )
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: title,
    headline: subtitle,
    author: {
      '@type': 'Person',
      name: 'Professor Kelly Mua Kingsly',
      honorificSuffix: 'PhD, DBA, MPA, CFA',
      jobTitle: 'Director of Finance Operations of the State',
      url: 'https://kellykingsly.com',
    },
    isbn: book.isbn,
    numberOfPages: book.total_pages,
    publisher: {
      '@type': 'Organization',
      name: book.publisher,
    },
    datePublished: book.publish_date,
    inLanguage: locale === 'fr' ? 'fr' : 'en',
    description: synopsis,
    image: absoluteImageUrl,
    offers: book.book_formats.map((f) => ({
      '@type': 'Offer',
      price: (f.price_cents / 100).toFixed(2),
      priceCurrency: f.currency,
      availability: f.is_available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://kellykingsly.com/${locale}/books/${book.slug}`,
    })),
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Link
          href={`/${locale}/books`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-navy-900 hover:text-bronze-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {locale === 'fr'
              ? 'Retour au Catalogue des Ouvrages'
              : 'Back to Publications Catalog'}
          </span>
        </Link>
      </div>

      {/* Mobile-First Product Grid:
          On mobile, Title + Compact Cover + Purchase Engine come FIRST.
          On desktop (lg:grid-cols-12), Left Column (col-span-5) holds Cover + Metadata + Citation,
          and Right Column (col-span-7) holds Title + Synopsis + Purchase + Chapters. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* RIGHT COLUMN IN DESKTOP / FIRST IN MOBILE DOM ORDER */}
        <div className="lg:col-span-7 lg:order-2 space-y-8">
          {/* Book Header + Mobile Compact Cover */}
          <div className="space-y-4">
            <div className="editorial-kicker">
              {formatCategory(book.academic_category, locale)}
            </div>

            <div className="flex sm:block gap-4 items-start">
              <div className="group relative w-24 aspect-[3/4] shrink-0 bg-navy-950 border border-surface-border rounded-sm overflow-hidden shadow-md sm:hidden">
                <Image
                  src={book.cover_image_url}
                  alt={title}
                  fill
                  priority
                  sizes="96px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10 pointer-events-none"
                />
              </div>
              <div className="space-y-2 min-w-0">
                <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-navy-900 leading-tight">
                  {title}
                </h1>
                <p className="text-sm sm:text-lg font-serif italic text-ink-500">
                  {subtitle}
                </p>
              </div>
            </div>

            <p className="text-ink-700 leading-relaxed text-sm sm:text-base pt-1">
              {synopsis}
            </p>
          </div>

          {/* Interactive Dual-Mode Purchase Engine */}
          <BookPurchaseSection
            bookId={book.id}
            bookSlug={book.slug}
            bookTitle={title}
            locale={locale}
            directFormats={book.book_formats}
            retailers={book.third_party_retailers}
          />

          {/* Key Scholarly Takeaways */}
          {book.key_takeaways?.length > 0 && (
            <div className="bg-white border border-surface-border p-5 sm:p-7 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-bronze-600">
                {locale === 'fr'
                  ? 'Contributions Majeures de l’Ouvrage'
                  : 'Key Scholarly & Policy Contributions'}
              </h2>
              <ul className="divide-y divide-surface-border border-t border-surface-border">
                {book.key_takeaways.map((kt, idx) => (
                  <li
                    key={idx}
                    className="py-3 flex items-start gap-3 text-sm text-ink-700"
                  >
                    <span className="text-xs font-semibold text-bronze-600 shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed">{t(kt, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selected Chapters Overview */}
          {book.chapters?.length > 0 && (
            <div id="chapters" className="scroll-mt-24 space-y-4">
              <div className="editorial-kicker">
                {locale === 'fr'
                  ? 'APERÇU DES CHAPITRES'
                  : 'CHAPTER ARCHITECTURE & SAMPLE OVERVIEW'}
              </div>
              <div className="divide-y divide-surface-border border-y border-surface-border bg-white">
                {book.chapters.map((ch) => (
                  <div key={ch.number} className="p-4 sm:p-5 space-y-1.5">
                    <div className="text-xs font-semibold text-bronze-600 uppercase tracking-[0.06em]">
                      {locale === 'fr'
                        ? `Chapitre 0${ch.number}`
                        : `Chapter 0${ch.number}`}
                    </div>
                    <h3 className="text-base font-serif font-semibold text-navy-900">
                      {t(ch.title, locale)}
                    </h3>
                    <p className="text-sm text-ink-500 leading-relaxed">
                      {t(ch.summary, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LEFT COLUMN IN DESKTOP / SECOND IN MOBILE DOM ORDER */}
        <div className="lg:col-span-5 lg:order-1 space-y-6 lg:sticky lg:top-24">
          <div className="hidden sm:block">
            <BookCoverViewer
              coverUrl={book.cover_image_url}
              alternateCoverUrl={book.alternate_cover_image_url}
              title={title}
              locale={locale}
            />
          </div>

          <div className="bg-white border border-surface-border p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="uppercase text-xs tracking-[0.06em] text-ink-500 font-medium">
                ISBN-13
              </div>
              <div className="font-semibold text-navy-900 mt-1 whitespace-nowrap">
                <a
                  href={`https://www.worldcat.org/search?q=bn%3A${book.isbn.replace(/[^0-9X]/gi, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bronze-600 underline underline-offset-2 inline-flex items-center gap-1 font-mono"
                  title="Verify ISBN in WorldCat International Library Catalog"
                  aria-label={`ISBN ${book.isbn} — ${locale === 'fr' ? 'Vérifier sur WorldCat (ouvre un nouvel onglet)' : 'Verify on WorldCat (opens in new tab)'}`}
                >
                  <span>{book.isbn}</span>
                  <ExternalLink className="w-3 h-3 text-bronze-600 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div>
              <div className="uppercase text-xs tracking-[0.06em] text-ink-500 font-medium">
                {locale === 'fr' ? 'Pagination' : 'Length'}
              </div>
              <div className="font-semibold text-navy-900 mt-1">
                {book.total_pages} Pages
              </div>
            </div>
            <div>
              <div className="uppercase text-xs tracking-[0.06em] text-ink-500 font-medium">
                {locale === 'fr' ? 'Éditeur' : 'Publisher'}
              </div>
              <div className="font-semibold text-navy-900 mt-1">
                {book.publisher}
              </div>
            </div>
            <div>
              <div className="uppercase text-xs tracking-[0.06em] text-ink-500 font-medium">
                {locale === 'fr' ? 'Publication' : 'Published'}
              </div>
              <div className="font-semibold text-navy-900 mt-1">
                {formatDate(book.publish_date, locale)}
              </div>
            </div>
            {primaryPrice && (
              <div className="col-span-2 pt-3 border-t border-surface-border">
                <div className="uppercase text-xs tracking-[0.06em] text-ink-500 font-medium">
                  {locale === 'fr' ? 'Tarif Officiel de Référence' : 'Official Reference Price'}
                </div>
                <div className="font-serif font-bold text-navy-900 text-sm mt-1">
                  {primaryPrice.triCurrencyFormatted}
                </div>
              </div>
            )}
          </div>

          <CitationExporter
            title={`${title}: ${subtitle}`}
            year={book.publish_date.slice(0, 4)}
            publisherOrJournal={book.publisher}
            identifier={book.isbn}
          />
        </div>
      </div>
    </article>
  );
}
