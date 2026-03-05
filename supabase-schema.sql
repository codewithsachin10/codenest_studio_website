-- =============================================
-- CodeNest Studio Database Schema
-- Compatible with Supabase (no superuser required)
-- =============================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    institution TEXT,
    content TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_highlighted BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    is_published BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Features table
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT DEFAULT 'Core',
    is_highlighted BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Changelog versions table
CREATE TABLE IF NOT EXISTS changelog_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version TEXT NOT NULL UNIQUE,
    release_date DATE NOT NULL,
    title TEXT,
    description TEXT,
    is_major BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Changelog changes table (child of versions)
CREATE TABLE IF NOT EXISTS changelog_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID REFERENCES changelog_versions(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('added', 'changed', 'fixed', 'removed', 'security')),
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Releases table
CREATE TABLE IF NOT EXISTS releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('windows', 'macos', 'linux')),
    download_url TEXT NOT NULL,
    file_type TEXT,
    file_size TEXT,
    release_notes TEXT,
    is_latest BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    publish_at TIMESTAMPTZ DEFAULT NOW(),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Download stats table
CREATE TABLE IF NOT EXISTS download_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    version TEXT,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmap items table
CREATE TABLE IF NOT EXISTS roadmap_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
    quarter TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    country TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User feedback / bug reports table
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT DEFAULT 'feedback' CHECK (type IN ('feedback', 'bug')),
    content TEXT NOT NULL,
    user_email TEXT,
    image_url TEXT,
    metadata JSONB,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat logs table
CREATE TABLE IF NOT EXISTS ai_chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    sentiment TEXT DEFAULT 'neutral',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_published ON faqs(is_published);
CREATE INDEX IF NOT EXISTS idx_features_category ON features(category);
CREATE INDEX IF NOT EXISTS idx_changelog_versions_date ON changelog_versions(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_releases_platform ON releases(platform);
CREATE INDEX IF NOT EXISTS idx_download_stats_date ON download_stats(downloaded_at);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(viewed_at);

-- =============================================
-- TRIGGER FUNCTION FOR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;
CREATE TRIGGER testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS faqs_updated_at ON faqs;
CREATE TRIGGER faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS features_updated_at ON features;
CREATE TRIGGER features_updated_at
    BEFORE UPDATE ON features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS changelog_versions_updated_at ON changelog_versions;
CREATE TRIGGER changelog_versions_updated_at
    BEFORE UPDATE ON changelog_versions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS releases_updated_at ON releases;
CREATE TRIGGER releases_updated_at
    BEFORE UPDATE ON releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS roadmap_items_updated_at ON roadmap_items;
CREATE TRIGGER roadmap_items_updated_at
    BEFORE UPDATE ON roadmap_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
CREATE POLICY "Public can view published testimonials" ON testimonials
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published faqs" ON faqs;
CREATE POLICY "Public can view published faqs" ON faqs
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published features" ON features;
CREATE POLICY "Public can view published features" ON features
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published changelog" ON changelog_versions;
CREATE POLICY "Public can view published changelog" ON changelog_versions
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view changelog changes" ON changelog_changes;
CREATE POLICY "Public can view changelog changes" ON changelog_changes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published releases" ON releases;
CREATE POLICY "Public can view published releases" ON releases
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view roadmap" ON roadmap_items;
CREATE POLICY "Public can view roadmap" ON roadmap_items
    FOR SELECT USING (true);

-- Authenticated users (admins) have full access
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;
CREATE POLICY "Admins can manage faqs" ON faqs
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage features" ON features;
CREATE POLICY "Admins can manage features" ON features
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage changelog_versions" ON changelog_versions;
CREATE POLICY "Admins can manage changelog_versions" ON changelog_versions
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage changelog_changes" ON changelog_changes;
CREATE POLICY "Admins can manage changelog_changes" ON changelog_changes
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage subscribers" ON subscribers;
CREATE POLICY "Admins can manage subscribers" ON subscribers
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage releases" ON releases;
CREATE POLICY "Admins can manage releases" ON releases
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage download_stats" ON download_stats;
CREATE POLICY "Admins can manage download_stats" ON download_stats
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage roadmap" ON roadmap_items;
CREATE POLICY "Admins can manage roadmap" ON roadmap_items
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can view page_views" ON page_views;
CREATE POLICY "Admins can view page_views" ON page_views
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage site_settings" ON site_settings;
CREATE POLICY "Admins can manage site_settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Public can insert (for subscriptions and tracking)
DROP POLICY IF EXISTS "Public can subscribe" ON subscribers;
CREATE POLICY "Public can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can track downloads" ON download_stats;
CREATE POLICY "Public can track downloads" ON download_stats
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can track page views" ON page_views;
CREATE POLICY "Public can track page views" ON page_views
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit feedback" ON user_feedback;
CREATE POLICY "Public can submit feedback" ON user_feedback
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can log ai chats" ON ai_chat_logs;
CREATE POLICY "Public can log ai chats" ON ai_chat_logs
    FOR INSERT WITH CHECK (true);

-- Admins specific for new tables
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage user feedback" ON user_feedback;
CREATE POLICY "Admins can manage user feedback" ON user_feedback
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can view ai chat logs" ON ai_chat_logs;
CREATE POLICY "Admins can view ai chat logs" ON ai_chat_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- DONE!
-- =============================================
