import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, RotateCcw } from 'lucide-react';
import { getBooks } from '@/lib/data/repository';
import {
  formatCategory,
  formatDate,
  formatDualPrice,
  formatFormatLabel,
  t,
} from '@/lib/utils';
import type { Locale } from '@/types/domain';

function getBookTrack(category: string): string {
  if (
    category.includes('Forensic') ||
    category.includes('Financial Integrity') ||
    category.includes('Fraud')
  ) {
    return 'forensics';
  }
  if (category.includes('Sovereign Debt')) {
    return 'sovereign_debt';
  }
  if (
    category.includes('Capital Markets') ||
    category.includes('ESG') ||
    category.includes('Governance')
  ) {
    return 'capital_markets';
  }
  return 'risk_tech';
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Ouvrages Publiés & Librairie Hybride | Pr Kelly Mua Kingsly'
      : 'Published Treatises & Hybrid Bookstore | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Explorez les 10 traités et monographies de référence du Professeur Kelly Mua Kingsly : criminalistique financière, sauvetages budgétaires, blockchain, gestion des risques et gouvernance. Téléchargement immédiat ou commande libraire.'
      : 'Explore 10 authoritative reference treatises by Professor Kelly Mua Kingsly spanning forensic accounting, financial crime diagnostics, sovereign economic bailouts, blockchain trust, and risk management.';

  return {
    title,
    description,
    keywords: [
      'Professor Kelly Mua Kingsly Books',
      'Kelly Mua Kingsley Publications',
      'Financial Crime Investigations Book',
      'Economic Bail Out Programs Emerging Economies',
      'Forensic Accounting Treatise Africa',
      'Corporate Fraud Risk Management Kingsly',
      'Blockchain Disruptive Technology Central Africa',
    ],
    alternates: {
      canonical: `/${locale}/books`,
      languages: {
        en: '/en/books',
        fr: '/fr/books',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/books`,
    },
  };
}

export default async function BooksCatalogPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { track?: string; currency?: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const books = await getBooks();
  const activeTrack = searchParams?.track || 'all';
  const preferredCurrency =
    searchParams?.currency?.toUpperCase() === 'USD'
      ? 'USD'
      : searchParams?.currency?.toUpperCase() === 'XAF'
      ? 'XAF'
      : locale === 'fr'
      ? 'XAF'
      : 'USD';

  const tracks = [
    {
      id: 'all',
      label: { en: 'All Volumes', fr: 'Tous les traités' },
      count: books.length,
    },
    {
      id: 'forensics',
      label: {
        en: 'Forensics, Fraud & AML',
        fr: 'Audit Forensique & Fraude',
      },
      count: books.filter((b) => getBookTrack(b.academic_category) === 'forensics').length,
    },
    {
      id: 'capital_markets',
      label: {
        en: 'Capital Markets & ESG',
        fr: 'Marchés des Capitaux & ESG',
      },
      count: books.filter((b) => getBookTrack(b.academic_category) === 'capital_markets').length,
    },
    {
      id: 'risk_tech',
      label: {
        en: 'Risk Management & Blockchain',
        fr: 'Gestion des Risques & Blockchain',
      },
      count: books.filter((b) => getBookTrack(b.academic_category) === 'risk_tech').length,
    },
    {
      id: 'sovereign_debt',
      label: {
        en: 'Sovereign Debt & Bailouts',
        fr: 'Dette Souveraine & Sauvetages',
      },
      count: books.filter((b) => getBookTrack(b.academic_category) === 'sovereign_debt').length,
    },
  ];

  const displayBooks =
    activeTrack === 'all'
      ? books
      : books.filter((b) => getBookTrack(b.academic_category) === activeTrack);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'fr'
        ? 'Ouvrages Publiés du Pr Kelly Mua Kingsly'
        : 'Published Treatises by Professor Kelly Mua Kingsly',
    description:
      locale === 'fr'
        ? 'Catalogue officiel des traités académiques et professionnels'
        : 'Official catalog of authoritative academic treatises and professional monographs',
    url: `https://kellykingsly.com/${locale}/books`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: books.length,
      itemListElement: books.map((book, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Book',
          name: t(book.title, locale),
          isbn: book.isbn,
          author: {
            '@type': 'Person',
            name: 'Professor Kelly Mua Kingsly',
          },
          publisher: book.publisher,
          datePublished: book.publish_date,
          url: `https://kellykingsly.com/${locale}/books/${book.slug}`,
          image: book.cover_image_url.startsWith('http')
            ? book.cover_image_url
            : `https://kellykingsly.com${book.cover_image_url}`,
        },
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header Banner — Clean Editorial Press Masthead */}
      <div className="bg-navy-900 text-white p-6 sm:p-10 lg:p-12 border-b-2 border-gold-500">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-kicker-dark">
              {locale === 'fr'
                ? 'CATALOGUE ACADÉMIQUE & LIBRAIRIE HYBRIDE'
                : 'SCHOLARLY PUBLICATIONS & HYBRID BOOKSTORE'}
            </span>
            <span className="px-2.5 py-0.5 bg-gold-500/20 border border-gold-500/40 text-[11px] font-semibold text-gold-300">
              {locale === 'fr'
                ? `${books.length} Ouvrages · Plus récent en premier`
                : `${books.length} Volumes · Most Recent First`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white leading-tight">
            {locale === 'fr'
              ? 'Ouvrages Publiés du Professeur Kelly Mua Kingsly'
              : 'Published Volumes by Professor Kelly Mua Kingsly'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {locale === 'fr'
              ? 'Acquérez les éditions numériques (PDF/ePub avec lien de téléchargement chiffré valable 72h) ou commandez les éditions reliées auprès des distributeurs internationaux (Amazon Global, Amazon France, Amazon UK, Amazon Italy, Barnes & Noble, Christian Faith Publishing, Africa Vivre, IEM Press, Eliva Press).'
              : 'Acquire direct digital editions (PDF/ePub delivered via 72-hour encrypted download link) or order print editions through international retail partners (Amazon Global, Amazon France, Amazon UK, Amazon Italy, Barnes & Noble, Christian Faith Publishing, Africa Vivre, IEM Press, Eliva Press).'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs font-medium text-gold-300">
            <div>
              {locale === 'fr'
                ? '01 · Téléchargement chiffré 72h (PDF / ePub)'
                : '01 · 72h Encrypted Digital Download (PDF / ePub)'}
            </div>
            <div>
              {locale === 'fr'
                ? '02 · Cartes bancaires · Mobile Money (USD / FCFA)'
                : '02 · Cards · Mobile Money (USD / FCFA)'}
            </div>
            <div>
              {locale === 'fr'
                ? '03 · Distributeurs imprimés internationaux'
                : '03 · International Print Retailers'}
            </div>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <Link
              href={`/${locale}/legal/terms`}
              className="text-gold-400 hover:text-gold-300 underline underline-offset-4"
            >
              {locale === 'fr' ? 'Conditions de vente' : 'Terms of Sale'}
            </Link>
            <Link
              href={`/${locale}/legal/refunds`}
              className="text-gold-400 hover:text-gold-300 underline underline-offset-4"
            >
              {locale === 'fr'
                ? 'Politique de remboursement & livraison'
                : 'Refund & Delivery Policy'}
            </Link>
            <Link
              href={`/${locale}/legal/privacy`}
              className="text-gold-400 hover:text-gold-300 underline underline-offset-4"
            >
              {locale === 'fr' ? 'Confidentialité' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>

      {/* Controls Bar: Academic Track Filter Pills + Currency Display Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar smooth-scroll-x flex-nowrap sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0">
          {tracks.map((track) => {
            const isActive = activeTrack === track.id;
            const queryParams = new URLSearchParams();
            if (track.id !== 'all') queryParams.set('track', track.id);
            if (searchParams?.currency) queryParams.set('currency', searchParams.currency.toLowerCase());
            const qs = queryParams.toString();
            const href = `/${locale}/books${qs ? `?${qs}` : ''}`;

            return (
              <Link
                key={track.id}
                href={href}
                className={`shrink-0 min-h-[44px] px-4 py-2 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all ${
                  isActive
                    ? 'bg-navy-900 text-gold-400 shadow-sm'
                    : 'bg-white border border-surface-border text-ink-700 hover:border-navy-900'
                }`}
              >
                <span>{track.label[locale]}</span>
                <span className="ml-1.5 opacity-70 text-[11px]">({track.count})</span>
              </Link>
            );
          })}
        </div>

        {/* Currency Switcher Toggle (Audit P1-6) */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <span className="text-xs text-ink-500 font-medium whitespace-nowrap">
            {locale === 'fr' ? 'Devise :' : 'Currency:'}
          </span>
          <div className="inline-flex rounded-sm border border-surface-border bg-white p-0.5 text-xs shadow-sm">
            <Link
              href={`/${locale}/books?${new URLSearchParams({ ...(activeTrack !== 'all' ? { track: activeTrack } : {}), currency: 'xaf' }).toString()}`}
              className={`min-h-[36px] px-3 py-1.5 font-semibold flex items-center rounded-xs transition-colors ${
                preferredCurrency === 'XAF'
                  ? 'bg-navy-900 text-gold-400 shadow-sm'
                  : 'text-ink-700 hover:text-navy-900'
              }`}
            >
              FCFA (XAF)
            </Link>
            <Link
              href={`/${locale}/books?${new URLSearchParams({ ...(activeTrack !== 'all' ? { track: activeTrack } : {}), currency: 'usd' }).toString()}`}
              className={`min-h-[36px] px-3 py-1.5 font-semibold flex items-center rounded-xs transition-colors ${
                preferredCurrency === 'USD'
                  ? 'bg-navy-900 text-gold-400 shadow-sm'
                  : 'text-ink-700 hover:text-navy-900'
              }`}
            >
              USD ($)
            </Link>
          </div>
        </div>
      </div>

      {/* Books Catalog List — Mobile-First Proportional Layout */}
      {displayBooks.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          {displayBooks.map((book) => {
            const title = t(book.title, locale);
            const subtitle = t(book.subtitle, locale);
            const synopsis = t(book.synopsis, locale);

            return (
              <article
                key={book.id}
                className="bg-white border border-surface-border p-5 sm:p-8 shadow-institutional grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
              >
                {/* Mobile Side-by-Side Header / Desktop Cover Column */}
                <div className="flex sm:block gap-4 lg:col-span-3">
                  <Link
                    href={`/${locale}/books/${book.slug}`}
                    className="group block relative w-28 sm:w-48 lg:w-full aspect-[3/4] shrink-0 bg-navy-950 border border-surface-border shadow-md rounded-sm overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <Image
                      src={book.cover_image_url}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 1024px) 192px, 280px"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    {/* Subtle Book Spine Realism Sheen */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10 pointer-events-none"
                    />
                  </Link>

                  {/* Mobile-Only Immediate Title & Metadata beside Thumbnail */}
                  <div className="flex flex-col justify-center sm:hidden space-y-1.5 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-bronze-600">
                      {formatCategory(book.academic_category, locale)}
                    </span>
                    <h2 className="text-lg font-serif font-semibold text-navy-900 leading-snug">
                      <Link href={`/${locale}/books/${book.slug}`}>{title}</Link>
                    </h2>
                    <p className="text-xs italic text-ink-500 line-clamp-2">
                      {subtitle}
                    </p>
                    <span className="text-xs font-medium text-ink-500 whitespace-nowrap flex items-center gap-1">
                      <span>ISBN</span>
                      <a
                        href={`https://www.worldcat.org/search?q=bn%3A${book.isbn.replace(/[^0-9X]/gi, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono hover:text-bronze-600 underline underline-offset-2 inline-flex items-center gap-0.5"
                        title="Verify in WorldCat international catalog"
                        aria-label={`ISBN ${book.isbn} — ${locale === 'fr' ? 'Vérifier sur WorldCat' : 'Verify on WorldCat'}`}
                      >
                        <span>{book.isbn}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-bronze-600" aria-hidden="true" />
                      </a>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(book.publish_date, locale)}</span>
                    </span>
                  </div>
                </div>

                {/* Book Details & Formats Column */}
                <div className="lg:col-span-9 space-y-4">
                  <div className="hidden sm:flex flex-wrap items-center gap-3 text-xs font-medium text-ink-500 border-b border-surface-border pb-3">
                    <span className="text-bronze-600 uppercase tracking-[0.06em] font-semibold">
                      {formatCategory(book.academic_category, locale)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap inline-flex items-center gap-1">
                      <span>ISBN</span>
                      <a
                        href={`https://www.worldcat.org/search?q=bn%3A${book.isbn.replace(/[^0-9X]/gi, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono hover:text-bronze-600 underline underline-offset-2 inline-flex items-center gap-1"
                        title="Verify in WorldCat international catalog"
                        aria-label={`ISBN ${book.isbn} — ${locale === 'fr' ? 'Vérifier sur WorldCat' : 'Verify on WorldCat'}`}
                      >
                        <span>{book.isbn}</span>
                        <ExternalLink className="w-3 h-3 text-bronze-600" aria-hidden="true" />
                      </a>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {book.total_pages} pages ·{' '}
                      {formatDate(book.publish_date, locale)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-navy-950 font-medium">
                      {book.publisher}
                    </span>
                  </div>

                  <div className="hidden sm:block">
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-navy-900 leading-tight">
                      <Link
                        href={`/${locale}/books/${book.slug}`}
                        className="hover:text-bronze-600 transition-colors"
                      >
                        {title}
                      </Link>
                    </h2>
                    <p className="text-sm sm:text-base italic text-ink-500 mt-1">
                      {subtitle}
                    </p>
                  </div>

                  <p className="text-ink-700 text-sm sm:text-base leading-relaxed">
                    {synopsis}
                  </p>

                  {/* Formats & Action Strip */}
                  <div className="pt-4 border-t border-surface-border flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {book.book_formats.map((fmt) => {
                          const { usdFormatted, xafFormatted } = formatDualPrice(
                            fmt.price_cents,
                            fmt.currency,
                            locale,
                            {
                              priceEurCents: fmt.price_eur_cents,
                              priceXaf: fmt.price_xaf,
                            }
                          );
                          const isXaf = preferredCurrency === 'XAF';
                          const primary = isXaf ? xafFormatted : usdFormatted;
                          const secondary = isXaf ? `(${usdFormatted})` : `(≈ ${xafFormatted})`;

                          return (
                            <span
                              key={fmt.id}
                              className="px-3 py-1.5 bg-surface-paper border border-surface-border text-xs text-navy-900"
                            >
                              {formatFormatLabel(fmt.format, locale)}:{' '}
                              <strong>{primary}</strong>{' '}
                              <span className="text-ink-500">
                                {secondary}
                              </span>
                            </span>
                          );
                        })}
                      </div>

                      {book.third_party_retailers.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-500">
                          <span className="font-semibold text-ink-700">
                            {locale === 'fr'
                              ? 'Distributeurs imprimés :'
                              : 'Print partners:'}
                          </span>
                          {book.third_party_retailers.map((ret) => (
                            <a
                              key={ret.id}
                              href={ret.retail_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${ret.platform_name} — ${title} (${
                                locale === 'fr' ? 'ouvre un nouvel onglet' : 'opens new tab'
                              })`}
                              className="inline-flex items-center gap-1 text-bronze-600 hover:text-navy-900 underline underline-offset-4 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-1"
                            >
                              <span>{ret.platform_name}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/books/${book.slug}`}
                      aria-label={`${
                        locale === 'fr' ? 'Acheter ou commander' : 'Buy or order'
                      } ${title}`}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-11 px-5 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
                    >
                      <span>
                        {locale === 'fr'
                          ? 'Acheter PDF / ePub ou Imprimé'
                          : 'Buy PDF / ePub or Print'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-surface-border p-12 text-center space-y-4">
          <p className="text-ink-600 text-base">
            {locale === 'fr'
              ? 'Aucun ouvrage ne correspond à ce domaine académique.'
              : 'No treatises match this academic track.'}
          </p>
          <Link
            href={`/${locale}/books`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-bronze-600 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {locale === 'fr'
                ? 'Réinitialiser les filtres'
                : 'Reset to all volumes'}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
