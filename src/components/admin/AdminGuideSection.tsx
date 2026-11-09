'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookMarked,
  BookOpen,
  FileText,
  Building2,
  Tv,
  Image as ImageIcon,
  Mail,
  ShieldAlert,
  Search,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Terminal,
  Database,
  Key,
  HelpCircle,
  Info,
  Layers,
  Wrench,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import type { ContentStoreHealth } from '@/lib/data/custom-content-store';

interface AdminGuideSectionProps {
  isSupabaseConfigured: boolean;
  storeHealth: ContentStoreHealth;
}

export function AdminGuideSection({
  isSupabaseConfigured,
  storeHealth,
}: AdminGuideSectionProps) {
  const [activeRole, setActiveRole] = useState<'admin' | 'dev'>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Masthead Header */}
      <div className="bg-navy-950 text-white border border-white/10 p-6 sm:p-8 rounded-sm shadow-institutional space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest rounded-sm">
              <BookMarked className="w-3.5 h-3.5" aria-hidden="true" />
              <span>OFFICIAL OPERATIONS MANUAL &amp; MAINTENANCE RUNBOOK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              Admin Studio Operations &amp; User Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Comprehensive handbook for managing public finance treatises, policy briefs, ministerial mandates, media broadcasts, protocol inquiries, and developer incident response.
            </p>
          </div>

          {/* Quick System Badge */}
          <div className="shrink-0 flex items-center gap-3 bg-navy-900/90 border border-white/10 px-4 py-2.5 rounded-sm">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <div className="text-xs">
              <div className="font-semibold text-slate-200">
                {isSupabaseConfigured ? 'Cloud PostgreSQL Synced' : 'Local Atomic Store'}
              </div>
              <div className="text-[11px] text-slate-400">
                {storeHealth.totalActiveOverrides} custom records active
              </div>
            </div>
          </div>
        </div>

        {/* Role Toggle & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Audience Switcher */}
          <div className="inline-flex p-1 bg-navy-900 border border-white/10 rounded-sm">
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-4 py-2 text-xs font-semibold rounded-sm transition-all flex items-center gap-2 ${
                activeRole === 'admin'
                  ? 'bg-gold-500 text-navy-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Administrator &amp; Secretariat Guide</span>
            </button>
            <button
              onClick={() => setActiveRole('dev')}
              className={`px-4 py-2 text-xs font-semibold rounded-sm transition-all flex items-center gap-2 ${
                activeRole === 'dev'
                  ? 'bg-gold-500 text-navy-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Developer Troubleshooting &amp; Runbook</span>
            </button>
          </div>

          {/* Search Filter Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeRole === 'admin'
                  ? 'Search tasks (e.g., book, pricing, inquiry)...'
                  : 'Search runbooks (e.g., SEV1, backup, passkey)...'
              }
              className="w-full pl-9 pr-4 py-2 bg-navy-900 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW A: ADMINISTRATOR & SECRETARIAT MANUAL (NON-TECH)   */}
      {/* ======================================================== */}
      {activeRole === 'admin' && (
        <div className="space-y-8">
          {/* Non-Technical Welcome Card */}
          <div className="bg-sand-50 border border-gold-500/30 p-5 rounded-sm flex items-start gap-4">
            <div className="p-2.5 bg-navy-900 text-gold-400 rounded-sm shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-ink-800">
              <div className="font-serif font-bold text-navy-950 text-base">
                Welcome to the Administrative Secretariat Command Center
              </div>
              <p className="leading-relaxed">
                You do not need to write code or understand servers to manage this website. Every public section—from published book treatises and price tags to policy articles and ministerial appointment records—can be managed with simple forms in this console.
              </p>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: 'books', label: 'Books & Pricing', icon: BookOpen, tab: 'books' },
              { id: 'blog', label: 'Policy Briefs', icon: FileText, tab: 'blog' },
              { id: 'gov', label: 'Mandates', icon: Building2, tab: 'governance' },
              { id: 'media', label: 'TV & Keynotes', icon: Tv, tab: 'media' },
              { id: 'gal', label: 'Photo Gallery', icon: ImageIcon, tab: 'gallery' },
              { id: 'inq', label: 'Inquiries', icon: Mail, tab: 'inquiries' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`/admin?tab=${item.tab}`}
                  className="bg-white border border-surface-border p-3.5 flex flex-col items-center text-center gap-2 hover:border-gold-500 hover:shadow-sm transition-all rounded-sm group"
                >
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-navy-900 group-hover:text-bronze-600 transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Standard Operating Procedures (SOPs) Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-navy-900 border-b border-surface-border pb-3 flex items-center justify-between">
              <span>Standard Operating Procedures (SOPs)</span>
              <span className="text-xs font-sans font-normal text-ink-500">
                Click any procedure to read step-by-step instructions
              </span>
            </h2>

            {/* SOP 01: BOOKS & TREATISES */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 01
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Adding or Updating a Published Book or Treatise
                    </h3>
                    <p className="text-xs text-ink-500">
                      Configure volume titles, dual pricing (USD / FCFA), ISBN, and Amazon retailer links.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=books"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Books Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Launch the Editor Drawer</span>
                  </div>
                  <p className="leading-relaxed">
                    Click the <strong>Books Inventory</strong> tab at the top. To create a new title, click <strong>&quot;+ Add New Treatise&quot;</strong>. To edit an existing title, click the <strong>&quot;Edit Treatise&quot;</strong> button next to it.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Fill in Bilingual Titles &amp; Pricing</span>
                  </div>
                  <p className="leading-relaxed">
                    Provide the title and synopsis in both English and French. Enter the official <strong>ISBN-13</strong>. Set the <strong>Digital Price (USD)</strong> (e.g. <code>45.00</code>) and <strong>Digital Price (XAF)</strong> (e.g. <code>25000</code>).
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Save &amp; Verify on Storefront</span>
                  </div>
                  <p className="leading-relaxed">
                    Select status <strong>Published</strong>. Click <strong>&quot;Save Treatise&quot;</strong>. You can click <strong>&quot;View on Public Store&quot;</strong> to immediately review how the book renders for readers.
                  </p>
                </div>
              </div>

              <div className="bg-sand-50 p-3.5 border-l-2 border-gold-500 text-xs text-ink-700 space-y-2">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Pro-Tip for Book Covers:</strong> Place new high-resolution cover artwork into <code>public/images/books/</code> or use existing covers like <code>/images/books/business-risk-management.jpg</code>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 pt-1 border-t border-surface-border">
                  <Receipt className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Sales Receipts &amp; Warehouse Inventory:</strong> Physical book inventory counts, official VAT sales receipts, and POS bookstore sales are tracked inside{' '}
                    <a
                      href="https://www.sokoclick.com/en/sales/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-navy-900 underline underline-offset-2 hover:text-bronze-600 inline-flex items-center gap-0.5"
                    >
                      <span>SokoClick Sales (New Receipt)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and the{' '}
                    <a
                      href="https://www.sokoclick.com/en/dashboard?mode=BUSINESS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-navy-900 underline underline-offset-2 hover:text-bronze-600 inline-flex items-center gap-0.5"
                    >
                      <span>SokoClick Business Inventory Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>.
                  </p>
                </div>
              </div>
            </div>

            {/* SOP 02: POLICY BRIEFS */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 02
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Publishing Policy Briefs &amp; Working Papers
                    </h3>
                    <p className="text-xs text-ink-500">
                      Author macroeconomic briefs, assign reading times, tags, and international DOI citations.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=blog"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Briefs Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Compose Executive Summary</span>
                  </div>
                  <p className="leading-relaxed">
                    Click <strong>&quot;Publish Policy Brief&quot;</strong>. Enter English and French executive abstracts summarizing the policy problem, methodology, and recommendations.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Assign Citable Metadata</span>
                  </div>
                  <p className="leading-relaxed">
                    Enter the estimated read time (e.g. <code>8</code> minutes). Optionally paste an academic <strong>DOI string</strong> (e.g. <code>10.2139/ssrn.4128901</code>) and topic tags separated by commas.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Set Publication Status</span>
                  </div>
                  <p className="leading-relaxed">
                    Choose <strong>Draft</strong> if still undergoing peer review, or <strong>Published</strong> to immediately display the brief in both English (<code>/en/blog</code>) and French (<code>/fr/blog</code>).
                  </p>
                </div>
              </div>
            </div>

            {/* SOP 03: SOVEREIGN MANDATES */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 03
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Registering Sovereign Mandates &amp; State Appointments
                    </h3>
                    <p className="text-xs text-ink-500">
                      Document official government decrees, multilateral board appointments (ATIDI, BEAC, MINFI), and academic chairs.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=governance"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Mandates Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Select Institution Type</span>
                  </div>
                  <p className="leading-relaxed">
                    Click <strong>&quot;Register Mandate&quot;</strong>. Choose between <strong>Sovereign Statecraft</strong>, <strong>Multilateral Board</strong>, <strong>Central Bank</strong>, or <strong>Academic Chair</strong>.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Enter Decree &amp; Dates</span>
                  </div>
                  <p className="leading-relaxed">
                    Specify the official French and English title (e.g. <em>Directeur des Opérations Financières de l’État</em>). Enter the tenure start and end year. Check <strong>&quot;Active Mandate&quot;</strong> if currently ongoing.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Public Timeline Placement</span>
                  </div>
                  <p className="leading-relaxed">
                    The mandate will automatically appear in the interactive timeline on <code>/en/governance</code> and in the official ministerial career registry.
                  </p>
                </div>
              </div>
            </div>

            {/* SOP 04: MEDIA & BROADCASTS */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 04
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Adding Television Interviews &amp; Keynote Broadcasts
                    </h3>
                    <p className="text-xs text-ink-500">
                      Embed YouTube videos, link press articles, and pin flagship keynotes to the top of the media page.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=media"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Media Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Extract the YouTube Video ID</span>
                  </div>
                  <p className="leading-relaxed">
                    If adding a video, find the 11-character YouTube ID from the link (e.g. in <code>youtube.com/watch?v=eLPNnUVv2aw</code>, the ID is <code>eLPNnUVv2aw</code>). Paste it into the <strong>YouTube Video ID</strong> field.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Select Media Category</span>
                  </div>
                  <p className="leading-relaxed">
                    Select <strong>Broadcast &amp; Video</strong>, <strong>Press Feature</strong>, or <strong>Institutional Keynote</strong>. Provide the broadcasting channel (e.g. <em>Africa24</em> or <em>CRTV Économie</em>).
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Toggle &quot;Pinned Flagship&quot;</span>
                  </div>
                  <p className="leading-relaxed">
                    If this is a major address (such as the AFSIC London Keynote), check <strong>&quot;Pin to Top of Directory&quot;</strong>. It will be showcased prominently with a gold border at <code>/en/media</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* SOP 05: PHOTO GALLERY */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 05
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Managing Archival Photos &amp; Event Albums
                    </h3>
                    <p className="text-xs text-ink-500">
                      Curate diplomatic summit photos, assign historical seasons, and feature photos on the homepage hero banner.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=gallery"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Gallery Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Set Photo Path &amp; Caption</span>
                  </div>
                  <p className="leading-relaxed">
                    Enter the image location (e.g. <code>/images/photos/photo8.jpeg</code>). Provide an informative caption explaining the bilateral or multilateral engagement.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Categorize by Diplomatic Tier</span>
                  </div>
                  <p className="leading-relaxed">
                    Assign a category such as <strong>Diplomatic</strong>, <strong>Sovereign Governance</strong>, or <strong>Academic Summit</strong>. Specify the host city (e.g. <em>London, United Kingdom</em> or <em>Yaoundé, Cameroon</em>).
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Homepage Spotlight Placement</span>
                  </div>
                  <p className="leading-relaxed">
                    Checking <strong>&quot;Featured Monthly Spotlight&quot;</strong> ensures this image is dynamically highlighted in the homepage visual assembly grid.
                  </p>
                </div>
              </div>
            </div>

            {/* SOP 06: PROTOCOL INQUIRIES */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 06
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Triaging Protocol Inquiries &amp; State Inquiries
                    </h3>
                    <p className="text-xs text-ink-500">
                      Track inbound speaking invitations, media interviews, and scholarly research inquiries through status workflows.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=inquiries"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Inquiries Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Inspect Inbound Message</span>
                  </div>
                  <p className="leading-relaxed">
                    Under <strong>Protocol Inquiries</strong>, new messages arrive marked as <code>received</code>. Click any inquiry to inspect sender details, organization, and country of origin.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Update Triage Status</span>
                  </div>
                  <p className="leading-relaxed">
                    Advance the lifecycle: <strong>Under Review</strong> when discussing with the secretariat, <strong>Responded</strong> once an official reply is dispatched, or <strong>Archived</strong> when concluded.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Add Internal Dossier Notes</span>
                  </div>
                  <p className="leading-relaxed">
                    Use the <strong>Internal Secretariat Notes</strong> field inside the drawer to record protocol decisions (e.g. <em>&quot;Declined due to conflict with BVMAC board session&quot;</em>). These notes are strictly private.
                  </p>
                </div>
              </div>
            </div>

            {/* SOP 07: PRINT EDITION ORDERS & LOCAL DELIVERY FULFILLMENT */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                    SOP 07
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-900">
                      Print Orders &amp; Local Courier Delivery Fulfillment (MTN &amp; Orange Money)
                    </h3>
                    <p className="text-xs text-ink-500">
                      Verify local Mobile Money payments, coordinate physical dispatch of Trade Paperbacks, and track delivery handovers.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=orders"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 shrink-0"
                >
                  <span>Open Orders &amp; Deliveries Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-700">
                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Verify Mobile Money Receipt</span>
                  </div>
                  <p className="leading-relaxed">
                    Under <strong>Orders &amp; Deliveries</strong>, open incoming orders. Check the customer&apos;s submitted Transaction ID against SMS receipts received on the secretariat merchant lines: <strong>MTN MoMo (+237 677 22 44 66)</strong> or <strong>Orange Money (+237 699 22 44 66)</strong>.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Dispatch Courier &amp; Log Tracking</span>
                  </div>
                  <p className="leading-relaxed">
                    Click <strong>Verify</strong> to confirm funds, package the physical trade paperback copy, and hand it to the city courier (Yaoundé / Douala or regional transit). Record the courier waybill receipt number in the <strong>Logistics Notes</strong> field and click <strong>Dispatch</strong>.
                  </p>
                </div>

                <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm">
                  <div className="font-semibold text-navy-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Confirm Delivery Handover</span>
                  </div>
                  <p className="leading-relaxed">
                    Once the recipient or executive reception confirms physical delivery, advance status to <strong>Delivered</strong>. This closes the fulfillment cycle and tallies the order towards verified local revenue.
                  </p>
                </div>
              </div>

              <div className="bg-sand-50 p-3.5 border-l-2 border-gold-500 text-xs text-ink-700 flex items-start gap-2.5">
                <Receipt className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <p>
                  <strong>SokoClick Sales Receipt &amp; Inventory Sync:</strong> When completing an order or confirming payment, record the sale in{' '}
                  <a
                    href="https://www.sokoclick.com/en/sales/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-navy-900 underline underline-offset-2 hover:text-bronze-600 inline-flex items-center gap-0.5"
                  >
                    <span>SokoClick Sales (New Receipt)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  to generate the official fiscal sales receipt for the buyer and synchronize stock deduction in{' '}
                  <a
                    href="https://www.sokoclick.com/en/dashboard?mode=BUSINESS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-navy-900 underline underline-offset-2 hover:text-bronze-600 inline-flex items-center gap-0.5"
                  >
                    <span>SokoClick Business Inventory Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>.
                </p>
              </div>
            </div>

            {/* SOP 08: SIGN-OUT & SECURITY */}
            <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-surface-border pb-3">
                <div className="p-2 bg-navy-900 text-gold-400 rounded-sm font-mono text-xs font-bold">
                  SOP 08
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-900">
                    Signing Out &amp; Browser Security Hygiene
                  </h3>
                  <p className="text-xs text-ink-500">
                    Always lock your session when stepping away from public or shared ministerial computers.
                  </p>
                </div>
              </div>
              <div className="text-xs text-ink-700 leading-relaxed space-y-2">
                <p>
                  To prevent unauthorized changes, always click the red <strong>&quot;Lock / Sign Out&quot;</strong> button in the top right corner of the screen when your work session is finished.
                </p>
                <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Never share the administrative passkey:</strong> Official updates must only be performed by authorized members of Professor Kingsly’s executive cabinet and academic editorial staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: DEVELOPER GUIDE, TROUBLESHOOTING & RUNBOOK      */}
      {/* ======================================================== */}
      {activeRole === 'dev' && (
        <div className="space-y-8">
          {/* Architecture Summary Card */}
          <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif font-bold text-lg text-navy-900">
                  System Architecture &amp; Dual-Store Topology
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-navy-900 text-gold-400 rounded-sm">
                Next.js App Router + Supabase RLS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              The platform implements a resilient <strong>Dual-Layer Persistence Pattern</strong>. Mutations submitted through the Admin Studio first attempt persistence to Supabase Cloud PostgreSQL via the Service Role client. If Supabase is unconfigured or unreachable, mutations automatically serialize to an atomic local file store (<code>.data/content-overrides.json</code>) without interrupting the public site.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm text-xs">
                <div className="font-semibold text-navy-950 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Primary Cloud Layer (Supabase PostgreSQL)</span>
                </div>
                <p className="text-ink-600">
                  Secured by PostgreSQL Row-Level Security (RLS). Public client reads are restricted or read-only; administrative mutations use <code>SUPABASE_SERVICE_ROLE_KEY</code> from isolated server routes.
                </p>
              </div>

              <div className="p-4 bg-sand-50/70 border border-surface-border space-y-2 rounded-sm text-xs">
                <div className="font-semibold text-navy-950 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-navy-900" />
                  <span>Atomic Fallback Store (.data/content-overrides.json)</span>
                </div>
                <p className="text-ink-600">
                  Writes stage to a unique temporary file (<code>.tmp</code>) and execute an atomic <code>fs.renameSync()</code> to prevent partial-write corruptions under process termination.
                </p>
              </div>
            </div>
          </div>

          {/* Environment Variables & Secrets Reference */}
          <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif font-bold text-lg text-navy-900">
                  Environment Variables Matrix (.env.local)
                </h2>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `# Core Production Configuration\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\nADMIN_PASSKEY=sovereign-master-passkey-2026\nDOWNLOAD_TOKEN_SECRET=hmac-sha256-cryptographic-secret\n\n# Supabase Cloud Database\nNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...\nSUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...\n\n# Stripe E-Commerce\nSTRIPE_SECRET_KEY=sk_live_...\nSTRIPE_WEBHOOK_SECRET=whsec_...\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`,
                    'env-snippet'
                  )
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-mono rounded-sm transition-colors"
              >
                {copiedIndex === 'env-snippet' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Template</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy .env.local Template</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-surface-border">
                <thead className="bg-navy-900 text-gold-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5">Key Name</th>
                    <th className="p-2.5">Purpose &amp; Security Boundary</th>
                    <th className="p-2.5">Fallback Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-ink-700">
                  <tr>
                    <td className="p-2.5 font-mono font-semibold text-navy-950">ADMIN_PASSKEY</td>
                    <td className="p-2.5">Master passkey for authenticating to <code>/admin/login</code>.</td>
                    <td className="p-2.5 font-mono text-ink-500">kmk-governance-2026!</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-semibold text-navy-950">DOWNLOAD_TOKEN_SECRET</td>
                    <td className="p-2.5">HMAC-SHA256 signing secret for session cookies &amp; 72-hr book download links.</td>
                    <td className="p-2.5 font-mono text-ink-500">kmk-hmac-secret-vault-2026</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-semibold text-navy-950">SUPABASE_SERVICE_ROLE_KEY</td>
                    <td className="p-2.5">Server-only key for bypassing RLS during admin editorial mutations.</td>
                    <td className="p-2.5 font-mono text-ink-500">None (switches to local store)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-semibold text-navy-950">STRIPE_SECRET_KEY</td>
                    <td className="p-2.5">Stripe checkout session creation and order fulfillment.</td>
                    <td className="p-2.5 font-mono text-ink-500">None (simulated checkout)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Backup, Restore & Reset Runbook */}
          <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-border pb-3">
              <Terminal className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif font-bold text-lg text-navy-900">
                Backup, Restore &amp; Store Reset Commands
              </h2>
            </div>

            <div className="space-y-4 text-xs text-ink-800">
              <div className="space-y-1.5">
                <div className="font-semibold text-navy-950">
                  1. Hot Backup of Local Content Overrides
                </div>
                <div className="flex items-center justify-between bg-navy-950 text-gold-300 p-2.5 font-mono rounded-sm">
                  <code>cp .data/content-overrides.json .data/content-overrides.backup.json</code>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'cp .data/content-overrides.json .data/content-overrides.backup.json',
                        'cmd-backup'
                      )
                    }
                    className="p-1 hover:text-white"
                  >
                    {copiedIndex === 'cmd-backup' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-navy-950">
                  2. Full Reset of Local Store (Restores Pure Seed Data State)
                </div>
                <div className="flex items-center justify-between bg-navy-950 text-gold-300 p-2.5 font-mono rounded-sm">
                  <code>echo &#39;{`{"books":[],"blog":[],"governance":[],"media":[],"gallery":[],"inquiries":[],"deletedIds":{"books":[],"blog":[],"governance":[],"media":[],"gallery":[],"inquiries":[]}}`}&#39; &gt; .data/content-overrides.json</code>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `echo '{"books":[],"blog":[],"governance":[],"media":[],"gallery":[],"inquiries":[],"deletedIds":{"books":[],"blog":[],"governance":[],"media":[],"gallery":[],"inquiries":[]}}' > .data/content-overrides.json`,
                        'cmd-reset'
                      )
                    }
                    className="p-1 hover:text-white"
                  >
                    {copiedIndex === 'cmd-reset' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-navy-950">
                  3. Run Automated Vitest Test Harness &amp; TypeScript Checks
                </div>
                <div className="flex items-center justify-between bg-navy-950 text-gold-300 p-2.5 font-mono rounded-sm">
                  <code>npm run typecheck &amp;&amp; npm run test</code>
                  <button
                    onClick={() =>
                      copyToClipboard('npm run typecheck && npm run test', 'cmd-test')
                    }
                    className="p-1 hover:text-white"
                  >
                    {copiedIndex === 'cmd-test' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response & SEV1-SEV4 Triage Matrix */}
          <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h2 className="font-serif font-bold text-lg text-navy-900">
                  Incident Response Triage Matrix (NIST SP 800-61 / SEV1–SEV4)
                </h2>
              </div>
              <span className="text-xs font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded-sm">
                Production SLA Playbook
              </span>
            </div>

            <p className="text-xs text-ink-700 leading-relaxed">
              When investigating production anomalies or performance degradations, follow this classification matrix to determine triage urgency, escalation channels, and target resolution time (MTTR):
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-surface-border">
                <thead className="bg-navy-900 text-gold-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5">Level</th>
                    <th className="p-2.5">Criteria &amp; Scope</th>
                    <th className="p-2.5">Immediate Containment Action</th>
                    <th className="p-2.5">Target MTTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-ink-700">
                  <tr className="bg-red-50/50">
                    <td className="p-2.5 font-bold text-red-700 font-mono">SEV1 (Critical)</td>
                    <td className="p-2.5">
                      Full website outage, active passkey breach, database deletion, or Stripe checkout failure blocking all book acquisitions.
                    </td>
                    <td className="p-2.5">
                      Rotate <code>ADMIN_PASSKEY</code> &amp; <code>SUPABASE_SERVICE_ROLE_KEY</code>; revert local store to hot backup; open immediate developer bridge.
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-red-800">&lt; 15 mins</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="p-2.5 font-bold text-amber-700 font-mono">SEV2 (High)</td>
                    <td className="p-2.5">
                      Admin Studio login failure (rate limit lockout), book download URL signature verification failure, or broken contact form submissions.
                    </td>
                    <td className="p-2.5">
                      Restart Node.js process to clear in-memory rate-limit map; verify <code>DOWNLOAD_TOKEN_SECRET</code> in environment.
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-amber-800">&lt; 1 hour</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-blue-700 font-mono">SEV3 (Medium)</td>
                    <td className="p-2.5">
                      Single drawer modal input validation glitch, YouTube video embed aspect ratio error, or localized French translation typo.
                    </td>
                    <td className="p-2.5">
                      Apply hotfix in <code>src/lib/data/validation.ts</code> or update dictionary entry; push through standard CI/CD.
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-blue-800">&lt; 4 hours</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-700 font-mono">SEV4 (Low)</td>
                    <td className="p-2.5">
                      Cosmetic CSS spacing anomaly on mobile viewport, admin telemetry label formatting, or documentation typo.
                    </td>
                    <td className="p-2.5">
                      Queue for standard weekly release sprint; no emergency developer mobilization required.
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-slate-800">&lt; 24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Schema & RLS Quick Checklist */}
          <div className="bg-white border border-surface-border p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-border pb-3">
              <Database className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif font-bold text-lg text-navy-900">
                PostgreSQL Schema Migrations &amp; Seed Scripts
              </h2>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed">
              Cloud database tables and Row-Level Security policies are codified in the repository:
            </p>
            <ul className="list-disc pl-5 text-xs text-ink-700 space-y-1.5 font-mono">
              <li>
                <strong>Initial Schema Migration:</strong> <code>supabase/migrations/0001_initial_schema.sql</code> (defines 10 tables, RLS policies, indexes, and triggers)
              </li>
              <li>
                <strong>Cloud Seed Records:</strong> <code>supabase/seed.sql</code> (populates initial ministerial mandates, 11 books, and sample reviews)
              </li>
              <li>
                <strong>Local Static Fallback:</strong> <code>src/lib/data/seed-data.ts</code> (contains authoritative baseline records used when database is offline)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
