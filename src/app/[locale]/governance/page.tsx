import React from 'react';
import type { Metadata } from 'next';
import {
  getCareerEntries,
  getEducationCredentials,
  getExecutiveProfile,
} from '@/lib/data/repository';
import { GovernanceRegisterView } from '@/components/governance/GovernanceRegisterView';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Registre de Gouvernance Souveraine & Multilatérale | Pr Kelly Mua Kingsly'
      : 'Sovereign & Multilateral Governance Register | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Répertoire officiel des mandats statutaires du Pr Kelly Mua Kingsly : Direction des Opérations Financières de l’État (MINFI), Présidence du Conseil d’Administration (ATIDI), PNUD-FEM, COSUMAF et Chaires Académiques.'
      : 'Official statutory governance register of Professor Kelly Mua Kingsly: Director of Finance Operations of the State (MINFI), Board Chairman (ATIDI), UNDP-GEF Green Bonds, COSUMAF, and Academic Chairs.';

  return {
    title,
    description,
    keywords: [
      'Professor Kelly Mua Kingsly',
      'Kelly Mua Kingsley Governance',
      'ATIDI Board Chair',
      'MINFI Director Finance Operations',
      'COSUMAF Cameroon',
      'BEAC Censorship',
      'UNDP-GEF Green Bond Initiative',
      'Harvard Kennedy School MPA',
      'Forensic Accounting Cameroon',
    ],
    alternates: {
      canonical: `/${locale}/governance`,
      languages: {
        en: '/en/governance',
        fr: '/fr/governance',
      },
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/${locale}/governance`,
    },
  };
}

export default function GovernancePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const entries = getCareerEntries();
  const credentials = getEducationCredentials();
  const profile = getExecutiveProfile();

  // Generate Institutional JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.fullName,
      alternateName: profile.alternateName,
      honorificPrefix: 'Professor',
      honorificSuffix: profile.honorifics,
      jobTitle:
        locale === 'fr'
          ? 'Directeur des Opérations Financières de l’État & Président du Conseil ATIDI'
          : 'Director of Finance Operations of the State & ATIDI Board Chair',
      sameAs: [
        profile.coordinates.wikipedia,
        profile.coordinates.wikiGenius,
        profile.coordinates.linkedIn,
      ],
      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'Harvard University, John F. Kennedy School of Government',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'Charisma University',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'York Saint John University',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'University of Dschang',
        },
      ],
      hasOccupation: entries.map((entry) => ({
        '@type': 'Role',
        roleName: entry.role_title.en,
        startDate: entry.period.split('–')[0].trim(),
        endDate: entry.is_current ? undefined : entry.period.split('–')[1]?.trim(),
        description: entry.description.en,
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Search Engine Institutional Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <GovernanceRegisterView
        locale={locale}
        entries={entries}
        credentials={credentials}
        profile={profile}
      />
    </div>
  );
}
