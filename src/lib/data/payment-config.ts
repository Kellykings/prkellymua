/**
 * Official Mobile Money and Local Payment Gateway Configuration
 * Single source of truth for physical print deliveries and institutional sales.
 */

export interface MobileMoneyAccount {
  id: 'momo' | 'orange_money';
  provider: string;
  shortName: string;
  badge: string;
  number: string;
  rawNumber: string;
  telUri: string;
  ussdCode: string;
  recipientName: {
    en: string;
    fr: string;
  };
}

export const OFFICIAL_PAYMENT_CONFIG = {
  momo: {
    id: 'momo' as const,
    provider: 'MTN Mobile Money',
    shortName: 'MTN MoMo',
    badge: 'MTN MoMo',
    number: '+237 677 6580 510',
    rawNumber: '2376776580510',
    telUri: 'tel:+2376776580510',
    ussdCode: '*126#',
    recipientName: {
      en: 'General Secretariat · Office of Prof. Kelly Mua Kingsly',
      fr: 'Secrétariat Général · Cabinet Pr. Kelly Mua Kingsly',
    },
  },
  orange_money: {
    id: 'orange_money' as const,
    provider: 'Orange Money',
    shortName: 'Orange Money',
    badge: 'Orange Money',
    number: '+237 694 228 055',
    rawNumber: '237694228055',
    telUri: 'tel:+237694228055',
    ussdCode: '#150#',
    recipientName: {
      en: 'General Secretariat · Office of Prof. Kelly Mua Kingsly',
      fr: 'Secrétariat Général · Cabinet Pr. Kelly Mua Kingsly',
    },
  },
  secretariatSupportLines: {
    en: 'Direct Secretariat Support Line: (+237) 677 6580 510 / (+237) 694 228 055',
    fr: 'Contact support direct du Secrétariat : (+237) 677 6580 510 / (+237) 694 228 055',
    phone1: '+237 677 6580 510',
    phone2: '+237 694 228 055',
  },
} as const;

export type MobileMoneyProviderId = 'momo' | 'orange_money';
