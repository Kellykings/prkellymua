'use client';

import React, { useState, useEffect } from 'react';
import { AdminDrawerModal } from './AdminDrawerModal';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import type { BlogPost } from '@/types/domain';

interface BlogFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
  onSaved: (post: BlogPost) => void;
}

export function BlogFormDrawer({
  isOpen,
  onClose,
  post,
  onSaved,
}: BlogFormDrawerProps) {
  const isEditing = Boolean(post);

  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Sovereign Debt & Public Finance');
  const [publishedAt, setPublishedAt] = useState('2025-01-01');
  const [readMinutes, setReadMinutes] = useState('12');
  const [doi, setDoi] = useState('10.1000/182');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [tagsStr, setTagsStr] = useState('CEMAC, Sovereign Debt, Public Finance');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptFr, setExcerptFr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentFr, setContentFr] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitleEn(post.title.en || '');
      setTitleFr(post.title.fr || '');
      setSlug(post.slug || '');
      setCategory(post.category || 'Sovereign Debt & Public Finance');
      setPublishedAt(post.published_at || new Date().toISOString().slice(0, 10));
      setReadMinutes(String(post.estimated_read_minutes || 12));
      setDoi(post.doi_reference || '');
      setStatus((post.status as 'published' | 'draft') || 'published');
      setTagsStr(post.tags?.join(', ') || '');
      setExcerptEn(post.excerpt?.en || '');
      setExcerptFr(post.excerpt?.fr || '');
      setContentEn(post.content_sections?.[0]?.body?.en || '');
      setContentFr(post.content_sections?.[0]?.body?.fr || '');
    } else {
      setTitleEn('');
      setTitleFr('');
      setSlug('');
      setCategory('Sovereign Debt & Public Finance');
      setPublishedAt(new Date().toISOString().slice(0, 10));
      setReadMinutes('12');
      setDoi('');
      setStatus('published');
      setTagsStr('CEMAC, Sovereign Debt, Public Finance');
      setExcerptEn('');
      setExcerptFr('');
      setContentEn('## Executive Summary\n\nPolicy brief analysis and findings.');
      setContentFr('## Résumé Exécutif\n\nAnalyse des politiques et conclusions.');
    }
    setError(null);
  }, [post, isOpen]);

  function handleAutoSlug(title: string) {
    setTitleEn(title);
    if (!isEditing) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<BlogPost> = {
      id: post?.id || `post-${Date.now()}`,
      slug: slug || `brief-${Date.now()}`,
      title: { en: titleEn.trim(), fr: titleFr.trim() || titleEn.trim() },
      excerpt: { en: excerptEn.trim(), fr: excerptFr.trim() || excerptEn.trim() },
      content_sections: [
        {
          heading: { en: 'Executive Policy Analysis', fr: 'Analyse Politique Exécutive' },
          body: { en: contentEn.trim(), fr: contentFr.trim() || contentEn.trim() },
        },
      ],
      category,
      published_at: publishedAt,
      estimated_read_minutes: parseInt(readMinutes, 10) || 12,
      doi_reference: doi.trim(),
      status,
      tags,
    };

    try {
      const res = await fetch('/api/admin/blog', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Administrative session expired. Please re-enter your passkey.');
        }
        let errMsg = 'Failed to save policy brief.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      onSaved(data.data as BlogPost);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting policy brief');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Policy Brief / Working Paper' : 'Publish New Policy Brief'}
      subtitle="Bilingual policy paper with DOI reference, academic track, and markdown text."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title EN & FR */}
        <div className="space-y-3 p-4 bg-surface-paper border border-surface-border">
          <span className="editorial-kicker">POLICY BRIEF TITLE (BILINGUAL)</span>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Title (English) *
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => handleAutoSlug(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. Sovereign Debt Restructuring in the Post-Pandemic Era"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Title (French) *
            </label>
            <input
              type="text"
              required
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. Restructuration de la Dette Souveraine à l'Ère Post-Pandémique"
            />
          </div>
        </div>

        {/* Slug, Category, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Track / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="Sovereign Debt & Public Finance">Sovereign Debt &amp; Public Finance</option>
              <option value="Capital Markets & CEMAC Banking">Capital Markets &amp; CEMAC Banking</option>
              <option value="Forensic Auditing & Integrity">Forensic Auditing &amp; Integrity</option>
              <option value="ESG & Sustainable Finance">ESG &amp; Sustainable Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Date, Reading Minutes, DOI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Published Date
            </label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Read Minutes
            </label>
            <input
              type="number"
              value={readMinutes}
              onChange={(e) => setReadMinutes(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              DOI Reference
            </label>
            <input
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="10.1000/..."
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>

        {/* Excerpt EN & FR */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Abstract / Excerpt (English) *
          </label>
          <textarea
            rows={2}
            required
            value={excerptEn}
            onChange={(e) => setExcerptEn(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Abstract / Excerpt (French)
          </label>
          <textarea
            rows={2}
            value={excerptFr}
            onChange={(e) => setExcerptFr(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>

        {/* Markdown Content EN & FR */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Full Markdown Body (English)
          </label>
          <textarea
            rows={4}
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Full Markdown Body (French)
          </label>
          <textarea
            rows={4}
            value={contentFr}
            onChange={(e) => setContentFr(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border border-surface-border text-xs font-semibold text-ink-700 hover:bg-surface-paper transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold shadow transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : isEditing ? 'Update Policy Brief' : 'Publish Policy Brief'}</span>
          </button>
        </div>
      </form>
    </AdminDrawerModal>
  );
}
