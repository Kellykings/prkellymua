'use client';

import React, { useState, useEffect } from 'react';
import { AdminDrawerModal } from './AdminDrawerModal';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import type { CareerEntry } from '@/types/domain';

interface GovernanceFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  career: CareerEntry | null;
  onSaved: (career: CareerEntry) => void;
}

export function GovernanceFormDrawer({
  isOpen,
  onClose,
  career,
  onSaved,
}: GovernanceFormDrawerProps) {
  const isEditing = Boolean(career);

  const [roleEn, setRoleEn] = useState('');
  const [roleFr, setRoleFr] = useState('');
  const [orgEn, setOrgEn] = useState('');
  const [orgFr, setOrgFr] = useState('');
  const [category, setCategory] = useState<'sovereign' | 'multilateral' | 'academic' | 'advisory'>('sovereign');
  const [period, setPeriod] = useState('2024 – Present');
  const [isCurrent, setIsCurrent] = useState(true);
  const [location, setLocation] = useState('Yaoundé, Cameroon');
  const [tenureNote, setTenureNote] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (career) {
      setRoleEn(career.role_title.en || '');
      setRoleFr(career.role_title.fr || '');
      setOrgEn(career.organization.en || '');
      setOrgFr(career.organization.fr || '');
      setCategory(career.category || 'sovereign');
      setPeriod(career.period || '');
      setIsCurrent(career.is_current ?? true);
      setLocation(career.location || '');
      setTenureNote(career.tenure_note || '');
      setDescEn(career.description?.en || '');
      setDescFr(career.description?.fr || '');
    } else {
      setRoleEn('');
      setRoleFr('');
      setOrgEn('');
      setOrgFr('');
      setCategory('sovereign');
      setPeriod('2025 – Present');
      setIsCurrent(true);
      setLocation('Yaoundé, Cameroon');
      setTenureNote('');
      setDescEn('');
      setDescFr('');
    }
    setError(null);
  }, [career, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Partial<CareerEntry> = {
      id: career?.id || `gov-${Date.now()}`,
      role_title: { en: roleEn.trim(), fr: roleFr.trim() || roleEn.trim() },
      organization: { en: orgEn.trim(), fr: orgFr.trim() || orgEn.trim() },
      category,
      period: period.trim(),
      is_current: isCurrent,
      location: location.trim(),
      tenure_note: tenureNote.trim(),
      description: { en: descEn.trim() || roleEn.trim(), fr: descFr.trim() || roleFr.trim() },
      highlights: career?.highlights || [{ en: 'Mandate stewardship.', fr: 'Direction du mandat.' }],
      verification_status: 'verified',
      verification_note: { en: 'Official Sovereign Record.', fr: 'Registre Souverain Officiel.' },
    };

    try {
      const res = await fetch('/api/admin/governance', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Administrative session expired. Please re-enter your passkey.');
        }
        let errMsg = 'Failed to save governance mandate.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      onSaved(data.data as CareerEntry);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting governance mandate');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Sovereign Mandate / Role' : 'Register New Sovereign Mandate'}
      subtitle="Institutional decree, multilateral appointment, or academic chair record."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Title EN & FR */}
        <div className="space-y-3 p-4 bg-surface-paper border border-surface-border">
          <span className="editorial-kicker">MANDATE ROLE TITLE (BILINGUAL)</span>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Role Title (English) *
            </label>
            <input
              type="text"
              required
              value={roleEn}
              onChange={(e) => setRoleEn(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. Director of Financial Operations / State Treasury"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Role Title (French) *
            </label>
            <input
              type="text"
              required
              value={roleFr}
              onChange={(e) => setRoleFr(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-serif font-bold focus:outline-none focus:border-navy-900"
              placeholder="e.g. Directeur des Opérations Financières / Trésor Public"
            />
          </div>
        </div>

        {/* Organization EN & FR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Institution / Entity (English) *
            </label>
            <input
              type="text"
              required
              value={orgEn}
              onChange={(e) => setOrgEn(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="Ministry of Finance, Cameroon"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Institution / Entity (French) *
            </label>
            <input
              type="text"
              required
              value={orgFr}
              onChange={(e) => setOrgFr(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="Ministère des Finances, Cameroun"
            />
          </div>
        </div>

        {/* Category, Period, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Mandate Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'sovereign' | 'multilateral' | 'academic' | 'advisory')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="sovereign">Sovereign Statecraft</option>
              <option value="multilateral">Multilateral Governance</option>
              <option value="academic">Academic Chair / Professorship</option>
              <option value="advisory">Advisory &amp; Board</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Period / Tenure *
            </label>
            <input
              type="text"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-surface-border text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
              placeholder="2020 – Present"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
              Active Status
            </label>
            <select
              value={isCurrent ? 'true' : 'false'}
              onChange={(e) => setIsCurrent(e.target.value === 'true')}
              className="w-full h-9 px-2 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="true">Active Mandate</option>
              <option value="false">Concluded Mandate</option>
            </select>
          </div>
        </div>

        {/* Location & Tenure Note */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Administrative Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            placeholder="Yaoundé, Cameroon"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Tenure Note &amp; Impact Highlight
          </label>
          <input
            type="text"
            value={tenureNote}
            onChange={(e) => setTenureNote(e.target.value)}
            className="w-full h-9 px-3 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            placeholder="Key state reform, financial oversight or multilateral achievement"
          />
        </div>

        {/* Description EN & FR */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Mandate Scope &amp; Responsibilities (English)
          </label>
          <textarea
            rows={2}
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Mandate Scope &amp; Responsibilities (French)
          </label>
          <textarea
            rows={2}
            value={descFr}
            onChange={(e) => setDescFr(e.target.value)}
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
            <span>{saving ? 'Saving...' : isEditing ? 'Update Mandate' : 'Register Mandate'}</span>
          </button>
        </div>
      </form>
    </AdminDrawerModal>
  );
}
