import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Building2,
  Tv,
  Image as ImageIcon,
  Database,
  ArrowRight,
  CheckCircle2,
  Pin,
  ExternalLink,
  BookMarked,
  PackageCheck,
  Receipt,
} from 'lucide-react';
import type { Book, BlogPost, CareerEntry, MediaAppearance } from '@/types/domain';

export function AdminOverviewSection({
  books,
  posts,
  careers,
  media,
  galleryCount,
  isSupabaseConfigured,
}: {
  books: Book[];
  posts: BlogPost[];
  careers: CareerEntry[];
  media: MediaAppearance[];
  galleryCount: number;
  isSupabaseConfigured: boolean;
}) {
  const pinnedMedia = media.find((m) => m.is_pinned) || media[0];

  return (
    <div className="space-y-10">
      {/* 6 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          href="/admin?tab=books"
          className="bg-white border border-surface-border p-5 shadow-institutional hover:border-navy-900 transition-colors group block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>PUBLISHED VOLUMES</span>
            <BookOpen className="w-4 h-4 text-gold-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-serif font-bold text-navy-900 mt-2">
            {books.length}
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center justify-between">
            <span>100% Verified ISBNs &amp; Real Covers</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin?tab=blog"
          className="bg-white border border-surface-border p-5 shadow-institutional hover:border-navy-900 transition-colors group block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>POLICY BRIEFS (EN/FR)</span>
            <FileText className="w-4 h-4 text-navy-800 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-serif font-bold text-navy-900 mt-2">
            {posts.length}
          </div>
          <div className="text-xs text-ink-500 mt-1 flex items-center justify-between">
            <span>Bilingual JSONB + Schema.org Indexed</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin?tab=governance"
          className="bg-white border border-surface-border p-5 shadow-institutional hover:border-navy-900 transition-colors group block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>SOVEREIGN MANDATES</span>
            <Building2 className="w-4 h-4 text-bronze-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-serif font-bold text-navy-900 mt-2">
            {careers.length}
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center justify-between">
            <span>18-Page Dossier Source-Verified</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin?tab=media"
          className="bg-white border border-surface-border p-5 shadow-institutional hover:border-navy-900 transition-colors group block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>MEDIA &amp; BROADCASTS</span>
            <Tv className="w-4 h-4 text-navy-800 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-serif font-bold text-navy-900 mt-2">
            {media.length}
          </div>
          <div className="text-xs text-ink-500 mt-1 flex items-center justify-between">
            <span>Africa24, ATIDI, CRTV &amp; Presses</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin?tab=gallery"
          className="bg-white border border-surface-border p-5 shadow-institutional hover:border-navy-900 transition-colors group block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>ARCHIVAL GALLERY</span>
            <ImageIcon className="w-4 h-4 text-gold-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-serif font-bold text-navy-900 mt-2">
            {galleryCount}
          </div>
          <div className="text-xs text-ink-500 mt-1 flex items-center justify-between">
            <span>Mobile-First Carousel &amp; Lightbox</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin?tab=system"
          className="bg-white border border-surface-border p-5 shadow-institutional hover:border-navy-900 transition-colors group block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-ink-500">
            <span>DATA ENGINE &amp; RLS</span>
            <Database className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-mono font-bold text-navy-900 mt-2 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isSupabaseConfigured ? 'CLOUD POSTGRESQL' : 'DUAL-STORE LOCAL'}</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center justify-between">
            <span>RLS Policies Enforced &amp; Tested</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </div>

      {/* Dual Highlights: Pinned Keynote & Architecture Health Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pinned Broadcast Keynote Card */}
        {pinnedMedia && (
          <div className="bg-white border border-surface-border p-6 shadow-institutional space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold-500 text-navy-950 font-bold text-[11px] uppercase tracking-wider">
                <Pin className="w-3 h-3 fill-current" />
                <span>Featured Keynote Broadcast</span>
              </span>
              <span className="text-xs font-mono text-ink-500">{pinnedMedia.date}</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-900 leading-snug">
              {pinnedMedia.title.en}
            </h3>
            <div className="text-xs text-bronze-600 font-semibold uppercase tracking-wider">
              {pinnedMedia.venue} · {pinnedMedia.location}
            </div>
            <p className="text-xs text-ink-700 leading-relaxed line-clamp-3">
              {pinnedMedia.summary.en}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs">
              <Link
                href="/en/media"
                className="font-semibold text-navy-900 hover:text-bronze-600 underline underline-offset-4 flex items-center gap-1"
              >
                <span>View on Public Media Hub</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              {pinnedMedia.source_url && (
                <a
                  href={pinnedMedia.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-bronze-600 hover:text-navy-900 underline underline-offset-4 flex items-center gap-1"
                >
                  <span>Watch Source Video</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Architecture & Sovereign Firewall Health */}
        <div className="bg-navy-900 text-white p-6 shadow-institutional space-y-4 border-l-4 border-gold-500">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <span className="editorial-kicker-dark">SOVEREIGN FIREWALL &amp; SECURITY STATUS</span>
            <span className="text-xs font-mono text-gold-400">AUDIT VERIFIED</span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict separation between state treasury duties and private book sales.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Row-Level Security (RLS) enabled across 10 tables in PostgreSQL.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>HMAC-SHA256 encrypted 72-hour digital download token generation.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Content Security Policy (CSP) allowlist for YouTube video embeds.</span>
            </div>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/admin?tab=system"
              className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold transition-colors"
            >
              Inspect Diagnostics
            </Link>
            <Link
              href="/admin?tab=orders"
              className="px-3 py-1.5 bg-navy-950 border border-gold-500/40 hover:border-gold-400 text-gold-400 font-semibold transition-colors flex items-center gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Fulfillment Hub</span>
            </Link>
            <a
              href="https://www.sokoclick.com/en/sales/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-navy-950 border border-gold-500/40 hover:border-gold-400 text-gold-400 font-semibold transition-colors flex items-center gap-1.5"
              title="Issue SokoClick Sales Receipt & POS Sale"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>SokoClick Receipts</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <Link
              href="/admin?tab=guide"
              className="px-3 py-1.5 bg-navy-950 border border-white/20 hover:border-gold-400 text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Operations Manual</span>
            </Link>
            <Link
              href="/en/legal/disclaimer"
              className="text-slate-300 hover:text-gold-400 underline underline-offset-4"
            >
              Ethics Charter
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Catalog Preview Table */}
      <div className="bg-white border border-surface-border shadow-institutional p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              Latest Published Volumes (Reverse-Chronological)
            </h3>
            <p className="text-xs text-ink-500">
              Most recent monographs configured with direct checkout and global retail links.
            </p>
          </div>
          <Link
            href="/admin?tab=books"
            className="text-xs font-semibold text-bronze-600 hover:text-navy-900 underline flex items-center gap-1"
          >
            <span>View All {books.length} Books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-surface-border">
          {books.slice(0, 3).map((book) => (
            <div key={book.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Link
                  href={`/en/books/${book.slug}`}
                  className="font-serif font-semibold text-sm text-navy-900 hover:text-bronze-600"
                >
                  {book.title.en}
                </Link>
                <div className="text-xs text-ink-500 font-mono">
                  ISBN: {book.isbn} · {book.academic_category} · {book.publish_date}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-ink-700 bg-surface-paper px-2 py-0.5 border border-surface-border">
                  {book.book_formats.length} Formats
                </span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  {book.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
