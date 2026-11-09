-- ==============================================================================
-- PROFESSOR KELLY MUA KINGSLY PLATFORM: MASTER PRODUCTION DATABASE INITIALIZER
-- ==============================================================================

-- ==============================================================================
-- PROFESSOR KELLY MUA KINGSLY PLATFORM
-- Complete Supabase PostgreSQL Schema, Enums, Indexes & Row Level Security (RLS)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CUSTOM ENUM TYPES
DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE format_type AS ENUM ('digital_pdf', 'digital_epub', 'physical_paperback', 'physical_hardcover');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. EXECUTIVE PROFILE & CAREER ENTITIES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    honorifics VARCHAR(255) NOT NULL,
    headline JSONB NOT NULL,             -- {"en": "...", "fr": "..."}
    short_bio JSONB NOT NULL,            -- {"en": "...", "fr": "..."}
    full_bio JSONB NOT NULL,             -- {"en": "...", "fr": "..."}
    portrait_url TEXT,
    public_email VARCHAR(255),
    location JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.career_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization JSONB NOT NULL,         -- {"en": "...", "fr": "..."}
    role_title JSONB NOT NULL,           -- {"en": "...", "fr": "..."}
    category VARCHAR(64) NOT NULL,       -- 'sovereign', 'multilateral', 'academic', 'advisory'
    period VARCHAR(64) NOT NULL,
    is_current BOOLEAN DEFAULT false,
    location VARCHAR(128),
    description JSONB NOT NULL,          -- {"en": "...", "fr": "..."}
    verification_source TEXT,
    display_order INT DEFAULT 0,
    status content_status DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CORE BOOKS ENTITY & HYBRID E-COMMERCE RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    isbn VARCHAR(32),
    title JSONB NOT NULL,                -- {"en": "...", "fr": "..."}
    subtitle JSONB,                      -- {"en": "...", "fr": "..."}
    synopsis JSONB NOT NULL,             -- {"en": "...", "fr": "..."}
    academic_category VARCHAR(100) NOT NULL,
    cover_image_url TEXT NOT NULL,
    total_pages INT,
    publish_date DATE,
    publisher VARCHAR(255),
    chapters JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    status content_status DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.book_formats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    format format_type NOT NULL,
    price_cents INT NOT NULL,            -- e.g., 2999 = $29.99
    currency VARCHAR(3) DEFAULT 'USD',
    is_available BOOLEAN DEFAULT true,
    file_storage_path TEXT,              -- Reference to Supabase Private Storage (if digital)
    sku VARCHAR(64) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.third_party_retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    platform_name VARCHAR(100) NOT NULL, -- 'Amazon', 'Barnes & Noble', 'Christian Faith Publishing'
    retail_url TEXT NOT NULL,
    affiliate_tag VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS & DIGITAL FULFILLMENT
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    total_amount_cents INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status order_status DEFAULT 'pending',
    payment_processor VARCHAR(50) NOT NULL, -- 'stripe', 'paystack', 'sandbox'
    processor_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    book_format_id UUID REFERENCES public.book_formats(id),
    price_paid_cents INT NOT NULL,
    download_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    download_count INT DEFAULT 0,
    download_limit INT DEFAULT 5,
    token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '72 hours')
);

-- 5. BLOG & THOUGHT LEADERSHIP
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title JSONB NOT NULL,                -- {"en": "...", "fr": "..."}
    excerpt JSONB NOT NULL,              -- {"en": "...", "fr": "..."}
    content_markdown JSONB NOT NULL,     -- {"en": "...", "fr": "..."}
    cover_image_url TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    estimated_read_minutes INT DEFAULT 6,
    doi_reference VARCHAR(128),
    status content_status DEFAULT 'published',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CONTACT SUBMISSIONS & AUDIT LOGGING
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    inquiry_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    consent_acknowledged BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'received',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_books_slug ON public.books(slug);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_order_items_token ON public.order_items(download_token);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.third_party_retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Strictly Published Records)
CREATE POLICY "Public reads profile"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Public reads published career entries"
ON public.career_entries FOR SELECT USING (status = 'published');

CREATE POLICY "Public reads published books"
ON public.books FOR SELECT USING (status = 'published');

CREATE POLICY "Public reads available book formats"
ON public.book_formats FOR SELECT USING (is_available = true);

CREATE POLICY "Public reads active third party retailers"
ON public.third_party_retailers FOR SELECT USING (is_active = true);

CREATE POLICY "Public reads published blog posts"
ON public.blog_posts FOR SELECT USING (status = 'published');

-- Order Items Token Validation Policy
CREATE POLICY "Users view order items with valid download token"
ON public.order_items FOR SELECT
USING (now() < token_expires_at AND download_count < download_limit);

-- Public Contact Submission Insert Policy
CREATE POLICY "Public can submit contact inquiries"
ON public.contact_submissions FOR INSERT
WITH CHECK (consent_acknowledged = true);

-- Authenticated Admin Full Management Policies
CREATE POLICY "Admins full management books"
ON public.books FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Admins full management blog"
ON public.blog_posts FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Admins full management career"
ON public.career_entries FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');


-- ==============================================================================
-- PROFESSOR KELLY MUA KINGSLY PLATFORM
-- Migration 0002: Media Appearances, Archival Gallery & Print Delivery Orders
-- ==============================================================================

-- 1. MEDIA APPEARANCES & KEYNOTES
CREATE TABLE IF NOT EXISTS public.media_appearances (
    id VARCHAR(64) PRIMARY KEY,
    title JSONB NOT NULL,                -- {"en": "...", "fr": "..."}
    type VARCHAR(64) NOT NULL,           -- 'Keynote Address', 'Ministerial Panel', etc.
    venue VARCHAR(255) NOT NULL,
    date VARCHAR(64) NOT NULL,
    location VARCHAR(255) NOT NULL,
    summary JSONB NOT NULL,              -- {"en": "...", "fr": "..."}
    source_url TEXT,
    image_url TEXT,
    category VARCHAR(64) DEFAULT 'press',-- 'broadcast', 'press', 'governance', 'academic'
    caption JSONB,                       -- {"en": "...", "fr": "..."}
    is_pinned BOOLEAN DEFAULT false,
    video_metadata JSONB,               -- {"youtube_id": "...", "duration": "..."}
    status content_status DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ARCHIVAL PHOTO GALLERY
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id VARCHAR(64) PRIMARY KEY,
    title JSONB NOT NULL,                -- {"en": "...", "fr": "..."}
    event_name JSONB NOT NULL,           -- {"en": "...", "fr": "..."}
    venue VARCHAR(255) NOT NULL,
    date VARCHAR(64) NOT NULL,
    year VARCHAR(16) NOT NULL,
    season VARCHAR(32) NOT NULL,         -- '2025-2026', '2023-2024', 'archive'
    location VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,       -- 'summit', 'academic', 'book_meetup', 'governance', 'diplomatic'
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption JSONB NOT NULL,              -- {"en": "...", "fr": "..."}
    participants_note JSONB,             -- {"en": "...", "fr": "..."}
    external_ref_url TEXT,
    is_featured_monthly BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRINT EDITION COURIER ORDERS (Trade Paperback & Hardcover)
CREATE TABLE IF NOT EXISTS public.print_delivery_orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    book_id VARCHAR(64) NOT NULL,
    book_title VARCHAR(255) NOT NULL,
    book_slug VARCHAR(255) NOT NULL,
    format VARCHAR(64) NOT NULL,
    format_sku VARCHAR(64) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price_cents INT NOT NULL DEFAULT 10700,
    unit_price_xaf INT NOT NULL DEFAULT 73955,
    total_price_xaf INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(64) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    payment_method VARCHAR(32) NOT NULL,  -- 'momo', 'orange_money', 'cash_delivery'
    payment_reference VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'pending_verification', -- 'pending_verification', 'payment_confirmed', 'dispatched', 'delivered', 'cancelled'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_media_appearances_category ON public.media_appearances(category);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_category ON public.gallery_photos(category);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_year ON public.gallery_photos(year);
CREATE INDEX IF NOT EXISTS idx_print_orders_number ON public.print_delivery_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_print_orders_status ON public.print_delivery_orders(status);
CREATE INDEX IF NOT EXISTS idx_print_orders_email ON public.print_delivery_orders(customer_email);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.media_appearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_delivery_orders ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public reads published media appearances"
ON public.media_appearances FOR SELECT USING (status = 'published');

CREATE POLICY "Public reads gallery photos"
ON public.gallery_photos FOR SELECT USING (true);

-- Public Order Submission
CREATE POLICY "Public inserts print delivery orders"
ON public.print_delivery_orders FOR INSERT
WITH CHECK (true);

-- Authenticated Admin Management Policies
CREATE POLICY "Admins full management media"
ON public.media_appearances FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Admins full management gallery"
ON public.gallery_photos FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Admins full management print orders"
ON public.print_delivery_orders FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Admins full management contact submissions"
ON public.contact_submissions FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');


-- ==============================================================================
-- PROFESSOR KELLY MUA KINGSLY PLATFORM
-- FULL PRODUCTION DATABASE SEED (EN & FR)
-- Compatible with Supabase PostgreSQL (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. BOOKS & MONOGRAPHIC TREATISES (11 Volumes)
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'paul-biya-the-art-of-the-credible-signature',
  '978-2-487-19825-1',
  '{"en":"Paul BIYA: The Art of the Credible Signature","fr":"Paul BIYA : L’Art de la Signature Crédible"}'::jsonb,
  '{"en":"Capital Markets under the Leadership of His Excellency Paul BIYA, President of the Republic: Challenges, Achievements and Prospects","fr":"Les Marchés des Capitaux sous le Leadership de Son Excellence Paul BIYA, Président de la République : Défis, Réalisations et Perspectives"}'::jsonb,
  '{"en":"A landmark 406-page treatise exploring Cameroon’s sovereign creditworthiness, financial statecraft, and capital market resource mobilization under President Paul Biya. Professor Kelly Mua Kingsly formulates the \"Theory of State Trust Capital\", demonstrating how an unbroken record of zero sovereign debt defaults from 1982 to 2025 has established Cameroon’s signature as a premier sovereign benchmark across domestic, regional (BVMAC), and international debt markets.","fr":"Traité magistral de 406 pages explorant la crédibilité financière, l’ingénierie souveraine et la mobilisation des ressources sur les marchés des capitaux sous le leadership du Président Paul Biya. Le Professeur Kelly Mua Kingsly y théorise le « Capital Confiance Étatique », démontrant comment un bilan sans défaut souverain de 1982 à 2025 a érigé la signature camerounaise en référence sur les marchés financiers domestiques, régionaux (BVMAC) et internationaux."}'::jsonb,
  'Sovereign Debt, PFM & Capital Markets',
  '/images/books/the-art-of-a-credible-signature-paul-biya.jpeg',
  406,
  '2026-11-05'::date,
  'Éditions All Access, Paris',
  '[{"number":1,"title":{"en":"Doctrinal Analysis of a Sovereign Trajectory: The Theory of State Trust Capital","fr":"Analyse Doctrinale d’une Trajectoire Souveraine : La Théorie du Capital Confiance Étatique"},"summary":{"en":"Frames Cameroon’s financial sovereignty beyond accounting balances into the teleology of state trust capital, analyzing how sovereign word and institutional credibility minimize debt-servicing spreads.","fr":"Inscrit la souveraineté financière du Cameroun dans une téléologie du capital confiance étatique, analysant comment la parole souveraine et la rigueur institutionnelle minorent les coûts d’emprunt."}},{"number":2,"title":{"en":"The 20 Sovereign Credibility Indicators of Cameroon (1982–2025+)","fr":"Les 20 Indicateurs de Crédibilité Souveraine du Cameroun (1982–2025+)"},"summary":{"en":"Systematic empirical evaluation of Cameroon’s sovereign metrics: zero default record, debt-to-GDP sustainability, primary surplus consolidation, and multilateral co-financing resilience.","fr":"Évaluation empirique des indicateurs de soutenabilité du Cameroun : historique de zéro défaut, viabilité du ratio dette/PIB, excédents primaires et résilience des cofinancements multilatéraux."}},{"number":3,"title":{"en":"Capital Market Mobilization: BVMAC, Regional Syndications, and Global Eurobonds","fr":"Mobilisation sur les Marchés de Capitaux : BVMAC, Syndications Régionales et Eurobonds"},"summary":{"en":"Detailed technical review of Cameroon’s pioneer sovereign treasury issuances, primary dealer network (SVT) dynamics, and sovereign benchmark pricing in CEMAC and London/Paris exchanges.","fr":"Revue technique des émissions pionnières de titres publics, du réseau des SVT et de la tarification des euro-obligations sur les places financières internationales et sous-régionales."}},{"number":4,"title":{"en":"The Economic Transformation Program: Vision 2035 & SND30 Industrial Financing","fr":"Le Programme de Transformation Économique : Vision 2035 & Financement SND30"},"summary":{"en":"Strategic roadmap linking sovereign capital market mobilization to the National Development Strategy (SND30), energy infrastructure, deep-sea ports, and trans-African logistical corridors.","fr":"Feuille de route stratégique arrimant la levée de capitaux à la Stratégie Nationale de Développement (SND30), aux grands projets énergétiques, portuaires et aux corridors transafricains."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 10700, 'USD', true, 'KMK-BIYA-SIG-PDF', 'private-books/the-art-of-a-credible-signature-paul-biya.pdf'
FROM public.books WHERE slug = 'paul-biya-the-art-of-the-credible-signature';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_hardcover'::format_type, 10700, 'USD', true, 'KMK-BIYA-SIG-HC', NULL
FROM public.books WHERE slug = 'paul-biya-the-art-of-the-credible-signature';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 10700, 'USD', true, 'KMK-BIYA-SIG-PB', NULL
FROM public.books WHERE slug = 'paul-biya-the-art-of-the-credible-signature';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon (Kindle & Paperback)', 'https://www.amazon.com/ART-CREDIBLE-SIGNATURE-PAUL-BIYA-ebook/dp/B0HPMP8BQZ', true
FROM public.books WHERE slug = 'paul-biya-the-art-of-the-credible-signature';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Hilton Yaoundé Official Launch Desk (5 Nov 2026)', 'https://forms.gle/KLRjZUB6vjcEtcsbA', true
FROM public.books WHERE slug = 'paul-biya-the-art-of-the-credible-signature';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'african-roadmap-in-the-fight-against-corrupt-practices',
  '978-620-9-25064-4',
  '{"en":"African Roadmap in the Fight Against Corrupt Practices","fr":"Feuille de Route des Pays Africains dans la Lutte Contre les Pratiques de Corruption"}'::jsonb,
  '{"en":"An Empirical Forensic Investigation into Public Sector Fraud in Cameroon and Nigeria","fr":"Enquête Forensique Empirique sur la Fraude et la Corruption dans le Secteur Public au Cameroun et au Nigeria"}'::jsonb,
  '{"en":"An authoritative empirical and forensic treatise examining the systemic root drivers of public-sector fraud and corruption across Sub-Saharan Africa. Applying the broken trust paradigm, the author formulates an evidentiary audit protocol, quantitative anomaly indicators, and a statutory legislative roadmap to dismantle institutional leakage and restore fiduciary accountability.","fr":"Traité empirique et forensique de référence analysant les ressorts profonds de la fraude et de la corruption dans le secteur public en Afrique subsaharienne. S’appuyant sur le modèle de la confiance rompue, l’auteur formule un protocole d’audit probatoire, des indicateurs quantitatifs d’anomalies et une feuille de route législative pour neutraliser les déperditions publiques."}'::jsonb,
  'Forensic Accounting & Public Integrity',
  '/assets/books/forensic-accounting.svg',
  312,
  '2025-01-10'::date,
  'Éditions Notre Savoir · Distribution La Boutique Africa Vivre',
  '[{"number":1,"title":{"en":"Etiology of Public Sector Leakage: The Broken Trust Model","fr":"Étiologie des Déperditions Publiques : Le Modèle de la Confiance Rompue"},"summary":{"en":"Analyzes institutional, psychological, and procedural vulnerabilities enabling white-collar corruption in sovereign ministries.","fr":"Analyse les vulnérabilités institutionnelles, psychologiques et procédurales facilitant la corruption des cols blancs."}},{"number":2,"title":{"en":"Evidentiary Standards & Quantitative Asset Tracing Protocols","fr":"Normes de Preuve et Protocoles Quantitatifs de Traçage d’Actifs"},"summary":{"en":"Formulates forensic accounting methodologies admissible before supreme audit institutions and financial magistrate courts.","fr":"Formule des méthodologies d’audit judiciaire recevables devant les cours des comptes et tribunaux financiers."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3500, 'USD', true, 'KMK-ARC-PDF', 'private-books/african-roadmap-corruption.pdf'
FROM public.books WHERE slug = 'african-roadmap-in-the-fight-against-corrupt-practices';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 4800, 'USD', true, 'KMK-ARC-PB', NULL
FROM public.books WHERE slug = 'african-roadmap-in-the-fight-against-corrupt-practices';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'La Boutique Africa Vivre', 'https://www.laboutiqueafricavivre.com/livres-specialises/312972-feuille-de-route-des-pays-africains-dans-la-lutte-contre-les-pratiques-de-corruption-9786209250644.html', true
FROM public.books WHERE slug = 'african-roadmap-in-the-fight-against-corrupt-practices';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'financial-crime-investigations',
  '978-1-64114-340-0',
  '{"en":"Financial Crime Investigations","fr":"Investigations sur la Criminalité Financière"}'::jsonb,
  '{"en":"Cross-Border AML, Sovereign Oversight & Regulatory Enforcement","fr":"LCB-FT Transfrontalière, Supervision Souveraine et Application Réglementaire"}'::jsonb,
  '{"en":"Addresses contemporary illicit financial flows, trade-based money laundering, beneficial ownership obfuscation, and coordinated investigative techniques for financial intelligence units and central banks.","fr":"Aborde les flux financiers illicites contemporains, le blanchiment basé sur le commerce, l’opacité des bénéficiaires effectifs et les techniques d’enquête coordonnées pour les cellules de renseignement financier."}'::jsonb,
  'Financial Integrity & AML',
  '/images/books/financial-crime-investigations.jpg',
  380,
  '2024-02-14'::date,
  'Christian Faith Publishing · Academic Press',
  '[{"number":1,"title":{"en":"Typologies of Illicit Financial Flows in Resource-Rich Economies","fr":"Typologies des Flux Financiers Illicites dans les Économies Riches en Ressources"},"summary":{"en":"Maps trade misinvoicing, shell-company layering, and sovereign revenue leakage vectors.","fr":"Cartographie la fausse facturation commerciale, les sociétés écrans et les vecteurs de déperdition des recettes publiques."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3600, 'USD', true, 'KMK-FCI-PDF', 'private-books/financial-crime.pdf'
FROM public.books WHERE slug = 'financial-crime-investigations';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_hardcover'::format_type, 5400, 'USD', true, 'KMK-FCI-HC', NULL
FROM public.books WHERE slug = 'financial-crime-investigations';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/s?k=Kelly+Kingsly+Financial+Crime+Investigation', true
FROM public.books WHERE slug = 'financial-crime-investigations';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'stock-markets-lever-for-growth-central-africa-bvmac',
  '978-1-68526-412-3',
  '{"en":"Stock Markets as a Lever for Growth in Central Africa","fr":"Les Marchés Boursiers comme Levier de Croissance en Afrique Centrale"}'::jsonb,
  '{"en":"The Case of the Central African Capital Market (BVMAC)","fr":"Le Cas du Marché Financier d’Afrique Centrale (BVMAC)"}'::jsonb,
  '{"en":"An authoritative empirical and institutional investigation into how capital market unification in the CEMAC region can catalyze long-term infrastructure financing, deepen secondary liquidity, and modernize sovereign and corporate debt issuance under COSUMAF and BVMAC.","fr":"Une étude empirique et institutionnelle de référence sur la manière dont l’unification du marché financier en zone CEMAC peut catalyser le financement des infrastructures à long terme, approfondir la liquidité secondaire et moderniser les émissions souveraines et privées sous l’égide de la COSUMAF et de la BVMAC."}'::jsonb,
  'Capital Markets & Sovereign Finance',
  '/assets/books/bvmac-capital-markets.svg',
  348,
  '2023-06-15'::date,
  'Christian Faith Publishing · Academic Series',
  '[{"number":1,"title":{"en":"Historical Evolution & Unification of the CEMAC Financial Market (DSX to BVMAC)","fr":"Évolution Historique et Unification du Marché Financier de la CEMAC (de la DSX à la BVMAC)"},"summary":{"en":"Analyzes the structural merger of the Douala Stock Exchange (DSX) and BVMAC into a unified regional exchange and central depository.","fr":"Analyse la fusion structurelle de la Douala Stock Exchange (DSX) et de la BVMAC en une bourse régionale unifiée."}},{"number":2,"title":{"en":"Sovereign Bond Syndication & Primary Market Architecture","fr":"Syndication des Obligations Souveraines et Architecture du Marché Primaire"},"summary":{"en":"Examines how CEMAC member states utilize capital market issuances to finance multi-year infrastructure programs.","fr":"Examine comment les États membres de la CEMAC mobilisent le marché financier pour financer leurs programmes d’infrastructures."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3400, 'USD', true, 'KMK-BVMAC-PDF', 'private-books/bvmac-capital-markets.pdf'
FROM public.books WHERE slug = 'stock-markets-lever-for-growth-central-africa-bvmac';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_epub'::format_type, 2900, 'USD', true, 'KMK-BVMAC-EPUB', 'private-books/bvmac-capital-markets.epub'
FROM public.books WHERE slug = 'stock-markets-lever-for-growth-central-africa-bvmac';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/s?k=Kelly+Mua+Kingsly+Stock+Markets+Central+Africa', true
FROM public.books WHERE slug = 'stock-markets-lever-for-growth-central-africa-bvmac';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'forensic-accounting-and-financial-investigation',
  '978-1-63525-478-5',
  '{"en":"Forensic Accounts and Ethics","fr":"Comptabilité Forensique et Éthique"}'::jsonb,
  '{"en":"Methodologies for Sovereign Audit, Asset Tracing & Institutional Integrity","fr":"Méthodologies pour l’Audit Souverain, le Traçage d’Actifs et l’Intégrité Institutionnelle"}'::jsonb,
  '{"en":"A rigorous practitioner and academic reference detailing forensic audit protocols, digital chain-of-custody standards, financial statement reconstruction, and expert witness reporting in complex public and corporate investigations.","fr":"Un ouvrage de référence académique et pratique détaillant les protocoles d’audit judiciaire, la chaîne de traçabilité des preuves numériques, la reconstitution d’états financiers et l’expertise judiciaire."}'::jsonb,
  'Forensic Accounting & Audit',
  '/images/books/forensic-accounting-and-financial-investigation.jpg',
  412,
  '2022-11-10'::date,
  'Christian Faith Publishing / IEM Press',
  '[{"number":1,"title":{"en":"Foundations of Forensic Accounting vs. Statutory Financial Auditing","fr":"Fondements de la Comptabilité Judiciaire face à l’Audit Financier Statutaire"},"summary":{"en":"Distinguishes materiality-based statutory audits from adversarial, evidentiary forensic investigations.","fr":"Distingue l’audit légal fondé sur la matérialité de l’investigation judiciaire à vocation probatoire."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3800, 'USD', true, 'KMK-FAFI-PDF', 'private-books/forensic-accounting.pdf'
FROM public.books WHERE slug = 'forensic-accounting-and-financial-investigation';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 4500, 'USD', true, 'KMK-FAFI-PB', NULL
FROM public.books WHERE slug = 'forensic-accounting-and-financial-investigation';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/s?k=Kelly+Kingsly+Forensic+Accounts+and+Ethics', true
FROM public.books WHERE slug = 'forensic-accounting-and-financial-investigation';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon UK (Édition Française)', 'https://www.amazon.co.uk/Comptabilit%C3%A9-forensique-%C3%A9thique-Kelly-Kingsly/dp/1947662775', true
FROM public.books WHERE slug = 'forensic-accounting-and-financial-investigation';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'identifying-red-flags-and-symptoms-of-fraud',
  '978-1-63874-219-7',
  '{"en":"Identifying Red Flags and Symptoms of Fraud","fr":"Identifier les Signaux d’Alerte et Symptômes de la Fraude"}'::jsonb,
  '{"en":"Preventive Diagnostics in Public & Corporate Financial Systems","fr":"Diagnostics Préventifs dans les Systèmes Financiers Publics et Privés"}'::jsonb,
  '{"en":"Provides audit committees, treasury inspectors, and compliance officers with an actionable taxonomy of behavioral, accounting, and organizational red flags that precede major financial fraud.","fr":"Fournit aux comités d’audit, inspecteurs du Trésor et responsables de la conformité une taxonomie opérationnelle des signaux d’alerte comportementaux, comptables et organisationnels précédant la fraude."}'::jsonb,
  'Forensic Accounting & Audit',
  '/assets/books/red-flags-fraud.svg',
  296,
  '2021-08-22'::date,
  'Christian Faith Publishing',
  '[{"number":1,"title":{"en":"The Fraud Triangle, Diamond & Pentagon in Public Institutions","fr":"Le Triangle, le Diamant et le Pentagone de la Fraude dans les Institutions Publiques"},"summary":{"en":"Adapts classical criminological fraud models to sovereign ministries and state-owned enterprises.","fr":"Adapte les modèles criminologiques classiques de la fraude aux ministères souverains et entreprises publiques."}},{"number":2,"title":{"en":"Procurement, Ghost Payrolls & Revenue Skimming Indicators","fr":"Indicateurs de Fraude aux Marchés Publics, Salaires Fictifs et Détournement de Recettes"},"summary":{"en":"Catalogs early warning indicators across public expenditure chains.","fr":"Répertorie les indicateurs d’alerte précoce tout au long de la chaîne de la dépense publique."}},{"number":3,"title":{"en":"Automated Anomaly Detection & Whistleblower Protocol Design","fr":"Détection Automatisée des Anomalies et Conception du Dispositif d’Alerte"},"summary":{"en":"Integrates automated Benford algorithms and secure whistleblower reporting channels.","fr":"Intègre les algorithmes statistiques de Benford et des canaux sécurisés de signalement interne."}}]'::jsonb,
  false,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 2800, 'USD', true, 'KMK-RFF-PDF', 'private-books/red-flags-fraud.pdf'
FROM public.books WHERE slug = 'identifying-red-flags-and-symptoms-of-fraud';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 3600, 'USD', true, 'KMK-RFF-PB', NULL
FROM public.books WHERE slug = 'identifying-red-flags-and-symptoms-of-fraud';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/s?k=Kelly+Mua+Kingsly+Identifying+Red+Flags', true
FROM public.books WHERE slug = 'identifying-red-flags-and-symptoms-of-fraud';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'economic-and-financial-bailout-programs-emerging-africa',
  '978-1-63648-039-8',
  '{"en":"Economic and Financial Bail Out Programs for an Emerging Africa","fr":"Programmes de Sauvetage Économique et Financier pour une Afrique Émergente"}'::jsonb,
  '{"en":"Imposed Programs: Myth or Reality?","fr":"Programmes Imposés : Mythe ou Réalité ?"}'::jsonb,
  '{"en":"A critical, empirical examination of structural adjustment and sovereign bailout interventions across Sub-Saharan Africa. Prof. Kingsly evaluates whether externally mandated structural reforms have catalyzed genuine economic emergence or entrenched systemic fiscal debt and dependency, offering actionable governance frameworks for sovereign self-determination.","fr":"Une analyse critique et empirique des plans d’ajustement structurel et programmes de sauvetage financier en Afrique subsaharienne. Le Pr Kingsly examine si les réformes imposées de l’extérieur ont catalysé l’émergence économique ou accentué la dette et la dépendance budgétaire, proposant des cadres d’autodétermination souveraine."}'::jsonb,
  'Sovereign Debt & Structural Policy',
  '/images/books/economic-bailout-programs-africa.jpg',
  152,
  '2020-11-22'::date,
  'Eliva Press',
  '[{"number":1,"title":{"en":"Bretton Woods Structural Adjustment Paradigms in Sub-Saharan Africa","fr":"Paradigmes d’Ajustement Structurel de Bretton Woods en Afrique Subsaharienne"},"summary":{"en":"Evaluates the macroeconomic conditionalities of multi-lateral bailouts and their fiscal impact.","fr":"Évalue les conditionnalités macroéconomiques des sauvetages multilatéraux et leur impact budgétaire."}},{"number":2,"title":{"en":"Sovereign Resilience & Endogenous Growth Alternatives","fr":"Résilience Souveraine et Alternatives de Croissance Endogène"},"summary":{"en":"Proposes domestic revenue mobilization and regional capital syndications as sustainable alternatives.","fr":"Propose la mobilisation des recettes internes et la syndication financière régionale comme alternatives viables."}},{"number":3,"title":{"en":"Institutional Governance & Post-Bailout Fiscal Recovery Blueprints","fr":"Gouvernance Institutionnelle et Schémas de Relance Budgétaire Post-Sauvetage"},"summary":{"en":"Formulates statutory debt management offices and domestic bond debt refinancing strategies.","fr":"Formule des stratégies de gestion de la dette publique et de refinancement par le marché intérieur."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3200, 'USD', true, 'KMK-EBO-PDF', 'private-books/economic-bailout-programs-africa.pdf'
FROM public.books WHERE slug = 'economic-and-financial-bailout-programs-emerging-africa';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 4200, 'USD', true, 'KMK-EBO-PB', NULL
FROM public.books WHERE slug = 'economic-and-financial-bailout-programs-emerging-africa';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/dp/163648039X', true
FROM public.books WHERE slug = 'economic-and-financial-bailout-programs-emerging-africa';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'eBay Direct Marketplace', 'https://www.ebay.com/p/13050384895', true
FROM public.books WHERE slug = 'economic-and-financial-bailout-programs-emerging-africa';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'disruptive-technology-blockchain-the-crystal-ball',
  '978-1-09804-155-7',
  '{"en":"Disruptive Technology: Blockchain – The Crystal Ball","fr":"Technologie Disruptive : La Blockchain – La Boule de Cristal"}'::jsonb,
  '{"en":"Advancing Financial Trust, Inclusion, and Simplicity Through the Blockchain","fr":"Promouvoir la Confiance Financière, l’Inclusion et la Simplicité Grâce à la Blockchain"}'::jsonb,
  '{"en":"A pioneering treatise examining distributed ledger technology (DLT), smart contracts, and quantum blockchain protocols as instruments for sovereign registry transparency, financial inclusion, and cross-border settlement in emerging economies.","fr":"Un traité novateur analysant les registres distribués, les contrats intelligents et les protocoles blockchain comme instruments de transparence des registres souverains, d’inclusion financière et de compensation transfrontalière."}'::jsonb,
  'Financial Technology & Digital Trust',
  '/images/books/disruptive-technology-blockchain.jpg',
  284,
  '2020-11-20'::date,
  'Christian Faith Publishing / IEM Press',
  '[{"number":1,"title":{"en":"Blockchain Microstructure: Beyond Cryptocurrencies to Fiduciary Trust","fr":"Microstructure de la Blockchain : Au-delà des Crypto-actifs, le Registre de Confiance"},"summary":{"en":"Establishes cryptographic immutability as a foundation for sovereign property and fiscal records.","fr":"Établit l’immuabilité cryptographique comme socle des registres fonciers et budgétaires de l’État."}},{"number":2,"title":{"en":"Smart Contracts in Public Procurement & Treasury Liquidity Execution","fr":"Contrats Intelligents dans la Commande Publique et l’Exécution du Trésor"},"summary":{"en":"Designs programmatic escrow disbursements and automated milestone verifications for state contracts.","fr":"Modélise les décaissements séquestres programmés et la vérification automatisée des étapes contractuelles."}},{"number":3,"title":{"en":"Cross-Border Central Bank Digital Currencies (CBDCs) and Trade Settlement","fr":"Monnaies Numériques de Banque Centrale (MNBC) et Règlement Commercial"},"summary":{"en":"Explores regional CBDC clearing architectures to reduce foreign exchange transaction friction across African trade corridors.","fr":"Explore les architectures de compensation interbancaire en MNBC pour fluidifier les corridors commerciaux africains."}}]'::jsonb,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3000, 'USD', true, 'KMK-DTB-PDF', 'private-books/disruptive-technology-blockchain.pdf'
FROM public.books WHERE slug = 'disruptive-technology-blockchain-the-crystal-ball';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 3900, 'USD', true, 'KMK-DTB-PB', NULL
FROM public.books WHERE slug = 'disruptive-technology-blockchain-the-crystal-ball';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon France', 'https://www.amazon.fr/Disruptive-Technology-Blockchain-Advancing-Simplicity/dp/1098041550', true
FROM public.books WHERE slug = 'disruptive-technology-blockchain-the-crystal-ball';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Italy (IEM Edition)', 'https://www.amazon.it/Corporate-Fraud-Management-Kelly-Kingsly/dp/1641407328', true
FROM public.books WHERE slug = 'disruptive-technology-blockchain-the-crystal-ball';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'business-risk-management',
  '978-1-94766-286-5',
  '{"en":"Business Risk Management","fr":"Gestion des Risques d’Entreprise"}'::jsonb,
  '{"en":"A Comprehensive Framework for Enterprise Vulnerability & Resilience","fr":"Un Cadre Intégré pour la Vulnérabilité et la Résilience de l’Entreprise"}'::jsonb,
  '{"en":"A comprehensive management manual detailing quantitative enterprise risk management (ERM), internal controls, scenario stress-testing, and compliance alignment across volatile market environments.","fr":"Un manuel de référence détaillant la gestion quantitative des risques d’entreprise (ERM), le contrôle interne, les tests de résistance de scénarios et l’alignement de conformité dans des environnements de marché volatils."}'::jsonb,
  'Enterprise Risk Management',
  '/images/books/business-risk-management.jpg',
  266,
  '2020-07-01'::date,
  'IEM Press',
  '[{"number":1,"title":{"en":"Enterprise Risk Taxonomy: Operational, Market & Credit Exposures","fr":"Taxonomie des Risques d’Entreprise : Expositions Opérationnelles, de Marché et de Crédit"},"summary":{"en":"Establishes holistic measurement frameworks for systemic risk.","fr":"Établit des cadres de mesure holistiques du risque systémique."}},{"number":2,"title":{"en":"Scenario Analysis, Stress Testing & Business Continuity Protocols","fr":"Analyse de Scénarios, Tests de Résistance et Continuité d’Activité"},"summary":{"en":"Formulates dynamic stress testing for cash reserves and supply chain liquidity buffers.","fr":"Formule des tests de résistance dynamiques pour les réserves de trésorerie et la chaîne d’approvisionnement."}},{"number":3,"title":{"en":"Board Governance, Audit Committees & Risk Culture Alignment","fr":"Gouvernance du Conseil, Comités d’Audit et Culture du Risque"},"summary":{"en":"Embeds proactive risk oversight into boardroom steering and executive remuneration policies.","fr":"Intègre le pilotage proactif des risques dans la gouvernance du conseil et les rémunérations de direction."}}]'::jsonb,
  false,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 2900, 'USD', true, 'KMK-BRM-PDF', 'private-books/business-risk-management.pdf'
FROM public.books WHERE slug = 'business-risk-management';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 3800, 'USD', true, 'KMK-BRM-PB', NULL
FROM public.books WHERE slug = 'business-risk-management';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/dp/1947662864', true
FROM public.books WHERE slug = 'business-risk-management';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'corporate-fraud-risk-management',
  '978-1-94766-290-2',
  '{"en":"Corporate Fraud Risk Management","fr":"Gestion des Risques de Fraude en Entreprise"}'::jsonb,
  '{"en":"Preventative Controls, Forensic Detection & Whistleblower Frameworks","fr":"Contrôles Préventifs, Détection Forensique et Dispositifs d’Alerte Professionnelle"}'::jsonb,
  '{"en":"Essential treatise for senior executives and internal auditors establishing systemic defenses against corporate misappropriation, financial statement falsification, and bribery.","fr":"Traité indispensable pour dirigeants et auditeurs internes instaurant des défenses systémiques contre les détournements d’actifs, la falsification des états financiers et la corruption."}'::jsonb,
  'Forensic Accounting & Corporate Fraud',
  '/images/books/corporate-fraud-risk-management.jpg',
  310,
  '2020-06-15'::date,
  'IEM Press / Christian Faith Publishing',
  '[{"number":1,"title":{"en":"Anti-Fraud Governance Architecture & Tone at the Top","fr":"Architecture de Gouvernance Anti-Fraude et Exemplarité du Sommet"},"summary":{"en":"Designs whistleblower mechanisms and independent fraud investigative charters.","fr":"Conçoit les dispositifs d’alerte éthique et les chartes d’enquête interne."}},{"number":2,"title":{"en":"Digital Auditing: Detecting Asset Misappropriation & Financial Tampering","fr":"Audit Numérique : Détection des Détournements d’Actifs et Manipulations Comptables"},"summary":{"en":"Applies automated transaction surveillance, Benford analysis, and journal-entry anomaly scoring.","fr":"Applique la surveillance automatisée des transactions, l’analyse de Benford et le scoring des écritures comptables."}},{"number":3,"title":{"en":"Investigative Interviews, Chain of Custody & Judicial Referral","fr":"Entretiens d’Investigation, Chaîne de Preuve et Transmission Judiciaire"},"summary":{"en":"Details evidentiary interview techniques and preserving forensic integrity for financial litigation.","fr":"Détaille les techniques d’audition probatoire et la préservation de l’intégrité forensique devant la justice."}}]'::jsonb,
  false,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 3100, 'USD', true, 'KMK-CFRM-PDF', 'private-books/corporate-fraud-risk-management.pdf'
FROM public.books WHERE slug = 'corporate-fraud-risk-management';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_epub'::format_type, 2600, 'USD', true, 'KMK-CFRM-EPUB', 'private-books/corporate-fraud-risk-management.epub'
FROM public.books WHERE slug = 'corporate-fraud-risk-management';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Kindle (English Edition)', 'https://www.amazon.com/dp/B089QTD6BP', true
FROM public.books WHERE slug = 'corporate-fraud-risk-management';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Kindle (Édition Française)', 'https://www.amazon.com/dp/B089QTSHBS', true
FROM public.books WHERE slug = 'corporate-fraud-risk-management';
INSERT INTO public.books (id, slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, chapters, is_featured, status)
VALUES (
  uuid_generate_v4(),
  'mind-the-gap-bottom-line-and-ethical-behaviour',
  '978-1-64349-912-0',
  '{"en":"Mind the Gap: The Bottom Line and Ethical Behaviour","fr":"Combler l’Écart : Rentabilité Financière et Éthique de Gouvernance"}'::jsonb,
  '{"en":"How Volkswagen Failed to Reconcile the Two?","fr":"Comment Volkswagen a Échoué à Réconcilier les Deux ?"}'::jsonb,
  '{"en":"An incisive examination of corporate governance, board oversight, and ESG accountability through the lens of the Volkswagen emissions scandal—demonstrating how ethical blind spots destroy long-term shareholder and societal value.","fr":"Une analyse approfondie de la gouvernance d’entreprise, de la supervision du conseil d’administration et de la responsabilité ESG à travers l’étude du scandale Volkswagen."}'::jsonb,
  'Corporate Governance & ESG',
  '/assets/books/mind-the-gap-esg.svg',
  264,
  '2020-05-18'::date,
  'Christian Faith Publishing',
  '[{"number":1,"title":{"en":"Boardroom Architecture & The Illusion of Compliance","fr":"Architecture du Conseil d’Administration et l’Illusion de la Conformité"},"summary":{"en":"Examines dual-board governance vulnerabilities when technical compliance is decoupled from ethical leadership.","fr":"Examine les vulnérabilités de gouvernance lorsque la conformité technique est dissociée du leadership éthique."}}]'::jsonb,
  false,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  isbn = EXCLUDED.isbn,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  academic_category = EXCLUDED.academic_category,
  cover_image_url = EXCLUDED.cover_image_url,
  total_pages = EXCLUDED.total_pages,
  publish_date = EXCLUDED.publish_date,
  publisher = EXCLUDED.publisher,
  chapters = EXCLUDED.chapters,
  is_featured = EXCLUDED.is_featured;

INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'digital_pdf'::format_type, 2600, 'USD', true, 'KMK-MTG-PDF', 'private-books/mind-the-gap.pdf'
FROM public.books WHERE slug = 'mind-the-gap-bottom-line-and-ethical-behaviour';
INSERT INTO public.book_formats (book_id, format, price_cents, currency, is_available, sku, file_storage_path)
SELECT id, 'physical_paperback'::format_type, 3400, 'USD', true, 'KMK-MTG-PB', NULL
FROM public.books WHERE slug = 'mind-the-gap-bottom-line-and-ethical-behaviour';
INSERT INTO public.third_party_retailers (book_id, platform_name, retail_url, is_active)
SELECT id, 'Amazon Global', 'https://www.amazon.com/s?k=Kelly+Mua+Kingsly+Mind+the+Gap+Volkswagen', true
FROM public.books WHERE slug = 'mind-the-gap-bottom-line-and-ethical-behaviour';

-- 2. POLICY BRIEFS & WORKING PAPERS (4 Briefs)
INSERT INTO public.blog_posts (id, slug, title, excerpt, content_markdown, cover_image_url, category, tags, estimated_read_minutes, doi_reference, status)
VALUES (
  uuid_generate_v4(),
  'analyzing-bvmac-liquidity-paradigms-central-africa',
  '{"en":"Analyzing BVMAC Liquidity Paradigms and Sovereign Bond Depth in Central Africa","fr":"Analyse des Paradigmes de Liquidité de la BVMAC et Profondeur du Marché Obligataire en Afrique Centrale"}'::jsonb,
  '{"en":"A strategic policy assessment of post-unification market microstructure across the CEMAC zone, examining institutional investor participation and secondary market clearing mechanisms.","fr":"Une évaluation stratégique de la microstructure du marché financier unifié de la CEMAC, examinant la participation des investisseurs institutionnels et la liquidité secondaire."}'::jsonb,
  '{"en":"## 1. Structural Context: Unification of the Regional Exchange\n\nThe consolidation of the Central African financial market under the single exchange architecture of BVMAC and the regulatory supervision of COSUMAF established an essential institutional foundation. However, transforming primary sovereign bond syndications into an active, liquid secondary market requires targeted structural incentives for non-bank institutional investors, including pension funds and insurance underwriters.\n\n## 2. Deepening Maturity Curves and De-Risking Infrastructure Issuances\n\nWhen sovereign issuers coordinate closely with multilateral guarantee institutions such as ATIDI and regional development banks, credit-enhanced project bonds can attract long-term domestic and international capital without overburdening short-term treasury liquidity.","fr":"## 1. Contexte Structurel : L’Unification de la Bourse Régionale\n\nLa consolidation du marché financier d’Afrique centrale autour de la BVMAC et sous la supervision de la COSUMAF a posé un socle institutionnel déterminant. Toutefois, convertir le dynamisme du marché primaire des titres publics en un marché secondaire liquide exige des incitations structurelles ciblées en direction des investisseurs institutionnels non bancaires.\n\n## 2. Allongement de la Courbe des Taux et Sécurisation des Émissions d’Infrastructures\n\nLorsque les émetteurs souverains coordonnent leurs opérations avec des institutions multilatérales de garantie telles que l’ATIDI et les banques de développement, les obligations de projet rehaussées permettent de mobiliser l’épargne longue sans alourdir la trésorerie à court terme."}'::jsonb,
  '/images/blog/analyzing-bvmac-liquidity-paradigms-central-africa.jpg',
  'Capital Markets',
  ARRAY['BVMAC', 'COSUMAF', 'CEMAC', 'Sovereign Bonds', 'Capital Markets']::text[],
  8,
  'KMK-PB-2026-01',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_url = EXCLUDED.cover_image_url,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  estimated_read_minutes = EXCLUDED.estimated_read_minutes,
  doi_reference = EXCLUDED.doi_reference;

INSERT INTO public.blog_posts (id, slug, title, excerpt, content_markdown, cover_image_url, category, tags, estimated_read_minutes, doi_reference, status)
VALUES (
  uuid_generate_v4(),
  'sovereign-green-bonds-and-climate-resilient-debt-frameworks',
  '{"en":"Sovereign Green Bonds & Climate-Resilient Debt Frameworks in Emerging Economies","fr":"Obligations Vertes Souveraines et Cadres de Dette Résiliente au Climat dans les Économies Émergentes"}'::jsonb,
  '{"en":"How the Global Green Bond Initiative (UNDP-GEF) and rigorous use-of-proceeds verification can lower sovereign borrowing costs while financing Congo Basin biodiversity and clean infrastructure.","fr":"Comment l’Initiative Mondiale sur les Obligations Vertes (PNUD-FEM) et la traçabilité rigoureuse des fonds permettent d’optimiser le coût de financement souverain tout en protégeant le Bassin du Congo."}'::jsonb,
  '{"en":"## 1. Aligning Sovereign Fiscal Architecture with Green Taxonomies\n\nCredible thematic sovereign issuances depend on auditable budget tagging, independent second-party opinions (SPOs), and transparent impact reporting. Integrating environmental expenditure tracking directly within state treasury execution prevents greenwashing and unlocks concessional blended finance.","fr":"## 1. Aligner l’Architecture Budgétaire Souveraine avec les Taxonomies Vertes\n\nLa crédibilité des émissions souveraines thématiques repose sur un marquage budgétaire vérifiable, des avis indépendants (SPO) et un reporting d’impact rigoureux. L’intégration du suivi environnemental au cœur de l’exécution du Trésor prévient l’écoblanchiment et ouvre l’accès aux financements mixtes."}'::jsonb,
  '/images/blog/sovereign-green-bonds-and-climate-resilient-debt-frameworks.jpg',
  'ESG & Climate Finance',
  ARRAY['Green Bonds', 'UNDP-GEF', 'Climate Finance', 'Sovereign Debt', 'ESG']::text[],
  7,
  'KMK-PB-2026-02',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_url = EXCLUDED.cover_image_url,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  estimated_read_minutes = EXCLUDED.estimated_read_minutes,
  doi_reference = EXCLUDED.doi_reference;

INSERT INTO public.blog_posts (id, slug, title, excerpt, content_markdown, cover_image_url, category, tags, estimated_read_minutes, doi_reference, status)
VALUES (
  uuid_generate_v4(),
  'forensic-audit-controls-in-modern-public-financial-management',
  '{"en":"Embedding Preventive Forensic Audit Controls in Public Financial Management (PFM)","fr":"Intégrer les Contrôles Préventifs d’Audit Judiciaire dans la Gestion des Finances Publiques (GFP)"}'::jsonb,
  '{"en":"Moving beyond ex-post compliance inspections toward continuous quantitative red-flag screening across state treasury disbursements and public procurement.","fr":"Dépasser les contrôles de conformité a posteriori pour instaurer une détection quantitative continue des signaux d’alerte sur la chaîne de la dépense publique."}'::jsonb,
  '{"en":"## 1. Continuous Anomaly Detection in Treasury Single Accounts\n\nAs state budgets expand in scale and complexity, manual sampling is no longer sufficient. Embedding automated Benford distribution checks, vendor-beneficiary cross-matching, and split-requisition alerts inside integrated financial management information systems (IFMIS) intercepts irregularities prior to settlement.","fr":"## 1. Détection Continue d’Anomalies au sein du Compte Unique du Trésor\n\nFace à l’accroissement des volumes budgétaires, l’échantillonnage manuel ne suffit plus. L’intégration de tests automatisés de distribution de Benford et de recoupements des bénéficiaires effectifs au sein des systèmes d’information financière permet d’intercepter les irrégularités avant le décaissement."}'::jsonb,
  '/images/blog/forensic-audit-controls-in-modern-public-financial-management.jpg',
  'Forensic Auditing & Integrity',
  ARRAY['Forensic Accounting', 'PFM', 'Fraud Detection', 'Public Treasury']::text[],
  9,
  'KMK-PB-2026-03',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_url = EXCLUDED.cover_image_url,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  estimated_read_minutes = EXCLUDED.estimated_read_minutes,
  doi_reference = EXCLUDED.doi_reference;

INSERT INTO public.blog_posts (id, slug, title, excerpt, content_markdown, cover_image_url, category, tags, estimated_read_minutes, doi_reference, status)
VALUES (
  uuid_generate_v4(),
  'multilateral-risk-mitigation-and-african-trade-finance',
  '{"en":"Multilateral Risk Mitigation and Sovereign Credit Enhancement in African Trade Finance","fr":"Atténuation Multilatérale des Risques et Rehaussement de Crédit Souverain en Afrique"}'::jsonb,
  '{"en":"Examining the catalytic role of multilateral political risk insurance and credit guarantees in narrowing the African risk perception premium.","fr":"Analyse du rôle catalyseur de l’assurance contre le risque politique et des garanties multilatérales dans la réduction de la prime de risque perçue en Afrique."}'::jsonb,
  '{"en":"## 1. Correcting Asymmetric Risk Pricing through Multilateral Guarantees\n\nEmpirical default rates on African infrastructure and sovereign-backed trade obligations consistently outperform market-implied credit spreads. Multilateral insurers with preferred-creditor status bridge this gap by absorbing political and payment-delay risks, unlocking longer maturities from global commercial syndicates.","fr":"## 1. Corriger l’Asymétrie de Tarification du Risque par les Garanties Multilatérales\n\nLes taux de défaut empiriques sur les projets d’infrastructures en Afrique demeurent nettement inférieurs aux primes de risque implicites du marché. Les assureurs multilatéraux bénéficiant du statut de créancier privilégié permettent de réduire cet écart et d’allonger les maturités bancaires."}'::jsonb,
  '/images/blog/multilateral-risk-mitigation-and-african-trade-finance.jpg',
  'Sovereign Debt & PFM',
  ARRAY['ATIDI', 'Trade Finance', 'Credit Enhancement', 'Multilateral Governance']::text[],
  6,
  'KMK-PB-2026-04',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_url = EXCLUDED.cover_image_url,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  estimated_read_minutes = EXCLUDED.estimated_read_minutes,
  doi_reference = EXCLUDED.doi_reference;


-- 3. SOVEREIGN & MULTILATERAL CAREER ENTRIES (20 Mandates)
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Ministry of Finance, Republic of Cameroon (MINFI)","fr":"Ministère des Finances, République du Cameroun (MINFI)"}'::jsonb,
  '{"en":"Director of Finance Operations of the State","fr":"Directeur des Opérations Financières de l’État"}'::jsonb,
  'sovereign',
  '2016 – Present',
  true,
  'Yaoundé, Cameroon',
  '{"en":"Directs sovereign financial operations, state revenue and expenditure monitoring, the financial operations dashboard (TOFE), debt evaluations, and government bond syndications on regional capital markets.","fr":"Dirige les opérations financières de l’État, le suivi des recettes et dépenses publiques, le tableau des opérations financières (TOFE), l’évaluation de la dette et les syndications obligataires sur le marché des capitaux."}'::jsonb,
  '{"en":"Statutory public-sector executive appointment · Decree Ref. MINFI","fr":"Nomination statutaire de la fonction publique · Décret Ministériel MINFI"}'::jsonb,
  1,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"African Trade & Investment Development Insurance (ATIDI)","fr":"Agence pour l’Assurance du Commerce en Afrique (ATIDI)"}'::jsonb,
  '{"en":"Chairman of the Board of Directors","fr":"Président du Conseil d’Administration"}'::jsonb,
  'multilateral',
  '2024 – Present',
  true,
  'Nairobi, Kenya (Pan-African Sovereign Mandate)',
  '{"en":"Provides strategic board leadership across 24 African sovereign member states, presiding over the 2024–2027 strategic plan, governance committees, and multilateral underwriting of trade credit and political risk insurance.","fr":"Assure la présidence stratégique du Conseil d’Administration auprès de 24 États souverains membres, pilotant le plan stratégique 2024–2027, les comités de gouvernance et la souscription multilatérale d’assurance-crédit et de risques politiques."}'::jsonb,
  '{"en":"Multilateral sovereign constituency election · ATIDI Constituent Treaty Charter","fr":"Élection par les États membres souverains · Traité constitutif multilatéral ATIDI"}'::jsonb,
  2,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"ATIDI (African Trade & Investment Development Insurance)","fr":"Agence pour l’Assurance du Commerce en Afrique (ATIDI)"}'::jsonb,
  '{"en":"Board Director (Non-Executive)","fr":"Administrateur au Conseil d’Administration"}'::jsonb,
  'multilateral',
  '2023 – 2024',
  false,
  'Nairobi, Kenya',
  '{"en":"Delivered governance oversight, financial performance reviews, and sovereign risk mitigation policy decisions across member nations.","fr":"A assuré la gouvernance d’entreprise, la surveillance de la performance financière et la validation des politiques d’atténuation des risques souverains."}'::jsonb,
  '{"en":"Multilateral Board Governance Record · ATIDI Board of Directors Register","fr":"Registre de gouvernance multilatérale · Conseil d’Administration ATIDI"}'::jsonb,
  3,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Global Banking & Markets (GBM)","fr":"Global Banking & Markets (GBM)"}'::jsonb,
  '{"en":"Founding Member of the Board of Directors","fr":"Membre Fondateur du Conseil d’Administration"}'::jsonb,
  'advisory',
  '2026 – Present',
  true,
  'International / Global',
  '{"en":"Provides strategic leadership to a premier international platform uniting finance ministers, central bank governors, multilateral development banks, institutional investors, and market regulators to deepen global banking and capital markets.","fr":"Apporte son leadership stratégique à une plateforme internationale d’élite réunissant ministres des finances, gouverneurs de banques centrales, banques de développement, investisseurs institutionnels et régulateurs pour moderniser les marchés de capitaux mondiaux."}'::jsonb,
  '{"en":"Global Institutional Board Charter · International Financial Community Platform","fr":"Charte institutionnelle internationale · Plateforme des Marchés Financiers Mondiaux"}'::jsonb,
  4,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Good Neighborhood Commerce Institute (GNCI)","fr":"Good Neighborhood Commerce Institute (GNCI)"}'::jsonb,
  '{"en":"Chief Financial Strategic Advisor & Non-Executive Board Director","fr":"Conseiller Stratégique Financier en Chef & Administrateur Non-Exécutif"}'::jsonb,
  'advisory',
  '2026 – Present',
  true,
  'United States',
  '{"en":"Provides independent financial leadership, capital structuring, blended finance advisory, and fiduciary governance oversight to empower underserved communities through entrepreneurship and capital access.","fr":"Apporte un leadership financier indépendant, une expertise en structuration de capital et en finance mixte pour soutenir l’entrepreneuriat et l’inclusion économique des communautés mal desservies."}'::jsonb,
  '{"en":"US Non-Executive Board Appointment · GNCI Governance Charter","fr":"Mandat d’administrateur non-exécutif · Charte de gouvernance GNCI"}'::jsonb,
  5,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"UNDP-GEF Global ABS Project / Resilient Debt Platform","fr":"Initiative Mondiale sur les Obligations Vertes / Plateforme Dette Résiliente (PNUD-FEM)"}'::jsonb,
  '{"en":"Designated National Authority & Strategic Coordinator","fr":"Autorité Nationale Désignée & Coordonnateur Stratégique"}'::jsonb,
  'multilateral',
  '2024 – Present',
  true,
  'New York, US / Yaoundé, Cameroon',
  '{"en":"Leads sovereign green bond advocacy, sustainable finance taxonomy harmonization, and debt resilience frameworks in partnership with UNDP and the Global Environment Facility (GEF).","fr":"Pilote le plaidoyer pour les obligations vertes souveraines, l’harmonisation des taxonomies de finance durable et les cadres de résilience de la dette avec le PNUD et le FEM."}'::jsonb,
  '{"en":"Multilateral climate finance designation · UNDP-GEF Focal Authority","fr":"Désignation multilatérale en finance durable · Autorité focale PNUD-FEM"}'::jsonb,
  6,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"COSUMAF (Central African Financial Market Supervisory Commission)","fr":"COSUMAF (Commission de Surveillance du Marché Financier de l’Afrique Centrale)"}'::jsonb,
  '{"en":"Designated Institutional Representative of Cameroon","fr":"Représentant Institutionnel Désigné de la République du Cameroun"}'::jsonb,
  'sovereign',
  '2016 – 2024',
  false,
  'Libreville, Gabon / CEMAC Zone',
  '{"en":"Represented the State of Cameroon on the regional market supervisory board, safeguarding public savings, overseeing the unified BVMAC stock exchange, and regulating financial intermediaries across six CEMAC nations.","fr":"A représenté l’État du Cameroun au collège de surveillance du marché financier régional, veillant à la protection de l’épargne, à la régulation de la BVMAC et au contrôle des intermédiaires agréés dans les six pays de la CEMAC."}'::jsonb,
  '{"en":"CEMAC Regional Regulatory Protocol · Formal Sovereign Appointment","fr":"Protocole réglementaire CEMAC · Décret officiel de nomination de l’État"}'::jsonb,
  7,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"BEAC / CPC-TP (Bank of Central African States)","fr":"BEAC / CPC-TP (Banque des États de l’Afrique Centrale)"}'::jsonb,
  '{"en":"Supervisory Censor & Public Securities Oversight Member","fr":"Censeur & Suivi des Émissions de Titres Publics"}'::jsonb,
  'sovereign',
  '2016 – 2024',
  false,
  'Yaoundé / CEMAC Sub-Region',
  '{"en":"Executed central bank fiduciary surveillance, sovereign liquidity alignment, and public securities auction oversight across regional financial institutions.","fr":"A exercé les missions de surveillance fiduciaire auprès de la banque centrale, le suivi de la liquidité souveraine et des adjudications de titres publics du Trésor."}'::jsonb,
  '{"en":"Central Bank Fiduciary Protocol · BEAC Statutory Register","fr":"Protocole de surveillance fiduciaire · Registre statutaire BEAC"}'::jsonb,
  8,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Ministry of Finance — General Directorate of Treasury, Monetary and Financial Cooperation","fr":"Ministère des Finances — Direction Générale du Trésor et de la Coopération Financière et Monétaire"}'::jsonb,
  '{"en":"Strategic Advisor to the General Directorate","fr":"Conseiller Stratégique auprès de la Direction Générale"}'::jsonb,
  'sovereign',
  '2014 – 2024',
  false,
  'Yaoundé, Cameroon',
  '{"en":"Coordinated multidisciplinary professional teams, program budgeting execution, complex financial systems design, import/export license monetization, and multilateral negotiations with the IMF, CEMAC, and international partners.","fr":"A coordonné des équipes pluridisciplinaires, la réforme du budget-programme, la conception d’outils de monétisation des licences d’import/export et les négociations multilatérales avec le FMI et la CEMAC."}'::jsonb,
  '{"en":"General Directorate of Treasury Statutory Advisory Record","fr":"Dossier de fonction statutaire · Direction Générale du Trésor"}'::jsonb,
  9,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"United Nations Development Programme (UNDP)","fr":"Programme des Nations Unies pour le Développement (PNUD)"}'::jsonb,
  '{"en":"Deputy Resident Representative for Operations (DRR/O)","fr":"Représentant Résident Adjoint chargé des Opérations"}'::jsonb,
  'multilateral',
  '2008 – 2024',
  false,
  'United Nations System / Country Offices',
  '{"en":"Directed country-level operations, budget management, IPSAS compliance, human resources, procurement integrity, ICT infrastructure, and UN common services administration across multi-donor programs.","fr":"A dirigé les opérations pays, la gestion budgétaire, la conformité aux normes IPSAS, les ressources humaines, l’intégrité des achats et l’administration des services communs du système des Nations Unies."}'::jsonb,
  '{"en":"United Nations Diplomatic & Operations Record · Award for Meritorious Service","fr":"Dossier diplomatique et opérationnel de l’ONU · Prix pour services méritoires"}'::jsonb,
  10,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"African Development Bank (AfDB / BAD)","fr":"Banque Africaine de Développement (BAD)"}'::jsonb,
  '{"en":"Senior Project Coordinator & Financial Consultant","fr":"Coordonnateur Principal de Projet & Consultant Financier"}'::jsonb,
  'multilateral',
  '2014 – Present',
  true,
  'Abidjan, Côte d’Ivoire / Regional Operations',
  '{"en":"Oversees forecasting, annual budgeting, variance analysis, financial reporting, and operational audits for major regional development financing interventions.","fr":"Supervise la prévision budgétaire, l’analyse des écarts, le contrôle financier et les audits opérationnels de projets de développement structurants."}'::jsonb,
  '{"en":"AfDB Institutional Consultancy & Project Supervision Portfolio","fr":"Mandat d’expertise et de coordination fiduciaire · Banque Africaine de Développement"}'::jsonb,
  11,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"École Nationale d’Administration et de Magistrature (ENAM)","fr":"École Nationale d’Administration et de Magistrature (ENAM)"}'::jsonb,
  '{"en":"Senior Lecturer in Public Finance & Forensic Accounting","fr":"Enseignant-Chercheur en Finances Publiques & Audit Judiciaire"}'::jsonb,
  'academic',
  '2022 – Present',
  true,
  'Yaoundé, Cameroon',
  '{"en":"Trains senior civil servants, state auditors, and financial magistrates in public financial management, forensic auditing, fraud detection, and capital markets.","fr":"Forme les magistrats financiers, inspecteurs d’État et hauts cadres administratifs aux finances publiques, à l’audit judiciaire et à la détection de la fraude."}'::jsonb,
  '{"en":"Academic Faculty Appointment · ENAM Faculty of Administration","fr":"Corps professoral académique · Faculté d’Administration de l’ENAM"}'::jsonb,
  12,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Copperstone University","fr":"Université Copperstone"}'::jsonb,
  '{"en":"Professor of Forensic Finance & Audits","fr":"Professeur de Finance Forensique & Audit"}'::jsonb,
  'academic',
  '2018 – Present',
  true,
  'Namibia / International',
  '{"en":"Curriculum design, postgraduate research supervision, and publishing in peer-reviewed journals on financial forensics, behavioral finance, and cybersecurity intersectionality.","fr":"Conception des cursus doctoraux, direction de recherche et publications scientifiques sur la criminalistique financière, la finance comportementale et la cybersécurité."}'::jsonb,
  '{"en":"Academic Professorial Chair Appointment · University Senate","fr":"Chaire professorale académique · Sénat Universitaire Copperstone"}'::jsonb,
  13,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Quantum Blockchain Capital / QNTBC","fr":"Quantum Blockchain Capital / QNTBC"}'::jsonb,
  '{"en":"Board Director & Strategic Financial Advisor","fr":"Administrateur au Conseil & Conseiller Financier Stratégique"}'::jsonb,
  'advisory',
  '2017 – Present',
  true,
  'Boston, Massachusetts / Minnesota, United States',
  '{"en":"Provides corporate governance, fiduciary audit, mission determination, and risk assessment for emerging blockchain architectures and quantum computing financial infrastructure.","fr":"Assure la gouvernance d’entreprise, la surveillance fiduciaire et l’évaluation des risques technologiques pour les infrastructures financières blockchain et quantiques."}'::jsonb,
  '{"en":"Corporate Board of Directors Register · Boston & Minnesota","fr":"Registre du Conseil d’Administration · Boston & Minnesota, États-Unis"}'::jsonb,
  14,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"OAPAP (African Organization for Public Administration Performance)","fr":"OAPAP (Organisation Africaine pour la Performance des Administrations Publiques)"}'::jsonb,
  '{"en":"Central Technical Advisory Council Member","fr":"Membre du Conseil Technique Central"}'::jsonb,
  'academic',
  '2020 – Present',
  true,
  'Yaoundé, Cameroon',
  '{"en":"Multidisciplinary voluntary initiative founded by alumni of ISMP, IRIC, and ENAM working tirelessly to enhance the performance and ethical standards of African public administrations.","fr":"Initiative panafricaine fondée par les diplômés de l’ISMP, de l’IRIC et de l’ENAM œuvrant pour l’accroissement de la performance et de l’éthique des administrations publiques africaines."}'::jsonb,
  '{"en":"Pan-African Public Administration Technical Council","fr":"Conseil technique panafricain d’expertise publique"}'::jsonb,
  15,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Prima Finance and Investments (PRIMA MFI Plc)","fr":"Prima Finance and Investment (PRIMA MFI Plc)"}'::jsonb,
  '{"en":"Board President & Founder","fr":"Président du Conseil & Fondateur"}'::jsonb,
  'advisory',
  '2019 – 2024',
  false,
  'Yaoundé, Cameroon / United States',
  '{"en":"Founded and presided over a licensed Category II microfinance institution, introducing digital microfinance products to solve financial exclusion and expand borrowing access for SMEs.","fr":"A fondé et présidé un établissement de microfinance de 2ème catégorie agréé, introduisant des solutions numériques pour lutter contre l’exclusion financière et financer les PME."}'::jsonb,
  '{"en":"Licensed Category II Microfinance Institution Regulatory Charter · COBAC / MINFI","fr":"Agrément réglementaire d’Établissement de Microfinance 2e Catégorie · COBAC / MINFI"}'::jsonb,
  16,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"RECO Foundation","fr":"Fondation RECO"}'::jsonb,
  '{"en":"Founder & Executive Board Chair","fr":"Fondateur & Président"}'::jsonb,
  'advisory',
  '2015 – Present',
  true,
  'Centre Region, Cameroon',
  '{"en":"Directs community social impact initiatives, youth education bursaries, and ethical leadership programs in public administration and civic responsibility.","fr":"Dirige des initiatives philanthropiques d’impact communautaire, de bourses d’études et de formation au leadership éthique pour la jeunesse."}'::jsonb,
  '{"en":"Non-Profit Civic Foundation Charter","fr":"Statuts officiels de fondation d’utilité sociale"}'::jsonb,
  17,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Ministry of Finance — Buea Regional Treasury & Kumba Divisional Treasury","fr":"Ministère des Finances — Trésorerie Régionale de Buea & Trésorerie Départementale de Kumba"}'::jsonb,
  '{"en":"Chief of Accounts, Expenditure, Deposits & Consignments / Divisional Treasurer a.i.","fr":"Chef de Service Comptabilité, Dépenses, Dépôts & Consignations / Trésorier Départemental p.i."}'::jsonb,
  'sovereign',
  '2006 – 2009',
  false,
  'Buea / Kumba, South West Region, Cameroon',
  '{"en":"Administered territorial public treasury operations, daily cash provision controls, purchase order and voucher verification, and management accounts production.","fr":"A géré les opérations comptables du Trésor territorial, le contrôle des caisses, le visa des bons d’engagement et la production des comptes de gestion."}'::jsonb,
  '{"en":"Territorial Public Treasury Administrative Record · MINFI","fr":"Dossier de carrière Trésor Public territorial · MINFI"}'::jsonb,
  18,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Ministry of Economy and Finance","fr":"Ministère de l’Économie et des Finances"}'::jsonb,
  '{"en":"Inspector-Auditor (Inspecteur Vérificateur)","fr":"Inspecteur Vérificateur"}'::jsonb,
  'sovereign',
  '2007 – 2008',
  false,
  'Yaoundé / Centre Region, Cameroon',
  '{"en":"Conducted unannounced financial inspections, regularity controls, and management account audits across public organizations and territorial services.","fr":"A conduit des vérifications inopinées, des contrôles de régularité et des audits de comptes de gestion auprès des administrations publiques."}'::jsonb,
  '{"en":"General Inspectorate of Finance Statutory Inspection Record","fr":"Registre des missions de contrôle · Inspection Générale des Finances"}'::jsonb,
  19,
  'published'
);
INSERT INTO public.career_entries (id, organization, role_title, category, period, is_current, location, description, verification_source, display_order, status)
VALUES (
  uuid_generate_v4(),
  '{"en":"Marstejes Enterprise & Premier Service Group","fr":"Marstejes Enterprise & Premier Service Group"}'::jsonb,
  '{"en":"Managing Director & Deputy Managing Director","fr":"Directeur Général & Directeur Général Adjoint"}'::jsonb,
  'advisory',
  '1997 – 2005',
  false,
  'Buea / North West Region, Cameroon',
  '{"en":"Early executive career directing corporate management, financial software tracking, human resource systems, and client delivery operations.","fr":"Début de carrière de direction générale gérant les ressources financières, l’informatisation des processus et la coordination d’équipes opérationnelles."}'::jsonb,
  '{"en":"Corporate Management Historical Records","fr":"Registres historiques de direction d’entreprise"}'::jsonb,
  20,
  'published'
);

-- 4. MEDIA APPEARANCES & TV KEYNOTES (27 Items)
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-atidi-25th-speech',
  '{"en":"Official Keynote: Prof. Kelly Mua Kingsly Speech at the 25th Anniversary Celebrations of ATIDI","fr":"Allocution Officielle : Discours du Pr Kelly Mua Kingsly lors des Célébrations du 25e Anniversaire de l’ATIDI"}'::jsonb,
  'Keynote Address',
  'ATIDI 25th Anniversary Gala / Institutional Broadcast',
  '2025',
  'Nairobi, Kenya (Pan-African Multilateral)',
  '{"en":"Keynote address by Board Chairman Prof. Kelly Mua Kingsly celebrating a quarter-century of multilateral credit insurance, trade de-risking, and cross-border commercial underwriting across Africa, honoring foundational milestones and charting the 2025–2030 continental vision.","fr":"Allocution solennelle du Président du Conseil d’administration, le Pr Kelly Mua Kingsly, célébrant un quart de siècle d’assurance-crédit multilatérale et de dé-risquage commercial en Afrique, dressant le bilan des réalisations et traçant la vision continentale 2025-2030."}'::jsonb,
  'https://www.youtube.com/watch?v=SSnFs_7JE5k',
  NULL,
  'broadcast',
  '{"en":"Twenty-five years of ATIDI demonstrates that African risk can be underwritten prudently, sustainably, and profitably when multilateral discipline meets sovereign determination.","fr":"Vingt-cinq années d’existence de l’ATIDI démontrent que le risque africain peut être garanti avec rigueur, pérennité et rentabilité lorsque la discipline multilatérale s’allie à la volonté souveraine."}'::jsonb,
  true,
  '{"youtube_id":"SSnFs_7JE5k","duration":"18:45","caption_note":{"en":"Closed Captions (CC) available in English & French · Pinned Keynote Feature","fr":"Sous-titres (CC) disponibles en anglais et français · Allocution officielle à la une"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-broadcast-africa24',
  '{"en":"Guest of the Day: Prof. Kelly Mua Kingsly on African Stock Exchanges & Capital Market Fragmentation","fr":"Invité du Jour : Pr Kelly Mua Kingsly sur les Bourses Africaines et la Fragmentation des Marchés de Capitaux"}'::jsonb,
  'Broadcast Interview',
  'Africa24 English · Special Guest of the Day',
  '2024-10-18',
  'Nairobi / Pan-African Broadcast',
  '{"en":"Broadcast interview on Africa24 analyzing why African stock exchanges account for only 0.4% of global market capitalization despite massive industrialization capital needs. Prof. Kingsly articulates strategic imperatives to overcome liquidity constraints, reduce market fragmentation, and catalyze domestic institutional capital.","fr":"Entretien télévisé sur Africa24 analysant les défis structurels des bourses africaines, qui ne représentent que 0,4 % de la capitalisation mondiale malgré d’immenses besoins d’infrastructures. Le Pr Kingsly expose les leviers pour remédier au manque de liquidité, surmonter la fragmentation et mobiliser l’épargne institutionnelle locale."}'::jsonb,
  'https://www.youtube.com/watch?v=immOAR9skzI',
  NULL,
  'broadcast',
  '{"en":"Africa accounts for less than 1% of global capital market capitalization despite representing a fifth of world population. Our strategic imperative is eliminating liquidity traps and mobilizing sovereign domestic capital into cross-border industrial assets.","fr":"L’Afrique représente moins de 1 % de la capitalisation boursière mondiale alors qu’elle compte un cinquième de l’humanité. L’impératif stratégique consiste à éliminer les pièges de liquidité et à mobiliser l’épargne souveraine locale vers l’appareil productif."}'::jsonb,
  false,
  '{"youtube_id":"immOAR9skzI","duration":"14:20","caption_note":{"en":"Closed Captions (CC) available in English & French · Africa24 Special Guest Broadcast","fr":"Sous-titres (CC) disponibles en anglais et français · Diffusion spéciale Invité Africa24"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-impact-voices',
  '{"en":"Prof. Kelly Mua Kingsley: Financial Engineer, Scholar & Transformational Entrepreneur","fr":"Pr Kelly Mua Kingsley : Ingénieur Financier, Universitaire et Entrepreneur de l’Impact"}'::jsonb,
  'Broadcast Interview',
  'Impact Voices Africa with Beverly Ndifoin',
  '2021',
  'International Broadcast',
  '{"en":"Extended biographical dialogue exploring financial engineering, executive mentorship of over 10,000 professionals, rural micro-credit empowerment for women farmers, and early-stage capital syndication for African youth.","fr":"Dialogue biographique approfondi sur l’ingénierie financière, le mentorat de plus de 10 000 cadres dans le monde, l’autonomisation rurale des agricultrices par le micro-crédit et le financement de startups de jeunes africains."}'::jsonb,
  'https://www.youtube.com/watch?v=_3W-T5KSoqc',
  NULL,
  'broadcast',
  '{"en":"Impact is fundamentally about leadership; we all are leaders in our spheres, and the measure of true wealth is the human capacity we emancipate.","fr":"L’impact est l’essence même du leadership ; nous sommes tous des leaders dans nos domaines, et la véritable richesse réside dans le potentiel humain que nous émancipons."}'::jsonb,
  false,
  '{"youtube_id":"_3W-T5KSoqc","duration":"28:10","caption_note":{"en":"Closed Captions (CC) available in English · Impact Voices Africa Feature","fr":"Sous-titres (CC) disponibles en anglais · Entretien Impact Voices Africa"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-prc-tv-bottom-line',
  '{"en":"The Economic Bottom Line: Sovereign Fiscal Policy & Debt Strategy with Prof. Kelly Mua Kingsley","fr":"The Economic Bottom Line : Politique Budgétaire et Stratégie de Dette avec le Pr Kelly Mua Kingsley"}'::jsonb,
  'Broadcast Interview',
  'PRC TV · The Economic Bottom Line',
  '2023',
  'Yaoundé / Pan-African',
  '{"en":"Special broadcast interview examining state liquidity management, sovereign bond pricing, fiscal consolidation mechanisms, and the economic bottom line for Central African growth.","fr":"Grand entretien télévisé analysant la gestion de la trésorerie de l’État, la tarification des obligations souveraines, les leviers d’assainissement budgétaire et la résilience macro-financière en zone CEMAC."}'::jsonb,
  'https://www.youtube.com/watch?v=BQl_aZkXgTE',
  NULL,
  'broadcast',
  '{"en":"Sovereign fiscal resilience is not achieved through austerity alone, but through disciplined revenue mobilization, predictive treasury budgeting, and capital market depth.","fr":"La résilience budgétaire souveraine ne résulte pas de la seule rigueur, mais d’une mobilisation rigoureuse des recettes, d’une trésorerie prédictive et de la profondeur du marché des capitaux."}'::jsonb,
  false,
  '{"youtube_id":"BQl_aZkXgTE","duration":"22:15","caption_note":{"en":"Closed Captions (CC) available in English · PRC TV Special Interview","fr":"Sous-titres (CC) disponibles en anglais · Entretien spécial PRC TV"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-housing-infrastructure',
  '{"en":"Unlocking Capital and Blended Partnerships for African Housing and Urban Infrastructure","fr":"Mobiliser les Capitaux et Partenariats Mixtes pour le Logement et les Infrastructures en Afrique"}'::jsonb,
  'Keynote Address',
  'Africa Real Estate & Business Insights',
  '2024',
  'Pan-African Forum',
  '{"en":"Policy address on structuring blended finance facilities, institutional mortgage liquidity, and multilateral guarantees to resolve the continental urban infrastructure and affordable housing deficit.","fr":"Intervention sur la structuration de financements mixtes, les facilités de liquidité hypothécaire et les garanties multilatérales pour combler le déficit de logements sociaux et d’infrastructures urbaines."}'::jsonb,
  'https://www.youtube.com/watch?v=Sb7c6hfjvUQ',
  NULL,
  'broadcast',
  '{"en":"Urban infrastructure cannot rely solely on commercial bank loans; it requires structured project bonds with credit enhancements that pension funds and insurers can safely hold.","fr":"Les infrastructures urbaines ne peuvent reposer sur le seul crédit bancaire court terme ; elles exigent des obligations de projet adossées à des garanties adaptées aux caisses de retraite."}'::jsonb,
  false,
  '{"youtube_id":"Sb7c6hfjvUQ","duration":"16:40","caption_note":{"en":"Closed Captions (CC) available in English · Africa Real Estate & Business Insights","fr":"Sous-titres (CC) disponibles en anglais · Africa Real Estate & Business Insights"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-cabri-covid-impact',
  '{"en":"Economic and Financial Impact of Covid-19 in Cameroon: Sovereign Treasury Diagnostic","fr":"Impact Économique et Financier du Covid-19 au Cameroun : Diagnostic du Trésor Public"}'::jsonb,
  'Ministerial Panel',
  'Collaborative Africa Budget Reform Initiative (CABRI)',
  '2020',
  'Pretoria / Yaoundé (Pan-African)',
  '{"en":"Sovereign treasury presentation delivered to ministerial delegations across Africa evaluating the fiscal shock of Covid-19, emergency stimulus reprioritization, and resilient cash-buffer management in Cameroon.","fr":"Présentation de haut niveau devant les délégations ministérielles africaines évaluant le choc budgétaire de la crise sanitaire, la réallocation des dépenses d’urgence et la gestion des réserves de trésorerie au Cameroun."}'::jsonb,
  'https://www.youtube.com/watch?v=cy8U6Lnk7aE',
  NULL,
  'broadcast',
  '{"en":"Crisis budgeting tests sovereign liquidity resilience; preserving essential public spending while safeguarding sovereign debt sustainability is the hallmark of modern fiscal leadership.","fr":"La budgétisation de crise éprouve la résilience de la trésorerie souveraine ; préserver les dépenses vitales tout en maintenant la soutenabilité de la dette caractérise le leadership budgétaire."}'::jsonb,
  false,
  '{"youtube_id":"cy8U6Lnk7aE","duration":"19:30","caption_note":{"en":"Closed Captions (CC) available in French & English · CABRI Ministerial Series","fr":"Sous-titres (CC) disponibles en français et anglais · Série ministérielle CABRI"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-professorship-induction',
  '{"en":"Solemn Academic Induction into the Full Professorial Rank: Professor Kelly Mua Kingsly","fr":"Cérémonie Solennelle d’Intronisation au Grade de Professeur Titulaire : Pr Kelly Mua Kingsly"}'::jsonb,
  'Academic Lecture',
  'University Senate & Academic Induction Council',
  '2021',
  'International Academic Convocation',
  '{"en":"Solemn university induction ceremony conferring the rank of Full Professor of Forensic Accounting and Public Policy upon Prof. Kelly Mua Kingsly, celebrating decades of peer-reviewed research, doctoral supervision, and statutory treatises.","fr":"Cérémonie solennelle consacrant l’accession au grade de Professeur Titulaire en comptabilité judiciaire et politiques publiques du Pr Kelly Mua Kingsly, saluant ses traités de référence et la direction de thèses doctorales."}'::jsonb,
  'https://www.youtube.com/watch?v=taOPS1LwQvw',
  NULL,
  'academic',
  '{"en":"True academic scholarship must serve public integrity; our forensic research is incomplete until it arms statutory auditors with verifiable tools to protect public wealth.","fr":"L’excellence académique doit être au service de l’intégrité publique ; nos travaux en audit forensique ne valent que s’ils outillent concrètement les magistrats pour protéger le bien commun."}'::jsonb,
  false,
  '{"youtube_id":"taOPS1LwQvw","duration":"11:50","caption_note":{"en":"Closed Captions (CC) available · Full Professorship Induction Ceremony","fr":"Sous-titres (CC) disponibles · Cérémonie d’intronisation professorale"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-africa24-newsroom',
  '{"en":"Africa Newsroom: Re-engineering African Stock Exchanges to Finance Continental Growth","fr":"Africa Newsroom : Bourses Africaines, Financer Autrement les Économies du Continent"}'::jsonb,
  'Broadcast Interview',
  'Africa 24 · Africa Newsroom',
  '2024',
  'Paris / Pan-African Broadcast',
  '{"en":"In-depth television newsroom debate exploring alternative financing models for African economies, cross-listing sovereign bonds, harmonizing regulatory taxonomies, and expanding domestic institutional investor appetite.","fr":"Débat télévisé approfondi explorant les modèles alternatifs de financement en Afrique, la double cotation des titres publics, l’harmonisation réglementaire et l’attrait des investisseurs institutionnels locaux."}'::jsonb,
  'https://www.youtube.com/watch?v=phMj0J40b-s',
  NULL,
  'broadcast',
  '{"en":"African bourses cannot remain passive quotation boards; they must become active development engines that channel domestic pension savings directly into real infrastructure.","fr":"Les bourses africaines ne peuvent rester de simples plateformes de cotation passive ; elles doivent devenir des moteurs actifs canalisant l’épargne vers l’économie réelle."}'::jsonb,
  false,
  '{"youtube_id":"phMj0J40b-s","duration":"12:45","caption_note":{"en":"Closed Captions (CC) available in French & English · Africa 24 Newsroom","fr":"Sous-titres (CC) disponibles en français et anglais · Africa 24 Newsroom"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-culture-identity',
  '{"en":"Culture is Our Identity: Leveraging Diaspora Leadership and Heritage for Sustainable Development","fr":"La Culture est Notre Identité : Mobiliser le Leadership de la Diaspora pour le Développement"}'::jsonb,
  'Policy Interview',
  'Pan-African Daily TV with Dr. Susan Tatah',
  '2023',
  'Vienna / Pan-African Diaspora Forum',
  '{"en":"Dialogue examining the economic impact of diaspora repatriation, cultural identity as an anchor for institutional ethics, and strategic mechanisms to channel diaspora remittances into sovereign capital investments.","fr":"Entretien sur l’impact économique du retour de la diaspora, l’ancrage culturel comme socle d’éthique institutionnelle et les mécanismes pour orienter les transferts de fonds vers des obligations productives."}'::jsonb,
  'https://www.youtube.com/watch?v=8MA7rPE2Jds',
  NULL,
  'broadcast',
  '{"en":"Our cultural identity is not a relic of the past; it is the ethical compass that guides fiscal integrity and inspires our diaspora to reinvest expertise and capital into African soil.","fr":"Notre identité culturelle n’est pas un vestige ; elle constitue la boussole éthique qui fonde l’intégrité financière et incite la diaspora à réinvestir ses compétences en Afrique."}'::jsonb,
  false,
  '{"youtube_id":"8MA7rPE2Jds","duration":"25:05","caption_note":{"en":"Closed Captions (CC) available · Pan-African Daily TV Interview","fr":"Sous-titres (CC) disponibles · Entretien Pan-African Daily TV"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-crtv-forensic-ethics',
  '{"en":"CRTV National Broadcast: Presentation of \"Forensic Account and Ethics\" by Prof. Kelly M. Kingsly","fr":"Édition Spéciale CRTV : Présentation de l’Ouvrage \"Forensic Account and Ethics\" du Pr Kelly M. Kingsly"}'::jsonb,
  'Broadcast Interview',
  'CRTV (Cameroon Radio Television) · Special Feature',
  '2019',
  'Yaoundé, Cameroon',
  '{"en":"National television coverage of the institutional book launch of \"Forensic Account and Ethics\", presenting modern quantitative diagnostics and corporate governance safeguards to statutory auditing authorities.","fr":"Grand reportage de la télévision nationale camerounaise sur la présentation institutionnelle de l’ouvrage \"Forensic Account and Ethics\", exposant les méthodes modernes de détection de la fraude aux corps de contrôle de l’État."}'::jsonb,
  'https://www.youtube.com/watch?v=7BXr_44r_Ac',
  NULL,
  'broadcast',
  '{"en":"Accountability cannot exist without evidentiary standards; forensic accounting arms the legal system with undeniable financial facts to safeguard sovereign credibility.","fr":"La redevabilité ne saurait exister sans rigueur probatoire ; la comptabilité judiciaire fournit à la justice des faits financiers irréfutables pour préserver la crédibilité de l’État."}'::jsonb,
  false,
  '{"youtube_id":"7BXr_44r_Ac","duration":"15:20","caption_note":{"en":"Closed Captions (CC) available in English & French · CRTV National Broadcast","fr":"Sous-titres (CC) disponibles en anglais et français · Diffusion nationale CRTV"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-future-africa-economy',
  '{"en":"The Future of Africa’s Economy: Sovereign Wealth, Resource Governance and Continental Prosperity","fr":"L’Avenir de l’Économie Africaine : Souveraineté Budgétaire, Gestion des Ressources et Prospérité"}'::jsonb,
  'Policy Interview',
  'Pan-African Daily TV with Dr. Susan Tatah',
  '2023',
  'International Broadcast',
  '{"en":"Strategic vision addressing sovereign wealth creation, domestic processing of raw commodities, debt re-engineering, and establishing robust capital market infrastructures across Sub-Saharan Africa.","fr":"Vision stratégique sur la création de richesse souveraine, la transformation locale des matières premières, le réaménagement de la dette et l’édification d’infrastructures de marché de capitaux en Afrique."}'::jsonb,
  'https://www.youtube.com/watch?v=JSOfK6ea8Lw',
  NULL,
  'broadcast',
  '{"en":"Africa’s prosperity will not be donated from abroad; it will be engineered through local value addition, robust treasury governance, and integrated continental capital markets.","fr":"La prospérité de l’Afrique ne viendra pas de l’extérieur ; elle sera forgée par la transformation locale, une gouvernance budgétaire rigoureuse et des marchés de capitaux intégrés."}'::jsonb,
  false,
  '{"youtube_id":"JSOfK6ea8Lw","duration":"21:40","caption_note":{"en":"Closed Captions (CC) available · Pan-African Daily TV Special Feature","fr":"Sous-titres (CC) disponibles · Émission spéciale Pan-African Daily TV"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-crtv-emprunt-obligataire',
  '{"en":"State Bond Issue Ecmr 2022–2029: Public Treasury Operations & Regional Capital Mobilization","fr":"Ressources (CRTV) : Dossier sur l’Emprunt Obligataire Ecmr 2022–2029 et les Opérations du Trésor"}'::jsonb,
  'Policy Interview',
  'CRTV Économie · Émission Ressources avec R. Gwladys Lebouda',
  '2022-05-25',
  'Yaoundé, Cameroon',
  '{"en":"In-depth public finance television dossier detailing the structuring, syndication, and investor appetite for Cameroon’s landmark multi-tranche sovereign bond issue Ecmr 2022–2029 on the BVMAC regional stock exchange.","fr":"Dossier économique télévisé détaillant la structuration technique, le consortium de placement et la sursouscription de l’emprunt obligataire souverain Ecmr 2022-2029 du Cameroun sur la BVMAC."}'::jsonb,
  'https://www.youtube.com/watch?v=eLPNnUVv2aw',
  NULL,
  'broadcast',
  '{"en":"The oversubscription of our sovereign treasury bonds confirms the trust of regional institutional investors in Cameroon’s macroeconomic trajectory and debt servicing credibility.","fr":"La sursouscription de nos emprunts obligataires confirme la confiance solide des investisseurs institutionnels régionaux dans la trajectoire macroéconomique et la signature du Cameroun."}'::jsonb,
  false,
  '{"youtube_id":"eLPNnUVv2aw","duration":"26:30","caption_note":{"en":"Closed Captions (CC) available in French · CRTV Économie Ressources","fr":"Sous-titres (CC) disponibles en français · CRTV Économie Ressources"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-video-prc-tv-enjeux-defis',
  '{"en":"Enjeux & Défis: Strategic Public Finance Governance and Sovereign Wealth Protection","fr":"Enjeux & Défis : Gouvernance Stratégique des Finances Publiques et Sauvegarde du Patrimoine de l’État"}'::jsonb,
  'Policy Interview',
  'PRC TV · Magazine Enjeux et Défis',
  '2023',
  'Yaoundé, Cameroon',
  '{"en":"Television institutional feature analyzing key public finance challenges: streamlining public expenditure execution, mitigating sovereign credit risks, and strengthening state treasury accountability.","fr":"Grand magazine institutionnel analysant les grands défis des finances publiques : fluidification de la dépense, maîtrise des risques budgétaires et renforcement des contrôles de l’État."}'::jsonb,
  'https://www.youtube.com/watch?v=ngKnXdAuKEM',
  NULL,
  'broadcast',
  '{"en":"Modern public finance management requires anticipating risks before they become liabilities, ensuring that every disbursed state franc directly serves sovereign growth.","fr":"La gestion moderne des deniers publics exige d’anticiper les risques avant qu’ils ne deviennent des dettes, garantissant que chaque franc engagé serve directement le développement national."}'::jsonb,
  false,
  '{"youtube_id":"ngKnXdAuKEM","duration":"17:15","caption_note":{"en":"Closed Captions (CC) available in French & English · PRC TV Special Magazine","fr":"Sous-titres (CC) disponibles en français et anglais · Magazine spécial PRC TV"}}'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-press-237actu-portrait',
  '{"en":"Cameroon: Prof. Kelly MUA, The Master of Public Finance with Multiple Mandates","fr":"Cameroun : Pr Kelly MUA ou l’AS de la Finance Publique aux Multiples Casquettes"}'::jsonb,
  'Press Feature',
  '237 Actu · Dossier Spécial Économie',
  '2022-04-04',
  'Yaoundé, Cameroon',
  '{"en":"Detailed national press portrait tracing Prof. Kingsly’s high-level career across state treasury operations, central bank regulatory censorship (BEAC), regional market oversight (COSUMAF), and scholarly authorship in forensic accounting and public management.","fr":"Grand portrait de la presse nationale retraçant la carrière de haut niveau du Pr Kingsly entre la Direction générale du Trésor, le censorat de la BEAC, la supervision financière (COSUMAF) et ses travaux académiques de référence en audit judiciaire."}'::jsonb,
  'https://237actu.com/cameroun-pr-kelly-mua-ou-l-as-de-la-finance-publique-aux-multiples-casquettes/',
  '/images/photos/photo8.jpeg',
  'press',
  '{"en":"A multi-disciplinary public servant whose mathematical precision in public finance operations is matched by an unwavering commitment to anti-fraud institution building.","fr":"Un serviteur de l’État pluridisciplinaire dont la précision mathématique dans les opérations financières publiques s’accompagne d’un engagement indéfectible envers la transparence institutionnelle."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-governance-afsic-speaker',
  '{"en":"Keynote Speaker Profile: Prof. Kelly Mua Kingsley at AFSIC – Investing in Africa (London)","fr":"Profil d’Intervenant Principal : Pr Kelly Mua Kingsley à l’AFSIC – Investir en Afrique (Londres)"}'::jsonb,
  'Institutional Governance',
  'AFSIC – Investing in Africa (London, United Kingdom)',
  '2024-10-08',
  'London, United Kingdom / International',
  '{"en":"Official institutional speaker registry for Europe’s premier Africa investment forum, detailing Prof. Kingsly’s mandates as Director of Finance Operations of the State, ATIDI Board Director, BEAC Censor, and pioneer in sovereign debt de-risking.","fr":"Notice officielle d’intervenant au premier sommet d’investissement européen dédié à l’Afrique, détaillant ses fonctions de Directeur des Opérations Financières de l’État, administrateur de l’ATIDI, censeur de la BEAC et pionnier du dé-risquage souverain."}'::jsonb,
  'https://www.afsic.net/speaker/kelly-kingsley-2024-speaker/',
  '/images/photos/photo11.jpeg',
  'governance',
  '{"en":"Bridging international institutional syndicates with African sovereign infrastructure requires structured risk mitigation, credit enhancement, and unwavering contractual transparency.","fr":"Connecter les syndicats bancaires internationaux aux infrastructures souveraines africaines exige une atténuation structurée du risque, un rehaussement de crédit et une transparence contractuelle absolue."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-press-puissance237',
  '{"en":"Kelly Mua Kingsley: New Strategic Leadership for ATIDI and Africa","fr":"Kelly Mua Kingsley : Un Nouveau Leadership Stratégique pour l’ATIDI et l’Afrique"}'::jsonb,
  'Press Feature',
  'Puissance 237 · Centre Africain de Veille Stratégique (ACCI)',
  '2024-10-16',
  'Nairobi / Pan-African',
  '{"en":"Strategic policy analysis on Prof. Kingsly’s election as Chairman of ATIDI, detailing his priorities: mobilizing regional membership for Central African states, strengthening credit ratings, and fostering AfCFTA cross-border commerce.","fr":"Analyse stratégique de veille économique sur l’élection du Pr Kingsly à la présidence de l’ATIDI, détaillant ses priorités : adhésion des pays d’Afrique centrale, consolidation des notations financières et soutien au commerce intra-africain ZLECAf."}'::jsonb,
  'https://puissance-237.com/en/kelly-mua-kingsley-new-leadership-for-atidi-and-africa/',
  '/images/gallery/capital-markets-dialogue.jpg',
  'press',
  '{"en":"The strategic challenge for Africa’s development insurance is clear: transforming perceived risk into insured, bankable assets to fund domestic growth.","fr":"L’enjeu stratégique de l’assurance développement en Afrique est clair : transformer le risque perçu en actifs bancables et sécurisés pour financer la croissance locale."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-governance-atidi-board',
  '{"en":"Chairman of the Board of Directors: Professor Kelly Mua Kingsly (PhD, DBA, MPA, CFA)","fr":"Président du Conseil d’Administration : Professeur Kelly Mua Kingsly (PhD, DBA, MPA, CFA)"}'::jsonb,
  'Institutional Governance',
  'African Trade & Investment Development Insurance (ATIDI)',
  '2024 – 2027 Mandate',
  'Nairobi, Kenya (Pan-African Multilateral)',
  '{"en":"Official multilateral governance registry detailing Prof. Kelly Mua Kingsly’s tenure as Chair of the Board of Directors at ATIDI, overseeing multilateral credit de-risking, political risk guarantees, and sovereign commercial underwriting across 24 member states with over $85 billion in insured transactions.","fr":"Registre officiel de gouvernance multilatérale présentant le Pr Kelly Mua Kingsly en tant que Président du Conseil d’Administration de l’ATIDI, supervisant la couverture des risques politiques, le dé-risquage du crédit et la souscription commerciale dans 24 États membres avec plus de 85 milliards de dollars d’opérations garanties."}'::jsonb,
  'https://www.atidi.africa/about-us/board-of-directors/',
  '/images/gallery/dignitaries-reception.jpg',
  'governance',
  '{"en":"De-risking sovereign cross-border trade requires replacing cost-prohibitive sovereign guarantees with multilateral credit insurance structures recognized by international institutional syndicates.","fr":"La sécurisation du commerce transfrontalier en Afrique exige de substituer aux garanties souveraines onéreuses des structures d’assurance-crédit multilatérales reconnues par les syndicats bancaires internationaux."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-press-cameroon-ceo',
  '{"en":"Leading Africa’s Investment Future: Prof. Kelly Mua Kingsley at the Helm of ATIDI","fr":"Bâtir l’Avenir des Investissements Africains : Le Prof Kelly Mua Kingsley à la Tête de l’ATIDI"}'::jsonb,
  'Press Feature',
  'Cameroon CEO Magazine',
  '2024-10-15',
  'Pan-African / Yaoundé, Cameroon',
  '{"en":"In-depth leadership profile exploring Prof. Kingsly’s strategic roadmap to unlock intra-African investment, expand ATIDI membership across the CEMAC sub-region, and deploy de-risking architectures that mobilize international institutional capital for sustainable infrastructure.","fr":"Grand portrait économique analysant la feuille de route stratégique du Pr Kingsly pour dynamiser les investissements intra-africains, intégrer l’ensemble des pays de la CEMAC au sein de l’ATIDI et déployer des mécanismes de garantie souveraine au service des grands projets d’infrastructures."}'::jsonb,
  'https://cameroonceo.com/2024/10/15/kelly-mua-kingsley-leading-africas-investment-future-as-head-of-atidi/',
  '/images/gallery/prof-kelly-signature-keynote.png',
  'press',
  '{"en":"Leading ATIDI is an institutional mandate to bridge the continental infrastructure financing deficit by rallying all Central African economies into a unified multilateral risk-mitigation umbrella.","fr":"Présider l’ATIDI est une mission institutionnelle visant à combler le déficit de financement des infrastructures en unissant l’ensemble des économies d’Afrique centrale sous un bouclier multilatéral de gestion des risques."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-press-lavoix-entreprises',
  '{"en":"Commercial Insurance in Africa: Prof. Kelly Mua Kingsley Appointed Board Chair of ATIDI","fr":"Assurance Commerciale en Afrique : Le Prof Kelly Mua Kingsley Nommé à la Tête de l’ATIDI"}'::jsonb,
  'Press Feature',
  'La Voix des Entreprises',
  '2024-10-23',
  'Nairobi, Kenya / Douala, Cameroon',
  '{"en":"Press reporting on the 101st Board session confirming Prof. Kelly Mua Kingsley as Board Chairman (PCA) of ATIDI, detailing his mandate to guide the 2024–2027 strategic plan, accelerate regional economic integration, and leverage investment-grade credit ratings from Moody’s and S&P.","fr":"Compte-rendu de la 101e session du Conseil d’administration confirmant l’élection du Pr Kelly Mua Kingsley comme Président du Conseil (PCA) de l’ATIDI, détaillant son mandat pour conduire le plan stratégique 2024-2027, accélérer l’intégration régionale et valoriser les notations financières de premier ordre."}'::jsonb,
  'https://lavoixdesentreprises.info/2024/10/23/assurance-commerciale-en-afrique-le-prof-kelly-mua-kingsley-nomme-a-la-tete-de-latidi/',
  '/images/gallery/ministerial-panel.jpg',
  'press',
  '{"en":"Strengthening ATIDI''s equity base and expanding CEMAC membership under our 2024–2027 roadmap allows us to underwrite transformational energy, agricultural, and transport projects across the continent.","fr":"Le renforcement des fonds propres de l’ATIDI et l’adhésion des pays de la CEMAC dans le cadre de notre feuille de route 2024-2027 nous permettent de garantir des projets structurants dans l’énergie, l’agriculture et les transports."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-press-guardian-post',
  '{"en":"Well Merited: Prof. Kelly Mua Kingsly Elected to Strategic Board Leadership at ATIDI","fr":"Nomination Stratégique Méritée : Le Pr Kelly Mua Kingsly Élu au Conseil d’Administration de l’ATIDI"}'::jsonb,
  'Press Feature',
  'The Guardian Post (Cameroon) · Issue No. 3164',
  '2024-07-12',
  'Livingstone, Zambia / Yaoundé, Cameroon',
  '{"en":"Special reporting on the 24th General Assembly in Livingstone where Prof. Kelly Mua Kingsly was elected by member states to represent Constituency Group A (Cameroon, Angola, Malawi, Zambia), advancing trade insurance instruments that support the African Continental Free Trade Area (AfCFTA).","fr":"Reportage exclusif sur la 24e Assemblée générale à Livingstone où le Pr Kelly Mua Kingsly a été élu par les États membres pour représenter le Groupe A (Cameroun, Angola, Malawi, Zambie), soutenant les instruments d’assurance commerciale au service de la ZLECAf."}'::jsonb,
  'https://theguardianpostcameroon.com/post/3438/en/well-merited-cameroonian-prof-kelly-mua-gets-strategic-role-at-african-trade-investment-devt-insurance',
  '/images/gallery/yaounde-hilton-assembly.jpg',
  'press',
  '{"en":"By pooling political and commercial underwriting risk across Constituency Group A, we directly insulate regional supply chains and unlock private sector trade under the AfCFTA.","fr":"En mutualisant le risque politique et commercial au sein du Groupe A, nous protégeons directement les chaînes d’approvisionnement régionales et stimulons le commerce privé dans le cadre de la ZLECAf."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-book-corruption-roadmap',
  '{"en":"African Roadmap in the Fight Against Corrupt Practices: An Empirical Forensic Investigation","fr":"Feuille de Route des Pays Africains dans la Lutte Contre les Pratiques de Corruption : Enquête Forensique Empirique"}'::jsonb,
  'Published Treatise',
  'Éditions Notre Savoir (ISBN: 978-620-9-25064-4) · Distribution Africa Vivre',
  '2025',
  'International Academic Publishing',
  '{"en":"Specialized forensic treatise examining the root drivers of public-sector fraud and corruption across Cameroon and Nigeria. Applying the broken trust paradigm, the author articulates actionable policy roadmaps and statutory audit protocols to restore public integrity.","fr":"Traité spécialisé d’audit forensique analysant les ressorts profonds de la fraude et de la corruption dans le secteur public au Cameroun et au Nigeria. Appliquant le modèle de la confiance rompue, l’ouvrage formule une feuille de route pour restaurer l’intégrité institutionnelle."}'::jsonb,
  'https://www.laboutiqueafricavivre.com/livres-specialises/312972-feuille-de-route-des-pays-africains-dans-la-lutte-contre-les-pratiques-de-corruption-9786209250644.html',
  '/images/books/corporate-fraud-risk-management.jpg',
  'academic',
  '{"en":"Corruption is not merely a legal infraction; it is a systemic breakdown of fiduciary trust. Forensic data science and automated anomaly tracking provide the evidentiary rigor required to dismantle institutional leakage.","fr":"La corruption n’est pas une simple infraction juridique ; elle constitue une rupture systémique de la confiance fiduciaire. L’analyse forensique des données apporte la rigueur probatoire indispensable pour neutraliser les déperditions publiques."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-academic-rotterdam',
  '{"en":"Faculty Research Repository & Scholarly Working Papers: Professor Kelly Kingsley","fr":"Répertoire de Recherche Universitaire & Travaux Scientifiques : Professeur Kelly Kingsley"}'::jsonb,
  'Academic Repository',
  'Hogeschool Rotterdam (Rotterdam University of Applied Sciences) · Academia.edu',
  'Academic Research Index',
  'Rotterdam, Netherlands / International',
  '{"en":"Institutional academic repository archiving working papers, international finance curricula, and peer-reviewed treatises authored by Prof. Kelly Kingsley on forensic accounting, sovereign audit standards, and macro-financial risk management.","fr":"Archives universitaires institutionnelles hébergeant les articles de recherche, supports d’enseignement et monographies du Pr Kelly Kingsley portant sur la comptabilité judiciaire, les normes d’audit souverain et la gestion des risques macro-financiers."}'::jsonb,
  'https://hogeschool-rotterdam.academia.edu/ProfesssorKellyKingsley',
  '/images/gallery/academic-keynote-enam.jpg',
  'academic',
  '{"en":"Forensic accounting pedagogy bridges empirical econometrics with judicial procedure, training the next generation of integrity magistrates and institutional auditors.","fr":"La pédagogie de la comptabilité judiciaire jette un pont entre l’économétrie empirique et la procédure judiciaire, formant la prochaine génération de magistrats financiers et d’auditeurs d’État."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-expert-nkafu',
  '{"en":"Senior Fellow & Public Policy Expert Dossier: Professor Kelly Mua Kingsly","fr":"Chercheur Associé & Dossier d’Expertise en Politiques Publiques : Professeur Kelly Mua Kingsly"}'::jsonb,
  'Policy Fellowship',
  'The Nkafu Policy Institute · Denis & Lenora Foretia Foundation',
  'Reference Series',
  'Yaoundé, Cameroon',
  '{"en":"Policy institute fellowship dossier highlighting Prof. Kingsly’s research contributions to sovereign debt sustainability, state financial operations, African Development Bank advisory engagements, and governance reforms across Central and West Africa.","fr":"Dossier d’expertise du think tank Nkafu mettant en lumière les travaux du Pr Kingsly sur la soutenabilité de la dette souveraine, la gestion financière publique, ses missions pour la BAD et les réformes de gouvernance en Afrique centrale et de l’Ouest."}'::jsonb,
  'https://nkafu.org/experts/prof-kelly-mua/',
  '/images/photos/photo12.jpeg',
  'governance',
  '{"en":"Sound fiscal policy requires active sovereign debt sustainability modeling, transparent treasury execution, and institutional accountability before capital markets and citizens alike.","fr":"Une politique budgétaire saine requiert une modélisation active de la soutenabilité de la dette, une exécution transparente du Trésor et une redevabilité sans faille envers les citoyens et les marchés."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-press-ecomatin',
  '{"en":"Investigations: Dismantling Taboos Surrounding Financial Crime & Illicit Flows","fr":"Investigations : Désormais Plus de Tabous sur la Criminalité Financière et les Flux Illicites"}'::jsonb,
  'Press Feature',
  'EcoMatin (Cameroon Economic Daily)',
  '2019-01-30',
  'Yaoundé, Cameroon',
  '{"en":"Extensive press coverage of Prof. Kelly Mua Kingsly’s high-level presentation in Yaoundé unveiling three pioneering books on forensic accounting, corporate fraud risk, and financial crime investigations before banking executives, regulators, and judicial authorities.","fr":"Grand angle du quotidien EcoMatin sur la dédicace institutionnelle à Yaoundé de trois ouvrages majeurs du Pr Kelly Mua Kingsly consacrés à la comptabilité forensique, à la gestion du risque de fraude et aux investigations financières, devant les banquiers et autorités judiciaires."}'::jsonb,
  'https://ecomatin.net/investigations-desormais-plus-de-tabous-sur-la-criminalite-financiere',
  '/images/gallery/cemac-finance-briefing.jpg',
  'press',
  '{"en":"Administrative audits can no longer combat sophisticated financial delinquency alone. Only specialized forensic accounting and fraud risk management can pierce white-collar opacity.","fr":"Le contrôle administratif classique ne peut plus contrer à lui seul la délinquance financière sophistiquée. Seules l’investigation forensique et la gestion du risque de fraude brisent l’opacité des cols blancs."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-1',
  '{"en":"Public Finance Evolution: State Budget Growth from 3,189B FCFA (2012) to 11,694B FCFA (2023+)","fr":"Finances Publiques : Évolution du Budget de l’État de 3 189 Mds FCFA (2012) à 11 694 Mds FCFA (2023+)"}'::jsonb,
  'Policy Interview',
  'Institutional Public Finance Briefing / Regional Economic Press',
  '2023 – 2026 Reference Series',
  'Yaoundé, Cameroon',
  '{"en":"Comprehensive retrospective on Cameroon’s fiscal trajectory, domestic revenue mobilization, and capital market instruments supporting sovereign resilience.","fr":"Analyse rétrospective de la trajectoire budgétaire du Cameroun, de la mobilisation des recettes internes et des instruments du marché financier soutenant la résilience souveraine."}'::jsonb,
  'https://news.abidjan.net/articles/724028/finances-publiques-le-budget-de-letat-est-passe-de-3-189-milliards-fcfa-en-2012-a-11-694-milliards-fcfa-en-2023',
  NULL,
  'press',
  '{"en":"The tripling of the state budget over the past decade illustrates the structural expansion of Cameroon’s fiscal base and the strategic role of domestic capital market syndications in funding public investments.","fr":"Le triplement du budget de l’État en dix ans illustre l’élargissement structurel de l’assiette fiscale camerounaise et le rôle stratégique des syndications sur le marché des capitaux domestique pour financer les investissements publics."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-2',
  '{"en":"Continental Governance & De-Risking Sovereign Investments Across Africa","fr":"Gouvernance Continentale et Sécurisation des Investissements Souverains en Afrique"}'::jsonb,
  'Keynote Address',
  'ATIDI Annual General Meeting & Multilateral Finance Forum',
  '2025',
  'Nairobi / Pan-African',
  '{"en":"Executive address on leveraging multilateral credit insurance and ESG-aligned underwriting to accelerate intra-African trade and infrastructure delivery.","fr":"Allocution sur le rôle de l’assurance-crédit multilatérale et de la souscription alignée sur les critères ESG pour accélérer le commerce intra-africain."}'::jsonb,
  NULL,
  NULL,
  'governance',
  '{"en":"Continental de-risking architectures correct the asymmetric pricing of African sovereign risk, transforming perceived risk into bankable, investment-grade opportunities.","fr":"Les architectures de sécurisation continentales corrigent l’asymétrie de tarification du risque souverain en Afrique, transformant le risque perçu en opportunités bancables notées au rang d’investissement."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;
INSERT INTO public.media_appearances (id, title, type, venue, date, location, summary, source_url, image_url, category, caption, is_pinned, video_metadata, status)
VALUES (
  'media-3',
  '{"en":"Forensic Auditing as a Pillar of Sovereign Accountability","fr":"L’Audit Judiciaire comme Pilier de la Redevabilité Financière Publique"}'::jsonb,
  'Academic Lecture',
  'ENAM (National School of Administration and Magistracy)',
  '2025',
  'Yaoundé, Cameroon',
  '{"en":"Inaugural lecture for incoming state auditors and financial magistrates on modern anomaly detection and evidentiary standards.","fr":"Leçon inaugurale destinée aux auditeurs d’État et magistrats financiers sur la détection moderne des anomalies et les normes probatoires."}'::jsonb,
  NULL,
  NULL,
  'academic',
  '{"en":"Judicial auditing is the ultimate safeguard of public resources, translating quantitative anomaly detection into admissible legal evidence for financial courts.","fr":"L’audit judiciaire constitue le rempart ultime des deniers publics, convertissant la détection quantitative des anomalies en éléments probatoires recevables devant les juridictions financières."}'::jsonb,
  false,
  NULL,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  venue = EXCLUDED.venue,
  summary = EXCLUDED.summary,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url;

-- 5. ARCHIVAL PHOTO GALLERY (25 Archival Artifacts)
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-01',
  '{"en":"Official Book Launch: \"Paul BIYA: The Art of the Credible Signature\" (Hilton Yaoundé)","fr":"Lancement Officiel : « Paul BIYA : L’Art de la Signature Crédible » (Hilton Yaoundé)"}'::jsonb,
  '{"en":"Sovereign Book Launch & High-Level Policy Conference","fr":"Lancement Officiel du Livre & Conférence de Haut Niveau"}'::jsonb,
  'Hilton Hotel, Yaoundé',
  '2026-11-05',
  '2026',
  '2025-2026',
  'Yaoundé, Cameroon',
  'book_meetup',
  '/images/books/the-art-of-a-credible-signature-paul-biya.jpeg',
  '/images/books/paul-biya-credible-signature-2nd.jpeg',
  '{"en":"Official launch and conference-debate on Cameroon’s sovereign creditworthiness, under the High Patronage of Minister of Finance Louis Paul Motaze.","fr":"Lancement officiel et conférence-débat sur la signature souveraine du Cameroun, sous le Haut Patronage du Ministre des Finances Louis Paul Motaze."}'::jsonb,
  '{"en":"Under the High Patronage of Mr. Louis Paul Motaze, Minister of Finance, with keynotes by Prof. Kelly Mua Kingsly and literary review by Prof. Messanga Nyamnding.","fr":"Sous le Haut Patronage de M. Louis Paul Motaze, Ministre des Finances, avec allocution du Pr Kelly Mua Kingsly et revue littéraire du Pr Messanga Nyamnding."}'::jsonb,
  'https://forms.gle/KLRjZUB6vjcEtcsbA',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-02',
  '{"en":"Keynote Address: De-Risking African Infrastructure at AFSIC London","fr":"Discours Principal : Sécurisation des Infrastructures Africaines à l’AFSIC Londres"}'::jsonb,
  '{"en":"AFSIC – Investing in Africa Conference 2024","fr":"Conférence AFSIC – Investir en Afrique 2024"}'::jsonb,
  'Park Plaza Westminster Bridge',
  '2024-10-08',
  '2024',
  '2023-2024',
  'London, United Kingdom',
  'summit',
  '/images/gallery/sovereign-debt-summit.jpg',
  '/images/gallery/sovereign-debt-summit.jpg',
  '{"en":"Bridging international institutional syndicates with African sovereign infrastructure via structured multilateral insurance.","fr":"Connecter les syndicats bancaires internationaux aux infrastructures africaines grâce à l’assurance multilatérale structurée."}'::jsonb,
  '{"en":"Over 1,200 global investment executives, sovereign wealth funds, and multilateral development banks.","fr":"Plus de 1 200 dirigeants financiers mondiaux, fonds souverains et banques multilatérales de développement."}'::jsonb,
  'https://www.afsic.net',
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-03',
  '{"en":"ATIDI 101st Board of Directors Session & Strategic Roadmap","fr":"101e Session du Conseil d’Administration de l’ATIDI & Feuille de Route Stratégique"}'::jsonb,
  '{"en":"ATIDI Board of Directors Statutory Meeting","fr":"Session Statutaire du Conseil d’Administration de l’ATIDI"}'::jsonb,
  'ATIDI Continental Headquarters',
  '2024-10-23',
  '2024',
  '2023-2024',
  'Nairobi, Kenya',
  'governance',
  '/images/gallery/dignitaries-reception.jpg',
  '/images/gallery/dignitaries-reception.jpg',
  '{"en":"Presiding as Board Chairman over the 2024–2027 strategic plan, underwriting $85B+ in cumulative intra-African commercial flows.","fr":"Présidant en qualité de PCA le plan stratégique 2024-2027, garantissant plus de 85 Mds $ de flux intra-africains cumulés."}'::jsonb,
  '{"en":"Executive management and institutional directors representing international financial institutions.","fr":"Direction générale exécutive et administrateurs représentant les institutions financières internationales."}'::jsonb,
  NULL,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-04',
  '{"en":"Sovereign Treasury Bond Syndication & Market Execution Briefing","fr":"Syndication des Emprunts Obligataires du Trésor et Exécution des Marchés"}'::jsonb,
  '{"en":"CEMAC Regional Capital Markets Investor Roadshow","fr":"Roadshow Investisseurs du Marché des Capitaux de la CEMAC"}'::jsonb,
  'Direction Générale du Trésor / MINFI',
  '2024-05-18',
  '2024',
  '2023-2024',
  'Yaoundé & Douala, Cameroon',
  'governance',
  'https://img.youtube.com/vi/JSOfK6ea8Lw/hqdefault.jpg',
  NULL,
  '{"en":"Directing the sovereign treasury bond syndication with regional primary dealers, closing oversubscribed at 112%.","fr":"Pilotant la syndication obligataire souveraine avec les spécialistes en valeurs du Trésor, clôturée avec une sursouscription de 112 %."}'::jsonb,
  '{"en":"Banking CEOs, institutional pension funds, and CEMAC market intermediaries.","fr":"Directeurs généraux de banques, caisses de retraite institutionnelles et intermédiaires agréés CEMAC."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-05',
  '{"en":"Book Launch & Policy Symposium: African Roadmap in the Fight Against Corrupt Practices","fr":"Dédicace & Colloque : Feuille de Route dans la Lutte Contre les Pratiques de Corruption"}'::jsonb,
  '{"en":"Public Integrity & Forensic Data Symposium","fr":"Colloque International sur l’Intégrité Publique et la Donnée Forensique"}'::jsonb,
  'Amphithéâtre Paul Biya, ENAM',
  '2025-01-16',
  '2025',
  '2025-2026',
  'Yaoundé, Cameroon',
  'book_meetup',
  '/assets/books/forensic-accounting.svg',
  '/assets/books/forensic-accounting.svg',
  '{"en":"Author presentation and book signing of the 2025 treatise before judicial magistrates, state inspectors, and civil society.","fr":"Présentation de l’auteur et dédicace du traité 2025 devant les magistrats financiers, inspecteurs d’État et universitaires."}'::jsonb,
  '{"en":"High-level delegation from CONAC, Supreme State Audit (CONSUPE), and regional audit chambers.","fr":"Délégation de haut niveau de la CONAC, du Contrôle Supérieur de l’État et des chambres des comptes."}'::jsonb,
  NULL,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-06',
  '{"en":"BVMAC Unified Central African Stock Exchange Listing Ceremony","fr":"Cérémonie de Cotation à la Bourse Régionale Unifiée d’Afrique Centrale (BVMAC)"}'::jsonb,
  '{"en":"BVMAC Market Bell Ringing & Sovereign Quotation Session","fr":"Sonnerie de Cloche et Séance de Cotation Souveraine à la BVMAC"}'::jsonb,
  'Siège de la BVMAC, Immeuble Bourse',
  '2023-06-20',
  '2023',
  '2023-2024',
  'Douala, Cameroon',
  'governance',
  '/images/gallery/capital-markets-dialogue.jpg',
  '/images/gallery/capital-markets-dialogue.jpg',
  '{"en":"Officiating the admission and quotation of sovereign debt instruments on the unified BVMAC regional exchange, deepening Central Africa’s capital market liquidity and secondary trading volumes.","fr":"Présidant l’admission et la première cotation des titres publics sur le marché financier unifié de la BVMAC, approfondissant la liquidité secondaire et la culture boursière régionale."}'::jsonb,
  '{"en":"Central African Stock Exchange leadership, COSUMAF commissioners, and brokerage consortiums.","fr":"Direction générale de la BVMAC, commissaires de la COSUMAF et consortiums de sociétés de bourse."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-07',
  '{"en":"Investiture: Knight of the Cameroon National Order of Valor","fr":"Investiture : Chevalier de l’Ordre National de la Valeur du Cameroun"}'::jsonb,
  '{"en":"Official Presidential Investiture Ceremony","fr":"Cérémonie Officielle d’Investiture Présidentielle"}'::jsonb,
  'Palais de l’Unité / Chancellerie des Ordres Nationaux',
  '2022-05-20',
  '2022',
  'archive',
  'Yaoundé, Cameroon',
  'diplomatic',
  '/images/mua.jpeg',
  NULL,
  '{"en":"Conferred Knight of the National Order of Valor by the Head of State for distinguished sovereign service to public finance and state treasury operations.","fr":"Élevé au rang de Chevalier de l’Ordre National de la Valeur par le Chef de l’État pour services éminents rendus à la Nation et aux finances publiques."}'::jsonb,
  '{"en":"Members of Government, Grand Chancellor of National Orders, and senior civil service corps.","fr":"Membres du Gouvernement, Grand Chancelier des Ordres Nationaux et hauts dignitaires de l’État."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-08',
  '{"en":"Masterclass: Forensic Accounting Pedagogy for Financial Magistrates","fr":"Masterclass : Pédagogie de l’Audit Forensique pour Magistrats Financiers"}'::jsonb,
  '{"en":"ENAM Inaugural Academic Masterclass Series","fr":"Série de Masterclasses Académiques Inaugurales de l’ENAM"}'::jsonb,
  'National School of Administration and Magistracy',
  '2025-02-05',
  '2025',
  '2025-2026',
  'Yaoundé, Cameroon',
  'academic',
  'https://img.youtube.com/vi/phMj0J40b-s/hqdefault.jpg',
  NULL,
  '{"en":"Training the next generation of financial magistrates and treasury inspectors on digital anomaly detection and evidentiary standards.","fr":"Formation de la future promotion de magistrats financiers et d’inspecteurs du Trésor à la détection numérique des fraudes."}'::jsonb,
  '{"en":"Graduating magistrates of the Financial Section and state treasury audit cadets.","fr":"Élèves-magistrats de la Section des Comptes et auditeurs du Trésor."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-09',
  '{"en":"National Launch: UNDP-GEF Global Green Bond Sovereign Initiative","fr":"Lancement National : Initiative Mondiale sur les Obligations Vertes (PNUD-FEM)"}'::jsonb,
  '{"en":"Sovereign Green Bond Framework Validation Workshop","fr":"Atelier de Validation du Cadre National des Obligations Vertes"}'::jsonb,
  'Hilton Yaoundé Conference Hall',
  '2023-11-14',
  '2023',
  '2023-2024',
  'Yaoundé, Cameroon',
  'governance',
  'https://img.youtube.com/vi/Sb7c6hfjvUQ/hqdefault.jpg',
  NULL,
  '{"en":"Serving as Designated National Authority, presenting the taxonomy for climate-resilient sovereign debt instruments.","fr":"En qualité d’Autorité Nationale Désignée, présentant la taxonomie des titres de dette souveraine résilients au climat."}'::jsonb,
  '{"en":"United Nations Development Programme, Global Environment Facility, and Ministry of Environment.","fr":"Programme des Nations Unies pour le Développement, Fonds pour l’Environnement Mondial et MINEPDED."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-10',
  '{"en":"Book Dedication & Meetup: Financial Crime Investigations and Forensic Accounts","fr":"Dédicace & Rencontre Auteur : Enquêtes sur la Criminalité Financière et Comptes Forensiques"}'::jsonb,
  '{"en":"Banking & Financial Compliance Readers Meetup","fr":"Rencontre Auteurs et Dirigeants de la Conformité Bancaire"}'::jsonb,
  'Hôtel Mont Fébé Panorama',
  '2024-03-22',
  '2024',
  '2023-2024',
  'Yaoundé, Cameroon',
  'book_meetup',
  '/images/books/financial-crime-investigations.jpg',
  NULL,
  '{"en":"Interactive book discussion with chief risk officers, compliance directors, and judicial investigators on tracing illicit flows.","fr":"Échange interactif avec les directeurs des risques bancaires, responsables conformité et enquêteurs judiciaires."}'::jsonb,
  '{"en":"Delegates from the Association of Professional Credit Institutions (APBEF) and judicial police.","fr":"Délégués de l’Association Professionnelle des Établissements de Crédit et officiers de police judiciaire."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-11',
  '{"en":"Television Feature: State Budget Tripling & Economic Trajectory","fr":"Émission Spéciale : Triplement du Budget de l’État et Trajectoire Économique"}'::jsonb,
  '{"en":"CRTV Économie & Finances National Broadcast","fr":"Édition Spéciale Économie & Finances sur la CRTV"}'::jsonb,
  'CRTV Production Studios',
  '2023-09-12',
  '2023',
  '2023-2024',
  'Yaoundé, Cameroon',
  'summit',
  'https://img.youtube.com/vi/eLPNnUVv2aw/hqdefault.jpg',
  NULL,
  '{"en":"Prime-time public address analyzing the structural growth of state revenue from 3,189B to 11,694B FCFA.","fr":"Intervention télévisée de référence décortiquant l’évolution du budget de l’État de 3 189 à 11 694 Mds FCFA."}'::jsonb,
  '{"en":"Broadcast live across Central Africa with questions from leading economic editors.","fr":"Diffusion en direct dans toute l’Afrique centrale avec questions des grands éditorialistes économiques."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-12',
  '{"en":"Book Signing Meetup: Economic Bail Out Programs for Emerging Africa","fr":"Rencontre Auteur & Dédicace : Programmes de Sauvetage Économique pour l’Afrique"}'::jsonb,
  '{"en":"Economic Sovereignty & Debt Policy Forum","fr":"Forum sur la Souveraineté Économique et les Politiques d’Endettement"}'::jsonb,
  'Akwa Palace Business Center',
  '2021-04-10',
  '2021',
  'archive',
  'Douala, Cameroon',
  'book_meetup',
  '/images/books/economic-bailout-programs-africa.jpg',
  NULL,
  '{"en":"Debating structural adjustment myths and endogenous fiscal alternatives with regional economists and business leaders.","fr":"Débat autour des mythes de l’ajustement structurel et des leviers budgétaires endogènes avec les économistes régionaux."}'::jsonb,
  '{"en":"Attended by GICAM members, academic economists, and sovereign debt policy analysts.","fr":"En présence des membres du GICAM, universitaires et analystes des politiques de dette publique."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-13',
  '{"en":"COSUMAF Regional Financial Market Harmonization Session","fr":"Session de Régulation COSUMAF : Harmonisation du Marché Financier Régional"}'::jsonb,
  '{"en":"COSUMAF Statutory Supervisory Committee","fr":"Comité Statutaire de Surveillance de la COSUMAF"}'::jsonb,
  'Siège de la COSUMAF',
  '2022-11-28',
  '2022',
  'archive',
  'Libreville, Gabon',
  'governance',
  '/images/gallery/cemac-finance-briefing.jpg',
  '/images/gallery/cemac-finance-briefing.jpg',
  '{"en":"Serving as Cameroon’s Designated Representative to COSUMAF (2016–2024), presiding over regional regulatory convergence, market surveillance, unified BVMAC exchange integration, and investor protection across the six CEMAC member nations.","fr":"Siégeant en qualité de Représentant Institutionnel Désigné de la République du Cameroun auprès de la COSUMAF (2016-2024), pilotant la convergence réglementaire régionale, la supervision de la BVMAC et la protection de l’épargne dans les six États de la CEMAC."}'::jsonb,
  '{"en":"COSUMAF Supervisory Board Commissioners, National Directors of Treasury from the 6 CEMAC Member States, Central Depository executives, and licensed brokerage consortium leaders.","fr":"Commissaires du Collège de la COSUMAF, Directeurs Nationaux du Trésor des six États membres de la CEMAC, dirigeants du Dépositaire Central et présidents des Sociétés de Bourse agréées."}'::jsonb,
  'https://wikigenius.org/wiki/Professor_Kelly_Mua_Kingsly',
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-14',
  '{"en":"Author Symposium: Disruptive Technology Blockchain – The Crystal Ball","fr":"Colloque Auteur : Technologie Disruptive Blockchain – La Boule de Cristal"}'::jsonb,
  '{"en":"African Digital Trust & Distributed Ledger Meetup","fr":"Rencontre Africaine sur la Confiance Numérique et les Registres Distribués"}'::jsonb,
  'Centre Culturel & Numérique',
  '2021-02-18',
  '2021',
  'archive',
  'Yaoundé, Cameroon',
  'book_meetup',
  '/images/books/disruptive-technology-blockchain.jpg',
  NULL,
  '{"en":"Unpacking smart contracts in public procurement and sovereign land registry tokenization.","fr":"Décryptage des contrats intelligents dans la commande publique et la sécurisation des registres fonciers de l’État."}'::jsonb,
  '{"en":"Fintech founders, computer scientists, and public registry directors.","fr":"Fondateurs de fintechs, chercheurs en informatique et directeurs des cadastres de l’État."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-15',
  '{"en":"Nkafu Policy Institute Sovereign Governance Fellowship Roundtable","fr":"Table Ronde des Chercheurs Associés du Think Tank Nkafu Policy Institute"}'::jsonb,
  '{"en":"Denis & Lenora Foretia Foundation Public Policy Roundtable","fr":"Table Ronde de Politiques Publiques de la Fondation Denis & Lenora Foretia"}'::jsonb,
  'Foretia Foundation Auditorium',
  '2023-05-15',
  '2023',
  '2023-2024',
  'Yaoundé, Cameroon',
  'academic',
  '/images/gallery/state-trust-capital-symposium.jpg',
  '/images/gallery/state-trust-capital-symposium.jpg',
  '{"en":"Presenting foundational research on debt sustainability frameworks, sovereign credibility metrics, and institutional firewalls against public expenditure leakages at the Foretia Foundation auditorium.","fr":"Présentation des travaux de recherche sur la viabilité de la dette, les métriques de crédibilité souveraine et les verrous institutionnels contre les déperditions budgétaires à l’auditorium de la Fondation Foretia."}'::jsonb,
  '{"en":"Resident policy fellows, parliamentary assistants, and international development economists.","fr":"Chercheurs résidents, assistants parlementaires et économistes du développement international."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-16',
  '{"en":"Executive Meetup: Business Risk Management in Volatile Economies","fr":"Rencontre Dirigeants : Gestion des Risques d’Entreprise en Économie Volatile"}'::jsonb,
  '{"en":"Corporate Board Leadership & ERM Breakfast","fr":"Petit-déjeuner des Conseils d’Administration et du Management des Risques"}'::jsonb,
  'Krystal Palace Business Suites',
  '2021-08-14',
  '2021',
  'archive',
  'Douala, Cameroon',
  'book_meetup',
  '/images/books/business-risk-management.jpg',
  NULL,
  '{"en":"Hands-on workshop demonstrating quantitative risk appetite matrices and scenario stress tests for board directors.","fr":"Atelier pratique présentant les matrices d’appétit au risque et les tests de résistance de trésorerie pour administrateurs."}'::jsonb,
  '{"en":"Executive committee members, internal audit directors, and corporate risk officers.","fr":"Membres de comités de direction, directeurs de l’audit interne et risk managers d’entreprises."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-17',
  '{"en":"Central African Monetary Union (BEAC) Regulatory Censorship Briefing","fr":"Briefing Réglementaire du Censorat de la BEAC (Union Monétaire d’Afrique Centrale)"}'::jsonb,
  '{"en":"BEAC National Directorate Fiduciary Supervision Session","fr":"Séance de Supervision Fiduciaire à la Direction Nationale de la BEAC"}'::jsonb,
  'Banque des États de l’Afrique Centrale (BEAC Siège)',
  '2022-09-08',
  '2022',
  'archive',
  'Yaoundé, Cameroon',
  'governance',
  '/images/gallery/sovereign-debt-summit.jpg',
  '/images/gallery/sovereign-debt-summit.jpg',
  '{"en":"Fulfilling statutory central bank censorship duties at BEAC, reviewing sovereign liquidity reserves, state treasury balances, and statutory alignment with regional monetary policy directives.","fr":"Exerçant les prérogatives statutaires de censeur à la BEAC, examinant les réserves de liquidité de l’État, la trésorerie souveraine et la conformité aux directives de politique monétaire de la zone CEMAC."}'::jsonb,
  '{"en":"National directors, bank comptrollers, and central monetary authorities.","fr":"Directeurs nationaux, contrôleurs bancaires et autorités monétaires centrales."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-18',
  '{"en":"Book Dedication: Corporate Fraud Risk Management & Whistleblower Protections","fr":"Dédicace de Livre : Gestion des Risques de Fraude & Protection des Lanceurs d’Alerte"}'::jsonb,
  '{"en":"Anti-Corruption Corporate Governance Forum","fr":"Forum de Gouvernance d’Entreprise et Lutte Anti-Fraude"}'::jsonb,
  'Chambre de Commerce, d’Industrie et des Mines',
  '2021-11-20',
  '2021',
  'archive',
  'Douala, Cameroon',
  'book_meetup',
  '/images/books/corporate-fraud-risk-management.jpg',
  '/images/books/corporate-fraud-risk-management.jpg',
  '{"en":"Presenting corporate anti-fraud governance blueprints, tone at the top, and forensic audit charters before industrial federation leaders and certified fraud examiners.","fr":"Présentation des modèles de gouvernance anti-fraude, de l’exemplarité managériale et des chartes d’audit judiciaire devant les dirigeants d’entreprises et auditeurs certifiés."}'::jsonb,
  '{"en":"Industrial federation leaders, legal counsel, and certified fraud examiners (CFEs).","fr":"Dirigeants de fédérations professionnelles, juristes d’entreprise et auditeurs certifiés anti-fraude."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-19',
  '{"en":"Multilateral Operations Review: United Nations Development Programme (UNDP)","fr":"Revue des Opérations Multilatérales : Programme des Nations Unies pour le Développement"}'::jsonb,
  '{"en":"UNDP Country Operations & Fiduciary Accountability Summit","fr":"Sommet des Opérations Pays et de la Redevabilité Fiduciaire du PNUD"}'::jsonb,
  'United Nations Complex',
  '2020-02-12',
  '2020',
  'archive',
  'N’Djamena / Yaoundé',
  'diplomatic',
  '/images/gallery/prof-kelly-diplomatic-portrait.png',
  '/images/gallery/prof-kelly-diplomatic-portrait.png',
  '{"en":"Consolidating 16 years of multilateral development leadership as Deputy Resident Representative for Operations at UNDP, ensuring exemplary fiduciary governance, IPSAS standards, and programmatic execution.","fr":"Consolidant 16 années de direction opérationnelle au PNUD en qualité de Représentant Résident Adjoint, garantissant une rigueur fiduciaire exemplaire, le respect des normes IPSAS et l’impact des programmes multilatéraux."}'::jsonb,
  '{"en":"UN Resident Coordinators, bilateral donor ambassadors, and international operations teams.","fr":"Coordonnateurs résidents de l’ONU, ambassadeurs bailleurs de fonds et équipes opérationnelles."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-20',
  '{"en":"Author Signing & Readers Meetup: Identifying Red Flags of Fraud","fr":"Rencontre Lecteurs & Dédicace : Identifier les Signaux d’Alerte de la Fraude"}'::jsonb,
  '{"en":"Public Expenditure Inspectors Book Meetup","fr":"Rencontre Auteur avec les Inspecteurs des Dépenses Publiques"}'::jsonb,
  'Atlantic Beach Hotel Conference Hall',
  '2022-03-15',
  '2022',
  'archive',
  'Limbe, Cameroon',
  'book_meetup',
  '/assets/books/red-flags-fraud.svg',
  '/assets/books/red-flags-fraud.svg',
  '{"en":"Dissecting predictive fraud detection matrices, red flag taxonomies, and forensic audit evidentiary standards with regional finance controllers and senior public inspectors.","fr":"Décryptage des matrices de détection précoce, de la typologie des signaux d’alerte et des standards probatoires en audit judiciaire avec les contrôleurs des finances et inspecteurs d’État."}'::jsonb,
  '{"en":"Regional finance delegates, municipal revenue controllers, and internal auditors.","fr":"Délégués régionaux des finances, contrôleurs municipaux et auditeurs internes."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-21',
  '{"en":"State Asset Safeguarding & Public Expenditure Control Colloquium","fr":"Colloque sur la Sauvegarde du Patrimoine de l’État et le Contrôle de la Dépense"}'::jsonb,
  '{"en":"National Colloquium on State Patrimony and Public Accounting","fr":"Colloque National sur le Patrimoine Public et la Comptabilité de l’État"}'::jsonb,
  'Palais des Congrès de Yaoundé',
  '2024-04-12',
  '2024',
  '2023-2024',
  'Yaoundé, Cameroon',
  'governance',
  'https://img.youtube.com/vi/7BXr_44r_Ac/hqdefault.jpg',
  NULL,
  '{"en":"Addressing senior civil servants on moving from cash-basis to accrual sovereign accounting standards.","fr":"Intervention sur le basculement de la comptabilité de caisse vers la comptabilité en droits constatés de l’État."}'::jsonb,
  '{"en":"Directors of Budget, Public Debt, and State Property across ministerial departments.","fr":"Directeurs du Budget, de la Dette et du Patrimoine de l’ensemble des départements ministériels."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-22',
  '{"en":"Academic Presentation: Stock Markets as a Lever for Growth in Central Africa","fr":"Présentation Académique : Les Marchés Boursiers comme Levier de Croissance en Afrique Centrale"}'::jsonb,
  '{"en":"BVMAC Monograph Symposium & Research Launch","fr":"Colloque sur la Monographie BVMAC et Lancement de la Recherche"}'::jsonb,
  'Faculté des Sciences Économiques et de Gestion',
  '2023-07-28',
  '2023',
  '2023-2024',
  'Yaoundé, Cameroon',
  'academic',
  '/assets/books/bvmac-capital-markets.svg',
  '/assets/books/bvmac-capital-markets.svg',
  '{"en":"Presenting econometric findings on regional market integration, domestic bond yield curves, and IPO tax incentives at the Faculty of Economics.","fr":"Présentation des conclusions économétriques sur l’intégration boursière, les courbes de taux et les incitations fiscales à la Faculté des Sciences Économiques."}'::jsonb,
  '{"en":"University professors, doctoral researchers, and financial markets master students.","fr":"Professeurs d’université, chercheurs doctorants et étudiants en master finance de marché."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-23',
  '{"en":"Youth in Governance & Public Financial Integrity Leadership Summit","fr":"Sommet Jeunesse, Gouvernance & Intégrité Financière Publique"}'::jsonb,
  '{"en":"Pan-African Youth Leadership in Governance Forum","fr":"Forum Panafricain de Leadership des Jeunes dans la Gouvernance"}'::jsonb,
  'University of Buea Arts Theatre',
  '2024-11-09',
  '2024',
  '2023-2024',
  'Buea, Cameroon',
  'academic',
  '/images/gallery/ministerial-panel.jpg',
  '/images/gallery/ministerial-panel.jpg',
  '{"en":"Mentoring emerging economists on ethical leadership, CFA certification rigor, and public sector dedication before 800+ university leaders at the University of Buea.","fr":"Mentorat des jeunes économistes sur le leadership éthique, l’exigence du CFA et le sens du service public devant plus de 800 étudiants à l’Université de Buea."}'::jsonb,
  '{"en":"Over 800 university students, student leaders, and young professionals in economics.","fr":"Plus de 800 étudiants, délégués universitaires et jeunes professionnels de l’économie."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-24',
  '{"en":"Book Dedication: Forensic Accounts and Ethics in Public Financial Systems","fr":"Dédicace : Comptabilité Forensique et Éthique dans les Systèmes Financiers Publics"}'::jsonb,
  '{"en":"Auditors & Judicial Magistrates Annual Meetup","fr":"Rencontre Annuelle des Auditeurs et Magistrats Financiers"}'::jsonb,
  'Hilton Yaoundé Boukarou',
  '2022-12-10',
  '2022',
  'archive',
  'Yaoundé, Cameroon',
  'book_meetup',
  '/images/books/forensic-accounting-and-financial-investigation.jpg',
  NULL,
  '{"en":"Discussing evidentiary chains of custody and ethical imperatives for public accountants and state magistrates.","fr":"Discussion sur la chaîne de preuve forensique et l’impératif éthique pour les comptables publics et magistrats."}'::jsonb,
  '{"en":"Members of the National Chamber of Accounts and chartered accountants (ONECCA).","fr":"Membres de la Chambre des Comptes et experts-comptables de l’ONECCA."}'::jsonb,
  NULL,
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
INSERT INTO public.gallery_photos (id, title, event_name, venue, date, year, season, location, category, image_url, thumbnail_url, caption, participants_note, external_ref_url, is_featured_monthly)
VALUES (
  'gal-25',
  '{"en":"Annual Sovereign Treasury Operations Review & Forward Strategy (2025/2026)","fr":"Revue Annuelle des Opérations du Trésor et Stratégie Prospective (2025/2026)"}'::jsonb,
  '{"en":"Ministry of Finance Annual Treasury Steering Session","fr":"Séance Annuelle de Pilotage Stratégique du Trésor Public (MINFI)"}'::jsonb,
  'Direction Générale du Trésor, Bâtiment Principal',
  '2025-01-22',
  '2025',
  '2025-2026',
  'Yaoundé, Cameroon',
  'governance',
  '/images/gallery/yaounde-hilton-assembly.jpg',
  '/images/gallery/yaounde-hilton-assembly.jpg',
  '{"en":"Consolidating annual state liquidity execution, sovereign debt sustainability ceilings, and forward capital market issuances at the Directorate General of the Treasury.","fr":"Consolidation de l’exécution de trésorerie de l’État, des plafonds d’endettement et des émissions sur le marché régional à la Direction Générale du Trésor."}'::jsonb,
  '{"en":"Directorate of Finance Operations, Treasury Paymasters General, and Central Public Accounting inspectors.","fr":"Direction des Opérations Financières, Trésoriers Payeurs Généraux et inspecteurs de la comptabilité publique."}'::jsonb,
  NULL,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_name = EXCLUDED.event_name,
  caption = EXCLUDED.caption,
  image_url = EXCLUDED.image_url;
