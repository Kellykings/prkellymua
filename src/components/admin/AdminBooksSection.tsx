'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, Plus, Edit3, Trash2, Receipt, Boxes } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Book } from '@/types/domain';
import { BookFormDrawer } from './crud/BookFormDrawer';
import { DeleteConfirmModal } from './crud/DeleteConfirmModal';

export function AdminBooksSection({ books: initialBooks }: { books: Book[] }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleAddNew() {
    setEditingBook(null);
    setDrawerOpen(true);
  }

  function handleEdit(book: Book) {
    setEditingBook(book);
    setDrawerOpen(true);
  }

  function handleSaved(savedBook: Book) {
    const idx = books.findIndex((b) => b.id === savedBook.id);
    if (idx >= 0) {
      const updated = [...books];
      updated[idx] = savedBook;
      setBooks(updated);
    } else {
      setBooks([savedBook, ...books]);
    }
  }

  function promptDelete(book: Book) {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/books?id=${bookToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== bookToDelete.id));
        setDeleteModalOpen(false);
        setBookToDelete(null);
      }
    } catch {
      // Handle error
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <section className="bg-white border border-surface-border shadow-institutional overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900">
              Hybrid Bookstore Inventory &amp; Format Pricing ({books.length} Volumes)
            </h2>
            <p className="text-xs text-ink-500">
              Manage direct digital SKUs (PDF/ePub), dual USD/XAF pricing, and external global retail distribution.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.sokoclick.com/en/sales/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold shadow-sm transition-colors"
              title="Issue SokoClick Sales Receipt"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>SokoClick Sales Receipt</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <a
              href="https://www.sokoclick.com/en/dashboard?mode=BUSINESS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-950 border border-gold-500/40 text-gold-300 hover:text-white text-xs font-semibold shadow-sm transition-colors"
              title="Manage Book Stock & Inventory on SokoClick"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>SokoClick Inventory</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Treatise</span>
            </button>
            <Link
              href="/en/books"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-paper border border-surface-border text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
            >
              <span>Public Catalog</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Mobile Card Transformation (< md) */}
        <div className="block md:hidden divide-y divide-surface-border p-4 space-y-4">
          {books.map((book) => (
            <div key={book.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/en/books/${book.slug}`}
                  className="font-serif font-bold text-base text-navy-900 hover:text-bronze-600 leading-snug"
                >
                  {book.title.en}
                </Link>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-mono border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{book.status}</span>
                </span>
              </div>

              <div className="text-xs font-mono text-ink-500 flex flex-wrap items-center gap-2">
                <span>ISBN: <strong className="text-navy-950">{book.isbn}</strong></span>
                <span>·</span>
                <span>{book.publish_date}</span>
                <span>·</span>
                <span className="text-bronze-600 font-semibold">{book.academic_category}</span>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-ink-400">
                  Direct Digital SKUs
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {book.book_formats.map((f) => (
                    <span
                      key={f.id}
                      className="px-2 py-0.5 bg-surface-paper border border-surface-border text-xs font-mono text-ink-700"
                    >
                      {f.format.replace('digital_', '').replace('physical_', '').toUpperCase()}:{' '}
                      <strong>{formatCurrency(f.price_cents, f.currency)}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(book)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-navy-900 bg-surface-paper border border-surface-border hover:bg-surface-border/50"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => promptDelete(book)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Tabular View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-paper border-b border-surface-border text-xs font-mono uppercase text-ink-500">
                <th className="py-3 px-4">Title &amp; Academic Track (EN)</th>
                <th className="py-3 px-4">ISBN-13</th>
                <th className="py-3 px-4">Direct Digital Pricing</th>
                <th className="py-3 px-4">External Retail</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-surface-paper/70 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-semibold text-navy-900 max-w-xs">
                    <Link
                      href={`/en/books/${book.slug}`}
                      className="hover:text-bronze-600 transition-colors block leading-snug"
                    >
                      {book.title.en}
                    </Link>
                    <div className="text-xs text-ink-500 font-sans font-normal mt-0.5">
                      {book.academic_category}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-ink-700 whitespace-nowrap">
                    {book.isbn}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono whitespace-nowrap">
                    <div className="space-y-0.5">
                      {book.book_formats.map((f) => (
                        <div key={f.id} className="text-ink-700">
                          <span className="text-ink-400 uppercase text-[10px]">
                            {f.format.replace('digital_', '').replace('physical_', '')}:
                          </span>{' '}
                          <strong>{formatCurrency(f.price_cents, f.currency)}</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono">
                    <div className="flex flex-wrap gap-1">
                      {book.third_party_retailers.map((r) => (
                        <a
                          key={r.id}
                          href={r.retail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-surface-paper border border-surface-border text-ink-700 hover:text-navy-900 hover:border-navy-900 transition-colors inline-flex items-center gap-1 text-[11px]"
                        >
                          <span>{r.platform_name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-ink-600 whitespace-nowrap">
                    {book.publish_date}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-mono border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{book.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(book)}
                        className="p-1.5 text-navy-900 hover:bg-surface-paper rounded transition-colors"
                        title="Edit Book"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDelete(book)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slide-over Form Drawer */}
      <BookFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        book={editingBook}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Monographic Treatise"
        itemSummary={bookToDelete ? `"${bookToDelete.title.en}" (ISBN: ${bookToDelete.isbn})` : ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
