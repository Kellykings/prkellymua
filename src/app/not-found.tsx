import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, Home, Mail } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col justify-between">
      {/* Top Banner Bar */}
      <header className="border-b border-white/10 px-6 py-4 bg-navy-950/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/en"
            className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
          >
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

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <Link
              href="/en"
              className="hover:text-gold-400 transition-colors px-2 py-1 font-medium"
            >
              English
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/fr"
              className="hover:text-gold-400 transition-colors px-2 py-1 font-medium"
            >
              Français
            </Link>
          </div>
        </div>
      </header>

      {/* Main 404 Institutional Plaque */}
      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 · Resource Not Found / Page Introuvable</span>
        </div>

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
            Institutional Record Not Found
          </h1>
          <p className="text-lg sm:text-xl font-serif italic text-gold-400/90">
            « La ressource institutionnelle sollicitée n’a pas été trouvée dans les archives officielles. »
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto pt-2">
            The page, treatise slug, or policy monograph you requested may have moved or been archived. Please verify the URL or explore our primary official registries below.
          </p>
        </div>

        {/* Quick Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-4 text-left">
          <Link
            href="/en/books"
            className="p-5 bg-navy-950/70 border border-white/10 hover:border-gold-500/50 transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between text-gold-400">
              <BookOpen className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-serif font-bold text-white text-base">Books & Treatises</div>
            <div className="text-xs text-slate-400">
              11 monographic works on sovereign debt, forensics & capital markets.
            </div>
          </Link>

          <Link
            href="/en/governance"
            className="p-5 bg-navy-950/70 border border-white/10 hover:border-gold-500/50 transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between text-gold-400">
              <Compass className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-serif font-bold text-white text-base">Governance Register</div>
            <div className="text-xs text-slate-400">
              Sovereign mandates, ATIDI board chair, and multilateral dossiers.
            </div>
          </Link>

          <Link
            href="/en/contact"
            className="p-5 bg-navy-950/70 border border-white/10 hover:border-gold-500/50 transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between text-gold-400">
              <Mail className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-serif font-bold text-white text-base">Protocol Contact</div>
            <div className="text-xs text-slate-400">
              Direct institutional channel for speaking invitations and state inquiries.
            </div>
          </Link>
        </div>

        {/* Primary Home Action */}
        <div className="pt-4">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm transition-colors shadow-elevated"
          >
            <Home className="w-4 h-4" />
            <span>Return to Official Homepage / Accueil Officiel</span>
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
