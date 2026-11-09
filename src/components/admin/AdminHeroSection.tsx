'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Languages,
  ShieldCheck,
} from 'lucide-react';
import type { HeroCopyConfig, Locale } from '@/types/domain';

interface AdminHeroSectionProps {
  initialConfig: HeroCopyConfig;
  isSupabaseConfigured: boolean;
}

export function AdminHeroSection({
  initialConfig,
  isSupabaseConfigured,
}: AdminHeroSectionProps) {
  const [config, setConfig] = useState<HeroCopyConfig>(initialConfig);
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleTextChange = (
    field: keyof Omit<HeroCopyConfig, 'ctaPrimaryLink' | 'ctaSecondaryLink' | 'portraitImageUrl' | 'updated_at'>,
    lang: Locale,
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleLinkChange = (
    field: 'ctaPrimaryLink' | 'ctaSecondaryLink' | 'portraitImageUrl',
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save hero copy configuration.');
      }

      setConfig(result.data);
      setFeedback({
        type: 'success',
        message: result.message || 'Hero section copy updated successfully!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset the Hero Section to the official dictionary defaults? Any custom overrides will be removed.'
    );
    if (!confirmed) return;

    setIsResetting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to reset hero configuration.');
      }

      setConfig(result.data);
      setFeedback({
        type: 'success',
        message: 'Hero section reset to factory dictionary defaults.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white border-l-4 border-gold-500 p-6 sm:p-8 shadow-institutional flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="editorial-kicker-dark flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>EXECUTIVE HERO & EDITORIAL BRANDING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Homepage Hero Copy & Institutional Positioning
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage the prominent lead messaging, statutory titles, and call-to-action pathways displayed on the homepage across English and French locales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting || isSaving}
            className="px-3.5 py-2 bg-navy-900 border border-white/20 hover:border-red-400/50 text-slate-300 hover:text-red-300 text-xs font-mono font-semibold rounded-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Reset to dictionary factory defaults"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isResetting}
            className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-mono font-bold uppercase tracking-wider rounded-sm shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-4 border text-xs sm:text-sm font-sans flex items-start gap-3 shadow-sm rounded-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-semibold">{feedback.type === 'success' ? 'Published' : 'Submission Error'}</div>
            <div>{feedback.message}</div>
          </div>
        </div>
      )}

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form (7/12) */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-surface-border p-6 shadow-institutional space-y-6">
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-gold-600" />
              <span className="font-serif font-bold text-base text-navy-900">
                Editorial Localizations
              </span>
            </div>
            <div className="inline-flex p-0.5 bg-slate-100 border border-surface-border rounded-sm">
              <button
                type="button"
                onClick={() => setActiveLang('en')}
                className={`px-3 py-1 text-xs font-mono font-semibold transition-colors rounded-xs ${
                  activeLang === 'en'
                    ? 'bg-navy-950 text-gold-400 shadow-xs'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('fr')}
                className={`px-3 py-1 text-xs font-mono font-semibold transition-colors rounded-xs ${
                  activeLang === 'fr'
                    ? 'bg-navy-950 text-gold-400 shadow-xs'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                Français (FR)
              </button>
            </div>
          </div>

          {/* Eyebrow / Kicker */}
          <div className="space-y-1.5">
            <label
              htmlFor="hero-eyebrow"
              className="block text-xs font-mono font-semibold uppercase text-ink-700 tracking-wider"
            >
              Category Eyebrow / Kicker ({activeLang.toUpperCase()})
            </label>
            <input
              id="hero-eyebrow"
              type="text"
              value={config.eyebrow[activeLang]}
              onChange={(e) => handleTextChange('eyebrow', activeLang, e.target.value)}
              className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 font-mono text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              placeholder="e.g. SOVEREIGN FINANCE · GOVERNANCE · DEVELOPMENT"
              required
            />
          </div>

          {/* Main Headline */}
          <div className="space-y-1.5">
            <label
              htmlFor="hero-headline"
              className="block text-xs font-mono font-semibold uppercase text-ink-700 tracking-wider"
            >
              Main Display Headline ({activeLang.toUpperCase()})
            </label>
            <textarea
              id="hero-headline"
              rows={2}
              value={config.headline[activeLang]}
              onChange={(e) => handleTextChange('headline', activeLang, e.target.value)}
              className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 font-serif font-bold text-base text-navy-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 leading-snug"
              placeholder="Primary headline..."
              required
            />
          </div>

          {/* Subheadline / Executive Lead */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="hero-subheadline"
                className="block text-xs font-mono font-semibold uppercase text-ink-700 tracking-wider"
              >
                Subheadline / Executive Lead ({activeLang.toUpperCase()})
              </label>
              <span className="text-[11px] font-mono text-ink-400">
                {config.subheadline[activeLang].length} chars
              </span>
            </div>
            <textarea
              id="hero-subheadline"
              rows={4}
              value={config.subheadline[activeLang]}
              onChange={(e) => handleTextChange('subheadline', activeLang, e.target.value)}
              className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 text-xs sm:text-sm text-ink-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              placeholder="Comprehensive executive bio lead..."
              required
            />
            <p className="text-[11px] text-ink-500">
              Note: Key institutional acronyms (ATIDI, UNDP-EU, BEAC-CPC-TP, COSUMAF) automatically display interactive tooltip definitions on hover.
            </p>
          </div>

          {/* Primary & Secondary Call To Actions */}
          <div className="pt-2 border-t border-surface-border space-y-4">
            <div className="font-mono text-xs uppercase font-bold text-navy-900 tracking-wider">
              Call-To-Action Pathways
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="hero-cta-primary"
                  className="block text-xs font-mono text-ink-600 font-semibold"
                >
                  Primary CTA Label ({activeLang.toUpperCase()})
                </label>
                <input
                  id="hero-cta-primary"
                  type="text"
                  value={config.ctaPrimary[activeLang]}
                  onChange={(e) => handleTextChange('ctaPrimary', activeLang, e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="hero-cta-primary-link"
                  className="block text-xs font-mono text-ink-600 font-semibold"
                >
                  Primary CTA Route / URL
                </label>
                <input
                  id="hero-cta-primary-link"
                  type="text"
                  value={config.ctaPrimaryLink || '/books'}
                  onChange={(e) => handleLinkChange('ctaPrimaryLink', e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 font-mono text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="hero-cta-secondary"
                  className="block text-xs font-mono text-ink-600 font-semibold"
                >
                  Secondary CTA Label ({activeLang.toUpperCase()})
                </label>
                <input
                  id="hero-cta-secondary"
                  type="text"
                  value={config.ctaSecondary[activeLang]}
                  onChange={(e) => handleTextChange('ctaSecondary', activeLang, e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="hero-cta-secondary-link"
                  className="block text-xs font-mono text-ink-600 font-semibold"
                >
                  Secondary CTA Route / URL
                </label>
                <input
                  id="hero-cta-secondary-link"
                  type="text"
                  value={config.ctaSecondaryLink || '/about'}
                  onChange={(e) => handleLinkChange('ctaSecondaryLink', e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border bg-slate-50/50 font-mono text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Three Institutional Roles */}
          <div className="pt-2 border-t border-surface-border space-y-3">
            <div className="font-mono text-xs uppercase font-bold text-navy-900 tracking-wider">
              Three Institutional Mandate Roles
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label htmlFor="hero-role-1" className="block text-[11px] font-mono text-ink-600">
                  Role 1 ({activeLang.toUpperCase()})
                </label>
                <input
                  id="hero-role-1"
                  type="text"
                  value={config.role1[activeLang]}
                  onChange={(e) => handleTextChange('role1', activeLang, e.target.value)}
                  className="w-full px-3 py-1.5 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="hero-role-2" className="block text-[11px] font-mono text-ink-600">
                  Role 2 ({activeLang.toUpperCase()})
                </label>
                <input
                  id="hero-role-2"
                  type="text"
                  value={config.role2[activeLang]}
                  onChange={(e) => handleTextChange('role2', activeLang, e.target.value)}
                  className="w-full px-3 py-1.5 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="hero-role-3" className="block text-[11px] font-mono text-ink-600">
                  Role 3 ({activeLang.toUpperCase()})
                </label>
                <input
                  id="hero-role-3"
                  type="text"
                  value={config.role3[activeLang]}
                  onChange={(e) => handleTextChange('role3', activeLang, e.target.value)}
                  className="w-full px-3 py-1.5 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Statutory Independence Notice & Caption */}
          <div className="pt-2 border-t border-surface-border space-y-3">
            <div className="font-mono text-xs uppercase font-bold text-navy-900 tracking-wider">
              Statutory Independence & Portrait Plaque
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label htmlFor="hero-independence-text" className="block text-[11px] font-mono text-ink-600">
                  Independence Notice Text ({activeLang.toUpperCase()})
                </label>
                <textarea
                  id="hero-independence-text"
                  rows={2}
                  value={config.independenceText[activeLang]}
                  onChange={(e) => handleTextChange('independenceText', activeLang, e.target.value)}
                  className="w-full px-3 py-1.5 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="hero-caption" className="block text-[11px] font-mono text-ink-600">
                    Portrait Honorific Caption ({activeLang.toUpperCase()})
                  </label>
                  <input
                    id="hero-caption"
                    type="text"
                    value={config.caption[activeLang]}
                    onChange={(e) => handleTextChange('caption', activeLang, e.target.value)}
                    className="w-full px-3 py-1.5 border border-surface-border bg-slate-50/50 text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="hero-portrait-url" className="block text-[11px] font-mono text-ink-600">
                    Portrait Image Asset Path
                  </label>
                  <input
                    id="hero-portrait-url"
                    type="text"
                    value={config.portraitImageUrl || '/images/portrait.jpeg'}
                    onChange={(e) => handleLinkChange('portraitImageUrl', e.target.value)}
                    className="w-full px-3 py-1.5 border border-surface-border bg-slate-50/50 font-mono text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-surface-border">
            <span className="text-[11px] font-mono text-ink-500">
              Storage: {isSupabaseConfigured ? 'Cloud PostgreSQL + Local Failover' : 'Atomic Local Store'}
            </span>
            <button
              type="submit"
              disabled={isSaving || isResetting}
              className="px-5 py-2 bg-navy-900 hover:bg-navy-950 text-gold-400 text-xs font-mono font-bold uppercase tracking-wider rounded-sm shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-pulse' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Changes'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Panel (5/12) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="bg-navy-900 border border-gold-500/30 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-400">
                Live Hero Section Preview
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-navy-950 border border-gold-500/40 text-gold-300">
              {activeLang.toUpperCase()}
            </span>
          </div>

          {/* Rendered Hero Card Simulator */}
          <div className="bg-navy-950 border border-gold-500/20 p-6 text-white space-y-5 shadow-2xl relative overflow-hidden">
            {/* Background Texture */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#D4AF37 1px, #07131B 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            <div className="relative space-y-4">
              {/* Eyebrow */}
              <div className="font-mono text-[10px] tracking-widest text-gold-400/90 font-bold uppercase">
                {config.eyebrow[activeLang] || 'CATEGORY EYEBROW'}
              </div>

              {/* Headline */}
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                {config.headline[activeLang] || 'Hero Section Headline'}
              </h1>

              {/* Subheadline */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                {config.subheadline[activeLang] || 'Executive lead paragraph describing credentials and mandates...'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1.5 bg-gold-500 text-navy-950 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <span>{config.ctaPrimary[activeLang]}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="px-3 py-1.5 bg-transparent text-white border border-white/30 text-xs font-medium">
                  {config.ctaSecondary[activeLang]}
                </span>
              </div>

              {/* Three Roles */}
              <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                  <span className="truncate">{config.role1[activeLang]}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                  <span className="truncate">{config.role2[activeLang]}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                  <span className="truncate">{config.role3[activeLang]}</span>
                </div>
              </div>

              {/* Portrait Preview Mini Plaque */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gold-400/40 bg-navy-900 flex items-center justify-center font-serif text-xs text-gold-400 shrink-0 font-bold">
                  KMK
                </div>
                <div className="min-w-0 text-[11px]">
                  <div className="font-semibold text-white truncate">Prof. Kelly Mua Kingsly</div>
                  <div className="text-gold-400 font-mono text-[10px] truncate">{config.caption[activeLang]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface-paper border border-surface-border text-xs text-ink-600 space-y-1">
            <div className="font-mono font-bold text-navy-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Production Verification</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Edits made here are validated server-side, sanitized to prevent XSS injection, and stored atomically with zero page rebuild requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
