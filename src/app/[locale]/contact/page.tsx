import React from 'react';
import type { Metadata } from 'next';
import { ContactFormView } from '@/components/contact/ContactFormView';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Protocole & Secrétariat Académique | Pr Kelly Mua Kingsly'
      : 'Protocol & Academic Secretariat | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Canal officiel pour les invitations à des conférences internationales, collaborations scientifiques, commandes d’ouvrages institutionnelles et demandes de presse.'
      : 'Official contact channel for international keynote invitations, academic research collaborations, institutional bulk book acquisitions, and accredited media requests.';

  return {
    title,
    description,
    keywords: [
      'Contact Professor Kelly Mua Kingsly',
      'Speaking Engagement Kelly Kingsly',
      'Academic Secretariat Protocol',
      'Keynote Speaker Public Finance Africa',
    ],
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        fr: '/fr/contact',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/contact`,
    },
  };
}

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name:
      locale === 'fr'
        ? 'Secrétariat Académique & Protocolaire — Pr Kelly Mua Kingsly'
        : 'Academic & Editorial Secretariat — Professor Kelly Mua Kingsly',
    description:
      locale === 'fr'
        ? 'Canal protocolaire pour conférences, recherches et commandes'
        : 'Protocol channel for conferences, academic research, and inquiries',
    url: `https://kellykingsly.com/${locale}/contact`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactFormView locale={locale} />
    </>
  );
}
