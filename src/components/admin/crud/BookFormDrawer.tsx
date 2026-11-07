'use client';

import React, { useState, useEffect } from 'react';
import { AdminDrawerModal } from './AdminDrawerModal';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import type { Book } from '@/types/domain';

interface BookFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSaved: (book: Book) => void;
}

export function BookFormDrawer({
  isOpen,
  onClose,
  book,
  onSaved,
}: BookFormDrawerProps) {
  const isEditing = Boolean(book);

  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleFr, setSubtitleFr] = useState('');
  const [isbn, setIsbn] = useState('978-');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Forensic Auditing & Financial Integrity');
  const [publishDate, setPublishDate] = useState('2025-01-01');
  const [publisher, setPublisher] = useState('Christian Faith Publishing');
  const [pages, setPages] = useState('280');
  const [coverUrl, setCoverUrl] = useState('/images/books/sample.jpg');
  const [synopsisEn, setSynopsisEn] = useState('');
  const [synopsisFr, setSynopsisFr] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [priceUsd, setPriceUsd] = useState('45.00');
  const [priceXaf, setPriceXaf] = useState('25000');
  const [retailUrl, setRetailUrl] = useState('https://www.amazon.com');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book) {
      setTitleEn(book.title.en || '');
      setTitleFr(book.title.fr || '');
      setSubtitleEn(book.subtitle?.en || '');
      setSubtitleFr(book.subtitle?.fr || '');
      setIsbn(book.isbn || '978-');
      setSlug(book.slug || '');
      setCategory(book.academic_category || 'Forensic Auditing & Financial Integrity');
      setPublishDate(book.publish_date || '2025-01-01');
      setPublisher(book.publisher || 'Christian Faith Publishing');
      setPages(String(book.total_pages || 280));
      setCoverUrl(book.cover_image_url || '/images/books/sample.jpg');
      setSynopsisEn(book.synopsis?.en || '');
      setSynopsisFr(book.synopsis?.fr || '');
      setStatus((book.status as 'published' | 'draft') || 'published');

      const pdfFmt = book.book_formats?.find((f) => f.format === 'digital_pdf');
      if (pdfFmt) {
        setPriceUsd((pdfFmt.price_cents / 100).toFixed(2));
      }
      const xafFmt = book.book_formats?.find((f) => f.currency === 'XAF');
      if (xafFmt) {
        setPriceXaf(String(xafFmt.price_cents / 100));
      }
      const amazon = book.third_party_retailers?.find((r) => r.platform_name.toLowerCase().includes('amazon'));
      if (amazon) {
        setRetailUrl(amazon.retail_url);
      }
    } else {
      // Reset
      setTitleEn('');
      setTitleFr('');
      setSubtitleEn('');
      setSubtitleFr('');
      setIsbn('978-');
      setSlug('');
      setCategory('Forensic Auditing & Financial Integrity');
      setPublishDate(new Date().toISOString().slice(0, 10));
      setPublisher('Christian Faith Publishing');
      setPages('280');
      setCoverUrl('/images/books/');
      setSynopsisEn('');
      setSynopsisFr('');
      setStatus('published');
      setPriceUsd('45.00');
      setPriceXaf('25000');
      setRetailUrl('https://www.amazon.com');
    }
    setError(null);
  }, [book, isOpen]);

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

    const priceUsdCents = Math.round(parseFloat(priceUsd || '45') * 100);
    const priceXafCents = Math.round(parseFloat(priceXaf || '25000') * 100);

    const payload: Partial<Book> = {
      id: book?.id || `book-${Date.now()}`,
      slug: slug || `monograph-${Date.now()}`,
      isbn: isbn.trim(),
      title: { en: titleEn.trim(), fr: titleFr.trim() || titleEn.trim() },
      subtitle: { en: subtitleEn.trim(), fr: subtitleFr.trim() || subtitleEn.trim() },
      synopsis: { en: synopsisEn.trim(), fr: synopsisFr.trim() || synopsisEn.trim() },
      academic_category: category,
      publish_date: publishDate,
      publisher: publisher.trim(),
      total_pages: parseInt(pages, 10) || 280,
      cover_image_url: coverUrl.trim(),
      status,
      chapters: book?.chapters || [
        {
          number: 1,
          title: { en: 'Theoretical Foundations & Frameworks', fr: 'Fondements Théoriques et Cadres' },
          summary: { en: 'Core doctrines and institutional principles.', fr: 'Doctrines fondamentales et principes.' },
        },
      ],
      book_formats: [
        {
          id: `fmt-pdf-${Date.now()}`,
          book_id: book?.id || `book-${Date.now()}`,
          format: 'digital_pdf',
          price_cents: priceUsdCents,
          currency: 'USD',
          is_available: true,
          sku: `SKU-PDF-${isbn}`,
        },
        {
          id: `fmt-xaf-${Date.now()}`,
          book_id: book?.id || `book-${Date.now()}`,
          format: 'digital_pdf',
          price_cents: priceXafCents,
          currency: 'XAF',
          is_available: true,
          sku: `SKU-XAF-${isbn}`,
        },
      ],
      third_party_retailers: [
        {
          id: `ret-amazon-${Date.now()}`,
          book_id: book?.id || `book-${Date.now()}`,
          platform_name: 'Amazon',
          retail_url: retailUrl.trim(),
          is_active: true,
        },
      ],
    };

    try {
      const res = await fetch('/api/admin/books', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Administrative session expired. Please re-enter your passkey.');
        }
        let errMsg = 'Failed to save book record.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      onSaved(data.data as Book);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting book record');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Monographic Treatise' : 'Add New Monographic Treatise'}
      subtitle="Configure academic metadata, bilingual summaries, and direct/retail pricing."
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
          <span className="editorial-kicker">MONOGRAPH TITLE (BILINGUAL)</span>
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
              placeholder="e.g. Financial Crime and Forensic Accounting"
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
              placeholder="e.g. Criminalité Financière et Comptabilité Forensique"
            />
          </div>
        </div>

        {/* Subtitle EN & FR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={subtitleEn}
              onChange={(e) => setSubtitleEn(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Subtitle (French)
            </label>
            <input
              type="text"
              value={subtitleFr}
              onChange={(e) => setSubtitleFr(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
        </div>

        {/* ISBN, Slug, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              ISBN-13 *
            </label>
            <input
              type="text"
              required
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="978-..."
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              URL Slug *
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

        {/* Academic Category & Publisher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Academic Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Publisher
            </label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
        </div>

        {/* Date, Pages, Cover URL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Total Pages
            </label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
        </div>

        {/* Pricing & Amazon Retailer */}
        <div className="p-4 bg-sand-50/70 border border-surface-border space-y-3">
          <span className="editorial-kicker">PRICING &amp; RETAILER CHANNELS</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Direct PDF ($ USD)
              </label>
              <input
                type="text"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Direct PDF (FCFA)
              </label>
              <input
                type="text"
                value={priceXaf}
                onChange={(e) => setPriceXaf(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Amazon Retail URL
              </label>
              <input
                type="text"
                value={retailUrl}
                onChange={(e) => setRetailUrl(e.target.value)}
                className="w-full h-8 px-2 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Synopsis EN & FR */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Synopsis (English) *
          </label>
          <textarea
            rows={3}
            required
            value={synopsisEn}
            onChange={(e) => setSynopsisEn(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Synopsis (French)
          </label>
          <textarea
            rows={3}
            value={synopsisFr}
            onChange={(e) => setSynopsisFr(e.target.value)}
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
            <span>{saving ? 'Saving...' : isEditing ? 'Update Monograph' : 'Publish Monograph'}</span>
          </button>
        </div>
      </form>
    </AdminDrawerModal>
  );
}
