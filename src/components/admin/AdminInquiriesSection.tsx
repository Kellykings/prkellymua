'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ShieldCheck, Send, AlertCircle, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { InquiryStatusDrawer } from './crud/InquiryStatusDrawer';
import { DeleteConfirmModal } from './crud/DeleteConfirmModal';

interface ContactSubmission {
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

export function AdminInquiriesSection({
  initialSubmissions,
  isSupabaseConfigured,
}: {
  initialSubmissions: ContactSubmission[];
  isSupabaseConfigured: boolean;
}) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<ContactSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [testName, setTestName] = useState('Dr. Jean-Pierre Audit');
  const [testEmail, setTestEmail] = useState('qa-auditor@cemac-institution.org');
  const [testOrg, setTestOrg] = useState('Central African Financial Oversight Panel');
  const [testCategory, setTestCategory] = useState('Research & Policy Collaboration');
  const [testSubject, setTestSubject] = useState('E2E Protocol Verification Ping');
  const [testMessage, setTestMessage] = useState('Automated end-to-end verification ping executed via Admin Studio.');
  const [sending, setSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  function handleOpenInquiry(item: ContactSubmission) {
    setSelectedInquiry(item);
    setIsDrawerOpen(true);
  }

  function handleSavedInquiry(updated: ContactSubmission) {
    const idx = submissions.findIndex((s) => s.id === updated.id);
    if (idx >= 0) {
      const copy = [...submissions];
      copy[idx] = updated;
      setSubmissions(copy);
    } else {
      setSubmissions([updated, ...submissions]);
    }
  }

  function promptDeleteInquiry(item: ContactSubmission) {
    setInquiryToDelete(item);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteInquiry() {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${inquiryToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== inquiryToDelete.id));
        setDeleteModalOpen(false);
        setInquiryToDelete(null);
      }
    } catch {
      // Error
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSendTestPing(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: testName,
          senderEmail: testEmail,
          organization: testOrg,
          inquiryType: testCategory,
          subject: testSubject,
          message: testMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult({
          success: true,
          message: `Pipeline active: HTTP 200 received at ${data.timestamp || new Date().toISOString()}`,
        });
        const newEntry: ContactSubmission = {
          id: `sim-${Date.now()}`,
          sender_name: testName,
          sender_email: testEmail,
          organization: testOrg,
          inquiry_type: testCategory,
          subject: testSubject,
          message: testMessage,
          created_at: new Date().toISOString(),
          status: 'received',
        };
        setSubmissions([newEntry, ...submissions]);
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Pipeline request failed.',
        });
      }
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Network error testing contact pipeline.',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Pipeline Status Header */}
      <section className="bg-white border border-surface-border shadow-institutional p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-bronze-600" />
              <span>Protocol Correspondence &amp; Secretariat Pipeline</span>
            </h2>
            <p className="text-xs text-ink-500">
              Inbound diplomatic, academic, speaking, and media correspondence received via the bilingual /contact route.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {isSupabaseConfigured
                  ? 'Database Connected: public.contact_submissions'
                  : 'Local Persistence Active: .data/content-overrides.json'}
              </span>
            </span>
          </div>
        </div>

        {/* E2E Pipeline Simulator Form */}
        <form onSubmit={handleSendTestPing} className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="editorial-kicker">END-TO-END CONTACT PIPELINE TESTER</span>
            <Link
              href="/en/contact"
              className="text-xs text-bronze-600 hover:text-navy-900 underline font-mono"
            >
              Open Public /contact Form
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full h-10 px-3 bg-surface-paper border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full h-10 px-3 bg-surface-paper border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Organization
              </label>
              <input
                type="text"
                value={testOrg}
                onChange={(e) => setTestOrg(e.target.value)}
                className="w-full h-10 px-3 bg-surface-paper border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full h-10 px-3 bg-surface-paper border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
                Category
              </label>
              <select
                value={testCategory}
                onChange={(e) => setTestCategory(e.target.value)}
                className="w-full h-10 px-3 bg-surface-paper border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
              >
                <option value="Academic & Keynote Speaking">Academic &amp; Keynote Speaking</option>
                <option value="Institutional Book Acquisition">Institutional Book Acquisition</option>
                <option value="Research & Policy Collaboration">Research &amp; Policy Collaboration</option>
                <option value="Accredited Press & Media">Accredited Press &amp; Media</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-ink-500 mb-1">
              Message Content
            </label>
            <textarea
              rows={2}
              required
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full p-2.5 bg-surface-paper border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {sending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{sending ? 'Dispatching Ping...' : 'Dispatch E2E Test Ping'}</span>
            </button>

            {testResult && (
              <span
                className={`text-xs font-mono inline-flex items-center gap-1.5 ${
                  testResult.success ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{testResult.message}</span>
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Submissions Inbox Table / Log */}
      <section className="bg-white border border-surface-border shadow-institutional overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-navy-900">
            Recorded Protocol Inquiries ({submissions.length} Submissions)
          </h3>
          <span className="text-xs font-mono text-ink-500">Live Management</span>
        </div>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-paper border-b border-surface-border text-xs font-mono uppercase text-ink-500">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-paper/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-ink-500 whitespace-nowrap">
                      {sub.created_at?.slice(0, 10) || 'Recent'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy-900 text-xs">{sub.sender_name}</div>
                      <div className="text-[11px] font-mono text-ink-400">{sub.sender_email}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-ink-600">
                      {sub.organization || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-navy-950 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-surface-paper border border-surface-border">
                        {sub.inquiry_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-ink-700 max-w-xs truncate">
                      {sub.subject}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenInquiry(sub)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-mono border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="capitalize">{sub.status || 'Received'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenInquiry(sub)}
                          className="p-1.5 text-navy-900 hover:bg-surface-paper rounded transition-colors"
                          title="Review Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDeleteInquiry(sub)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Inquiry"
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
        ) : (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-ink-600">
              No protocol submissions recorded yet in the current session.
            </p>
            <p className="text-xs text-ink-400">
              Use the simulator above to submit a live test ping to verify end-to-end receipt.
            </p>
          </div>
        )}
      </section>

      {/* Review / Status Drawer */}
      <InquiryStatusDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        inquiry={selectedInquiry}
        onSaved={handleSavedInquiry}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteInquiry}
        title="Delete Protocol Inquiry"
        itemSummary={inquiryToDelete ? `Inquiry from ${inquiryToDelete.sender_name} (${inquiryToDelete.subject})` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
