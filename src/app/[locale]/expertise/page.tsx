import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getExpertisePillars } from '@/lib/data/repository';
import { t } from '@/lib/utils';
import type { Locale } from '@/types/domain';

function renderWithAbbr(text: string, locale: Locale) {
  const acronyms: Record<string, { en: string; fr: string }> = {
    ATIDI: {
      en: 'African Trade & Investment Development Insurance',
      fr: 'Agence pour l’Assurance du Commerce en Afrique (ATIDI)',
    },
    MINFI: {
      en: 'Ministry of Finance (Cameroon)',
      fr: 'Ministère des Finances (Cameroun)',
    },
    ENAM: {
      en: 'National School of Administration and Magistracy (Yaoundé)',
      fr: 'École Nationale d’Administration et de Magistrature (Yaoundé)',
    },
    BEAC: {
      en: 'Bank of Central African States',
      fr: 'Banque des États de l’Afrique Centrale',
    },
    COSUMAF: {
      en: 'Central African Financial Market Surveillance Commission',
      fr: 'Commission de Surveillance du Marché Financier de l’Afrique Centrale',
    },
    BVMAC: {
      en: 'Central African Unified Stock Exchange',
      fr: 'Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC)',
    },
    CEMAC: {
      en: 'Central African Economic and Monetary Community',
      fr: 'Communauté Économique et Monétaire de l’Afrique Centrale',
    },
    TSA: {
      en: 'Treasury Single Account',
      fr: 'Compte Unique du Trésor (CUT)',
    },
    CUT: {
      en: 'Compte Unique du Trésor (Treasury Single Account)',
      fr: 'Compte Unique du Trésor',
    },
    'UNDP-GEF': {
      en: 'United Nations Development Programme – Global Environment Facility',
      fr: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial (PNUD-FEM)',
    },
    'PNUD-FEM': {
      en: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial',
      fr: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial',
    },
    ICMA: {
      en: 'International Capital Market Association',
      fr: 'Association Internationale des Marchés de Capitaux',
    },
    AML: {
      en: 'Anti-Money Laundering',
      fr: 'Lutte Contre le Blanchiment de Capitaux (LCB-FT)',
    },
    'LCB-FT': {
      en: 'Lutte Contre le Blanchiment et le Financement du Terrorisme',
      fr: 'Lutte Contre le Blanchiment et le Financement du Terrorisme',
    },
    DFI: {
      en: 'Development Finance Institution',
      fr: 'Institution Financière de Développement (IFD)',
    },
    IFD: {
      en: 'Institution Financière de Développement',
      fr: 'Institution Financière de Développement',
    },
    OTA: {
      en: 'Obligations du Trésor Assimilables (Treasury Bonds)',
      fr: 'Obligations du Trésor Assimilables',
    },
    BTA: {
      en: 'Bons du Trésor Assimilables (Treasury Bills)',
      fr: 'Bons du Trésor Assimilables',
    },
    DSA: {
      en: 'Debt Sustainability Analysis',
      fr: 'Analyse de Viabilité de la Dette (AVD)',
    },
    AVD: {
      en: 'Analyse de Viabilité de la Dette',
      fr: 'Analyse de Viabilité de la Dette',
    },
  };

  const regex = /(ATIDI|MINFI|ENAM|BEAC|COSUMAF|BVMAC|CEMAC|TSA|CUT|UNDP-GEF|PNUD-FEM|ICMA|AML|LCB-FT|DFI|IFD|OTA|BTA|DSA|AVD)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const acronymData = acronyms[part];
    if (acronymData) {
      return (
        <abbr
          key={index}
          title={acronymData[locale]}
          className="no-underline cursor-help border-b border-dotted border-current/50 hover:border-bronze-600 transition-colors"
        >
          {part}
        </abbr>
      );
    }
    return part;
  });
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Piliers d’Expertise & Autorité Technique | Pr Kelly Mua Kingsly'
      : 'Pillars of Technical & Scholarly Authority | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Domaines d’autorité scientifique et opérationnelle : finances publiques, marchés financiers de la CEMAC, finance climatique & ESG, gestion de la dette souveraine et audit judiciaire.'
      : 'Core domains of executive statecraft and technical authority: public financial management, CEMAC capital markets, climate finance & ESG, sovereign debt architecture, and forensic investigations.';

  return {
    title,
    description,
    keywords: [
      'Public Financial Management Cameroon',
      'CEMAC Capital Markets Kingsly',
      'Forensic Auditing Central Africa',
      'Climate Finance ESG Africa',
      'Sovereign Debt Restructuring Expert',
      'Professor Kelly Mua Kingsly Expertise',
    ],
    alternates: {
      canonical: `/${locale}/expertise`,
      languages: {
        en: '/en/expertise',
        fr: '/fr/expertise',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/expertise`,
    },
  };
}

export default function ExpertisePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const pillars = getExpertisePillars();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'fr'
        ? 'Domaines d’Expertise Scientifique & Technique — Pr Kelly Mua Kingsly'
        : 'Areas of Technical & Scholarly Authority — Professor Kelly Mua Kingsly',
    description:
      locale === 'fr'
        ? 'Finances publiques, marchés des capitaux, finance climatique et audit judiciaire'
        : 'Public finance, capital markets, climate finance, and forensic audit authority',
    url: `https://kellykingsly.com/${locale}/expertise`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pillars.length,
      itemListElement: pillars.map((pillar, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Specialty',
          name: t(pillar.title, locale),
          description: t(pillar.summary, locale),
          author: {
            '@type': 'Person',
            name: 'Professor Kelly Mua Kingsly',
          },
        },
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl space-y-4">
        <div className="editorial-kicker">
          {locale === 'fr'
            ? 'DOMAINES D’EXPERTISE SCIENTIFIQUE ET TECHNIQUE'
            : 'AREAS OF TECHNICAL & SCHOLARLY AUTHORITY'}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif font-semibold text-navy-900 leading-[1.15]">
          {locale === 'fr'
            ? 'Finances Publiques, Marchés des Capitaux, Finance Climatique & Audit Judiciaire'
            : 'Public Finance, Capital Markets, Climate Finance & Forensic Investigation'}
        </h1>
        <p className="text-ink-700 text-base sm:text-[17px] leading-relaxed">
          {locale === 'fr'
            ? 'Chaque pilier combine la direction opérationnelle au sein des institutions financières avec la recherche empirique et l’enseignement supérieur.'
            : 'Each domain integrates executive statecraft and multilateral board governance with peer-reviewed academic literature and forensic audit methodology.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((pillar, index) => (
          <section
            key={pillar.id}
            id={`pillar-${index + 1}`}
            className="scroll-mt-24 bg-white border border-surface-border p-7 shadow-institutional flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.06em] px-2.5 py-1 bg-navy-900 text-gold-400">
                  {locale === 'fr'
                    ? `Domaine 0${index + 1}`
                    : `Pillar 0${index + 1}`}{' '}
                  · {t(pillar.metrics_label, locale)}
                </span>
              </div>
              <h2 className="text-2xl font-serif font-semibold text-navy-900 leading-snug">
                {t(pillar.title, locale)}
              </h2>
              <div className="text-xs font-semibold uppercase tracking-[0.06em] text-bronze-600">
                {t(pillar.subtitle, locale)}
              </div>
              <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
                {renderWithAbbr(t(pillar.summary, locale), locale)}
              </p>

              <div className="pt-2 space-y-2">
                {pillar.key_mandates.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-ink-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-bronze-600 shrink-0 mt-2" />
                    <span>{renderWithAbbr(t(m, locale), locale)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <Link
                href={`/${locale}/books`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
              >
                <span>
                  {locale === 'fr'
                    ? 'Ouvrages associés'
                    : 'Related published books'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors"
              >
                <span>
                  {locale === 'fr' ? 'Notes de politique' : 'Policy briefs'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        ))}
      </div>

      {/* Institutional Cross-Pathways Bar (Zero-Duplicate Cross-Reference) */}
      <section className="bg-surface-paper border border-surface-border p-6 sm:p-8 rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-navy-900">
              {locale === 'fr'
                ? 'Mandats Institutionnels & Biographie Intellectuelle'
                : 'Statutory Directorships & Intellectual Biography'}
            </h3>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              {locale === 'fr'
                ? 'Consultez les 20 fonctions officielles d’État et la doctrine de gouvernance appuyant ces domaines d’autorité.'
                : 'Review the 20 official sovereign offices and fiduciary doctrine underpinning these technical authority domains.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/governance`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-gold-300 font-semibold text-xs transition-colors rounded-sm"
            >
              <span>{locale === 'fr' ? 'Registre des 20 Mandats' : 'Mandates Register (20 Offices)'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-surface-paper border border-surface-border text-navy-900 font-semibold text-xs transition-colors rounded-sm"
            >
              <span>{locale === 'fr' ? 'Biographie & Doctrine' : 'Biography & Doctrine'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
