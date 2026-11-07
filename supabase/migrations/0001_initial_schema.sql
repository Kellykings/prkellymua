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
