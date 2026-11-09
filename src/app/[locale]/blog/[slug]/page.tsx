import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/data/repository';
import { CitationExporter } from '@/components/shared/CitationExporter';
import { formatCategory, formatDate, t } from '@/lib/utils';
import type { Locale } from '@/types/domain';

function renderWithAbbr(text: string, locale: Locale) {
  const acronyms: Record<string, { en: string; fr: string }> = {
    ATIDI: {
      en: 'African Trade & Investment Development Insurance',
      fr: 'Agence pour l’Assurance du Commerce en Afrique (ATIDI)',
    },
    MINFI: {
      en: 'Ministry of Finance (Cameroon)',
      fr: 'Ministère des Finances (Cameroun)',
    },
    ENAM: {
      en: 'National School of Administration and Magistracy (Yaoundé)',
      fr: 'École Nationale d’Administration et de Magistrature (Yaoundé)',
    },
    BEAC: {
      en: 'Bank of Central African States',
      fr: 'Banque des États de l’Afrique Centrale',
    },
    COSUMAF: {
      en: 'Central African Financial Market Surveillance Commission',
      fr: 'Commission de Surveillance du Marché Financier de l’Afrique Centrale',
    },
    BVMAC: {
      en: 'Central African Unified Stock Exchange',
      fr: 'Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC)',
    },
    CEMAC: {
      en: 'Central African Economic and Monetary Community',
      fr: 'Communauté Économique et Monétaire de l’Afrique Centrale',
    },
    TSA: {
      en: 'Treasury Single Account',
      fr: 'Compte Unique du Trésor (CUT)',
    },
    CUT: {
      en: 'Compte Unique du Trésor',
      fr: 'Compte Unique du Trésor',
    },
    PFM: {
      en: 'Public Financial Management',
      fr: 'Gestion des Finances Publiques (GFP)',
    },
    GFP: {
      en: 'Gestion des Finances Publiques',
      fr: 'Gestion des Finances Publiques',
    },
    'UNDP-GEF': {
      en: 'United Nations Development Programme – Global Environment Facility',
      fr: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial (PNUD-FEM)',
    },
    'PNUD-FEM': {
      en: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial',
      fr: 'Programme des Nations Unies pour le Développement – Fonds pour l’Environnement Mondial',
    },
    IFMIS: {
      en: 'Integrated Financial Management Information System',
      fr: 'Système Intégré de Gestion des Finances Publiques (SIGFIP)',
    },
    ESG: {
      en: 'Environmental, Social, and Governance',
      fr: 'Environnemental, Social et de Gouvernance (ESG)',
    },
    SPO: {
      en: 'Second-Party Opinion',
      fr: 'Avis Indépendant (Second-Party Opinion)',
    },
  };

  const regex = /(ATIDI|MINFI|ENAM|BEAC|COSUMAF|BVMAC|CEMAC|TSA|CUT|PFM|GFP|UNDP-GEF|PNUD-FEM|IFMIS|ESG|SPO)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const acronymData = acronyms[part];
    if (acronymData) {
      return (
        <abbr
          key={index}
          title={acronymData[locale]}
          className="no-underline cursor-help border-b border-dotted border-current/50 hover:border-bronze-600 transition-colors"
        >
          {part}
        </abbr>
      );
    }
    return part;
  });
}

interface BlogPostPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${t(post.title, locale)} | Professor Kelly Mua Kingsly`,
    description: t(post.excerpt, locale),
  };
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostPageProps) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const title = t(post.title, locale);
  const excerpt = t(post.excerpt, locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: title,
    editor: 'Professor Kelly Mua Kingsly',
    genre: post.category,
    keywords: post.tags.join(' '),
    author: {
      '@type': 'Person',
      name: 'Professor Kelly Mua Kingsly',
    },
    datePublished: post.published_at,
    description: excerpt,
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-navy-900 hover:text-bronze-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>
          {locale === 'fr'
            ? 'Retour aux Notes de Politique'
            : 'Back to Policy Briefs'}
        </span>
      </Link>

      <header className="space-y-4 border-b border-surface-border pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink-500">
          <span className="px-3 py-1 bg-navy-900 text-gold-400 font-semibold">
            {formatCategory(post.category, locale)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-bronze-600" />
            <span>{formatDate(post.published_at, locale)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-bronze-600" />
            <span>
              {post.estimated_read_minutes}{' '}
              {locale === 'fr' ? 'min de lecture' : 'min read'}
            </span>
          </span>
          {post.doi_reference && <span>Ref. {post.doi_reference}</span>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-navy-900 leading-tight">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-ink-700 leading-relaxed">
          {renderWithAbbr(excerpt, locale)}
        </p>

        <div className="pt-2 text-xs text-navy-800">
          {locale === 'fr' ? 'Auteur :' : 'Author:'}{' '}
          <strong>Professor Kelly Mua Kingsly, PhD, CFA</strong>
        </div>
      </header>

      <div className="space-y-8 bg-white border border-surface-border p-6 sm:p-10 shadow-institutional">
        {post.content_sections.map((sec, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-navy-900">
              {t(sec.heading, locale)}
            </h2>
            <p className="text-ink-700 leading-relaxed text-base sm:text-[17px]">
              {renderWithAbbr(t(sec.body, locale), locale)}
            </p>
          </section>
        ))}

        <div className="pt-6 border-t border-surface-border flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-bronze-600" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-surface-paper border border-surface-border text-ink-700 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <CitationExporter
        title={title}
        year={post.published_at.slice(0, 4)}
        publisherOrJournal="Kelly Mua Kingsly Policy Monograph Series"
        identifier={post.doi_reference}
      />
    </article>
  );
}
