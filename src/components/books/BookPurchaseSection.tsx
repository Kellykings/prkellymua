'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  ArrowRight,
  CreditCard,
  Lock,
  Truck,
  Smartphone,
  PackageCheck,
  RotateCcw,
} from 'lucide-react';
import type {
  BookFormat,
  ThirdPartyRetailer,
  Locale,
  PrintDeliveryOrder,
} from '@/types/domain';
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

  // Common customer fields
  const [customerEmail, setCustomerEmail] = useState('');

  // Physical delivery order fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryCity, setDeliveryCity] = useState(
    locale === 'fr' ? 'Yaoundé' : 'Yaoundé'
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    'momo' | 'orange_money' | 'cash_delivery'
  >('momo');
  const [paymentReference, setPaymentReference] = useState('');

  // Confirmation state for physical orders
  const [confirmedOrder, setConfirmedOrder] =
    useState<PrintDeliveryOrder | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedFormat =
    directFormats.find((f) => f.id === selectedFormatId) || directFormats[0];

  const isPhysical = selectedFormat?.format.startsWith('physical_');

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

  const unitXaf = selectedFormat?.price_xaf || 73955;
  const totalXafFormatted = new Intl.NumberFormat(
    locale === 'fr' ? 'fr-FR' : 'en-US'
  ).format(unitXaf * quantity);

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMsg(
        locale === 'fr'
          ? 'Veuillez saisir une adresse courriel valide pour la confirmation de votre commande.'
          : 'Please enter a valid email address for order confirmation.'
      );
      return;
    }

    // Physical delivery branch: collect delivery details and route directly to Admin Studio
    if (isPhysical) {
      if (!customerName.trim() || customerName.trim().length < 2) {
        setErrorMsg(
          locale === 'fr'
            ? 'Veuillez renseigner votre nom complet pour l’expédition physique.'
            : 'Please enter your full name for physical shipping.'
        );
        return;
      }

      if (!customerPhone.trim() || customerPhone.trim().length < 8) {
        setErrorMsg(
          locale === 'fr'
            ? 'Un numéro de téléphone / WhatsApp valide est requis pour la coordination de la livraison.'
            : 'A valid phone / WhatsApp number is required for courier delivery coordination.'
        );
        return;
      }

      if (!deliveryAddress.trim() || deliveryAddress.trim().length < 3) {
        setErrorMsg(
          locale === 'fr'
            ? 'Veuillez préciser une adresse de livraison (quartier, immeuble ou repère).'
            : 'Please provide a physical delivery address or landmark.'
        );
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId,
            bookTitle,
            bookSlug,
            format: selectedFormat?.format,
            formatSku: selectedFormat?.sku,
            quantity,
            unitPriceCents: selectedFormat?.price_cents,
            unitPriceXaf: unitXaf,
            customerName,
            customerEmail,
            customerPhone,
            deliveryCity,
            deliveryAddress,
            deliveryNotes,
            paymentMethod,
            paymentReference:
              paymentReference.trim() ||
              (paymentMethod === 'cash_delivery'
                ? 'CASH_ON_DELIVERY'
                : 'PENDING_MOMO_VERIFICATION'),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Order submission failed');
        }

        if (data.order) {
          setConfirmedOrder(data.order);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to process print delivery order';
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Digital format branch: generate 72h download token & vault redirect
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

      {/* Tab 1: Direct Purchase & Delivery Flow */}
      {activeTab === 'direct' && (
        <div className="p-5 sm:p-7">
          {/* Confirmed Physical Order Receipt Banner */}
          {confirmedOrder ? (
            <div className="space-y-6">
              <div className="border border-emerald-300 bg-emerald-50/80 p-5 sm:p-6 rounded-sm text-ink-900">
                <div className="flex items-start gap-3">
                  <PackageCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold tracking-wider text-emerald-800 uppercase">
                      {locale === 'fr'
                        ? 'Commande Enregistrée pour Expédition'
                        : 'Physical Delivery Order Registered'}
                    </div>
                    <div className="font-serif font-bold text-lg text-navy-900">
                      {confirmedOrder.order_number}
                    </div>
                    <p className="text-xs text-ink-700 leading-relaxed">
                      {locale === 'fr'
                        ? 'Votre commande a été transmise au Secrétariat du Professeur Kelly Mua Kingsly pour vérification et expédition par coursier.'
                        : 'Your order has been routed to the Secretariat Studio of Professor Kelly Mua Kingsly for delivery fulfillment and courier dispatch.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-mono text-ink-500 block">
                      {locale === 'fr' ? 'Ouvrage & Format' : 'Volume & Format'}
                    </span>
                    <span className="font-semibold text-navy-900">
                      {confirmedOrder.book_title} ({confirmedOrder.format_sku})
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-ink-500 block">
                      {locale === 'fr' ? 'Quantité & Total' : 'Quantity & Total'}
                    </span>
                    <span className="font-semibold text-navy-900">
                      {confirmedOrder.quantity} exemplaire(s) ·{' '}
                      {new Intl.NumberFormat(
                        locale === 'fr' ? 'fr-FR' : 'en-US'
                      ).format(confirmedOrder.total_price_xaf)}{' '}
                      FCFA
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-ink-500 block">
                      {locale === 'fr'
                        ? 'Destinataire & Contact'
                        : 'Recipient & Telephone'}
                    </span>
                    <span className="font-semibold text-navy-900">
                      {confirmedOrder.customer_name} ({confirmedOrder.customer_phone})
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-ink-500 block">
                      {locale === 'fr'
                        ? 'Ville & Adresse de Livraison'
                        : 'Delivery City & Address'}
                    </span>
                    <span className="font-semibold text-navy-900">
                      {confirmedOrder.delivery_city}, {confirmedOrder.delivery_address}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-ink-500 block">
                      {locale === 'fr' ? 'Mode de Paiement' : 'Payment Method'}
                    </span>
                    <span className="font-semibold text-navy-900 uppercase">
                      {confirmedOrder.payment_method === 'momo'
                        ? 'MTN Mobile Money'
                        : confirmedOrder.payment_method === 'orange_money'
                        ? 'Orange Money'
                        : 'Paiement à la Livraison'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-ink-500 block">
                      {locale === 'fr' ? 'Statut du Traitement' : 'Fulfillment Status'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                      {locale === 'fr'
                        ? 'Vérification en cours par le Secrétariat'
                        : 'Secretariat Verification Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment instructions verification card */}
              <div className="bg-navy-900 text-white p-5 border-l-4 border-gold-500 space-y-2 text-xs">
                <div className="font-serif font-bold text-gold-400 text-sm">
                  {locale === 'fr'
                    ? 'Coordination de la Livraison Physique'
                    : 'Physical Delivery Coordination'}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {locale === 'fr'
                    ? 'Notre chargé de logistique vous contactera par appel ou WhatsApp au '
                    : 'Our logistics coordinator will contact you directly via phone or WhatsApp at '}
                  <strong className="text-white">
                    {confirmedOrder.customer_phone}
                  </strong>{' '}
                  {locale === 'fr'
                    ? 'afin de convenir de l’heure exacte de remise de l’ouvrage en mains propres.'
                    : 'to coordinate the exact courier dispatch and handover window.'}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400">
                  {locale === 'fr'
                    ? 'Contact support direct du Secrétariat : (+237) 677 22 44 66 / (+237) 699 22 44 66'
                    : 'Direct Secretariat Support Line: (+237) 677 22 44 66 / (+237) 699 22 44 66'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  setPaymentReference('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-surface-border text-navy-900 hover:bg-surface-light text-xs font-semibold rounded-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {locale === 'fr'
                    ? 'Passer une nouvelle commande'
                    : 'Place another order'}
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              {/* Format Radio Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-3">
                  {dict.books.selectFormat}
                </label>
                <div className="space-y-2.5">
                  {directFormats.map((fmt) => {
                    const isSelected = fmt.id === selectedFormat?.id;
                    const isDigitalFmt = fmt.format.startsWith('digital_');
                    const { usdFormatted, eurFormatted, xafFormatted } =
                      formatDualPrice(
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
                            <div className="text-sm font-semibold text-navy-900 leading-snug flex items-center gap-1.5 flex-wrap">
                              <span>{formatFormatLabel(fmt.format, locale)}</span>
                              {!isDigitalFmt && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-100 text-navy-950 font-mono text-[10px] font-bold uppercase rounded-sm">
                                  <Truck className="w-2.5 h-2.5" />
                                  <span>
                                    {locale === 'fr'
                                      ? 'Livraison Physique'
                                      : 'Print Delivery'}
                                  </span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-ink-500 mt-0.5">
                              {isDigitalFmt
                                ? locale === 'fr'
                                  ? 'Téléchargement chiffré 72h · Livraison immédiate'
                                  : '72h encrypted download · Instant delivery'
                                : locale === 'fr'
                                ? 'Édition papier reliée · Pas de téléchargement · Expédition par coursier'
                                : 'Print edition · No download · Courier fulfillment'}
                              {' · '}
                              {fmt.sku}
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

              {/* Physical Print Delivery Order Fields */}
              {isPhysical ? (
                <div className="space-y-4 pt-3 border-t border-surface-border">
                  <div className="p-3 bg-navy-950 text-gold-400 text-xs flex items-center justify-between gap-2 border border-gold-500/30">
                    <span className="font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>
                        {locale === 'fr'
                          ? 'Formulaire d’Expédition Physique (Trade Paperback)'
                          : 'Physical Shipping & Fulfillment (Trade Paperback)'}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {unitXaf.toLocaleString()} FCFA / {locale === 'fr' ? 'ex.' : 'copy'}
                    </span>
                  </div>

                  {/* Customer Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="order-name"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                      >
                        {locale === 'fr' ? 'Nom et Prénom *' : 'Full Name *'}
                      </label>
                      <input
                        id="order-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={
                          locale === 'fr' ? 'Ex: M. Jean-Paul Mbarga' : 'e.g. Dr. John Ewane'
                        }
                        className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="order-email"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                      >
                        {locale === 'fr' ? 'Courriel *' : 'Email Address *'}
                      </label>
                      <input
                        id="order-email"
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="contact@organisation.org"
                        className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Telephone & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="order-phone"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                      >
                        {locale === 'fr'
                          ? 'Téléphone / WhatsApp pour Livraison *'
                          : 'Phone / WhatsApp for Delivery *'}
                      </label>
                      <input
                        id="order-phone"
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(+237) 6XX XX XX XX"
                        className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="order-city"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                      >
                        {locale === 'fr' ? 'Ville de Livraison *' : 'Delivery City *'}
                      </label>
                      <select
                        id="order-city"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
                      >
                        <option value="Yaoundé">Yaoundé</option>
                        <option value="Douala">Douala</option>
                        <option value="Bafoussam">Bafoussam</option>
                        <option value="Garoua">Garoua</option>
                        <option value="Bamenda">Bamenda</option>
                        <option value="Buea / Limbe">Buea / Limbe</option>
                        <option value="Kribi">Kribi</option>
                        <option value="Ngaoundéré">Ngaoundéré</option>
                        <option value="Autre / Régions CEMAC">
                          {locale === 'fr' ? 'Autre ville / Région CEMAC' : 'Other City / CEMAC'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Physical Delivery Address */}
                  <div>
                    <label
                      htmlFor="order-address"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                    >
                      {locale === 'fr'
                        ? 'Adresse / Quartier / Repère de Livraison *'
                        : 'Delivery Address / Neighborhood / Landmark *'}
                    </label>
                    <input
                      id="order-address"
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={
                        locale === 'fr'
                          ? 'Ex: Bastos, près de l’Ambassade / Bâtiment MinFi, 4e étage'
                          : 'e.g., Bastos Ministry Quarter, Building A, 2nd Floor'
                      }
                      className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
                    />
                  </div>

                  {/* Quantity & Payment Method Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label
                        htmlFor="order-quantity"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                      >
                        {locale === 'fr' ? 'Nombre d’Exemplaires' : 'Number of Copies'}
                      </label>
                      <select
                        id="order-quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white font-semibold"
                      >
                        {[1, 2, 3, 5, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? (locale === 'fr' ? 'exemplaire' : 'copy') : (locale === 'fr' ? 'exemplaires' : 'copies')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="order-payment"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                      >
                        {locale === 'fr' ? 'Mode de Règlement Local' : 'Local Payment Method'}
                      </label>
                      <select
                        id="order-payment"
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value as 'momo' | 'orange_money' | 'cash_delivery'
                          )
                        }
                        className="w-full h-11 px-3 border border-surface-border bg-surface-light text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white font-semibold"
                      >
                        <option value="momo">MTN Mobile Money (MoMo)</option>
                        <option value="orange_money">Orange Money</option>
                        <option value="cash_delivery">
                          {locale === 'fr'
                            ? 'Paiement à la Livraison (Yaoundé / Douala)'
                            : 'Cash on Delivery (Yaounde / Douala)'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Local Mobile Money Merchant Numbers Panel */}
                  <div className="bg-sand-50 border border-gold-500/40 p-4 space-y-2 text-xs text-navy-900">
                    <div className="font-semibold text-navy-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-bronze-600" />
                      <span>
                        {locale === 'fr'
                          ? 'Coordonnées de Règlement Mobile Money Officiel'
                          : 'Official Mobile Money Payment Numbers'}
                      </span>
                    </div>

                    {paymentMethod === 'momo' && (
                      <div className="space-y-1 bg-white p-3 border border-surface-border">
                        <div className="font-mono font-bold text-sm text-navy-900 flex items-center justify-between">
                          <span>MTN MoMo : (+237) 677 22 44 66</span>
                          <span className="text-[11px] px-2 py-0.5 bg-yellow-100 text-yellow-900 font-sans font-bold">
                            MTN
                          </span>
                        </div>
                        <div className="text-[11px] text-ink-600">
                          {locale === 'fr'
                            ? 'Bénéficiaire : Secrétariat Général · Cabinet Pr. Kelly Mua Kingsly'
                            : 'Recipient: General Secretariat · Office of Prof. Kelly Mua Kingsly'}
                        </div>
                        <div className="text-[11px] text-ink-500">
                          {locale === 'fr'
                            ? `Montant à transférer : ${totalXafFormatted} FCFA`
                            : `Amount to transfer: ${totalXafFormatted} FCFA`}
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'orange_money' && (
                      <div className="space-y-1 bg-white p-3 border border-surface-border">
                        <div className="font-mono font-bold text-sm text-navy-900 flex items-center justify-between">
                          <span>Orange Money : (+237) 699 22 44 66</span>
                          <span className="text-[11px] px-2 py-0.5 bg-orange-100 text-orange-900 font-sans font-bold">
                            Orange
                          </span>
                        </div>
                        <div className="text-[11px] text-ink-600">
                          {locale === 'fr'
                            ? 'Bénéficiaire : Secrétariat Général · Cabinet Pr. Kelly Mua Kingsly'
                            : 'Recipient: General Secretariat · Office of Prof. Kelly Mua Kingsly'}
                        </div>
                        <div className="text-[11px] text-ink-500">
                          {locale === 'fr'
                            ? `Montant à transférer : ${totalXafFormatted} FCFA`
                            : `Amount to transfer: ${totalXafFormatted} FCFA`}
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'cash_delivery' && (
                      <div className="bg-white p-3 border border-surface-border text-[11px] text-ink-700">
                        {locale === 'fr'
                          ? `Règlement en espèces de ${totalXafFormatted} FCFA directement au coursier lors de la remise en mains propres à Yaoundé ou Douala.`
                          : `Pay ${totalXafFormatted} FCFA in cash directly to the courier upon physical delivery in Yaounde or Douala.`}
                      </div>
                    )}

                    {/* Transaction Reference Input */}
                    {paymentMethod !== 'cash_delivery' && (
                      <div className="pt-2">
                        <label
                          htmlFor="order-txid"
                          className="block text-[11px] font-semibold text-ink-700 mb-1"
                        >
                          {locale === 'fr'
                            ? 'Référence de Transaction / ID SMS MoMo (Facultatif mais recommandé) :'
                            : 'Transaction ID / MoMo SMS Reference (Optional but speeds up dispatch):'}
                        </label>
                        <input
                          id="order-txid"
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="Ex: MP261108.1245.B94812"
                          className="w-full h-9 px-3 border border-surface-border bg-white text-xs font-mono text-navy-900 focus:outline-none focus:border-navy-900"
                        />
                      </div>
                    )}
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label
                      htmlFor="order-notes"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-700 mb-1.5"
                    >
                      {locale === 'fr'
                        ? 'Instructions Particulières de Livraison (Optionnel)'
                        : 'Special Delivery Instructions (Optional)'}
                    </label>
                    <input
                      id="order-notes"
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder={
                        locale === 'fr'
                          ? 'Ex: Remettre à la réception ou appeler à l’arrivée'
                          : 'e.g., Leave at executive reception or call prior to arrival'
                      }
                      className="w-full h-10 px-3 border border-surface-border bg-surface-light text-xs text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
                    />
                  </div>
                </div>
              ) : (
                /* Digital PDF / ePub branch: Email only */
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
                  <p
                    id="email-delivery-note"
                    className="text-[11px] text-ink-500 mt-1.5"
                  >
                    {locale === 'fr'
                      ? 'Votre reçu d’achat et le lien de téléchargement PDF/ePub chiffré valable 72h seront expédiés à cette adresse.'
                      : 'Your purchase receipt and 72-hour encrypted PDF/ePub download link will be dispatched to this address.'}
                  </p>
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 border-l-2 border-red-700 text-xs text-red-800"
                >
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 px-6 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-50 touch-target-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 focus-visible:outline-offset-2"
              >
                <span>
                  {loading
                    ? dict.books.processingButton
                    : isPhysical
                    ? locale === 'fr'
                      ? `Commander pour Livraison Physique — ${totalXafFormatted} FCFA`
                      : `Submit Print Order for Delivery — ${totalXafFormatted} FCFA`
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
                        ? 'MTN MoMo · Orange Money · Visa / Mastercard · Expédition Directe'
                        : 'MTN MoMo · Orange Money · Visa / Mastercard · Direct Dispatch'}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-bronze-600 shrink-0" />
                    <span>
                      {locale === 'fr'
                        ? 'Traitement Sécurisé Secrétariat'
                        : 'Secure Secretariat Routing'}
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
        </div>
      )}

      {/* Tab 2: 3rd-Party Global Retailers (Amazon, Hilton Launch Desk, etc.) */}
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
                  <div className="text-sm font-semibold text-navy-900 group-hover:text-bronze-600 transition-colors flex items-center gap-1.5">
                    <span>{ret.platform_name}</span>
                    {ret.platform_name.toLowerCase().includes('amazon') && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold rounded-sm">
                        Global Prime
                      </span>
                    )}
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
