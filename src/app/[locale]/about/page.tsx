import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Landmark,
  Scale,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Globe2,
  TrendingUp,
  ArrowRight,
  Quote,
  FileText,
  CheckCircle2,
  Compass,
  Award,
} from 'lucide-react';
import {
  getExecutiveProfile,
  getBooks,
} from '@/lib/data/repository';
import { t } from '@/lib/utils';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Biographie Intellectuelle & Parcours | Pr Kelly Mua Kingsly'
      : 'Intellectual Biography & Philosophy | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Découvrez la biographie, la doctrine de gouvernance et l’œuvre académique du Professeur Kelly Mua Kingsly : Harvard Kennedy School MPA, auteur de 10 traités, Directeur des Opérations Financières de l’État et Président du Conseil ATIDI.'
      : 'Explore the intellectual biography, public service philosophy, and scholarly opus of Professor Kelly Mua Kingsly: Harvard Kennedy School MPA, author of 10 treatises, Director of Finance Operations of the State, and ATIDI Board Chairman.';

  return {
    title,
    description,
    keywords: [
      'Professor Kelly Mua Kingsly Biography',
      'Kelly Mua Kingsley Harvard MPA',
      'Forensic Accounting Africa Author',
      'Public Financial Management Cameroon',
      'ATIDI Board Chair Biography',
      'Knight of Order of Valor Cameroon',
      'ENAM Senior Lecturer Public Finance',
    ],
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        fr: '/fr/about',
      },
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `/${locale}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';
  const profile = getExecutiveProfile();
  const allBooks = await getBooks();
  const featuredBooks = allBooks.slice(0, 4);

  // JSON-LD Structured Data for AboutPage & Person
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Person',
      name: profile.fullName,
      alternateName: profile.alternateName,
      honorificPrefix: 'Professor',
      honorificSuffix: profile.honorifics,
      description: t(profile.shortBio, locale),
      image: 'https://kellymuakingsly.com/images/mua.jpeg',
      sameAs: [
        profile.coordinates.wikipedia,
        profile.coordinates.wikiGenius,
        profile.coordinates.linkedIn,
      ],
      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'Harvard University, John F. Kennedy School of Government',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'Charisma University',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'York Saint John University',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'University of Dschang',
        },
      ],
      knowsAbout: profile.transversalCompetencies.map((c) => t(c, locale)),
    },
  };

  const narrativePillars = [
    {
      id: 'sovereign-pfm',
      icon: Landmark,
      number: '01',
      title: {
        en: 'Sovereign Fiscal Architecture & Public Financial Management',
        fr: 'Architecture Budgétaire Souveraine & Gestion des Finances Publiques',
      },
      tagline: {
        en: 'Directing state liquidity operations, debt syndication, and macro-fiscal dashboards.',
        fr: 'Pilotage des opérations financières de l’État, syndications de dette et tableaux de bord macro-budgétaires.',
      },
      narrative: {
        en: 'At the heart of the Republic of Cameroon’s fiscal machinery, Professor Kelly Mua Kingsly directs the Finance Operations of the State (MINFI). His stewardship encompasses monitoring public revenue and expenditure execution, centralizing the State Financial Operations Dashboard (TOFE), evaluating cross-debt between state entities, and orchestrating sovereign Treasury bond (OTA) and bill (BTA) syndications across the CEMAC regional market. Having previously served as Cameroon’s Designated Representative to COSUMAF for over eight years and Censor at BEAC, he has consistently championed domestic resource mobilization and capital market integration.',
        fr: 'Au cœur de l’appareil budgétaire de la République du Cameroun, le Professeur Kelly Mua Kingsly dirige les Opérations Financières de l’État (MINFI). Son action englobe le suivi de l’exécution des recettes et dépenses publiques, la centralisation du Tableau des Opérations Financières de l’État (TOFE), l’évaluation des dettes croisées des organismes publics et le pilotage des émissions obligataires (OTA) et bons du Trésor (BTA) sur le marché de la CEMAC. Ancien représentant désigné auprès de la COSUMAF pendant plus de huit ans et censeur à la BEAC, il œuvre activement pour la souveraineté financière et la profondeur du marché des capitaux.',
      },
      bullets: [
        {
          en: 'Execution and centralization of the State Financial Operations Dashboard (TOFE).',
          fr: 'Élaboration et centralisation du Tableau des Opérations Financières de l’État (TOFE).',
        },
        {
          en: 'Structuring downstream sovereign debt securities on regional CEMAC financial markets.',
          fr: 'Structuration et adjudication des titres publics souverains (BTA/OTA) sur le marché régional.',
        },
        {
          en: 'Over eight years of regional capital market supervisory regulation at COSUMAF.',
          fr: 'Plus de huit ans de régulation du marché financier régional au sein du collège de la COSUMAF.',
        },
      ],
    },
    {
      id: 'forensic-anti-fraud',
      icon: Scale,
      number: '02',
      title: {
        en: 'Forensic Accounting, Evidentiary Science & Anti-Fraud Diagnostics',
        fr: 'Comptabilité Judiciaire, Criminalistique Financière & Diagnostic Anti-Fraude',
      },
      tagline: {
        en: 'Author of 10 reference treatises and pioneer of institutional anomaly detection.',
        fr: 'Auteur de 10 traités de référence et pionnier de la détection d’anomalies financières.',
      },
      narrative: {
        en: 'Recognized internationally as a Founding Fellow of the International Institute of Forensic Accounts (IIFA) and Certified Investigation Professional (ICFIP), Professor Kingsly has revolutionized the study and practice of forensic finance in emerging economies. He has authored ten authoritative monographs dissecting corporate fraud, digital evidence chains of custody, public procurement leakage indicators, and anti-money laundering frameworks. His doctoral research models neural networks and automated anomaly detection to prevent sovereign expenditure diversion.',
        fr: 'Reconnu internationalement comme Membre Fondateur Émérite de l’International Institute of Forensic Accounts (IIFA) et professionnel certifié en investigation (ICFIP), le Professeur Kingsly a transformé la doctrine et la pratique de l’audit judiciaire en Afrique. Il est l’auteur de dix monographies de référence décortiquant la criminalité financière, la chaîne de preuve numérique, les signaux d’alerte dans les marchés publics et la lutte contre le blanchiment de capitaux. Ses travaux doctoraux modélisent l’intelligence artificielle appliquée au contrôle des dépenses souveraines.',
      },
      bullets: [
        {
          en: 'Author of 10 authoritative monographic treatises on forensic auditing and financial crime.',
          fr: 'Auteur de 10 ouvrages et traités de référence en audit judiciaire et criminalistique financière.',
        },
        {
          en: 'Founding Fellow of the International Institute of Forensic Accounts (IIFA).',
          fr: 'Membre Fondateur Émérite de l’Institut International d’Audit Judiciaire (IIFA).',
        },
        {
          en: 'Research pioneer applying machine learning anomaly scoring to public procurement audits.',
          fr: 'Recherche pionnière appliquant le machine learning au dépistage des fraudes dans la commande publique.',
        },
      ],
    },
    {
      id: 'pan-african-multilateral',
      icon: Globe2,
      number: '03',
      title: {
        en: 'Pan-African Multilateral Governance & Sovereign De-risking',
        fr: 'Gouvernance Multilatérale Panafricaine & Sécurisation des Investissements',
      },
      tagline: {
        en: 'Presiding over continental trade credit insurance underwriting exceeding $85B+.',
        fr: 'Président du Conseil d’Administration d’ATIDI garantissant plus de 85 milliards de dollars d’échanges.',
      },
      narrative: {
        en: 'In multilateral development, Professor Kingsly brings formidable diplomatic and operational expertise. Following a distinguished 16-year career as Deputy Resident Representative for Operations at the United Nations Development Programme (UNDP), he currently serves as Chairman of the Board of Directors of the African Trade & Investment Development Insurance (ATIDI). In this capacity, he presides over a multilateral constituency of 24 sovereign African member states, steering insurance portfolios that have mobilized over $85B in cumulative trade and investment. Concurrently, as Designated National Authority for the UNDP-GEF Global Green Bond Initiative, he champions sustainable sovereign debt taxonomies.',
        fr: 'Dans le champ multilatéral, le Professeur Kingsly déploie une autorité diplomatique et fiduciaire de premier plan. Après 16 années de carrière au PNUD comme Représentant Résident Adjoint chargé des Opérations, il préside aujourd’hui le Conseil d’Administration de l’Agence pour l’Assurance du Commerce en Afrique (ATIDI). À ce titre, il dirige la gouvernance de 24 États membres souverains, supervisant des portefeuilles d’assurance-crédit ayant dé-risqué plus de 85 milliards de dollars de flux d’investissements continentaux. Il est également Autorité Nationale Désignée pour l’Initiative Obligations Vertes (PNUD-FEM).',
      },
      bullets: [
        {
          en: 'Board Chairman of ATIDI guiding 24 sovereign member states and $85B+ in guaranteed flows.',
          fr: 'Président du Conseil d’ATIDI fédérant 24 États souverains et 85 Mds $ de garanties d’investissements.',
        },
        {
          en: '16-year diplomatic and fiduciary track record as UNDP Deputy Resident Representative.',
          fr: '16 ans de carrière diplomatique et fiduciaire comme Représentant Résident Adjoint au PNUD.',
        },
        {
          en: 'Designated National Authority for the Global Green Bond Initiative & Resilient Debt Platform.',
          fr: 'Autorité Nationale Désignée pour les Obligations Vertes et la Plateforme Dette Résiliente.',
        },
      ],
    },
    {
      id: 'academic-mentorship',
      icon: GraduationCap,
      number: '04',
      title: {
        en: 'Academic Formation & Public Administration Mentorship',
        fr: 'Formation Académique d’Élite & Mentorat de la Haute Fonction Publique',
      },
      tagline: {
        en: 'Harvard Kennedy School alumnus training magistrates, inspectors, and treasury executives.',
        fr: 'Diplômé de Harvard Kennedy School formant magistrats, inspecteurs et trésoriers à l’ENAM.',
      },
      narrative: {
        en: 'A firm believer in institutional capacity building, Professor Kingsly unites world-class academic scholarship with hands-on civil service pedagogy. An alumnus of Harvard University’s John F. Kennedy School of Government (MPA in Public Finance), Charisma University (PhD in Public Policy), and York Saint John University (DBA), he lectures at the École Nationale d’Administration et de Magistrature (ENAM, Yaoundé). There, he trains senior civil servants, state auditors, and financial magistrates in public financial management, evidentiary standards, and fiscal integrity.',
        fr: 'Convaincu que la solidité des institutions repose sur l’excellence du capital humain, le Professeur Kingsly associe les plus hauts standards universitaires mondiaux à la transmission pédagogique républicaine. Diplômé de Harvard University (Master en Administration Publique à la John F. Kennedy School of Government), docteur de Charisma University (PhD) et de York Saint John University (DBA), il enseigne à l’École Nationale d’Administration et de Magistrature (ENAM). Il y forme les magistrats financiers, inspecteurs d’État et directeurs du Trésor à la rigueur probatoire et à l’éthique publique.',
      },
      bullets: [
        {
          en: 'Master of Public Administration (MPA), Public Finance — Harvard Kennedy School.',
          fr: 'Master en Administration Publique (MPA), Finances Publiques — Harvard Kennedy School.',
        },
        {
          en: 'Senior Lecturer at ENAM training financial magistrates and public accounting inspectors.',
          fr: 'Enseignant-Chercheur à l’ENAM formant magistrats des comptes et inspecteurs du Trésor.',
        },
        {
          en: 'Doctoral research chair supervising applied treatises on African fiscal governance.',
          fr: 'Direction de recherches doctorales et mémoires appliqués sur la gouvernance financière africaine.',
        },
      ],
    },
  ];

  const milestones = [
    {
      period: '1997 – 2009',
      title: {
        en: 'Territorial Treasury & State Accounting Foundations',
        fr: 'Trésor Territorial & Fondations de la Comptabilité Publique',
      },
      summary: {
        en: 'Began executive public career in Cameroon’s territorial financial administration, serving as Chief of Accounts in Buea Regional Treasury, Divisional Treasurer a.i. in Kumba, and Inspector-Auditor at the Ministry of Economy and Finance.',
        fr: 'Débute sa carrière au sein des trésoreries territoriales de l’État : chef de service à la Trésorerie Régionale de Buea, Trésorier Départemental p.i. à Kumba et inspecteur vérificateur au Ministère de l’Économie et des Finances.',
      },
    },
    {
      period: '2008 – 2024',
      title: {
        en: 'United Nations Operations & Global Multilateral Fiduciary Oversight',
        fr: 'Opérations des Nations Unies & Discipline Fiduciaire Mondiale',
      },
      summary: {
        en: 'Spent nearly 17 years directing country-level operations, budget management, IPSAS compliance, and risk mitigation as Deputy Resident Representative for Operations at the United Nations Development Programme (UNDP).',
        fr: 'Dirige pendant près de 17 ans les opérations pays, la gestion budgétaire, la conformité aux normes IPSAS et la sécurité opérationnelle en tant que Représentant Résident Adjoint chargé des Opérations au PNUD.',
      },
    },
    {
      period: '2011 – 2016',
      title: {
        en: 'Advanced Doctoral Scholarship & Harvard Kennedy School Formation',
        fr: 'Recherche Doctorale Approfondie & Diplôme de Harvard Kennedy School',
      },
      summary: {
        en: 'Earned his Master of Public Administration (MPA) in Public Finance from Harvard University (John F. Kennedy School of Government) and completed doctoral research in Business, Public Policy, and Forensic Accounting.',
        fr: 'Obtient son Master en Administration Publique (MPA) en finances publiques à l’Université Harvard (John F. Kennedy School of Government) et soutient ses thèses de doctorat (PhD & DBA) en politiques publiques et audit judiciaire.',
      },
    },
    {
      period: '2016 – Present',
      title: {
        en: 'Sovereign Treasury Directorship & Multilateral Board Leadership',
        fr: 'Direction des Opérations de l’État & Présidence Multilatérale Panafricaine',
      },
      summary: {
        en: 'Directs State Finance Operations at the Ministry of Finance (Cameroon), serves on regional capital market bodies (COSUMAF, BEAC), lectures at ENAM, and presides as Board Chairman of ATIDI across 24 sovereign African nations.',
        fr: 'Dirige les Opérations Financières de l’État au MINFI, régule les marchés de capitaux (COSUMAF, BEAC), enseigne à l’ENAM et préside le Conseil d’Administration d’ATIDI auprès de 24 États membres souverains.',
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =========================================================
          SECTION 1: HERO & EXECUTIVE NARRATIVE
         ========================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="editorial-kicker">
            {locale === 'fr'
              ? 'BIOGRAPHIE INTELLECTUELLE & DOCTRINE DE GOUVERNANCE'
              : 'INTELLECTUAL BIOGRAPHY & GOVERNANCE DOCTRINE'}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-serif font-bold text-navy-900 leading-[1.12] tracking-tight">
              {profile.fullName}
            </h1>
            <div className="text-base sm:text-lg font-medium text-bronze-600 mt-2 font-mono tracking-wide">
              {profile.honorifics}
            </div>
          </div>

          <p className="text-base sm:text-lg font-medium text-navy-800 leading-relaxed font-sans">
            {t(profile.shortBio, locale)}
          </p>

          <div className="space-y-4 text-ink-700 leading-relaxed text-sm sm:text-base font-sans">
            {profile.fullBioParagraphs.map((para, idx) => (
              <p key={idx}>{t(para, locale)}</p>
            ))}
          </div>

          {/* Transversal Competencies Badges */}
          <div className="pt-2 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {locale === 'fr'
                ? 'Piliers d’Analyse & Ingénierie Stratégique :'
                : 'Strategic Engineering & Core Competencies:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.transversalCompetencies.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-surface-paper border border-surface-border text-xs font-medium text-navy-900 rounded-sm"
                >
                  {t(comp, locale)}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Pathway Bar to Avoid Overlap */}
          <div className="pt-4 border-t border-surface-border flex flex-wrap items-center gap-3 text-xs">
            <span className="text-ink-500 font-medium">
              {locale === 'fr' ? 'Registres Détaillés :' : 'Detailed Specialized Registries:'}
            </span>
            <Link
              href={`/${locale}/governance`}
              className="inline-flex items-center gap-1 font-semibold text-bronze-600 hover:text-navy-900 underline underline-offset-4"
            >
              <span>{locale === 'fr' ? 'Registre Statutaire des Mandats (20 Fonctions)' : 'Statutory Mandates Register (20 Offices)'}</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
            <span className="text-surface-border" aria-hidden="true">·</span>
            <Link
              href={`/${locale}/books`}
              className="inline-flex items-center gap-1 font-semibold text-bronze-600 hover:text-navy-900 underline underline-offset-4"
            >
              <span>{locale === 'fr' ? 'Catalogue des 10 Traités' : 'Catalog of 10 Treatises'}</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Executive Portrait Card */}
        <div className="lg:col-span-4 space-y-4">
          <figure className="overflow-hidden border border-gold-500/40 bg-navy-950 shadow-2xl relative rounded-sm">
            <div className="relative aspect-[4/5] bg-navy-950">
              <Image
                src="/images/mua.jpeg"
                alt={profile.fullName}
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 380px, 420px"
                className="object-cover object-top"
              />
              {/* Corner Monogram Seal */}
              <div
                aria-hidden="true"
                className="absolute top-3 right-3 w-10 h-10 bg-navy-950/90 backdrop-blur-sm border border-gold-400 flex items-center justify-center font-serif font-bold text-xs tracking-wider text-gold-300 shadow-lg"
              >
                KMK
              </div>
            </div>

            <figcaption className="p-5 bg-navy-950 text-white space-y-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.08em] text-gold-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Ordre National' : 'State Distinction'}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">REPUBLIC OF CAMEROON</span>
              </div>

              <div className="font-serif font-semibold text-base text-white">
                {t(profile.knighthood, locale)}
              </div>

              <div className="pt-2 border-t border-white/10 text-xs text-slate-300 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Notice canonique internationale : Prof. Kelly Mua Kingsly (référencé également sous Kelly Mua Kingsley).'
                  : 'International canonical indexing: Prof. Kelly Mua Kingsly (also indexed in international citations as Kelly Mua Kingsley).'}
              </div>
            </figcaption>
          </figure>

          {/* Quick Institutional Anchor Card */}
          <div className="p-4 bg-surface-paper border border-surface-border text-xs text-ink-700 space-y-2 rounded-sm">
            <div className="font-semibold text-navy-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-bronze-600 shrink-0" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Ancrage Institutionnel Actuel' : 'Current Primary Directorships'}</span>
            </div>
            <ul className="space-y-1 text-[11px] text-ink-600">
              <li>• Directeur des Opérations Financières de l’État (MINFI)</li>
              <li>• Président du Conseil d’Administration (ATIDI)</li>
              <li>• Enseignant-Chercheur en Finances Publiques (ENAM)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: PUBLIC SERVICE PHILOSOPHY & MANIFESTO
         ========================================================= */}
      <section
        className="bg-navy-950 text-white border border-gold-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        aria-label={locale === 'fr' ? 'Philosophie du Service Public' : 'Philosophy of Public Service'}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-navy-900 via-navy-950 to-[#040810] opacity-90 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative space-y-6 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2.5 bg-navy-900/90 border border-gold-500/40 text-gold-400 rounded-full mb-1">
            <Quote className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="editorial-kicker-dark">
            {locale === 'fr'
              ? 'DOCTRINE DE SOUVERAINETÉ & INTENDANCE FIDUCIAIRE'
              : 'DOCTRINE OF FIDUCIARY STEWARDSHIP & RESILIENCE'}
          </div>

          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-snug tracking-tight">
            {locale === 'fr'
              ? '« La véritable indépendance souveraine ne se bâtit pas sur l’endettement cyclique d’urgence, mais sur une discipline budgétaire absolue, la traçabilité probatoire des flux financiers et des marchés de capitaux fondés sur la mobilisation des ressources endogènes. »'
              : '“True sovereign independence is forged not through cyclical crisis borrowing, but through unyielding public financial discipline, verifiable data integrity, and capital markets rooted in domestic resource mobilization.”'}
          </blockquote>

          <div className="text-xs sm:text-sm font-medium text-gold-300 font-mono tracking-wide">
            — Professor Kelly Mua Kingsly, PhD · DBA · MPA (Harvard) · LL.M.
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
            {locale === 'fr'
              ? 'Cette boussole intellectuelle guide un quart de siècle de réformes : de l’automatisation du Tableau des Opérations Financières de l’État (TOFE) à la formation des magistrats à l’audit judiciaire, jusqu’à la souscription de plus de 85 milliards de dollars d’assurance-crédit panafricaine.'
              : 'This guiding compass has anchored a quarter-century of public finance modernizations: from centralizing sovereign fiscal dashboards (TOFE) and training magistrates in forensic accounting, to underwriting over $85B in pan-African trade credit insurance.'}
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: THE FOUR TRANSVERSAL PILLARS OF IMPACT
         ========================================================= */}
      <section className="space-y-10" aria-label={locale === 'fr' ? 'Les Quatre Piliers d’Action' : 'Four Pillars of Transversal Impact'}>
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr'
              ? 'CHAMPS D’ACTION STRATÉGIQUE'
              : 'ARENAS OF STRATEGIC IMPACT'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'Les Quatre Dimensions de l’Œuvre Publique & Académique'
              : 'The Four Dimensions of Public & Scholarly Leadership'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Une synthèse thématique articulant rigueur du Trésor public, criminalistique financière, institutions multilatérales et transmission magistrale.'
              : 'A thematic synthesis bridging state treasury stewardship, forensic evidentiary science, multilateral integration, and academic mentorship.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {narrativePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className="bg-white border border-surface-border p-6 sm:p-8 shadow-institutional space-y-5 flex flex-col justify-between hover:border-gold-500/40 transition-colors rounded-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-surface-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-navy-900 text-gold-400 rounded-sm shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-mono font-bold text-bronze-600 tracking-wider">
                        PILLAR {pillar.number}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-ink-400 font-mono">
                      CORE THEME
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 leading-snug">
                      {t(pillar.title, locale)}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-bronze-600 mt-1">
                      {t(pillar.tagline, locale)}
                    </p>
                  </div>

                  <p className="text-ink-700 text-sm sm:text-[15px] leading-relaxed font-sans">
                    {t(pillar.narrative, locale)}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border space-y-2 bg-surface-light p-3 sm:p-4 rounded-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-navy-900">
                    {locale === 'fr' ? 'Contributions Majeures :' : 'Key Strategic Deliverables:'}
                  </div>
                  <ul className="space-y-1.5">
                    {pillar.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-ink-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-bronze-600 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{t(b, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: THE MONOGRAPHIC OPUS (AUTHOR SHOWCASE)
         ========================================================= */}
      <section
        className="bg-surface-paper border border-surface-border p-6 sm:p-10 shadow-institutional space-y-8 rounded-sm"
        aria-label={locale === 'fr' ? 'L’Œuvre Monographique de l’Auteur' : 'The Author’s Monographic Opus'}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-border pb-4">
          <div className="space-y-1">
            <div className="editorial-kicker">
              {locale === 'fr' ? 'TRAITÉS DE RÉFÉRENCE & PUBLICATIONS' : 'REFERENCE TREATISES & PUBLICATIONS'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
              {locale === 'fr'
                ? 'L’Œuvre de l’Auteur : 10 Traités Académiques & Pratiques'
                : 'The Author’s Opus: 10 Reference Treatises & Monographic Works'}
            </h2>
            <p className="text-sm text-ink-600">
              {locale === 'fr'
                ? 'Une bibliothèque de référence couvrant la délinquance financière, les politiques de sauvetage budgétaire, la blockchain et l’éthique de gouvernance.'
                : 'An authoritative reference library spanning financial crime diagnostics, fiscal bailouts, blockchain trust, and public sector governance ethics.'}
            </p>
          </div>

          <Link
            href={`/${locale}/books`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-gold-300 font-semibold text-xs transition-colors shrink-0 rounded-sm"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>{locale === 'fr' ? 'Voir le Catalogue des 10 Livres' : 'Browse All 10 Published Treatises'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Featured 4 Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-surface-border p-4 space-y-3 flex flex-col justify-between hover:border-gold-500/50 transition-colors rounded-sm shadow-sm"
            >
              <div className="space-y-2">
                <div className="relative aspect-[3/4] bg-navy-950 overflow-hidden border border-surface-border rounded-sm">
                  {book.cover_image_url ? (
                    <Image
                      src={book.cover_image_url}
                      alt={t(book.title, locale)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={book.cover_image_url.startsWith('http')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-gold-400 font-serif">
                      {t(book.title, locale)}
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-navy-950/90 border border-gold-500/40 text-[10px] font-mono text-gold-300 font-semibold">
                    {book.publish_date.split('-')[0]}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-bronze-600 uppercase tracking-wider">
                  {book.academic_category}
                </div>

                <h3 className="font-serif font-bold text-sm sm:text-base text-navy-900 leading-snug line-clamp-2">
                  {t(book.title, locale)}
                </h3>

                <p className="text-xs text-ink-600 line-clamp-2 font-sans">
                  {t(book.subtitle, locale)}
                </p>
              </div>

              <div className="pt-2 border-t border-surface-border">
                <Link
                  href={`/${locale}/books/${book.slug}`}
                  className="text-xs font-semibold text-bronze-600 hover:text-navy-900 inline-flex items-center gap-1"
                >
                  <span>{locale === 'fr' ? 'Détails & Sommaire' : 'Read Chapter Outline'}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 5: FORMATIVE INTELLECTUAL TRAJECTORY
         ========================================================= */}
      <section className="space-y-8" aria-label={locale === 'fr' ? 'Trajectoire Intellectuelle & Jalons' : 'Formative Trajectory & Career Milestones'}>
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr' ? 'JALONS BIOGRAPHIQUES' : 'FORMATIVE INTELLECTUAL TRAJECTORY'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'L’Itinéraire Républicain : Des Trésoreries Régionales à la Scène Internationale'
              : 'From Regional Public Accounting to Sovereign Directorship & Global Boards'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Une progression continue fondée sur l’intégrité du service public, la formation d’élite et l’autorité fiduciaire multilatérale.'
              : 'A continuous journey anchored in public service integrity, world-class formation, and multilateral fiduciary discipline.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-white border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-gold-500/40 transition-colors rounded-sm shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 bg-navy-900 text-gold-300 font-mono font-semibold text-[11px] rounded-sm">
                    {m.period}
                  </span>
                  <span className="text-[11px] font-mono text-ink-400 font-bold">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-navy-900 leading-snug">
                  {t(m.title, locale)}
                </h3>

                <p className="text-xs text-ink-700 leading-relaxed font-sans">
                  {t(m.summary, locale)}
                </p>
              </div>

              <div className="pt-2 border-t border-surface-border text-[11px] font-mono text-bronze-600 font-medium">
                {locale === 'fr' ? 'MANDAT STATUTAIRE ENREGISTRÉ' : 'STATUTORY CAREER MANDATE'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 6: INSTITUTIONAL PATHWAYS (CROSSWAYS HUB)
         ========================================================= */}
      <section
        className="bg-white border border-surface-border p-6 sm:p-10 shadow-institutional space-y-8 rounded-sm"
        aria-label={locale === 'fr' ? 'Carrefour Institutionnel & Portails' : 'Institutional Gateways & Crossways'}
      >
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr' ? 'CARREFOUR INSTITUTIONNEL' : 'INSTITUTIONAL GATEWAYS'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'Explorer les Portails Spécialisés de la Plateforme'
              : 'Explore the Specialized Knowledge Hubs'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Pour approfondir les mandats officiels, les publications, les analyses de politiques publiques ou les interventions médiatiques.'
              : 'Direct pathways to official statutory records, monographic books, advisory pillars, or media broadcasts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Governance */}
          <Link
            href={`/${locale}/governance`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Registre Statutaire' : 'Governance Register'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Répertoire officiel des 20 mandats d’État, conseils d’administration multilatéraux, décrets et accréditations.'
                  : 'Official statutory directory of 20 sovereign offices, multilateral boards, decrees, and full academic transcripts.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Consulter le Registre' : 'Open Register'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 2: Books */}
          <Link
            href={`/${locale}/books`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Catalogue des Livres' : 'Published Treatises'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Les 10 traités de référence avec ISBN officiels enregistrés, sommets thématiques, sommaires détaillés et canaux d’acquisition.'
                  : 'All 10 published reference treatises with registered ISBNs, chapter outlines, takeaways, and retail access.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Explorer les 10 Ouvrages' : 'View Catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 3: Expertise */}
          <Link
            href={`/${locale}/expertise`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Piliers d’Expertise' : 'Advisory Expertise'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Piliers d’ingénierie en finances publiques, finance climat, obligations vertes et détection des fraudes.'
                  : 'Advisory frameworks across sovereign debt sustainability, green bonds, ESG underwriting, and fraud detection.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Découvrir les Piliers' : 'Explore Pillars'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 4: Media */}
          <Link
            href={`/${locale}/media`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Médias & Discours' : 'Media & Keynotes'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Entretiens télévisés de référence, interventions ministérielles, articles de presse économique et conférences.'
                  : 'National television broadcasts, ministerial keynote addresses, press interviews, and economic briefings.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Accéder aux Médias' : 'Watch Broadcasts'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================
          SECTION 7: STATUTORY FIREWALL & LEGAL DISCLAIMER
         ========================================================= */}
      <section
        className="bg-surface-paper border border-surface-border p-6 sm:p-8 space-y-4 rounded-sm"
        aria-label={locale === 'fr' ? 'Charte d’Indépendance Déontologique' : 'Statutory Independence Statement'}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-900">
          <FileText className="w-4 h-4 text-bronze-600 shrink-0" aria-hidden="true" />
          <span>
            {locale === 'fr'
              ? 'Pare-Feu Déontologique et Charte d’Indépendance'
              : 'Public Sector Ethics & Statutory Firewall Statement'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans">
          {locale === 'fr'
            ? 'Ce portail constitue un répertoire académique et professionnel indépendant dédié aux travaux de recherche, aux publications et à la doctrine de gouvernance du Professeur Kelly Mua Kingsly. Conformément aux principes de neutralité républicaine, il est strictement distinct des organes de communication officiels du Ministère des Finances de la République du Cameroun, de l’ATIDI, du PNUD, de la COSUMAF ou de l’ENAM. Aucune prise de position sur ce site n’engage les institutions publiques précitées.'
            : 'This platform serves as an independent scholarly and professional repository dedicated to the research, monographic publications, and governance doctrine of Professor Kelly Mua Kingsly. In strict adherence to public sector ethics, this site is maintained separately from the official communication organs of the Ministry of Finance (Cameroon), ATIDI, UNDP, COSUMAF, or ENAM. Views expressed herein do not bind the referenced statutory bodies.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <Link
            href={`/${locale}/legal/disclaimer`}
            className="text-bronze-600 hover:text-navy-900 underline underline-offset-4"
          >
            {locale === 'fr' ? 'Consulter la Charte Complète' : 'Read Full Independence Charter'}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-navy-900 hover:text-bronze-600 underline underline-offset-4"
          >
            {locale === 'fr' ? 'Correspondance Protocolaire' : 'Submit Protocol Request'}
          </Link>
        </div>
      </section>
    </div>
  );
}
