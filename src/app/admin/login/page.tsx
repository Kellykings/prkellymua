'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, KeyRound, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin';

  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Access denied. Invalid credentials.');
      }

      router.push(nextUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex p-3 bg-navy-900 text-gold-400 shadow-institutional">
          <Shield className="w-8 h-8" />
        </div>
        <div className="editorial-kicker">SOVEREIGN EXECUTIVE CONSOLE</div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Editorial &amp; Governance Studio
        </h1>
        <p className="text-xs text-ink-500 max-w-sm mx-auto">
          Enter your authorized sovereign administrative passkey to access the editorial catalog, financial records, and protocol correspondence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white border border-surface-border p-6 sm:p-8 shadow-institutional space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="passkey"
                className="block text-xs font-mono uppercase tracking-wider text-ink-600 mb-1"
              >
                Administrative Passkey *
              </label>
              <div className="relative">
                <input
                  id="passkey"
                  type="password"
                  required
                  autoFocus
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter Passkey..."
                  className="w-full h-11 pl-10 pr-4 bg-surface-paper border border-surface-border text-sm font-mono text-navy-900 focus:outline-none focus:border-navy-900"
                />
                <KeyRound className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !passkey}
              className="w-full h-11 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Unlock Studio Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-surface-border text-center">
            <span className="text-[11px] font-mono text-ink-400">
              Zero-Trust Architecture · Session Protected with HMAC-SHA256
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sand-50 flex items-center justify-center">
          <div className="text-xs font-mono text-ink-500 uppercase tracking-widest">
            Loading Sovereign Console...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
