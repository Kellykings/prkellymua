'use client';

import React, { useState, useEffect } from 'react';
import { AdminDrawerModal } from './AdminDrawerModal';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import type { GalleryPhotoItem, EventCategory } from '@/types/domain';

interface GalleryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  photo: GalleryPhotoItem | null;
  onSaved: (photo: GalleryPhotoItem) => void;
}

export function GalleryFormDrawer({
  isOpen,
  onClose,
  photo,
  onSaved,
}: GalleryFormDrawerProps) {
  const isEditing = Boolean(photo);

  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [eventNameEn, setEventNameEn] = useState('');
  const [eventNameFr, setEventNameFr] = useState('');
  const [category, setCategory] = useState<EventCategory>('summit');
  const [year, setYear] = useState('2025');
  const [season, setSeason] = useState<'2025-2026' | '2023-2024' | 'archive'>('2025-2026');
  const [location, setLocation] = useState('Nairobi, Kenya');
  const [venue, setVenue] = useState('ATIDI Annual General Assembly');
  const [imageUrl, setImageUrl] = useState('/images/gallery/sample.jpg');
  const [captionEn, setCaptionEn] = useState('');
  const [captionFr, setCaptionFr] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (photo) {
      setTitleEn(photo.title.en || '');
      setTitleFr(photo.title.fr || '');
      setEventNameEn(photo.event_name?.en || '');
      setEventNameFr(photo.event_name?.fr || '');
      setCategory(photo.category || 'summit');
      setYear(photo.year || '2025');
      setSeason(photo.season || '2025-2026');
      setLocation(photo.location || '');
      setVenue(photo.venue || '');
      setImageUrl(photo.image_url || '');
      setCaptionEn(photo.caption?.en || '');
      setCaptionFr(photo.caption?.fr || '');
      setIsFeatured(Boolean(photo.is_featured_monthly));
    } else {
      setTitleEn('');
      setTitleFr('');
      setEventNameEn('');
      setEventNameFr('');
      setCategory('summit');
      setYear(new Date().getFullYear().toString());
      setSeason('2025-2026');
      setLocation('Yaoundé, Cameroon');
      setVenue('Ministerial Assembly');
      setImageUrl('');
      setCaptionEn('');
      setCaptionFr('');
      setIsFeatured(false);
    }
    setError(null);
  }, [photo, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Partial<GalleryPhotoItem> = {
      id: photo?.id || `photo-${Date.now()}`,
      title: { en: titleEn.trim(), fr: titleFr.trim() || titleEn.trim() },
      event_name: { en: eventNameEn.trim() || titleEn.trim(), fr: eventNameFr.trim() || titleFr.trim() },
      category,
      year: year.trim(),
      season,
      date: photo?.date || `${year}-06-15`,
      location: location.trim(),
      venue: venue.trim(),
      image_url: imageUrl.trim(),
      caption: { en: captionEn.trim(), fr: captionFr.trim() || captionEn.trim() },
      is_featured_monthly: isFeatured,
    };

    try {
      const res = await fetch('/api/admin/gallery', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Administrative session expired. Please re-enter your passkey.');
        }
        let errMsg = 'Failed to save archival photo.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      onSaved(data.data as GalleryPhotoItem);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting archival photo');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Archival Photo' : 'Upload / Register Archival Photo'}
      subtitle="Curated photographic record for mobile-first rotating gallery and assemblies."
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
          <span className="editorial-kicker">PHOTO RECORD TITLE (BILINGUAL)</span>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Title (English) *
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. ATIDI 24th General Assembly Chairmanship"
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
              placeholder="e.g. Présidence de la 24e Assemblée Générale de l'ATIDI"
            />
          </div>
        </div>

        {/* Category, Year, Season */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="summit">Summit &amp; Statecraft</option>
              <option value="governance">Governance &amp; Board</option>
              <option value="academic">Academic &amp; University</option>
              <option value="book_meetup">Book Signing &amp; Meetup</option>
              <option value="diplomatic">Diplomatic Convocations</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Year *
            </label>
            <input
              type="text"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="2025"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as '2025-2026' | '2023-2024' | 'archive')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="2025-2026">2025–2026 (Current Cycle)</option>
              <option value="2023-2024">2023–2024</option>
              <option value="archive">Historical Archive</option>
            </select>
          </div>
        </div>

        {/* Location, Venue, Monthly Spotlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Venue / Assembly
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Monthly Spotlight
            </label>
            <select
              value={isFeatured ? 'true' : 'false'}
              onChange={(e) => setIsFeatured(e.target.value === 'true')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="false">Standard Gallery Item</option>
              <option value="true">Featured Monthly Photo</option>
            </select>
          </div>
        </div>

        {/* Image Asset URL */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Image Asset URL *
          </label>
          <input
            type="text"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            placeholder="/images/gallery/... or https://..."
          />
        </div>

        {/* Caption EN & FR */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Historical Context / Caption (English) *
          </label>
          <textarea
            rows={2}
            required
            value={captionEn}
            onChange={(e) => setCaptionEn(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Historical Context / Caption (French)
          </label>
          <textarea
            rows={2}
            value={captionFr}
            onChange={(e) => setCaptionFr(e.target.value)}
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
            <span>{saving ? 'Saving...' : isEditing ? 'Update Photo' : 'Save Archival Record'}</span>
          </button>
        </div>
      </form>
    </AdminDrawerModal>
  );
}
