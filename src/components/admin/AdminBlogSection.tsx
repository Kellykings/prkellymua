'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Plus, Edit3, Trash2, Clock } from 'lucide-react';
import type { BlogPost } from '@/types/domain';
import { BlogFormDrawer } from './crud/BlogFormDrawer';
import { DeleteConfirmModal } from './crud/DeleteConfirmModal';

export function AdminBlogSection({ posts: initialPosts }: { posts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleAddNew() {
    setEditingPost(null);
    setDrawerOpen(true);
  }

  function handleEdit(post: BlogPost) {
    setEditingPost(post);
    setDrawerOpen(true);
  }

  function handleSaved(savedPost: BlogPost) {
    const idx = posts.findIndex((p) => p.id === savedPost.id);
    if (idx >= 0) {
      const updated = [...posts];
      updated[idx] = savedPost;
      setPosts(updated);
    } else {
      setPosts([savedPost, ...posts]);
    }
  }

  function promptDelete(post: BlogPost) {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog?id=${postToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postToDelete.id));
        setDeleteModalOpen(false);
        setPostToDelete(null);
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
              Policy Briefs &amp; Working Papers ({posts.length} Publications)
            </h2>
            <p className="text-xs text-ink-500">
              Multilingual policy papers, academic track taxonomy, and citable DOI references.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Policy Brief</span>
            </button>
            <Link
              href="/en/blog"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-paper border border-surface-border text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
            >
              <span>Public Policy Index</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Mobile Card Transformation (< md) */}
        <div className="block md:hidden divide-y divide-surface-border p-4 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="pt-4 first:pt-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/en/blog/${post.slug}`}
                  className="font-serif font-bold text-base text-navy-900 hover:text-bronze-600 leading-snug"
                >
                  {post.title.en}
                </Link>
                <span className="px-2 py-0.5 bg-surface-paper border border-surface-border text-xs font-mono shrink-0">
                  {post.status}
                </span>
              </div>

              <div className="text-xs font-semibold text-bronze-600 uppercase tracking-wider">
                {post.category}
              </div>

              <div className="text-xs font-mono text-ink-500 flex flex-wrap items-center gap-2">
                <span>{post.published_at}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.estimated_read_minutes} min read</span>
                </span>
              </div>

              <p className="text-xs text-ink-700 line-clamp-2 leading-relaxed">
                {post.excerpt.en}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(post)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-navy-900 bg-surface-paper border border-surface-border hover:bg-surface-border/50"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => promptDelete(post)}
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
                <th className="py-3 px-4">Title &amp; Subtitle (EN)</th>
                <th className="py-3 px-4">Academic Track</th>
                <th className="py-3 px-4">DOI / Reference</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-paper/70 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-semibold text-navy-900 max-w-sm">
                    <Link
                      href={`/en/blog/${post.slug}`}
                      className="hover:text-bronze-600 transition-colors block leading-snug"
                    >
                      {post.title.en}
                    </Link>
                    <div className="text-xs text-ink-500 font-sans italic font-normal line-clamp-1 mt-0.5">
                      FR: {post.title.fr}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-ink-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-surface-paper border border-surface-border">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-bronze-600 whitespace-nowrap">
                    {post.doi_reference || 'Pending DOI'}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-ink-600 whitespace-nowrap">
                    {post.published_at}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-ink-600 whitespace-nowrap">
                    {post.estimated_read_minutes} min
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        className="p-1.5 text-navy-900 hover:bg-surface-paper rounded transition-colors"
                        title="Edit Policy Brief"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDelete(post)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Policy Brief"
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
      <BlogFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        post={editingPost}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Policy Brief"
        itemSummary={postToDelete ? `"${postToDelete.title.en}" (${postToDelete.slug})` : ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
