'use client';

import React, { useState, useEffect } from 'react';
import { AdminDrawerModal } from './AdminDrawerModal';
import { Save, RefreshCw, AlertCircle, Mail, Building, Tag, Calendar } from 'lucide-react';

interface InquiryItem {
  id: string;
  sender_name: string;
  sender_email: string;
  organization?: string | null;
  inquiry_type: string;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
}

interface InquiryStatusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryItem | null;
  onSaved: (inquiry: InquiryItem) => void;
}

export function InquiryStatusDrawer({
  isOpen,
  onClose,
  inquiry,
  onSaved,
}: InquiryStatusDrawerProps) {
  const [status, setStatus] = useState('received');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || 'received');
      setAdminNote('');
    }
    setError(null);
  }, [inquiry, isOpen]);

  if (!inquiry) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...inquiry,
      status,
      admin_note: adminNote.trim() || undefined,
    };

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Administrative session expired. Please re-enter your passkey.');
        }
        let errMsg = 'Failed to update protocol inquiry status.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      onSaved(data.data as InquiryItem);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating inquiry status');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title="Protocol Correspondence Review"
      subtitle={`Dossier Reference ID: ${inquiry.id}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sender Coordinate Summary */}
        <div className="p-4 bg-surface-paper border border-surface-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <strong className="text-navy-950 font-serif font-bold text-sm">
              {inquiry.sender_name}
            </strong>
            <span className="font-mono text-ink-500 text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{inquiry.created_at?.slice(0, 10) || 'Recent'}</span>
            </span>
          </div>

          <div className="text-ink-600 flex items-center gap-1.5 font-mono">
            <Mail className="w-3 h-3 text-bronze-600" />
            <a href={`mailto:${inquiry.sender_email}`} className="underline hover:text-navy-900">
              {inquiry.sender_email}
            </a>
          </div>

          {inquiry.organization && (
            <div className="text-ink-600 flex items-center gap-1.5 font-mono">
              <Building className="w-3 h-3 text-gold-600" />
              <span>{inquiry.organization}</span>
            </div>
          )}

          <div className="pt-1 flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-ink-400" />
            <span className="px-2 py-0.5 bg-white border border-surface-border font-mono text-[11px]">
              {inquiry.inquiry_type}
            </span>
          </div>
        </div>

        {/* Message Subject & Body */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase text-ink-600">
            Subject &amp; Inquiry Body
          </label>
          <div className="font-serif font-bold text-navy-900 text-sm p-3 bg-sand-50/50 border border-surface-border">
            {inquiry.subject}
          </div>
          <div className="p-3 bg-white border border-surface-border text-xs text-ink-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {inquiry.message}
          </div>
        </div>

        {/* Status Pipeline Selection */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Protocol Handling Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-surface-border text-xs text-navy-900 font-semibold focus:outline-none focus:border-navy-900"
          >
            <option value="received">Received (Awaiting Secretariat Triage)</option>
            <option value="under_review">Under Review (Executive Consideration)</option>
            <option value="responded">Responded (Official Protocol Dispatched)</option>
            <option value="archived">Archived (Matter Concluded)</option>
          </select>
        </div>

        {/* Administrative Notes */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-600 mb-1">
            Internal Secretariat Notes
          </label>
          <textarea
            rows={2}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full p-2.5 bg-white border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            placeholder="Add internal briefing note or dispatch reference..."
          />
        </div>

        {/* Actions */}
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
            <span>{saving ? 'Updating...' : 'Update Status'}</span>
          </button>
        </div>
      </form>
    </AdminDrawerModal>
  );
}
