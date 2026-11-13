import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowRight, Search, X, RotateCcw, Download } from 'lucide-react';
import { getBlogPosts } from '@/lib/data/repository';
import { formatCategory, formatDate, t } from '@/lib/utils';
import type { Locale } from '@/types/domain';

function renderWithAbbr(text: string, locale: Locale) {
  const acronyms: Record<string, { en: string; fr: string }> = {
    ATIDI: {
      en: 'African Trade & Investment Development Insurance',
      fr: 'Agence pour l’Assurance du Commerce en Afrique (ATIDI)',
    },
    MINFI: {
      en: 'Ministry of Finance (Cameroon)',
      fr: 'Ministère des Finances (Cameroun)',
    },
    ENAM: {
      en: 'National School of Administration and Magistracy (Yaoundé)',
      fr: 'École Nationale d’Administration et de Magistrature (Yaoundé)',
    },
    BEAC: {
      en: 'Bank of Central African States',
      fr: 'Banque des États de l’Afrique Centrale',
    },
    COSUMAF: {
      en: 'Central African Financial Market Surveillance Commission',
      fr: 'Commission de Surveillance du Marché Financier de l’Afrique Centrale',
    },
    BVMAC: {
      en: 'Central African Unified Stock Exchange',
      fr: 'Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC)',
    },
    CEMAC: {
      en: 'Central African Economic and Monetary Community',
      fr: 'Communauté Économique et Monétaire de l’Afrique Centrale',
    },
    TSA: {
      en: 'Treasury Single Account',
      fr: 'Compte Unique du Trésor (CUT)',
    },
    CUT: {
      en: 'Compte Unique du Trésor',
      fr: 'Compte Unique du Trésor',
    },
    PFM: {
      en: 'Public Financial Management',
      fr: 'Gestion des Finances Publiques (GFP)',
    },
    GFP: {
      en: 'Gestion des Finances Publiques',
      fr: 'Gestion des Finances Publiques',
    },
    'UNDP-GEF': {
      en: 'United Nations Development Programme – Global Environment Facility',
      fr: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial (PNUD-FEM)',
    },
    'PNUD-FEM': {
      en: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial',
      fr: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial',
    },
    IFMIS: {
      en: 'Integrated Financial Management Information System',
      fr: 'Système Intégré de Gestion des Finances Publiques (SIGFIP)',
    },
    ESG: {
      en: 'Environmental, Social, and Governance',
      fr: 'Environnemental, Social et de Gouvernance (ESG)',
    },
  };

  const regex = /(ATIDI|MINFI|ENAM|BEAC|COSUMAF|BVMAC|CEMAC|TSA|CUT|PFM|GFP|UNDP-GEF|PNUD-FEM|IFMIS|ESG)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const acronymData = acronyms[part];
    if (acronymData) {
      return (
        <abbr
          key={index}
          title={acronymData[locale]}
          className="no-underline cursor-help border-b border-dotted border-current/50 hover:border-bronze-600 transition-colors"
        >
          {part}
        </abbr>
      );
    }
    return part;
  });
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Notes de Politique & Travaux de Recherche | Pr Kelly Mua Kingsly'
      : 'Policy Briefs & Working Papers | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Analyses économiques, notes d’orientation et recherche appliquée en finances publiques, marchés financiers de la CEMAC et gouvernance par le Professeur Kelly Mua Kingsly.'
      : 'Open-access economic commentary, empirical policy briefs, and sovereign audit working papers authored by Professor Kelly Mua Kingsly for policymakers, researchers, and institutional investors.';

  return {
    title,
    description,
    keywords: [
      'CEMAC Capital Markets Analysis',
      'Sovereign Debt Africa Kingsly',
      'Public Financial Management Cameroon',
      'Forensic Auditing Policy Briefs',
      'ESG Green Bonds Central Africa',
      'Professor Kelly Mua Kingsly Working Papers',
    ],
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        fr: '/fr/blog',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/blog`,
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { category?: string; q?: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const activeCategory = searchParams?.category;
  const searchQuery = (searchParams?.q || '').trim().toLowerCase();
  let posts = await getBlogPosts(activeCategory);

  if (searchQuery) {
    posts = posts.filter((p) => {
      const titleEn = p.title.en.toLowerCase();
      const titleFr = p.title.fr.toLowerCase();
      const excerptEn = p.excerpt.en.toLowerCase();
      const excerptFr = p.excerpt.fr.toLowerCase();
      const tags = p.tags.join(' ').toLowerCase();
      const doi = (p.doi_reference || '').toLowerCase();
      return (
        titleEn.includes(searchQuery) ||
        titleFr.includes(searchQuery) ||
        excerptEn.includes(searchQuery) ||
        excerptFr.includes(searchQuery) ||
        tags.includes(searchQuery) ||
        doi.includes(searchQuery)
      );
    });
  }

  const categories = [
    'Capital Markets',
    'ESG & Climate Finance',
    'Forensic Auditing & Integrity',
    'Sovereign Debt & PFM',
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name:
      locale === 'fr'
        ? 'Notes de Politique & Travaux de Recherche — Pr Kelly Mua Kingsly'
        : 'Policy Briefs & Sovereign Working Papers — Professor Kelly Mua Kingsly',
    description:
      locale === 'fr'
        ? 'Publications analytiques et notes d’orientation rédigées par le Professeur Kelly Mua Kingsly'
        : 'Empirical working papers and policy commentary by Professor Kelly Mua Kingsly',
    url: `https://kellykingsly.com/${locale}/blog`,
    author: {
      '@type': 'Person',
      name: 'Professor Kelly Mua Kingsly',
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: t(post.title, locale),
      description: t(post.excerpt, locale),
      datePublished: post.published_at,
      url: `https://kellykingsly.com/${locale}/blog/${post.slug}`,
      identifier: post.doi_reference,
      author: {
        '@type': 'Person',
        name: 'Professor Kelly Mua Kingsly',
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-10 sm:space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl space-y-4">
        <div className="editorial-kicker">
          {locale === 'fr'
            ? 'NOTES DE POLITIQUE & TRAVAUX DE RECHERCHE'
            : 'POLICY BRIEFS & SOVEREIGN WORKING PAPERS'}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif font-semibold text-navy-900 leading-[1.15]">
          {locale === 'fr'
            ? 'Recherche Appliquée & Notes d’Orientation des Politiques Publiques'
            : 'Applied Research & Sovereign Policy Briefs'}
        </h1>
        <p className="text-ink-700 text-base sm:text-[17px] leading-relaxed">
          {locale === 'fr'
            ? 'Travaux de recherche empirique en libre accès, notes d’orientation et analyses techniques sur la gestion des finances publiques, les marchés de capitaux de la CEMAC et l’audit judiciaire.'
            : 'Open-access empirical research, working papers, and technical commentary on public financial management, CEMAC capital markets, and forensic governance.'}
        </p>
      </div>

      {/* Search Input Bar */}
      <form
        method="GET"
        action={`/${locale}/blog`}
        className="relative flex items-center max-w-xl"
      >
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <Search
          className="absolute left-3.5 w-4 h-4 text-ink-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          name="q"
          defaultValue={searchParams?.q || ''}
          placeholder={
            locale === 'fr'
              ? 'Rechercher par mot-clé, thème CEMAC, tag ou réf. DOI...'
              : 'Search policy briefs by keyword, CEMAC topic, tag or DOI...'
          }
          className="w-full h-11 pl-10 pr-24 bg-white border border-surface-border text-sm text-navy-900 placeholder:text-ink-400 focus:outline-none focus:border-navy-900 rounded-sm shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-1 px-3 py-1.5 bg-navy-900 text-gold-400 text-xs font-semibold hover:bg-navy-800 transition-colors rounded-sm"
        >
          {locale === 'fr' ? 'Rechercher' : 'Search'}
        </button>
      </form>

      {/* Search Query Active Status Strip */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-xs text-ink-600 bg-sand-50/80 border border-surface-border p-2.5 rounded-sm">
          <span>
            {locale === 'fr'
              ? `Résultats de recherche pour « ${searchParams?.q} » (${posts.length})`
              : `Search results for "${searchParams?.q}" (${posts.length})`}
          </span>
          <Link
            href={
              activeCategory
                ? `/${locale}/blog?category=${encodeURIComponent(activeCategory)}`
                : `/${locale}/blog`
            }
            className="inline-flex items-center gap-1 font-semibold text-bronze-600 hover:text-navy-900 underline ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Effacer la recherche' : 'Clear search'}</span>
          </Link>
        </div>
      )}

      {/* Category Filter Pills — Mobile Momentum Scroll Rail */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar smooth-scroll-x flex-nowrap sm:flex-wrap pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Link
          href={
            searchQuery
              ? `/${locale}/blog?q=${encodeURIComponent(searchQuery)}`
              : `/${locale}/blog`
          }
          className={`shrink-0 min-h-[44px] px-4 py-2 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all ${
            !activeCategory
              ? 'bg-navy-900 text-gold-400'
              : 'bg-white border border-surface-border text-ink-700 hover:border-navy-900'
          }`}
        >
          {locale === 'fr' ? 'Toutes les thématiques' : 'All tracks'}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={
              searchQuery
                ? `/${locale}/blog?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(searchQuery)}`
                : `/${locale}/blog?category=${encodeURIComponent(cat)}`
            }
            className={`shrink-0 min-h-[44px] px-4 py-2 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all ${
              activeCategory === cat
                ? 'bg-navy-900 text-gold-400'
                : 'bg-white border border-surface-border text-ink-700 hover:border-navy-900'
            }`}
          >
            {formatCategory(cat, locale)}
          </Link>
        ))}
      </div>

      {/* Articles List */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-surface-border p-6 sm:p-8 shadow-institutional flex flex-col justify-between space-y-4 hover:border-navy-900 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-ink-500">
                  <span className="px-2.5 py-1 bg-navy-900 text-gold-400 font-semibold">
                    {formatCategory(post.category, locale)}
                  </span>
                  <span>{formatDate(post.published_at, locale)}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {post.estimated_read_minutes}{' '}
                    {locale === 'fr' ? 'min de lecture' : 'min read'}
                  </span>
                  {post.doi_reference && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Ref. {post.doi_reference}</span>
                    </>
                  )}
                  {post.pdf_download_url && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-bronze-600">
                        <Download className="w-3 h-3" />
                        <span>PDF {post.pages ? `(${post.pages}p)` : ''}</span>
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl font-serif font-semibold text-navy-900">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:text-bronze-600 transition-colors"
                  >
                    {renderWithAbbr(t(post.title, locale), locale)}
                  </Link>
                </h2>

                <p className="text-ink-700 text-sm sm:text-base leading-relaxed">
                  {renderWithAbbr(t(post.excerpt, locale), locale)}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-surface-paper border border-surface-border text-ink-700 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {post.pdf_download_url && (
                    <a
                      href={post.pdf_download_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-bronze-600 hover:text-navy-900 transition-colors"
                      title={locale === 'fr' ? 'Télécharger la note en PDF' : 'Download working paper PDF'}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  )}

                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>
                      {locale === 'fr'
                        ? 'Lire la note complète'
                        : 'Read full policy brief'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-surface-border p-12 text-center space-y-4">
          <p className="text-ink-600 text-base">
            {locale === 'fr'
              ? 'Aucune note de politique ne correspond à votre recherche.'
              : 'No policy briefs match your search criteria.'}
          </p>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-bronze-600 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {locale === 'fr'
                ? 'Réinitialiser la recherche'
                : 'Reset search'}
            </span>
          </Link>
        </div>
      )}

      {/* Institutional Cross-Pathways Bar */}
      <section className="bg-surface-paper border border-surface-border p-6 sm:p-8 rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              {locale === 'fr'
                ? 'Traités Académiques & Piliers d’Autorité'
                : 'Scholarly Treatises & Technical Pillars'}
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              {locale === 'fr'
                ? 'Pour approfondir les fondements théoriques et les applications opérationnelles de ces notes de recherche.'
                : 'Explore the full monographic treatises and operational statecraft pillars underpinning these policy briefs.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-gold-300 font-semibold text-xs transition-colors rounded-sm"
            >
              <span>{locale === 'fr' ? 'Catalogue des 10 Traités' : 'Catalog of 10 Treatises'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/expertise`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-surface-paper border border-surface-border text-navy-900 font-semibold text-xs transition-colors rounded-sm"
            >
              <span>{locale === 'fr' ? 'Piliers d’Expertise' : 'Technical Pillars'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

