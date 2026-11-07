'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  ExternalLink,
  BookOpen,
  X,
  ChevronRight,
  Award,
} from 'lucide-react';
import type { Locale } from '@/types/domain';

interface BookLaunchAlertRibbonProps {
  locale: Locale;
}

export function BookLaunchAlertRibbon({ locale }: BookLaunchAlertRibbonProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const isFr = locale === 'fr';

  return (
    <aside
      role="region"
      aria-label={
        isFr
          ? 'Annonce Officielle : Lancement du Livre et Conférence-Débat'
          : 'Official Announcement: Book Launch & Conference-Debate'
      }
      className="relative z-20 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border-y border-gold-500/35 shadow-2xl overflow-hidden"
    >
      {/* Background Decorative Guilloche / Subtle Glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left Column: Visual Book Teaser + Core Content */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
            {/* Book Miniature Cover with Diplomatic Frame */}
            <Link
              href={`/${locale}/books/paul-biya-the-art-of-the-credible-signature`}
              className="group relative shrink-0 block w-16 sm:w-20 aspect-[3/4] bg-navy-900 rounded border border-gold-400/40 shadow-elevated overflow-hidden transition-transform hover:scale-105"
              aria-label={isFr ? "Voir l'ouvrage" : 'View book details'}
            >
              <Image
                src="/images/books/the-art-of-a-credible-signature-paul-biya.jpeg"
                alt="The Art of a Credible Signature - Paul Biya cover"
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
            </Link>

            {/* Event Typography and Credentials */}
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Badges / Eyebrow */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold tracking-wide uppercase text-[10px] sm:text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
                  {isFr ? 'Événement Diplomatique Annoncé' : 'Upcoming Sovereign Landmark Event'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-slate-300 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>{isFr ? 'Jeudi 5 Novembre 2026' : 'Thursday, 5 November 2026'}</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-slate-300 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>{isFr ? 'Hôtel Hilton, Yaoundé' : 'Hilton Hotel, Yaoundé'}</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gold-400/15 border border-gold-400/30 text-gold-300 font-semibold font-mono text-[11px] tracking-tight">
                  107$ | 98 Euro | 73 955 FCFA
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-white tracking-tight leading-snug">
                <Link
                  href={`/${locale}/books/paul-biya-the-art-of-the-credible-signature`}
                  className="hover:text-gold-300 transition-colors"
                >
                  {isFr
                    ? 'Paul BIYA : L’Art de la Signature Crédible'
                    : 'Paul BIYA: The Art of the Credible Signature'}
                </Link>
                <span className="text-gold-400 font-sans text-xs sm:text-sm font-normal ml-2">
                  {isFr ? '— Lancement Officiel & Conférence-Débat' : '— Official Launch & Sovereign Debate'}
                </span>
              </h2>

              {/* High Patronage & Institutional Authority */}
              <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1 text-gold-400 font-medium">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  {isFr
                    ? 'Sous le Haut Patronage de M. Louis Paul Motaze, Ministre des Finances'
                    : 'Under the High Patronage of Mr. Louis Paul Motaze, Minister of Finance'}
                </span>
                <span className="text-slate-400 hidden sm:inline">·</span>
                <span className="text-slate-300">
                  {isFr
                    ? 'Traité de 406 pages sur le Capital Confiance Étatique'
                    : 'Landmark 406-Page Treatise on State Trust Capital'}
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Interactive CTAs & Dismiss Button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 justify-start sm:justify-end">
            {/* Primary RSVP CTA */}
            <a
              href="https://forms.gle/KLRjZUB6vjcEtcsbA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 sm:px-5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm tracking-normal shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-gold-400 rounded-none whitespace-nowrap"
            >
              <span>{isFr ? 'Confirmer votre Présence (RSVP)' : 'Confirm Attendance (RSVP)'}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>

            {/* Secondary Book Link */}
            <Link
              href={`/${locale}/books/paul-biya-the-art-of-the-credible-signature`}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-gold-400 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span>{isFr ? 'Découvrir le Livre' : 'Explore Treatise'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-2 text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 shrink-0 ml-auto sm:ml-0"
              aria-label={isFr ? 'Masquer cette annonce' : 'Dismiss announcement'}
              title={isFr ? 'Masquer cette annonce' : 'Dismiss announcement'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
