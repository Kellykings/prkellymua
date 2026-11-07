'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, MapPin, Plus, Edit3, Trash2 } from 'lucide-react';
import type { GalleryPhotoItem, InstitutionalEvent } from '@/types/domain';
import { GalleryFormDrawer } from './crud/GalleryFormDrawer';
import { DeleteConfirmModal } from './crud/DeleteConfirmModal';

export function AdminGallerySection({
  photos: initialPhotos,
  events,
}: {
  photos: GalleryPhotoItem[];
  events: InstitutionalEvent[];
}) {
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>(initialPhotos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoItem | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhotoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleAddNew() {
    setEditingPhoto(null);
    setDrawerOpen(true);
  }

  function handleEdit(photo: GalleryPhotoItem) {
    setEditingPhoto(photo);
    setDrawerOpen(true);
  }

  function handleSaved(savedPhoto: GalleryPhotoItem) {
    const idx = photos.findIndex((p) => p.id === savedPhoto.id);
    if (idx >= 0) {
      const updated = [...photos];
      updated[idx] = savedPhoto;
      setPhotos(updated);
    } else {
      setPhotos([savedPhoto, ...photos]);
    }
  }

  function promptDelete(photo: GalleryPhotoItem) {
    setPhotoToDelete(photo);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!photoToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery?id=${photoToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPhotos(photos.filter((p) => p.id !== photoToDelete.id));
        setDeleteModalOpen(false);
        setPhotoToDelete(null);
      }
    } catch {
      // Error handling
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Institutional Events Overview */}
      <section className="bg-white border border-surface-border shadow-institutional p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900">
              Institutional Events &amp; Summits ({events.length} Major Assemblies)
            </h2>
            <p className="text-xs text-ink-500">
              International ministerial symposiums and sovereign debt convocations.
            </p>
          </div>
          <Link
            href="/en#gallery"
            className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-bronze-600 underline"
          >
            <span>View Public Gallery</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="border border-surface-border p-4 bg-surface-paper/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 bg-navy-900 text-gold-400 capitalize">
                  {ev.category}
                </span>
                <span className="text-ink-500">{ev.date}</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-navy-900">
                {ev.title.en}
              </h3>
              <div className="text-xs text-bronze-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{ev.location}</span>
              </div>
              <p className="text-xs text-ink-600 line-clamp-2">
                {ev.description.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery Archive Table */}
      <section className="bg-white border border-surface-border shadow-institutional overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900">
              Archival Photographic Records ({photos.length} Verified Photos)
            </h2>
            <p className="text-xs text-ink-500">
              Curated statecraft, academic, leadership, and multilateral summits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Archival Photo</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-paper border-b border-surface-border text-xs font-mono uppercase text-ink-500">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Title &amp; Context (EN)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Year &amp; Season</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {photos.map((item, idx) => (
                <tr key={item.id} className="hover:bg-surface-paper/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-ink-400">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-4 font-serif font-semibold text-navy-900 max-w-sm">
                    {item.title.en}
                    <div className="text-xs text-ink-500 italic font-normal line-clamp-1 mt-0.5">
                      {item.caption.en}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono capitalize text-ink-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-surface-paper border border-surface-border">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-ink-600 whitespace-nowrap">
                    {item.year} ({item.season})
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-ink-600 whitespace-nowrap">
                    {item.location}
                  </td>
                  <td className="py-3 px-4 text-xs whitespace-nowrap">
                    <a
                      href={item.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-bronze-600 hover:text-navy-900 underline"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-navy-900 hover:bg-surface-paper rounded transition-colors"
                        title="Edit Archival Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDelete(item)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Archival Record"
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
      <GalleryFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        photo={editingPhoto}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Archival Photo"
        itemSummary={photoToDelete ? `"${photoToDelete.title.en}" (${photoToDelete.year})` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
