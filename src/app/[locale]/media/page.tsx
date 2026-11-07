import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  Newspaper,
  Tv,
  Building2,
  GraduationCap,
  BookOpen,
  Play,
  RotateCcw,
  Quote,
  Pin,
} from 'lucide-react';
import { getMediaAppearances } from '@/lib/data/repository';
import { formatCategory, formatDate, formatLocation, t } from '@/lib/utils';
import type { Locale, MediaAppearance } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Médias, Débats Télévisés & Discours | Pr Kelly Mua Kingsly'
      : 'Media Appearances, Keynotes & Broadcasts | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Entretiens audiovisuels (Africa24, CRTV), allocutions de politique publique, présidence ATIDI et articles de presse économique du Professeur Kelly Mua Kingsly.'
      : 'Television interviews (Africa24, national broadcasts), ministerial keynote addresses, ATIDI board assemblies, and financial press features by Professor Kelly Mua Kingsly.';

  return {
    title,
    description,
    keywords: [
      'Professor Kelly Mua Kingsly Media',
      'Kelly Mua Kingsley Africa24',
      'ATIDI Board Chairman Keynote',
      'Public Finance Television Debate Cameroon',
      'EcoMatin Kelly Kingsly Interview',
      'Cameroon CEO Kelly Mua Kingsly',
    ],
    alternates: {
      canonical: `/${locale}/media`,
      languages: {
        en: '/en/media',
        fr: '/fr/media',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/media`,
    },
  };
}

function getVenueIcon(item: MediaAppearance) {
  if (item.category === 'broadcast' || item.type === 'Broadcast Interview') {
    return <Tv className="w-4 h-4 shrink-0 text-bronze-600" aria-hidden="true" />;
  }
  if (item.category === 'governance' || item.type === 'Institutional Governance') {
    return <Building2 className="w-4 h-4 shrink-0 text-bronze-600" aria-hidden="true" />;
  }
  if (item.type === 'Published Treatise') {
    return <BookOpen className="w-4 h-4 shrink-0 text-bronze-600" aria-hidden="true" />;
  }
  if (
    item.category === 'academic' ||
    item.type === 'Academic Lecture' ||
    item.type === 'Academic Repository'
  ) {
    return <GraduationCap className="w-4 h-4 shrink-0 text-bronze-600" aria-hidden="true" />;
  }
  return <Newspaper className="w-4 h-4 shrink-0 text-bronze-600" aria-hidden="true" />;
}

function getSourceLabel(item: MediaAppearance, locale: Locale): string {
  if (item.source_url?.includes('youtube.com')) {
    return locale === 'fr'
      ? 'Visionner la vidéo complète sur YouTube'
      : 'Watch full video on YouTube';
  }
  if (item.source_url?.includes('laboutiqueafricavivre.com')) {
    return locale === 'fr'
      ? 'Consulter l’ouvrage chez le distributeur (Africa Vivre)'
      : 'Order specialized volume (La Boutique Africa Vivre)';
  }
  if (item.source_url?.includes('atidi.africa')) {
    return locale === 'fr'
      ? 'Consulter le répertoire officiel de gouvernance (ATIDI)'
      : 'Access official board directory (ATIDI)';
  }
  if (item.source_url?.includes('afsic.net')) {
    return locale === 'fr'
      ? 'Consulter le profil officiel d’intervenant (AFSIC Londres)'
      : 'View official keynote speaker profile (AFSIC London)';
  }
  if (item.source_url?.includes('puissance-237.com')) {
    return locale === 'fr'
      ? 'Lire l’analyse stratégique (Puissance 237 / ACCI)'
      : 'Read strategic leadership dossier (Puissance 237)';
  }
  if (item.source_url?.includes('237actu.com')) {
    return locale === 'fr'
      ? 'Lire le portrait de presse complet (237 Actu)'
      : 'Read biographical press portrait (237 Actu)';
  }
  if (item.source_url?.includes('academia.edu')) {
    return locale === 'fr'
      ? 'Accéder au répertoire académique (Academia.edu)'
      : 'Access academic repository (Academia.edu)';
  }
  if (item.source_url?.includes('nkafu.org')) {
    return locale === 'fr'
      ? 'Consulter la notice d’expert (Institut Nkafu)'
      : 'View senior policy fellow dossier (Nkafu Institute)';
  }
  if (item.source_url?.includes('ecomatin.net')) {
    return locale === 'fr'
      ? 'Lire l’enquête économique (EcoMatin)'
      : 'Read full economic investigation (EcoMatin)';
  }
  if (item.source_url?.includes('theguardianpostcameroon.com')) {
    return locale === 'fr'
      ? 'Lire l’article de presse (The Guardian Post)'
      : 'Read press feature (The Guardian Post)';
  }
  if (item.source_url?.includes('lavoixdesentreprises.info')) {
    return locale === 'fr'
      ? 'Lire l’article de presse (La Voix des Entreprises)'
      : 'Read press coverage (La Voix des Entreprises)';
  }
  if (item.source_url?.includes('cameroonceo.com')) {
    return locale === 'fr'
      ? 'Lire le dossier exécutif (Cameroon CEO)'
      : 'Read executive profile (Cameroon CEO)';
  }
  if (item.source_url?.includes('abidjan.net')) {
    return locale === 'fr'
      ? 'Consulter la dépêche de presse (Abidjan.net)'
      : 'Read public finance report (Abidjan.net)';
  }

  return locale === 'fr'
    ? 'Consulter la source publique'
    : 'View public source record';
}

export default function MediaPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { filter?: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const allMedia = getMediaAppearances();
  const activeFilter = searchParams?.filter || 'all';
  const media = getMediaAppearances(activeFilter);

  const filterTabs = [
    {
      id: 'all',
      label: { en: 'All Records', fr: 'Tous les enregistrements' },
      count: allMedia.length,
    },
    {
      id: 'broadcast',
      label: { en: 'Broadcast & Video', fr: 'Audiovisuel & Vidéo' },
      count: allMedia.filter((m) => m.category === 'broadcast').length,
    },
    {
      id: 'press',
      label: { en: 'Press & Investigations', fr: 'Presse & Enquêtes' },
      count: allMedia.filter((m) => m.category === 'press').length,
    },
    {
      id: 'governance',
      label: { en: 'Multilateral Governance', fr: 'Gouvernance Multilatérale' },
      count: allMedia.filter((m) => m.category === 'governance').length,
    },
    {
      id: 'academic',
      label: { en: 'Scholarly & Treatises', fr: 'Publications & Recherche' },
      count: allMedia.filter((m) => m.category === 'academic').length,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'fr'
        ? 'Médias & Interventions Publiques du Pr Kelly Mua Kingsly'
        : 'Media Appearances & Public Keynotes by Professor Kelly Mua Kingsly',
    description:
      locale === 'fr'
        ? 'Répertoire officiel des entretiens télévisés, allocutions ministérielles et articles de presse'
        : 'Official registry of broadcast interviews, ministerial keynotes, and economic press features',
    url: `https://kellykingsly.com/${locale}/media`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allMedia.length,
      itemListElement: allMedia.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': item.video_metadata?.youtube_id
            ? 'VideoObject'
            : 'CreativeWork',
          name: t(item.title, locale),
          description: t(item.summary, locale),
          datePublished: item.date,
          author: {
            '@type': 'Person',
            name: 'Professor Kelly Mua Kingsly',
          },
          publisher: {
            '@type': 'Organization',
            name: item.venue,
          },
          url: item.source_url || `https://kellykingsly.com/${locale}/media`,
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
      {/* Editorial Header Masthead */}
      <div className="max-w-3xl space-y-4">
        <div className="editorial-kicker">
          {locale === 'fr'
            ? 'DISCOURS, ENTRETIENS & DOSSIERS DE PRESSE'
            : 'SPEECHES, INTERVIEWS & INSTITUTIONAL FORUMS'}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif font-semibold text-navy-900 leading-[1.15]">
          {locale === 'fr'
            ? 'Allocutions Publiques, Dossiers de Presse & Interventions Académiques'
            : 'Public Addresses, Policy Interviews & Academic Lectures'}
        </h1>
        <p className="text-ink-700 text-base sm:text-[17px] leading-relaxed">
          {locale === 'fr'
            ? 'Sélection d’allocutions officielles, d’entretiens audiovisuels, d’enquêtes de presse, de dossiers de gouvernance multilatérale et de publications scientifiques du Professeur Kelly Mua Kingsly.'
            : 'Selected keynote addresses, broadcast interviews, investigative press features, multilateral governance dossiers, and scholarly treatises by Professor Kelly Mua Kingsly across public finance, trade de-risking, and forensic auditing.'}
        </p>
      </div>

      {/* Category Filter Pills — Mobile Momentum Scroll Rail */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar smooth-scroll-x flex-nowrap sm:flex-wrap pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          const href =
            tab.id === 'all'
              ? `/${locale}/media`
              : `/${locale}/media?filter=${tab.id}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`shrink-0 min-h-[44px] px-4 py-2 text-xs font-semibold flex items-center justify-center active:scale-95 transition-all ${
                isActive
                  ? 'bg-navy-900 text-gold-400 shadow-sm'
                  : 'bg-white border border-surface-border text-ink-700 hover:border-navy-900'
              }`}
            >
              <span>{tab.label[locale]}</span>
              <span className="ml-1.5 opacity-70 text-[11px]">({tab.count})</span>
            </Link>
          );
        })}
      </div>

      {/* Media Records Grid */}
      {media.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {media.map((item) => {
            const isVideo = Boolean(
              item.video_metadata?.youtube_id || item.source_url?.includes('youtube.com')
            );
            const youtubeId = item.video_metadata?.youtube_id;

            return (
              <article
                key={item.id}
                className={`bg-white border p-6 sm:p-8 space-y-5 transition-all ${
                  item.is_pinned
                    ? 'border-gold-500/80 shadow-md ring-1 ring-gold-500/25'
                    : 'border-surface-border shadow-institutional hover:border-navy-900'
                }`}
              >
                {/* Pinned Badge (When applicable) */}
                {item.is_pinned && (
                  <div className="flex items-center gap-2 pb-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500 text-navy-950 font-bold text-[11px] uppercase tracking-wider shadow-sm">
                      <Pin className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
                      <span>
                        {locale === 'fr'
                          ? 'Allocution Principale à la Une · Épinglée'
                          : 'Pinned Keynote Broadcast · Always on Top'}
                      </span>
                    </span>
                  </div>
                )}

                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                  <span className="px-3 py-1 bg-navy-900 text-gold-400 font-semibold tracking-wide">
                    {formatCategory(item.type, locale)}
                  </span>
                  <span className="text-ink-500">
                    {formatDate(item.date, locale)} ·{' '}
                    {formatLocation(item.location, locale)}
                  </span>
                </div>

                {/* Article / Video Title */}
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-navy-900 leading-snug">
                  {t(item.title, locale)}
                </h2>

                {/* Venue Strip */}
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-bronze-600">
                  {getVenueIcon(item)}
                  <span>{item.venue}</span>
                </div>

                {/* Editorial Photo Frame (When Applicable for Articles / Treatises / Mandates) */}
                {!isVideo && item.image_url && (
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden border border-surface-border bg-navy-950 shadow-sm rounded-sm">
                    <Image
                      src={item.image_url}
                      alt={t(item.title, locale)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover"
                      unoptimized={item.image_url.startsWith('http')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-gold-300 font-semibold bg-navy-950/80 px-2.5 py-1 border border-gold-500/30">
                      {item.venue}
                    </div>
                  </div>
                )}

                {/* Video Player & Subtitles/Captions Bar (When Applicable) */}
                {isVideo && youtubeId && (
                  <div className="space-y-2 pt-2">
                    <div className="relative aspect-video w-full overflow-hidden border border-surface-border bg-navy-950 shadow-sm">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?cc_load_policy=1&rel=0&modestbranding=1`}
                        title={t(item.title, locale)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-navy-900 text-slate-200 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-gold-500 text-navy-950 font-bold text-[10px] tracking-wider uppercase">
                          CC / Sous-titres
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-200">
                          {item.video_metadata?.caption_note
                            ? t(item.video_metadata.caption_note, locale)
                            : locale === 'fr'
                            ? 'Sous-titres (CC) disponibles (activez l’icône CC sur le lecteur)'
                            : 'Closed Captions (CC) available (enable CC icon on player)'}
                        </span>
                      </div>
                      {item.video_metadata?.duration && (
                        <span className="text-[11px] font-mono text-gold-400 font-semibold">
                          {item.video_metadata.duration}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Summary Description */}
                <p className="text-ink-700 text-sm sm:text-base leading-relaxed">
                  {t(item.summary, locale)}
                </p>

                {/* Editorial Caption / Key Takeaway Pull Quote */}
                {item.caption && (
                  <figure className="border-l-2 border-gold-500 bg-sand-50/70 p-4 sm:p-5 rounded-r space-y-2">
                    <div className="flex items-start gap-2.5">
                      <Quote
                        className="w-4 h-4 text-gold-600 shrink-0 mt-0.5 rotate-180"
                        aria-hidden="true"
                      />
                      <blockquote className="italic font-serif text-navy-950 text-xs sm:text-sm leading-relaxed">
                        “{t(item.caption, locale)}”
                      </blockquote>
                    </div>
                    <figcaption className="text-[11px] text-ink-500 font-semibold uppercase tracking-wider pl-6 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500" />
                      <span>
                        {locale === 'fr'
                          ? `Citation clé · ${item.venue}`
                          : `Editorial Excerpt · ${item.venue}`}
                      </span>
                    </figcaption>
                  </figure>
                )}

                {/* Source Action CTA Link */}
                {item.source_url && (
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {isVideo ? (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold tracking-wide transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{getSourceLabel(item, locale)}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-gold-300" />
                      </a>
                    ) : (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-bronze-600 underline underline-offset-4 transition-colors"
                      >
                        <span>{getSourceLabel(item, locale)}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-surface-border p-12 text-center space-y-4">
          <p className="text-ink-600 text-base">
            {locale === 'fr'
              ? 'Aucun enregistrement ne correspond à ce filtre.'
              : 'No records match this category filter.'}
          </p>
          <Link
            href={`/${locale}/media`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-bronze-600 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {locale === 'fr'
                ? 'Réinitialiser les filtres'
                : 'Reset to all records'}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
