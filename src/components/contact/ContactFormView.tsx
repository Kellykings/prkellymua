'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/types/domain';

export function ContactFormView({ locale }: { locale: Locale }) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [inquiryType, setInquiryType] = useState('Academic & Keynote Speaking');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          senderEmail,
          organization,
          inquiryType,
          subject,
          message,
          protocol_hp: honeypot,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          data?.error ||
            (locale === 'fr'
              ? 'Échec de transmission de la correspondance. Veuillez vérifier vos saisies.'
              : 'Failed to dispatch inquiry. Please check your inputs and try again.')
        );
      }
    } catch {
      setErrorMessage(
        locale === 'fr'
          ? 'Erreur réseau lors de la transmission. Veuillez vérifier votre connexion et réessayer.'
          : 'Network error while dispatching correspondence. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
      <div className="space-y-4">
        <div className="editorial-kicker">
          {locale === 'fr'
            ? 'CONFÉRENCES, RECHERCHE & DEMANDES INSTITUTIONNELLES'
            : 'SPEAKING, RESEARCH & INSTITUTIONAL INQUIRIES'}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif font-semibold text-navy-900 leading-[1.15]">
          {locale === 'fr'
            ? 'Contacter le Secrétariat Éditorial & Académique'
            : 'Contact the Academic & Editorial Secretariat'}
        </h1>
        <p className="text-ink-700 text-base sm:text-[17px] leading-relaxed max-w-3xl">
          {locale === 'fr'
            ? 'Utilisez ce canal pour les invitations à des conférences internationales, les collaborations universitaires, les commandes institutionnelles d’ouvrages et les demandes de presse.'
            : 'Use this channel for international keynote invitations, academic research collaborations, institutional bulk book acquisitions, and accredited media requests.'}
        </p>
      </div>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-white border border-emerald-200 p-8 shadow-institutional space-y-4"
        >
          <div className="flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            <h2 className="text-xl font-serif font-semibold">
              {locale === 'fr'
                ? 'Correspondance Enregistrée avec Succès'
                : 'Inquiry Logged & Routed to Secretariat'}
            </h2>
          </div>
          <p className="text-sm text-ink-700">
            {locale === 'fr'
              ? 'Votre demande a été enregistrée par le secrétariat académique. Une réponse vous sera adressée dans les meilleurs délais.'
              : 'Your correspondence has been recorded by the academic secretariat. A response will be sent following review.'}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-surface-border p-5 sm:p-10 shadow-institutional space-y-6"
        >
          {/* Honeypot field for bot deterrence */}
          <div
            aria-hidden="true"
            className="hidden opacity-0 absolute -left-[9999px] -top-[9999px]"
          >
            <label htmlFor="contact-protocol-hp">Protocol Verification Secondary</label>
            <input
              type="text"
              id="contact-protocol-hp"
              name="protocol_hp"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Accessible Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-sm flex items-start gap-3 text-sm shadow-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-semibold">
                  {locale === 'fr' ? 'Erreur de transmission' : 'Transmission Notice'}
                </p>
                <p className="text-red-800 text-xs sm:text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label
                htmlFor="contact-sender-name"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 mb-2"
              >
                {locale === 'fr' ? 'Nom Complet & Titre' : 'Full Name & Title'} *
              </label>
              <input
                id="contact-sender-name"
                type="text"
                required
                aria-required="true"
                autoComplete="name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Dr. / Prof. / Director..."
                className="w-full h-12 px-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/20 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-sender-email"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 mb-2"
              >
                {locale === 'fr' ? 'Courriel Institutionnel' : 'Institutional Email'} *
              </label>
              <input
                id="contact-sender-email"
                type="email"
                required
                aria-required="true"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck="false"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="name@institution.org"
                className="w-full h-12 px-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/20 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label
                htmlFor="contact-organization"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 mb-2"
              >
                {locale === 'fr'
                  ? 'Institution / Organisation'
                  : 'Organization / Ministry / University'}
              </label>
              <input
                id="contact-organization"
                type="text"
                autoComplete="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={
                  locale === 'fr'
                    ? 'Université / Institution / Média'
                    : 'University / Multilateral Agency / Media'
                }
                className="w-full h-12 px-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/20 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-inquiry-type"
                className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 mb-2"
              >
                {locale === 'fr' ? 'Nature de la Demande' : 'Inquiry Category'}
              </label>
              <select
                id="contact-inquiry-type"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full h-12 px-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/20 focus:bg-white transition-colors"
              >
                <option value="Academic & Keynote Speaking">
                  {locale === 'fr'
                    ? 'Conférences & Interventions Académiques'
                    : 'Academic & Keynote Speaking'}
                </option>
                <option value="Institutional Book Acquisition">
                  {locale === 'fr'
                    ? 'Acquisition Institutionnelle d’Ouvrages'
                    : 'Institutional Book Acquisition'}
                </option>
                <option value="Research & Policy Collaboration">
                  {locale === 'fr'
                    ? 'Collaboration Scientifique & Politique Publique'
                    : 'Research & Policy Collaboration'}
                </option>
                <option value="Accredited Press & Media">
                  {locale === 'fr'
                    ? 'Presse Accréditée & Médias'
                    : 'Accredited Press & Media'}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 mb-2"
            >
              {locale === 'fr' ? 'Objet' : 'Subject'} *
            </label>
            <input
              id="contact-subject"
              type="text"
              required
              aria-required="true"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-12 px-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/20 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-700 mb-2"
            >
              {locale === 'fr' ? 'Message Détaillé' : 'Detailed Message'} *
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              aria-required="true"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 border border-surface-border bg-surface-light text-base sm:text-sm text-navy-900 focus:outline-none focus:border-navy-900 focus-visible:ring-2 focus-visible:ring-navy-900/20 focus:bg-white transition-colors"
            />
          </div>

          <div className="p-4 bg-surface-paper border border-surface-border flex items-start gap-3 text-xs text-ink-500">
            <ShieldCheck className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
            <span>
              {locale === 'fr'
                ? 'Avis d’indépendance & confidentialité : Les communications officielles adressées au Ministère des Finances du Cameroun (MINFI), à la COSUMAF ou à l’ATIDI doivent emprunter leurs canaux administratifs statutaires respectifs. Consultez notre '
                : 'Independence & Privacy Notice: Official statutory communications intended for the Ministry of Finance of Cameroon (MINFI), COSUMAF, or ATIDI must be routed through their respective official institutional registries. View our '}
              <Link
                href={`/${locale}/legal/privacy`}
                className="font-semibold text-bronze-600 hover:text-navy-900 underline underline-offset-4 transition-colors"
              >
                {locale === 'fr'
                  ? 'Politique de Confidentialité'
                  : 'Privacy Policy'}
              </Link>
              .
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-sm active:scale-[0.99] transition-all touch-target-lg disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>
              {loading
                ? locale === 'fr'
                  ? 'Envoi en cours...'
                  : 'Sending...'
                : locale === 'fr'
                ? 'Envoyer au Secrétariat'
                : 'Send Inquiry'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
