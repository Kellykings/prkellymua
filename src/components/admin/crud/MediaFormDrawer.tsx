'use client';

import React, { useState, useEffect } from 'react';
import { AdminDrawerModal } from './AdminDrawerModal';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import type { MediaAppearance, MediaAppearanceType } from '@/types/domain';

interface MediaFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaAppearance | null;
  onSaved: (item: MediaAppearance) => void;
}

export function MediaFormDrawer({
  isOpen,
  onClose,
  item,
  onSaved,
}: MediaFormDrawerProps) {
  const isEditing = Boolean(item);

  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [venue, setVenue] = useState('Africa24 Television');
  const [category, setCategory] = useState<'broadcast' | 'press' | 'governance' | 'academic'>('broadcast');
  const [type, setType] = useState<MediaAppearanceType>('Policy Interview');
  const [date, setDate] = useState('2025');
  const [location, setLocation] = useState('Paris, France / International Broadcast');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryFr, setSummaryFr] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitleEn(item.title.en || '');
      setTitleFr(item.title.fr || '');
      setVenue(item.venue || '');
      setCategory(item.category || 'broadcast');
      setType(item.type || 'Policy Interview');
      setDate(item.date || '');
      setLocation(item.location || '');
      setSummaryEn(item.summary?.en || '');
      setSummaryFr(item.summary?.fr || '');
      setSourceUrl(item.source_url || '');
      setYoutubeId(item.video_metadata?.youtube_id || '');
      setIsPinned(Boolean(item.is_pinned));
    } else {
      setTitleEn('');
      setTitleFr('');
      setVenue('Africa24 Television');
      setCategory('broadcast');
      setType('Policy Interview');
      setDate(new Date().getFullYear().toString());
      setLocation('Yaoundé, Cameroon');
      setSummaryEn('');
      setSummaryFr('');
      setSourceUrl('');
      setYoutubeId('');
      setIsPinned(false);
    }
    setError(null);
  }, [item, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Partial<MediaAppearance> = {
      id: item?.id || `media-${Date.now()}`,
      title: { en: titleEn.trim(), fr: titleFr.trim() || titleEn.trim() },
      venue: venue.trim(),
      category,
      type,
      date: date.trim(),
      location: location.trim(),
      summary: { en: summaryEn.trim(), fr: summaryFr.trim() || summaryEn.trim() },
      source_url: sourceUrl.trim() || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId.trim()}` : undefined),
      is_pinned: isPinned,
      video_metadata: youtubeId.trim()
        ? {
            youtube_id: youtubeId.trim(),
            caption_note: {
              en: 'Official Video Broadcast with Verified Remarks',
              fr: 'Diffusion Vidéo Officielle avec Remarques Vérifiées',
            },
          }
        : undefined,
    };

    try {
      const res = await fetch('/api/admin/media', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Administrative session expired. Please re-enter your passkey.');
        }
        let errMsg = 'Failed to save media appearance.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      onSaved(data.data as MediaAppearance);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting media appearance');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Media Record' : 'Add Media Appearance / Broadcast'}
      subtitle="Television interview, ATIDI keynote, press article, or YouTube embed."
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
          <span className="editorial-kicker">MEDIA BROADCAST TITLE (BILINGUAL)</span>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Title / Topic (English) *
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. CEMAC Sovereign Debt Dynamics & Regional Bonds"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Title / Topic (French) *
            </label>
            <input
              type="text"
              required
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. Dynamiques de la Dette Souveraine CEMAC"
            />
          </div>
        </div>

        {/* Venue, Category, Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Venue / Broadcaster *
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="Africa24 / CRTV / ATIDI"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'broadcast' | 'press' | 'governance' | 'academic')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="broadcast">Broadcast / Television</option>
              <option value="governance">Governance Keynote</option>
              <option value="press">Press Investigation</option>
              <option value="academic">Academic Lecture</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Format Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value as MediaAppearanceType)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="Keynote Speech / Interview"
            />
          </div>
        </div>

        {/* Date, Location, Featured Pinned Flag */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Date / Year
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="2025"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Featured Flag
            </label>
            <select
              value={isPinned ? 'true' : 'false'}
              onChange={(e) => setIsPinned(e.target.value === 'true')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="false">Standard Media Record</option>
              <option value="true">Pinned Keynote Broadcast</option>
            </select>
          </div>
        </div>

        {/* YouTube Video ID & External URL */}
        <div className="p-4 bg-sand-50/70 border border-surface-border space-y-3">
          <span className="editorial-kicker">VIDEO EMBEDDING &amp; EXTERNAL LINK</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                YouTube Video ID (11 chars)
              </label>
              <input
                type="text"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none"
                placeholder="e.g. dQw4w9WgXcQ"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Source Public URL
              </label>
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Summary EN & FR */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Summary / Editorial Synopsis (English) *
          </label>
          <textarea
            rows={2}
            required
            value={summaryEn}
            onChange={(e) => setSummaryEn(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Summary / Editorial Synopsis (French)
          </label>
          <textarea
            rows={2}
            value={summaryFr}
            onChange={(e) => setSummaryFr(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
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
            <span>{saving ? 'Saving...' : isEditing ? 'Update Media' : 'Publish Media Appearance'}</span>
          </button>
        </div>
      </form>
    </AdminDrawerModal>
  );
}
