'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowRight, CreditCard, Lock } from 'lucide-react';
import type { BookFormat, ThirdPartyRetailer, Locale } from '@/types/domain';
import { formatDualPrice, formatFormatLabel } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface BookPurchaseSectionProps {
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  locale: Locale;
  directFormats: BookFormat[];
  retailers: ThirdPartyRetailer[];
}

export function BookPurchaseSection({
  bookId,
  bookSlug,
  bookTitle,
  locale,
  directFormats,
  retailers,
}: BookPurchaseSectionProps) {
  const router = useRouter();
  const dict = getDictionary(locale);
  const [activeTab, setActiveTab] = useState<'direct' | 'retailers'>('direct');
  const [selectedFormatId, setSelectedFormatId] = useState<string>(
    directFormats[0]?.id || ''
  );
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedFormat =
    directFormats.find((f) => f.id === selectedFormatId) || directFormats[0];

  const selectedPrice = selectedFormat
    ? formatDualPrice(
        selectedFormat.price_cents,
        selectedFormat.currency,
        locale,
        {
          priceEurCents: selectedFormat.price_eur_cents,
          priceXaf: selectedFormat.price_xaf,
        }
      )
    : null;

  async function handleDirectCheckout(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMsg(
        locale === 'fr'
          ? 'Veuillez saisir une adresse courriel valide pour la réception du reçu et du lien de téléchargement.'
          : 'Please enter a valid email address for receipt and download link delivery.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          bookSlug,
          formatId: selectedFormat?.id,
          customerEmail,
          locale,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Checkout initialization failed');
      }

      if (data.url) {
        router.push(data.url);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to initialize checkout';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRetailerClick(retailer: ThirdPartyRetailer) {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'outbound_retailer_click',
          bookId,
          platform: retailer.platform_name,
          url: retailer.retail_url,
        }),
      });
    } catch {
      // Non-blocking telemetry
    }
  }

  return (
    <div className="bg-white border border-surface-border shadow-institutional">
      {/* Mode Selector Tabs — Clean Architectural Tabs */}
      <div className="grid grid-cols-2 border-b border-surface-border bg-surface-paper">
        <button
          type="button"
          onClick={() => setActiveTab('direct')}
          className={`min-h-[48px] py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-medium text-center flex items-center justify-center transition-colors active:scale-[0.99] ${
            activeTab === 'direct'
              ? 'bg-navy-900 text-gold-400 font-semibold border-b-2 border-gold-500'
              : 'text-ink-500 hover:text-navy-900'
          }`}
        >
          {dict.books.directPurchaseTab}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('retailers')}
          className={`min-h-[48px] py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-medium text-center flex items-center justify-center transition-colors active:scale-[0.99] ${
            activeTab === 'retailers'
              ? 'bg-navy-900 text-gold-400 font-semibold border-b-2 border-gold-500'
              : 'text-ink-500 hover:text-navy-900'
          }`}
        >
          {dict.books.retailersTab} ({retailers.length})
        </button>
      </div>

      {/* Tab 1: Direct Digital & Print Checkout */}
      {activeTab === 'direct' && (
        <form onSubmit={handleDirectCheckout} className="p-5 sm:p-7 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-3">
              {dict.books.selectFormat}
            </label>
            <div className="space-y-2.5">
              {directFormats.map((fmt) => {
                const isSelected = fmt.id === selectedFormat?.id;
                const isDigital = fmt.format.startsWith('digital_');
                const { usdFormatted, eurFormatted, xafFormatted } = formatDualPrice(
                  fmt.price_cents,
                  fmt.currency,
                  locale,
                  {
                    priceEurCents: fmt.price_eur_cents,
                    priceXaf: fmt.price_xaf,
                  }
                );

                return (
                  <label
                    key={fmt.id}
                    onClick={() => setSelectedFormatId(fmt.id)}
                    className={`flex items-center justify-between gap-3 min-h-[56px] p-3.5 sm:p-4 border cursor-pointer active:bg-surface-paper transition-all ${
                      isSelected
                        ? 'border-navy-900 bg-surface-light ring-1 ring-navy-900'
                        : 'border-surface-border hover:border-ink-400'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <input
                        type="radio"
                        name="bookFormat"
                        value={fmt.id}
                        checked={isSelected}
                        onChange={() => setSelectedFormatId(fmt.id)}
                        className="mt-1 sm:mt-0 w-4 h-4 text-navy-900 focus:ring-navy-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-navy-900 leading-snug">
                          {formatFormatLabel(fmt.format, locale)}
                        </div>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {isDigital
                            ? locale === 'fr'
                              ? 'Téléchargement chiffré 72h · Livraison immédiate'
                              : '72h encrypted download · Instant delivery'
                            : locale === 'fr'
                            ? 'Édition imprimée · Expédition physique'
                            : 'Archival print · Physical dispatch'}{' '}
                          · {fmt.sku}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-serif font-semibold text-navy-900">
                        {usdFormatted}
                      </div>
                      <div className="text-xs text-ink-500 whitespace-nowrap">
                        {eurFormatted} · {xafFormatted}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="buyer-email"
              className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-2"
            >
              {dict.books.buyerEmailLabel}
            </label>
            <input
              id="buyer-email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder={dict.books.buyerEmailPlaceholder}
              aria-describedby="email-delivery-note"
              className="w-full h-12 px-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white transition-colors"
            />
            <p id="email-delivery-note" className="text-[11px] text-ink-500 mt-1.5">
              {locale === 'fr'
                ? 'Votre reçu d’achat et le lien de téléchargement PDF/ePub chiffré valable 72h seront expédiés à cette adresse.'
                : 'Your purchase receipt and 72-hour encrypted PDF/ePub download link will be dispatched to this address.'}
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-red-50 border-l-2 border-red-700 text-xs text-red-800"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-6 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-50 touch-target-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
          >
            <span>
              {loading
                ? dict.books.processingButton
                : `${dict.books.buyNowButton} — ${
                    selectedPrice
                      ? selectedPrice.triCurrencyFormatted
                      : ''
                  }`}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {/* Payment Method & Legal Policies Strip */}
          <div className="pt-3 border-t border-surface-border space-y-2 text-xs text-ink-500">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-medium text-navy-900">
                <CreditCard className="w-3.5 h-3.5 text-bronze-600 shrink-0" />
                <span>
                  {locale === 'fr'
                    ? 'Cartes (Visa / Mastercard) · Mobile Money (MTN MoMo, Orange) · Lien 72h'
                    : 'Cards (Visa / Mastercard) · Mobile Money (MTN MoMo, Orange) · 72h Link'}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-bronze-600 shrink-0" />
                <span>
                  {locale === 'fr'
                    ? 'Transaction sécurisée'
                    : 'Encrypted checkout'}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
              <Link
                href={`/${locale}/legal/terms`}
                className="text-bronze-600 hover:text-navy-900 underline underline-offset-4 font-medium"
              >
                {locale === 'fr' ? 'Conditions de vente' : 'Terms of Sale'}
              </Link>
              <Link
                href={`/${locale}/legal/refunds`}
                className="text-bronze-600 hover:text-navy-900 underline underline-offset-4 font-medium"
              >
                {locale === 'fr'
                  ? 'Politique de remboursement'
                  : 'Refund Policy'}
              </Link>
              <Link
                href={`/${locale}/legal/privacy`}
                className="text-bronze-600 hover:text-navy-900 underline underline-offset-4 font-medium"
              >
                {locale === 'fr' ? 'Confidentialité' : 'Privacy Policy'}
              </Link>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: 3rd-Party Global Retailers */}
      {activeTab === 'retailers' && (
        <div className="p-5 sm:p-7 space-y-4">
          <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
            {dict.books.retailerNotice}
          </p>
          <div className="divide-y divide-surface-border border-y border-surface-border">
            {retailers.map((ret) => (
              <a
                key={ret.id}
                href={ret.retail_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleRetailerClick(ret)}
                aria-label={`${ret.platform_name} — ${bookTitle} (${
                  locale === 'fr' ? 'ouvre un nouvel onglet' : 'opens new tab'
                })`}
                className="flex items-center justify-between gap-4 py-4 px-2 hover:bg-surface-light active:bg-surface-paper transition-colors group min-h-[52px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-1"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-navy-900 group-hover:text-bronze-600 transition-colors">
                    {ret.platform_name}
                  </div>
                  <div className="text-xs text-ink-500 truncate mt-0.5">
                    {bookTitle}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.06em] text-navy-900 shrink-0">
                  <span>{locale === 'fr' ? 'Commander' : 'Order'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-bronze-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
