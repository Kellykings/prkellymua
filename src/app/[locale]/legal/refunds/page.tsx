import React from 'react';
import type { Metadata } from 'next';
import { DownloadCloud, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Livraison Numérique & Remboursements | Pr Kelly Mua Kingsly'
      : 'Digital Fulfillment & Refund Policy | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Garantie de livraison numérique chiffrée 72h, assistance au téléchargement et politique de remboursement des ouvrages académiques.'
      : '72-hour encrypted download guarantee, file integrity assistance, and refund policy for digital treatises by Professor Kelly Mua Kingsly.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/legal/refunds`,
      languages: {
        en: '/en/legal/refunds',
        fr: '/fr/legal/refunds',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/legal/refunds`,
    },
  };
}

export default function RefundsPolicyPage({
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
            ? 'LIVRAISON NUMÉRIQUE & REMBOURSEMENT'
            : 'DIGITAL DELIVERY & REFUND POLICY'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 leading-tight">
          {locale === 'fr'
            ? 'Politique de Livraison Numérique et Remboursements'
            : 'Digital Fulfillment Guarantee & Refund Charter'}
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
            <DownloadCloud className="w-5 h-5 text-bronze-600 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '1. Livraison Numérique Instantanée (Jeton Sécurisé 72h)'
                : '1. Instant Digital Fulfillment via 72-Hour Secure Token'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Dès confirmation du règlement d’une édition numérique (PDF ou ePub), un jeton cryptographique HMAC unique est généré. L’acheteur reçoit un lien direct de téléchargement actif pendant 72 heures, permettant de récupérer le manuscrit sur plusieurs terminaux personnels.'
              : 'Immediately upon checkout confirmation of a digital edition (PDF or ePub), a unique cryptographically signed HMAC download token is generated. You receive an instant delivery link valid for 72 hours, enabling downloads across your personal desktop and mobile reading devices.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <RefreshCw className="w-5 h-5 text-navy-900 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '2. Réactivation Gratuite du Jeton en Cas d’Expiration'
                : '2. Free Token Renewal & Technical Support'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Si votre jeton de 72 heures a expiré avant que vous n’ayez pu enregistrer votre ouvrage, ou en cas de perte de votre courriel de confirmation, vous pouvez demander une réactivation immédiate sans frais supplémentaires en transmettant votre référence de commande via le formulaire de protocole.'
              : 'If your 72-hour token expires before you complete your download, or if you misplace your transaction receipt, our editorial support team will promptly regenerate and reissue your download token at zero additional cost.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <AlertCircle className="w-5 h-5 text-gold-600 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '3. Politique de Remboursement Intégral sous 14 Jours'
                : '3. 14-Day Full Refund Guarantee for Technical Incompatibility'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'En raison de la nature immatérielle des œuvres numériques, les téléchargements complétés avec succès ne sont généralement pas remboursables. Cependant, si vous rencontrez une défaillance technique avérée (fichier corrompu, incompatibilité non résolue par notre équipe support), vous bénéficiez d’un remboursement intégral à 100% dans un délai de 14 jours suivant l’achat.'
              : 'Due to the immediate delivery of digital intellectual property, completed downloads are generally final. However, if you experience a verified technical defect (corrupted file, unreadable formatting, or delivery failure unresolved within 24 hours), you are entitled to a 100% full refund within 14 days of purchase.'}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-navy-900 font-serif font-bold text-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <h2>
              {locale === 'fr'
                ? '4. Commandes d’Éditions Imprimées auprès des Distributeurs Tiers'
                : '4. Physical Print Editions Purchased via Third-Party Retailers'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Pour les exemplaires imprimés (reliés ou brochés) commandés auprès de distributeurs agréés (Amazon, Barnes & Noble, Christian Faith Publishing), les conditions de livraison, de retour et de remboursement applicables sont celles de la plateforme distributrice concernée.'
              : 'For physical print editions (paperback or hardcover) acquired through authorized third-party distributors (Amazon, Barnes & Noble, Christian Faith Publishing), delivery, return, and refund logistics are governed directly by the respective retail distributor’s policies.'}
          </p>
        </section>
      </div>
    </div>
  );
}
