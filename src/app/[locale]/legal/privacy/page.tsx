import React from 'react';
import type { Metadata } from 'next';
import { Shield, Lock, EyeOff, FileText } from 'lucide-react';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Politique de Confidentialité & Données | Pr Kelly Mua Kingsly'
      : 'Privacy Policy & Data Governance | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Principes directeurs de protection des données, sécurité PostgreSQL RLS, chiffrement des transactions et droits d’accès sur la plateforme du Pr Kelly Mua Kingsly.'
      : 'Data protection principles, PostgreSQL Row-Level Security, transactional encryption, and data rights on the platform of Professor Kelly Mua Kingsly.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/legal/privacy`,
      languages: {
        en: '/en/legal/privacy',
        fr: '/fr/legal/privacy',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/legal/privacy`,
    },
  };
}

export default function PrivacyPolicyPage({
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
            ? 'PROTECTION DE LA VIE PRIVÉE & DONNÉES PERSONNELLES'
            : 'PRIVACY POLICY & DATA PROTECTION'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 leading-tight">
          {locale === 'fr'
            ? 'Politique de Confidentialité et Traitement des Données'
            : 'Privacy Policy & Personal Data Governance'}
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
            <Shield className="w-5 h-5 text-bronze-600 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '1. Principes Directeurs et Cadre Légal'
                : '1. Core Principles & Statutory Compliance'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'La plateforme académique et éditoriale du Professeur Kelly Mua Kingsly respecte les normes les plus strictes de protection des données, conformément au cadre réglementaire de l’Union Africaine (Convention de Malabo sur la cybersécurité et la protection des données à caractère personnel) et aux principes universels du RGPD.'
              : 'The academic and author platform of Professor Kelly Mua Kingsly adheres to rigorous data protection standards in alignment with the African Union Convention on Cyber Security and Personal Data Protection (Malabo Convention) and international data governance principles.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <Lock className="w-5 h-5 text-navy-900 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '2. Données Collectées et Finalité Exclusives'
                : '2. Collected Data & Exclusive Purposes'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Nous collectons uniquement les informations strictement nécessaires à la finalisation de vos commandes d’ouvrages (adresse électronique pour la transmission du reçu et du jeton de téléchargement sécurisé de 72h) ou à l’acheminement de vos requêtes institutionnelles via le formulaire de protocole.'
              : 'We collect only the minimum data required to fulfill digital book orders (email address for order receipt and 72-hour cryptographically signed download tokens) or to process institutional inquiries submitted through the official protocol contact form.'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-700">
            <li>
              {locale === 'fr'
                ? 'Aucune utilisation de cookies de ciblage publicitaire ou de traceurs tiers.'
                : 'Zero third-party advertising tracking cookies or biometric data collection.'}
            </li>
            <li>
              {locale === 'fr'
                ? 'Données de paiement traitées directement par Stripe sans stockage local de numéros de carte.'
                : 'Payment data is processed directly via PCI-DSS compliant infrastructure (Stripe) with zero local card retention.'}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <EyeOff className="w-5 h-5 text-gold-600 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '3. Confidentialité et Non-Cession à des Tiers'
                : '3. Data Confidentiality & Zero Third-Party Monetization'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Vos coordonnées ne sont ni vendues, ni louées, ni cédées à aucun tiers, organisme public ou entité commerciale. Elles servent exclusivement à l’accomplissement de la relation éditoriale et académique.'
              : 'Your personal data is never sold, leased, or monetized with any government entity, broker, or marketing syndicate. It remains strictly confined to legitimate scholarly correspondence and digital fulfillment.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <FileText className="w-5 h-5 text-navy-900 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '4. Droits d’Accès et de Rectification'
                : '4. Rights of Access, Correction & Deletion'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Vous disposez d’un droit permanent d’accès, de rectification et d’effacement de vos données personnelles sur simple demande adressée par le formulaire de contact officiel de la plateforme.'
              : 'You retain full statutory rights to access, inspect, rectify, or request permanent deletion of your recorded transaction history by contacting the executive office via the protocol contact channel.'}
          </p>
        </section>
      </div>
    </div>
  );
}
