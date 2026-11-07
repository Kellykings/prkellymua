'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Camera,
  Calendar,
  MapPin,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Grid,
  Layers,
  ExternalLink,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import type { GalleryPhotoItem, InstitutionalEvent, Locale } from '@/types/domain';
import { t, formatDate, formatGalleryCategory } from '@/lib/utils';
export { formatGalleryCategory };

interface EpicEventGalleryProps {
  locale: Locale;
  photos: GalleryPhotoItem[];
  upcomingEvents?: InstitutionalEvent[];
}

export function EpicEventGallery({
  locale,
  photos,
  upcomingEvents = [],
}: EpicEventGalleryProps) {
  // --- State Architecture ---
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [modalPhoto, setModalPhoto] = useState<GalleryPhotoItem | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Filtering Logic ---
  const filteredPhotos = useMemo(() => {
    let list = photos;
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedSeason !== 'all') {
      list = list.filter(
        (p) => p.season === selectedSeason || p.year === selectedSeason
      );
    }
    return list;
  }, [photos, selectedCategory, selectedSeason]);

  // Keep active index in bounds
  useEffect(() => {
    if (activeIndex >= filteredPhotos.length) {
      setActiveIndex(0);
    }
  }, [filteredPhotos.length, activeIndex]);

  // Scroll carousel to active item
  const scrollToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const container = carouselRef.current;
      const child = container.children[index] as HTMLElement;
      if (child) {
        const offsetLeft = child.offsetLeft - container.offsetLeft - 16;
        container.scrollTo({ left: offsetLeft, behavior: 'smooth' });
      }
    }
  }, []);

  // --- Autoplay Rotation (Respects prefers-reduced-motion) ---
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAutoPlaying || prefersReducedMotion || filteredPhotos.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % filteredPhotos.length;
        if (carouselRef.current && viewMode === 'carousel') {
          const container = carouselRef.current;
          const child = container.children[next] as HTMLElement;
          if (child) {
            const offsetLeft = child.offsetLeft - container.offsetLeft - 16;
            container.scrollTo({ left: offsetLeft, behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, filteredPhotos.length, viewMode]);

  // Keyboard navigation & body overflow lock for Lightbox
  useEffect(() => {
    if (modalPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (!modalPhoto) return;
      if (e.key === 'Escape') setModalPhoto(null);
      if (e.key === 'ArrowRight') {
        const currIdx = filteredPhotos.findIndex((p) => p.id === modalPhoto.id);
        if (currIdx !== -1) {
          const nextIdx = (currIdx + 1) % filteredPhotos.length;
          setModalPhoto(filteredPhotos[nextIdx]);
        }
      }
      if (e.key === 'ArrowLeft') {
        const currIdx = filteredPhotos.findIndex((p) => p.id === modalPhoto.id);
        if (currIdx !== -1) {
          const prevIdx = currIdx === 0 ? filteredPhotos.length - 1 : currIdx - 1;
          setModalPhoto(filteredPhotos[prevIdx]);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalPhoto, filteredPhotos]);

  const categories = [
    { id: 'all', label: locale === 'fr' ? 'Toutes les photos' : 'All Moments', count: photos.length },
    { id: 'governance', label: locale === 'fr' ? 'Gouvernance & Trésor' : 'Governance & Treasury' },
    { id: 'summit', label: locale === 'fr' ? 'Sommets & AFSIC' : 'Sovereign Summits' },
    { id: 'book_meetup', label: locale === 'fr' ? 'Rencontres Auteur' : 'Book Meetups & Signings' },
    { id: 'academic', label: locale === 'fr' ? 'ENAM & Académie' : 'Academic Masterclasses' },
  ];

  const seasons = [
    { id: 'all', label: locale === 'fr' ? 'Toutes saisons' : 'All Seasons' },
    { id: '2025-2026', label: '2025 – 2026' },
    { id: '2023-2024', label: '2023 – 2024' },
    { id: 'archive', label: locale === 'fr' ? 'Archives & Distinctions' : 'Archival History' },
  ];

  const activePhoto = filteredPhotos[activeIndex] || filteredPhotos[0];

  return (
    <section
      id="gallery"
      className="relative bg-navy-950 text-white py-16 sm:py-24 border-b border-gold-500/20 overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      aria-label={
        locale === 'fr'
          ? 'Galerie des Événements & Rencontres'
          : 'Events & Engagements Photographic Gallery'
      }
    >
      {/* DEPTH 0: Far Atmospheric Background Architecture */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-900 via-navy-950 to-[#040810] pointer-events-none opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* DEPTH 1: Warm Golden Atmospheric Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[48rem] h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Masthead Header: Title + Season Pill + Navigation Modes */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-kicker-dark inline-flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                <span>
                  {locale === 'fr'
                    ? 'ARCHIVES PHOTOGRAPHIQUES OFFICIELLES'
                    : 'OFFICIAL PHOTOGRAPHIC ARCHIVES'}
                </span>
              </span>
              <span className="px-2.5 py-0.5 bg-gold-500/20 border border-gold-500/40 text-[11px] font-semibold text-gold-300">
                {locale === 'fr'
                  ? `${photos.length} Clichés · Rotation Mensuelle & Annuelle`
                  : `${photos.length} Curated Photos · Monthly & Yearly Rotation`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              {locale === 'fr'
                ? 'Événements, Sommets Internationaux & Rencontres Auteur'
                : 'Sovereign Summits, Multilateral Missions & Author Meetups'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Immersion photographique au cœur des assemblées générales de l’ATIDI, des délégations souveraines du Trésor, des cours magistraux à l’ENAM et des séances de dédicace des 10 ouvrages de référence.'
                : 'Visual photographic documentation across ATIDI multilateral assemblies, sovereign treasury roadshows, university masterclasses, and signing meetups for Professor Kingsly’s 10 published books.'}
            </p>
          </div>

          {/* Controls HUD (View Mode Toggle & Autoplay Switch) */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Autoplay Pause / Play */}
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              aria-label={
                isAutoPlaying
                  ? locale === 'fr' ? 'Mettre en pause le défilement automatique' : 'Pause rotation'
                  : locale === 'fr' ? 'Activer le défilement automatique' : 'Play rotation'
              }
              className="inline-flex items-center gap-1.5 h-10 px-3.5 bg-navy-900/80 hover:bg-navy-800 border border-white/15 text-xs text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {locale === 'fr' ? 'Pause Auto' : 'Auto Pause'}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {locale === 'fr' ? 'Lire Auto' : 'Auto Play'}
                  </span>
                </>
              )}
            </button>

            {/* View Mode: Carousel vs Grid */}
            <div
              className="inline-flex p-1 bg-navy-900/80 border border-white/15 rounded-sm"
              role="group"
              aria-label={locale === 'fr' ? 'Mode d’affichage de la galerie' : 'Gallery display mode'}
            >
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                aria-label={locale === 'fr' ? 'Vue Défilement Film' : 'Filmstrip view'}
                className={`p-2 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                  viewMode === 'carousel'
                    ? 'bg-gold-500 text-navy-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                aria-label={locale === 'fr' ? 'Vue Mosaïque Complète' : 'Masonry grid view'}
                className={`p-2 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                  viewMode === 'grid'
                    ? 'bg-gold-500 text-navy-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar: Categories & Seasons */}
        <div className="space-y-3">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none overscroll-x-contain"
            role="tablist"
            aria-label={locale === 'fr' ? 'Filtrer par thématique' : 'Filter by category'}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveIndex(0);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all touch-target-sm rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                    isSelected
                      ? 'bg-gold-500 text-navy-950 shadow-md'
                      : 'bg-navy-900/60 hover:bg-navy-800 text-slate-300 border border-white/10'
                  }`}
                >
                  {cat.label}
                  {cat.count ? ` (${cat.count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Season Selector */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs text-slate-400"
            role="group"
            aria-label={locale === 'fr' ? 'Sélectionner une période' : 'Select season'}
          >
            <span className="font-semibold uppercase tracking-wider text-[11px] text-gold-400 shrink-0">
              {locale === 'fr' ? 'Période :' : 'Season:'}
            </span>
            {seasons.map((s) => {
              const isSelected = selectedSeason === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedSeason(s.id);
                    setActiveIndex(0);
                  }}
                  className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                    isSelected
                      ? 'text-gold-300 font-semibold border-b-2 border-gold-400'
                      : 'hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- MAIN STAGE --- */}

        {/* MODE 1: MOBILE-FIRST 2.5D TOUCH CAROUSEL & SPOTLIGHT */}
        {viewMode === 'carousel' && (
          <div className="space-y-8">
            {/* Cinematic Featured Spotlight Card (Depth 3 & 4) */}
            {activePhoto && (
              <div className="relative border border-gold-500/35 bg-navy-900/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch group rounded-sm">
                {/* Visual Half (lg:col-span-7) */}
                <div
                  className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:col-span-7 overflow-hidden cursor-pointer"
                  onClick={() => setModalPhoto(activePhoto)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t(activePhoto.title, locale)} (${locale === 'fr' ? 'Agrandir' : 'Enlarge'})`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setModalPhoto(activePhoto);
                    }
                  }}
                >
                  <Image
                    src={activePhoto.image_url}
                    alt={t(activePhoto.title, locale)}
                    fill
                    priority
                    unoptimized={activePhoto.image_url.startsWith('http')}
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  {/* Atmospheric Light Sheen Overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent pointer-events-none"
                  />
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-navy-950/85 backdrop-blur-md border border-gold-500/40 text-[11px] font-semibold text-gold-300">
                      {activePhoto.year}
                    </span>
                    {activePhoto.is_featured_monthly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-bronze-600/90 backdrop-blur-md text-[11px] font-semibold text-white">
                        <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span>{locale === 'fr' ? 'À la Une' : 'Featured of Month'}</span>
                      </span>
                    )}
                  </div>
                  {/* Tap to Enlarge Icon Indicator */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPhoto(activePhoto);
                    }}
                    aria-label={locale === 'fr' ? 'Plein écran' : 'Fullscreen'}
                    className="absolute bottom-3 right-3 p-2 bg-navy-950/80 backdrop-blur-md border border-white/20 text-white hover:text-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    <Maximize2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>

                {/* Editorial Plaque Half (lg:col-span-5) */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-navy-950/80 border-t lg:border-t-0 lg:border-l border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-gold-400 uppercase tracking-wider font-semibold">
                        {formatGalleryCategory(activePhoto.category, locale)}
                      </span>
                      <span className="font-mono">
                        {String(activeIndex + 1).padStart(2, '0')} /{' '}
                        {String(filteredPhotos.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                      {t(activePhoto.title, locale)}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 text-gold-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                        <span>{activePhoto.venue}, {activePhoto.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{formatDate(activePhoto.date, locale)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed border-l-2 border-gold-500 pl-3.5 italic font-sans">
                      “{t(activePhoto.caption, locale)}”
                    </p>

                    {activePhoto.participants_note && (
                      <div className="flex items-start gap-2 text-xs text-slate-400 pt-2 border-t border-white/10">
                        <UserCheck className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{t(activePhoto.participants_note, locale)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Next/Prev Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setModalPhoto(activePhoto)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-gold-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                    >
                      <span>{locale === 'fr' ? 'Agrandir le cliché' : 'View Full Image'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          scrollToIndex(
                            activeIndex === 0
                              ? filteredPhotos.length - 1
                              : activeIndex - 1
                          )
                        }
                        aria-label={locale === 'fr' ? 'Photo précédente' : 'Previous photo'}
                        className="p-2 bg-navy-900 border border-white/20 text-white hover:text-gold-400 hover:border-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      >
                        <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          scrollToIndex((activeIndex + 1) % filteredPhotos.length)
                        }
                        aria-label={locale === 'fr' ? 'Photo suivante' : 'Next photo'}
                        className="p-2 bg-navy-900 border border-white/20 text-white hover:text-gold-400 hover:border-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Touch Scrub Horizontal Filmstrip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">
                  {locale === 'fr' ? 'Défilement tactile des clichés' : 'Touch Filmstrip Sequence'}
                </span>
                <span>
                  {locale === 'fr'
                    ? 'Glisser horizontalement ou toucher pour afficher'
                    : 'Swipe or tap thumbnail'}
                </span>
              </div>

              <div
                ref={carouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none overscroll-x-contain"
              >
                {filteredPhotos.map((photo, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <article
                      key={photo.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${t(photo.title, locale)} (${idx + 1} / ${filteredPhotos.length})`}
                      aria-current={isCurrent ? 'true' : undefined}
                      onClick={() => scrollToIndex(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          scrollToIndex(idx);
                        }
                      }}
                      className={`relative w-44 sm:w-56 shrink-0 aspect-[4/3] snap-start border cursor-pointer overflow-hidden transition-all duration-300 group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                        isCurrent
                          ? 'border-gold-400 ring-2 ring-gold-400/50 scale-[1.02]'
                          : 'border-white/15 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={photo.thumbnail_url || photo.image_url}
                        alt={t(photo.title, locale)}
                        fill
                        unoptimized={(photo.thumbnail_url || photo.image_url).startsWith('http')}
                        sizes="(max-width: 640px) 176px, 224px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                        <div className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider truncate">
                          {photo.year} · {photo.location.split(',')[0]}
                        </div>
                        <div className="text-xs font-serif font-bold text-white line-clamp-1">
                          {t(photo.title, locale)}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: EDITORIAL 3-COLUMN MASONRY GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <article
                key={photo.id}
                role="button"
                tabIndex={0}
                aria-label={`${t(photo.title, locale)} (${locale === 'fr' ? 'Agrandir' : 'Enlarge'})`}
                onClick={() => setModalPhoto(photo)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setModalPhoto(photo);
                  }
                }}
                className="group relative bg-navy-900/80 border border-white/15 hover:border-gold-500/50 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  <Image
                    src={photo.image_url}
                    alt={t(photo.title, locale)}
                    fill
                    unoptimized={photo.image_url.startsWith('http')}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-navy-950/80 text-[10px] font-semibold text-gold-300 border border-gold-500/30">
                      {photo.year}
                    </span>
                    <span className="px-2 py-0.5 bg-navy-950/80 text-[10px] text-slate-300 font-mono">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 p-1.5 bg-navy-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-gold-400">
                      {photo.venue}
                    </div>
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-gold-300 transition-colors leading-snug line-clamp-2">
                      {t(photo.title, locale)}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed font-sans">
                      “{t(photo.caption, locale)}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-gold-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{photo.location}</span>
                    </span>
                    <span className="shrink-0 font-mono">{photo.date.slice(0, 7)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* UPCOMING & RECENT INSTITUTIONAL EVENTS STRIP */}
        {upcomingEvents.length > 0 && (
          <div className="pt-10 border-t border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="editorial-kicker-dark">
                  {locale === 'fr'
                    ? 'AGENDA & COLLOQUES INSTITUTIONNELS'
                    : 'INSTITUTIONAL CALENDAR & SYMPOSIA'}
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {locale === 'fr'
                    ? 'Prochains Sommets, Conférences & Séances de Dédicace'
                    : 'Upcoming Summits, Masterclasses & Signing Sessions'}
                </h3>
              </div>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                <span>
                  {locale === 'fr'
                    ? 'Inviter le Pr Kingsly à un événement'
                    : 'Request Event Appearance / Keynote'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {upcomingEvents.map((evt) => (
                <article
                  key={evt.id}
                  className="bg-navy-900/60 border border-white/15 p-5 sm:p-6 space-y-3 flex flex-col justify-between hover:border-gold-500/40 transition-colors rounded-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-gold-500/20 text-gold-300 font-semibold uppercase tracking-wider text-[10px] font-mono">
                        {evt.status === 'upcoming'
                          ? locale === 'fr' ? 'À VENIR' : 'UPCOMING'
                          : locale === 'fr' ? 'ARCHIVE' : 'CONCLUDED'}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {formatDate(evt.date, locale)}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                      {t(evt.title, locale)}
                    </h4>

                    <div className="text-xs text-gold-400 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{evt.venue}, {evt.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {t(evt.description, locale)}
                    </p>

                    {evt.keynote_topic && (
                      <div className="p-3 bg-navy-950/80 border-l-2 border-gold-400 text-xs text-slate-300 mt-2 rounded-sm">
                        <strong className="text-gold-300 block mb-0.5">
                          {locale === 'fr' ? 'Thématique Principale :' : 'Keynote Theme:'}
                        </strong>
                        {t(evt.keynote_topic, locale)}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{evt.organizer}</span>
                    <Link
                      href={`/${locale}/contact`}
                      className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-semibold shrink-0"
                    >
                      <span>{locale === 'fr' ? 'Protocole' : 'Protocol'}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- CINEMATIC 2.5D LIGHTBOX MODAL --- */}
      {modalPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(modalPhoto.title, locale)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setModalPhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[94vh] bg-navy-900 border border-gold-500/40 shadow-2xl overflow-y-auto flex flex-col rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Dismiss */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/15 bg-navy-950/90 sticky top-0 z-10">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gold-400 font-semibold uppercase tracking-wider">
                  {formatGalleryCategory(modalPhoto.category, locale)}
                </span>
                <span className="text-slate-400 font-mono">· {modalPhoto.year}</span>
                <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
                  ({filteredPhotos.findIndex((p) => p.id === modalPhoto.id) + 1} / {filteredPhotos.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Button in Modal Header */}
                <button
                  type="button"
                  onClick={() => {
                    const currIdx = filteredPhotos.findIndex((p) => p.id === modalPhoto.id);
                    if (currIdx !== -1) {
                      const prevIdx = currIdx === 0 ? filteredPhotos.length - 1 : currIdx - 1;
                      setModalPhoto(filteredPhotos[prevIdx]);
                    }
                  }}
                  aria-label={locale === 'fr' ? 'Photo précédente' : 'Previous photo'}
                  className="p-1.5 text-slate-300 hover:text-gold-400 hover:bg-white/10 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden="true" />
                </button>

                {/* Next Button in Modal Header */}
                <button
                  type="button"
                  onClick={() => {
                    const currIdx = filteredPhotos.findIndex((p) => p.id === modalPhoto.id);
                    if (currIdx !== -1) {
                      const nextIdx = (currIdx + 1) % filteredPhotos.length;
                      setModalPhoto(filteredPhotos[nextIdx]);
                    }
                  }}
                  aria-label={locale === 'fr' ? 'Photo suivante' : 'Next photo'}
                  className="p-1.5 text-slate-300 hover:text-gold-400 hover:bg-white/10 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setModalPhoto(null)}
                  aria-label={locale === 'fr' ? 'Fermer le dialogue' : 'Close dialog'}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors rounded-sm ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  <X className="w-5 h-5 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* High-Resolution Visual Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black shrink-0">
              <Image
                src={modalPhoto.image_url}
                alt={t(modalPhoto.title, locale)}
                fill
                unoptimized={modalPhoto.image_url.startsWith('http')}
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            {/* Curated Photographic Editorial Plaque */}
            <div className="p-6 sm:p-8 space-y-4 bg-navy-950">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                {t(modalPhoto.title, locale)}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 text-gold-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                  <span>{modalPhoto.venue}, {modalPhoto.location}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{formatDate(modalPhoto.date, locale)}</span>
                </span>
              </div>

              <blockquote className="p-4 bg-navy-900/80 border-l-2 border-gold-400 text-sm text-slate-200 italic leading-relaxed font-sans">
                “{t(modalPhoto.caption, locale)}”
              </blockquote>

              {modalPhoto.participants_note && (
                <div className="text-xs text-slate-300 flex items-start gap-2 pt-2 border-t border-white/10">
                  <UserCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>{locale === 'fr' ? 'Délégations & Participants : ' : 'Delegations & Participants: '}</strong>
                    {t(modalPhoto.participants_note, locale)}
                  </span>
                </div>
              )}

              {modalPhoto.external_ref_url && (
                <div className="pt-2">
                  <a
                    href={modalPhoto.external_ref_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 underline underline-offset-4"
                  >
                    <span>{locale === 'fr' ? 'Consulter la notice officielle' : 'View Official Reference'}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
