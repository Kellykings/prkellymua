export type Locale = 'en' | 'fr';

export interface LocalizedString {
  en: string;
  fr: string;
}

export type FormatType =
  | 'digital_pdf'
  | 'digital_epub'
  | 'physical_paperback'
  | 'physical_hardcover';

export interface BookFormat {
  id: string;
  book_id: string;
  format: FormatType;
  price_cents: number;
  currency: string;
  price_eur_cents?: number;
  price_xaf?: number;
  is_available: boolean;
  file_storage_path?: string;
  sku: string;
}

export interface ThirdPartyRetailer {
  id: string;
  book_id: string;
  platform_name: string;
  retail_url: string;
  affiliate_tag?: string;
  is_active: boolean;
}

export interface Book {
  id: string;
  slug: string;
  isbn: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  synopsis: LocalizedString;
  academic_category: string;
  cover_image_url: string;
  alternate_cover_image_url?: string;
  total_pages: number;
  publish_date: string;
  publisher: string;
  chapters: {
    number: number;
    title: LocalizedString;
    summary: LocalizedString;
  }[];
  key_takeaways: LocalizedString[];
  is_featured: boolean;
  status: 'draft' | 'in_review' | 'published' | 'archived';
  book_formats: BookFormat[];
  third_party_retailers: ThirdPartyRetailer[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content_sections: {
    heading: LocalizedString;
    body: LocalizedString;
  }[];
  category: string;
  tags: string[];
  estimated_read_minutes: number;
  doi_reference?: string;
  published_at: string;
  status: 'draft' | 'in_review' | 'published' | 'archived';
}

export interface CareerEntry {
  id: string;
  organization: LocalizedString;
  role_title: LocalizedString;
  category: 'sovereign' | 'multilateral' | 'academic' | 'advisory';
  period: string;
  tenure_note?: string;
  is_current: boolean;
  location: string;
  description: LocalizedString;
  highlights: LocalizedString[];
  impact_summary?: LocalizedString;
  verification_status: 'verified' | 'pending_review';
  verification_note: LocalizedString;
  decree_reference?: string;
  official_reference?: string;
  evidence_url?: string;
}

export interface EducationCredential {
  id: string;
  degree: LocalizedString;
  field: LocalizedString;
  institution: LocalizedString;
  year?: string;
  category: 'doctorate' | 'masters' | 'charter' | 'honor';
  description: LocalizedString;
}

export interface ExpertisePillar {
  id: string;
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  summary: LocalizedString;
  key_mandates: LocalizedString[];
  metrics_label: LocalizedString;
}

export type MediaAppearanceType =
  | 'Keynote Address'
  | 'Policy Interview'
  | 'Ministerial Panel'
  | 'Academic Lecture'
  | 'Broadcast Interview'
  | 'Press Feature'
  | 'Published Treatise'
  | 'Policy Fellowship'
  | 'Institutional Governance'
  | 'Academic Repository';

export type MediaCategory = 'broadcast' | 'press' | 'governance' | 'academic';

export interface MediaAppearance {
  id: string;
  title: LocalizedString;
  type: MediaAppearanceType;
  venue: string;
  date: string;
  location: string;
  summary: LocalizedString;
  source_url?: string;
  image_url?: string;
  category?: MediaCategory;
  caption?: LocalizedString;
  is_pinned?: boolean;
  video_metadata?: {
    youtube_id?: string;
    duration?: string;
    caption_note?: LocalizedString;
  };
}

export type EventCategory =
  | 'summit'
  | 'academic'
  | 'book_meetup'
  | 'governance'
  | 'diplomatic';

export interface GalleryPhotoItem {
  id: string;
  title: LocalizedString;
  event_name: LocalizedString;
  venue: string;
  date: string;
  year: string;
  season: '2025-2026' | '2023-2024' | 'archive';
  location: string;
  category: EventCategory;
  image_url: string;
  thumbnail_url?: string;
  caption: LocalizedString;
  participants_note?: LocalizedString;
  external_ref_url?: string;
  is_featured_monthly?: boolean;
}

export interface InstitutionalEvent {
  id: string;
  slug: string;
  title: LocalizedString;
  event_type: LocalizedString;
  category: EventCategory;
  date: string;
  time?: string;
  venue: string;
  location: string;
  description: LocalizedString;
  keynote_topic?: LocalizedString;
  organizer: string;
  status: 'upcoming' | 'concluded';
  registration_url?: string;
  related_gallery_ids?: string[];
}

export type OrderFulfillmentStatus =
  | 'pending_verification'
  | 'payment_confirmed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type LocalPaymentMethod = 'momo' | 'orange_money' | 'cash_delivery' | 'card';

export interface PrintDeliveryOrder {
  id: string;
  order_number: string;
  book_id: string;
  book_title: string;
  book_slug: string;
  format: string;
  format_sku: string;
  quantity: number;
  unit_price_cents: number;
  unit_price_xaf: number;
  total_price_xaf: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_city: string;
  delivery_address: string;
  delivery_notes?: string;
  payment_method: LocalPaymentMethod;
  payment_reference: string;
  status: OrderFulfillmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

