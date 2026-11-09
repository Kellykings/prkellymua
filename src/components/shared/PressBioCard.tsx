'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, FileText, UserCheck } from 'lucide-react';
import type { Locale } from '@/types/domain';

interface PressBioCardProps {
  locale: Locale;
}

export function PressBioCard({ locale }: PressBioCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bios = {
    short: {
      label: locale === 'fr' ? 'Notice 50 Mots (Brève)' : '50-Word Bio (Brief)',
      text:
        locale === 'fr'
          ? 'Le Professeur Kelly Mua Kingsly (PhD, CFA) est un ingénieur financier et spécialiste de la finance climat. Il dirige les Opérations Financières de l’État au Ministère des Finances du Cameroun, préside le Conseil d’Administration de l’ATIDI et enseigne les finances publiques à l’ENAM. Diplômé de la Harvard Kennedy School, il est l’auteur de dix ouvrages en audit judiciaire, criminalité financière et marchés de capitaux.'
          : 'Professor Kelly Mua Kingsly (PhD, CFA) is a finance engineer and climate finance specialist. He directs State Finance Operations at Cameroon’s Ministry of Finance, chairs the Board of ATIDI, and teaches public finance at ENAM. A Harvard Kennedy School alumnus, he has published ten works on forensic accounting, financial crime and capital markets.',
    },
    standard: {
      label: locale === 'fr' ? 'Notice 100 Mots (Standard)' : '100-Word Bio (Standard)',
      text:
        locale === 'fr'
          ? 'Le Professeur Kelly Mua Kingsly (PhD, CFA) est un ingénieur financier, haut responsable des finances publiques et spécialiste de la finance climat fort de plus de vingt-cinq ans d’expérience dans la gestion du trésor souverain, la gouvernance multilatérale des risques et l’audit judiciaire. Il dirige les Opérations Financières de l’État au Ministère des Finances du Cameroun, préside le Conseil d’Administration de l’ATIDI et enseigne à l’ENAM. Diplômé de la Harvard Kennedy School et Chevalier de l’Ordre National de la Valeur, il a auparavant exercé plus de quinze ans au Programme des Nations Unies pour le Développement (PNUD) et publié dix traités de référence sur la finance forensique et les marchés de capitaux.'
          : 'Professor Kelly Mua Kingsly (PhD, CFA) is a finance engineer, public finance executive, and climate finance specialist with over twenty-five years of experience spanning sovereign treasury administration, multilateral risk governance, and forensic accounting. He currently serves as Director of State Finance Operations at Cameroon’s Ministry of Finance, Board Chairman of the African Trade & Investment Development Insurance (ATIDI), and Senior Lecturer at ENAM. A Harvard Kennedy School alumnus and Knight of the National Order of Valor, he previously spent over fifteen years with the United Nations Development Programme (UNDP) and has authored ten reference treatises on forensic finance and capital markets.',
    },
  };

  const handleCopy = async (key: 'short' | 'standard', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  return (
    <div className="bg-white border border-surface-border p-6 sm:p-8 rounded-sm shadow-institutional space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="editorial-kicker">
            {locale === 'fr' ? 'KIT PRESSE & PROTOCOLE' : 'PRESS & PROTOCOL KIT'}
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'Notices Biographiques Officielles'
              : 'Approved Institutional Biographies'}
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 mt-0.5">
            {locale === 'fr'
              ? 'Textes de référence validés pour programmes de conférences, présentations diplomatiques et rédactions.'
              : 'Standardized and approved texts for conference programs, summit bios, and media introductions.'}
          </p>
        </div>

        <a
          href="/images/photos/about.jpg"
          download="Prof_Kelly_Mua_Kingsly_Official_Portrait.jpg"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-semibold rounded-sm transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {locale === 'fr' ? 'Télécharger le Portrait (HD)' : 'Download Official Portrait'}
          </span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 50-Word Bio */}
        <div className="bg-surface-light border border-surface-border p-5 rounded-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-mono uppercase tracking-wider text-bronze-600 inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                {bios.short.label}
              </span>
              <button
                type="button"
                onClick={() => handleCopy('short', bios.short.text)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-surface-paper border border-surface-border text-[11px] font-semibold text-navy-900 transition-colors rounded-sm"
                aria-label={locale === 'fr' ? 'Copier la notice 50 mots' : 'Copy 50-word bio'}
              >
                {copiedKey === 'short' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-700">{locale === 'fr' ? 'Copié !' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-ink-500" aria-hidden="true" />
                    <span>{locale === 'fr' ? 'Copier' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-ink-800 leading-relaxed font-sans">
              {bios.short.text}
            </p>
          </div>
          <div className="text-[10px] font-mono text-ink-500 border-t border-surface-border/60 pt-2">
            {locale === 'fr'
              ? 'Recommandé pour brochures synthétiques, cartouches d’intervenants et signatures courtes.'
              : 'Ideal for printed programs, quick speaker intros, and broadcast lower-thirds.'}
          </div>
        </div>

        {/* 100-Word Bio */}
        <div className="bg-surface-light border border-surface-border p-5 rounded-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold font-mono uppercase tracking-wider text-navy-900 inline-flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-gold-500" aria-hidden="true" />
                {bios.standard.label}
              </span>
              <button
                type="button"
                onClick={() => handleCopy('standard', bios.standard.text)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-surface-paper border border-surface-border text-[11px] font-semibold text-navy-900 transition-colors rounded-sm"
                aria-label={locale === 'fr' ? 'Copier la notice 100 mots' : 'Copy 100-word bio'}
              >
                {copiedKey === 'standard' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-700">{locale === 'fr' ? 'Copié !' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-ink-500" aria-hidden="true" />
                    <span>{locale === 'fr' ? 'Copier' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-ink-800 leading-relaxed font-sans">
              {bios.standard.text}
            </p>
          </div>
          <div className="text-[10px] font-mono text-ink-500 border-t border-surface-border/60 pt-2">
            {locale === 'fr'
              ? 'Notice complète pour dossiers de presse, modérations plénières et présentations officielles.'
              : 'Standard edition for diplomatic dossiers, symposium programs, and keynote briefings.'}
          </div>
        </div>
      </div>
    </div>
  );
}
