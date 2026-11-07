import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Globe, Shield } from 'lucide-react';
import { AdminLogoutButton } from './AdminLogoutButton';

export function AdminHeader() {
  return (
    <header className="bg-navy-950 text-white border-b-2 border-gold-500/40 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded bg-gold-500/20 text-gold-400 border border-gold-500/40 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-base sm:text-lg leading-tight truncate">
              Editorial, Governance &amp; E-Commerce Studio
            </div>
            <div className="text-[11px] font-mono text-gold-400/90 truncate flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>PROF. KELLY MUA KINGSLY · RLS GOVERNANCE CONSOLE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <AdminLogoutButton />
          <Link
            href="/fr"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-navy-900 border border-gold-500/30 text-gold-300 hover:text-white rounded-sm transition-colors"
          >
            <Globe className="w-3 h-3" />
            <span>Portail FR</span>
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold font-mono uppercase tracking-wider rounded-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
