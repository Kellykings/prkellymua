import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Download,
  FileText,
  Lock,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { getBooks } from '@/lib/data/repository';
import { formatFormatLabel, t } from '@/lib/utils';
import type { Locale } from '@/types/domain';

interface DownloadVaultPageProps {
  params: {
    locale: string;
    token: string;
  };
  searchParams?: {
    book?: string;
    format?: string;
    email?: string;
  };
}

export default async function DownloadVaultPage({
  params,
  searchParams,
}: DownloadVaultPageProps) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const books = await getBooks();
  const matchedBook =
    books.find((b) => b.slug === searchParams?.book) || books[0];

  const expiresDate = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }
  ).format(new Date(Date.now() + 72 * 60 * 60 * 1000));

  const formatKey = searchParams?.format || 'digital_pdf';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Link
        href={`/${locale}/books`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-navy-900 hover:text-bronze-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>
          {locale === 'fr' ? 'Retour à la Librairie' : 'Return to Bookstore'}
        </span>
      </Link>

      <div className="bg-white border border-surface-border shadow-elevated overflow-hidden">
        <div className="bg-navy-900 text-white p-6 sm:p-8 border-b border-gold-500/30 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {locale === 'fr'
                  ? 'LIEN DE TÉLÉCHARGEMENT ACTIF (VALABLE 72H)'
                  : 'ACTIVE 72-HOUR ENCRYPTED DOWNLOAD LINK'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-white">
              {locale === 'fr'
                ? 'Portail de Livraison Numérique'
                : 'Digital Edition Fulfillment'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {locale === 'fr' ? 'Référence de commande :' : 'Order reference:'}{' '}
              {params.token}
            </p>
          </div>
          <Lock className="w-8 h-8 text-gold-400 shrink-0" />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-5 bg-surface-light border border-surface-border space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.06em] text-bronze-600">
              {locale === 'fr' ? 'Ouvrage Commandé' : 'Purchased Volume'}
            </div>
            <h2 className="text-xl font-serif font-semibold text-navy-900">
              {t(matchedBook.title, locale)}
            </h2>
            <p className="text-xs text-ink-500">
              <span className="whitespace-nowrap">ISBN {matchedBook.isbn}</span> ·{' '}
              {formatFormatLabel(formatKey, locale)} ·{' '}
              {locale === 'fr' ? 'Destinataire :' : 'Recipient:'}{' '}
              {searchParams?.email ||
                (locale === 'fr'
                  ? 'Lecteur inscrit'
                  : 'Registered Reader')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-surface-border bg-white">
              <div className="text-ink-500 uppercase tracking-[0.06em] font-medium">
                {locale === 'fr'
                  ? 'QUOTA DE TÉLÉCHARGEMENT'
                  : 'DOWNLOAD QUOTA'}
              </div>
              <div className="text-sm font-semibold text-navy-900 mt-1">
                {locale === 'fr'
                  ? 'Jusqu’à 5 appareils autorisés'
                  : 'Up to 5 authorized downloads'}
              </div>
            </div>
            <div className="p-4 border border-surface-border bg-white">
              <div className="text-ink-500 uppercase tracking-[0.06em] font-medium">
                {locale === 'fr' ? 'MODE DE LIVRAISON' : 'DELIVERY METHOD'}
              </div>
              <div className="text-sm font-semibold text-navy-900 mt-1">
                {locale === 'fr'
                  ? 'Archive Numérique Chiffrée'
                  : 'Encrypted Digital Archive'}
              </div>
            </div>
            <div className="p-4 border border-surface-border bg-white">
              <div className="text-ink-500 uppercase tracking-[0.06em] font-medium">
                {locale === 'fr' ? 'EXPIRATION DU LIEN' : 'LINK EXPIRATION'}
              </div>
              <div className="text-xs font-semibold text-navy-900 mt-1">
                {expiresDate} UTC
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={`/api/checkout?downloadToken=${encodeURIComponent(
                params.token
              )}&book=${encodeURIComponent(matchedBook.slug)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>
                {locale === 'fr'
                  ? 'Télécharger l’Édition Numérique'
                  : 'Download Digital Edition'}
              </span>
            </a>

            <Link
              href={`/${locale}/books/${matchedBook.slug}`}
              className="inline-flex items-center gap-2 px-4 py-3.5 border border-surface-border text-navy-900 text-sm font-medium hover:bg-surface-paper transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>
                {locale === 'fr'
                  ? 'Voir la Fiche de l’Ouvrage'
                  : 'View Book Details'}
              </span>
            </Link>
          </div>

          <div className="p-4 bg-surface-light border border-surface-border flex items-start gap-3 text-xs text-ink-500">
            <ShieldCheck className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p>
                {locale === 'fr'
                  ? 'Ce lien personnel est valable pendant 72 heures à compter de votre achat. Si votre lien a expiré ou si vous rencontrez une difficulté technique, notre secrétariat réémettra votre accès sans frais.'
                  : 'This personal download link remains active for 72 hours following purchase. If your link expires or you experience a technical issue, the editorial secretariat will reissue your access token free of charge.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href={`/${locale}/legal/refunds`}
                  className="text-bronze-600 hover:text-navy-900 underline underline-offset-4 font-semibold"
                >
                  {locale === 'fr'
                    ? 'Politique de remboursement & réémission'
                    : 'Refund & token re-issuance policy'}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-bronze-600 hover:text-navy-900 underline underline-offset-4 font-semibold"
                >
                  {locale === 'fr'
                    ? 'Contacter l’assistance'
                    : 'Contact support'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
