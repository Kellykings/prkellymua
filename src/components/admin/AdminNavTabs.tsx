'use client';

import React, { useRef } from 'react';
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
  BookMarked,
  PackageCheck,
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
    orders?: number;
  };
}) {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
      id: 'orders',
      label: 'Orders & Deliveries',
      icon: PackageCheck,
      count: counts.orders,
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
    {
      id: 'guide',
      label: 'Operations & Guide',
      icon: BookMarked,
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="border-b border-surface-border bg-white shadow-sm -mt-2 sm:-mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          role="tablist"
          aria-label="Admin studio navigation tabs"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-2.5"
        >
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const href = tab.id === 'overview' ? '/admin' : `/admin?tab=${tab.id}`;

            return (
              <Link
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                href={href}
                role="tab"
                id={`admin-tab-${tab.id}`}
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`shrink-0 min-h-[44px] px-3.5 py-2 text-xs font-semibold flex items-center gap-2 rounded-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-2 ${
                  isActive
                    ? 'bg-navy-900 text-gold-400 shadow-sm'
                    : 'text-ink-700 hover:text-navy-900 hover:bg-surface-paper'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold-400' : 'text-ink-400'}`}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded-sm ${
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
