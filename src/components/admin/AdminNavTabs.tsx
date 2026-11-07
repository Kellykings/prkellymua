import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Building2,
  Tv,
  Image as ImageIcon,
  Mail,
  ShieldAlert,
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export function AdminNavTabs({
  activeTab,
  counts,
}: {
  activeTab: string;
  counts: {
    books: number;
    blog: number;
    governance: number;
    media: number;
    gallery: number;
  };
}) {
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'books',
      label: 'Books Inventory',
      icon: BookOpen,
      count: counts.books,
    },
    {
      id: 'blog',
      label: 'Policy Briefs',
      icon: FileText,
      count: counts.blog,
    },
    {
      id: 'governance',
      label: 'Sovereign Mandates',
      icon: Building2,
      count: counts.governance,
    },
    {
      id: 'media',
      label: 'Media & Keynotes',
      icon: Tv,
      count: counts.media,
    },
    {
      id: 'gallery',
      label: 'Archival Gallery',
      icon: ImageIcon,
      count: counts.gallery,
    },
    {
      id: 'inquiries',
      label: 'Protocol Inquiries',
      icon: Mail,
    },
    {
      id: 'system',
      label: 'System & Security',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="border-b border-surface-border bg-white shadow-sm -mt-2 sm:-mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar smooth-scroll-x py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          aria-label="Admin studio navigation"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const href = tab.id === 'overview' ? '/admin' : `/admin?tab=${tab.id}`;

            return (
              <Link
                key={tab.id}
                href={href}
                className={`shrink-0 min-h-[44px] px-3.5 py-2 text-xs font-semibold flex items-center gap-2 rounded-sm transition-all ${
                  isActive
                    ? 'bg-navy-900 text-gold-400 shadow-sm'
                    : 'text-ink-700 hover:text-navy-900 hover:bg-surface-paper'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold-400' : 'text-ink-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.2 rounded-sm ${
                      isActive
                        ? 'bg-gold-500/20 text-gold-300'
                        : 'bg-surface-border text-ink-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
