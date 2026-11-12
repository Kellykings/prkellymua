import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/types/domain';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-white/10 mt-auto">
      {/* Statutory Affiliation & Ethical Firewall Notice — Editorial Architectural Strip */}
      <div className="bg-navy-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="border-l-2 border-gold-500 pl-4 sm:pl-6 space-y-2 max-w-4xl">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-gold-400">
              {dict.disclaimer.badge} — {dict.disclaimer.title}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {dict.disclaimer.text}
            </p>
            <div className="pt-1">
              <Link
                href={`/${locale}/legal/disclaimer`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gold-400 hover:text-gold-300 underline underline-offset-4"
              >
                <span>{dict.disclaimer.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Executive Identity */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 bg-navy-900 border border-gold-500/50 flex items-center justify-center p-1 rounded-xs overflow-hidden">
                <Image
                  src="/logos/03-emblem-only.webp"
                  alt="KMK Sovereign Seal"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-serif font-bold text-base sm:text-lg text-white">
                  Professor Kelly Mua Kingsly
                </div>
                <div className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                  PhD · DBA · MPA · CFA
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {locale === 'fr'
                ? 'Portail intellectuel, archive biographique de référence et plateforme de publication scientifique dédiés aux finances publiques, aux marchés des capitaux et à l’audit judiciaire.'
                : 'Authoritative intellectual archive, biographical record, and scholarly publishing platform dedicated to public financial management, capital markets, and forensic accounting.'}
            </p>
          </div>

          {/* Column 2: Directory */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-gold-400">
              {dict.footer.navigation}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/governance`} className="hover:text-white transition-colors">
                  {dict.nav.governance}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/expertise`} className="hover:text-white transition-colors">
                  {dict.nav.expertise}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/books`} className="hover:text-white transition-colors">
                  {dict.nav.books}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">
                  {dict.nav.blog}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/media`} className="hover:text-white transition-colors">
                  {dict.nav.media}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#gallery`} className="hover:text-white transition-colors">
                  {locale === 'fr' ? 'Événements & Galerie' : 'Events & Gallery'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Compliance Policies */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-gold-400">
              {dict.footer.compliance}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link
                  href={`/${locale}/legal/disclaimer`}
                  className="hover:text-white transition-colors block"
                >
                  {locale === 'fr'
                    ? 'Charte d’Indépendance & Non-Affiliation'
                    : 'Independence & Non-Affiliation Charter'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal/privacy`}
                  className="hover:text-white transition-colors block"
                >
                  {locale === 'fr'
                    ? 'Politique de Confidentialité & Protection des Données'
                    : 'Privacy Policy & Data Protection'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal/terms`}
                  className="hover:text-white transition-colors block"
                >
                  {locale === 'fr'
                    ? 'Conditions de Vente & Propriété Intellectuelle'
                    : 'Terms of Sale & Intellectual Property'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal/refunds`}
                  className="hover:text-white transition-colors block"
                >
                  {locale === 'fr'
                    ? 'Livraison Numérique & Politique de Remboursement'
                    : 'Digital Delivery & Refund Policy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Professor Kelly Mua Kingsly. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              href={`/${locale}/legal/disclaimer`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {locale === 'fr' ? 'Éthique Statutaire' : 'Statutory Ethics'}
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href={locale === 'en' ? '/fr' : '/en'}
              className="text-gold-400 hover:underline"
            >
              {locale === 'en' ? 'Passer en Français' : 'Switch to English'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
