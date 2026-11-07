import React from 'react';
import type { Metadata } from 'next';
import { Scale, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Charte d’Indépendance & Conformité Statutaire | Pr Kelly Mua Kingsly'
      : 'Statutory Independence & Ethics Charter | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Avertissement officiel sur la gouvernance, clause de non-affiliation et séparation stricte entre mandats souverains (MINFI, ATIDI, ENAM) et publications universitaires.'
      : 'Official governance disclaimer, institutional non-affiliation clause, and sovereign firewall separating public treasury duties from private academic research.';

  return {
    title,
    description,
    keywords: [
      'Legal Disclaimer Kelly Kingsly',
      'MINFI Institutional Non Affiliation',
      'ATIDI Board Governance Independence',
      'Cameroon Public Sector Ethics Charter',
    ],
    alternates: {
      canonical: `/${locale}/legal/disclaimer`,
      languages: {
        en: '/en/legal/disclaimer',
        fr: '/fr/legal/disclaimer',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/legal/disclaimer`,
    },
  };
}

export default function LegalDisclaimerPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900 text-gold-400 text-xs font-mono uppercase tracking-widest rounded-sm">
          <Scale className="w-3.5 h-3.5" />
          <span>
            {locale === 'fr'
              ? 'CONFORMITÉ DU SECTEUR PUBLIC & CLAUSE DE NON-AFFILIATION'
              : 'PUBLIC-SECTOR ETHICS, SOVEREIGN FIREWALL & LEGAL CHARTER'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900">
          {locale === 'fr'
            ? 'Avertissement Officiel sur la Gouvernance, les Affiliations et les Droits d’Auteur'
            : 'Official Governance, Institutional Non-Affiliation & Authorial Disclaimer'}
        </h1>
      </div>

      <div className="bg-white border border-surface-border p-6 sm:p-10 shadow-institutional space-y-8 text-sm sm:text-base text-ink-700 leading-relaxed rounded-sm">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-navy-900 font-serif font-bold text-xl">
            <ShieldAlert className="w-5 h-5 text-gold-600" />
            <h2>
              {locale === 'fr'
                ? '1. Séparation Stricte entre Fonctions Souveraines et Publications Académiques'
                : '1. Strict Firewall Between Sovereign Duties & Personal Academic Publications'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Ce site web (kellykingsly.com) est un portefeuille intellectuel personnel, un répertoire académique et une plateforme d’auteur exploités de manière indépendante. Il ne constitue en aucun cas un instrument de communication officiel du Ministère des Finances de la République du Cameroun (MINFI), de la Commission de Surveillance du Marché Financier de l’Afrique Centrale (COSUMAF), du Programme des Nations Unies pour le Développement (PNUD) ou de l’Agence pour l’Assurance du Commerce en Afrique (ATIDI).'
              : 'This website (kellykingsly.com) is an independent intellectual portfolio, academic repository, and author platform operated in a personal scholarly capacity on behalf of Professor Kelly Mua Kingsly. It does not represent an official communication instrument of the Ministry of Finance of the Republic of Cameroon (MINFI), the Central African Financial Market Supervisory Commission (COSUMAF), the United Nations Development Programme (UNDP), or the African Trade & Investment Development Insurance (ATIDI).'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-navy-900 font-serif font-bold text-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h2>
              {locale === 'fr'
                ? '2. Isolation Financière des Ventes d’Ouvrages et Droits d’Auteur'
                : '2. Commercial Isolation of Book Distribution & Author Royalties'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Toutes les transactions commerciales relatives aux ouvrages académiques (éditions numériques PDF/ePub et redirections vers Amazon, Barnes & Noble et Christian Faith Publishing) relèvent exclusivement de la propriété intellectuelle privée de l’auteur et sont intégralement isolées des comptes publics et de la trésorerie de l’État.'
              : 'All commercial transactions relating to published books (including direct digital PDF/ePub fulfillment and third-party retail links to Amazon, Barnes & Noble, and Christian Faith Publishing) are processed exclusively through private publishing channels and are strictly isolated from state treasury accounts and public-sector resources.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-navy-900 font-serif font-bold text-xl">
            <Lock className="w-5 h-5 text-navy-900" />
            <h2>
              {locale === 'fr'
                ? '3. Protection des Données, Sécurité RLS et Vérification Éditoriale'
                : '3. Data Protection, Row-Level Security (RLS) & Editorial Verification'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Les données soumises via le formulaire de protocole ou lors de l’achat d’éditions numériques sont protégées par les politiques de sécurité au niveau des lignes (PostgreSQL RLS) et ne sont jamais cédées à des tiers.'
              : 'Information submitted through the protocol contact form or direct digital bookstore checkout is protected by Supabase PostgreSQL Row-Level Security (RLS) policies and strict Content Security Policy (CSP) headers.'}
          </p>
        </section>
      </div>
    </div>
  );
}
