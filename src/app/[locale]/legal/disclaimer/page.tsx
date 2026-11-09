import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Scale,
  ShieldAlert,
  AlertOctagon,
  Coins,
  Lock,
  BookOpen,
  ArrowRight,
  Landmark,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import type { Locale } from '@/types/domain';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  const title =
    locale === 'fr'
      ? 'Charte d’Indépendance & Conformité Statutaire | Pr Kelly Mua Kingsly'
      : 'Statutory Independence & Ethics Charter | Professor Kelly Mua Kingsly';

  const description =
    locale === 'fr'
      ? 'Avertissement officiel sur la gouvernance, clause de non-affiliation et séparation stricte entre mandats souverains (MINFI, BEAC, ATIDI, COSUMAF) et publications universitaires.'
      : 'Official governance disclaimer, institutional non-affiliation clause, and sovereign firewall separating public treasury duties from private academic research.';

  return {
    title,
    description,
    keywords: [
      'Legal Disclaimer Kelly Kingsly',
      'MINFI Institutional Non Affiliation',
      'BEAC Central Bank Independence',
      'ATIDI Board Governance Independence',
      'Cameroon Public Sector Ethics Charter',
      'Public Financial Advice Disclaimer',
    ],
    alternates: {
      canonical: `/${locale}/legal/disclaimer`,
      languages: {
        en: '/en/legal/disclaimer',
        fr: '/fr/legal/disclaimer',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://kellykingsly.com/${locale}/legal/disclaimer`,
    },
  };
}

export default function LegalDisclaimerPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'fr' ? 'fr' : 'en';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
      {/* Header & Masthead */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900 text-gold-400 text-xs font-mono uppercase tracking-widest rounded-sm">
          <Scale className="w-3.5 h-3.5 text-gold-400" aria-hidden="true" />
          <span>
            {locale === 'fr'
              ? 'CONFORMITÉ DU SECTEUR PUBLIC, FIREWALL SOUVERAIN & CHARTE STATUTAIRE'
              : 'PUBLIC-SECTOR ETHICS, SOVEREIGN FIREWALL & STATUTORY CHARTER'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-900 leading-tight">
          {locale === 'fr'
            ? 'Charte d’Indépendance Institutionnelle, de Non-Affiliation & de Démarcation Auteur'
            : 'Charter of Institutional Independence, Non-Affiliation & Authorial Demarcation'}
        </h1>
        <p className="text-base sm:text-lg text-ink-700 leading-relaxed max-w-3xl pt-2">
          {locale === 'fr'
            ? 'La présente charte établit les règles de déontologie, de séparation institutionnelle et de neutralité régissant kellykingsly.com. En tant que haut fonctionnaire de l’État, président de conseil d’administration multilatéral et auteur universitaire, le Professeur Kelly Mua Kingsly maintient une frontière d’étanchéité absolue entre ses charges publiques, ses mandats intergouvernementaux et ses travaux académiques personnels.'
            : 'This charter establishes the strict legal, institutional, and commercial firewall governing kellykingsly.com. As a senior public official, multilateral board chairman, and academic author, Professor Kelly Mua Kingsly maintains an absolute institutional demarcation between official state treasury mandates, intergovernmental board duties, and his independent personal scholarship.'}
        </p>
      </div>

      {/* Main Charter Content */}
      <div className="bg-white border border-surface-border p-6 sm:p-10 shadow-institutional space-y-10 text-sm sm:text-base text-ink-700 leading-relaxed rounded-sm">
        {/* Article 1 */}
        <article id="article-1" className="space-y-3 pb-8 border-b border-surface-border">
          <div className="flex items-center gap-3 text-navy-900 font-serif font-bold text-xl sm:text-2xl">
            <ShieldAlert className="w-6 h-6 text-gold-600 shrink-0" aria-hidden="true" />
            <h2>
              {locale === 'fr'
                ? '1. Séparation Institutionnelle & Clause de Non-Affiliation'
                : '1. Institutional Independence & Non-Affiliation Firewall'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Ce site web (kellykingsly.com) est un répertoire académique et une plateforme de recherche économique et de doctrine exploités à titre personnel pour le Professeur Kelly Mua Kingsly. Il ne constitue en aucun cas un instrument de communication officiel, un journal légal ou un registre statutaire des entités suivantes :'
              : 'This platform (kellykingsly.com) is operated strictly in a personal scholarly capacity as an independent academic archive, research repository, and authorial forum. It does not represent an official communication instrument, gazette, or sovereign registry of the following institutions:'}
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-ink-800">
            <li>
              <strong>
                {locale === 'fr'
                  ? 'Ministère des Finances de la République du Cameroun (MINFI)'
                  : 'Ministry of Finance of the Republic of Cameroon (MINFI)'}
              </strong>{' '}
              {locale === 'fr'
                ? 'et la Direction des Opérations Financières de l’État (DOFE) ;'
                : 'and the Directorate of Finance Operations of the State (DOFE);'}
            </li>
            <li>
              <strong>
                {locale === 'fr'
                  ? 'Banque des États de l’Afrique Centrale (BEAC)'
                  : 'Bank of Central African States (BEAC)'}
              </strong>{' '}
              {locale === 'fr'
                ? 'et son Collège de Censure ;'
                : 'and its Supervisory Censorship College;'}
            </li>
            <li>
              <strong>
                {locale === 'fr'
                  ? 'Commission de Surveillance du Marché Financier de l’Afrique Centrale (COSUMAF) ;'
                  : 'Central African Financial Market Surveillance Commission (COSUMAF);'}
              </strong>
            </li>
            <li>
              <strong>
                {locale === 'fr'
                  ? 'Agence pour l’Assurance du Commerce en Afrique (ATIDI) ;'
                  : 'African Trade & Investment Development Insurance (ATIDI);'}
              </strong>
            </li>
            <li>
              <strong>
                {locale === 'fr'
                  ? 'Programme des Nations Unies pour le Développement (PNUD)'
                  : 'United Nations Development Programme (UNDP)'}
              </strong>{' '}
              {locale === 'fr'
                ? 'ou tout autre organe affilié au système des Nations Unies.'
                : 'or any affiliated United Nations organ.'}
            </li>
          </ul>
          <p className="text-xs sm:text-sm text-ink-600 italic pt-1">
            {locale === 'fr'
              ? 'Aucune analyse, publication ou prise de position sur ce site ne saurait engager la politique de l’État ou constituer une directive réglementaire opposable.'
              : 'No statement, treatise, or commentary published on this platform represents binding sovereign policy or official regulatory directives.'}
          </p>
        </article>

        {/* Article 2 */}
        <article id="article-2" className="space-y-3 pb-8 border-b border-surface-border">
          <div className="flex items-center gap-3 text-navy-900 font-serif font-bold text-xl sm:text-2xl">
            <AlertOctagon className="w-6 h-6 text-red-700 shrink-0" aria-hidden="true" />
            <h2>
              {locale === 'fr'
                ? '2. Exclusion de Conseil Financier, Juridique ou Fiduciaire'
                : '2. Exclusion of Fiduciary, Financial, Legal & Debt Advisory Services'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'L’ensemble des traités, modèles économétriques, chroniques financières et interventions publiques diffusés sur ce site le sont exclusivement à des fins d’enseignement académique, de recherche scientifique et de documentation publique. Bien que le Professeur Kingsly soit titulaire de la charte CFA (Chartered Financial Analyst) et docteur en administration des affaires :'
              : 'All treatises, econometric frameworks, policy briefs, and speeches published on this website are distributed exclusively for academic research, education, and public historical record. Despite Professor Kingsly’s professional credentials as a Chartered Financial Analyst (CFA) and public finance specialist:'}
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-ink-800">
            <li>
              {locale === 'fr'
                ? 'Les contenus de ce site ne constituent en aucune façon un conseil en investissement, une consultation fiscale, un avis juridique ou une recommandation de restructuration de dette souveraine.'
                : 'Content on this website does not constitute financial, investment, legal, tax, or sovereign debt restructuring advice.'}
            </li>
            <li>
              {locale === 'fr'
                ? 'Aucune relation fiduciaire ou contractuelle de conseil n’est créée entre la plateforme, l’auteur et les lecteurs, investisseurs ou institutions.'
                : 'No fiduciary or advisory relationship is created between Professor Kingsly, this platform, and any visiting reader, investor, or sovereign institution.'}
            </li>
            <li>
              {locale === 'fr'
                ? 'Les délégations institutionnelles et syndicats bancaires souhaitant solliciter l’État camerounais doivent impérativement s’adresser aux canaux diplomatiques et ministériels statutaires.'
                : 'Institutional delegations seeking sovereign transactional, regulatory, or bond underwriting guidance must engage designated statutory ministries through diplomatic protocol.'}
            </li>
          </ul>
        </article>

        {/* Article 3 */}
        <article id="article-3" className="space-y-3 pb-8 border-b border-surface-border">
          <div className="flex items-center gap-3 text-navy-900 font-serif font-bold text-xl sm:text-2xl">
            <Coins className="w-6 h-6 text-emerald-700 shrink-0" aria-hidden="true" />
            <h2>
              {locale === 'fr'
                ? '3. Isolation Financière des Ventes d’Ouvrages & Droits d’Auteur'
                : '3. Complete Isolation of Commercial Book Sales & Private Royalties'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Toutes les transactions commerciales relatives aux monographies et livres publiés (éditions numériques PDF/ePub directes ou liens de distribution vers Amazon, Barnes & Noble, Christian Faith Publishing et La Boutique Africa Vivre) relèvent de la propriété intellectuelle privée de l’auteur. Les droits d’auteur et revenus de diffusion sont strictement ségrégués des comptes du Trésor public et des ressources étatiques, dans le respect scrupuleux des lois sur l’éthique et la transparence des serviteurs de l’État.'
              : 'All commercial transactions relating to published books (including direct digital PDF/ePub fulfillment and third-party retail links to Amazon, Barnes & Noble, Christian Faith Publishing, and La Boutique Africa Vivre) are processed exclusively through private intellectual property channels. All royalties and digital revenues are fully segregated from public funds, state budgets, and sovereign treasury accounts, in rigorous adherence to public-sector ethics statutes.'}
          </p>
        </article>

        {/* Article 4 */}
        <article id="article-4" className="space-y-3 pb-8 border-b border-surface-border">
          <div className="flex items-center gap-3 text-navy-900 font-serif font-bold text-xl sm:text-2xl">
            <Lock className="w-6 h-6 text-navy-900 shrink-0" aria-hidden="true" />
            <h2>
              {locale === 'fr'
                ? '4. Confidentialité, Souveraineté des Données & Routage Protocolaire'
                : '4. Confidentiality, Data Sovereignty & Protocol Routing'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Les informations transmises via le secrétariat académique et protocolaire sont protégées par les normes de sécurité les plus rigoureuses et ne font l’objet d’aucune cession commerciale. Les correspondances soumises par ce portail ne valent pas signification d’acte de procédure ni notification administrative préalable au sens des textes régissant les marchés publics ou le contentieux de l’État. Les actes officiels doivent être déposés aux cabinets ministériels compétents.'
              : 'Information submitted through the protocol secretariat channel is treated with strict professional discretion and protected under modern data protection standards. Correspondence directed to this channel does not constitute official service of legal process or formal administrative petitioning to public ministries. Statutory correspondence intended for state departments must be delivered to their designated physical registries.'}
          </p>
        </article>

        {/* Article 5 */}
        <article id="article-5" className="space-y-3">
          <div className="flex items-center gap-3 text-navy-900 font-serif font-bold text-xl sm:text-2xl">
            <BookOpen className="w-6 h-6 text-bronze-600 shrink-0" aria-hidden="true" />
            <h2>
              {locale === 'fr'
                ? '5. Propriété Intellectuelle & Droit de Citation Scientifique'
                : '5. Intellectual Property & Academic Fair Use'}
            </h2>
          </div>
          <p>
            {locale === 'fr'
              ? 'Les monographies, traités, schémas conceptuels et grilles d’audit forensique présentés sur ce site sont protégés au titre du droit d’auteur international (Convention de Berne, OAPI). La citation courte à des fins d’enseignement, de recherche judiciaire ou de recension critique est encouragée, sous réserve de la mention explicite de l’auteur et de la référence bibliographique. Toute reproduction intégrale ou exploitation commerciale non autorisée demeure formellement prohibée.'
              : 'All original monographs, treatises, figures, econometric taxonomies, and editorial briefs are protected under national copyright statutes and international intellectual property conventions (OAPI / Berne Convention). Citation is permitted for academic, judicial, and journalistic research subject to standard scholarly attribution. Commercial reproduction or unauthorized syndication is prohibited.'}
          </p>
        </article>
      </div>

      {/* Institutional Gateway & Legal Hub Section */}
      <section aria-label="Legal Hub" className="space-y-6 pt-4">
        <div className="border-b border-surface-border pb-4 space-y-1">
          <div className="editorial-kicker">
            {locale === 'fr'
              ? 'RÉPERTOIRE DES TEXTES RÉGLEMENTAIRES & ACCÈS DIRECT'
              : 'STATUTORY DIRECTORY & COMPLIANCE GATEWAYS'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">
            {locale === 'fr'
              ? 'Consulter les Chartes Connexes & Registres Officiels'
              : 'Explore Companion Compliance Charters & Registries'}
          </h2>
          <p className="text-sm text-ink-600">
            {locale === 'fr'
              ? 'Accédez aux instruments contractuels de protection des données, conditions de vente et registre des mandats publics.'
              : 'Direct pathways to privacy protocols, digital purchase conditions, and the official register of sovereign offices.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gateway 1: Governance */}
          <Link
            href={`/${locale}/governance`}
            className="group bg-white border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Registre des Mandats' : 'Governance Register'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Répertoire des 20 mandats souverains, décrets ministériels et présidences de conseil.'
                  : 'Directory of 20 sovereign offices, ministerial decrees, and multilateral board chairmanships.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Voir les mandats' : 'Open Register'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Gateway 2: Privacy */}
          <Link
            href={`/${locale}/legal/privacy`}
            className="group bg-white border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Protection des Données' : 'Privacy Policy'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Traitement confidentiel des correspondances et conformité aux standards RGPD / OAPI.'
                  : 'Confidential handling of correspondence, cookie neutrality, and data sovereignty.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Lire la politique' : 'View Policy'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Gateway 3: Terms of Sale */}
          <Link
            href={`/${locale}/legal/terms`}
            className="group bg-white border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Conditions de Vente' : 'Terms of Sale'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Modalités de distribution des traités numériques, licences individuelles et facturation.'
                  : 'Direct digital book fulfillment terms, single-user licenses, and payment processing.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Consulter les CGV' : 'Review Terms'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>

          {/* Gateway 4: Protocol Contact */}
          <Link
            href={`/${locale}/contact`}
            className="group bg-white border border-surface-border p-5 space-y-3 flex flex-col justify-between hover:border-navy-900 hover:shadow-md transition-all rounded-sm"
          >
            <div className="space-y-2">
              <div className="p-2.5 bg-navy-900 text-gold-400 w-fit rounded-sm group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif font-bold text-base text-navy-900 group-hover:text-bronze-600 transition-colors">
                {locale === 'fr' ? 'Secrétariat Protocolaire' : 'Protocol Secretariat'}
              </h3>
              <p className="text-xs text-ink-700 leading-relaxed font-sans">
                {locale === 'fr'
                  ? 'Canal d’invitation pour conférences, collaborations universitaires et commandes d’ouvrages.'
                  : 'Official channel for international keynotes, academic research, and media requests.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-bronze-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{locale === 'fr' ? 'Ouvrir le formulaire' : 'Send Inquiry'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
