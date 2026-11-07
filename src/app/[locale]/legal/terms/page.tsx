import React from 'react';
import type { Metadata } from 'next';
import { BookOpen, ShieldCheck, Scale, Award } from 'lucide-react';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Conditions de Vente & Droits d’Auteur | Pr Kelly Mua Kingsly'
      : 'Terms of Sale & Scholarly Copyright | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Conditions générales régissant l’achat d’éditions numériques, droits de propriété intellectuelle (OAPI / Berne) et licences académiques.'
      : 'Terms governing digital treatise acquisition, intellectual property rights (OAPI / Berne Convention), and academic licensing protocols.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/legal/terms`,
      languages: {
        en: '/en/legal/terms',
        fr: '/fr/legal/terms',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/legal/terms`,
    },
  };
}

export default function TermsOfSalePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="space-y-4">
        <div className="editorial-kicker">
          {locale === 'fr'
            ? 'CONDITIONS DE VENTE & PROPRIÉTÉ INTELLECTUELLE'
            : 'TERMS OF SALE & INTELLECTUAL PROPERTY'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 leading-tight">
          {locale === 'fr'
            ? 'Conditions Générales de Vente et Droits d’Auteur'
            : 'Terms of Commercial Sale & Scholarly Copyright'}
        </h1>
        <p className="text-sm font-mono text-ink-400">
          {locale === 'fr'
            ? 'Dernière révision statutaire : 31 octobre 2026'
            : 'Last statutory review: 31 October 2026'}
        </p>
      </div>

      <div className="bg-white border border-surface-border p-6 sm:p-10 shadow-institutional space-y-8 text-sm sm:text-base text-ink-700 leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <Award className="w-5 h-5 text-bronze-600 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '1. Propriété Intellectuelle et Droits Réservés'
                : '1. Moral Rights & Copyright Ownership'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'L’ensemble des monographies, traités académiques, guides d’audit judiciaire et notes de politique publiés sur kellykingsly.com sont la propriété intellectuelle exclusive du Professeur Kelly Mua Kingsly, protégée par l’Accord de Bangui (OAPI), la Convention de Berne et les traités internationaux sur les droits d’auteur.'
              : 'All published reference volumes, treatises, forensic checklists, and policy monographs hosted on kellykingsly.com represent the exclusive intellectual property of Professor Kelly Mua Kingsly, protected under the Bangui Agreement (OAPI), the Berne Convention, and international copyright treaties.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <BookOpen className="w-5 h-5 text-navy-900 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '2. Licence d’Utilisation des Éditions Numériques'
                : '2. Single-User Scholarly Digital License'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'L’acquisition d’une édition numérique (PDF ou ePub) confère à l’acquéreur une licence personnelle, non exclusive et incessible pour un usage académique, professionnel ou de recherche individuelle. Toute redistribution commerciale, reproduction intégrale non autorisée ou mise en ligne publique est strictement interdite.'
              : 'Direct acquisition of digital editions (PDF or ePub) grants the purchaser a perpetual, single-user, non-exclusive, non-transferable license for personal, academic, or professional research use. Bulk institutional distribution, unauthorized reproduction, or public web sharing is strictly prohibited.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '3. Prix, Devises et Modalités de Règlement'
                : '3. Pricing, Currencies & Settlement'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Les prix sont indiqués en dollars américains (USD) et en francs CFA (XAF) pour la zone CEMAC. Le règlement s’effectue de manière sécurisée par carte bancaire internationale ou solutions de paiement mobile agréées, via nos prestataires certifiés PCI-DSS.'
              : 'Prices are listed in USD and XAF (CEMAC zone). Settlement is executed securely via international payment cards and authorized digital payment rails powered by PCI-DSS certified payment gateways.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <Scale className="w-5 h-5 text-navy-900 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '4. Droit Applicable et Juridiction Compétente'
                : '4. Governing Law & Dispute Resolution'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Les présentes conditions de vente sont régies par les règles du droit commercial et de la propriété intellectuelle. Tout différend relatif à une acquisition sera soumis à une médiation amiable préalable avant toute juridiction compétente.'
              : 'These terms are governed by standard international commercial copyright principles. Any disputes arising from transactions will be subject to amicable conciliation prior to formal jurisdiction.'}
          </p>
        </section>
      </div>
    </div>
  );
}
