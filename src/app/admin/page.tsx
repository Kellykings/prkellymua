import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getBooks,
  getBlogPosts,
  getCareerEntries,
  getMediaAppearances,
  getGalleryPhotos,
  getInstitutionalEvents,
} from '@/lib/data/repository';
import { getCustomEntityItems, getContentStoreHealth } from '@/lib/data/custom-content-store';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth/admin-auth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminNavTabs } from '@/components/admin/AdminNavTabs';
import { AdminOverviewSection } from '@/components/admin/AdminOverviewSection';
import { AdminBooksSection } from '@/components/admin/AdminBooksSection';
import { AdminBlogSection } from '@/components/admin/AdminBlogSection';
import { AdminGovernanceSection } from '@/components/admin/AdminGovernanceSection';
import { AdminMediaSection } from '@/components/admin/AdminMediaSection';
import { AdminGallerySection } from '@/components/admin/AdminGallerySection';
import { AdminInquiriesSection } from '@/components/admin/AdminInquiriesSection';
import { AdminOrdersSection } from '@/components/admin/AdminOrdersSection';
import { AdminSystemSection } from '@/components/admin/AdminSystemSection';
import { AdminGuideSection } from '@/components/admin/AdminGuideSection';
import type { PrintDeliveryOrder } from '@/types/domain';

export const metadata: Metadata = {
  title: 'Editorial & Governance Studio | Prof. Kelly Mua Kingsly',
  description: 'Supabase RLS Governance, Hybrid E-Commerce, and Editorial Studio Console.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminStudioPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const sessionCookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!sessionCookie || !verifyAdminSessionToken(sessionCookie)) {
    redirect('/admin/login');
  }

  const activeTab = searchParams?.tab || 'overview';

  const [books, posts, media, photos, events] = await Promise.all([
    getBooks(),
    getBlogPosts(),
    getMediaAppearances(),
    getGalleryPhotos(),
    getInstitutionalEvents(),
  ]);

  const careers = getCareerEntries();
  const supabaseAdmin = createSupabaseAdminClient();
  const isSupabaseConfigured = Boolean(supabaseAdmin);

  let initialSubmissions: Array<{
    id: string;
    sender_name: string;
    sender_email: string;
    organization?: string | null;
    inquiry_type: string;
    subject: string;
    message: string;
    created_at: string;
    status?: string;
  }> = [];

  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);
      if (data && data.length > 0) {
        initialSubmissions = data;
      }
    } catch {
      // Graceful fallback to empty initial submissions
    }
  }

  if (initialSubmissions.length === 0) {
    initialSubmissions = getCustomEntityItems('inquiries');
  }

  const initialOrders = getCustomEntityItems<PrintDeliveryOrder>('orders');

  return (
    <div className="min-h-screen bg-sand-50/50 text-ink-900 pb-16">
      <AdminHeader />
      <AdminNavTabs
        activeTab={activeTab}
        counts={{
          books: books.length,
          blog: posts.length,
          governance: careers.length,
          media: media.length,
          gallery: photos.length,
          orders: initialOrders.length,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <AdminOverviewSection
            books={books}
            posts={posts}
            careers={careers}
            media={media}
            galleryCount={photos.length}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        )}

        {activeTab === 'books' && <AdminBooksSection books={books} />}

        {activeTab === 'orders' && <AdminOrdersSection initialOrders={initialOrders} />}

        {activeTab === 'blog' && <AdminBlogSection posts={posts} />}

        {activeTab === 'governance' && (
          <AdminGovernanceSection careers={careers} />
        )}

        {activeTab === 'media' && <AdminMediaSection media={media} />}

        {activeTab === 'gallery' && (
          <AdminGallerySection photos={photos} events={events} />
        )}

        {activeTab === 'inquiries' && (
          <AdminInquiriesSection
            initialSubmissions={initialSubmissions}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        )}

        {activeTab === 'system' && (
          <AdminSystemSection
            isSupabaseConfigured={isSupabaseConfigured}
            storeHealth={getContentStoreHealth()}
          />
        )}

        {activeTab === 'guide' && (
          <AdminGuideSection
            isSupabaseConfigured={isSupabaseConfigured}
            storeHealth={getContentStoreHealth()}
          />
        )}
      </main>
    </div>
  );
}
