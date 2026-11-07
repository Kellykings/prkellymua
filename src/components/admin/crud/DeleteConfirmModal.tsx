'use client';

import React from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemSummary: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemSummary,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-white border border-red-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-red-600">
          <div className="p-2.5 bg-red-50 border border-red-100 rounded">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-950">{title}</h3>
            <p className="text-xs text-ink-500 font-mono">Irreversible Action</p>
          </div>
        </div>

        <p className="text-xs text-ink-700 leading-relaxed">
          Are you sure you want to permanently delete:
          <strong className="block text-navy-900 font-semibold mt-1 p-2 bg-surface-paper border border-surface-border">
            {itemSummary}
          </strong>
        </p>

        <p className="text-[11px] text-ink-400">
          This record will be removed from both public routes and the internal studio catalog immediately.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-surface-border text-xs font-semibold text-ink-700 hover:bg-surface-paper transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow transition-colors disabled:opacity-50"
          >
            {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{isDeleting ? 'Deleting...' : 'Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
