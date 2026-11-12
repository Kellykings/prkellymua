import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/types/domain';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const dict = getDictionary(locale);

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        fr: '/fr',
      },
    },
    icons: {
      icon: [
        { url: '/logos/04-favicon-app-icon.webp', type: 'image/webp' },
        { url: '/logos/04-favicon-app-icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/logos/04-favicon-app-icon.png' },
      ],
    },
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  return (
    <div lang={locale} className="min-h-screen flex flex-col bg-surface-light">
      <Header locale={locale} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
