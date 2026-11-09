import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Landmark,
  Scale,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Quote,
  Download,
  Award,
} from 'lucide-react';
import { getExecutiveProfile, getBooks } from '@/lib/data/repository';
import { t } from '@/lib/utils';
import type { Locale } from '@/types/domain';
import { PressBioCard } from '@/components/shared/PressBioCard';

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
    'UNDP-EU': {
      en: 'United Nations Development Programme – European Union',
      fr: 'Programme des Nations Unies pour le Développement – Union Européenne',
    },
    'PNUD-UE': {
      en: 'Programme des Nations Unies pour le Développement – Union Européenne',
      fr: 'Programme des Nations Unies pour le Développement – Union Européenne',
    },
    UNDP: {
      en: 'United Nations Development Programme',
      fr: 'Programme des Nations Unies pour le Développement (PNUD)',
    },
    PNUD: {
      en: 'Programme des Nations Unies pour le Développement',
      fr: 'Programme des Nations Unies pour le Développement',
    },
    UNCTAD: {
      en: 'United Nations Conference on Trade and Development',
      fr: 'Conférence des Nations Unies sur le Commerce et le Développement (CNUCED)',
    },
    CNUCED: {
      en: 'Conférence des Nations Unies sur le Commerce et le Développement (CNUCED)',
      fr: 'Conférence des Nations Unies sur le Commerce et le Développement',
    },
    'BEAC-CPC-TP': {
      en: 'Bank of Central African States – Public Securities Settlement and Custody Unit',
      fr: 'Banque des États de l’Afrique Centrale – Cellule de Règlement et de Conservation des Titres Publics',
    },
    BVMAC: {
      en: 'Central African Unified Stock Exchange',
      fr: 'Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC)',
    },
    TOFE: {
      en: 'Table of State Financial Operations',
      fr: 'Tableau des Opérations Financières de l’État (TOFE)',
    },
    'BTA/OTA': {
      en: 'Treasury Bills / Treasury Bonds',
      fr: 'Bons du Trésor Assimilables / Obligations du Trésor Assimilables',
    },
    CEMAC: {
      en: 'Central African Economic and Monetary Community',
      fr: 'Communauté Économique et Monétaire de l’Afrique Centrale',
    },
    CFI: {
      en: 'Corporate Finance Institute',
      fr: 'Corporate Finance Institute',
    },
    CIPS: {
      en: 'Chartered Institute of Procurement & Supply',
      fr: 'Chartered Institute of Procurement & Supply',
    },
  };

  const regex = /(ATIDI|MINFI|ENAM|BEAC-CPC-TP|BEAC|COSUMAF|UNDP-EU|PNUD-UE|UNDP|PNUD|UNCTAD|CNUCED|BVMAC|TOFE|BTA\/OTA|CEMAC|CFI|CIPS)/g;
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

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Biographie Intellectuelle & Doctrine Fiduciaire | Pr Kelly Mua Kingsly'
      : 'Intellectual Biography & Fiduciary Doctrine | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Des finances publiques vérifiables. Découvrez la biographie intellectuelle, la doctrine fiduciaire et l’œuvre académique du Professeur Kelly Mua Kingsly : Harvard MPA, auteur de 10 traités, Directeur des Opérations Financières de l’État et Président du Conseil ATIDI.'
      : 'Public finance that can be verified. Explore the intellectual biography, fiduciary doctrine, and scholarly opus of Professor Kelly Mua Kingsly: Harvard MPA, author of 10 treatises, Director of Finance Operations of the State, and ATIDI Board Chairman.';

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

  // Feature 3 forensic/finance books (excluding political biography per Duval)
  const featuredBooks = allBooks
    .filter((b) => b.id !== 'book-credible-signature-paul-biya')
    .slice(0, 3);

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
      description:
        locale === 'fr'
          ? 'Leader camerounais de la finance, de l’investissement et du développement. Depuis trois décennies, le Professeur Kelly Mua Kingsley œuvre au carrefour du capital, des politiques publiques et du développement.'
          : 'Cameroonian leader in finance, investment and development. For three decades, Professor Kelly Mua Kingsley has worked where capital, policy and development meet.',
      image: 'https://kellykingsly.com/images/photos/about.jpg',
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
    },
  };

  const pathChapters = [
    {
      number: '01',
      chapterTitle: {
        en: 'The Treasury',
        fr: 'La Trésorerie',
      },
      period: '1997 – 2008',
      body: {
        en: 'He started in Cameroon’s regional treasuries, keeping accounts in Buea and Kumba, and later inspected public organisations as an Inspector-Auditor. There he learned the habit that still defines his work: check the figure against the cash.',
        fr: 'Il a fait ses premières armes dans les trésoreries régionales du Cameroun, tenant les comptes publics à Buea et Kumba, avant de contrôler les organismes publics en qualité d’inspecteur-vérificateur. C’est là qu’il a forgé le réflexe qui gouverne encore sa pratique : confronter l’écriture comptable à la réalité de la caisse.',
      },
    },
    {
      number: '02',
      chapterTitle: {
        en: 'The Mission',
        fr: 'La Mission Multilatérale',
      },
      period: '2008 – 2024',
      body: {
        en: 'At the United Nations Development Programme he spent over fifteen years as Deputy Resident Representative for Operations, running country-level budgets, IPSAS compliance and risk.',
        fr: 'Au Programme des Nations Unies pour le Développement (PNUD), il a exercé pendant plus de quinze ans comme Représentant Résident Adjoint chargé des Opérations, pilotant les budgets pays, la conformité aux normes IPSAS et la maîtrise des risques.',
      },
    },
    {
      number: '03',
      chapterTitle: {
        en: 'The Method',
        fr: 'La Méthode Académique',
      },
      period: '2011 – 2016',
      body: {
        en: 'A Master of Public Administration in Public Finance from the Harvard Kennedy School, and doctoral research in public policy and forensic accounting, gave the practice a discipline.',
        fr: 'Un Master en Administration Publique (MPA) en finances publiques de la Harvard Kennedy School, conjugué à des recherches doctorales en politiques publiques et audit judiciaire, ont conféré à cette pratique empirique une rigueur méthodologique.',
      },
    },
    {
      number: '04',
      chapterTitle: {
        en: 'The Mandate',
        fr: 'Le Mandat d’État',
      },
      period: '2016 – Present',
      body: {
        en: 'Since 2016 he has directed State Finance Operations at the Ministry of Finance. He now chairs the Board of ATIDI, whose member states number 24, and teaches at ENAM.',
        fr: 'Depuis 2016, il dirige les Opérations Financières de l’État au Ministère des Finances. Il préside aujourd’hui le Conseil d’Administration de l’ATIDI, qui fédère 24 États membres souverains, et enseigne à l’ENAM.',
      },
    },
  ];

  const thinkingFields = [
    {
      id: 'field-treasury',
      icon: Landmark,
      title: {
        en: 'Treasury & Capital Markets',
        fr: 'Trésorerie d’État & Marchés de Capitaux',
      },
      summary: {
        en: 'Fiscal dashboards (TOFE), sovereign debt securities (BTA/OTA), and domestic resource mobilization.',
        fr: 'Tableaux de bord budgétaires (TOFE), titres publics souverains (BTA/OTA) et mobilisation de l’épargne locale.',
      },
      linkText: {
        en: 'Explore Technical Expertise',
        fr: 'Consulter l’Expertise Technique',
      },
      href: `/${locale}/expertise`,
    },
    {
      id: 'field-forensic',
      icon: Scale,
      title: {
        en: 'Integrity & Forensic Evidence',
        fr: 'Intégrité Fiduciaire & Preuve Judiciaire',
      },
      summary: {
        en: 'Evidence-based judicial audit, asset tracing, and financial-crime diagnostic frameworks.',
        fr: 'Audit probatoire, traçage des flux illicites et protocoles de diagnostic des crimes financiers.',
      },
      linkText: {
        en: 'Review Published Treatises',
        fr: 'Découvrir les Traités Publiés',
      },
      href: `/${locale}/books`,
    },
    {
      id: 'field-multilateral',
      icon: ShieldCheck,
      title: {
        en: 'Multilateral Risk & Climate Finance',
        fr: 'Risque Multilatéral & Finance Climat',
      },
      summary: {
        en: 'Pan-African credit insurance, commercial risk mitigation, and sovereign green-bond taxonomies.',
        fr: 'Assurance-crédit panafricaine, atténuation des risques d’investissement et obligations vertes souveraines.',
      },
      linkText: {
        en: 'View Statutory Mandates',
        fr: 'Voir le Registre des Mandats',
      },
      href: `/${locale}/governance`,
    },
  ];

  const acronymGlossary = [
    {
      acronym: 'ATIDI',
      name: {
        en: 'African Trade & Investment Development Insurance',
        fr: 'Agence pour l’Assurance du Commerce en Afrique',
      },
      scope: {
        en: 'Pan-African multilateral credit and political risk insurer (24 member states)',
        fr: 'Assureur multilatéral panafricain des risques de crédit et politiques (24 États membres)',
      },
    },
    {
      acronym: 'MINFI',
      name: {
        en: 'Ministry of Finance (Cameroon)',
        fr: 'Ministère des Finances (Cameroun)',
      },
      scope: {
        en: 'State treasury, budget execution, and financial operations directorship',
        fr: 'Direction générale du trésor, exécution budgétaire et opérations financières de l’État',
      },
    },
    {
      acronym: 'BEAC',
      name: {
        en: 'Bank of Central African States',
        fr: 'Banque des États de l’Afrique Centrale',
      },
      scope: {
        en: 'Regional central bank for the six CEMAC member nations',
        fr: 'Banque centrale régionale commune aux six États membres de la CEMAC',
      },
    },
    {
      acronym: 'COSUMAF',
      name: {
        en: 'Central African Financial Market Surveillance Commission',
        fr: 'Commission de Surveillance du Marché Financier de l’Afrique Centrale',
      },
      scope: {
        en: 'Sovereign capital market supervisor and regional regulatory college',
        fr: 'Autorité de régulation et de tutelle du marché financier unifié d’Afrique Centrale',
      },
    },
    {
      acronym: 'ENAM',
      name: {
        en: 'National School of Administration and Magistracy',
        fr: 'École Nationale d’Administration et de Magistrature',
      },
      scope: {
        en: 'Premier civil service and magistracy training institution in Central Africa',
        fr: 'Grande école de formation des hauts fonctionnaires et magistrats financiers',
      },
    },
    {
      acronym: 'BVMAC',
      name: {
        en: 'Central African Unified Stock Exchange',
        fr: 'Bourse des Valeurs Mobilières de l’Afrique Centrale',
      },
      scope: {
        en: 'Regional securities exchange based in Douala',
        fr: 'Marché boursier unifié de la zone CEMAC basé à Douala',
      },
    },
    {
      acronym: 'TOFE',
      name: {
        en: 'Table of State Financial Operations',
        fr: 'Tableau des Opérations Financières de l’État',
      },
      scope: {
        en: 'Official macro-fiscal treasury execution and budgetary balance matrix',
        fr: 'Tableau de bord macro-budgétaire consolidant recettes, dépenses et solde global',
      },
    },
    {
      acronym: 'BTA / OTA',
      name: {
        en: 'Treasury Bills / Treasury Bonds',
        fr: 'Bons / Obligations du Trésor Assimilables',
      },
      scope: {
        en: 'CEMAC sovereign debt market financing instruments',
        fr: 'Titres publics souverains de court, moyen et long terme émis par adjudication',
      },
    },
    {
      acronym: 'UNDP (PNUD)',
      name: {
        en: 'United Nations Development Programme',
        fr: 'Programme des Nations Unies pour le Développement',
      },
      scope: {
        en: 'Multilateral development and sustainable finance cooperation agency',
        fr: 'Organisme multilatéral des Nations Unies pour le développement et la finance durable',
      },
    },
    {
      acronym: 'UNCTAD (CNUCED)',
      name: {
        en: 'UN Conference on Trade and Development',
        fr: 'Conférence des Nations Unies sur le Commerce et le Développement',
      },
      scope: {
        en: 'Intergovernmental body promoting development-friendly trade reporting',
        fr: 'Organe intergouvernemental favorisant l’intégration commerciale équitable',
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
          SECTION 1: HERO & EXECUTIVE NARRATIVE (TRUST FIRST)
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
            <p className="text-xl sm:text-2xl font-serif text-bronze-600 mt-2 font-medium">
              {locale === 'fr'
                ? 'Leader camerounais de la finance, de l’investissement et du développement'
                : 'Cameroonian leader in finance, investment and development'}
            </p>
            <div className="text-xs sm:text-sm font-mono text-ink-500 mt-1">
              PhD, CFA · DBA · MBA · MPA (Harvard) · CFI · CIPS
            </div>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-navy-900 leading-relaxed font-sans">
            {locale === 'fr' ? (
              <>
                <p>
                  {renderWithAbbr(
                    'Depuis trois décennies, le Professeur Kelly Mua Kingsley œuvre au carrefour du capital, des politiques publiques et du développement — du Ministère des Finances du Cameroun et de la Banque des États de l’Afrique Centrale (BEAC) aux Nations Unies, à la CNUCED, à l’Union Européenne et aux marchés internationaux, de Yaoundé à Dubaï.',
                    locale
                  )}
                </p>
                <p>
                  {renderWithAbbr(
                    'Diplômé de Harvard et façonné par les réalités africaines, il réunit des qualifications académiques et professionnelles de premier plan, notamment PhD, DBA, MBA, MPA, CFA, CFI et CIPS. Pourtant, sa qualification la plus déterminante demeure son expérience pratique : il a constaté comment la crédibilité, des institutions solides et une signature de confiance permettent de libérer les opportunités d’une nation.',
                    locale
                  )}
                </p>
                <p>
                  {renderWithAbbr(
                    'Sa conviction est limpide : le Cameroun est riche de son potentiel et de ses ressources. Le défi consiste à bâtir la confiance nécessaire pour transformer ce potentiel en une prospérité durable. Son action se concentre sur la structuration du capital, le renforcement des garanties d’investissement et la promotion de la finance climat et islamique — des leviers concrets pour mobiliser l’investissement et soutenir un développement inclusif.',
                    locale
                  )}
                </p>
                <p className="font-medium text-navy-950">
                  {renderWithAbbr(
                    'La vision du Professeur Kingsley est celle d’Une Afrique Nouvelle : confiante, crédible et prête à guider son avenir — sur le continent comme sur la scène mondiale.',
                    locale
                  )}
                </p>
              </>
            ) : (
              <>
                <p>
                  {renderWithAbbr(
                    'For three decades, Professor Kelly Mua Kingsley has worked where capital, policy and development meet—from Cameroon’s Ministry of Finance and the Bank of Central African States (BEAC) to the United Nations, UNCTAD, the European Union and international markets spanning Yaoundé to Dubai.',
                    locale
                  )}
                </p>
                <p>
                  {renderWithAbbr(
                    'Harvard-trained and shaped by Africa’s realities, he brings together advanced academic and professional credentials, including a PhD, DBA, MBA, MPA, CFA, CFI and CIPS. Yet his most important qualification is practical experience: he has seen how credibility, sound institutions and a trusted signature can help unlock opportunity for a nation.',
                    locale
                  )}
                </p>
                <p>
                  {renderWithAbbr(
                    'His conviction is clear: Cameroon is rich in potential and resources. The challenge is building the trust needed to turn that potential into lasting prosperity. His work focuses on structuring capital, strengthening investment guarantees and advancing climate and Islamic finance—practical tools to mobilize investment and support inclusive development.',
                    locale
                  )}
                </p>
                <p className="font-medium text-navy-950">
                  {renderWithAbbr(
                    'Professor Kingsley’s vision is A New Africa: confident, credible and ready to lead—at home and on the global stage.',
                    locale
                  )}
                </p>
              </>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 bg-surface-paper border border-surface-border text-xs font-semibold text-navy-900 rounded-sm inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-gold-500" aria-hidden="true" />
              <span>{t(profile.knighthood, locale)}</span>
            </span>
            <Link
              href={`/${locale}/governance`}
              className="text-xs font-semibold text-bronze-600 hover:text-navy-900 inline-flex items-center gap-1 underline underline-offset-4"
            >
              <span>{locale === 'fr' ? 'Consulter les 20 mandats officiels' : 'View all 20 official mandates'}</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Executive Portrait Card */}
        <div className="lg:col-span-4 space-y-3">
          <figure className="overflow-hidden border border-gold-500/40 bg-navy-950 shadow-2xl relative rounded-sm">
            <div className="relative aspect-[4/5] bg-navy-950">
              <Image
                src="/images/photos/about.jpg"
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

            <figcaption className="p-3 bg-navy-950 text-[11px] text-slate-300 border-t border-gold-500/30 flex items-center justify-between">
              <span>
                {locale === 'fr'
                  ? 'Sommet diplomatique, Nairobi · 2024'
                  : 'Nairobi diplomatic summit · 2024'}
              </span>
              <a
                href="/images/photos/about.jpg"
                download="Prof_Kelly_Mua_Kingsly_Official_Portrait.jpg"
                className="inline-flex items-center gap-1 text-gold-300 hover:text-white transition-colors"
                title={locale === 'fr' ? 'Télécharger le portrait' : 'Download portrait'}
              >
                <Download className="w-3 h-3" aria-hidden="true" />
                <span className="font-mono text-[10px]">HD</span>
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: DOCTRINE OF FIDUCIARY STEWARDSHIP (DIRECTLY UNDER LEAD)
         ========================================================= */}
      <section
        className="relative bg-navy-950 text-white p-8 sm:p-12 lg:p-16 border-y-2 sm:border sm:border-gold-500/40 shadow-2xl overflow-hidden rounded-none sm:rounded-sm"
        aria-label={locale === 'fr' ? 'Doctrine Fiduciaire' : 'Fiduciary Doctrine'}
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
              ? 'DOCTRINE FIDUCIAIRE · RÉSILIENCE ÉCONOMIQUE'
              : 'FIDUCIARY DOCTRINE · ECONOMIC RESILIENCE'}
          </div>

          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-snug tracking-tight">
            {locale === 'fr'
              ? '« La véritable indépendance souveraine ne se bâtit pas sur l’endettement cyclique d’urgence, mais sur une discipline budgétaire absolue, la traçabilité probatoire des flux financiers et des marchés de capitaux fondés sur la mobilisation des ressources endogènes. »'
              : '“True sovereign independence is forged not through cyclical crisis borrowing, but through unyielding public financial discipline, verifiable data integrity, and capital markets rooted in domestic resource mobilization.”'}
          </blockquote>

          <div className="text-xs sm:text-sm font-medium text-gold-300 font-mono tracking-wide">
            — Professor Kelly Mua Kingsly, PhD, CFA
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: THE PATH (FOUR CHAPTERS OF VERIFIABILITY)
         ========================================================= */}
      <section
        className="space-y-8"
        aria-label={locale === 'fr' ? 'L’Itinéraire du Contrôle' : 'The Formative Path'}
      >
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr' ? 'L’ITINÉRAIRE DU CONTRÔLE' : 'THE FORMATIVE PATH'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'Vingt-Cinq Ans au Service de la Vérifiabilité des Fonds Publics'
              : 'A Quarter-Century Dedicated to Verifiable Public Money'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Quatre chapitres, de la caisse publique régionale à la gouvernance financière continentale.'
              : 'Four chapters from regional public cash registers to continental financial governance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathChapters.map((chapter) => (
            <div
              key={chapter.number}
              className="bg-white border border-surface-border p-6 space-y-4 flex flex-col justify-between hover:border-gold-500/40 transition-colors rounded-sm shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 bg-navy-900 text-gold-300 font-mono font-semibold text-[11px] rounded-sm">
                    {chapter.number}
                  </span>
                  <span className="text-[11px] font-mono text-ink-500 font-medium">
                    {chapter.period}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-navy-900 leading-snug">
                  {t(chapter.chapterTitle, locale)}
                </h3>

                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans">
                  {renderWithAbbr(t(chapter.body, locale), locale)}
                </p>
              </div>

              <div className="pt-2 border-t border-surface-border text-[11px] font-mono text-bronze-600 font-medium">
                {locale === 'fr' ? 'ÉTAPE VÉRIFIÉE' : 'VERIFIED STAGE'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: WHERE THE THINKING SHOWS UP (THREE THEMED FIELDS)
         ========================================================= */}
      <section
        className="space-y-8"
        aria-label={locale === 'fr' ? 'Champs d’Application' : 'Domains of Application'}
      >
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr' ? 'CHAMPS D’APPLICATION' : 'DOMAINS OF APPLICATION'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'L’Application des Principes dans l’Action Publique'
              : 'Where the Thinking Shows Up'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'La traduction concrète de la doctrine fiduciaire dans les institutions, l’analyse et les publications.'
              : 'How fiduciary doctrine translates into operational institutions, scholarly treatises, and statutory mandates.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {thinkingFields.map((field) => {
            const IconComponent = field.icon;
            return (
              <div
                key={field.id}
                className="bg-white border border-surface-border p-6 rounded-sm shadow-institutional space-y-4 flex flex-col justify-between hover:border-navy-900 transition-colors"
              >
                <div className="space-y-3">
                  <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm">
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-navy-900">
                    {t(field.title, locale)}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-sans">
                    {renderWithAbbr(t(field.summary, locale), locale)}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <Link
                    href={field.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-bronze-600 transition-colors group"
                  >
                    <span>{t(field.linkText, locale)}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 5: TEACHER AND AUTHOR (3 FEATURED TREATISES)
         ========================================================= */}
      <section
        className="space-y-8"
        aria-label={locale === 'fr' ? 'Enseignement & Publications' : 'Scholarship & Publications'}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-4">
          <div className="space-y-1">
            <div className="editorial-kicker">
              {locale === 'fr' ? 'TRAVAUX ACADÉMIQUES' : 'SCHOLARSHIP & TREATISES'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
              {locale === 'fr'
                ? 'Enseignant et Auteur : Dix Traités et Monographies'
                : 'Teacher and Author: Ten Published Treatises'}
            </h2>
            <p className="text-sm text-ink-600">
              {locale === 'fr'
                ? 'Dix traités de référence publiés en audit judiciaire, criminalité financière, finances publiques et marchés de capitaux.'
                : 'Ten published reference treatises on forensic accounting, financial crime, public finance, and capital markets.'}
            </p>
          </div>

          <Link
            href={`/${locale}/books`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-bronze-600 hover:text-navy-900 transition-colors shrink-0"
          >
            <span>{locale === 'fr' ? 'Consulter le catalogue complet (10)' : 'Explore full catalog (10)'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <article
              key={book.id}
              className="bg-white border border-surface-border p-5 rounded-sm shadow-sm space-y-4 flex flex-col justify-between hover:border-gold-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-ink-400">
                  <span className="px-2 py-0.5 bg-surface-paper border border-surface-border text-navy-900 font-semibold rounded-sm">
                    {book.publish_date ? book.publish_date.substring(0, 4) : 'Treatise'}
                  </span>
                  <span>{book.publisher}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-navy-900 leading-snug">
                  {t(book.title, locale)}
                </h3>

                <p className="text-xs text-ink-700 leading-relaxed font-sans line-clamp-3">
                  {t(book.synopsis, locale)}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-ink-500">
                  {book.total_pages ? `${book.total_pages} pages` : 'Monograph'}
                </span>
                <Link
                  href={`/${locale}/books/${book.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-bronze-600 hover:text-navy-900"
                >
                  <span>{locale === 'fr' ? 'Détails' : 'Details'}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 6: OFFICIAL BIOS & PRESS KIT (OBAMA-STYLE EXECUTIVE BLOCK)
         ========================================================= */}
      <section aria-label={locale === 'fr' ? 'Kit Presse & Notices Officielles' : 'Press Kit & Official Bios'}>
        <PressBioCard locale={locale} />
      </section>

      {/* =========================================================
          SECTION 7: BILINGUAL INSTITUTIONAL ACRONYM GLOSSARY
         ========================================================= */}
      <section
        className="bg-white border border-surface-border p-6 sm:p-10 shadow-institutional space-y-6 rounded-sm"
        aria-label={locale === 'fr' ? 'Glossaire des Acronymes Institutionnels' : 'Institutional Acronym Glossary'}
      >
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr' ? 'RÉFÉRENTIEL INSTITUTIONNEL' : 'INSTITUTIONAL DIRECTORY'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'Glossaire des Institutions & Organismes de Référence'
              : 'Institutional Acronym & Mandates Glossary'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Guide de décryptage des institutions souveraines, régionales et multilatérales mentionnées dans cette biographie.'
              : 'Decoded guide to the sovereign ministries, regional bodies, and multilateral agencies referenced across this biography.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-navy-900 bg-surface-paper text-navy-900 font-serif">
                <th className="py-3 px-4 font-bold">{locale === 'fr' ? 'Sigle / Acronyme' : 'Acronym'}</th>
                <th className="py-3 px-4 font-bold">{locale === 'fr' ? 'Désignation Officielle' : 'Official Designation'}</th>
                <th className="py-3 px-4 font-bold">{locale === 'fr' ? 'Portée & Rôle Institutionnel' : 'Jurisdiction & Institutional Scope'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {acronymGlossary.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-light/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-navy-900 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-navy-900/5 border border-navy-900/10 rounded-sm">
                      {item.acronym}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-navy-900">
                    {t(item.name, locale)}
                  </td>
                  <td className="py-3 px-4 text-ink-700">
                    {t(item.scope, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          SECTION 8: INSTITUTIONAL PATHWAYS (CROSSWAYS HUB)
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

          {/* Card 2: Technical Pillars */}
          <Link
            href={`/${locale}/expertise`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Piliers d’Expertise' : 'Strategic Expertise'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Six domaines d’autorité : Trésor public, BVMAC, obligations vertes, audit judiciaire et mentorat d’élite.'
                  : 'Six core domains: PFM & TSA, regional capital markets (BVMAC), green bonds, and forensic diagnostics.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Voir l’Expertise' : 'Explore Pillars'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 3: Books */}
          <Link
            href={`/${locale}/books`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Traités & Ouvrages' : 'Monographic Books'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Catalogue des 10 traités scientifiques sur la criminalistique financière, la gouvernance bancaire et la dette souveraine.'
                  : 'Complete bibliography of 10 monographic volumes on forensic accounting, fraud symptoms, and capital markets.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Ouvrir le Catalogue' : 'View Library'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 4: Media & Speeches */}
          <Link
            href={`/${locale}/media`}
            className="group bg-surface-light border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Médias & Prises de Parole' : 'Media & Speeches'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Interventions télévisées, tribunes de presse, conférences internationales et keynotes diplomatiques.'
                  : 'Broadcast appearances, keynote addresses, editorial analyses, and international summit dialogues.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Accéder aux Médias' : 'Watch & Listen'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
