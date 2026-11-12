import type { Metadata, Viewport } from 'next';
import { Newsreader, Inter } from 'next/font/google';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0E1E28',
};

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
  adjustFontFallback: false,
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kellykingsly.com'),
  title: {
    default: 'Professor Kelly Mua Kingsly (PhD, DBA, MPA, CFA)',
    template: '%s | Professor Kelly Mua Kingsly',
  },
  description:
    'Official institutional profile, public finance governance archive, policy briefs, and hybrid academic bookstore of Professor Kelly Mua Kingsly.',
  keywords: [
    'Professor Kelly Mua Kingsly',
    'Professor Kelly Mua Kingsley',
    'Public Finance Cameroon',
    'ATIDI Board Chair',
    'COSUMAF',
    'BVMAC Capital Market',
    'Forensic Accounting',
    'Green Bonds UNDP GEF',
  ],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans bg-surface-light text-slate-850 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
