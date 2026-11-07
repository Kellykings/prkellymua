'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X, ArrowRight } from 'lucide-react';
import type { Locale } from '@/types/domain';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname() || `/${locale}`;
  const dict = getDictionary(locale);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Condense sticky header on scroll (Audit P1-3)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background body scroll and bind ESC key when mobile drawer is active
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const alternateLocale: Locale = locale === 'en' ? 'fr' : 'en';
  const switchedPath = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, `/${alternateLocale}`)
    : `/${alternateLocale}`;

  const navItems = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/governance`, label: dict.nav.governance },
    { href: `/${locale}/expertise`, label: dict.nav.expertise },
    { href: `/${locale}/books`, label: dict.nav.books },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/media`, label: dict.nav.media },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <>
      {/* WCAG 2.2 Skip to Content Navigation Anchor */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-navy-950 focus:font-semibold focus:shadow-elevated"
      >
        {locale === 'fr' ? 'Passer au contenu principal' : 'Skip to main content'}
      </a>

      {/* Non-sticky Top Utility Bar — Scrolls away */}
      <div className="bg-navy-950 border-b border-white/5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-end">
          <Link
            href={`/${locale}/legal/disclaimer`}
            className="text-xs text-slate-400 hover:text-gold-300 transition-colors"
          >
            {dict.topbar.ethicsNotice}
          </Link>
        </div>
      </div>

      {/* Main Sticky Navigation Header — Condenses to 64px on scroll */}
      <header
        className={`sticky top-0 z-50 bg-navy-900/98 backdrop-blur-md text-white border-b border-white/10 transition-shadow duration-200 ${
          isScrolled ? 'shadow-elevated' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-2 transition-all duration-200 ${
              isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-[72px]'
            }`}
          >
            {/* Executive Identity: Logo Box + Name (No Truncation of Person's Name) */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 p-1.5 shrink-0 bg-navy-950 border border-gold-500/50 flex items-center justify-center font-serif font-semibold text-gold-400 text-sm sm:text-base tracking-wider group-hover:border-gold-300 transition-colors">
                KMK
              </div>
              <div>
                <div className="font-serif font-semibold text-sm sm:text-base md:text-lg tracking-normal text-white whitespace-nowrap">
                  Prof. Kelly Mua Kingsly
                </div>
                <div className="hidden sm:block text-xs tracking-wide text-gold-400 whitespace-nowrap">
                  {locale === 'fr' ? 'Finances publiques & Gouvernance' : 'Public Finance & Governance'}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links — Plain text links with gold active underline */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2"
              aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}
            >
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-white font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-gold-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Compact Language Switcher & Hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={switchedPath}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-2.5 sm:px-3 border border-white/15 bg-navy-950/60 text-xs font-semibold text-slate-200 hover:border-gold-400 hover:text-gold-300 active:scale-95 transition-all shrink-0 touch-target"
                aria-label={alternateLocale === 'fr' ? 'Passer en français' : 'Switch to English'}
              >
                <Globe className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="sm:hidden">{alternateLocale.toUpperCase()}</span>
                <span className="hidden sm:inline">
                  {alternateLocale === 'fr' ? 'Français' : 'English'}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 border border-white/15 bg-navy-950/60 text-slate-200 hover:text-white hover:border-gold-400 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2 transition-all touch-target shrink-0"
                aria-expanded={mobileMenuOpen}
                aria-label={
                  locale === 'fr' ? 'Ouvrir ou fermer le menu de navigation' : 'Toggle navigation menu'
                }
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gold-400" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Modal Navigation Drawer — Solid, Fully Opaque Background */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 sm:top-[72px] z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <div
              className="fixed inset-x-0 top-16 sm:top-[72px] z-50 lg:hidden bg-navy-950 border-t border-white/10 shadow-2xl h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4.5rem)] overflow-y-auto flex flex-col justify-between pb-safe"
              style={{ backgroundColor: '#071016' }}
            >
              <div className="px-4 pt-3 pb-6 bg-navy-950">
                <div className="divide-y divide-white/10 border-y border-white/10 bg-navy-950">
                  <Link
                    href={`/${locale}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between min-h-[52px] py-3.5 px-3 text-base font-semibold transition-colors ${
                      pathname === `/${locale}`
                        ? 'text-gold-400 bg-white/5'
                        : 'text-white hover:text-gold-300 active:bg-white/5'
                    }`}
                  >
                    <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
                  </Link>

                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between min-h-[52px] py-3.5 px-3 text-base font-medium transition-colors ${
                          isActive
                            ? 'text-gold-400 font-semibold bg-white/5'
                            : 'text-slate-100 hover:text-white active:bg-white/5'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Institutional Ledger */}
              <div className="p-4 mt-auto border-t border-white/10 bg-navy-900 text-xs text-slate-300">
                <Link
                  href={`/${locale}/legal/disclaimer`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] py-2 text-gold-400 font-medium hover:underline"
                >
                  <span>{dict.hero.independenceLink}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
