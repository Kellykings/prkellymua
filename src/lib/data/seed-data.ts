import type {
  Book,
  BlogPost,
  CareerEntry,
  EducationCredential,
  ExpertisePillar,
  MediaAppearance,
  GalleryPhotoItem,
  InstitutionalEvent,
} from '@/types/domain';

export const EXECUTIVE_PROFILE = {
  fullName: 'Professor Kelly Mua Kingsly',
  alternateName: 'Professor Kelly Mua Kingsley',
  honorifics: 'PhD · DBA · MPA · LL.M. · CFA · CFI · PMP',
  knighthood: {
    en: 'Knight of the Cameroon National Order of Valor',
    fr: 'Chevalier de l’Ordre National de la Valeur du Cameroun',
  },
  coordinates: {
    linkedIn: 'https://www.linkedin.com/in/kellykingsley',
    wikiGenius: 'https://wikigenius.org/wiki/Professor_Kelly_Mua_Kingsly',
    wikipedia: 'https://en.wikipedia.org/wiki/Kelly_Mua_Kingsly',
  },
  shortBio: {
    en: 'Professor Kelly Mua Kingsly (PhD, CFA) is a finance engineer, public finance executive, and climate finance specialist with more than twenty-five years of service spanning sovereign treasury administration, multilateral risk governance, and forensic accounting. He serves as Director of State Finance Operations at the Ministry of Finance of Cameroon, Chairman of the Board of Directors of the African Trade & Investment Development Insurance (ATIDI), and Senior Lecturer at the École Nationale d’Administration et de Magistrature (ENAM).',
    fr: 'Le Professeur Kelly Mua Kingsly (PhD, CFA) est un ingénieur financier, haut dirigeant des finances publiques et spécialiste de la finance climat comptant plus de vingt-cinq années de service au confluent de la trésorerie souveraine, de la gouvernance multilatérale des risques et de l’audit judiciaire. Il exerce les fonctions de Directeur des Opérations Financières de l’État au Ministère des Finances du Cameroun, Président du Conseil d’Administration de l’ATIDI et Enseignant-Chercheur à l’ENAM.',
  },
  fullBioParagraphs: [
    {
      en: 'Across more than two decades in public financial management, Professor Kingsly has overseen state finance operations, fiscal dashboard consolidation (TOFE), public debt structuring, and sovereign securities issuances (BTA/OTA). His regulatory service includes eight years as Cameroon’s Designated Institutional Representative to the Central African Financial Market Surveillance Commission (COSUMAF) and statutory central bank supervisory censor duties at the Bank of Central African States (BEAC).',
      fr: 'Depuis plus de deux décennies dans la gestion des finances publiques, le Professeur Kingsly supervise les opérations financières de l’État, la centralisation du Tableau des Opérations Financières de l’État (TOFE), la structuration de la dette publique et l’émission des titres souverains (BTA/OTA). Son service réglementaire comprend huit années en qualité de Représentant Institutionnel Désigné du Cameroun auprès de la COSUMAF et l’exercice du censorat statutaire à la Banque des États de l’Afrique Centrale (BEAC).',
    },
    {
      en: 'In international development, he completed nearly seventeen years of fiduciary leadership as Deputy Resident Representative for Operations with the United Nations Development Programme (UNDP). As Board Chair of ATIDI, he steers governance across a constituency of 24 sovereign African member states, presiding over commercial credit and political risk portfolios that have supported over $85 billion in trade and investment flows across the continent.',
      fr: 'Dans le champ du développement international, il a exercé près de dix-sept années de direction fiduciaire en tant que Représentant Résident Adjoint chargé des Opérations au Programme des Nations Unies pour le Développement (PNUD). En tant que Président du Conseil d’Administration d’ATIDI, il pilote la gouvernance d’une circonscription de 24 États membres souverains africains, supervisant des portefeuilles d’assurance-crédit commercial et d’assurance des risques politiques ayant mobilisé plus de 85 milliards de dollars d’échanges et d’investissements.',
    },
    {
      en: 'An alumnus of Harvard University’s John F. Kennedy School of Government (MPA) with doctorates in public policy and forensic accounting, Professor Kingsly has authored ten published monographic treatises on financial crime, fraud risk matrices, and public expenditure integrity. At ENAM in Yaoundé, he trains senior civil servants, state auditors, and financial magistrates in evidentiary rigor, public accounting ethics, and capital market stewardship.',
      fr: 'Diplômé de la John F. Kennedy School of Government de Harvard University (MPA) et titulaire de doctorats en politiques publiques et comptabilité judiciaire, le Professeur Kingsly est l’auteur de dix traités monographiques sur la criminalité financière, les matrices de risque de fraude et l’intégrité des dépenses publiques. À l’ENAM de Yaoundé, il forme hauts fonctionnaires, auditeurs d’État et magistrats financiers à la rigueur probatoire, à l’éthique de la comptabilité publique et aux marchés de capitaux.',
    },
  ],
  transversalCompetencies: [
    { en: 'Public Financial Management (PFM) & State TOFE', fr: 'Gestion des Finances Publiques (GFP) & TOFE' },
    { en: 'Emerging & Frontier Capital Markets (BVMAC / CEMAC)', fr: 'Marchés Financiers Émergents & Bourse BVMAC' },
    { en: 'Sovereign Debt Syndication & Securities (OTA / BTA)', fr: 'Émissions Obligataires Souveraines & Syndications' },
    { en: 'Multilateral Credit Guarantees & Risk Insurance', fr: 'Assurance-Crédit Multilatérale & Couverture des Risques' },
    { en: 'Climate Finance & Sovereign Green Bonds (UNDP-GEF)', fr: 'Finance Climat & Obligations Vertes Souveraines' },
    { en: 'Forensic Accounting & Anti-Corruption Diagnostics', fr: 'Comptabilité Judiciaire & Diagnostic Anti-Fraude' },
    { en: 'Cross-Border Investment Banking & Trade Finance', fr: 'Banque d’Investissement & Financement du Commerce' },
    { en: 'Digital Assets, AI & Distributed Ledger Governance', fr: 'Gouvernance des Actifs Numériques, IA & Blockchain' },
  ],
  certificationsList: [
    'Chartered Financial Analyst (CFA)',
    'Corporate Finance Institute (CFI)',
    'Project Management Professional (PMP)',
    'Certified Investigation Professional (ICFIP, 2014)',
    'Founding Fellow, International Institute of Forensic Accounts (IIFA)',
    'Founding Fellow, Institute of Forensic Accounting',
    'Certified Supply Chain Manager Level 2',
    'Executive Track: Data Science and Machine Learning',
    'Certified Human Resource Manager',
    'Business Tax Foundations',
    'Harvard Kennedy School: Financial Stewardship for NGOs',
  ],
  honorsList: [
    { en: 'Knight of the Cameroon National Order of Valor (Chevalier de l’Ordre National de la Valeur)', fr: 'Chevalier de l’Ordre National de la Valeur du Cameroun' },
    { en: 'Award for Meritorious Services — United Nations Development Programme (UNDP)', fr: 'Prix pour Services Méritoires — Programme des Nations Unies pour le Développement (PNUD)' },
    { en: 'Founding Fellow — International Institute of Forensic Accounts (IIFA)', fr: 'Membre Fondateur Émérite — International Institute of Forensic Accounts (IIFA)' },
    { en: 'Founding Fellow — Institute of Forensic Accounting', fr: 'Membre Fondateur Émérite — Institute of Forensic Accounting' },
    { en: 'National Award of Public Service Excellence', fr: 'Prix National d’Excellence de la Fonction Publique' },
  ],
};

export const CAREER_ENTRIES: CareerEntry[] = [
  {
    id: 'career-1',
    organization: {
      en: 'Ministry of Finance, Republic of Cameroon (MINFI)',
      fr: 'Ministère des Finances, République du Cameroun (MINFI)',
    },
    role_title: {
      en: 'Director of Finance Operations of the State',
      fr: 'Directeur des Opérations Financières de l’État',
    },
    category: 'sovereign',
    period: '2016 – Present',
    tenure_note: '10+ years · Mars 2016 – En fonction',
    is_current: true,
    location: 'Yaoundé, Cameroon',
    description: {
      en: 'Directs sovereign financial operations, state revenue and expenditure monitoring, the financial operations dashboard (TOFE), debt evaluations, and government bond syndications on regional capital markets.',
      fr: 'Dirige les opérations financières de l’État, le suivi des recettes et dépenses publiques, le tableau des opérations financières (TOFE), l’évaluation de la dette et les syndications obligataires sur le marché des capitaux.',
    },
    highlights: [
      {
        en: 'Comprehensive design and monitoring of state revenue and expenditure execution across all ministerial portfolios.',
        fr: 'Conception et pilotage des stratégies de suivi des recettes et des dépenses d’exécution du budget de l’État.',
      },
      {
        en: 'Elaboration and centralization of the State Financial Operations Dashboard (TOFE) and summary financial positions.',
        fr: 'Élaboration et centralisation du Tableau des Opérations Financières de l’État (TOFE) et de la situation résumée du Trésor.',
      },
      {
        en: 'Downstream structuring and execution of sovereign securities transmissions, Treasury bills (BTA), and sovereign bonds (OTA).',
        fr: 'Structuration et suivi des émissions de titres publics (BTA) et d’obligations du Trésor (OTA) par adjudication et syndication.',
      },
      {
        en: 'Evaluation of outstanding liabilities, public enterprise restructuring, and follow-up of State equity participations.',
        fr: 'Évaluation des dettes croisées des organismes publics et suivi des participations financières de l’État.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Statutory public-sector executive appointment · Decree Ref. MINFI',
      fr: 'Nomination statutaire de la fonction publique · Décret Ministériel MINFI',
    },
    official_reference: 'MINFI/DGTFM Decree Ref. 2024',
    decree_reference: 'Presidential Decree / MINFI Statutory Executive Appointment',
    evidence_url: 'https://minfi.gov.cm',
  },
  {
    id: 'career-2',
    organization: {
      en: 'African Trade & Investment Development Insurance (ATIDI)',
      fr: 'Agence pour l’Assurance du Commerce en Afrique (ATIDI)',
    },
    role_title: {
      en: 'Chairman of the Board of Directors',
      fr: 'Président du Conseil d’Administration',
    },
    category: 'multilateral',
    period: '2024 – Present',
    tenure_note: '2+ years · Octobre 2024 – En fonction',
    is_current: true,
    location: 'Nairobi, Kenya (Pan-African Sovereign Mandate)',
    description: {
      en: 'Provides strategic board leadership across 24 African sovereign member states, presiding over the 2024–2027 strategic plan, governance committees, and multilateral underwriting of trade credit and political risk insurance.',
      fr: 'Assure la présidence stratégique du Conseil d’Administration auprès de 24 États souverains membres, pilotant le plan stratégique 2024–2027, les comités de gouvernance et la souscription multilatérale d’assurance-crédit et de risques politiques.',
    },
    highlights: [
      {
        en: 'Presiding over board agendas, strategic capital adequacy priorities, and institutional performance.',
        fr: 'Présidence des réunions du Conseil, fixation des priorités stratégiques de solvabilité et création de valeur.',
      },
      {
        en: 'Supervising continental underwriting portfolios that have mobilized over $85B in cumulative trade and investment flows.',
        fr: 'Supervision des portefeuilles de souscription ayant mobilisé plus de 85 milliards de dollars de flux commerciaux et d’investissements.',
      },
      {
        en: 'Upholding international investment-grade credit ratings (S&P, Moody’s) and ESG underwriting frameworks.',
        fr: 'Maintien des notations souveraines investment-grade (S&P, Moody’s) et des normes de souscription ESG.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Multilateral sovereign constituency election · ATIDI Constituent Treaty Charter',
      fr: 'Élection par les États membres souverains · Traité constitutif multilatéral ATIDI',
    },
    official_reference: 'ATIDI Board Directory',
    decree_reference: 'ATIDI Constituent Treaty Charter',
    evidence_url: 'https://www.atidi.africa/about-us/board-of-directors/',
  },
  {
    id: 'career-3',
    organization: {
      en: 'ATIDI (African Trade & Investment Development Insurance)',
      fr: 'Agence pour l’Assurance du Commerce en Afrique (ATIDI)',
    },
    role_title: {
      en: 'Board Director (Non-Executive)',
      fr: 'Administrateur au Conseil d’Administration',
    },
    category: 'multilateral',
    period: '2023 – 2024',
    tenure_note: '1 year 5 months · Juin 2023 – Octobre 2024',
    is_current: false,
    location: 'Nairobi, Kenya',
    description: {
      en: 'Delivered governance oversight, financial performance reviews, and sovereign risk mitigation policy decisions across member nations.',
      fr: 'A assuré la gouvernance d’entreprise, la surveillance de la performance financière et la validation des politiques d’atténuation des risques souverains.',
    },
    highlights: [
      {
        en: 'Strategic decisions regarding corporate vision, long-term solvency, and compliance with multilateral insurance treaties.',
        fr: 'Décisions stratégiques relatives à la solvabilité à long terme et à la conformité aux traités d’assurance multilatérale.',
      },
      {
        en: 'Review of audited financial statements, enterprise risk frameworks, and executive leadership assessments.',
        fr: 'Examen des états financiers audités, du cadre de gestion des risques d’entreprise et évaluation des dirigeants.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Multilateral Board Governance Record · ATIDI Board of Directors Register',
      fr: 'Registre de gouvernance multilatérale · Conseil d’Administration ATIDI',
    },
    official_reference: 'ATIDI Board Governance Directory',
    evidence_url: 'https://www.atidi.africa',
  },
  {
    id: 'career-4',
    organization: {
      en: 'Global Banking & Markets (GBM)',
      fr: 'Global Banking & Markets (GBM)',
    },
    role_title: {
      en: 'Founding Member of the Board of Directors',
      fr: 'Membre Fondateur du Conseil d’Administration',
    },
    category: 'advisory',
    period: '2026 – Present',
    tenure_note: 'Founding Mandate · Juillet 2026 – En fonction',
    is_current: true,
    location: 'International / Global',
    description: {
      en: 'Provides strategic leadership to a premier international platform uniting finance ministers, central bank governors, multilateral development banks, institutional investors, and market regulators to deepen global banking and capital markets.',
      fr: 'Apporte son leadership stratégique à une plateforme internationale d’élite réunissant ministres des finances, gouverneurs de banques centrales, banques de développement, investisseurs institutionnels et régulateurs pour moderniser les marchés de capitaux mondiaux.',
    },
    highlights: [
      {
        en: 'Fosters collaboration on sovereign financing, debt capital markets, investment banking, syndicated lending, and digital banking.',
        fr: 'Promotion des partenariats en matière de financement souverain, marchés de capitaux de dette, prêts syndiqués et banque numérique.',
      },
      {
        en: 'Facilitates executive dialogues between sovereign issuers, development finance institutions, and private global syndicates.',
        fr: 'Animation du dialogue de haut niveau entre émetteurs souverains, institutions de financement du développement et investisseurs privés.',
      },
      {
        en: 'Advocates for sound governance, regulatory harmonization, financial innovation, and ESG/climate finance international best practices.',
        fr: 'Promotion de la gouvernance éthique, de l’harmonisation réglementaire et des meilleures pratiques en finance climat/ESG.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Global Institutional Board Charter · International Financial Community Platform',
      fr: 'Charte institutionnelle internationale · Plateforme des Marchés Financiers Mondiaux',
    },
  },
  {
    id: 'career-5',
    organization: {
      en: 'Good Neighborhood Commerce Institute (GNCI)',
      fr: 'Good Neighborhood Commerce Institute (GNCI)',
    },
    role_title: {
      en: 'Chief Financial Strategic Advisor & Non-Executive Board Director',
      fr: 'Conseiller Stratégique Financier en Chef & Administrateur Non-Exécutif',
    },
    category: 'advisory',
    period: '2026 – Present',
    tenure_note: 'Février 2026 – En fonction',
    is_current: true,
    location: 'United States',
    description: {
      en: 'Provides independent financial leadership, capital structuring, blended finance advisory, and fiduciary governance oversight to empower underserved communities through entrepreneurship and capital access.',
      fr: 'Apporte un leadership financier indépendant, une expertise en structuration de capital et en finance mixte pour soutenir l’entrepreneuriat et l’inclusion économique des communautés mal desservies.',
    },
    highlights: [
      {
        en: 'Guides financial strategy, blended finance structuring, and fundraising frameworks aligning donors with impact investments.',
        fr: 'Conseil en stratégie financière, finance mixte et mobilisation de capitaux d’impact auprès des donateurs institutionnels.',
      },
      {
        en: 'Maintains independent fiduciary oversight without operational involvement, ensuring institutional credibility and transparency.',
        fr: 'Supervision fiduciaire et éthique indépendante garantissant la transparence institutionnelle et la rigueur d’allocation.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'US Non-Executive Board Appointment · GNCI Governance Charter',
      fr: 'Mandat d’administrateur non-exécutif · Charte de gouvernance GNCI',
    },
  },
  {
    id: 'career-6',
    organization: {
      en: 'UNDP-GEF Global ABS Project / Resilient Debt Platform',
      fr: 'Initiative Mondiale sur les Obligations Vertes / Plateforme Dette Résiliente (PNUD-FEM)',
    },
    role_title: {
      en: 'Designated National Authority & Strategic Coordinator',
      fr: 'Autorité Nationale Désignée & Coordonnateur Stratégique',
    },
    category: 'multilateral',
    period: '2024 – Present',
    tenure_note: '2+ years · Mai 2024 – En fonction',
    is_current: true,
    location: 'New York, US / Yaoundé, Cameroon',
    description: {
      en: 'Leads sovereign green bond advocacy, sustainable finance taxonomy harmonization, and debt resilience frameworks in partnership with UNDP and the Global Environment Facility (GEF).',
      fr: 'Pilote le plaidoyer pour les obligations vertes souveraines, l’harmonisation des taxonomies de finance durable et les cadres de résilience de la dette avec le PNUD et le FEM.',
    },
    highlights: [
      {
        en: 'Advocating for green bond adoption, sustainable sovereign finance standards, and climate-friendly capital expenditure.',
        fr: 'Plaidoyer pour l’adoption des obligations vertes et le financement d’investissements résilients au changement climatique.',
      },
      {
        en: 'Developing policy frameworks supporting the issuance of environmental and biodiversity debt instruments.',
        fr: 'Élaboration de cadres politiques et réglementaires facilitant l’émission de titres souverains à impact écologique.',
      },
      {
        en: 'Conducting institutional capacity-building workshops on debt resilience for public sector financial executives.',
        fr: 'Organisation de sessions de renforcement des capacités pour les cadres des ministères des finances et banques centrales.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Multilateral climate finance designation · UNDP-GEF Focal Authority',
      fr: 'Désignation multilatérale en finance durable · Autorité focale PNUD-FEM',
    },
    official_reference: 'UNDP PFM Climate Project Register',
    evidence_url: 'https://www.undp.org',
  },
  {
    id: 'career-7',
    organization: {
      en: 'COSUMAF (Central African Financial Market Supervisory Commission)',
      fr: 'COSUMAF (Commission de Surveillance du Marché Financier de l’Afrique Centrale)',
    },
    role_title: {
      en: 'Designated Institutional Representative of Cameroon',
      fr: 'Représentant Institutionnel Désigné de la République du Cameroun',
    },
    category: 'sovereign',
    period: '2016 – 2024',
    tenure_note: '8 years 1 month · Septembre 2016 – Septembre 2024',
    is_current: false,
    location: 'Libreville, Gabon / CEMAC Zone',
    description: {
      en: 'Represented the State of Cameroon on the regional market supervisory board, safeguarding public savings, overseeing the unified BVMAC stock exchange, and regulating financial intermediaries across six CEMAC nations.',
      fr: 'A représenté l’État du Cameroun au collège de surveillance du marché financier régional, veillant à la protection de l’épargne, à la régulation de la BVMAC et au contrôle des intermédiaires agréés dans les six pays de la CEMAC.',
    },
    highlights: [
      {
        en: 'Regulatory supervision of public offerings, market intermediaries, stockbrokers, and the Central Depository.',
        fr: 'Supervision réglementaire des offres publiques, des sociétés de bourse et du Dépositaire Central régional.',
      },
      {
        en: 'Harmonization of the regional CEMAC financial market following the landmark merger of the Douala and Libreville stock exchanges.',
        fr: 'Harmonisation du marché financier régional consécutive à la fusion historique des bourses de Douala et Libreville.',
      },
      {
        en: 'Oversight of collective investment undertakings (OPCVM) and investor disclosure compliance.',
        fr: 'Contrôle des organismes de placement collectif (OPCVM) et de la transparence de l’information financière.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'CEMAC Regional Regulatory Protocol · Formal Sovereign Appointment',
      fr: 'Protocole réglementaire CEMAC · Décret officiel de nomination de l’État',
    },
    official_reference: 'COSUMAF Protocol Ref. CEMAC',
    decree_reference: 'CEMAC Treaty Protocol Appointment',
    evidence_url: 'https://www.cosumaf.org',
  },
  {
    id: 'career-8',
    organization: {
      en: 'BEAC / CPC-TP (Bank of Central African States)',
      fr: 'BEAC / CPC-TP (Banque des États de l’Afrique Centrale)',
    },
    role_title: {
      en: 'Supervisory Censor & Public Securities Oversight Member',
      fr: 'Censeur & Suivi des Émissions de Titres Publics',
    },
    category: 'sovereign',
    period: '2016 – 2024',
    tenure_note: '8 years · Fiduciary Central Bank Surveillance',
    is_current: false,
    location: 'Yaoundé / CEMAC Sub-Region',
    description: {
      en: 'Executed central bank fiduciary surveillance, sovereign liquidity alignment, and public securities auction oversight across regional financial institutions.',
      fr: 'A exercé les missions de surveillance fiduciaire auprès de la banque centrale, le suivi de la liquidité souveraine et des adjudications de titres publics du Trésor.',
    },
    highlights: [
      {
        en: 'Verification of state liquidity reserve balances and reconciliation of monetary accounts with central bank vaults.',
        fr: 'Contrôle des réserves de liquidité de l’État et réconciliation des comptes monétaires du Trésor à la banque centrale.',
      },
      {
        en: 'Monitoring primary dealer network (SVT) subscriptions and secondary market liquidity depth for government paper.',
        fr: 'Suivi des souscriptions du réseau des Spécialistes en Valeurs du Trésor (SVT) et de la liquidité sur le marché secondaire.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Central Bank Fiduciary Protocol · BEAC Statutory Register',
      fr: 'Protocole de surveillance fiduciaire · Registre statutaire BEAC',
    },
    official_reference: 'BEAC CPC-TP Statutory Register',
    evidence_url: 'https://www.beac.int',
  },
  {
    id: 'career-9',
    organization: {
      en: 'Ministry of Finance — General Directorate of Treasury, Monetary and Financial Cooperation',
      fr: 'Ministère des Finances — Direction Générale du Trésor et de la Coopération Financière et Monétaire',
    },
    role_title: {
      en: 'Strategic Advisor to the General Directorate',
      fr: 'Conseiller Stratégique auprès de la Direction Générale',
    },
    category: 'sovereign',
    period: '2014 – 2024',
    tenure_note: '10 years 3 months · Juillet 2014 – Septembre 2024',
    is_current: false,
    location: 'Yaoundé, Cameroon',
    description: {
      en: 'Coordinated multidisciplinary professional teams, program budgeting execution, complex financial systems design, import/export license monetization, and multilateral negotiations with the IMF, CEMAC, and international partners.',
      fr: 'A coordonné des équipes pluridisciplinaires, la réforme du budget-programme, la conception d’outils de monétisation des licences d’import/export et les négociations multilatérales avec le FMI et la CEMAC.',
    },
    highlights: [
      {
        en: 'Designed complex operational financial systems cutting down government operational expenditure overheads.',
        fr: 'Conception de systèmes financiers automatisés ayant considérablement réduit les dépenses opérationnelles de l’État.',
      },
      {
        en: 'Created an import/export license monetization tool reducing sovereign transaction costs.',
        fr: 'Conception d’un mécanisme de valorisation des licences du commerce extérieur réduisant les coûts de transaction.',
      },
      {
        en: 'Diplomatic engagement with donor institutions on regional franc zone monetary policy and anti-money laundering investigations.',
        fr: 'Négociations monétaires avec les bailleurs internationaux et collaboration étroite dans la lutte contre la criminalité financière.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'General Directorate of Treasury Statutory Advisory Record',
      fr: 'Dossier de fonction statutaire · Direction Générale du Trésor',
    },
  },
  {
    id: 'career-10',
    organization: {
      en: 'United Nations Development Programme (UNDP)',
      fr: 'Programme des Nations Unies pour le Développement (PNUD)',
    },
    role_title: {
      en: 'Deputy Resident Representative for Operations (DRR/O)',
      fr: 'Représentant Résident Adjoint chargé des Opérations',
    },
    category: 'multilateral',
    period: '2008 – 2024',
    tenure_note: '16 years 9 months · Janvier 2008 – Septembre 2024',
    is_current: false,
    location: 'United Nations System / Country Offices',
    description: {
      en: 'Directed country-level operations, budget management, IPSAS compliance, human resources, procurement integrity, ICT infrastructure, and UN common services administration across multi-donor programs.',
      fr: 'A dirigé les opérations pays, la gestion budgétaire, la conformité aux normes IPSAS, les ressources humaines, l’intégrité des achats et l’administration des services communs du système des Nations Unies.',
    },
    highlights: [
      {
        en: 'Full fiduciary accountability for multi-million dollar donor development portfolios and programmatic delivery.',
        fr: 'Responsabilité fiduciaire totale des portefeuilles de développement multi-bailleurs et de l’exécution des programmes.',
      },
      {
        en: 'Implementation of Minimum Operating Residential Security Standards (MORSS) and comprehensive operational risk mitigation.',
        fr: 'Mise en œuvre des normes de sécurité MORSS et gestion globale des risques opérationnels en environnement complexe.',
      },
      {
        en: 'Establishment of inter-agency UN common services, supply chain optimization, and IPSAS accounting convergence.',
        fr: 'Mise en place de services communs inter-agences ONU, optimisation logistique et clôture rigoureuse des comptes IPSAS.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'United Nations Diplomatic & Operations Record · Award for Meritorious Service',
      fr: 'Dossier diplomatique et opérationnel de l’ONU · Prix pour services méritoires',
    },
  },
  {
    id: 'career-11',
    organization: {
      en: 'African Development Bank (AfDB / BAD)',
      fr: 'Banque Africaine de Développement (BAD)',
    },
    role_title: {
      en: 'Senior Project Coordinator & Financial Consultant',
      fr: 'Coordonnateur Principal de Projet & Consultant Financier',
    },
    category: 'multilateral',
    period: '2014 – Present',
    tenure_note: '12+ years · Janvier 2014 – En fonction',
    is_current: true,
    location: 'Abidjan, Côte d’Ivoire / Regional Operations',
    description: {
      en: 'Oversees forecasting, annual budgeting, variance analysis, financial reporting, and operational audits for major regional development financing interventions.',
      fr: 'Supervise la prévision budgétaire, l’analyse des écarts, le contrôle financier et les audits opérationnels de projets de développement structurants.',
    },
    highlights: [
      {
        en: 'Prepares multi-year project budget schedules and implements corrective fiduciary actions.',
        fr: 'Élaboration des budgets pluriannuels de projets et mise en œuvre des plans d’actions correctifs.',
      },
      {
        en: 'Enforces AfDB fiduciary and procurement standards across executing project implementation units.',
        fr: 'Application stricte des règles fiduciaires et d’acquisitions de la BAD au sein des unités de gestion de projets.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'AfDB Institutional Consultancy & Project Supervision Portfolio',
      fr: 'Mandat d’expertise et de coordination fiduciaire · Banque Africaine de Développement',
    },
  },
  {
    id: 'career-12',
    organization: {
      en: 'École Nationale d’Administration et de Magistrature (ENAM)',
      fr: 'École Nationale d’Administration et de Magistrature (ENAM)',
    },
    role_title: {
      en: 'Senior Lecturer in Public Finance & Forensic Accounting',
      fr: 'Enseignant-Chercheur en Finances Publiques & Audit Judiciaire',
    },
    category: 'academic',
    period: '2022 – Present',
    tenure_note: '4+ years · Juin 2022 – En fonction',
    is_current: true,
    location: 'Yaoundé, Cameroon',
    description: {
      en: 'Trains senior civil servants, state auditors, and financial magistrates in public financial management, forensic auditing, fraud detection, and capital markets.',
      fr: 'Forme les magistrats financiers, inspecteurs d’État et hauts cadres administratifs aux finances publiques, à l’audit judiciaire et à la détection de la fraude.',
    },
    highlights: [
      {
        en: 'Supervises graduate dissertations and applied policy research on CEMAC fiscal reform and anti-corruption diagnostics.',
        fr: 'Direction de mémoires et de travaux de recherche appliquée sur la modernisation fiscale CEMAC et la détection des fraudes.',
      },
      {
        en: 'Delivers high-level pedagogic modules on judicial evidentiary chains of custody and digital fraud analytics.',
        fr: 'Dispense de cours magistraux sur la chaîne de preuve en audit judiciaire et la criminalistique financière.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Academic Faculty Appointment · ENAM Faculty of Administration',
      fr: 'Corps professoral académique · Faculté d’Administration de l’ENAM',
    },
    official_reference: 'ENAM Magistracy Academic Register',
    decree_reference: 'ENAM Academic Faculty Board Decree',
    evidence_url: 'https://www.enam.cm',
  },
  {
    id: 'career-13',
    organization: {
      en: 'Copperstone University',
      fr: 'Université Copperstone',
    },
    role_title: {
      en: 'Professor of Forensic Finance & Audits',
      fr: 'Professeur de Finance Forensique & Audit',
    },
    category: 'academic',
    period: '2018 – Present',
    tenure_note: '8+ years · Mars 2018 – En fonction',
    is_current: true,
    location: 'Namibia / International',
    description: {
      en: 'Curriculum design, postgraduate research supervision, and publishing in peer-reviewed journals on financial forensics, behavioral finance, and cybersecurity intersectionality.',
      fr: 'Conception des cursus doctoraux, direction de recherche et publications scientifiques sur la criminalistique financière, la finance comportementale et la cybersécurité.',
    },
    highlights: [
      {
        en: 'Publishes pioneering findings in international journals, collaborating with law enforcement on anti-fraud methodologies.',
        fr: 'Publication de recherches de référence et collaboration avec les corps d’investigation sur les fraudes complexes.',
      },
      {
        en: 'Engages with policymakers to advocate for modern laws enhancing financial crime prevention and corporate accountability.',
        fr: 'Plaidoyer auprès des régulateurs pour l’actualisation des lois de lutte contre la délinquance économique.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Academic Professorial Chair Appointment · University Senate',
      fr: 'Chaire professorale académique · Sénat Universitaire Copperstone',
    },
  },
  {
    id: 'career-14',
    organization: {
      en: 'Quantum Blockchain Capital / QNTBC',
      fr: 'Quantum Blockchain Capital / QNTBC',
    },
    role_title: {
      en: 'Board Director & Strategic Financial Advisor',
      fr: 'Administrateur au Conseil & Conseiller Financier Stratégique',
    },
    category: 'advisory',
    period: '2017 – Present',
    tenure_note: '9+ years · Juin 2017 – En fonction',
    is_current: true,
    location: 'Boston, Massachusetts / Minnesota, United States',
    description: {
      en: 'Provides corporate governance, fiduciary audit, mission determination, and risk assessment for emerging blockchain architectures and quantum computing financial infrastructure.',
      fr: 'Assure la gouvernance d’entreprise, la surveillance fiduciaire et l’évaluation des risques technologiques pour les infrastructures financières blockchain et quantiques.',
    },
    highlights: [
      {
        en: 'Assessing technological vulnerabilities, market volatility, and cybersecurity governance in decentralized capital systems.',
        fr: 'Évaluation des vulnérabilités technologiques, de la volatilité des marchés et des politiques de cybersécurité.',
      },
      {
        en: 'Ensuring strict compliance with regulatory standards and legal ethics in advanced financial technology deployments.',
        fr: 'Supervision de la conformité réglementaire et de l’intégrité éthique des applications fintech émergentes.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Corporate Board of Directors Register · Boston & Minnesota',
      fr: 'Registre du Conseil d’Administration · Boston & Minnesota, États-Unis',
    },
  },
  {
    id: 'career-15',
    organization: {
      en: 'OAPAP (African Organization for Public Administration Performance)',
      fr: 'OAPAP (Organisation Africaine pour la Performance des Administrations Publiques)',
    },
    role_title: {
      en: 'Central Technical Advisory Council Member',
      fr: 'Membre du Conseil Technique Central',
    },
    category: 'academic',
    period: '2020 – Present',
    tenure_note: '6+ years · Janvier 2020 – En fonction',
    is_current: true,
    location: 'Yaoundé, Cameroon',
    description: {
      en: 'Multidisciplinary voluntary initiative founded by alumni of ISMP, IRIC, and ENAM working tirelessly to enhance the performance and ethical standards of African public administrations.',
      fr: 'Initiative panafricaine fondée par les diplômés de l’ISMP, de l’IRIC et de l’ENAM œuvrant pour l’accroissement de la performance et de l’éthique des administrations publiques africaines.',
    },
    highlights: [
      {
        en: 'Formulating administrative modernization toolkits and public expenditure tracking indicators.',
        fr: 'Élaboration de guides de modernisation administrative et d’indicateurs d’efficacité de la dépense publique.',
      },
      {
        en: 'Promoting meritocracy, transparent civil service governance, and capacity building for local collectivities.',
        fr: 'Promotion de la méritocratie, de la transparence administrative et du renforcement des collectivités territoriales.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Pan-African Public Administration Technical Council',
      fr: 'Conseil technique panafricain d’expertise publique',
    },
  },
  {
    id: 'career-16',
    organization: {
      en: 'Prima Finance and Investments (PRIMA MFI Plc)',
      fr: 'Prima Finance and Investment (PRIMA MFI Plc)',
    },
    role_title: {
      en: 'Board President & Founder',
      fr: 'Président du Conseil & Fondateur',
    },
    category: 'advisory',
    period: '2019 – 2024',
    tenure_note: '5 years · Janvier 2019 – Janvier 2024',
    is_current: false,
    location: 'Yaoundé, Cameroon / United States',
    description: {
      en: 'Founded and presided over a licensed Category II microfinance institution, introducing digital microfinance products to solve financial exclusion and expand borrowing access for SMEs.',
      fr: 'A fondé et présidé un établissement de microfinance de 2ème catégorie agréé, introduisant des solutions numériques pour lutter contre l’exclusion financière et financer les PME.',
    },
    highlights: [
      {
        en: 'Pioneered proprietary credit underwriting technologies addressing SME capital scarcity in Central Africa.',
        fr: 'Pionnier dans le déploiement de technologies de crédit inclusif adaptées aux micro-entrepreneurs d’Afrique centrale.',
      },
      {
        en: 'Integrated community financial education programs into credit delivery architectures.',
        fr: 'Intégration de programmes d’éducation financière et d’accompagnement éthique des emprunteurs.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Licensed Category II Microfinance Institution Regulatory Charter · COBAC / MINFI',
      fr: 'Agrément réglementaire d’Établissement de Microfinance 2e Catégorie · COBAC / MINFI',
    },
  },
  {
    id: 'career-17',
    organization: {
      en: 'RECO Foundation',
      fr: 'Fondation RECO',
    },
    role_title: {
      en: 'Founder & Executive Board Chair',
      fr: 'Fondateur & Président',
    },
    category: 'advisory',
    period: '2015 – Present',
    tenure_note: '11+ years · Février 2015 – En fonction',
    is_current: true,
    location: 'Centre Region, Cameroon',
    description: {
      en: 'Directs community social impact initiatives, youth education bursaries, and ethical leadership programs in public administration and civic responsibility.',
      fr: 'Dirige des initiatives philanthropiques d’impact communautaire, de bourses d’études et de formation au leadership éthique pour la jeunesse.',
    },
    highlights: [
      {
        en: 'Endowing student fellowships for outstanding scholars in public finance and forensic law.',
        fr: 'Financement de bourses académiques pour les étudiants méritants en finances publiques et en droit.',
      },
      {
        en: 'Hosting annual civic workshops on anti-fraud awareness and integrity in public service.',
        fr: 'Organisation de séminaires citoyens sur l’intégrité républicaine et la prévention de la corruption.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Non-Profit Civic Foundation Charter',
      fr: 'Statuts officiels de fondation d’utilité sociale',
    },
  },
  {
    id: 'career-18',
    organization: {
      en: 'Ministry of Finance — Buea Regional Treasury & Kumba Divisional Treasury',
      fr: 'Ministère des Finances — Trésorerie Régionale de Buea & Trésorerie Départementale de Kumba',
    },
    role_title: {
      en: 'Chief of Accounts, Expenditure, Deposits & Consignments / Divisional Treasurer a.i.',
      fr: 'Chef de Service Comptabilité, Dépenses, Dépôts & Consignations / Trésorier Départemental p.i.',
    },
    category: 'sovereign',
    period: '2006 – 2009',
    tenure_note: '3 years · Mars 2006 – Janvier 2009',
    is_current: false,
    location: 'Buea / Kumba, South West Region, Cameroon',
    description: {
      en: 'Administered territorial public treasury operations, daily cash provision controls, purchase order and voucher verification, and management accounts production.',
      fr: 'A géré les opérations comptables du Trésor territorial, le contrôle des caisses, le visa des bons d’engagement et la production des comptes de gestion.',
    },
    highlights: [
      {
        en: 'Daily control of cash provisions, liquidity forecasts, and processing of state payment vouchers.',
        fr: 'Contrôle quotidien des approvisionnements de caisse, prévisions de liquidité et visa des ordres de paiement.',
      },
      {
        en: 'Served as focal point for forestry revenue collection, PATRIOT tax deployment, and local procurement commission (CRC).',
        fr: 'Point focal pour le recouvrement des taxes forestières, le déploiement PATRIOT et la commission locale des marchés.',
      },
      {
        en: 'Trained newly inducted public accounting officers in statutory ledger reconciliation.',
        fr: 'Encadrement et formation pratique des nouveaux commis et inspecteurs aux écritures du Trésor public.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Territorial Public Treasury Administrative Record · MINFI',
      fr: 'Dossier de carrière Trésor Public territorial · MINFI',
    },
  },
  {
    id: 'career-19',
    organization: {
      en: 'Ministry of Economy and Finance',
      fr: 'Ministère de l’Économie et des Finances',
    },
    role_title: {
      en: 'Inspector-Auditor (Inspecteur Vérificateur)',
      fr: 'Inspecteur Vérificateur',
    },
    category: 'sovereign',
    period: '2007 – 2008',
    tenure_note: '2 years · Janvier 2007 – Décembre 2008',
    is_current: false,
    location: 'Yaoundé / Centre Region, Cameroon',
    description: {
      en: 'Conducted unannounced financial inspections, regularity controls, and management account audits across public organizations and territorial services.',
      fr: 'A conduit des vérifications inopinées, des contrôles de régularité et des audits de comptes de gestion auprès des administrations publiques.',
    },
    highlights: [
      {
        en: 'Conformity investigations, physical cash verification, and forensic scrutiny of public deposits.',
        fr: 'Vérifications de conformité légale, audits physiques de caisses et contrôle des dépôts et consignations.',
      },
      {
        en: 'Production of statutory investigative audit reports for ministerial review.',
        fr: 'Rédaction des rapports d’inspection et des constats d’anomalies pour la hiérarchie ministérielle.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'General Inspectorate of Finance Statutory Inspection Record',
      fr: 'Registre des missions de contrôle · Inspection Générale des Finances',
    },
  },
  {
    id: 'career-20',
    organization: {
      en: 'Marstejes Enterprise & Premier Service Group',
      fr: 'Marstejes Enterprise & Premier Service Group',
    },
    role_title: {
      en: 'Managing Director & Deputy Managing Director',
      fr: 'Directeur Général & Directeur Général Adjoint',
    },
    category: 'advisory',
    period: '1997 – 2005',
    tenure_note: '8 years · Février 1997 – Décembre 2005',
    is_current: false,
    location: 'Buea / North West Region, Cameroon',
    description: {
      en: 'Early executive career directing corporate management, financial software tracking, human resource systems, and client delivery operations.',
      fr: 'Début de carrière de direction générale gérant les ressources financières, l’informatisation des processus et la coordination d’équipes opérationnelles.',
    },
    highlights: [
      {
        en: 'Implementation of computerized financial resource tracking and disaster recovery protocols.',
        fr: 'Mise en œuvre d’outils informatisés de suivi financier et de protocoles de continuité d’activité.',
      },
      {
        en: 'Designed human resource management systems and team building frameworks.',
        fr: 'Structuration des systèmes de gestion des compétences et de la culture d’excellence client.',
      },
    ],
    verification_status: 'verified',
    verification_note: {
      en: 'Corporate Management Historical Records',
      fr: 'Registres historiques de direction d’entreprise',
    },
  },
];

export const EDUCATION_CREDENTIALS: EducationCredential[] = [
  {
    id: 'edu-1',
    degree: {
      en: 'MPA',
      fr: 'Master (MPA)',
    },
    field: {
      en: 'Master of Public Administration (MPA), Public Finance',
      fr: 'Master en Administration Publique (MPA), Finances Publiques',
    },
    institution: {
      en: 'Harvard University, John F. Kennedy School of Government',
      fr: 'Université Harvard, John F. Kennedy School of Government',
    },
    year: '2015 – 2016',
    category: 'masters',
    description: {
      en: 'Specialized graduate training in sovereign public finance, macro-fiscal policy, debt economics, and executive public leadership at the world’s foremost school of government.',
      fr: 'Formation de haut niveau en finances publiques souveraines, politiques macro-budgétaires, économie de la dette et gouvernance publique à Harvard Kennedy School.',
    },
  },
  {
    id: 'edu-2',
    degree: {
      en: 'PhD',
      fr: 'Doctorat (PhD)',
    },
    field: {
      en: 'Doctor of Philosophy (PhD) in Business and Public Policy, Forensic Accounting',
      fr: 'Doctorat (PhD) en Politiques Publiques & Affaires, Comptabilité Judiciaire',
    },
    institution: {
      en: 'Charisma University',
      fr: 'Université Charisma',
    },
    year: '2011 – 2015',
    category: 'doctorate',
    description: {
      en: 'Doctoral research treatise investigating forensic accounting methodologies, anomaly detection models, and institutional checks against sovereign expenditure leakage.',
      fr: 'Thèse de doctorat consacrée aux méthodologies de comptabilité judiciaire, aux modèles de détection d’anomalies et à la lutte contre les déperditions budgétaires.',
    },
  },
  {
    id: 'edu-3',
    degree: {
      en: 'DBA',
      fr: 'Doctorat (DBA)',
    },
    field: {
      en: 'Doctor of Business Administration (DBA)',
      fr: 'Doctorat en Administration des Affaires (DBA)',
    },
    institution: {
      en: 'York Saint John University',
      fr: 'York Saint John University (Royaume-Uni)',
    },
    category: 'doctorate',
    description: {
      en: 'Executive doctoral scholarship examining capital markets, corporate governance risk management, and the empirical foundations of regional stock exchanges.',
      fr: 'Recherche doctorale appliquée sur l’intégration des marchés de capitaux, la gouvernance des risques d’entreprise et l’attractivité des places boursières régionales.',
    },
  },
  {
    id: 'edu-4',
    degree: {
      en: 'LL.M. / Droit',
      fr: 'Master en Droit',
    },
    field: {
      en: 'Master of Laws (LL.M.) in Commercial & Business Law',
      fr: 'Maîtrise en Droit des Affaires & Droit Commercial',
    },
    institution: {
      en: 'University of Dschang',
      fr: 'Université de Dschang (Cameroun)',
    },
    category: 'masters',
    description: {
      en: 'Rigorous legal foundations across OHADA business law, public procurement jurisprudence, contract law, and financial regulation.',
      fr: 'Formation juridique approfondie en droit des affaires OHADA, contentieux des marchés publics, droit commercial et régulation financière.',
    },
  },
  {
    id: 'edu-5',
    degree: {
      en: 'DBA Track',
      fr: 'Parcours DBA',
    },
    field: {
      en: 'Doctor of Business Administration in Artificial Intelligence & Machine Learning',
      fr: 'Doctorat (DBA) en Intelligence Artificielle & Machine Learning',
    },
    institution: {
      en: 'European Institute of Management & Technology (EIMT)',
      fr: 'European Institute of Management & Technology (EIMT, Europe)',
    },
    year: 'Current Doctoral Track',
    category: 'doctorate',
    description: {
      en: 'Advanced doctoral research modeling neural networks and machine learning anomaly detection algorithms for sovereign public finance oversight and anti-corruption diagnostics.',
      fr: 'Recherche doctorale avancée appliquant les réseaux neuronaux et algorithmes de machine learning à la surveillance des finances publiques et à la détection de fraudes.',
    },
  },
  {
    id: 'edu-6',
    degree: {
      en: 'Executive Certificate',
      fr: 'Certificat Exécutif',
    },
    field: {
      en: 'Financial Resource Management & Financial Stewardship for NGOs',
      fr: 'Gestion des Ressources Financières & Fiduciary Stewardship',
    },
    institution: {
      en: 'Harvard University, John F. Kennedy School of Government',
      fr: 'Université Harvard, John F. Kennedy School of Government',
    },
    year: '2014',
    category: 'charter',
    description: {
      en: 'Executive specialization in institutional stewardship, donor fiduciary compliance, and non-profit resource mobilization.',
      fr: 'Spécialisation exécutive en intendance fiduciaire, conformité multi-bailleurs et gouvernance des ressources institutionnelles.',
    },
  },
  {
    id: 'edu-7',
    degree: {
      en: 'Certified Investigator',
      fr: 'Investigateur Certifié',
    },
    field: {
      en: 'Certified Investigation Professional, Financial Investigation',
      fr: 'Professionnel Certifié en Investigation Financière (CIP)',
    },
    institution: {
      en: 'Institute of Certified Financial Investigation Professionals (ICFIP)',
      fr: 'Institute of Certified Financial Investigation Professionals (ICFIP)',
    },
    year: '2014',
    category: 'charter',
    description: {
      en: 'International certification in financial forensics, evidentiary gathering, fraud tracing, and judicial reporting standards.',
      fr: 'Accréditation internationale en criminalistique financière, collecte de preuves probantes et méthodologies d’audit d’investigation.',
    },
  },
  {
    id: 'edu-8',
    degree: {
      en: 'Founding Fellow',
      fr: 'Fellow Fondateur',
    },
    field: {
      en: 'Founding Fellow, International Institute of Forensic Accounts (IIFA)',
      fr: 'Membre Fondateur Émérite, International Institute of Forensic Accounts',
    },
    institution: {
      en: 'International Institute of Forensic Accounts (IIFA)',
      fr: 'Institut International d’Audit Judiciaire & Comptabilité Forensique',
    },
    category: 'honor',
    description: {
      en: 'Distinguished lifetime fellowship recognizing pioneering contributions to forensic accounting education and public accountability across Africa.',
      fr: 'Titre de Fellow à vie récompensant une contribution pionnière à l’enseignement de la criminalistique financière et à la probité publique en Afrique.',
    },
  },
  {
    id: 'edu-9',
    degree: {
      en: 'National Honor',
      fr: 'Ordre National',
    },
    field: {
      en: 'Knight of the Cameroon National Order of Valor',
      fr: 'Chevalier de l’Ordre National de la Valeur du Cameroun',
    },
    institution: {
      en: 'Presidency of the Republic of Cameroon',
      fr: 'Présidence de la République du Cameroun',
    },
    category: 'honor',
    description: {
      en: 'Conferred by the Head of State for distinguished sovereign services rendered to the Republic of Cameroon in state finance operations and economic modernization.',
      fr: 'Décerné par le Chef de l’État en reconnaissance de services éminents et exceptionnels rendus à la République du Cameroun dans la direction des finances publiques.',
    },
  },
];

export const EXPERTISE_PILLARS: ExpertisePillar[] = [
  {
    id: 'exp-1',
    slug: 'public-financial-management',
    title: {
      en: 'Public Financial Management & State Treasury',
      fr: 'Gestion des Finances Publiques & Trésorerie de l’État',
    },
    subtitle: {
      en: 'Sovereign Liquidity, Budget Execution & Fiscal Modernization',
      fr: 'Liquidité Souveraine, Exécution Budgétaire & Modernisation Fiscale',
    },
    summary: {
      en: 'Designing resilient treasury single account (TSA) operations, multi-year fiscal frameworks, and sovereign cash-flow optimization in alignment with CEMAC convergence directives.',
      fr: 'Conception d’opérations de Compte Unique du Trésor (CUT), de cadres budgétaires pluriannuels et d’optimisation de la trésorerie souveraine conformément aux directives CEMAC.',
    },
    key_mandates: [
      {
        en: 'State budget execution architectures (scaling from 3,189B FCFA in 2012 to over 11,694B FCFA in modern cycles)',
        fr: 'Architecture d’exécution du budget de l’État (évolution de 3 189 Mds FCFA en 2012 à plus de 11 694 Mds FCFA)',
      },
      {
        en: 'Sovereign debt sustainability analysis (DSA) and treasury bill/bond syndication',
        fr: 'Analyse de viabilité de la dette souveraine (AVD) et syndication des OTA/BTA',
      },
    ],
    metrics_label: {
      en: 'Sovereign Treasury & Fiscal Policy',
      fr: 'Trésor Souverain & Politique Budgétaire',
    },
  },
  {
    id: 'exp-2',
    slug: 'capital-markets-bvmac',
    title: {
      en: 'Capital Markets & Regional Exchange Architecture',
      fr: 'Marchés des Capitaux & Architecture Boursière Régionale',
    },
    subtitle: {
      en: 'BVMAC Liquidity Formation & COSUMAF Regulatory Oversight',
      fr: 'Liquidité de la BVMAC & Supervision Réglementaire COSUMAF',
    },
    summary: {
      en: 'Advancing secondary market depth, institutional investor participation, and regulatory harmonization across the Central African Capital Market (BVMAC).',
      fr: 'Développement de la profondeur du marché secondaire, participation des investisseurs institutionnels et harmonisation réglementaire sur le marché financier d’Afrique centrale (BVMAC).',
    },
    key_mandates: [
      {
        en: 'Unification of CEMAC stock exchange infrastructure and central depository systems',
        fr: 'Unification des infrastructures boursières de la CEMAC et du dépositaire central',
      },
      {
        en: 'Structuring long-tenor sovereign and state-owned enterprise capital market issuances',
        fr: 'Structuration d’émissions obligataires à long terme pour l’État et les entreprises publiques',
      },
    ],
    metrics_label: {
      en: 'CEMAC / COSUMAF / BVMAC',
      fr: 'CEMAC / COSUMAF / BVMAC',
    },
  },
  {
    id: 'exp-3',
    slug: 'climate-finance-esg',
    title: {
      en: 'Climate Finance, Green Bonds & Sovereign ESG',
      fr: 'Finance Climatique, Obligations Vertes & ESG Souverain',
    },
    subtitle: {
      en: 'Global Green Bond Initiative & Resilient Debt Platforms',
      fr: 'Initiative Mondiale sur les Obligations Vertes & Dette Résiliente',
    },
    summary: {
      en: 'Mobilizing green, social, and sustainability-linked sovereign debt instruments alongside multilateral de-risking guarantees to fund climate adaptation and infrastructure.',
      fr: 'Mobilisation d’obligations souveraines vertes et durables associées à des garanties multilatérales pour financer l’adaptation climatique et les infrastructures.',
    },
    key_mandates: [
      {
        en: 'Designated National Authority for UNDP-GEF Global Green Bond Initiative',
        fr: 'Autorité Nationale Désignée pour l’Initiative Mondiale sur les Obligations Vertes (PNUD-FEM)',
      },
      {
        en: 'Integration of ICMA Green Bond Principles into sovereign issuance frameworks',
        fr: 'Intégration des Principes des Obligations Vertes (ICMA) dans les cadres d’émission souverains',
      },
    ],
    metrics_label: {
      en: 'UNDP-GEF Green Bond Mandate',
      fr: 'Mandat Obligations Vertes PNUD-FEM',
    },
  },
  {
    id: 'exp-4',
    slug: 'forensic-accounting-integrity',
    title: {
      en: 'Forensic Accounting & Financial Crime Investigation',
      fr: 'Comptabilité Judiciaire & Investigation Financière',
    },
    subtitle: {
      en: 'Preventive Fraud Diagnostics, Asset Tracing & AML Frameworks',
      fr: 'Diagnostic Préventif de la Fraude, Traçage d’Actifs & Cadres LCB-FT',
    },
    summary: {
      en: 'Establishing evidentiary audit protocols, red-flag anomaly detection matrices, and cross-border anti-money laundering controls for public and corporate entities.',
      fr: 'Établissement de protocoles d’audit probatoire, de matrices de détection de signaux d’alerte et de contrôles LCB-FT transfrontaliers.',
    },
    key_mandates: [
      {
        en: 'Author of four specialized volumes on forensic accounting, fraud symptoms, and AML (within 10 published treatises)',
        fr: 'Auteur de quatre volumes spécialisés en audit judiciaire, signaux de fraude et LCB-FT (au sein de 10 traités publiés)',
      },
      {
        en: 'Graduate instruction for state auditors and financial magistrates at ENAM',
        fr: 'Enseignement supérieur pour les auditeurs d’État et magistrats financiers à l’ENAM',
      },
    ],
    metrics_label: {
      en: '4 Specialized Volumes · 10 Treatises Opus',
      fr: '4 Volumes Spécialisés · Corpus de 10 Traités',
    },
  },
  {
    id: 'exp-5',
    slug: 'multilateral-risk-governance',
    title: {
      en: 'Multilateral Trade Insurance & Risk De-Risking',
      fr: 'Assurance du Commerce Multilatéral & Atténuation des Risques',
    },
    subtitle: {
      en: 'Continental Governance at ATIDI & Multilateral Development Banks',
      fr: 'Gouvernance Continentale à l’ATIDI & Institutions Multilatérales',
    },
    summary: {
      en: 'Governing political and commercial risk insurance instruments that crowd-in private international capital and reduce borrowing spreads for African sovereigns.',
      fr: 'Gouvernance des instruments d’assurance contre les risques politiques et commerciaux favorisant la mobilisation de capitaux internationaux et la réduction des primes de risque souveraines.',
    },
    key_mandates: [
      {
        en: 'Board Chairmanship at African Trade & Investment Development Insurance (ATIDI)',
        fr: 'Présidence du Conseil d’Administration de l’ATIDI',
      },
      {
        en: 'Sovereign credit-enhancement structures and DFI co-financing governance',
        fr: 'Structures de rehaussement de crédit souverain et cofinancement avec les IFD',
      },
    ],
    metrics_label: {
      en: 'ATIDI Board Chairmanship',
      fr: 'Présidence du Conseil ATIDI',
    },
  },
  {
    id: 'exp-6',
    slug: 'academic-scholarship-mentorship',
    title: {
      en: 'Academic Scholarship & Institutional Capacity Building',
      fr: 'Recherche Académique & Renforcement des Capacités',
    },
    subtitle: {
      en: 'Executive Education at ENAM & Empirical Policy Literature',
      fr: 'Formation des Cadres Supérieurs à l’ENAM & Littérature Économique',
    },
    summary: {
      en: 'Bridging theoretical financial economics with real-world statecraft by mentoring the next generation of public administrators, regulators, and forensic auditors.',
      fr: 'Relier l’économie financière théorique à la pratique de l’État en formant la nouvelle génération d’administrateurs publics, régulateurs et auditeurs.',
    },
    key_mandates: [
      {
        en: 'Curriculum design in public financial governance and forensic audit methodology',
        fr: 'Conception de programmes en gouvernance financière publique et audit judiciaire',
      },
      {
        en: 'Peer-reviewed monographs and policy dialogues across francophone and anglophone Africa',
        fr: 'Monographies et dialogues de politique économique en Afrique francophone et anglophone',
      },
    ],
    metrics_label: {
      en: 'ENAM Senior Lectureship',
      fr: 'Chaire d’Enseignement ENAM',
    },
  },
];

export const SEED_BOOKS: Book[] = [
  {
    id: 'book-credible-signature-paul-biya',
    slug: 'paul-biya-the-art-of-the-credible-signature',
    isbn: '978-2-487-19825-1',
    title: {
      en: 'Paul BIYA: The Art of the Credible Signature',
      fr: 'Paul BIYA : L’Art de la Signature Crédible',
    },
    subtitle: {
      en: 'Capital Markets under the Leadership of His Excellency Paul BIYA, President of the Republic: Challenges, Achievements and Prospects',
      fr: 'Les Marchés des Capitaux sous le Leadership de Son Excellence Paul BIYA, Président de la République : Défis, Réalisations et Perspectives',
    },
    synopsis: {
      en: 'A landmark 406-page treatise exploring Cameroon’s sovereign creditworthiness, financial statecraft, and capital market resource mobilization under President Paul Biya. Professor Kelly Mua Kingsly formulates the "Theory of State Trust Capital", demonstrating how an unbroken record of zero sovereign debt defaults from 1982 to 2025 has established Cameroon’s signature as a premier sovereign benchmark across domestic, regional (BVMAC), and international debt markets.',
      fr: 'Traité magistral de 406 pages explorant la crédibilité financière, l’ingénierie souveraine et la mobilisation des ressources sur les marchés des capitaux sous le leadership du Président Paul Biya. Le Professeur Kelly Mua Kingsly y théorise le « Capital Confiance Étatique », démontrant comment un bilan sans défaut souverain de 1982 à 2025 a érigé la signature camerounaise en référence sur les marchés financiers domestiques, régionaux (BVMAC) et internationaux.',
    },
    academic_category: 'Sovereign Debt, PFM & Capital Markets',
    cover_image_url: '/images/books/the-art-of-a-credible-signature-paul-biya.jpeg',
    alternate_cover_image_url: '/images/books/paul-biya-credible-signature-2nd.jpeg',
    total_pages: 406,
    publish_date: '2026-11-05',
    publisher: 'Éditions All Access, Paris',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Doctrinal Analysis of a Sovereign Trajectory: The Theory of State Trust Capital',
          fr: 'Analyse Doctrinale d’une Trajectoire Souveraine : La Théorie du Capital Confiance Étatique',
        },
        summary: {
          en: 'Frames Cameroon’s financial sovereignty beyond accounting balances into the teleology of state trust capital, analyzing how sovereign word and institutional credibility minimize debt-servicing spreads.',
          fr: 'Inscrit la souveraineté financière du Cameroun dans une téléologie du capital confiance étatique, analysant comment la parole souveraine et la rigueur institutionnelle minorent les coûts d’emprunt.',
        },
      },
      {
        number: 2,
        title: {
          en: 'The 20 Sovereign Credibility Indicators of Cameroon (1982–2025+)',
          fr: 'Les 20 Indicateurs de Crédibilité Souveraine du Cameroun (1982–2025+)',
        },
        summary: {
          en: 'Systematic empirical evaluation of Cameroon’s sovereign metrics: zero default record, debt-to-GDP sustainability, primary surplus consolidation, and multilateral co-financing resilience.',
          fr: 'Évaluation empirique des indicateurs de soutenabilité du Cameroun : historique de zéro défaut, viabilité du ratio dette/PIB, excédents primaires et résilience des cofinancements multilatéraux.',
        },
      },
      {
        number: 3,
        title: {
          en: 'Capital Market Mobilization: BVMAC, Regional Syndications, and Global Eurobonds',
          fr: 'Mobilisation sur les Marchés de Capitaux : BVMAC, Syndications Régionales et Eurobonds',
        },
        summary: {
          en: 'Detailed technical review of Cameroon’s pioneer sovereign treasury issuances, primary dealer network (SVT) dynamics, and sovereign benchmark pricing in CEMAC and London/Paris exchanges.',
          fr: 'Revue technique des émissions pionnières de titres publics, du réseau des SVT et de la tarification des euro-obligations sur les places financières internationales et sous-régionales.',
        },
      },
      {
        number: 4,
        title: {
          en: 'The Economic Transformation Program: Vision 2035 & SND30 Industrial Financing',
          fr: 'Le Programme de Transformation Économique : Vision 2035 & Financement SND30',
        },
        summary: {
          en: 'Strategic roadmap linking sovereign capital market mobilization to the National Development Strategy (SND30), energy infrastructure, deep-sea ports, and trans-African logistical corridors.',
          fr: 'Feuille de route stratégique arrimant la levée de capitaux à la Stratégie Nationale de Développement (SND30), aux grands projets énergétiques, portuaires et aux corridors transafricains.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'The "Theory of State Trust Capital" establishes that sovereign credibility is an intangible national asset that directly reduces borrowing costs and unlocks capital market access.',
        fr: 'La « Théorie du Capital Confiance Étatique » démontre que la crédibilité souveraine est un actif immatériel majeur réduisant directement le coût de la dette et garantissant l’accès aux marchés.',
      },
      {
        en: 'Chronicles over 44 years of financial discipline with zero sovereign defaults, authenticated by international rating agencies (Moody’s, S&P, Fitch).',
        fr: 'Documente 44 ans de rigueur financière et de solvabilité ininterrompue, validée par les agences de notation internationales (Moody’s, S&P, Fitch).',
      },
      {
        en: 'Serves as an indispensable manual for public debt directors, central bankers, institutional asset managers, and academic researchers in developmental finance.',
        fr: 'Ouvrage de chevet pour les directeurs de dette publique, banquiers centraux, gestionnaires d’actifs institutionnels et chercheurs en finances du développement.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-credible-sig-digital',
        book_id: 'book-credible-signature-paul-biya',
        format: 'digital_pdf',
        price_cents: 10700,
        currency: 'USD',
        price_eur_cents: 9800,
        price_xaf: 73955,
        is_available: true,
        file_storage_path: 'private-books/the-art-of-a-credible-signature-paul-biya.pdf',
        sku: 'KMK-BIYA-SIG-PDF',
      },
      {
        id: 'fmt-credible-sig-hardcover',
        book_id: 'book-credible-signature-paul-biya',
        format: 'physical_hardcover',
        price_cents: 10700,
        currency: 'USD',
        price_eur_cents: 9800,
        price_xaf: 73955,
        is_available: true,
        sku: 'KMK-BIYA-SIG-HC',
      },
      {
        id: 'fmt-credible-sig-paperback',
        book_id: 'book-credible-signature-paul-biya',
        format: 'physical_paperback',
        price_cents: 10700,
        currency: 'USD',
        price_eur_cents: 9800,
        price_xaf: 73955,
        is_available: true,
        sku: 'KMK-BIYA-SIG-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-amazon-credible-sig',
        book_id: 'book-credible-signature-paul-biya',
        platform_name: 'Amazon (Kindle & Paperback)',
        retail_url: 'https://www.amazon.com/ART-CREDIBLE-SIGNATURE-PAUL-BIYA-ebook/dp/B0HPMP8BQZ',
        is_active: true,
      },
      {
        id: 'ret-yaounde-launch-desk',
        book_id: 'book-credible-signature-paul-biya',
        platform_name: 'Hilton Yaoundé Official Launch Desk (5 Nov 2026)',
        retail_url: 'https://forms.gle/KLRjZUB6vjcEtcsbA',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-corruption-roadmap',
    slug: 'african-roadmap-in-the-fight-against-corrupt-practices',
    isbn: '978-620-9-25064-4',
    title: {
      en: 'African Roadmap in the Fight Against Corrupt Practices',
      fr: 'Feuille de Route des Pays Africains dans la Lutte Contre les Pratiques de Corruption',
    },
    subtitle: {
      en: 'An Empirical Forensic Investigation into Public Sector Fraud in Cameroon and Nigeria',
      fr: 'Enquête Forensique Empirique sur la Fraude et la Corruption dans le Secteur Public au Cameroun et au Nigeria',
    },
    synopsis: {
      en: 'An authoritative empirical and forensic treatise examining the systemic root drivers of public-sector fraud and corruption across Sub-Saharan Africa. Applying the broken trust paradigm, the author formulates an evidentiary audit protocol, quantitative anomaly indicators, and a statutory legislative roadmap to dismantle institutional leakage and restore fiduciary accountability.',
      fr: 'Traité empirique et forensique de référence analysant les ressorts profonds de la fraude et de la corruption dans le secteur public en Afrique subsaharienne. S’appuyant sur le modèle de la confiance rompue, l’auteur formule un protocole d’audit probatoire, des indicateurs quantitatifs d’anomalies et une feuille de route législative pour neutraliser les déperditions publiques.',
    },
    academic_category: 'Forensic Accounting & Public Integrity',
    cover_image_url: '/assets/books/forensic-accounting.svg',
    total_pages: 312,
    publish_date: '2025-01-10',
    publisher: 'Éditions Notre Savoir · Distribution La Boutique Africa Vivre',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Etiology of Public Sector Leakage: The Broken Trust Model',
          fr: 'Étiologie des Déperditions Publiques : Le Modèle de la Confiance Rompue',
        },
        summary: {
          en: 'Analyzes institutional, psychological, and procedural vulnerabilities enabling white-collar corruption in sovereign ministries.',
          fr: 'Analyse les vulnérabilités institutionnelles, psychologiques et procédurales facilitant la corruption des cols blancs.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Evidentiary Standards & Quantitative Asset Tracing Protocols',
          fr: 'Normes de Preuve et Protocoles Quantitatifs de Traçage d’Actifs',
        },
        summary: {
          en: 'Formulates forensic accounting methodologies admissible before supreme audit institutions and financial magistrate courts.',
          fr: 'Formule des méthodologies d’audit judiciaire recevables devant les cours des comptes et tribunaux financiers.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Actionable policy blueprint for anti-corruption commissions, state audit chambers, and public finance inspectors.',
        fr: 'Feuille de route opérationnelle pour les commissions anti-corruption, chambres des comptes et inspections des finances.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-cr-101',
        book_id: 'book-corruption-roadmap',
        format: 'digital_pdf',
        price_cents: 3500,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/african-roadmap-corruption.pdf',
        sku: 'KMK-ARC-PDF',
      },
      {
        id: 'fmt-cr-102',
        book_id: 'book-corruption-roadmap',
        format: 'physical_paperback',
        price_cents: 4800,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-ARC-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-cr-101',
        book_id: 'book-corruption-roadmap',
        platform_name: 'La Boutique Africa Vivre',
        retail_url:
          'https://www.laboutiqueafricavivre.com/livres-specialises/312972-feuille-de-route-des-pays-africains-dans-la-lutte-contre-les-pratiques-de-corruption-9786209250644.html',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-5',
    slug: 'financial-crime-investigations',
    isbn: '978-1-64114-340-0',
    title: {
      en: 'Financial Crime Investigations',
      fr: 'Investigations sur la Criminalité Financière',
    },
    subtitle: {
      en: 'Cross-Border AML, Sovereign Oversight & Regulatory Enforcement',
      fr: 'LCB-FT Transfrontalière, Supervision Souveraine et Application Réglementaire',
    },
    synopsis: {
      en: 'Addresses contemporary illicit financial flows, trade-based money laundering, beneficial ownership obfuscation, and coordinated investigative techniques for financial intelligence units and central banks.',
      fr: 'Aborde les flux financiers illicites contemporains, le blanchiment basé sur le commerce, l’opacité des bénéficiaires effectifs et les techniques d’enquête coordonnées pour les cellules de renseignement financier.',
    },
    academic_category: 'Financial Integrity & AML',
    cover_image_url: '/images/books/financial-crime-investigations.jpg',
    total_pages: 380,
    publish_date: '2024-02-14',
    publisher: 'Christian Faith Publishing · Academic Press',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Typologies of Illicit Financial Flows in Resource-Rich Economies',
          fr: 'Typologies des Flux Financiers Illicites dans les Économies Riches en Ressources',
        },
        summary: {
          en: 'Maps trade misinvoicing, shell-company layering, and sovereign revenue leakage vectors.',
          fr: 'Cartographie la fausse facturation commerciale, les sociétés écrans et les vecteurs de déperdition des recettes publiques.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Practical inter-agency blueprint aligning FATF/GABAC recommendations with sovereign treasury controls.',
        fr: 'Cadre pratique interinstitutionnel alignant les recommandations GAFI/GABAC avec les contrôles du Trésor public.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-501',
        book_id: 'book-5',
        format: 'digital_pdf',
        price_cents: 3600,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/financial-crime.pdf',
        sku: 'KMK-FCI-PDF',
      },
      {
        id: 'fmt-502',
        book_id: 'book-5',
        format: 'physical_hardcover',
        price_cents: 5400,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-FCI-HC',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-501',
        book_id: 'book-5',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/s?k=Kelly+Kingsly+Financial+Crime+Investigation',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-1',
    slug: 'stock-markets-lever-for-growth-central-africa-bvmac',
    isbn: '978-1-68526-412-3',
    title: {
      en: 'Stock Markets as a Lever for Growth in Central Africa',
      fr: 'Les Marchés Boursiers comme Levier de Croissance en Afrique Centrale',
    },
    subtitle: {
      en: 'The Case of the Central African Capital Market (BVMAC)',
      fr: 'Le Cas du Marché Financier d’Afrique Centrale (BVMAC)',
    },
    synopsis: {
      en: 'An authoritative empirical and institutional investigation into how capital market unification in the CEMAC region can catalyze long-term infrastructure financing, deepen secondary liquidity, and modernize sovereign and corporate debt issuance under COSUMAF and BVMAC.',
      fr: 'Une étude empirique et institutionnelle de référence sur la manière dont l’unification du marché financier en zone CEMAC peut catalyser le financement des infrastructures à long terme, approfondir la liquidité secondaire et moderniser les émissions souveraines et privées sous l’égide de la COSUMAF et de la BVMAC.',
    },
    academic_category: 'Capital Markets & Sovereign Finance',
    cover_image_url: '/assets/books/bvmac-capital-markets.svg',
    total_pages: 348,
    publish_date: '2023-06-15',
    publisher: 'Christian Faith Publishing · Academic Series',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Historical Evolution & Unification of the CEMAC Financial Market (DSX to BVMAC)',
          fr: 'Évolution Historique et Unification du Marché Financier de la CEMAC (de la DSX à la BVMAC)',
        },
        summary: {
          en: 'Analyzes the structural merger of the Douala Stock Exchange (DSX) and BVMAC into a unified regional exchange and central depository.',
          fr: 'Analyse la fusion structurelle de la Douala Stock Exchange (DSX) et de la BVMAC en une bourse régionale unifiée.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Sovereign Bond Syndication & Primary Market Architecture',
          fr: 'Syndication des Obligations Souveraines et Architecture du Marché Primaire',
        },
        summary: {
          en: 'Examines how CEMAC member states utilize capital market issuances to finance multi-year infrastructure programs.',
          fr: 'Examine comment les États membres de la CEMAC mobilisent le marché financier pour financer leurs programmes d’infrastructures.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Empirical roadmap for transitioning CEMAC economies from bank-centric financing toward deep capital markets.',
        fr: 'Feuille de route empirique pour faire évoluer les économies de la CEMAC d’un financement bancaire vers des marchés de capitaux profonds.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-101',
        book_id: 'book-1',
        format: 'digital_pdf',
        price_cents: 3400,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/bvmac-capital-markets.pdf',
        sku: 'KMK-BVMAC-PDF',
      },
      {
        id: 'fmt-102',
        book_id: 'book-1',
        format: 'digital_epub',
        price_cents: 2900,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/bvmac-capital-markets.epub',
        sku: 'KMK-BVMAC-EPUB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-101',
        book_id: 'book-1',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/s?k=Kelly+Mua+Kingsly+Stock+Markets+Central+Africa',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-2',
    slug: 'forensic-accounting-and-financial-investigation',
    isbn: '978-1-63525-478-5',
    title: {
      en: 'Forensic Accounts and Ethics',
      fr: 'Comptabilité Forensique et Éthique',
    },
    subtitle: {
      en: 'Methodologies for Sovereign Audit, Asset Tracing & Institutional Integrity',
      fr: 'Méthodologies pour l’Audit Souverain, le Traçage d’Actifs et l’Intégrité Institutionnelle',
    },
    synopsis: {
      en: 'A rigorous practitioner and academic reference detailing forensic audit protocols, digital chain-of-custody standards, financial statement reconstruction, and expert witness reporting in complex public and corporate investigations.',
      fr: 'Un ouvrage de référence académique et pratique détaillant les protocoles d’audit judiciaire, la chaîne de traçabilité des preuves numériques, la reconstitution d’états financiers et l’expertise judiciaire.',
    },
    academic_category: 'Forensic Accounting & Audit',
    cover_image_url: '/images/books/forensic-accounting-and-financial-investigation.jpg',
    total_pages: 412,
    publish_date: '2022-11-10',
    publisher: 'Christian Faith Publishing / IEM Press',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Foundations of Forensic Accounting vs. Statutory Financial Auditing',
          fr: 'Fondements de la Comptabilité Judiciaire face à l’Audit Financier Statutaire',
        },
        summary: {
          en: 'Distinguishes materiality-based statutory audits from adversarial, evidentiary forensic investigations.',
          fr: 'Distingue l’audit légal fondé sur la matérialité de l’investigation judiciaire à vocation probatoire.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Complete methodology for conducting sovereign and corporate forensic investigations from allegation to courtroom.',
        fr: 'Méthodologie complète pour conduire des investigations financières de l’allégation initiale jusqu’à l’instance judiciaire.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-201',
        book_id: 'book-2',
        format: 'digital_pdf',
        price_cents: 3800,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/forensic-accounting.pdf',
        sku: 'KMK-FAFI-PDF',
      },
      {
        id: 'fmt-202',
        book_id: 'book-2',
        format: 'physical_paperback',
        price_cents: 4500,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-FAFI-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-201',
        book_id: 'book-2',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/s?k=Kelly+Kingsly+Forensic+Accounts+and+Ethics',
        is_active: true,
      },
      {
        id: 'ret-202',
        book_id: 'book-2',
        platform_name: 'Amazon UK (Édition Française)',
        retail_url:
          'https://www.amazon.co.uk/Comptabilit%C3%A9-forensique-%C3%A9thique-Kelly-Kingsly/dp/1947662775',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-3',
    slug: 'identifying-red-flags-and-symptoms-of-fraud',
    isbn: '978-1-63874-219-7',
    title: {
      en: 'Identifying Red Flags and Symptoms of Fraud',
      fr: 'Identifier les Signaux d’Alerte et Symptômes de la Fraude',
    },
    subtitle: {
      en: 'Preventive Diagnostics in Public & Corporate Financial Systems',
      fr: 'Diagnostics Préventifs dans les Systèmes Financiers Publics et Privés',
    },
    synopsis: {
      en: 'Provides audit committees, treasury inspectors, and compliance officers with an actionable taxonomy of behavioral, accounting, and organizational red flags that precede major financial fraud.',
      fr: 'Fournit aux comités d’audit, inspecteurs du Trésor et responsables de la conformité une taxonomie opérationnelle des signaux d’alerte comportementaux, comptables et organisationnels précédant la fraude.',
    },
    academic_category: 'Forensic Accounting & Audit',
    cover_image_url: '/assets/books/red-flags-fraud.svg',
    total_pages: 296,
    publish_date: '2021-08-22',
    publisher: 'Christian Faith Publishing',
    is_featured: false,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Fraud Triangle, Diamond & Pentagon in Public Institutions',
          fr: 'Le Triangle, le Diamant et le Pentagone de la Fraude dans les Institutions Publiques',
        },
        summary: {
          en: 'Adapts classical criminological fraud models to sovereign ministries and state-owned enterprises.',
          fr: 'Adapte les modèles criminologiques classiques de la fraude aux ministères souverains et entreprises publiques.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Procurement, Ghost Payrolls & Revenue Skimming Indicators',
          fr: 'Indicateurs de Fraude aux Marchés Publics, Salaires Fictifs et Détournement de Recettes',
        },
        summary: {
          en: 'Catalogs early warning indicators across public expenditure chains.',
          fr: 'Répertorie les indicateurs d’alerte précoce tout au long de la chaîne de la dépense publique.',
        },
      },
      {
        number: 3,
        title: {
          en: 'Automated Anomaly Detection & Whistleblower Protocol Design',
          fr: 'Détection Automatisée des Anomalies et Conception du Dispositif d’Alerte',
        },
        summary: {
          en: 'Integrates automated Benford algorithms and secure whistleblower reporting channels.',
          fr: 'Intègre les algorithmes statistiques de Benford et des canaux sécurisés de signalement interne.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Shifts institutional oversight from post-mortem loss recovery to real-time preventive interception.',
        fr: 'Fait évoluer le contrôle institutionnel du recouvrement a posteriori vers l’interception préventive en temps réel.',
      },
      {
        en: 'Actionable diagnostic checklists for internal control inspectors and parliamentary accounts committees.',
        fr: 'Grilles de contrôle opérationnelles pour les inspecteurs généraux d’État et les commissions des finances.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-301',
        book_id: 'book-3',
        format: 'digital_pdf',
        price_cents: 2800,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/red-flags-fraud.pdf',
        sku: 'KMK-RFF-PDF',
      },
      {
        id: 'fmt-302',
        book_id: 'book-3',
        format: 'physical_paperback',
        price_cents: 3600,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-RFF-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-301',
        book_id: 'book-3',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/s?k=Kelly+Mua+Kingsly+Identifying+Red+Flags',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-bailout-emerging-africa',
    slug: 'economic-and-financial-bailout-programs-emerging-africa',
    isbn: '978-1-63648-039-8',
    title: {
      en: 'Economic and Financial Bail Out Programs for an Emerging Africa',
      fr: 'Programmes de Sauvetage Économique et Financier pour une Afrique Émergente',
    },
    subtitle: {
      en: 'Imposed Programs: Myth or Reality?',
      fr: 'Programmes Imposés : Mythe ou Réalité ?',
    },
    synopsis: {
      en: 'A critical, empirical examination of structural adjustment and sovereign bailout interventions across Sub-Saharan Africa. Prof. Kingsly evaluates whether externally mandated structural reforms have catalyzed genuine economic emergence or entrenched systemic fiscal debt and dependency, offering actionable governance frameworks for sovereign self-determination.',
      fr: 'Une analyse critique et empirique des plans d’ajustement structurel et programmes de sauvetage financier en Afrique subsaharienne. Le Pr Kingsly examine si les réformes imposées de l’extérieur ont catalysé l’émergence économique ou accentué la dette et la dépendance budgétaire, proposant des cadres d’autodétermination souveraine.',
    },
    academic_category: 'Sovereign Debt & Structural Policy',
    cover_image_url: '/images/books/economic-bailout-programs-africa.jpg',
    total_pages: 152,
    publish_date: '2020-11-22',
    publisher: 'Eliva Press',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Bretton Woods Structural Adjustment Paradigms in Sub-Saharan Africa',
          fr: 'Paradigmes d’Ajustement Structurel de Bretton Woods en Afrique Subsaharienne',
        },
        summary: {
          en: 'Evaluates the macroeconomic conditionalities of multi-lateral bailouts and their fiscal impact.',
          fr: 'Évalue les conditionnalités macroéconomiques des sauvetages multilatéraux et leur impact budgétaire.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Sovereign Resilience & Endogenous Growth Alternatives',
          fr: 'Résilience Souveraine et Alternatives de Croissance Endogène',
        },
        summary: {
          en: 'Proposes domestic revenue mobilization and regional capital syndications as sustainable alternatives.',
          fr: 'Propose la mobilisation des recettes internes et la syndication financière régionale comme alternatives viables.',
        },
      },
      {
        number: 3,
        title: {
          en: 'Institutional Governance & Post-Bailout Fiscal Recovery Blueprints',
          fr: 'Gouvernance Institutionnelle et Schémas de Relance Budgétaire Post-Sauvetage',
        },
        summary: {
          en: 'Formulates statutory debt management offices and domestic bond debt refinancing strategies.',
          fr: 'Formule des stratégies de gestion de la dette publique et de refinancement par le marché intérieur.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Rigorous critique of external bailout conditionality paired with sovereign fiscal autonomy blueprints.',
        fr: 'Critique rigoureuse des conditionnalités de sauvetage doublée de leviers d’autonomie budgétaire.',
      },
      {
        en: 'Practical roadmap for sovereign debt restructuring and multilateral negotiating posture.',
        fr: 'Feuille de route concrète pour la restructuration de dette souveraine et la négociation multilatérale.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-bo-101',
        book_id: 'book-bailout-emerging-africa',
        format: 'digital_pdf',
        price_cents: 3200,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/economic-bailout-programs-africa.pdf',
        sku: 'KMK-EBO-PDF',
      },
      {
        id: 'fmt-bo-102',
        book_id: 'book-bailout-emerging-africa',
        format: 'physical_paperback',
        price_cents: 4200,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-EBO-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-bo-101',
        book_id: 'book-bailout-emerging-africa',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/dp/163648039X',
        is_active: true,
      },
      {
        id: 'ret-bo-102',
        book_id: 'book-bailout-emerging-africa',
        platform_name: 'eBay Direct Marketplace',
        retail_url: 'https://www.ebay.com/p/13050384895',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-disruptive-blockchain',
    slug: 'disruptive-technology-blockchain-the-crystal-ball',
    isbn: '978-1-09804-155-7',
    title: {
      en: 'Disruptive Technology: Blockchain – The Crystal Ball',
      fr: 'Technologie Disruptive : La Blockchain – La Boule de Cristal',
    },
    subtitle: {
      en: 'Advancing Financial Trust, Inclusion, and Simplicity Through the Blockchain',
      fr: 'Promouvoir la Confiance Financière, l’Inclusion et la Simplicité Grâce à la Blockchain',
    },
    synopsis: {
      en: 'A pioneering treatise examining distributed ledger technology (DLT), smart contracts, and quantum blockchain protocols as instruments for sovereign registry transparency, financial inclusion, and cross-border settlement in emerging economies.',
      fr: 'Un traité novateur analysant les registres distribués, les contrats intelligents et les protocoles blockchain comme instruments de transparence des registres souverains, d’inclusion financière et de compensation transfrontalière.',
    },
    academic_category: 'Financial Technology & Digital Trust',
    cover_image_url: '/images/books/disruptive-technology-blockchain.jpg',
    total_pages: 284,
    publish_date: '2020-11-20',
    publisher: 'Christian Faith Publishing / IEM Press',
    is_featured: true,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Blockchain Microstructure: Beyond Cryptocurrencies to Fiduciary Trust',
          fr: 'Microstructure de la Blockchain : Au-delà des Crypto-actifs, le Registre de Confiance',
        },
        summary: {
          en: 'Establishes cryptographic immutability as a foundation for sovereign property and fiscal records.',
          fr: 'Établit l’immuabilité cryptographique comme socle des registres fonciers et budgétaires de l’État.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Smart Contracts in Public Procurement & Treasury Liquidity Execution',
          fr: 'Contrats Intelligents dans la Commande Publique et l’Exécution du Trésor',
        },
        summary: {
          en: 'Designs programmatic escrow disbursements and automated milestone verifications for state contracts.',
          fr: 'Modélise les décaissements séquestres programmés et la vérification automatisée des étapes contractuelles.',
        },
      },
      {
        number: 3,
        title: {
          en: 'Cross-Border Central Bank Digital Currencies (CBDCs) and Trade Settlement',
          fr: 'Monnaies Numériques de Banque Centrale (MNBC) et Règlement Commercial',
        },
        summary: {
          en: 'Explores regional CBDC clearing architectures to reduce foreign exchange transaction friction across African trade corridors.',
          fr: 'Explore les architectures de compensation interbancaire en MNBC pour fluidifier les corridors commerciaux africains.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Strategic roadmap for deploying distributed ledgers in public treasury execution and trade settlement.',
        fr: 'Feuille de route stratégique pour déployer la blockchain dans l’exécution du Trésor et le commerce.',
      },
      {
        en: 'Regulatory guidance on balancing fintech innovation with prudential systemic oversight.',
        fr: 'Orientations réglementaires conciliant l’innovation financière avec la supervision macroprudentielle.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-bc-101',
        book_id: 'book-disruptive-blockchain',
        format: 'digital_pdf',
        price_cents: 3000,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/disruptive-technology-blockchain.pdf',
        sku: 'KMK-DTB-PDF',
      },
      {
        id: 'fmt-bc-102',
        book_id: 'book-disruptive-blockchain',
        format: 'physical_paperback',
        price_cents: 3900,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-DTB-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-bc-101',
        book_id: 'book-disruptive-blockchain',
        platform_name: 'Amazon France',
        retail_url:
          'https://www.amazon.fr/Disruptive-Technology-Blockchain-Advancing-Simplicity/dp/1098041550',
        is_active: true,
      },
      {
        id: 'ret-bc-102',
        book_id: 'book-disruptive-blockchain',
        platform_name: 'Amazon Italy (IEM Edition)',
        retail_url:
          'https://www.amazon.it/Corporate-Fraud-Management-Kelly-Kingsly/dp/1641407328',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-business-risk-management',
    slug: 'business-risk-management',
    isbn: '978-1-94766-286-5',
    title: {
      en: 'Business Risk Management',
      fr: 'Gestion des Risques d’Entreprise',
    },
    subtitle: {
      en: 'A Comprehensive Framework for Enterprise Vulnerability & Resilience',
      fr: 'Un Cadre Intégré pour la Vulnérabilité et la Résilience de l’Entreprise',
    },
    synopsis: {
      en: 'A comprehensive management manual detailing quantitative enterprise risk management (ERM), internal controls, scenario stress-testing, and compliance alignment across volatile market environments.',
      fr: 'Un manuel de référence détaillant la gestion quantitative des risques d’entreprise (ERM), le contrôle interne, les tests de résistance de scénarios et l’alignement de conformité dans des environnements de marché volatils.',
    },
    academic_category: 'Enterprise Risk Management',
    cover_image_url: '/images/books/business-risk-management.jpg',
    total_pages: 266,
    publish_date: '2020-07-01',
    publisher: 'IEM Press',
    is_featured: false,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Enterprise Risk Taxonomy: Operational, Market & Credit Exposures',
          fr: 'Taxonomie des Risques d’Entreprise : Expositions Opérationnelles, de Marché et de Crédit',
        },
        summary: {
          en: 'Establishes holistic measurement frameworks for systemic risk.',
          fr: 'Établit des cadres de mesure holistiques du risque systémique.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Scenario Analysis, Stress Testing & Business Continuity Protocols',
          fr: 'Analyse de Scénarios, Tests de Résistance et Continuité d’Activité',
        },
        summary: {
          en: 'Formulates dynamic stress testing for cash reserves and supply chain liquidity buffers.',
          fr: 'Formule des tests de résistance dynamiques pour les réserves de trésorerie et la chaîne d’approvisionnement.',
        },
      },
      {
        number: 3,
        title: {
          en: 'Board Governance, Audit Committees & Risk Culture Alignment',
          fr: 'Gouvernance du Conseil, Comités d’Audit et Culture du Risque',
        },
        summary: {
          en: 'Embeds proactive risk oversight into boardroom steering and executive remuneration policies.',
          fr: 'Intègre le pilotage proactif des risques dans la gouvernance du conseil et les rémunérations de direction.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Practical risk assessment templates and risk appetite matrices for corporate boards.',
        fr: 'Matrices d’appétit pour le risque et modèles d’évaluation pour conseils d’administration.',
      },
      {
        en: 'Actionable methodology for harmonizing COSO ERM standards with corporate governance codes.',
        fr: 'Méthodologie opérationnelle d’harmonisation des référentiels COSO avec les codes de gouvernance.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-brm-101',
        book_id: 'book-business-risk-management',
        format: 'digital_pdf',
        price_cents: 2900,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/business-risk-management.pdf',
        sku: 'KMK-BRM-PDF',
      },
      {
        id: 'fmt-brm-102',
        book_id: 'book-business-risk-management',
        format: 'physical_paperback',
        price_cents: 3800,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-BRM-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-brm-101',
        book_id: 'book-business-risk-management',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/dp/1947662864',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-corporate-fraud-risk-management',
    slug: 'corporate-fraud-risk-management',
    isbn: '978-1-94766-290-2',
    title: {
      en: 'Corporate Fraud Risk Management',
      fr: 'Gestion des Risques de Fraude en Entreprise',
    },
    subtitle: {
      en: 'Preventative Controls, Forensic Detection & Whistleblower Frameworks',
      fr: 'Contrôles Préventifs, Détection Forensique et Dispositifs d’Alerte Professionnelle',
    },
    synopsis: {
      en: 'Essential treatise for senior executives and internal auditors establishing systemic defenses against corporate misappropriation, financial statement falsification, and bribery.',
      fr: 'Traité indispensable pour dirigeants et auditeurs internes instaurant des défenses systémiques contre les détournements d’actifs, la falsification des états financiers et la corruption.',
    },
    academic_category: 'Forensic Accounting & Corporate Fraud',
    cover_image_url: '/images/books/corporate-fraud-risk-management.jpg',
    total_pages: 310,
    publish_date: '2020-06-15',
    publisher: 'IEM Press / Christian Faith Publishing',
    is_featured: false,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Anti-Fraud Governance Architecture & Tone at the Top',
          fr: 'Architecture de Gouvernance Anti-Fraude et Exemplarité du Sommet',
        },
        summary: {
          en: 'Designs whistleblower mechanisms and independent fraud investigative charters.',
          fr: 'Conçoit les dispositifs d’alerte éthique et les chartes d’enquête interne.',
        },
      },
      {
        number: 2,
        title: {
          en: 'Digital Auditing: Detecting Asset Misappropriation & Financial Tampering',
          fr: 'Audit Numérique : Détection des Détournements d’Actifs et Manipulations Comptables',
        },
        summary: {
          en: 'Applies automated transaction surveillance, Benford analysis, and journal-entry anomaly scoring.',
          fr: 'Applique la surveillance automatisée des transactions, l’analyse de Benford et le scoring des écritures comptables.',
        },
      },
      {
        number: 3,
        title: {
          en: 'Investigative Interviews, Chain of Custody & Judicial Referral',
          fr: 'Entretiens d’Investigation, Chaîne de Preuve et Transmission Judiciaire',
        },
        summary: {
          en: 'Details evidentiary interview techniques and preserving forensic integrity for financial litigation.',
          fr: 'Détaille les techniques d’audition probatoire et la préservation de l’intégrité forensique devant la justice.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Step-by-step corporate fraud risk assessment protocol with compliance checklists.',
        fr: 'Protocole complet d’évaluation du risque de fraude avec grilles de conformité.',
      },
      {
        en: 'Practical guidelines for conducting internal investigations compliant with international legal standards.',
        fr: 'Directives pratiques pour conduire des investigations internes conformes aux standards juridiques internationaux.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-cfrm-101',
        book_id: 'book-corporate-fraud-risk-management',
        format: 'digital_pdf',
        price_cents: 3100,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/corporate-fraud-risk-management.pdf',
        sku: 'KMK-CFRM-PDF',
      },
      {
        id: 'fmt-cfrm-102',
        book_id: 'book-corporate-fraud-risk-management',
        format: 'digital_epub',
        price_cents: 2600,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/corporate-fraud-risk-management.epub',
        sku: 'KMK-CFRM-EPUB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-cfrm-101',
        book_id: 'book-corporate-fraud-risk-management',
        platform_name: 'Amazon Kindle (English Edition)',
        retail_url: 'https://www.amazon.com/dp/B089QTD6BP',
        is_active: true,
      },
      {
        id: 'ret-cfrm-102',
        book_id: 'book-corporate-fraud-risk-management',
        platform_name: 'Amazon Kindle (Édition Française)',
        retail_url: 'https://www.amazon.com/dp/B089QTSHBS',
        is_active: true,
      },
    ],
  },
  {
    id: 'book-4',
    slug: 'mind-the-gap-bottom-line-and-ethical-behaviour',
    isbn: '978-1-64349-912-0',
    title: {
      en: 'Mind the Gap: The Bottom Line and Ethical Behaviour',
      fr: 'Combler l’Écart : Rentabilité Financière et Éthique de Gouvernance',
    },
    subtitle: {
      en: 'How Volkswagen Failed to Reconcile the Two?',
      fr: 'Comment Volkswagen a Échoué à Réconcilier les Deux ?',
    },
    synopsis: {
      en: 'An incisive examination of corporate governance, board oversight, and ESG accountability through the lens of the Volkswagen emissions scandal—demonstrating how ethical blind spots destroy long-term shareholder and societal value.',
      fr: 'Une analyse approfondie de la gouvernance d’entreprise, de la supervision du conseil d’administration et de la responsabilité ESG à travers l’étude du scandale Volkswagen.',
    },
    academic_category: 'Corporate Governance & ESG',
    cover_image_url: '/assets/books/mind-the-gap-esg.svg',
    total_pages: 264,
    publish_date: '2020-05-18',
    publisher: 'Christian Faith Publishing',
    is_featured: false,
    status: 'published',
    chapters: [
      {
        number: 1,
        title: {
          en: 'Boardroom Architecture & The Illusion of Compliance',
          fr: 'Architecture du Conseil d’Administration et l’Illusion de la Conformité',
        },
        summary: {
          en: 'Examines dual-board governance vulnerabilities when technical compliance is decoupled from ethical leadership.',
          fr: 'Examine les vulnérabilités de gouvernance lorsque la conformité technique est dissociée du leadership éthique.',
        },
      },
    ],
    key_takeaways: [
      {
        en: 'Essential ESG case study for board directors, regulators, and institutional investors.',
        fr: 'Étude de cas ESG essentielle pour les administrateurs de sociétés, régulateurs et investisseurs institutionnels.',
      },
    ],
    book_formats: [
      {
        id: 'fmt-401',
        book_id: 'book-4',
        format: 'digital_pdf',
        price_cents: 2600,
        currency: 'USD',
        is_available: true,
        file_storage_path: 'private-books/mind-the-gap.pdf',
        sku: 'KMK-MTG-PDF',
      },
      {
        id: 'fmt-402',
        book_id: 'book-4',
        format: 'physical_paperback',
        price_cents: 3400,
        currency: 'USD',
        is_available: true,
        sku: 'KMK-MTG-PB',
      },
    ],
    third_party_retailers: [
      {
        id: 'ret-401',
        book_id: 'book-4',
        platform_name: 'Amazon Global',
        retail_url: 'https://www.amazon.com/s?k=Kelly+Mua+Kingsly+Mind+the+Gap+Volkswagen',
        is_active: true,
      },
    ],
  },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'analyzing-bvmac-liquidity-paradigms-central-africa',
    title: {
      en: 'Analyzing BVMAC Liquidity Paradigms and Sovereign Bond Depth in Central Africa',
      fr: 'Analyse des Paradigmes de Liquidité de la BVMAC et Profondeur du Marché Obligataire en Afrique Centrale',
    },
    excerpt: {
      en: 'A strategic policy assessment of post-unification market microstructure across the CEMAC zone, examining institutional investor participation and secondary market clearing mechanisms.',
      fr: 'Une évaluation stratégique de la microstructure du marché financier unifié de la CEMAC, examinant la participation des investisseurs institutionnels et la liquidité secondaire.',
    },
    category: 'Capital Markets',
    tags: ['BVMAC', 'COSUMAF', 'CEMAC', 'Sovereign Bonds', 'Capital Markets'],
    estimated_read_minutes: 8,
    doi_reference: 'KMK-PB-2026-01',
    published_at: '2026-09-18',
    status: 'published',
    content_sections: [
      {
        heading: {
          en: '1. Structural Context: Unification of the Regional Exchange',
          fr: '1. Contexte Structurel : L’Unification de la Bourse Régionale',
        },
        body: {
          en: 'The consolidation of the Central African financial market under the single exchange architecture of BVMAC and the regulatory supervision of COSUMAF established an essential institutional foundation. However, transforming primary sovereign bond syndications into an active, liquid secondary market requires targeted structural incentives for non-bank institutional investors, including pension funds and insurance underwriters.',
          fr: 'La consolidation du marché financier d’Afrique centrale autour de la BVMAC et sous la supervision de la COSUMAF a posé un socle institutionnel déterminant. Toutefois, convertir le dynamisme du marché primaire des titres publics en un marché secondaire liquide exige des incitations structurelles ciblées en direction des investisseurs institutionnels non bancaires.',
        },
      },
      {
        heading: {
          en: '2. Deepening Maturity Curves and De-Risking Infrastructure Issuances',
          fr: '2. Allongement de la Courbe des Taux et Sécurisation des Émissions d’Infrastructures',
        },
        body: {
          en: 'When sovereign issuers coordinate closely with multilateral guarantee institutions such as ATIDI and regional development banks, credit-enhanced project bonds can attract long-term domestic and international capital without overburdening short-term treasury liquidity.',
          fr: 'Lorsque les émetteurs souverains coordonnent leurs opérations avec des institutions multilatérales de garantie telles que l’ATIDI et les banques de développement, les obligations de projet rehaussées permettent de mobiliser l’épargne longue sans alourdir la trésorerie à court terme.',
        },
      },
    ],
  },
  {
    id: 'post-2',
    slug: 'sovereign-green-bonds-and-climate-resilient-debt-frameworks',
    title: {
      en: 'Sovereign Green Bonds & Climate-Resilient Debt Frameworks in Emerging Economies',
      fr: 'Obligations Vertes Souveraines et Cadres de Dette Résiliente au Climat dans les Économies Émergentes',
    },
    excerpt: {
      en: 'How the Global Green Bond Initiative (UNDP-GEF) and rigorous use-of-proceeds verification can lower sovereign borrowing costs while financing Congo Basin biodiversity and clean infrastructure.',
      fr: 'Comment l’Initiative Mondiale sur les Obligations Vertes (PNUD-FEM) et la traçabilité rigoureuse des fonds permettent d’optimiser le coût de financement souverain tout en protégeant le Bassin du Congo.',
    },
    category: 'ESG & Climate Finance',
    tags: ['Green Bonds', 'UNDP-GEF', 'Climate Finance', 'Sovereign Debt', 'ESG'],
    estimated_read_minutes: 7,
    doi_reference: 'KMK-PB-2026-02',
    published_at: '2026-08-04',
    status: 'published',
    content_sections: [
      {
        heading: {
          en: '1. Aligning Sovereign Fiscal Architecture with Green Taxonomies',
          fr: '1. Aligner l’Architecture Budgétaire Souveraine avec les Taxonomies Vertes',
        },
        body: {
          en: 'Credible thematic sovereign issuances depend on auditable budget tagging, independent second-party opinions (SPOs), and transparent impact reporting. Integrating environmental expenditure tracking directly within state treasury execution prevents greenwashing and unlocks concessional blended finance.',
          fr: 'La crédibilité des émissions souveraines thématiques repose sur un marquage budgétaire vérifiable, des avis indépendants (SPO) et un reporting d’impact rigoureux. L’intégration du suivi environnemental au cœur de l’exécution du Trésor prévient l’écoblanchiment et ouvre l’accès aux financements mixtes.',
        },
      },
    ],
  },
  {
    id: 'post-3',
    slug: 'forensic-audit-controls-in-modern-public-financial-management',
    title: {
      en: 'Embedding Preventive Forensic Audit Controls in Public Financial Management (PFM)',
      fr: 'Intégrer les Contrôles Préventifs d’Audit Judiciaire dans la Gestion des Finances Publiques (GFP)',
    },
    excerpt: {
      en: 'Moving beyond ex-post compliance inspections toward continuous quantitative red-flag screening across state treasury disbursements and public procurement.',
      fr: 'Dépasser les contrôles de conformité a posteriori pour instaurer une détection quantitative continue des signaux d’alerte sur la chaîne de la dépense publique.',
    },
    category: 'Forensic Auditing & Integrity',
    tags: ['Forensic Accounting', 'PFM', 'Fraud Detection', 'Public Treasury'],
    estimated_read_minutes: 9,
    doi_reference: 'KMK-PB-2026-03',
    published_at: '2026-06-12',
    status: 'published',
    content_sections: [
      {
        heading: {
          en: '1. Continuous Anomaly Detection in Treasury Single Accounts',
          fr: '1. Détection Continue d’Anomalies au sein du Compte Unique du Trésor',
        },
        body: {
          en: 'As state budgets expand in scale and complexity, manual sampling is no longer sufficient. Embedding automated Benford distribution checks, vendor-beneficiary cross-matching, and split-requisition alerts inside integrated financial management information systems (IFMIS) intercepts irregularities prior to settlement.',
          fr: 'Face à l’accroissement des volumes budgétaires, l’échantillonnage manuel ne suffit plus. L’intégration de tests automatisés de distribution de Benford et de recoupements des bénéficiaires effectifs au sein des systèmes d’information financière permet d’intercepter les irrégularités avant le décaissement.',
        },
      },
    ],
  },
  {
    id: 'post-4',
    slug: 'multilateral-risk-mitigation-and-african-trade-finance',
    title: {
      en: 'Multilateral Risk Mitigation and Sovereign Credit Enhancement in African Trade Finance',
      fr: 'Atténuation Multilatérale des Risques et Rehaussement de Crédit Souverain en Afrique',
    },
    excerpt: {
      en: 'Examining the catalytic role of multilateral political risk insurance and credit guarantees in narrowing the African risk perception premium.',
      fr: 'Analyse du rôle catalyseur de l’assurance contre le risque politique et des garanties multilatérales dans la réduction de la prime de risque perçue en Afrique.',
    },
    category: 'Sovereign Debt & PFM',
    tags: ['ATIDI', 'Trade Finance', 'Credit Enhancement', 'Multilateral Governance'],
    estimated_read_minutes: 6,
    doi_reference: 'KMK-PB-2026-04',
    published_at: '2026-04-29',
    status: 'published',
    content_sections: [
      {
        heading: {
          en: '1. Correcting Asymmetric Risk Pricing through Multilateral Guarantees',
          fr: '1. Corriger l’Asymétrie de Tarification du Risque par les Garanties Multilatérales',
        },
        body: {
          en: 'Empirical default rates on African infrastructure and sovereign-backed trade obligations consistently outperform market-implied credit spreads. Multilateral insurers with preferred-creditor status bridge this gap by absorbing political and payment-delay risks, unlocking longer maturities from global commercial syndicates.',
          fr: 'Les taux de défaut empiriques sur les projets d’infrastructures en Afrique demeurent nettement inférieurs aux primes de risque implicites du marché. Les assureurs multilatéraux bénéficiant du statut de créancier privilégié permettent de réduire cet écart et d’allonger les maturités bancaires.',
        },
      },
    ],
  },
];

export const MEDIA_APPEARANCES: MediaAppearance[] = [
  {
    id: 'media-video-atidi-25th-speech',
    is_pinned: true,
    title: {
      en: 'Official Keynote: Prof. Kelly Mua Kingsly Speech at the 25th Anniversary Celebrations of ATIDI',
      fr: 'Allocution Officielle : Discours du Pr Kelly Mua Kingsly lors des Célébrations du 25e Anniversaire de l’ATIDI',
    },
    type: 'Keynote Address',
    category: 'broadcast',
    venue: 'ATIDI 25th Anniversary Gala / Institutional Broadcast',
    date: '2025',
    location: 'Nairobi, Kenya (Pan-African Multilateral)',
    summary: {
      en: 'Keynote address by Board Chairman Prof. Kelly Mua Kingsly celebrating a quarter-century of multilateral credit insurance, trade de-risking, and cross-border commercial underwriting across Africa, honoring foundational milestones and charting the 2025–2030 continental vision.',
      fr: 'Allocution solennelle du Président du Conseil d’administration, le Pr Kelly Mua Kingsly, célébrant un quart de siècle d’assurance-crédit multilatérale et de dé-risquage commercial en Afrique, dressant le bilan des réalisations et traçant la vision continentale 2025-2030.',
    },
    source_url: 'https://www.youtube.com/watch?v=SSnFs_7JE5k',
    caption: {
      en: 'Twenty-five years of ATIDI demonstrates that African risk can be underwritten prudently, sustainably, and profitably when multilateral discipline meets sovereign determination.',
      fr: 'Vingt-cinq années d’existence de l’ATIDI démontrent que le risque africain peut être garanti avec rigueur, pérennité et rentabilité lorsque la discipline multilatérale s’allie à la volonté souveraine.',
    },
    video_metadata: {
      youtube_id: 'SSnFs_7JE5k',
      duration: '18:45',
      caption_note: {
        en: 'Closed Captions (CC) available in English & French · Pinned Keynote Feature',
        fr: 'Sous-titres (CC) disponibles en anglais et français · Allocution officielle à la une',
      },
    },
  },
  {
    id: 'media-broadcast-africa24',
    title: {
      en: 'Guest of the Day: Prof. Kelly Mua Kingsly on African Stock Exchanges & Capital Market Fragmentation',
      fr: 'Invité du Jour : Pr Kelly Mua Kingsly sur les Bourses Africaines et la Fragmentation des Marchés de Capitaux',
    },
    type: 'Broadcast Interview',
    category: 'broadcast',
    venue: 'Africa24 English · Special Guest of the Day',
    date: '2024-10-18',
    location: 'Nairobi / Pan-African Broadcast',
    summary: {
      en: 'Broadcast interview on Africa24 analyzing why African stock exchanges account for only 0.4% of global market capitalization despite massive industrialization capital needs. Prof. Kingsly articulates strategic imperatives to overcome liquidity constraints, reduce market fragmentation, and catalyze domestic institutional capital.',
      fr: 'Entretien télévisé sur Africa24 analysant les défis structurels des bourses africaines, qui ne représentent que 0,4 % de la capitalisation mondiale malgré d’immenses besoins d’infrastructures. Le Pr Kingsly expose les leviers pour remédier au manque de liquidité, surmonter la fragmentation et mobiliser l’épargne institutionnelle locale.',
    },
    source_url: 'https://www.youtube.com/watch?v=immOAR9skzI',
    caption: {
      en: 'Africa accounts for less than 1% of global capital market capitalization despite representing a fifth of world population. Our strategic imperative is eliminating liquidity traps and mobilizing sovereign domestic capital into cross-border industrial assets.',
      fr: 'L’Afrique représente moins de 1 % de la capitalisation boursière mondiale alors qu’elle compte un cinquième de l’humanité. L’impératif stratégique consiste à éliminer les pièges de liquidité et à mobiliser l’épargne souveraine locale vers l’appareil productif.',
    },
    video_metadata: {
      youtube_id: 'immOAR9skzI',
      duration: '14:20',
      caption_note: {
        en: 'Closed Captions (CC) available in English & French · Africa24 Special Guest Broadcast',
        fr: 'Sous-titres (CC) disponibles en anglais et français · Diffusion spéciale Invité Africa24',
      },
    },
  },
  {
    id: 'media-video-impact-voices',
    title: {
      en: 'Prof. Kelly Mua Kingsley: Financial Engineer, Scholar & Transformational Entrepreneur',
      fr: 'Pr Kelly Mua Kingsley : Ingénieur Financier, Universitaire et Entrepreneur de l’Impact',
    },
    type: 'Broadcast Interview',
    category: 'broadcast',
    venue: 'Impact Voices Africa with Beverly Ndifoin',
    date: '2021',
    location: 'International Broadcast',
    summary: {
      en: 'Extended biographical dialogue exploring financial engineering, executive mentorship of over 10,000 professionals, rural micro-credit empowerment for women farmers, and early-stage capital syndication for African youth.',
      fr: 'Dialogue biographique approfondi sur l’ingénierie financière, le mentorat de plus de 10 000 cadres dans le monde, l’autonomisation rurale des agricultrices par le micro-crédit et le financement de startups de jeunes africains.',
    },
    source_url: 'https://www.youtube.com/watch?v=_3W-T5KSoqc',
    caption: {
      en: 'Impact is fundamentally about leadership; we all are leaders in our spheres, and the measure of true wealth is the human capacity we emancipate.',
      fr: 'L’impact est l’essence même du leadership ; nous sommes tous des leaders dans nos domaines, et la véritable richesse réside dans le potentiel humain que nous émancipons.',
    },
    video_metadata: {
      youtube_id: '_3W-T5KSoqc',
      duration: '28:10',
      caption_note: {
        en: 'Closed Captions (CC) available in English · Impact Voices Africa Feature',
        fr: 'Sous-titres (CC) disponibles en anglais · Entretien Impact Voices Africa',
      },
    },
  },
  {
    id: 'media-video-prc-tv-bottom-line',
    title: {
      en: 'The Economic Bottom Line: Sovereign Fiscal Policy & Debt Strategy with Prof. Kelly Mua Kingsley',
      fr: 'The Economic Bottom Line : Politique Budgétaire et Stratégie de Dette avec le Pr Kelly Mua Kingsley',
    },
    type: 'Broadcast Interview',
    category: 'broadcast',
    venue: 'PRC TV · The Economic Bottom Line',
    date: '2023',
    location: 'Yaoundé / Pan-African',
    summary: {
      en: 'Special broadcast interview examining state liquidity management, sovereign bond pricing, fiscal consolidation mechanisms, and the economic bottom line for Central African growth.',
      fr: 'Grand entretien télévisé analysant la gestion de la trésorerie de l’État, la tarification des obligations souveraines, les leviers d’assainissement budgétaire et la résilience macro-financière en zone CEMAC.',
    },
    source_url: 'https://www.youtube.com/watch?v=BQl_aZkXgTE',
    caption: {
      en: 'Sovereign fiscal resilience is not achieved through austerity alone, but through disciplined revenue mobilization, predictive treasury budgeting, and capital market depth.',
      fr: 'La résilience budgétaire souveraine ne résulte pas de la seule rigueur, mais d’une mobilisation rigoureuse des recettes, d’une trésorerie prédictive et de la profondeur du marché des capitaux.',
    },
    video_metadata: {
      youtube_id: 'BQl_aZkXgTE',
      duration: '22:15',
      caption_note: {
        en: 'Closed Captions (CC) available in English · PRC TV Special Interview',
        fr: 'Sous-titres (CC) disponibles en anglais · Entretien spécial PRC TV',
      },
    },
  },
  {
    id: 'media-video-housing-infrastructure',
    title: {
      en: 'Unlocking Capital and Blended Partnerships for African Housing and Urban Infrastructure',
      fr: 'Mobiliser les Capitaux et Partenariats Mixtes pour le Logement et les Infrastructures en Afrique',
    },
    type: 'Keynote Address',
    category: 'broadcast',
    venue: 'Africa Real Estate & Business Insights',
    date: '2024',
    location: 'Pan-African Forum',
    summary: {
      en: 'Policy address on structuring blended finance facilities, institutional mortgage liquidity, and multilateral guarantees to resolve the continental urban infrastructure and affordable housing deficit.',
      fr: 'Intervention sur la structuration de financements mixtes, les facilités de liquidité hypothécaire et les garanties multilatérales pour combler le déficit de logements sociaux et d’infrastructures urbaines.',
    },
    source_url: 'https://www.youtube.com/watch?v=Sb7c6hfjvUQ',
    caption: {
      en: 'Urban infrastructure cannot rely solely on commercial bank loans; it requires structured project bonds with credit enhancements that pension funds and insurers can safely hold.',
      fr: 'Les infrastructures urbaines ne peuvent reposer sur le seul crédit bancaire court terme ; elles exigent des obligations de projet adossées à des garanties adaptées aux caisses de retraite.',
    },
    video_metadata: {
      youtube_id: 'Sb7c6hfjvUQ',
      duration: '16:40',
      caption_note: {
        en: 'Closed Captions (CC) available in English · Africa Real Estate & Business Insights',
        fr: 'Sous-titres (CC) disponibles en anglais · Africa Real Estate & Business Insights',
      },
    },
  },
  {
    id: 'media-video-cabri-covid-impact',
    title: {
      en: 'Economic and Financial Impact of Covid-19 in Cameroon: Sovereign Treasury Diagnostic',
      fr: 'Impact Économique et Financier du Covid-19 au Cameroun : Diagnostic du Trésor Public',
    },
    type: 'Ministerial Panel',
    category: 'broadcast',
    venue: 'Collaborative Africa Budget Reform Initiative (CABRI)',
    date: '2020',
    location: 'Pretoria / Yaoundé (Pan-African)',
    summary: {
      en: 'Sovereign treasury presentation delivered to ministerial delegations across Africa evaluating the fiscal shock of Covid-19, emergency stimulus reprioritization, and resilient cash-buffer management in Cameroon.',
      fr: 'Présentation de haut niveau devant les délégations ministérielles africaines évaluant le choc budgétaire de la crise sanitaire, la réallocation des dépenses d’urgence et la gestion des réserves de trésorerie au Cameroun.',
    },
    source_url: 'https://www.youtube.com/watch?v=cy8U6Lnk7aE',
    caption: {
      en: 'Crisis budgeting tests sovereign liquidity resilience; preserving essential public spending while safeguarding sovereign debt sustainability is the hallmark of modern fiscal leadership.',
      fr: 'La budgétisation de crise éprouve la résilience de la trésorerie souveraine ; préserver les dépenses vitales tout en maintenant la soutenabilité de la dette caractérise le leadership budgétaire.',
    },
    video_metadata: {
      youtube_id: 'cy8U6Lnk7aE',
      duration: '19:30',
      caption_note: {
        en: 'Closed Captions (CC) available in French & English · CABRI Ministerial Series',
        fr: 'Sous-titres (CC) disponibles en français et anglais · Série ministérielle CABRI',
      },
    },
  },
  {
    id: 'media-video-professorship-induction',
    title: {
      en: 'Solemn Academic Induction into the Full Professorial Rank: Professor Kelly Mua Kingsly',
      fr: 'Cérémonie Solennelle d’Intronisation au Grade de Professeur Titulaire : Pr Kelly Mua Kingsly',
    },
    type: 'Academic Lecture',
    category: 'academic',
    venue: 'University Senate & Academic Induction Council',
    date: '2021',
    location: 'International Academic Convocation',
    summary: {
      en: 'Solemn university induction ceremony conferring the rank of Full Professor of Forensic Accounting and Public Policy upon Prof. Kelly Mua Kingsly, celebrating decades of peer-reviewed research, doctoral supervision, and statutory treatises.',
      fr: 'Cérémonie solennelle consacrant l’accession au grade de Professeur Titulaire en comptabilité judiciaire et politiques publiques du Pr Kelly Mua Kingsly, saluant ses traités de référence et la direction de thèses doctorales.',
    },
    source_url: 'https://www.youtube.com/watch?v=taOPS1LwQvw',
    caption: {
      en: 'True academic scholarship must serve public integrity; our forensic research is incomplete until it arms statutory auditors with verifiable tools to protect public wealth.',
      fr: 'L’excellence académique doit être au service de l’intégrité publique ; nos travaux en audit forensique ne valent que s’ils outillent concrètement les magistrats pour protéger le bien commun.',
    },
    video_metadata: {
      youtube_id: 'taOPS1LwQvw',
      duration: '11:50',
      caption_note: {
        en: 'Closed Captions (CC) available · Full Professorship Induction Ceremony',
        fr: 'Sous-titres (CC) disponibles · Cérémonie d’intronisation professorale',
      },
    },
  },
  {
    id: 'media-video-africa24-newsroom',
    title: {
      en: 'Africa Newsroom: Re-engineering African Stock Exchanges to Finance Continental Growth',
      fr: 'Africa Newsroom : Bourses Africaines, Financer Autrement les Économies du Continent',
    },
    type: 'Broadcast Interview',
    category: 'broadcast',
    venue: 'Africa 24 · Africa Newsroom',
    date: '2024',
    location: 'Paris / Pan-African Broadcast',
    summary: {
      en: 'In-depth television newsroom debate exploring alternative financing models for African economies, cross-listing sovereign bonds, harmonizing regulatory taxonomies, and expanding domestic institutional investor appetite.',
      fr: 'Débat télévisé approfondi explorant les modèles alternatifs de financement en Afrique, la double cotation des titres publics, l’harmonisation réglementaire et l’attrait des investisseurs institutionnels locaux.',
    },
    source_url: 'https://www.youtube.com/watch?v=phMj0J40b-s',
    caption: {
      en: 'African bourses cannot remain passive quotation boards; they must become active development engines that channel domestic pension savings directly into real infrastructure.',
      fr: 'Les bourses africaines ne peuvent rester de simples plateformes de cotation passive ; elles doivent devenir des moteurs actifs canalisant l’épargne vers l’économie réelle.',
    },
    video_metadata: {
      youtube_id: 'phMj0J40b-s',
      duration: '12:45',
      caption_note: {
        en: 'Closed Captions (CC) available in French & English · Africa 24 Newsroom',
        fr: 'Sous-titres (CC) disponibles en français et anglais · Africa 24 Newsroom',
      },
    },
  },
  {
    id: 'media-video-culture-identity',
    title: {
      en: 'Culture is Our Identity: Leveraging Diaspora Leadership and Heritage for Sustainable Development',
      fr: 'La Culture est Notre Identité : Mobiliser le Leadership de la Diaspora pour le Développement',
    },
    type: 'Policy Interview',
    category: 'broadcast',
    venue: 'Pan-African Daily TV with Dr. Susan Tatah',
    date: '2023',
    location: 'Vienna / Pan-African Diaspora Forum',
    summary: {
      en: 'Dialogue examining the economic impact of diaspora repatriation, cultural identity as an anchor for institutional ethics, and strategic mechanisms to channel diaspora remittances into sovereign capital investments.',
      fr: 'Entretien sur l’impact économique du retour de la diaspora, l’ancrage culturel comme socle d’éthique institutionnelle et les mécanismes pour orienter les transferts de fonds vers des obligations productives.',
    },
    source_url: 'https://www.youtube.com/watch?v=8MA7rPE2Jds',
    caption: {
      en: 'Our cultural identity is not a relic of the past; it is the ethical compass that guides fiscal integrity and inspires our diaspora to reinvest expertise and capital into African soil.',
      fr: 'Notre identité culturelle n’est pas un vestige ; elle constitue la boussole éthique qui fonde l’intégrité financière et incite la diaspora à réinvestir ses compétences en Afrique.',
    },
    video_metadata: {
      youtube_id: '8MA7rPE2Jds',
      duration: '25:05',
      caption_note: {
        en: 'Closed Captions (CC) available · Pan-African Daily TV Interview',
        fr: 'Sous-titres (CC) disponibles · Entretien Pan-African Daily TV',
      },
    },
  },
  {
    id: 'media-video-crtv-forensic-ethics',
    title: {
      en: 'CRTV National Broadcast: Presentation of "Forensic Account and Ethics" by Prof. Kelly M. Kingsly',
      fr: 'Édition Spéciale CRTV : Présentation de l’Ouvrage "Forensic Account and Ethics" du Pr Kelly M. Kingsly',
    },
    type: 'Broadcast Interview',
    category: 'broadcast',
    venue: 'CRTV (Cameroon Radio Television) · Special Feature',
    date: '2019',
    location: 'Yaoundé, Cameroon',
    summary: {
      en: 'National television coverage of the institutional book launch of "Forensic Account and Ethics", presenting modern quantitative diagnostics and corporate governance safeguards to statutory auditing authorities.',
      fr: 'Grand reportage de la télévision nationale camerounaise sur la présentation institutionnelle de l’ouvrage "Forensic Account and Ethics", exposant les méthodes modernes de détection de la fraude aux corps de contrôle de l’État.',
    },
    source_url: 'https://www.youtube.com/watch?v=7BXr_44r_Ac',
    caption: {
      en: 'Accountability cannot exist without evidentiary standards; forensic accounting arms the legal system with undeniable financial facts to safeguard sovereign credibility.',
      fr: 'La redevabilité ne saurait exister sans rigueur probatoire ; la comptabilité judiciaire fournit à la justice des faits financiers irréfutables pour préserver la crédibilité de l’État.',
    },
    video_metadata: {
      youtube_id: '7BXr_44r_Ac',
      duration: '15:20',
      caption_note: {
        en: 'Closed Captions (CC) available in English & French · CRTV National Broadcast',
        fr: 'Sous-titres (CC) disponibles en anglais et français · Diffusion nationale CRTV',
      },
    },
  },
  {
    id: 'media-video-future-africa-economy',
    title: {
      en: 'The Future of Africa’s Economy: Sovereign Wealth, Resource Governance and Continental Prosperity',
      fr: 'L’Avenir de l’Économie Africaine : Souveraineté Budgétaire, Gestion des Ressources et Prospérité',
    },
    type: 'Policy Interview',
    category: 'broadcast',
    venue: 'Pan-African Daily TV with Dr. Susan Tatah',
    date: '2023',
    location: 'International Broadcast',
    summary: {
      en: 'Strategic vision addressing sovereign wealth creation, domestic processing of raw commodities, debt re-engineering, and establishing robust capital market infrastructures across Sub-Saharan Africa.',
      fr: 'Vision stratégique sur la création de richesse souveraine, la transformation locale des matières premières, le réaménagement de la dette et l’édification d’infrastructures de marché de capitaux en Afrique.',
    },
    source_url: 'https://www.youtube.com/watch?v=JSOfK6ea8Lw',
    caption: {
      en: 'Africa’s prosperity will not be donated from abroad; it will be engineered through local value addition, robust treasury governance, and integrated continental capital markets.',
      fr: 'La prospérité de l’Afrique ne viendra pas de l’extérieur ; elle sera forgée par la transformation locale, une gouvernance budgétaire rigoureuse et des marchés de capitaux intégrés.',
    },
    video_metadata: {
      youtube_id: 'JSOfK6ea8Lw',
      duration: '21:40',
      caption_note: {
        en: 'Closed Captions (CC) available · Pan-African Daily TV Special Feature',
        fr: 'Sous-titres (CC) disponibles · Émission spéciale Pan-African Daily TV',
      },
    },
  },
  {
    id: 'media-video-crtv-emprunt-obligataire',
    title: {
      en: 'State Bond Issue Ecmr 2022–2029: Public Treasury Operations & Regional Capital Mobilization',
      fr: 'Ressources (CRTV) : Dossier sur l’Emprunt Obligataire Ecmr 2022–2029 et les Opérations du Trésor',
    },
    type: 'Policy Interview',
    category: 'broadcast',
    venue: 'CRTV Économie · Émission Ressources avec R. Gwladys Lebouda',
    date: '2022-05-25',
    location: 'Yaoundé, Cameroon',
    summary: {
      en: 'In-depth public finance television dossier detailing the structuring, syndication, and investor appetite for Cameroon’s landmark multi-tranche sovereign bond issue Ecmr 2022–2029 on the BVMAC regional stock exchange.',
      fr: 'Dossier économique télévisé détaillant la structuration technique, le consortium de placement et la sursouscription de l’emprunt obligataire souverain Ecmr 2022-2029 du Cameroun sur la BVMAC.',
    },
    source_url: 'https://www.youtube.com/watch?v=eLPNnUVv2aw',
    caption: {
      en: 'The oversubscription of our sovereign treasury bonds confirms the trust of regional institutional investors in Cameroon’s macroeconomic trajectory and debt servicing credibility.',
      fr: 'La sursouscription de nos emprunts obligataires confirme la confiance solide des investisseurs institutionnels régionaux dans la trajectoire macroéconomique et la signature du Cameroun.',
    },
    video_metadata: {
      youtube_id: 'eLPNnUVv2aw',
      duration: '26:30',
      caption_note: {
        en: 'Closed Captions (CC) available in French · CRTV Économie Ressources',
        fr: 'Sous-titres (CC) disponibles en français · CRTV Économie Ressources',
      },
    },
  },
  {
    id: 'media-video-prc-tv-enjeux-defis',
    title: {
      en: 'Enjeux & Défis: Strategic Public Finance Governance and Sovereign Wealth Protection',
      fr: 'Enjeux & Défis : Gouvernance Stratégique des Finances Publiques et Sauvegarde du Patrimoine de l’État',
    },
    type: 'Policy Interview',
    category: 'broadcast',
    venue: 'PRC TV · Magazine Enjeux et Défis',
    date: '2023',
    location: 'Yaoundé, Cameroon',
    summary: {
      en: 'Television institutional feature analyzing key public finance challenges: streamlining public expenditure execution, mitigating sovereign credit risks, and strengthening state treasury accountability.',
      fr: 'Grand magazine institutionnel analysant les grands défis des finances publiques : fluidification de la dépense, maîtrise des risques budgétaires et renforcement des contrôles de l’État.',
    },
    source_url: 'https://www.youtube.com/watch?v=ngKnXdAuKEM',
    caption: {
      en: 'Modern public finance management requires anticipating risks before they become liabilities, ensuring that every disbursed state franc directly serves sovereign growth.',
      fr: 'La gestion moderne des deniers publics exige d’anticiper les risques avant qu’ils ne deviennent des dettes, garantissant que chaque franc engagé serve directement le développement national.',
    },
    video_metadata: {
      youtube_id: 'ngKnXdAuKEM',
      duration: '17:15',
      caption_note: {
        en: 'Closed Captions (CC) available in French & English · PRC TV Special Magazine',
        fr: 'Sous-titres (CC) disponibles en français et anglais · Magazine spécial PRC TV',
      },
    },
  },
  {
    id: 'media-press-237actu-portrait',
    title: {
      en: 'Cameroon: Prof. Kelly MUA, The Master of Public Finance with Multiple Mandates',
      fr: 'Cameroun : Pr Kelly MUA ou l’AS de la Finance Publique aux Multiples Casquettes',
    },
    type: 'Press Feature',
    category: 'press',
    venue: '237 Actu · Dossier Spécial Économie',
    date: '2022-04-04',
    location: 'Yaoundé, Cameroon',
    image_url: '/images/photos/photo8.jpeg',
    summary: {
      en: 'Detailed national press portrait tracing Prof. Kingsly’s high-level career across state treasury operations, central bank regulatory censorship (BEAC), regional market oversight (COSUMAF), and scholarly authorship in forensic accounting and public management.',
      fr: 'Grand portrait de la presse nationale retraçant la carrière de haut niveau du Pr Kingsly entre la Direction générale du Trésor, le censorat de la BEAC, la supervision financière (COSUMAF) et ses travaux académiques de référence en audit judiciaire.',
    },
    source_url:
      'https://237actu.com/cameroun-pr-kelly-mua-ou-l-as-de-la-finance-publique-aux-multiples-casquettes/',
    caption: {
      en: 'A multi-disciplinary public servant whose mathematical precision in public finance operations is matched by an unwavering commitment to anti-fraud institution building.',
      fr: 'Un serviteur de l’État pluridisciplinaire dont la précision mathématique dans les opérations financières publiques s’accompagne d’un engagement indéfectible envers la transparence institutionnelle.',
    },
  },
  {
    id: 'media-governance-afsic-speaker',
    title: {
      en: 'Keynote Speaker Profile: Prof. Kelly Mua Kingsley at AFSIC – Investing in Africa (London)',
      fr: 'Profil d’Intervenant Principal : Pr Kelly Mua Kingsley à l’AFSIC – Investir en Afrique (Londres)',
    },
    type: 'Institutional Governance',
    category: 'governance',
    venue: 'AFSIC – Investing in Africa (London, United Kingdom)',
    date: '2024-10-08',
    location: 'London, United Kingdom / International',
    image_url: '/images/photos/photo11.jpeg',
    summary: {
      en: 'Official institutional speaker registry for Europe’s premier Africa investment forum, detailing Prof. Kingsly’s mandates as Director of Finance Operations of the State, ATIDI Board Director, BEAC Censor, and pioneer in sovereign debt de-risking.',
      fr: 'Notice officielle d’intervenant au premier sommet d’investissement européen dédié à l’Afrique, détaillant ses fonctions de Directeur des Opérations Financières de l’État, administrateur de l’ATIDI, censeur de la BEAC et pionnier du dé-risquage souverain.',
    },
    source_url: 'https://www.afsic.net/speaker/kelly-kingsley-2024-speaker/',
    caption: {
      en: 'Bridging international institutional syndicates with African sovereign infrastructure requires structured risk mitigation, credit enhancement, and unwavering contractual transparency.',
      fr: 'Connecter les syndicats bancaires internationaux aux infrastructures souveraines africaines exige une atténuation structurée du risque, un rehaussement de crédit et une transparence contractuelle absolue.',
    },
  },
  {
    id: 'media-press-puissance237',
    title: {
      en: 'Kelly Mua Kingsley: New Strategic Leadership for ATIDI and Africa',
      fr: 'Kelly Mua Kingsley : Un Nouveau Leadership Stratégique pour l’ATIDI et l’Afrique',
    },
    type: 'Press Feature',
    category: 'press',
    venue: 'Puissance 237 · Centre Africain de Veille Stratégique (ACCI)',
    date: '2024-10-16',
    location: 'Nairobi / Pan-African',
    image_url: '/images/gallery/capital-markets-dialogue.jpg',
    summary: {
      en: 'Strategic policy analysis on Prof. Kingsly’s election as Chairman of ATIDI, detailing his priorities: mobilizing regional membership for Central African states, strengthening credit ratings, and fostering AfCFTA cross-border commerce.',
      fr: 'Analyse stratégique de veille économique sur l’élection du Pr Kingsly à la présidence de l’ATIDI, détaillant ses priorités : adhésion des pays d’Afrique centrale, consolidation des notations financières et soutien au commerce intra-africain ZLECAf.',
    },
    source_url:
      'https://puissance-237.com/en/kelly-mua-kingsley-new-leadership-for-atidi-and-africa/',
    caption: {
      en: 'The strategic challenge for Africa’s development insurance is clear: transforming perceived risk into insured, bankable assets to fund domestic growth.',
      fr: 'L’enjeu stratégique de l’assurance développement en Afrique est clair : transformer le risque perçu en actifs bancables et sécurisés pour financer la croissance locale.',
    },
  },
  {
    id: 'media-governance-atidi-board',
    title: {
      en: 'Chairman of the Board of Directors: Professor Kelly Mua Kingsly (PhD, DBA, MPA, CFA)',
      fr: 'Président du Conseil d’Administration : Professeur Kelly Mua Kingsly (PhD, DBA, MPA, CFA)',
    },
    type: 'Institutional Governance',
    category: 'governance',
    venue: 'African Trade & Investment Development Insurance (ATIDI)',
    date: '2024 – 2027 Mandate',
    location: 'Nairobi, Kenya (Pan-African Multilateral)',
    image_url: '/images/gallery/dignitaries-reception.jpg',
    summary: {
      en: 'Official multilateral governance registry detailing Prof. Kelly Mua Kingsly’s tenure as Chair of the Board of Directors at ATIDI, overseeing multilateral credit de-risking, political risk guarantees, and sovereign commercial underwriting across 24 member states with over $85 billion in insured transactions.',
      fr: 'Registre officiel de gouvernance multilatérale présentant le Pr Kelly Mua Kingsly en tant que Président du Conseil d’Administration de l’ATIDI, supervisant la couverture des risques politiques, le dé-risquage du crédit et la souscription commerciale dans 24 États membres avec plus de 85 milliards de dollars d’opérations garanties.',
    },
    source_url: 'https://www.atidi.africa/about-us/board-of-directors/',
    caption: {
      en: 'De-risking sovereign cross-border trade requires replacing cost-prohibitive sovereign guarantees with multilateral credit insurance structures recognized by international institutional syndicates.',
      fr: 'La sécurisation du commerce transfrontalier en Afrique exige de substituer aux garanties souveraines onéreuses des structures d’assurance-crédit multilatérales reconnues par les syndicats bancaires internationaux.',
    },
  },
  {
    id: 'media-press-cameroon-ceo',
    title: {
      en: 'Leading Africa’s Investment Future: Prof. Kelly Mua Kingsley at the Helm of ATIDI',
      fr: 'Bâtir l’Avenir des Investissements Africains : Le Prof Kelly Mua Kingsley à la Tête de l’ATIDI',
    },
    type: 'Press Feature',
    category: 'press',
    venue: 'Cameroon CEO Magazine',
    date: '2024-10-15',
    location: 'Pan-African / Yaoundé, Cameroon',
    image_url: '/images/gallery/prof-kelly-signature-keynote.png',
    summary: {
      en: 'In-depth leadership profile exploring Prof. Kingsly’s strategic roadmap to unlock intra-African investment, expand ATIDI membership across the CEMAC sub-region, and deploy de-risking architectures that mobilize international institutional capital for sustainable infrastructure.',
      fr: 'Grand portrait économique analysant la feuille de route stratégique du Pr Kingsly pour dynamiser les investissements intra-africains, intégrer l’ensemble des pays de la CEMAC au sein de l’ATIDI et déployer des mécanismes de garantie souveraine au service des grands projets d’infrastructures.',
    },
    source_url: 'https://cameroonceo.com/2024/10/15/kelly-mua-kingsley-leading-africas-investment-future-as-head-of-atidi/',
    caption: {
      en: 'Leading ATIDI is an institutional mandate to bridge the continental infrastructure financing deficit by rallying all Central African economies into a unified multilateral risk-mitigation umbrella.',
      fr: 'Présider l’ATIDI est une mission institutionnelle visant à combler le déficit de financement des infrastructures en unissant l’ensemble des économies d’Afrique centrale sous un bouclier multilatéral de gestion des risques.',
    },
  },
  {
    id: 'media-press-lavoix-entreprises',
    title: {
      en: 'Commercial Insurance in Africa: Prof. Kelly Mua Kingsley Appointed Board Chair of ATIDI',
      fr: 'Assurance Commerciale en Afrique : Le Prof Kelly Mua Kingsley Nommé à la Tête de l’ATIDI',
    },
    type: 'Press Feature',
    category: 'press',
    venue: 'La Voix des Entreprises',
    date: '2024-10-23',
    location: 'Nairobi, Kenya / Douala, Cameroon',
    image_url: '/images/gallery/ministerial-panel.jpg',
    summary: {
      en: 'Press reporting on the 101st Board session confirming Prof. Kelly Mua Kingsley as Board Chairman (PCA) of ATIDI, detailing his mandate to guide the 2024–2027 strategic plan, accelerate regional economic integration, and leverage investment-grade credit ratings from Moody’s and S&P.',
      fr: 'Compte-rendu de la 101e session du Conseil d’administration confirmant l’élection du Pr Kelly Mua Kingsley comme Président du Conseil (PCA) de l’ATIDI, détaillant son mandat pour conduire le plan stratégique 2024-2027, accélérer l’intégration régionale et valoriser les notations financières de premier ordre.',
    },
    source_url:
      'https://lavoixdesentreprises.info/2024/10/23/assurance-commerciale-en-afrique-le-prof-kelly-mua-kingsley-nomme-a-la-tete-de-latidi/',
    caption: {
      en: 'Strengthening ATIDI\'s equity base and expanding CEMAC membership under our 2024–2027 roadmap allows us to underwrite transformational energy, agricultural, and transport projects across the continent.',
      fr: 'Le renforcement des fonds propres de l’ATIDI et l’adhésion des pays de la CEMAC dans le cadre de notre feuille de route 2024-2027 nous permettent de garantir des projets structurants dans l’énergie, l’agriculture et les transports.',
    },
  },
  {
    id: 'media-press-guardian-post',
    title: {
      en: 'Well Merited: Prof. Kelly Mua Kingsly Elected to Strategic Board Leadership at ATIDI',
      fr: 'Nomination Stratégique Méritée : Le Pr Kelly Mua Kingsly Élu au Conseil d’Administration de l’ATIDI',
    },
    type: 'Press Feature',
    category: 'press',
    venue: 'The Guardian Post (Cameroon) · Issue No. 3164',
    date: '2024-07-12',
    location: 'Livingstone, Zambia / Yaoundé, Cameroon',
    image_url: '/images/gallery/yaounde-hilton-assembly.jpg',
    summary: {
      en: 'Special reporting on the 24th General Assembly in Livingstone where Prof. Kelly Mua Kingsly was elected by member states to represent Constituency Group A (Cameroon, Angola, Malawi, Zambia), advancing trade insurance instruments that support the African Continental Free Trade Area (AfCFTA).',
      fr: 'Reportage exclusif sur la 24e Assemblée générale à Livingstone où le Pr Kelly Mua Kingsly a été élu par les États membres pour représenter le Groupe A (Cameroun, Angola, Malawi, Zambie), soutenant les instruments d’assurance commerciale au service de la ZLECAf.',
    },
    source_url:
      'https://theguardianpostcameroon.com/post/3438/en/well-merited-cameroonian-prof-kelly-mua-gets-strategic-role-at-african-trade-investment-devt-insurance',
    caption: {
      en: 'By pooling political and commercial underwriting risk across Constituency Group A, we directly insulate regional supply chains and unlock private sector trade under the AfCFTA.',
      fr: 'En mutualisant le risque politique et commercial au sein du Groupe A, nous protégeons directement les chaînes d’approvisionnement régionales et stimulons le commerce privé dans le cadre de la ZLECAf.',
    },
  },
  {
    id: 'media-book-corruption-roadmap',
    title: {
      en: 'African Roadmap in the Fight Against Corrupt Practices: An Empirical Forensic Investigation',
      fr: 'Feuille de Route des Pays Africains dans la Lutte Contre les Pratiques de Corruption : Enquête Forensique Empirique',
    },
    type: 'Published Treatise',
    category: 'academic',
    venue: 'Éditions Notre Savoir (ISBN: 978-620-9-25064-4) · Distribution Africa Vivre',
    date: '2025',
    location: 'International Academic Publishing',
    image_url: '/images/books/corporate-fraud-risk-management.jpg',
    summary: {
      en: 'Specialized forensic treatise examining the root drivers of public-sector fraud and corruption across Cameroon and Nigeria. Applying the broken trust paradigm, the author articulates actionable policy roadmaps and statutory audit protocols to restore public integrity.',
      fr: 'Traité spécialisé d’audit forensique analysant les ressorts profonds de la fraude et de la corruption dans le secteur public au Cameroun et au Nigeria. Appliquant le modèle de la confiance rompue, l’ouvrage formule une feuille de route pour restaurer l’intégrité institutionnelle.',
    },
    source_url:
      'https://www.laboutiqueafricavivre.com/livres-specialises/312972-feuille-de-route-des-pays-africains-dans-la-lutte-contre-les-pratiques-de-corruption-9786209250644.html',
    caption: {
      en: 'Corruption is not merely a legal infraction; it is a systemic breakdown of fiduciary trust. Forensic data science and automated anomaly tracking provide the evidentiary rigor required to dismantle institutional leakage.',
      fr: 'La corruption n’est pas une simple infraction juridique ; elle constitue une rupture systémique de la confiance fiduciaire. L’analyse forensique des données apporte la rigueur probatoire indispensable pour neutraliser les déperditions publiques.',
    },
  },
  {
    id: 'media-academic-rotterdam',
    title: {
      en: 'Faculty Research Repository & Scholarly Working Papers: Professor Kelly Kingsley',
      fr: 'Répertoire de Recherche Universitaire & Travaux Scientifiques : Professeur Kelly Kingsley',
    },
    type: 'Academic Repository',
    category: 'academic',
    venue: 'Hogeschool Rotterdam (Rotterdam University of Applied Sciences) · Academia.edu',
    date: 'Academic Research Index',
    location: 'Rotterdam, Netherlands / International',
    image_url: '/images/gallery/academic-keynote-enam.jpg',
    summary: {
      en: 'Institutional academic repository archiving working papers, international finance curricula, and peer-reviewed treatises authored by Prof. Kelly Kingsley on forensic accounting, sovereign audit standards, and macro-financial risk management.',
      fr: 'Archives universitaires institutionnelles hébergeant les articles de recherche, supports d’enseignement et monographies du Pr Kelly Kingsley portant sur la comptabilité judiciaire, les normes d’audit souverain et la gestion des risques macro-financiers.',
    },
    source_url: 'https://hogeschool-rotterdam.academia.edu/ProfesssorKellyKingsley',
    caption: {
      en: 'Forensic accounting pedagogy bridges empirical econometrics with judicial procedure, training the next generation of integrity magistrates and institutional auditors.',
      fr: 'La pédagogie de la comptabilité judiciaire jette un pont entre l’économétrie empirique et la procédure judiciaire, formant la prochaine génération de magistrats financiers et d’auditeurs d’État.',
    },
  },
  {
    id: 'media-expert-nkafu',
    title: {
      en: 'Senior Fellow & Public Policy Expert Dossier: Professor Kelly Mua Kingsly',
      fr: 'Chercheur Associé & Dossier d’Expertise en Politiques Publiques : Professeur Kelly Mua Kingsly',
    },
    type: 'Policy Fellowship',
    category: 'governance',
    venue: 'The Nkafu Policy Institute · Denis & Lenora Foretia Foundation',
    date: 'Reference Series',
    location: 'Yaoundé, Cameroon',
    image_url: '/images/photos/photo12.jpeg',
    summary: {
      en: 'Policy institute fellowship dossier highlighting Prof. Kingsly’s research contributions to sovereign debt sustainability, state financial operations, African Development Bank advisory engagements, and governance reforms across Central and West Africa.',
      fr: 'Dossier d’expertise du think tank Nkafu mettant en lumière les travaux du Pr Kingsly sur la soutenabilité de la dette souveraine, la gestion financière publique, ses missions pour la BAD et les réformes de gouvernance en Afrique centrale et de l’Ouest.',
    },
    source_url: 'https://nkafu.org/experts/prof-kelly-mua/',
    caption: {
      en: 'Sound fiscal policy requires active sovereign debt sustainability modeling, transparent treasury execution, and institutional accountability before capital markets and citizens alike.',
      fr: 'Une politique budgétaire saine requiert une modélisation active de la soutenabilité de la dette, une exécution transparente du Trésor et une redevabilité sans faille envers les citoyens et les marchés.',
    },
  },
  {
    id: 'media-press-ecomatin',
    title: {
      en: 'Investigations: Dismantling Taboos Surrounding Financial Crime & Illicit Flows',
      fr: 'Investigations : Désormais Plus de Tabous sur la Criminalité Financière et les Flux Illicites',
    },
    type: 'Press Feature',
    category: 'press',
    venue: 'EcoMatin (Cameroon Economic Daily)',
    date: '2019-01-30',
    location: 'Yaoundé, Cameroon',
    image_url: '/images/gallery/cemac-finance-briefing.jpg',
    summary: {
      en: 'Extensive press coverage of Prof. Kelly Mua Kingsly’s high-level presentation in Yaoundé unveiling three pioneering books on forensic accounting, corporate fraud risk, and financial crime investigations before banking executives, regulators, and judicial authorities.',
      fr: 'Grand angle du quotidien EcoMatin sur la dédicace institutionnelle à Yaoundé de trois ouvrages majeurs du Pr Kelly Mua Kingsly consacrés à la comptabilité forensique, à la gestion du risque de fraude et aux investigations financières, devant les banquiers et autorités judiciaires.',
    },
    source_url: 'https://ecomatin.net/investigations-desormais-plus-de-tabous-sur-la-criminalite-financiere',
    caption: {
      en: 'Administrative audits can no longer combat sophisticated financial delinquency alone. Only specialized forensic accounting and fraud risk management can pierce white-collar opacity.',
      fr: 'Le contrôle administratif classique ne peut plus contrer à lui seul la délinquance financière sophistiquée. Seules l’investigation forensique et la gestion du risque de fraude brisent l’opacité des cols blancs.',
    },
  },
  {
    id: 'media-1',
    title: {
      en: 'Public Finance Evolution: State Budget Growth from 3,189B FCFA (2012) to 11,694B FCFA (2023+)',
      fr: 'Finances Publiques : Évolution du Budget de l’État de 3 189 Mds FCFA (2012) à 11 694 Mds FCFA (2023+)',
    },
    type: 'Policy Interview',
    category: 'press',
    venue: 'Institutional Public Finance Briefing / Regional Economic Press',
    date: '2023 – 2026 Reference Series',
    location: 'Yaoundé, Cameroon',
    summary: {
      en: 'Comprehensive retrospective on Cameroon’s fiscal trajectory, domestic revenue mobilization, and capital market instruments supporting sovereign resilience.',
      fr: 'Analyse rétrospective de la trajectoire budgétaire du Cameroun, de la mobilisation des recettes internes et des instruments du marché financier soutenant la résilience souveraine.',
    },
    source_url:
      'https://news.abidjan.net/articles/724028/finances-publiques-le-budget-de-letat-est-passe-de-3-189-milliards-fcfa-en-2012-a-11-694-milliards-fcfa-en-2023',
    caption: {
      en: 'The tripling of the state budget over the past decade illustrates the structural expansion of Cameroon’s fiscal base and the strategic role of domestic capital market syndications in funding public investments.',
      fr: 'Le triplement du budget de l’État en dix ans illustre l’élargissement structurel de l’assiette fiscale camerounaise et le rôle stratégique des syndications sur le marché des capitaux domestique pour financer les investissements publics.',
    },
  },
  {
    id: 'media-2',
    title: {
      en: 'Continental Governance & De-Risking Sovereign Investments Across Africa',
      fr: 'Gouvernance Continentale et Sécurisation des Investissements Souverains en Afrique',
    },
    type: 'Keynote Address',
    category: 'governance',
    venue: 'ATIDI Annual General Meeting & Multilateral Finance Forum',
    date: '2025',
    location: 'Nairobi / Pan-African',
    summary: {
      en: 'Executive address on leveraging multilateral credit insurance and ESG-aligned underwriting to accelerate intra-African trade and infrastructure delivery.',
      fr: 'Allocution sur le rôle de l’assurance-crédit multilatérale et de la souscription alignée sur les critères ESG pour accélérer le commerce intra-africain.',
    },
    caption: {
      en: 'Continental de-risking architectures correct the asymmetric pricing of African sovereign risk, transforming perceived risk into bankable, investment-grade opportunities.',
      fr: 'Les architectures de sécurisation continentales corrigent l’asymétrie de tarification du risque souverain en Afrique, transformant le risque perçu en opportunités bancables notées au rang d’investissement.',
    },
  },
  {
    id: 'media-3',
    title: {
      en: 'Forensic Auditing as a Pillar of Sovereign Accountability',
      fr: 'L’Audit Judiciaire comme Pilier de la Redevabilité Financière Publique',
    },
    type: 'Academic Lecture',
    category: 'academic',
    venue: 'ENAM (National School of Administration and Magistracy)',
    date: '2025',
    location: 'Yaoundé, Cameroon',
    summary: {
      en: 'Inaugural lecture for incoming state auditors and financial magistrates on modern anomaly detection and evidentiary standards.',
      fr: 'Leçon inaugurale destinée aux auditeurs d’État et magistrats financiers sur la détection moderne des anomalies et les normes probatoires.',
    },
    caption: {
      en: 'Judicial auditing is the ultimate safeguard of public resources, translating quantitative anomaly detection into admissible legal evidence for financial courts.',
      fr: 'L’audit judiciaire constitue le rempart ultime des deniers publics, convertissant la détection quantitative des anomalies en éléments probatoires recevables devant les juridictions financières.',
    },
  },
];

export const SEED_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'gal-01',
    title: {
      en: 'Official Book Launch: "Paul BIYA: The Art of the Credible Signature" (Hilton Yaoundé)',
      fr: 'Lancement Officiel : « Paul BIYA : L’Art de la Signature Crédible » (Hilton Yaoundé)',
    },
    event_name: {
      en: 'Sovereign Book Launch & High-Level Policy Conference',
      fr: 'Lancement Officiel du Livre & Conférence de Haut Niveau',
    },
    venue: 'Hilton Hotel, Yaoundé',
    date: '2026-11-05',
    year: '2026',
    season: '2025-2026',
    location: 'Yaoundé, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/the-art-of-a-credible-signature-paul-biya.jpeg',
    thumbnail_url: '/images/books/paul-biya-credible-signature-2nd.jpeg',
    caption: {
      en: 'Official launch and conference-debate on Cameroon’s sovereign creditworthiness, under the High Patronage of Minister of Finance Louis Paul Motaze.',
      fr: 'Lancement officiel et conférence-débat sur la signature souveraine du Cameroun, sous le Haut Patronage du Ministre des Finances Louis Paul Motaze.',
    },
    participants_note: {
      en: 'Under the High Patronage of Mr. Louis Paul Motaze, Minister of Finance, with keynotes by Prof. Kelly Mua Kingsly and literary review by Prof. Messanga Nyamnding.',
      fr: 'Sous le Haut Patronage de M. Louis Paul Motaze, Ministre des Finances, avec allocution du Pr Kelly Mua Kingsly et revue littéraire du Pr Messanga Nyamnding.',
    },
    external_ref_url: 'https://forms.gle/KLRjZUB6vjcEtcsbA',
    is_featured_monthly: true,
  },
  {
    id: 'gal-02',
    title: {
      en: 'Keynote Address: De-Risking African Infrastructure at AFSIC London',
      fr: 'Discours Principal : Sécurisation des Infrastructures Africaines à l’AFSIC Londres',
    },
    event_name: {
      en: 'AFSIC – Investing in Africa Conference 2024',
      fr: 'Conférence AFSIC – Investir en Afrique 2024',
    },
    venue: 'Park Plaza Westminster Bridge',
    date: '2024-10-08',
    year: '2024',
    season: '2023-2024',
    location: 'London, United Kingdom',
    category: 'summit',
    image_url: '/images/gallery/sovereign-debt-summit.jpg',
    thumbnail_url: '/images/gallery/sovereign-debt-summit.jpg',
    caption: {
      en: 'Bridging international institutional syndicates with African sovereign infrastructure via structured multilateral insurance.',
      fr: 'Connecter les syndicats bancaires internationaux aux infrastructures africaines grâce à l’assurance multilatérale structurée.',
    },
    participants_note: {
      en: 'Over 1,200 global investment executives, sovereign wealth funds, and multilateral development banks.',
      fr: 'Plus de 1 200 dirigeants financiers mondiaux, fonds souverains et banques multilatérales de développement.',
    },
    external_ref_url: 'https://www.afsic.net',
    is_featured_monthly: false,
  },
  {
    id: 'gal-03',
    title: {
      en: 'ATIDI 101st Board of Directors Session & Strategic Roadmap',
      fr: '101e Session du Conseil d’Administration de l’ATIDI & Feuille de Route Stratégique',
    },
    event_name: {
      en: 'ATIDI Board of Directors Statutory Meeting',
      fr: 'Session Statutaire du Conseil d’Administration de l’ATIDI',
    },
    venue: 'ATIDI Continental Headquarters',
    date: '2024-10-23',
    year: '2024',
    season: '2023-2024',
    location: 'Nairobi, Kenya',
    category: 'governance',
    image_url: '/images/gallery/dignitaries-reception.jpg',
    thumbnail_url: '/images/gallery/dignitaries-reception.jpg',
    caption: {
      en: 'Presiding as Board Chairman over the 2024–2027 strategic plan, underwriting $85B+ in cumulative intra-African commercial flows.',
      fr: 'Présidant en qualité de PCA le plan stratégique 2024-2027, garantissant plus de 85 Mds $ de flux intra-africains cumulés.',
    },
    participants_note: {
      en: 'Executive management and institutional directors representing international financial institutions.',
      fr: 'Direction générale exécutive et administrateurs représentant les institutions financières internationales.',
    },
    is_featured_monthly: true,
  },
  {
    id: 'gal-04',
    title: {
      en: 'Sovereign Treasury Bond Syndication & Market Execution Briefing',
      fr: 'Syndication des Emprunts Obligataires du Trésor et Exécution des Marchés',
    },
    event_name: {
      en: 'CEMAC Regional Capital Markets Investor Roadshow',
      fr: 'Roadshow Investisseurs du Marché des Capitaux de la CEMAC',
    },
    venue: 'Direction Générale du Trésor / MINFI',
    date: '2024-05-18',
    year: '2024',
    season: '2023-2024',
    location: 'Yaoundé & Douala, Cameroon',
    category: 'governance',
    image_url: 'https://img.youtube.com/vi/JSOfK6ea8Lw/hqdefault.jpg',
    caption: {
      en: 'Directing the sovereign treasury bond syndication with regional primary dealers, closing oversubscribed at 112%.',
      fr: 'Pilotant la syndication obligataire souveraine avec les spécialistes en valeurs du Trésor, clôturée avec une sursouscription de 112 %.',
    },
    participants_note: {
      en: 'Banking CEOs, institutional pension funds, and CEMAC market intermediaries.',
      fr: 'Directeurs généraux de banques, caisses de retraite institutionnelles et intermédiaires agréés CEMAC.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-05',
    title: {
      en: 'Book Launch & Policy Symposium: African Roadmap in the Fight Against Corrupt Practices',
      fr: 'Dédicace & Colloque : Feuille de Route dans la Lutte Contre les Pratiques de Corruption',
    },
    event_name: {
      en: 'Public Integrity & Forensic Data Symposium',
      fr: 'Colloque International sur l’Intégrité Publique et la Donnée Forensique',
    },
    venue: 'Amphithéâtre Paul Biya, ENAM',
    date: '2025-01-16',
    year: '2025',
    season: '2025-2026',
    location: 'Yaoundé, Cameroon',
    category: 'book_meetup',
    image_url: '/assets/books/forensic-accounting.svg',
    thumbnail_url: '/assets/books/forensic-accounting.svg',
    caption: {
      en: 'Author presentation and book signing of the 2025 treatise before judicial magistrates, state inspectors, and civil society.',
      fr: 'Présentation de l’auteur et dédicace du traité 2025 devant les magistrats financiers, inspecteurs d’État et universitaires.',
    },
    participants_note: {
      en: 'High-level delegation from CONAC, Supreme State Audit (CONSUPE), and regional audit chambers.',
      fr: 'Délégation de haut niveau de la CONAC, du Contrôle Supérieur de l’État et des chambres des comptes.',
    },
    is_featured_monthly: true,
  },
  {
    id: 'gal-06',
    title: {
      en: 'BVMAC Unified Central African Stock Exchange Listing Ceremony',
      fr: 'Cérémonie de Cotation à la Bourse Régionale Unifiée d’Afrique Centrale (BVMAC)',
    },
    event_name: {
      en: 'BVMAC Market Bell Ringing & Sovereign Quotation Session',
      fr: 'Sonnerie de Cloche et Séance de Cotation Souveraine à la BVMAC',
    },
    venue: 'Siège de la BVMAC, Immeuble Bourse',
    date: '2023-06-20',
    year: '2023',
    season: '2023-2024',
    location: 'Douala, Cameroon',
    category: 'governance',
    image_url: '/images/gallery/capital-markets-dialogue.jpg',
    thumbnail_url: '/images/gallery/capital-markets-dialogue.jpg',
    caption: {
      en: 'Officiating the admission and quotation of sovereign debt instruments on the unified BVMAC regional exchange, deepening Central Africa’s capital market liquidity and secondary trading volumes.',
      fr: 'Présidant l’admission et la première cotation des titres publics sur le marché financier unifié de la BVMAC, approfondissant la liquidité secondaire et la culture boursière régionale.',
    },
    participants_note: {
      en: 'Central African Stock Exchange leadership, COSUMAF commissioners, and brokerage consortiums.',
      fr: 'Direction générale de la BVMAC, commissaires de la COSUMAF et consortiums de sociétés de bourse.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-07',
    title: {
      en: 'Investiture: Knight of the Cameroon National Order of Valor',
      fr: 'Investiture : Chevalier de l’Ordre National de la Valeur du Cameroun',
    },
    event_name: {
      en: 'Official Presidential Investiture Ceremony',
      fr: 'Cérémonie Officielle d’Investiture Présidentielle',
    },
    venue: 'Palais de l’Unité / Chancellerie des Ordres Nationaux',
    date: '2022-05-20',
    year: '2022',
    season: 'archive',
    location: 'Yaoundé, Cameroon',
    category: 'diplomatic',
    image_url: '/images/mua.jpeg',
    caption: {
      en: 'Conferred Knight of the National Order of Valor by the Head of State for distinguished sovereign service to public finance and state treasury operations.',
      fr: 'Élevé au rang de Chevalier de l’Ordre National de la Valeur par le Chef de l’État pour services éminents rendus à la Nation et aux finances publiques.',
    },
    participants_note: {
      en: 'Members of Government, Grand Chancellor of National Orders, and senior civil service corps.',
      fr: 'Membres du Gouvernement, Grand Chancelier des Ordres Nationaux et hauts dignitaires de l’État.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-08',
    title: {
      en: 'Masterclass: Forensic Accounting Pedagogy for Financial Magistrates',
      fr: 'Masterclass : Pédagogie de l’Audit Forensique pour Magistrats Financiers',
    },
    event_name: {
      en: 'ENAM Inaugural Academic Masterclass Series',
      fr: 'Série de Masterclasses Académiques Inaugurales de l’ENAM',
    },
    venue: 'National School of Administration and Magistracy',
    date: '2025-02-05',
    year: '2025',
    season: '2025-2026',
    location: 'Yaoundé, Cameroon',
    category: 'academic',
    image_url: 'https://img.youtube.com/vi/phMj0J40b-s/hqdefault.jpg',
    caption: {
      en: 'Training the next generation of financial magistrates and treasury inspectors on digital anomaly detection and evidentiary standards.',
      fr: 'Formation de la future promotion de magistrats financiers et d’inspecteurs du Trésor à la détection numérique des fraudes.',
    },
    participants_note: {
      en: 'Graduating magistrates of the Financial Section and state treasury audit cadets.',
      fr: 'Élèves-magistrats de la Section des Comptes et auditeurs du Trésor.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-09',
    title: {
      en: 'National Launch: UNDP-GEF Global Green Bond Sovereign Initiative',
      fr: 'Lancement National : Initiative Mondiale sur les Obligations Vertes (PNUD-FEM)',
    },
    event_name: {
      en: 'Sovereign Green Bond Framework Validation Workshop',
      fr: 'Atelier de Validation du Cadre National des Obligations Vertes',
    },
    venue: 'Hilton Yaoundé Conference Hall',
    date: '2023-11-14',
    year: '2023',
    season: '2023-2024',
    location: 'Yaoundé, Cameroon',
    category: 'governance',
    image_url: 'https://img.youtube.com/vi/Sb7c6hfjvUQ/hqdefault.jpg',
    caption: {
      en: 'Serving as Designated National Authority, presenting the taxonomy for climate-resilient sovereign debt instruments.',
      fr: 'En qualité d’Autorité Nationale Désignée, présentant la taxonomie des titres de dette souveraine résilients au climat.',
    },
    participants_note: {
      en: 'United Nations Development Programme, Global Environment Facility, and Ministry of Environment.',
      fr: 'Programme des Nations Unies pour le Développement, Fonds pour l’Environnement Mondial et MINEPDED.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-10',
    title: {
      en: 'Book Dedication & Meetup: Financial Crime Investigations and Forensic Accounts',
      fr: 'Dédicace & Rencontre Auteur : Enquêtes sur la Criminalité Financière et Comptes Forensiques',
    },
    event_name: {
      en: 'Banking & Financial Compliance Readers Meetup',
      fr: 'Rencontre Auteurs et Dirigeants de la Conformité Bancaire',
    },
    venue: 'Hôtel Mont Fébé Panorama',
    date: '2024-03-22',
    year: '2024',
    season: '2023-2024',
    location: 'Yaoundé, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/financial-crime-investigations.jpg',
    caption: {
      en: 'Interactive book discussion with chief risk officers, compliance directors, and judicial investigators on tracing illicit flows.',
      fr: 'Échange interactif avec les directeurs des risques bancaires, responsables conformité et enquêteurs judiciaires.',
    },
    participants_note: {
      en: 'Delegates from the Association of Professional Credit Institutions (APBEF) and judicial police.',
      fr: 'Délégués de l’Association Professionnelle des Établissements de Crédit et officiers de police judiciaire.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-11',
    title: {
      en: 'Television Feature: State Budget Tripling & Economic Trajectory',
      fr: 'Émission Spéciale : Triplement du Budget de l’État et Trajectoire Économique',
    },
    event_name: {
      en: 'CRTV Économie & Finances National Broadcast',
      fr: 'Édition Spéciale Économie & Finances sur la CRTV',
    },
    venue: 'CRTV Production Studios',
    date: '2023-09-12',
    year: '2023',
    season: '2023-2024',
    location: 'Yaoundé, Cameroon',
    category: 'summit',
    image_url: 'https://img.youtube.com/vi/eLPNnUVv2aw/hqdefault.jpg',
    caption: {
      en: 'Prime-time public address analyzing the structural growth of state revenue from 3,189B to 11,694B FCFA.',
      fr: 'Intervention télévisée de référence décortiquant l’évolution du budget de l’État de 3 189 à 11 694 Mds FCFA.',
    },
    participants_note: {
      en: 'Broadcast live across Central Africa with questions from leading economic editors.',
      fr: 'Diffusion en direct dans toute l’Afrique centrale avec questions des grands éditorialistes économiques.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-12',
    title: {
      en: 'Book Signing Meetup: Economic Bail Out Programs for Emerging Africa',
      fr: 'Rencontre Auteur & Dédicace : Programmes de Sauvetage Économique pour l’Afrique',
    },
    event_name: {
      en: 'Economic Sovereignty & Debt Policy Forum',
      fr: 'Forum sur la Souveraineté Économique et les Politiques d’Endettement',
    },
    venue: 'Akwa Palace Business Center',
    date: '2021-04-10',
    year: '2021',
    season: 'archive',
    location: 'Douala, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/economic-bailout-programs-africa.jpg',
    caption: {
      en: 'Debating structural adjustment myths and endogenous fiscal alternatives with regional economists and business leaders.',
      fr: 'Débat autour des mythes de l’ajustement structurel et des leviers budgétaires endogènes avec les économistes régionaux.',
    },
    participants_note: {
      en: 'Attended by GICAM members, academic economists, and sovereign debt policy analysts.',
      fr: 'En présence des membres du GICAM, universitaires et analystes des politiques de dette publique.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-13',
    title: {
      en: 'COSUMAF Regional Financial Market Harmonization Session',
      fr: 'Session de Régulation COSUMAF : Harmonisation du Marché Financier Régional',
    },
    event_name: {
      en: 'COSUMAF Statutory Supervisory Committee',
      fr: 'Comité Statutaire de Surveillance de la COSUMAF',
    },
    venue: 'Siège de la COSUMAF',
    date: '2022-11-28',
    year: '2022',
    season: 'archive',
    location: 'Libreville, Gabon',
    category: 'governance',
    image_url: '/images/gallery/cemac-finance-briefing.jpg',
    thumbnail_url: '/images/gallery/cemac-finance-briefing.jpg',
    caption: {
      en: 'Serving as Cameroon’s Designated Representative to COSUMAF (2016–2024), presiding over regional regulatory convergence, market surveillance, unified BVMAC exchange integration, and investor protection across the six CEMAC member nations.',
      fr: 'Siégeant en qualité de Représentant Institutionnel Désigné de la République du Cameroun auprès de la COSUMAF (2016-2024), pilotant la convergence réglementaire régionale, la supervision de la BVMAC et la protection de l’épargne dans les six États de la CEMAC.',
    },
    participants_note: {
      en: 'COSUMAF Supervisory Board Commissioners, National Directors of Treasury from the 6 CEMAC Member States, Central Depository executives, and licensed brokerage consortium leaders.',
      fr: 'Commissaires du Collège de la COSUMAF, Directeurs Nationaux du Trésor des six États membres de la CEMAC, dirigeants du Dépositaire Central et présidents des Sociétés de Bourse agréées.',
    },
    external_ref_url: 'https://wikigenius.org/wiki/Professor_Kelly_Mua_Kingsly',
    is_featured_monthly: false,
  },
  {
    id: 'gal-14',
    title: {
      en: 'Author Symposium: Disruptive Technology Blockchain – The Crystal Ball',
      fr: 'Colloque Auteur : Technologie Disruptive Blockchain – La Boule de Cristal',
    },
    event_name: {
      en: 'African Digital Trust & Distributed Ledger Meetup',
      fr: 'Rencontre Africaine sur la Confiance Numérique et les Registres Distribués',
    },
    venue: 'Centre Culturel & Numérique',
    date: '2021-02-18',
    year: '2021',
    season: 'archive',
    location: 'Yaoundé, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/disruptive-technology-blockchain.jpg',
    caption: {
      en: 'Unpacking smart contracts in public procurement and sovereign land registry tokenization.',
      fr: 'Décryptage des contrats intelligents dans la commande publique et la sécurisation des registres fonciers de l’État.',
    },
    participants_note: {
      en: 'Fintech founders, computer scientists, and public registry directors.',
      fr: 'Fondateurs de fintechs, chercheurs en informatique et directeurs des cadastres de l’État.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-15',
    title: {
      en: 'Nkafu Policy Institute Sovereign Governance Fellowship Roundtable',
      fr: 'Table Ronde des Chercheurs Associés du Think Tank Nkafu Policy Institute',
    },
    event_name: {
      en: 'Denis & Lenora Foretia Foundation Public Policy Roundtable',
      fr: 'Table Ronde de Politiques Publiques de la Fondation Denis & Lenora Foretia',
    },
    venue: 'Foretia Foundation Auditorium',
    date: '2023-05-15',
    year: '2023',
    season: '2023-2024',
    location: 'Yaoundé, Cameroon',
    category: 'academic',
    image_url: '/images/gallery/state-trust-capital-symposium.jpg',
    thumbnail_url: '/images/gallery/state-trust-capital-symposium.jpg',
    caption: {
      en: 'Presenting foundational research on debt sustainability frameworks, sovereign credibility metrics, and institutional firewalls against public expenditure leakages at the Foretia Foundation auditorium.',
      fr: 'Présentation des travaux de recherche sur la viabilité de la dette, les métriques de crédibilité souveraine et les verrous institutionnels contre les déperditions budgétaires à l’auditorium de la Fondation Foretia.',
    },
    participants_note: {
      en: 'Resident policy fellows, parliamentary assistants, and international development economists.',
      fr: 'Chercheurs résidents, assistants parlementaires et économistes du développement international.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-16',
    title: {
      en: 'Executive Meetup: Business Risk Management in Volatile Economies',
      fr: 'Rencontre Dirigeants : Gestion des Risques d’Entreprise en Économie Volatile',
    },
    event_name: {
      en: 'Corporate Board Leadership & ERM Breakfast',
      fr: 'Petit-déjeuner des Conseils d’Administration et du Management des Risques',
    },
    venue: 'Krystal Palace Business Suites',
    date: '2021-08-14',
    year: '2021',
    season: 'archive',
    location: 'Douala, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/business-risk-management.jpg',
    caption: {
      en: 'Hands-on workshop demonstrating quantitative risk appetite matrices and scenario stress tests for board directors.',
      fr: 'Atelier pratique présentant les matrices d’appétit au risque et les tests de résistance de trésorerie pour administrateurs.',
    },
    participants_note: {
      en: 'Executive committee members, internal audit directors, and corporate risk officers.',
      fr: 'Membres de comités de direction, directeurs de l’audit interne et risk managers d’entreprises.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-17',
    title: {
      en: 'Central African Monetary Union (BEAC) Regulatory Censorship Briefing',
      fr: 'Briefing Réglementaire du Censorat de la BEAC (Union Monétaire d’Afrique Centrale)',
    },
    event_name: {
      en: 'BEAC National Directorate Fiduciary Supervision Session',
      fr: 'Séance de Supervision Fiduciaire à la Direction Nationale de la BEAC',
    },
    venue: 'Banque des États de l’Afrique Centrale (BEAC Siège)',
    date: '2022-09-08',
    year: '2022',
    season: 'archive',
    location: 'Yaoundé, Cameroon',
    category: 'governance',
    image_url: '/images/gallery/sovereign-debt-summit.jpg',
    thumbnail_url: '/images/gallery/sovereign-debt-summit.jpg',
    caption: {
      en: 'Fulfilling statutory central bank censorship duties at BEAC, reviewing sovereign liquidity reserves, state treasury balances, and statutory alignment with regional monetary policy directives.',
      fr: 'Exerçant les prérogatives statutaires de censeur à la BEAC, examinant les réserves de liquidité de l’État, la trésorerie souveraine et la conformité aux directives de politique monétaire de la zone CEMAC.',
    },
    participants_note: {
      en: 'National directors, bank comptrollers, and central monetary authorities.',
      fr: 'Directeurs nationaux, contrôleurs bancaires et autorités monétaires centrales.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-18',
    title: {
      en: 'Book Dedication: Corporate Fraud Risk Management & Whistleblower Protections',
      fr: 'Dédicace de Livre : Gestion des Risques de Fraude & Protection des Lanceurs d’Alerte',
    },
    event_name: {
      en: 'Anti-Corruption Corporate Governance Forum',
      fr: 'Forum de Gouvernance d’Entreprise et Lutte Anti-Fraude',
    },
    venue: 'Chambre de Commerce, d’Industrie et des Mines',
    date: '2021-11-20',
    year: '2021',
    season: 'archive',
    location: 'Douala, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/corporate-fraud-risk-management.jpg',
    thumbnail_url: '/images/books/corporate-fraud-risk-management.jpg',
    caption: {
      en: 'Presenting corporate anti-fraud governance blueprints, tone at the top, and forensic audit charters before industrial federation leaders and certified fraud examiners.',
      fr: 'Présentation des modèles de gouvernance anti-fraude, de l’exemplarité managériale et des chartes d’audit judiciaire devant les dirigeants d’entreprises et auditeurs certifiés.',
    },
    participants_note: {
      en: 'Industrial federation leaders, legal counsel, and certified fraud examiners (CFEs).',
      fr: 'Dirigeants de fédérations professionnelles, juristes d’entreprise et auditeurs certifiés anti-fraude.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-19',
    title: {
      en: 'Multilateral Operations Review: United Nations Development Programme (UNDP)',
      fr: 'Revue des Opérations Multilatérales : Programme des Nations Unies pour le Développement',
    },
    event_name: {
      en: 'UNDP Country Operations & Fiduciary Accountability Summit',
      fr: 'Sommet des Opérations Pays et de la Redevabilité Fiduciaire du PNUD',
    },
    venue: 'United Nations Complex',
    date: '2020-02-12',
    year: '2020',
    season: 'archive',
    location: 'N’Djamena / Yaoundé',
    category: 'diplomatic',
    image_url: '/images/gallery/prof-kelly-diplomatic-portrait.png',
    thumbnail_url: '/images/gallery/prof-kelly-diplomatic-portrait.png',
    caption: {
      en: 'Consolidating 16 years of multilateral development leadership as Deputy Resident Representative for Operations at UNDP, ensuring exemplary fiduciary governance, IPSAS standards, and programmatic execution.',
      fr: 'Consolidant 16 années de direction opérationnelle au PNUD en qualité de Représentant Résident Adjoint, garantissant une rigueur fiduciaire exemplaire, le respect des normes IPSAS et l’impact des programmes multilatéraux.',
    },
    participants_note: {
      en: 'UN Resident Coordinators, bilateral donor ambassadors, and international operations teams.',
      fr: 'Coordonnateurs résidents de l’ONU, ambassadeurs bailleurs de fonds et équipes opérationnelles.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-20',
    title: {
      en: 'Author Signing & Readers Meetup: Identifying Red Flags of Fraud',
      fr: 'Rencontre Lecteurs & Dédicace : Identifier les Signaux d’Alerte de la Fraude',
    },
    event_name: {
      en: 'Public Expenditure Inspectors Book Meetup',
      fr: 'Rencontre Auteur avec les Inspecteurs des Dépenses Publiques',
    },
    venue: 'Atlantic Beach Hotel Conference Hall',
    date: '2022-03-15',
    year: '2022',
    season: 'archive',
    location: 'Limbe, Cameroon',
    category: 'book_meetup',
    image_url: '/assets/books/red-flags-fraud.svg',
    thumbnail_url: '/assets/books/red-flags-fraud.svg',
    caption: {
      en: 'Dissecting predictive fraud detection matrices, red flag taxonomies, and forensic audit evidentiary standards with regional finance controllers and senior public inspectors.',
      fr: 'Décryptage des matrices de détection précoce, de la typologie des signaux d’alerte et des standards probatoires en audit judiciaire avec les contrôleurs des finances et inspecteurs d’État.',
    },
    participants_note: {
      en: 'Regional finance delegates, municipal revenue controllers, and internal auditors.',
      fr: 'Délégués régionaux des finances, contrôleurs municipaux et auditeurs internes.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-21',
    title: {
      en: 'State Asset Safeguarding & Public Expenditure Control Colloquium',
      fr: 'Colloque sur la Sauvegarde du Patrimoine de l’État et le Contrôle de la Dépense',
    },
    event_name: {
      en: 'National Colloquium on State Patrimony and Public Accounting',
      fr: 'Colloque National sur le Patrimoine Public et la Comptabilité de l’État',
    },
    venue: 'Palais des Congrès de Yaoundé',
    date: '2024-04-12',
    year: '2024',
    season: '2023-2024',
    location: 'Yaoundé, Cameroon',
    category: 'governance',
    image_url: 'https://img.youtube.com/vi/7BXr_44r_Ac/hqdefault.jpg',
    caption: {
      en: 'Addressing senior civil servants on moving from cash-basis to accrual sovereign accounting standards.',
      fr: 'Intervention sur le basculement de la comptabilité de caisse vers la comptabilité en droits constatés de l’État.',
    },
    participants_note: {
      en: 'Directors of Budget, Public Debt, and State Property across ministerial departments.',
      fr: 'Directeurs du Budget, de la Dette et du Patrimoine de l’ensemble des départements ministériels.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-22',
    title: {
      en: 'Academic Presentation: Stock Markets as a Lever for Growth in Central Africa',
      fr: 'Présentation Académique : Les Marchés Boursiers comme Levier de Croissance en Afrique Centrale',
    },
    event_name: {
      en: 'BVMAC Monograph Symposium & Research Launch',
      fr: 'Colloque sur la Monographie BVMAC et Lancement de la Recherche',
    },
    venue: 'Faculté des Sciences Économiques et de Gestion',
    date: '2023-07-28',
    year: '2023',
    season: '2023-2024',
    location: 'Yaoundé, Cameroon',
    category: 'academic',
    image_url: '/assets/books/bvmac-capital-markets.svg',
    thumbnail_url: '/assets/books/bvmac-capital-markets.svg',
    caption: {
      en: 'Presenting econometric findings on regional market integration, domestic bond yield curves, and IPO tax incentives at the Faculty of Economics.',
      fr: 'Présentation des conclusions économétriques sur l’intégration boursière, les courbes de taux et les incitations fiscales à la Faculté des Sciences Économiques.',
    },
    participants_note: {
      en: 'University professors, doctoral researchers, and financial markets master students.',
      fr: 'Professeurs d’université, chercheurs doctorants et étudiants en master finance de marché.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-23',
    title: {
      en: 'Youth in Governance & Public Financial Integrity Leadership Summit',
      fr: 'Sommet Jeunesse, Gouvernance & Intégrité Financière Publique',
    },
    event_name: {
      en: 'Pan-African Youth Leadership in Governance Forum',
      fr: 'Forum Panafricain de Leadership des Jeunes dans la Gouvernance',
    },
    venue: 'University of Buea Arts Theatre',
    date: '2024-11-09',
    year: '2024',
    season: '2023-2024',
    location: 'Buea, Cameroon',
    category: 'academic',
    image_url: '/images/gallery/ministerial-panel.jpg',
    thumbnail_url: '/images/gallery/ministerial-panel.jpg',
    caption: {
      en: 'Mentoring emerging economists on ethical leadership, CFA certification rigor, and public sector dedication before 800+ university leaders at the University of Buea.',
      fr: 'Mentorat des jeunes économistes sur le leadership éthique, l’exigence du CFA et le sens du service public devant plus de 800 étudiants à l’Université de Buea.',
    },
    participants_note: {
      en: 'Over 800 university students, student leaders, and young professionals in economics.',
      fr: 'Plus de 800 étudiants, délégués universitaires et jeunes professionnels de l’économie.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-24',
    title: {
      en: 'Book Dedication: Forensic Accounts and Ethics in Public Financial Systems',
      fr: 'Dédicace : Comptabilité Forensique et Éthique dans les Systèmes Financiers Publics',
    },
    event_name: {
      en: 'Auditors & Judicial Magistrates Annual Meetup',
      fr: 'Rencontre Annuelle des Auditeurs et Magistrats Financiers',
    },
    venue: 'Hilton Yaoundé Boukarou',
    date: '2022-12-10',
    year: '2022',
    season: 'archive',
    location: 'Yaoundé, Cameroon',
    category: 'book_meetup',
    image_url: '/images/books/forensic-accounting-and-financial-investigation.jpg',
    caption: {
      en: 'Discussing evidentiary chains of custody and ethical imperatives for public accountants and state magistrates.',
      fr: 'Discussion sur la chaîne de preuve forensique et l’impératif éthique pour les comptables publics et magistrats.',
    },
    participants_note: {
      en: 'Members of the National Chamber of Accounts and chartered accountants (ONECCA).',
      fr: 'Membres de la Chambre des Comptes et experts-comptables de l’ONECCA.',
    },
    is_featured_monthly: false,
  },
  {
    id: 'gal-25',
    title: {
      en: 'Annual Sovereign Treasury Operations Review & Forward Strategy (2025/2026)',
      fr: 'Revue Annuelle des Opérations du Trésor et Stratégie Prospective (2025/2026)',
    },
    event_name: {
      en: 'Ministry of Finance Annual Treasury Steering Session',
      fr: 'Séance Annuelle de Pilotage Stratégique du Trésor Public (MINFI)',
    },
    venue: 'Direction Générale du Trésor, Bâtiment Principal',
    date: '2025-01-22',
    year: '2025',
    season: '2025-2026',
    location: 'Yaoundé, Cameroon',
    category: 'governance',
    image_url: '/images/gallery/yaounde-hilton-assembly.jpg',
    thumbnail_url: '/images/gallery/yaounde-hilton-assembly.jpg',
    caption: {
      en: 'Consolidating annual state liquidity execution, sovereign debt sustainability ceilings, and forward capital market issuances at the Directorate General of the Treasury.',
      fr: 'Consolidation de l’exécution de trésorerie de l’État, des plafonds d’endettement et des émissions sur le marché régional à la Direction Générale du Trésor.',
    },
    participants_note: {
      en: 'Directorate of Finance Operations, Treasury Paymasters General, and Central Public Accounting inspectors.',
      fr: 'Direction des Opérations Financières, Trésoriers Payeurs Généraux et inspecteurs de la comptabilité publique.',
    },
    is_featured_monthly: true,
  },
];

export const INSTITUTIONAL_EVENTS: InstitutionalEvent[] = [
  {
    id: 'evt-2026-book-launch-hilton',
    slug: 'paul-biya-credible-signature-official-launch-yaounde',
    title: {
      en: 'Official Book Launch & Conference-Debate: "Paul BIYA: The Art of the Credible Signature"',
      fr: 'Lancement Officiel du Livre & Conférence-Débat : « Paul BIYA : L’Art de la Signature Crédible »',
    },
    event_type: {
      en: 'Sovereign Book Launch & High-Level Policy Debate',
      fr: 'Dédicace d’Ouvrage Souverain & Conférence-Débat de Haut Niveau',
    },
    category: 'summit',
    date: '2026-11-05',
    time: '14:00 – 18:30 GMT+1 (VIP Arrival: 13:00)',
    venue: 'Yaoundé Hilton Hotel (Grand Ballroom)',
    location: 'Yaoundé, Cameroon',
    description: {
      en: 'Under the Distinguished High Patronage of Mr. Louis Paul Motaze, Minister of Finance of Cameroon. Official book signing and conference-debate on Cameroon’s sovereign creditworthiness, capital market mobilization, and the "Theory of State Trust Capital". Featuring keynote address by author Prof. Kelly Mua Kingsly, literary review by Prof. Messanga Nyamnding, and panel convening DGTCFM, BVMAC, Credit Rating Agencies, Commercial Banks, IMF, and the World Bank.',
      fr: 'Placé sous le Haut Patronage de M. Louis Paul Motaze, Ministre des Finances du Cameroun. Dédicace solennelle et conférence-débat sur la souveraineté financière, la mobilisation des capitaux et le « Capital Confiance Étatique ». Avec l’allocution de cadrage du Pr Kelly Mua Kingsly, la revue littéraire du Pr Messanga Nyamnding et un panel de haut niveau réunissant DGTCFM, BVMAC, agences de notation, banques commerciales, FMI et Banque Mondiale.',
    },
    keynote_topic: {
      en: 'The Contribution of the Credible Signature of the State of Cameroon to the Mobilization of Financial Resources in Capital Markets',
      fr: 'La Contribution de la Signature Crédible de l’État du Cameroun à la Mobilisation des Ressources Financières sur les Marchés des Capitaux',
    },
    organizer: 'Comité d’Organisation Officiel · Éditions All Access (Paris) · Ministère des Finances',
    status: 'concluded',
    related_gallery_ids: ['gal-01', 'gal-04', 'gal-06', 'gal-25'],
  },
  {
    id: 'evt-2025-01',
    slug: 'cemac-capital-markets-syndication-forum-2025',
    title: {
      en: 'CEMAC Capital Markets & Sovereign Syndication Forum 2025',
      fr: 'Forum des Marchés Financiers de la CEMAC & Syndication Souveraine 2025',
    },
    event_type: {
      en: 'Sovereign Capital Markets Forum',
      fr: 'Forum des Marchés de Capitaux Souverains',
    },
    category: 'governance',
    date: '2025-04-15',
    time: '09:00 – 16:30 GMT+1',
    venue: 'Centre International de Conférences / Hôtel Krystal Palace',
    location: 'Douala, Cameroon',
    description: {
      en: 'High-level institutional gathering of primary dealers, regional institutional investors, and sovereign debt directors evaluating the 2025 treasury bond calendar and secondary market liquidity.',
      fr: 'Rencontre institutionnelle de haut niveau réunissant les Spécialistes en Valeurs du Trésor, investisseurs institutionnels régionaux et directeurs de dette publique pour analyser le calendrier d’émission 2025.',
    },
    keynote_topic: {
      en: 'Deepening Regional Domestic Debt Markets and De-risking Sovereign Syndications',
      fr: 'Approfondissement des Marchés Domestiques de Dette et Dé-risquage des Syndications Souveraines',
    },
    organizer: 'Direction Générale du Trésor & Intermédiaires Agréés CEMAC',
    status: 'upcoming',
    registration_url: '/contact',
    related_gallery_ids: ['gal-04', 'gal-06', 'gal-25'],
  },
  {
    id: 'evt-2025-02',
    slug: 'enam-forensic-audit-magistracy-symposium',
    title: {
      en: 'ENAM National Symposium on Judicial Forensic Auditing & Public Integrity',
      fr: 'Colloque National de l’ENAM sur l’Audit Forensique Judiciaire et l’Intégrité Publique',
    },
    event_type: {
      en: 'Academic Magistracy Symposium',
      fr: 'Colloque Académique de Magistrature Financière',
    },
    category: 'academic',
    date: '2025-05-22',
    time: '10:00 – 15:00 GMT+1',
    venue: 'Grande Salle des Actes, ENAM',
    location: 'Yaoundé, Cameroon',
    description: {
      en: 'Academic symposium gathering state financial magistrates, university researchers, and public inspectors examining modern data analytics and evidentiary standards in financial malfeasance cases.',
      fr: 'Colloque académique réunissant magistrats financiers, chercheurs et inspecteurs d’État autour de l’analyse moderne des données et des normes de preuve dans les contentieux financiers publics.',
    },
    keynote_topic: {
      en: 'From Anomaly Scoring to Judicial Proof: Evidentiary Standards in Financial Courts',
      fr: 'Du Scoring d’Anomalie à la Preuve Judiciaire : Les Normes Probatoires Devant les Juridictions Financières',
    },
    organizer: 'École Nationale d’Administration et de Magistrature (ENAM)',
    status: 'upcoming',
    registration_url: '/contact',
    related_gallery_ids: ['gal-05', 'gal-08', 'gal-24'],
  },
  {
    id: 'evt-2024-03',
    slug: 'atidi-24th-general-assembly-livingstone',
    title: {
      en: 'ATIDI 24th General Assembly of Shareholders (Livingstone)',
      fr: '24e Assemblée Générale des Actionnaires de l’ATIDI (Livingstone)',
    },
    event_type: {
      en: 'Pan-African Multilateral Assembly',
      fr: 'Assemblée Multilatérale Panafricaine',
    },
    category: 'governance',
    date: '2024-07-12',
    venue: 'Victoria Falls Conference Centre',
    location: 'Livingstone, Zambia',
    description: {
      en: 'Statutory multilateral governance meeting bringing together 24 African sovereign member states and international financial institutions, electing Prof. Kelly Mua Kingsly to board leadership.',
      fr: 'Réunion statutaire de gouvernance multilatérale rassemblant 24 États membres souverains et institutions financières internationales, élisant le Pr Kelly Mua Kingsly à la direction du conseil.',
    },
    organizer: 'African Trade & Investment Development Insurance (ATIDI)',
    status: 'concluded',
    related_gallery_ids: ['gal-01', 'gal-03'],
  },
  {
    id: 'evt-2024-04',
    slug: 'afsic-investing-in-africa-london',
    title: {
      en: 'AFSIC – Investing in Africa Conference 2024 (London)',
      fr: 'Sommet AFSIC – Investir en Afrique 2024 (Londres)',
    },
    event_type: {
      en: 'International Investment Summit',
      fr: 'Sommet International d’Investissement',
    },
    category: 'summit',
    date: '2024-10-08',
    venue: 'Park Plaza Westminster Bridge',
    location: 'London, United Kingdom',
    description: {
      en: 'Europe’s leading Africa investment summit, featuring Prof. Kelly Mua Kingsly addressing sovereign debt de-risking and trade credit insurance for institutional investors.',
      fr: 'Premier sommet européen d’investissement dédié à l’Afrique, avec le Pr Kelly Mua Kingsly intervenant sur la sécurisation de la dette souveraine et l’assurance-crédit pour les investisseurs institutionnels.',
    },
    organizer: 'AFSIC Global Investment Network',
    status: 'concluded',
    related_gallery_ids: ['gal-02'],
  },
];

