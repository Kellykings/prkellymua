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
