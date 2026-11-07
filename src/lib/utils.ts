import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale, LocalizedString } from '@/types/domain';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function t(value: LocalizedString | undefined, locale: Locale): string {
  if (!value) return '';
  return value[locale] || (locale === 'en' ? value.fr : value.en) || '';
}

export function formatGalleryCategory(category: string, locale: Locale = 'en'): string {
  const normalized = category.toLowerCase();
  if (normalized === 'governance') {
    return locale === 'fr' ? 'GOUVERNANCE & TRÉSOR' : 'GOVERNANCE & TREASURY';
  }
  if (normalized === 'summit') {
    return locale === 'fr' ? 'SOMMETS & CONFÉRENCES' : 'SOVEREIGN SUMMITS';
  }
  if (normalized === 'book_meetup') {
    return locale === 'fr' ? 'RENCONTRES AUTEUR & DÉDICACES' : 'BOOK MEETUPS & SIGNINGS';
  }
  if (normalized === 'academic') {
    return locale === 'fr' ? 'ENAM & ENSEIGNEMENT MAGISTRAL' : 'ACADEMIC MASTERCLASSES';
  }
  if (normalized === 'diplomatic') {
    return locale === 'fr' ? 'MISSIONS MULTILATÉRALES' : 'MULTILATERAL MISSIONS';
  }
  return category.toUpperCase().replace('_', ' ');
}

export function formatCurrency(priceCents: number, currency = 'USD', locale: Locale = 'en'): string {
  const amount = priceCents / 100;
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDualPrice(
  priceCents: number,
  currency = 'USD',
  locale: Locale = 'en',
  options?: {
    priceEurCents?: number;
    priceXaf?: number;
  }
): {
  usdFormatted: string;
  eurFormatted: string;
  xafFormatted: string;
  triCurrencyFormatted: string;
} {
  const usdAmount = priceCents / 100;
  const isSpecialCredibleSig = priceCents === 10700 || options?.priceXaf === 73955;

  const usdFormatted = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(usdAmount);

  // EUR: If explicit override or $107, use 98 €, otherwise approximate ~0.915
  const eurRaw = isSpecialCredibleSig
    ? 98
    : options?.priceEurCents
      ? options.priceEurCents / 100
      : Math.round(usdAmount * 0.915);
  const eurFormatted = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: eurRaw % 1 === 0 ? 0 : 2,
  }).format(eurRaw);

  // XAF / FCFA: If special $107 or explicit, use 73 955 FCFA, otherwise approximate fixed parity
  const xafRaw = isSpecialCredibleSig
    ? 73955
    : options?.priceXaf
      ? options.priceXaf
      : Math.round((usdAmount * 605) / 500) * 500;
  const xafFormatted = `${new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(xafRaw)} FCFA`;

  const triCurrencyFormatted = isSpecialCredibleSig
    ? '107$ | 98 Euro | 73 955 FCFA'
    : `${usdFormatted} · ${eurFormatted} · ${xafFormatted}`;

  return { usdFormatted, eurFormatted, xafFormatted, triCurrencyFormatted };
}

export function formatFormatLabel(format: string, locale: Locale = 'en'): string {
  const labels: Record<string, { en: string; fr: string }> = {
    digital_pdf: {
      en: 'Digital Edition (PDF · Instant Download)',
      fr: 'Édition Numérique (PDF · Téléchargement Immédiat)',
    },
    digital_epub: {
      en: 'Digital eBook (ePub · eReaders)',
      fr: 'Livre Numérique (ePub · Liseuses)',
    },
    physical_paperback: {
      en: 'Trade Paperback (Print Edition)',
      fr: 'Édition Brochée (Imprimé)',
    },
    physical_hardcover: {
      en: 'Institutional Hardcover (Archival Print)',
      fr: 'Édition Reliée Institutionnelle (Imprimé)',
    },
  };
  return labels[format]?.[locale] || format;
}

export function formatDate(isoDate: string, locale: Locale = 'en'): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return locale === 'fr' ? isoDate.replace(/Reference Series/i, 'Série de référence') : isoDate;
  }
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export function formatPeriod(period: string, locale: Locale = 'en'): string {
  if (locale === 'fr') {
    return period.replace(/Present/gi, 'Présent');
  }
  return period;
}

export function formatLocation(location: string, locale: Locale = 'en'): string {
  if (locale === 'en') return location;
  const frLocations: Record<string, string> = {
    'Yaoundé, Cameroon': 'Yaoundé, Cameroun',
    'Nairobi, Kenya (Pan-African Mandate)': 'Nairobi, Kenya (Mandat Panafricain)',
    'Nairobi, Kenya (Pan-African Multilateral)': 'Nairobi, Kenya (Multilatéral Panafricain)',
    'Nairobi / Pan-African': 'Nairobi / Panafricain',
    'Nairobi / Pan-African Broadcast': 'Nairobi / Diffusion Panafricaine',
    'Nairobi, Kenya / Douala, Cameroon': 'Nairobi, Kenya / Douala, Cameroun',
    'Livingstone, Zambia / Yaoundé, Cameroon': 'Livingstone, Zambie / Yaoundé, Cameroun',
    'Rotterdam, Netherlands / International': 'Rotterdam, Pays-Bas / International',
    'International Academic Publishing': 'Édition Académique Internationale',
    'Pan-African / Yaoundé, Cameroon': 'Panafricain / Yaoundé, Cameroun',
    'Libreville / CEMAC Zone': 'Libreville / Zone CEMAC',
    'Yaoundé / International': 'Yaoundé / International',
    'United Nations System': 'Système des Nations Unies',
  };
  return (
    frLocations[location] ||
    location
      .replace(/Cameroon/g, 'Cameroun')
      .replace(/CEMAC Zone/g, 'Zone CEMAC')
      .replace(/Pan-African Mandate/g, 'Mandat Panafricain')
      .replace(/Pan-African/g, 'Panafricain')
      .replace(/Zambia/g, 'Zambie')
      .replace(/Netherlands/g, 'Pays-Bas')
      .replace(/United Nations System/g, 'Système des Nations Unies')
  );
}

export function formatCategory(category: string, locale: Locale = 'en'): string {
  if (locale === 'en') {
    const enMap: Record<string, string> = {
      sovereign: 'Sovereign Mandate',
      multilateral: 'Multilateral Governance',
      academic: 'Academic Appointment',
      advisory: 'Executive Advisory',
      'Broadcast Interview': 'Broadcast Interview',
      'Press Feature': 'Press Feature & Investigation',
      'Published Treatise': 'Specialized Treatise',
      'Policy Fellowship': 'Policy Fellowship',
      'Institutional Governance': 'Institutional Governance',
      'Academic Repository': 'Academic Repository',
      'Policy Interview': 'Policy Interview',
      'Keynote Address': 'Keynote Address',
      'Academic Lecture': 'Academic Lecture',
      'Ministerial Panel': 'Ministerial Panel',
    };
    return enMap[category] || category;
  }

  const frMap: Record<string, string> = {
    sovereign: 'Mandat Souverain',
    multilateral: 'Gouvernance Multilatérale',
    academic: 'Chaire Académique',
    advisory: 'Conseil Stratégique',
    'Capital Markets': 'Marchés des Capitaux',
    'ESG & Climate Finance': 'Finance Durable & ESG',
    'Forensic Auditing & Integrity': 'Audit Judiciaire & Intégrité',
    'Sovereign Debt & PFM': 'Dette Souveraine & Finances Publiques',
    'Forensic Accounting': 'Comptabilité Judiciaire',
    'Governance & Ethics': 'Gouvernance & Éthique',
    'Policy Interview': 'Entretien de Politique Publique',
    'Keynote Address': 'Allocution Principale',
    'Academic Lecture': 'Leçon Inaugurale',
    'Ministerial Panel': 'Panel Ministériel',
    'Broadcast Interview': 'Entretien Audiovisuel',
    'Press Feature': 'Presse & Enquête',
    'Published Treatise': 'Ouvrage Spécialisé',
    'Policy Fellowship': 'Dossier d’Expertise & Think Tank',
    'Institutional Governance': 'Gouvernance Institutionnelle',
    'Academic Repository': 'Répertoire Universitaire',
  };
  return frMap[category] || category;
}
