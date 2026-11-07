'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Layers } from 'lucide-react';
import type { Locale } from '@/types/domain';

interface BookCoverViewerProps {
  coverUrl: string;
  alternateCoverUrl?: string;
  title: string;
  locale: Locale;
}

export function BookCoverViewer({
  coverUrl,
  alternateCoverUrl,
  title,
  locale,
}: BookCoverViewerProps) {
  const [activeImage, setActiveImage] = useState<'primary' | 'alternate'>('primary');

  const isFr = locale === 'fr';
  const currentSrc = activeImage === 'alternate' && alternateCoverUrl ? alternateCoverUrl : coverUrl;

  return (
    <div className="space-y-3">
      {/* Main Cover Frame with Spine Lighting */}
      <div className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-none overflow-hidden shadow-elevated border border-surface-border bg-navy-950 rounded-sm">
        <Image
          src={currentSrc}
          alt={`${title} — ${activeImage === 'alternate' ? (isFr ? 'Vue secondaire' : 'Secondary view') : (isFr ? 'Couverture principale' : 'Primary cover')}`}
          fill
          priority
          sizes="(max-width: 1024px) 448px, 500px"
          className="object-cover transition-opacity duration-300"
          unoptimized
        />
        {/* Subtle realistic 3D book spine gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-white/10 pointer-events-none"
        />

        {/* View Badge */}
        {alternateCoverUrl && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-navy-950/85 backdrop-blur-sm border border-gold-500/40 text-[11px] font-semibold text-gold-300 tracking-wide">
            {activeImage === 'primary'
              ? isFr
                ? 'Couverture A'
                : 'Cover Plate A'
              : isFr
                ? 'Couverture B'
                : 'Cover Plate B'}
          </div>
        )}
      </div>

      {/* Dual Cover Toggle Selector (Rendered when an alternate cover is available) */}
      {alternateCoverUrl && (
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveImage('primary')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none border transition-colors ${
              activeImage === 'primary'
                ? 'bg-navy-900 text-gold-300 border-gold-500/60 shadow-sm'
                : 'bg-white text-ink-700 border-surface-border hover:bg-surface-light'
            }`}
            aria-pressed={activeImage === 'primary'}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>{isFr ? 'Couverture Officielle' : 'Official Cover'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveImage('alternate')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none border transition-colors ${
              activeImage === 'alternate'
                ? 'bg-navy-900 text-gold-300 border-gold-500/60 shadow-sm'
                : 'bg-white text-ink-700 border-surface-border hover:bg-surface-light'
            }`}
            aria-pressed={activeImage === 'alternate'}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>{isFr ? '2e Édition / Vue Détaillée' : '2nd Edition / Detail View'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
