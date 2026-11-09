import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Award,
  ExternalLink,
  Mail,
} from 'lucide-react';
import {
  getBooks,
  getBlogPosts,
  getCareerEntries,
  getExecutiveProfile,
  getExpertisePillars,
  getMediaAppearances,
  getGalleryPhotos,
  getInstitutionalEvents,
  getHeroConfig,
} from '@/lib/data/repository';
import { EpicEventGallery } from '@/components/home/EpicEventGallery';
import { getDictionary } from '@/lib/i18n/dictionaries';
import {
  formatCategory,
  formatDate,
  formatDualPrice,
  formatPeriod,
  t,
} from '@/lib/utils';
import type { Locale } from '@/types/domain';

function renderHeroSubheadlineWithAbbr(text: string, locale: Locale) {
  const acronyms: Record<string, { en: string; fr: string }> = {
    ATIDI: {
      en: 'African Trade & Investment Development Insurance',
      fr: 'Agence pour l’Assurance du Commerce en Afrique (ATIDI)',
    },
    'UNDP-EU': {
      en: 'United Nations Development Programme – European Union',
      fr: 'Programme des Nations Unies pour le Développement – Union Européenne',
    },
    'PNUD-UE': {
      en: 'Programme des Nations Unies pour le Développement – Union Européenne',
      fr: 'Programme des Nations Unies pour le Développement – Union Européenne',
    },
    UNCTAD: {
      en: 'United Nations Conference on Trade and Development',
      fr: 'Conférence des Nations Unies sur le Commerce et le Développement (CNUCED)',
    },
    CNUCED: {
      en: 'Conférence des Nations Unies sur le Commerce et le Développement (CNUCED)',
      fr: 'Conférence des Nations Unies sur le Commerce et le Développement',
    },
    'BEAC-CPC-TP': {
      en: 'Bank of Central African States – Public Securities Settlement and Custody Unit',
      fr: 'Banque des États de l’Afrique Centrale – Cellule de Règlement et de Conservation des Titres Publics',
    },
    COSUMAF: {
      en: 'Central African Financial Market Surveillance Commission',
      fr: 'Commission de Surveillance du Marché Financier de l’Afrique Centrale',
    },
  };

  const regex = /(ATIDI|UNDP-EU|PNUD-UE|UNCTAD|CNUCED|BEAC-CPC-TP|COSUMAF)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const acronymData = acronyms[part];
    if (acronymData) {
      return (
        <abbr
          key={index}
          title={acronymData[locale]}
          className="no-underline cursor-help border-b border-dotted border-white/40 hover:border-gold-400 transition-colors"
        >
          {part}
        </abbr>
      );
    }
    return part;
  });
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const dict = getDictionary(locale);
  const profile = getExecutiveProfile();
  const careers = getCareerEntries().filter((c) => c.is_current);
  const expertise = getExpertisePillars();
  const books = await getBooks();
  const posts = await getBlogPosts();
  const mediaList = getMediaAppearances();
  const galleryPhotos = getGalleryPhotos();
  const upcomingEvents = getInstitutionalEvents('upcoming');
  const heroConfig = await getHeroConfig();

  const heroEyebrow = heroConfig.eyebrow?.[locale] || dict.hero.eyebrow;
  const heroHeadline = heroConfig.headline?.[locale] || dict.hero.headline;
  const heroSubheadline = heroConfig.subheadline?.[locale] || dict.hero.subheadline;
  const heroCtaPrimary = heroConfig.ctaPrimary?.[locale] || dict.hero.ctaPrimary;
  const heroCtaPrimaryLink = heroConfig.ctaPrimaryLink || '/books';
  const heroCtaSecondary = heroConfig.ctaSecondary?.[locale] || dict.hero.ctaSecondary;
  const heroCtaSecondaryLink = heroConfig.ctaSecondaryLink || '/about';
  const heroRole1 = heroConfig.role1?.[locale] || dict.hero.role1;
  const heroRole2 = heroConfig.role2?.[locale] || dict.hero.role2;
  const heroRole3 = heroConfig.role3?.[locale] || dict.hero.role3;
  const heroIndependenceText = heroConfig.independenceText?.[locale] || dict.hero.independenceText;
  const heroIndependenceLinkText = heroConfig.independenceLinkText?.[locale] || dict.hero.independenceLink;
  const heroCaption = heroConfig.caption?.[locale] || dict.hero.caption;
  const heroPortraitUrl = heroConfig.portraitImageUrl || '/images/portrait.jpeg';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    alternateName: profile.alternateName,
    honorificPrefix: 'Professor',
    honorificSuffix: 'PhD, DBA, MPA, CFA',
    jobTitle: [
      'Director of Finance Operations of the State (Ministry of Finance, Cameroon)',
      'Chairman of the Board of Directors (ATIDI)',
      'Senior Lecturer (ENAM)',
    ],
    url: `https://kellykingsly.com/${locale}`,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. DIPLOMATIC HERO — Clean Two-Family Typography, Zero Repetition */}
      <section className="bg-navy-900 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Primary Narrative Column (7/12) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="editorial-kicker-dark">
                {heroEyebrow}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-serif font-semibold tracking-normal text-white leading-display [text-wrap:balance] max-w-[24ch]">
                {heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-[1.6] tracking-normal max-w-[60ch]">
                {renderHeroSubheadlineWithAbbr(heroSubheadline, locale)}
              </p>

              {/* CTAs Placed Immediately Under Lead (Mobile-First: Visible on First Screen) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
                <Link
                  href={heroCtaPrimaryLink.startsWith('http') ? heroCtaPrimaryLink : `/${locale}${heroCtaPrimaryLink.startsWith('/') ? heroCtaPrimaryLink : `/${heroCtaPrimaryLink}`}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm tracking-normal transition-colors"
                >
                  <span>{heroCtaPrimary}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                <Link
                  href={heroCtaSecondaryLink.startsWith('http') ? heroCtaSecondaryLink : `/${locale}${heroCtaSecondaryLink.startsWith('/') ? heroCtaSecondaryLink : `/${heroCtaSecondaryLink}`}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-transparent hover:bg-white/5 text-white border border-white/30 hover:border-gold-400 font-medium text-sm transition-colors"
                >
                  <span>{heroCtaSecondary}</span>
                </Link>
              </div>

              {/* Three Institutional Roles — Sentence Case, Shared Strings, No Mono */}
              <div className="pt-3 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs sm:text-[13px] text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                    <span>{heroRole1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                    <span>{heroRole2}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                    <span>{heroRole3}</span>
                  </div>
                </div>
              </div>

              {/* Plain-Language Statutory Independence Line (No External ↗ Icon) */}
              <div className="pt-2 border-t border-white/10 text-xs sm:text-[13px] text-slate-300 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{heroIndependenceText}</span>
                <Link
                  href={`/${locale}/legal/disclaimer`}
                  className="text-gold-400 hover:text-gold-300 underline underline-offset-4 font-medium transition-colors"
                >
                  {heroIndependenceLinkText}
                </Link>
              </div>
            </div>

            {/* Right Column: 4:5 Executive Portrait Plaque with Monogram Seal (5/12) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <figure className="w-full max-w-sm border border-gold-500/35 bg-navy-950 shadow-elevated overflow-hidden">
                <div className="relative aspect-[4/5] w-full max-h-[65vh] bg-navy-950">
                  <Image
                    src={heroPortraitUrl}
                    alt={`${profile.fullName} — ${heroCaption}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 384px, 420px"
                    className="object-cover object-top"
                  />
                  {/* Subtle Corner Monogram Seal (Audit P0-6) */}
                  <div
                    aria-hidden="true"
                    className="absolute top-3 right-3 w-9 h-9 bg-navy-950/90 backdrop-blur-sm border border-gold-500/60 flex items-center justify-center font-serif font-semibold text-xs tracking-wider text-gold-400 shadow-md"
                  >
                    KMK
                  </div>
                </div>
                <figcaption className="px-5 py-4 bg-navy-950 border-t border-white/10 flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-sm font-semibold text-white tracking-normal leading-snug">
                      {profile.fullName}
                    </div>
                    <div className="text-xs text-gold-400 font-medium leading-snug">
                      {heroCaption}
                    </div>
                    <div className="text-xs text-slate-300 leading-snug">
                      {profile.honorifics}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURRENT SOVEREIGN & MULTILATERAL MANDATES */}
      <section className="py-14 sm:py-20 bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div className="space-y-2">
              <div className="editorial-kicker">
                {locale === 'fr'
                  ? 'RESPONSABILITÉS STATUTAIRES'
                  : 'STATUTORY & BOARD MANDATES'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
                {dict.sections.mandatesTitle}
              </h2>
              <p className="text-ink-500 max-w-2xl text-sm sm:text-base">
                {dict.sections.mandatesSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/governance`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-bronze-600 shrink-0 border-b border-navy-900/30 hover:border-bronze-600 pb-1 self-start md:self-auto transition-colors"
            >
              <span>{dict.sections.viewFullBio}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Architectural 3-Column Hairline Grid with Pinned Anatomy */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-surface-border">
            {careers.slice(0, 3).map((entry, idx) => (
              <article
                key={entry.id}
                className="border-r border-b border-surface-border p-6 sm:p-8 flex flex-col justify-between bg-white hover:bg-surface-light transition-colors"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-bronze-600 font-semibold uppercase tracking-wider truncate">
                      0{idx + 1} · {formatCategory(entry.category, locale)}
                    </span>
                    <span className="text-ink-400 font-medium shrink-0 whitespace-nowrap">
                      {formatPeriod(entry.period, locale)}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold text-navy-900 leading-snug line-clamp-2 min-h-[3.25rem]">
                    {t(entry.role_title, locale)}
                  </h3>

                  <div className="text-xs font-medium text-ink-700 border-l-2 border-gold-500 pl-3 py-0.5 line-clamp-1">
                    {t(entry.organization, locale)}
                  </div>

                  <p className="text-sm text-ink-500 leading-relaxed line-clamp-3">
                    {t(entry.description, locale)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-border text-xs text-ink-400 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                    <span className="truncate">{t(entry.verification_note, locale)}</span>
                  </div>
                  {entry.evidence_url && (
                    <a
                      href={entry.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-bronze-600 hover:text-navy-900 font-semibold shrink-0 whitespace-nowrap transition-colors"
                      aria-label={`${t(entry.role_title, locale)} — ${locale === 'fr' ? 'Registre officiel' : 'Official record'} (${locale === 'fr' ? 'ouvre un nouvel onglet' : 'opens new tab'})`}
                    >
                      <span>{locale === 'fr' ? 'Registre' : 'Evidence'}</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE BIOGRAPHY & SOVEREIGN LEGACY TEASER */}
      <section className="py-14 sm:py-20 bg-surface-paper border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-4 space-y-4">
              <div className="editorial-kicker">
                {locale === 'fr'
                  ? 'PARCOURS & DÉCORATIONS'
                  : 'SCHOLARSHIP & DISTINCTIONS'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 leading-snug">
                {locale === 'fr'
                  ? 'Plus de Deux Décennies au Cœur des Finances Souveraines et de la Recherche'
                  : 'Over Two Decades at the Sovereign Nexus of Finance, Risk & Academy'}
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {['PhD', 'DBA', 'MPA', 'CFA'].map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 bg-white border border-surface-border text-xs font-semibold text-navy-900 shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-white border border-surface-border p-6 sm:p-8 space-y-5 shadow-institutional">
              <p className="text-base sm:text-lg font-serif italic text-navy-900 leading-relaxed">
                “{profile.fullBioParagraphs[0][locale]}”
              </p>
              <div className="border-t border-surface-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-ink-500">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-bronze-600 shrink-0" />
                  <span>{t(profile.knighthood, locale)}</span>
                </div>
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center gap-1.5 text-sm text-navy-900 font-semibold hover:text-bronze-600 self-start sm:self-auto transition-colors"
                >
                  <span>
                    {locale === 'fr' ? 'Consulter la biographie complète' : 'Read full executive biography'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED BOOKS & HYBRID E-COMMERCE CATALOG — Redesigned Compact Cards */}
      <section className="py-14 sm:py-20 bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div className="space-y-2">
              <div className="editorial-kicker">
                {locale === 'fr'
                  ? 'ÉDITIONS NUMÉRIQUES & LIBRAIRIE HYBRIDE'
                  : 'SCHOLARLY PRESS & HYBRID BOOKSTORE'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
                {dict.sections.booksTitle}
              </h2>
              <p className="text-ink-500 max-w-2xl text-sm sm:text-base">
                {dict.sections.booksSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-gold-400 text-sm font-semibold hover:bg-navy-800 shrink-0 self-start md:self-auto transition-colors"
            >
              <span>
                {dict.sections.viewAllBooks} ({books.length})
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Compact Ergonomic Book Grid: Above-the-fold Price & Clear Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {books.slice(0, 3).map((book) => {
              const lowestPrice = book.book_formats[0];
              const title = t(book.title, locale);
              const prices = lowestPrice
                ? formatDualPrice(lowestPrice.price_cents, lowestPrice.currency, locale, {
                    priceXaf: lowestPrice.price_xaf,
                    priceEurCents: lowestPrice.price_eur_cents,
                  })
                : { usdFormatted: '$38.00', xafFormatted: '23 000 FCFA', triCurrencyFormatted: '$38.00 · 23 000 FCFA' };

              return (
                <article
                  key={book.id}
                  className="relative bg-surface-light border border-surface-border flex flex-col justify-between group hover:border-navy-900 transition-colors shadow-institutional"
                >
                  <div>
                    {/* Visual Header with Compact Cover & Format Pills */}
                    <div className="bg-surface-paper p-5 border-b border-surface-border flex items-center justify-between gap-4">
                      <div className="relative w-24 sm:w-28 aspect-[3/4] shrink-0 bg-navy-900 overflow-hidden shadow-md block group-hover:scale-[1.02] transition-transform duration-200">
                        <Image
                          src={book.cover_image_url}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-cover"
                        />
                        {/* Book Spine Sheen Realism Overlay */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10 pointer-events-none"
                        />
                      </div>

                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="text-xs uppercase tracking-wider text-bronze-600 font-semibold truncate">
                          {formatCategory(book.academic_category, locale)}
                        </div>
                        <div className="text-xs text-ink-500">
                          {book.total_pages} {locale === 'fr' ? 'pages' : 'pages'}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {book.book_formats.map((fmt) => (
                            <span
                              key={fmt.id}
                              className="px-2 py-0.5 bg-white border border-surface-border text-xs text-navy-900 font-medium"
                            >
                              {fmt.format.includes('hardcover')
                                ? locale === 'fr' ? 'Relié' : 'Hardcover'
                                : fmt.format.includes('paperback')
                                ? locale === 'fr' ? 'Broché' : 'Paperback'
                                : fmt.format.includes('epub')
                                ? 'ePub'
                                : 'PDF'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Body */}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <h3 className="text-lg font-serif font-bold text-navy-900 group-hover:text-bronze-600 transition-colors leading-snug line-clamp-2 min-h-[3.25rem]">
                        <Link
                          href={`/${locale}/books/${book.slug}`}
                          className="after:absolute after:inset-0 focus-visible:outline-none"
                        >
                          {title}
                        </Link>
                      </h3>

                      <p className="text-xs italic text-ink-500 line-clamp-1">
                        {t(book.subtitle, locale)}
                      </p>

                      <p className="text-sm text-ink-700 line-clamp-2 leading-relaxed">
                        {t(book.synopsis, locale)}
                      </p>

                      <div className="pt-2 text-xs text-ink-400 whitespace-nowrap flex items-center gap-1.5 relative z-10">
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
                      </div>
                    </div>
                  </div>

                  {/* Dual/Tripartite Pricing & Direct Checkout Bar */}
                  <div className="px-5 sm:px-6 py-4 bg-white border-t border-surface-border space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        {book.id === 'book-credible-signature-paul-biya' ? (
                          <div className="text-sm sm:text-base font-serif font-bold text-navy-900">
                            107$ | 98 Euro | 73 955 FCFA
                          </div>
                        ) : (
                          <>
                            <div className="text-base sm:text-lg font-serif font-bold text-navy-900">
                              {locale === 'fr' ? prices.xafFormatted : prices.usdFormatted}
                            </div>
                            <div className="text-xs text-ink-400">
                              {locale === 'fr' ? `(${prices.usdFormatted})` : `(${prices.xafFormatted})`}
                            </div>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/${locale}/books/${book.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 group-hover:bg-navy-800 text-gold-400 text-xs font-semibold transition-colors"
                      >
                        <span>{locale === 'fr' ? 'Consulter l’ouvrage' : 'View Treatise'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Payment methods mini indicator */}
                    <div className="text-xs text-ink-400 border-t border-surface-border/60 pt-2 flex items-center justify-between">
                      <span>{locale === 'fr' ? 'Édition officielle certifiée' : 'Official certified edition'}</span>
                      <span>{locale === 'fr' ? 'Cartes · Mobile Money' : 'Cards · Mobile Money'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SIX PILLARS OF INSTITUTIONAL & SCHOLARLY EXPERTISE — Accessible Interactive Matrix */}
      <section className="py-14 sm:py-20 bg-navy-900 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 sm:mb-12 space-y-2">
            <div className="editorial-kicker-dark">
              {locale === 'fr'
                ? 'DOMAINES DE COMPÉTENCE'
                : 'CORE DOMAINS OF AUTHORITY'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {dict.sections.expertiseTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              {dict.sections.expertiseSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/15">
            {expertise.map((pillar, index) => {
              const pillarTitle = t(pillar.title, locale);

              return (
                <Link
                  key={pillar.id}
                  href={`/${locale}/expertise#pillar-${index + 1}`}
                  aria-label={`${pillarTitle} — ${locale === 'fr' ? 'Consulter le domaine' : 'Explore domain details'}`}
                  className="group border-r border-b border-white/15 p-6 sm:p-8 flex flex-col justify-between hover:bg-navy-800/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:-outline-offset-2 focus-visible:bg-navy-800"
                >
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.1em] text-gold-400 font-semibold">
                      0{index + 1} &middot; {t(pillar.metrics_label, locale)}
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors leading-snug min-h-[3.25rem]">
                      {pillarTitle}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {t(pillar.summary, locale)}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gold-400 group-hover:text-gold-300 font-semibold">
                    <span>
                      {locale === 'fr' ? 'Consulter le domaine' : 'Explore domain'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. THOUGHT LEADERSHIP & POLICY BRIEFS */}
      <section className="py-14 sm:py-20 bg-white border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div className="space-y-2">
              <div className="editorial-kicker">
                {locale === 'fr'
                  ? 'RECHERCHE & MONOGRAPHIES'
                  : 'RESEARCH & POLICY MONOGRAPHS'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
                {dict.sections.blogTitle}
              </h2>
              <p className="text-ink-500 max-w-2xl text-sm sm:text-base">
                {dict.sections.blogSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-bronze-600 shrink-0 border-b border-navy-900/30 hover:border-bronze-600 pb-1 self-start md:self-auto transition-colors"
            >
              <span>{dict.sections.viewAllBriefs}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="relative group bg-surface-light border border-surface-border p-6 sm:p-8 flex flex-col justify-between hover:border-navy-900 transition-colors shadow-institutional"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    <span className="text-bronze-600 font-semibold uppercase tracking-wider">
                      {formatCategory(post.category, locale)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.published_at}>
                      {formatDate(post.published_at, locale)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>
                      {post.estimated_read_minutes} {locale === 'fr' ? 'min de lecture' : 'min read'}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-navy-900 leading-snug group-hover:text-bronze-600 transition-colors">
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {t(post.title, locale)}
                    </Link>
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    {t(post.excerpt, locale)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between gap-2">
                  <span className="text-xs text-ink-400 truncate">
                    {locale === 'fr' ? 'Réf.' : 'Ref.'} {post.doi_reference}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 group-hover:text-bronze-600 shrink-0 transition-colors">
                    <span>
                      {locale === 'fr' ? 'Lire la note' : 'Read brief'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL PRESS, BROADCASTS & PUBLIC KEYNOTES */}
      <section className="py-14 sm:py-20 bg-surface-paper border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div className="space-y-2">
              <div className="editorial-kicker">
                {locale === 'fr'
                  ? 'MÉDIAS, ALLOCUTIONS & DOSSIERS DE PRESSE'
                  : 'INSTITUTIONAL BROADCASTS & POLICY KEYNOTES'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
                {locale === 'fr'
                  ? 'Prises de Parole & Interventions Publiques'
                  : 'Public Addresses & Broadcast Keynotes'}
              </h2>
              <p className="text-ink-500 max-w-2xl text-sm sm:text-base">
                {locale === 'fr'
                  ? 'Sélection d’allocutions officielles, d’entretiens audiovisuels et d’interventions multilatérales issues du répertoire média officiel.'
                  : 'Selected official keynotes, broadcast interviews, and multilateral addresses directly from the authoritative media archives.'}
              </p>
            </div>
            <Link
              href={`/${locale}/media`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-gold-400 text-sm font-semibold hover:bg-navy-800 shrink-0 self-start md:self-auto transition-colors"
            >
              <span>
                {locale === 'fr'
                  ? `Tous les médias (${mediaList.length})`
                  : `All media archives (${mediaList.length})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {mediaList.slice(0, 3).map((item) => {
              const youtubeId = item.video_metadata?.youtube_id;
              const isVideo = Boolean(youtubeId);

              return (
                <article
                  key={item.id}
                  className={`bg-white border flex flex-col justify-between shadow-institutional transition-all ${
                    item.is_pinned
                      ? 'border-gold-500/80 ring-1 ring-gold-500/25'
                      : 'border-surface-border hover:border-navy-900'
                  }`}
                >
                  <div>
                    {/* Visual Media Frame: Video Player or High-Res Editorial Photo */}
                    {isVideo && youtubeId ? (
                      <div className="space-y-0">
                        <div className="relative aspect-video w-full overflow-hidden bg-navy-950 border-b border-surface-border">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?cc_load_policy=1&rel=0&modestbranding=1`}
                            title={t(item.title, locale)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] bg-navy-900 text-slate-200 px-3 py-1.5 border-b border-surface-border">
                          <span className="inline-flex items-center gap-1 font-semibold text-gold-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                            CC / {locale === 'fr' ? 'Sous-titres' : 'Captions'}
                          </span>
                          {item.video_metadata?.duration && (
                            <span className="font-mono text-gold-300 font-semibold">
                              {item.video_metadata.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : item.image_url ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-navy-950 border-b border-surface-border">
                        <Image
                          src={item.image_url}
                          alt={t(item.title, locale)}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover"
                          unoptimized={item.image_url.startsWith('http')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2.5 text-[10px] font-mono text-gold-300 font-semibold bg-navy-950/80 px-2 py-0.5 border border-gold-500/30">
                          {item.venue}
                        </div>
                      </div>
                    ) : null}

                    {/* Content Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      {/* Pinned Badge (When applicable) */}
                      {item.is_pinned && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gold-500/15 border border-gold-500/30 text-bronze-700 text-[10px] font-semibold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                          <span>
                            {locale === 'fr'
                              ? 'Allocution Principale Épinglée'
                              : 'Pinned Keynote Address'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 text-xs text-ink-400">
                        <span className="text-bronze-600 font-semibold uppercase tracking-wider">
                          {formatCategory(item.type, locale)}
                        </span>
                        <span className="shrink-0">{formatDate(item.date, locale)}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-navy-900 leading-snug line-clamp-2 min-h-[3rem]">
                        <Link
                          href={`/${locale}/media`}
                          className="hover:text-bronze-600 transition-colors"
                        >
                          {t(item.title, locale)}
                        </Link>
                      </h3>

                      <div className="text-xs font-semibold text-ink-600 uppercase tracking-wider line-clamp-1">
                        {item.venue} · {item.location}
                      </div>

                      <p className="text-xs sm:text-sm text-ink-700 leading-relaxed line-clamp-3">
                        {t(item.summary, locale)}
                      </p>

                      {/* Editorial Pull Quote Caption */}
                      {item.caption && (
                        <blockquote className="border-l-2 border-gold-500 pl-3 py-1 bg-surface-paper/70 text-xs text-ink-700 italic line-clamp-2">
                          “{t(item.caption, locale)}”
                        </blockquote>
                      )}
                    </div>
                  </div>

                  {/* Card Action Bar */}
                  <div className="px-5 sm:px-6 py-3.5 bg-surface-paper/60 border-t border-surface-border flex items-center justify-between text-xs text-navy-900">
                    <Link
                      href={`/${locale}/media`}
                      className="font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
                    >
                      {locale === 'fr' ? 'Dossier Média' : 'Media Record'}
                    </Link>
                    {item.source_url ? (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-bronze-600 hover:underline font-semibold"
                      >
                        <span>
                          {isVideo
                            ? locale === 'fr' ? 'Voir sur YouTube' : 'Watch on YouTube'
                            : locale === 'fr' ? 'Source externe' : 'External source'}
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-ink-400">
                        {locale === 'fr' ? 'Archive Officielle' : 'Official Archive'}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. EPIC 25-PHOTO INTERACTIVE EVENT GALLERY & ENGAGEMENTS SHOWCASE */}
      <EpicEventGallery
        locale={locale}
        photos={galleryPhotos}
        upcomingEvents={upcomingEvents}
      />

      {/* 9. INSTITUTIONAL PROTOCOL & STATUTORY ENQUIRIES BANNER */}
      <section className="py-12 sm:py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gold-500/30 bg-navy-950 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-elevated">
            <div className="space-y-3 max-w-2xl">
              <div className="editorial-kicker-dark">
                {locale === 'fr' ? 'PROTOCOLE OFFICIEL' : 'OFFICIAL PROTOCOL'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                {locale === 'fr'
                  ? 'Protocole Officiel et Correspondance Institutionnelle'
                  : 'Institutional Protocol & Sovereign Engagements'}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {locale === 'fr'
                  ? 'Pour toute correspondance administrative statutaire, sollicitation pour comités d’experts multilatéraux, allocutions académiques ou interventions de haut niveau.'
                  : 'Direct channel for ministerial correspondence, sovereign advisory requests, multilateral panel participation, and university guest lectures.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm tracking-wide transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{locale === 'fr' ? 'Transmettre une Requête' : 'Initiate Protocol Contact'}</span>
              </Link>
              <Link
                href={`/${locale}/legal/disclaimer`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-transparent hover:bg-white/5 text-white border border-white/25 hover:border-gold-400 font-medium text-sm transition-colors whitespace-nowrap"
              >
                <span>{locale === 'fr' ? 'Charte de Conformité' : 'Ethics Charter'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
