'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Globe2,
  Landmark,
  Scale,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  FileText,
  BadgeCheck,
  Calendar,
  TrendingUp,
  Globe,
  BookOpen,
} from 'lucide-react';
import type { CareerEntry, EducationCredential, Locale } from '@/types/domain';
import { formatCategory, formatLocation, formatPeriod, t } from '@/lib/utils';

interface ExecutiveProfileData {
  fullName: string;
  alternateName?: string;
  honorifics: string;
  knighthood: { en: string; fr: string };
  shortBio: { en: string; fr: string };
  coordinates: {
    workPhone?: string;
    email?: string;
    linkedIn: string;
    wikiGenius: string;
    wikipedia: string;
    location?: string;
  };
  transversalCompetencies: { en: string; fr: string }[];
  certificationsList: string[];
  honorsList: { en: string; fr: string }[];
}

interface GovernanceRegisterViewProps {
  locale: Locale;
  entries: CareerEntry[];
  credentials: EducationCredential[];
  profile: ExecutiveProfileData;
}

export function GovernanceRegisterView({
  locale,
  entries,
  credentials,
  profile,
}: GovernanceRegisterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'current' | 'concluded'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering calculations with memoization
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'sovereign' && entry.category !== 'sovereign') return false;
        if (selectedCategory === 'multilateral' && entry.category !== 'multilateral') return false;
        if (selectedCategory === 'advisory' && entry.category !== 'advisory') return false;
        if (selectedCategory === 'academic' && entry.category !== 'academic') return false;
      }

      // Status match
      if (statusFilter === 'current' && !entry.is_current) return false;
      if (statusFilter === 'concluded' && entry.is_current) return false;

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const orgEn = entry.organization.en.toLowerCase();
        const orgFr = entry.organization.fr.toLowerCase();
        const roleEn = entry.role_title.en.toLowerCase();
        const roleFr = entry.role_title.fr.toLowerCase();
        const descEn = entry.description.en.toLowerCase();
        const descFr = entry.description.fr.toLowerCase();
        const loc = entry.location.toLowerCase();

        return (
          orgEn.includes(query) ||
          orgFr.includes(query) ||
          roleEn.includes(query) ||
          roleFr.includes(query) ||
          descEn.includes(query) ||
          descFr.includes(query) ||
          loc.includes(query)
        );
      }

      return true;
    });
  }, [entries, selectedCategory, statusFilter, searchQuery]);

  const categories = [
    {
      id: 'all',
      label: locale === 'fr' ? 'Tous les Mandats' : 'All Mandates',
      count: entries.length,
    },
    {
      id: 'sovereign',
      label: locale === 'fr' ? 'Trésor Souverain & État' : 'Sovereign Treasury',
      count: entries.filter((e) => e.category === 'sovereign').length,
    },
    {
      id: 'multilateral',
      label: locale === 'fr' ? 'Conseils Multilatéraux' : 'Multilateral Boards',
      count: entries.filter((e) => e.category === 'multilateral').length,
    },
    {
      id: 'advisory',
      label: locale === 'fr' ? 'Banque & Conseil Global' : 'Banking & Global Advisory',
      count: entries.filter((e) => e.category === 'advisory').length,
    },
    {
      id: 'academic',
      label: locale === 'fr' ? 'Chaires Académiques' : 'Academic Chairs',
      count: entries.filter((e) => e.category === 'academic').length,
    },
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* =========================================================
          SECTION 1: DIPLOMATIC EXECUTIVE DOSSIER
         ========================================================= */}
      <section
        className="bg-navy-950 text-white border border-gold-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden print:bg-white print:text-navy-950 print:border-navy-900 print:p-6 print:shadow-none"
        aria-label={locale === 'fr' ? 'Dossier Exécutif Officiel' : 'Official Executive Dossier'}
      >
        {/* Subtle Atmospheric Gradients (Hidden on Print) */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-navy-900 via-navy-950 to-[#040810] pointer-events-none opacity-90 print:hidden"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none print:hidden"
          aria-hidden="true"
        />

        <div className="relative space-y-8">
          {/* Top Status & Distinctions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 print:border-navy-200 pb-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="editorial-kicker-dark inline-flex items-center gap-1.5 print:text-navy-900">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                <span>
                  {locale === 'fr'
                    ? 'REGISTRE DE GOUVERNANCE SOUVERAINE & MULTILATÉRALE'
                    : 'SOVEREIGN & MULTILATERAL GOVERNANCE REGISTER'}
                </span>
              </span>
              <span className="px-2.5 py-0.5 bg-gold-500/20 border border-gold-500/40 text-[11px] font-semibold text-gold-300 print:bg-slate-100 print:text-navy-900 print:border-navy-300">
                {t(profile.knighthood, locale)}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-navy-900/80 hover:bg-navy-800 border border-white/20 text-xs font-semibold text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 print:hidden"
              aria-label={locale === 'fr' ? 'Imprimer le dossier officiel' : 'Print official dossier'}
            >
              <Printer className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Imprimer le Dossier' : 'Print Dossier'}</span>
            </button>
          </div>

          {/* Core Presidential Identity & Bio Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white print:text-navy-950 tracking-tight leading-tight">
                  {profile.fullName}
                </h1>
                <div className="text-sm sm:text-base font-medium text-gold-400 print:text-bronze-700 mt-1 tracking-wide">
                  {profile.honorifics}
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 print:text-ink-800 leading-relaxed font-sans">
                {t(profile.shortBio, locale)}
              </p>

              {/* Transversal Competencies Chips */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-ink-600">
                  {locale === 'fr'
                    ? 'Domaines d’Expertise Transversale & Ingénierie Financière :'
                    : 'Transversal Competencies & Financial Engineering:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.transversalCompetencies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-navy-900/90 border border-white/15 text-xs text-slate-200 print:bg-slate-100 print:text-navy-950 print:border-slate-300 rounded-sm"
                    >
                      {t(comp, locale)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Public Digital Registries & Institutional Protocol Card */}
            <div className="lg:col-span-4 bg-navy-900/90 print:bg-white print:border-navy-300 border border-gold-500/40 p-5 sm:p-6 space-y-5 rounded-sm">
              <div className="flex items-center justify-between border-b border-white/10 print:border-slate-200 pb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-300 print:text-navy-900">
                  {locale === 'fr' ? 'NOTICES & RÉPERTOIRES PUBLICS' : 'PUBLIC REGISTRIES & PROTOCOL'}
                </h2>
                <BadgeCheck className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
              </div>

              {/* Institutional Protocol Notice */}
              <div className="p-3 bg-navy-950/80 print:bg-slate-50 border-l-2 border-gold-400 print:border-bronze-600 text-xs text-slate-300 print:text-ink-700 leading-relaxed">
                {locale === 'fr'
                  ? 'Conformément aux règles de déontologie publique, toutes les sollicitations officielles, invitations aux sommets et demandes protocolaires sont adressées au secrétariat via le formulaire dédié.'
                  : 'In compliance with public-sector ethics standards, all official solicitations, summit invitations, and protocol inquiries are received exclusively via the protocol office.'}
              </div>

              {/* Institutional Digital Registries */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 print:text-ink-600 block">
                  {locale === 'fr' ? 'Notices Biographiques Publiques & Profils' : 'Public Digital Registries & Institutional Records'}
                </span>

                <div className="space-y-1.5 text-xs">
                  <a
                    href={profile.coordinates.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between text-slate-300 print:text-navy-900 hover:text-gold-300 p-2 bg-navy-950/50 print:bg-slate-50 border border-white/10 print:border-slate-200 hover:border-gold-500/30 transition-colors"
                    aria-label={`Wikipedia Biographical Record (${locale === 'fr' ? 'ouvre un nouvel onglet' : 'opens in a new tab'})`}
                  >
                    <span className="font-medium">Wikipedia Biographical Record</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold-400 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </a>

                  <a
                    href={profile.coordinates.wikiGenius}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between text-slate-300 print:text-navy-900 hover:text-gold-300 p-2 bg-navy-950/50 print:bg-slate-50 border border-white/10 print:border-slate-200 hover:border-gold-500/30 transition-colors"
                    aria-label={`WikiGenius Monographic Portfolio (${locale === 'fr' ? 'ouvre un nouvel onglet' : 'opens in a new tab'})`}
                  >
                    <span className="font-medium">WikiGenius Monographic Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold-400 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </a>

                  <a
                    href={profile.coordinates.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between text-slate-300 print:text-navy-900 hover:text-gold-300 p-2 bg-navy-950/50 print:bg-slate-50 border border-white/10 print:border-slate-200 hover:border-gold-500/30 transition-colors"
                    aria-label={`LinkedIn Executive Network (${locale === 'fr' ? 'ouvre un nouvel onglet' : 'opens in a new tab'})`}
                  >
                    <span className="font-medium">LinkedIn Executive Network</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold-400 shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="pt-2 print:hidden">
                <Link
                  href={`/${locale}/contact`}
                  className="group w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{locale === 'fr' ? 'Formuler une Demande Protocolaire' : 'Submit Protocol Request'}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* KEY GOVERNANCE METRICS STRIP (KPIs) */}
          <div className="pt-6 border-t border-white/10 print:border-navy-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-navy-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
              <Calendar className="w-4 h-4 text-gold-400 mx-auto mb-1.5 opacity-80 shrink-0" aria-hidden="true" />
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 print:text-navy-950">25+</div>
              <div className="text-xs text-slate-300 print:text-ink-700 mt-0.5">
                {locale === 'fr' ? 'Années d’Expérience Fiscale & Financière' : 'Years Transversal Experience'}
              </div>
            </div>

            <div className="p-4 bg-navy-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
              <TrendingUp className="w-4 h-4 text-gold-400 mx-auto mb-1.5 opacity-80 shrink-0" aria-hidden="true" />
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 print:text-navy-950">$85B+</div>
              <div className="text-xs text-slate-300 print:text-ink-700 mt-0.5">
                {locale === 'fr' ? 'Flux Commerciaux Garantis (ATIDI)' : 'Trade & Investment Guaranteed'}
              </div>
            </div>

            <div className="p-4 bg-navy-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
              <Globe className="w-4 h-4 text-gold-400 mx-auto mb-1.5 opacity-80 shrink-0" aria-hidden="true" />
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 print:text-navy-950">24</div>
              <div className="text-xs text-slate-300 print:text-ink-700 mt-0.5">
                {locale === 'fr' ? 'États Membres Souverains (ATIDI)' : 'Sovereign Member States'}
              </div>
            </div>

            <div className="p-4 bg-navy-900/60 print:bg-slate-50 border border-white/10 print:border-slate-200">
              <BookOpen className="w-4 h-4 text-gold-400 mx-auto mb-1.5 opacity-80 shrink-0" aria-hidden="true" />
              <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 print:text-navy-950">10</div>
              <div className="text-xs text-slate-300 print:text-ink-700 mt-0.5">
                {locale === 'fr' ? 'Ouvrages & Traités Publiés' : 'Published Reference Treatises'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: INTERACTIVE MANDATES MATRIX (SEARCH & FILTER)
         ========================================================= */}
      <section className="space-y-6" aria-label={locale === 'fr' ? 'Filtres des Mandats' : 'Mandates Filtering'}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-border pb-4">
          <div className="space-y-1">
            <div className="editorial-kicker">
              {locale === 'fr'
                ? 'RÉPERTOIRE CHRONOLOGIQUE DES FONCTIONS'
                : 'STATUTORY CHRONOLOGICAL REGISTER'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-navy-900">
              {locale === 'fr'
                ? 'Mandats Statutaires, Conseils d’Administration & Fonctions d’État'
                : 'Statutory Directorships, Multilateral Boards & Sovereign Mandates'}
            </h2>
          </div>

          <div className="text-xs text-ink-500">
            {locale === 'fr'
              ? `${filteredEntries.length} fonctions affichées sur ${entries.length} répertoriées`
              : `Showing ${filteredEntries.length} of ${entries.length} statutory mandates & appointments`}
          </div>
        </div>

        {/* Filter HUD: Category Tabs + Search Input + Status Pills (Hidden on Print) */}
        <div className="space-y-4 bg-surface-light border border-surface-border p-4 sm:p-5 print:hidden">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none overscroll-x-contain"
            role="tablist"
            aria-label={locale === 'fr' ? 'Catégories de mandats' : 'Mandate categories'}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all touch-target-sm rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 ${
                    isSelected
                      ? 'bg-navy-900 text-gold-300 shadow-md'
                      : 'bg-white hover:bg-surface-paper text-ink-700 border border-surface-border'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Search Input & Status Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-surface-border">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="governance-search" className="sr-only">
                {locale === 'fr' ? 'Rechercher un mandat' : 'Search mandates'}
              </label>
              <Search
                className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0"
                aria-hidden="true"
              />
              <input
                id="governance-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  locale === 'fr'
                    ? 'Rechercher une institution, un rôle, un mot-clé (ex: ATIDI, MINFI, COSUMAF, Harvard)...'
                    : 'Search organization, title, or keyword (e.g. ATIDI, MINFI, COSUMAF, Harvard)...'
                }
                className="w-full pl-9 pr-4 py-2 bg-white border border-surface-border text-xs text-navy-900 placeholder-ink-400 focus:outline-none focus:ring-1 focus:ring-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={locale === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-navy-900 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div
              className="flex items-center gap-1.5 shrink-0 text-xs"
              role="group"
              aria-label={locale === 'fr' ? 'Filtrer par statut' : 'Filter by status'}
            >
              <span className="text-ink-500 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{locale === 'fr' ? 'Statut :' : 'Status:'}</span>
              </span>
              <button
                type="button"
                aria-pressed={statusFilter === 'all'}
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 ${
                  statusFilter === 'all'
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'bg-white text-ink-600 hover:text-navy-900 border border-surface-border'
                }`}
              >
                {locale === 'fr' ? 'Tous' : 'All'}
              </button>
              <button
                type="button"
                aria-pressed={statusFilter === 'current'}
                onClick={() => setStatusFilter('current')}
                className={`px-2.5 py-1 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  statusFilter === 'current'
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'bg-white text-ink-600 hover:text-navy-900 border border-surface-border'
                }`}
              >
                {locale === 'fr' ? 'En fonction' : 'Active Only'}
              </button>
              <button
                type="button"
                aria-pressed={statusFilter === 'concluded'}
                onClick={() => setStatusFilter('concluded')}
                className={`px-2.5 py-1 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-700 ${
                  statusFilter === 'concluded'
                    ? 'bg-ink-700 text-white font-semibold'
                    : 'bg-white text-ink-600 hover:text-navy-900 border border-surface-border'
                }`}
              >
                {locale === 'fr' ? 'Antérieurs' : 'Concluded'}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            SECTION 3: ARCHITECTURAL MANDATE CARDS
           ========================================================= */}
        <div className="grid grid-cols-1 gap-6">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center bg-white border border-surface-border space-y-3">
              <p className="text-ink-600 text-sm">
                {locale === 'fr'
                  ? 'Aucun mandat ne correspond à vos critères de recherche.'
                  : 'No mandates match your filter criteria.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-bronze-600 hover:text-navy-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600"
              >
                {locale === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="bg-white border border-surface-border p-6 sm:p-8 shadow-institutional space-y-5 hover:border-gold-500/40 transition-all duration-200 hover:-translate-y-0.5 print:break-inside-avoid print:shadow-none print:border-slate-300"
              >
                {/* Header Row: Category Badge + Title + Period + Active Pill */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-surface-border pb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-navy-900 text-gold-400 shrink-0 mt-0.5 rounded-sm">
                      {entry.category === 'multilateral' ? (
                        <Globe2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                      ) : entry.category === 'sovereign' ? (
                        <Landmark className="w-5 h-5 shrink-0" aria-hidden="true" />
                      ) : entry.category === 'academic' ? (
                        <GraduationCap className="w-5 h-5 shrink-0" aria-hidden="true" />
                      ) : (
                        <Briefcase className="w-5 h-5 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-bronze-600">
                          {formatCategory(entry.category, locale)} · {formatLocation(entry.location, locale)}
                        </span>
                        {entry.is_current ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" aria-hidden="true" />
                            <span>{locale === 'fr' ? 'Mandat Actuel' : 'Active Mandate'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-medium">
                            {locale === 'fr' ? 'Terme Accompli' : 'Concluded Term'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-semibold text-navy-900 mt-1 leading-snug">
                        {t(entry.role_title, locale)}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 shrink-0">
                    <span className="px-3 py-1 bg-surface-paper border border-surface-border text-navy-900 text-xs font-semibold">
                      {formatPeriod(entry.period, locale)}
                    </span>
                    {entry.tenure_note && (
                      <span className="text-[11px] text-ink-500 font-mono">
                        {entry.tenure_note}
                      </span>
                    )}
                  </div>
                </div>

                {/* Organization Subtitle */}
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-800">
                  <Building2 className="w-4 h-4 text-bronze-600 shrink-0" aria-hidden="true" />
                  <span>{t(entry.organization, locale)}</span>
                </div>

                {/* Executive Mandate Description */}
                <p className="text-ink-700 leading-relaxed text-sm sm:text-base font-sans">
                  {t(entry.description, locale)}
                </p>

                {/* Highlights / Responsibilities Box */}
                {entry.highlights && entry.highlights.length > 0 && (
                  <div className="bg-surface-light p-4 sm:p-5 border border-surface-border space-y-2.5 rounded-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] text-navy-900">
                      {locale === 'fr'
                        ? 'Axes Stratégiques & Périmètre du Mandat'
                        : 'Key Governance Deliverables & Mandate Scope'}
                    </div>
                    <ul className="space-y-2">
                      {entry.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-700">
                          <CheckCircle2 className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{t(hl, locale)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Verification Footer Pill */}
                <div className="pt-2 flex items-center justify-between text-xs text-ink-500 border-t border-surface-border">
                  <div className="inline-flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-bronze-600 shrink-0" aria-hidden="true" />
                    {entry.evidence_url ? (
                      <a
                        href={entry.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bronze-600 hover:text-navy-900 underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
                        aria-label={`${t(entry.verification_note, locale)} (${locale === 'fr' ? 'registre officiel, ouvre un nouvel onglet' : 'official registry, opens in a new tab'})`}
                      >
                        <span>{t(entry.verification_note, locale)}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                      </a>
                    ) : (
                      <span>{t(entry.verification_note, locale)}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-ink-400 uppercase tracking-wider font-mono">
                    {entry.official_reference ? entry.official_reference : `ID: ${entry.id.toUpperCase()}`}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: ACADEMIC FORMATION & DOCTORAL DEGREES
         ========================================================= */}
      <section
        className="bg-white border border-surface-border p-6 sm:p-10 shadow-institutional space-y-8 print:break-inside-avoid print:shadow-none print:border-slate-300"
        aria-label={locale === 'fr' ? 'Formation Académique & Diplômes' : 'Academic Credentials & Doctoral Research'}
      >
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr'
              ? 'CURSUS ACADÉMIQUE DE HAUT NIVEAU'
              : 'ACADEMIC FORMATION & DOCTORAL RESEARCH'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-navy-900">
            {locale === 'fr'
              ? 'Titres Universitaires, Doctorats & Diplômes Exécutifs'
              : 'Doctoral Degrees, Postgraduate Formation & Academic Chairs'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Parcours académique d’excellence incluant Harvard University, Charisma University, York St John et l’EIMT.'
              : 'Distinguished graduate and doctoral scholarship encompassing Harvard University, Charisma University, York St John, and EIMT.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((edu) => (
            <div
              key={edu.id}
              className="bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-gold-500/50 transition-colors rounded-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-navy-900 text-gold-300 font-semibold uppercase tracking-wider text-[11px] rounded-sm">
                    <GraduationCap className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                    <span>{t(edu.degree, locale)}</span>
                  </span>
                  {edu.year && <span className="text-ink-500 font-mono text-xs">{edu.year}</span>}
                </div>

                <h3 className="text-base font-serif font-bold text-navy-900 leading-snug">
                  {t(edu.field, locale)}
                </h3>

                <div className="text-xs font-semibold text-bronze-600">
                  {t(edu.institution, locale)}
                </div>

                <p className="text-xs text-ink-700 leading-relaxed pt-1 font-sans">
                  {t(edu.description, locale)}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border text-[11px] text-ink-400 font-mono">
                REG: {edu.id.toUpperCase()} · {locale === 'fr' ? 'DIPLÔME ENREGISTRÉ' : 'ACADEMIC REGISTRY'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 5: EXECUTIVE CERTIFICATIONS & STATE DISTINCTIONS
         ========================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:break-inside-avoid">
        {/* Certifications (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-surface-border p-6 sm:p-8 shadow-institutional space-y-5 print:shadow-none print:border-slate-300">
          <div className="border-b border-surface-border pb-3 flex items-center justify-between">
            <div>
              <div className="editorial-kicker">
                {locale === 'fr' ? 'ACCRÉDITATIONS PROFESSIONNELLES' : 'PROFESSIONAL CHARTERS'}
              </div>
              <h3 className="text-xl font-serif font-bold text-navy-900 mt-0.5">
                {locale === 'fr' ? 'Certifications Internationales' : 'Executive Accreditations & Charters'}
              </h3>
            </div>
            <Award className="w-5 h-5 text-bronze-600 shrink-0" aria-hidden="true" />
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px]">
            {profile.certificationsList.map((cert, idx) => (
              <li
                key={idx}
                className="p-3 bg-surface-light border border-surface-border flex items-start gap-2.5 rounded-sm"
              >
                <BadgeCheck className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-medium text-navy-900">{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Honors & Awards (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-surface-border p-6 sm:p-8 shadow-institutional space-y-5 print:shadow-none print:border-slate-300">
          <div className="border-b border-surface-border pb-3 flex items-center justify-between">
            <div>
              <div className="editorial-kicker">
                {locale === 'fr' ? 'DISTINCTIONS OFFICIELLES' : 'STATE & MULTILATERAL HONORS'}
              </div>
              <h3 className="text-xl font-serif font-bold text-navy-900 mt-0.5">
                {locale === 'fr' ? 'Ordres Nationaux & Prix' : 'Honors & Distinctions'}
              </h3>
            </div>
            <Scale className="w-5 h-5 text-gold-500 shrink-0" aria-hidden="true" />
          </div>

          <ul className="space-y-3 text-xs sm:text-[13px]">
            {profile.honorsList.map((honor, idx) => (
              <li
                key={idx}
                className="p-3 bg-surface-light border-l-2 border-gold-500 border-surface-border flex items-start gap-2.5 rounded-sm"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-navy-900">{t(honor, locale)}</div>
                  <div className="text-[11px] text-ink-500">
                    {locale === 'fr' ? 'Registre National & Multilatéral' : 'National & Multilateral Register'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: STATUTORY FIREWALL & ETHICS CHARTER
         ========================================================= */}
      <section
        className="bg-surface-paper border border-surface-border p-6 sm:p-8 space-y-4 print:break-inside-avoid print:bg-white print:border-slate-300"
        aria-label={locale === 'fr' ? 'Charte de Conformité Éthique' : 'Ethics & Non-Affiliation Charter'}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-900">
          <FileText className="w-4 h-4 text-bronze-600 shrink-0" aria-hidden="true" />
          <span>
            {locale === 'fr'
              ? 'Charte de Conformité et Pare-Feu Déontologique'
              : 'Ethics Compliance & Statutory Firewall Statement'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans">
          {locale === 'fr'
            ? 'Conformément aux normes internationales de gouvernance du secteur public, les mandats répertoriés sur ce registre reflètent les nominations statutaires, les traités constitutifs et les décrets officiels. Ce portail constitue un répertoire académique et professionnel indépendant, strictement distinct des canaux de communication officiels du Ministère des Finances de la République du Cameroun, de l’ATIDI, du PNUD ou de la COSUMAF. Aucune communication sur ce site ne saurait engager les institutions précitées.'
            : 'In full accordance with public sector governance principles, the statutory appointments documented in this register reflect official decrees, constitutive multilateral treaties, and regulatory mandates. This portal constitutes an independent academic and institutional portfolio, maintained distinctly from the official state channels of the Ministry of Finance (Cameroon), ATIDI, UNDP, or COSUMAF. Statements herein do not bind the referenced statutory bodies.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold print:hidden">
          <Link
            href={`/${locale}/legal/disclaimer`}
            className="text-bronze-600 hover:text-navy-900 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600"
          >
            {locale === 'fr' ? 'Consulter la Charte d’Indépendance' : 'View Independence Charter'}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-navy-900 hover:text-bronze-600 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          >
            {locale === 'fr' ? 'Formuler une Demande Protocolaire' : 'Submit Protocol Request'}
          </Link>
        </div>
      </section>
    </div>
  );
}
