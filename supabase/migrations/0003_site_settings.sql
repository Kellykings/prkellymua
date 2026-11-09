-- ==============================================================================
-- PROFESSOR KELLY MUA KINGSLY PLATFORM
-- Migration 0003: Site Settings & Hero Section Copy Storage
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read access so Server Components can fetch site settings
CREATE POLICY "Allow public read access on site_settings"
    ON public.site_settings
    FOR SELECT
    USING (true);

-- Restrict all mutations strictly to the Service Role
CREATE POLICY "Allow service role full access on site_settings"
    ON public.site_settings
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');
