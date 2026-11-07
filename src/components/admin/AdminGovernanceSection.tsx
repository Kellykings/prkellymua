'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, Shield, Plus, Edit3, Trash2 } from 'lucide-react';
import type { CareerEntry } from '@/types/domain';
import { GovernanceFormDrawer } from './crud/GovernanceFormDrawer';
import { DeleteConfirmModal } from './crud/DeleteConfirmModal';

export function AdminGovernanceSection({ careers: initialCareers }: { careers: CareerEntry[] }) {
  const [careers, setCareers] = useState<CareerEntry[]>(initialCareers);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerEntry | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<CareerEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleAddNew() {
    setEditingCareer(null);
    setDrawerOpen(true);
  }

  function handleEdit(career: CareerEntry) {
    setEditingCareer(career);
    setDrawerOpen(true);
  }

  function handleSaved(savedCareer: CareerEntry) {
    const idx = careers.findIndex((c) => c.id === savedCareer.id);
    if (idx >= 0) {
      const updated = [...careers];
      updated[idx] = savedCareer;
      setCareers(updated);
    } else {
      setCareers([savedCareer, ...careers]);
    }
  }

  function promptDelete(career: CareerEntry) {
    setCareerToDelete(career);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!careerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/governance?id=${careerToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCareers(careers.filter((c) => c.id !== careerToDelete.id));
        setDeleteModalOpen(false);
        setCareerToDelete(null);
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
              Sovereign &amp; Multilateral Governance Register ({careers.length} Verified Mandates)
            </h2>
            <p className="text-xs text-ink-500">
              Official ministerial decrees, multilateral appointments, academic chairs, and multilateral advisory posts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Sovereign Mandate</span>
            </button>
            <Link
              href="/en/governance"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-paper border border-surface-border text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
            >
              <span>Public Register</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Mobile Card Transformation (< md) */}
        <div className="block md:hidden divide-y divide-surface-border p-4 space-y-4">
          {careers.map((c) => (
            <div key={c.id} className="pt-4 first:pt-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="font-serif font-bold text-base text-navy-900 leading-snug">
                  {c.role_title.en}
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono border shrink-0 ${
                    c.is_current
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-surface-paper text-ink-600 border-surface-border'
                  }`}
                >
                  {c.is_current ? <CheckCircle2 className="w-3 h-3" /> : null}
                  <span>{c.is_current ? 'Active' : 'Concluded'}</span>
                </span>
              </div>

              <div className="text-xs font-semibold text-bronze-600 uppercase tracking-wider">
                {c.organization.en}
              </div>

              <div className="text-xs font-mono text-ink-500 flex flex-wrap items-center gap-2">
                <span>{c.period}</span>
                <span>·</span>
                <span className="capitalize">{c.category}</span>
                {c.location && (
                  <>
                    <span>·</span>
                    <span>{c.location}</span>
                  </>
                )}
              </div>

              {c.tenure_note && (
                <div className="text-xs text-ink-600 bg-sand-50/70 p-2.5 border-l-2 border-gold-500 italic">
                  {c.tenure_note}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(c)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-navy-900 bg-surface-paper border border-surface-border hover:bg-surface-border/50"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => promptDelete(c)}
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
                <th className="py-3 px-4">Mandate &amp; Role (EN)</th>
                <th className="py-3 px-4">Institution / State Entity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Tenure Impact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {careers.map((c) => (
                <tr key={c.id} className="hover:bg-surface-paper/70 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-semibold text-navy-900 max-w-xs">
                    {c.role_title.en}
                    <div className="text-xs text-ink-500 italic font-normal mt-0.5">
                      FR: {c.role_title.fr}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-bronze-600 max-w-[200px]">
                    {c.organization.en}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono capitalize text-ink-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-surface-paper border border-surface-border">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-ink-600 whitespace-nowrap">
                    {c.period}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-ink-600 max-w-sm">
                    {c.tenure_note || c.description.en}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono border ${
                        c.is_current
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                          : 'bg-surface-paper text-ink-600 border-surface-border'
                      }`}
                    >
                      {c.is_current && <Shield className="w-3 h-3 text-emerald-700" />}
                      <span>{c.is_current ? 'Active Mandate' : 'Concluded'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="p-1.5 text-navy-900 hover:bg-surface-paper rounded transition-colors"
                        title="Edit Mandate"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDelete(c)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Mandate"
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
      <GovernanceFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        career={editingCareer}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Sovereign Mandate"
        itemSummary={careerToDelete ? `"${careerToDelete.role_title.en}" at ${careerToDelete.organization.en}` : ''}
        isDeleting={isDeleting}
      />
    </>
  );
}
