'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Play, Pin, Plus, Edit3, Trash2 } from 'lucide-react';
import type { MediaAppearance } from '@/types/domain';
import { MediaFormDrawer } from './crud/MediaFormDrawer';
import { DeleteConfirmModal } from './crud/DeleteConfirmModal';

export function AdminMediaSection({ media: initialMedia }: { media: MediaAppearance[] }) {
  const [media, setMedia] = useState<MediaAppearance[]>(initialMedia);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaAppearance | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaAppearance | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleAddNew() {
    setEditingMedia(null);
    setDrawerOpen(true);
  }

  function handleEdit(item: MediaAppearance) {
    setEditingMedia(item);
    setDrawerOpen(true);
  }

  function handleSaved(savedItem: MediaAppearance) {
    const idx = media.findIndex((m) => m.id === savedItem.id);
    if (idx >= 0) {
      const updated = [...media];
      updated[idx] = savedItem;
      setMedia(updated);
    } else {
      setMedia([savedItem, ...media]);
    }
  }

  function promptDelete(item: MediaAppearance) {
    setMediaToDelete(item);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!mediaToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media?id=${mediaToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMedia(media.filter((m) => m.id !== mediaToDelete.id));
        setDeleteModalOpen(false);
        setMediaToDelete(null);
      }
    } catch {
      // Error handling
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
              Media Appearances, Keynotes &amp; Broadcasts ({media.length} Records)
            </h2>
            <p className="text-xs text-ink-500">
              Television interviews (Africa24, CRTV), ATIDI Board Chair keynote addresses, press investigations, and scholarly lectures.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Media Appearance</span>
            </button>
            <Link
              href="/en/media"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-paper border border-surface-border text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
            >
              <span>Public Media Hub</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Mobile Card Transformation (< md) */}
        <div className="block md:hidden divide-y divide-surface-border p-4 space-y-4">
          {media.map((item) => {
            const isVideo = Boolean(
              item.video_metadata?.youtube_id || item.source_url?.includes('youtube.com')
            );

            return (
              <div key={item.id} className="pt-4 first:pt-0 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-serif font-bold text-base text-navy-900 leading-snug">
                    {item.title.en}
                  </div>
                  {item.is_pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-500 text-navy-950 font-bold text-[10px] uppercase tracking-wider shrink-0">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-bronze-600 uppercase tracking-wider">
                  {item.venue} · {item.location}
                </div>

                <div className="text-xs font-mono text-ink-500 flex flex-wrap items-center gap-2">
                  <span>{item.date}</span>
                  <span>·</span>
                  <span className="capitalize">{item.category}</span>
                  {isVideo && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-navy-900 text-gold-400 text-[10px]">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>YouTube Embed</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                  {item.source_url ? (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-navy-900 hover:text-bronze-600 underline inline-flex items-center gap-1"
                    >
                      <span>Public Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-navy-900 bg-surface-paper border border-surface-border hover:bg-surface-border/50"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => promptDelete(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Tabular View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-paper border-b border-surface-border text-xs font-mono uppercase text-ink-500">
                <th className="py-3 px-4">Title &amp; Topic (EN)</th>
                <th className="py-3 px-4">Venue / Broadcaster</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {media.map((item) => {
                const isVideo = Boolean(
                  item.video_metadata?.youtube_id || item.source_url?.includes('youtube.com')
                );

                return (
                  <tr key={item.id} className="hover:bg-surface-paper/70 transition-colors">
                    <td className="py-3.5 px-4 font-serif font-semibold text-navy-900 max-w-sm">
                      <div className="flex items-center gap-1.5">
                        {item.is_pinned && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gold-500 text-navy-950 font-bold text-[10px] uppercase shrink-0">
                            <Pin className="w-2.5 h-2.5 fill-current" />
                            <span>Pinned</span>
                          </span>
                        )}
                        <span className="leading-snug">{item.title.en}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-bronze-600 whitespace-nowrap">
                      {item.venue}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono capitalize text-ink-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-surface-paper border border-surface-border">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-ink-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono whitespace-nowrap">
                      {isVideo ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-navy-900 text-gold-400 text-[11px]">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Video Embed</span>
                        </span>
                      ) : (
                        <span className="text-ink-500">Press / Text</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-ink-600 hover:text-navy-900 hover:bg-surface-paper rounded transition-colors"
                            title="Open Source Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-navy-900 hover:bg-surface-paper rounded transition-colors"
                          title="Edit Media Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDelete(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Media Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slide-over Form Drawer */}
      <MediaFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={editingMedia}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Media Record"
        itemSummary={mediaToDelete ? `"${mediaToDelete.title.en}" (${mediaToDelete.venue})` : ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
