'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, ShieldAlert } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception digest for monitoring
    if (error) {
      console.error('Platform runtime boundary exception:', error.message, error.digest);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col justify-between">
      {/* Top Banner Bar */}
      <header className="border-b border-white/10 px-6 py-4 bg-navy-950/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/en" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-navy-950 border border-gold-500/60 flex items-center justify-center font-serif font-semibold text-gold-400 text-sm tracking-wider">
              KMK
            </div>
            <div>
              <div className="font-serif font-semibold text-base text-white">
                Prof. Kelly Mua Kingsly
              </div>
              <div className="text-[11px] text-gold-400 tracking-wide">
                Public Finance & Governance Platform
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Error Plaque */}
      <main className="max-w-2xl mx-auto px-6 py-16 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>System Boundary · Runtime Interruption</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Unexpected Exception Encountered
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-gold-400/90">
            « Une interruption inattendue est survenue lors du chargement de cette ressource. »
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            Our institutional resilience safeguards have contained this fault. You may retry the operation or return to the official homepage.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-slate-400 bg-navy-950/80 px-3 py-1.5 border border-white/10 inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm transition-colors shadow-elevated w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Operation / Réessayer</span>
          </button>

          <Link
            href="/en"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 text-white border border-white/30 hover:border-gold-400 font-medium text-sm transition-colors w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Official Homepage / Accueil</span>
          </Link>
        </div>
      </main>

      {/* Diplomatic Footer */}
      <footer className="border-t border-white/10 px-6 py-4 bg-navy-950/80 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Professor Kelly Mua Kingsly. All official rights reserved.
      </footer>
    </div>
  );
}
