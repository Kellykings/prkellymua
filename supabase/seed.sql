-- ==============================================================================
-- PRODUCTION SEED DATA: PROFESSOR KELLY MUA KINGSLY (EN / FR)
-- ==============================================================================

INSERT INTO public.books (slug, isbn, title, subtitle, synopsis, academic_category, cover_image_url, total_pages, publish_date, publisher, is_featured, status)
VALUES
(
  'stock-markets-lever-for-growth-central-africa-bvmac',
  '978-1-68526-412-3',
  '{"en": "Stock Markets as a Lever for Growth in Central Africa", "fr": "Les Marchés Boursiers comme Levier de Croissance en Afrique Centrale"}',
  '{"en": "The Case of the Central African Capital Market (BVMAC)", "fr": "Le Cas du Marché Financier d''Afrique Centrale (BVMAC)"}',
  '{"en": "An institutional and empirical examination of capital market unification across the CEMAC zone, evaluating liquidity formation, sovereign bond syndication, and regulatory modernization under COSUMAF and BVMAC.", "fr": "Une analyse institutionnelle et empirique de l''unification du marché financier dans la zone CEMAC, évaluant la formation de la liquidité, la syndication des obligations souveraines et la modernisation réglementaire sous l''égide de la COSUMAF et de la BVMAC."}',
  'Capital Markets & Sovereign Finance',
  '/assets/books/bvmac-capital-markets.svg',
  348,
  '2023-06-15',
  'Christian Faith Publishing / Academic Press',
  true,
  'published'
),
(
  'forensic-accounting-and-financial-investigation',
  '978-1-64895-804-5',
  '{"en": "Forensic Accounting & Financial Investigation", "fr": "Comptabilité Judiciaire et Investigation Financière"}',
  '{"en": "Methodologies for Sovereign Audit, Asset Tracing & Institutional Integrity", "fr": "Méthodologies pour l''Audit Souverain, le Traçage d''Actifs et l''Intégrité Institutionnelle"}',
  '{"en": "A comprehensive treatise on forensic accounting frameworks, evidentiary standards, digital audit trails, and anti-corruption controls across public treasuries and multilateral institutions.", "fr": "Un traité complet sur les cadres de comptabilité judiciaire, les normes de preuve, les pistes d''audit numériques et les contrôles anti-corruption au sein des trésoreries publiques et des institutions multilatérales."}',
  'Forensic Accounting & Audit',
  '/assets/books/forensic-accounting.svg',
  412,
  '2022-11-10',
  'Christian Faith Publishing',
  true,
  'published'
),
(
  'identifying-red-flags-and-symptoms-of-fraud',
  '978-1-63874-219-7',
  '{"en": "Identifying Red Flags and Symptoms of Fraud", "fr": "Identifier les Signaux d''Alerte et Symptômes de la Fraude"}',
  '{"en": "Preventive Diagnostics in Public & Corporate Financial Systems", "fr": "Diagnostics Préventifs dans les Systèmes Financiers Publics et Privés"}',
  '{"en": "Equips auditors, regulators, and board directors with behavioral and quantitative anomaly-detection techniques to intercept procurement fraud, financial misstatement, and illicit flows early.", "fr": "Outille les auditeurs, régulateurs et administrateurs avec des techniques comportementales et quantitatives de détection d''anomalies pour intercepter la fraude aux marchés publics et les flux illicites."}',
  'Forensic Accounting & Audit',
  '/assets/books/red-flags-fraud.svg',
  296,
  '2021-08-22',
  'Christian Faith Publishing',
  true,
  'published'
),
(
  'mind-the-gap-bottom-line-and-ethical-behaviour',
  '978-1-64349-912-0',
  '{"en": "Mind the Gap: The Bottom Line and Ethical Behaviour", "fr": "Combler l''Écart : Rentabilité Financière et Éthique de Gouvernance"}',
  '{"en": "How Volkswagen Failed to Reconcile the Two?", "fr": "Comment Volkswagen a Échoué à Réconcilier les Deux ?"}',
  '{"en": "A landmark corporate governance and ESG case study dissecting how boardroom incentives, compliance silos, and short-term earnings pressure triggered one of modern industry''s most consequential governance failures.", "fr": "Une étude de cas de référence en gouvernance d''entreprise et ESG analysant comment les incitations managériales et les silos de conformité ont provoqué l''une des défaillances de gouvernance les plus marquantes de l''industrie moderne."}',
  'Corporate Governance & ESG',
  '/assets/books/mind-the-gap-esg.svg',
  264,
  '2020-05-18',
  'Christian Faith Publishing',
  false,
  'published'
),
(
  'financial-crime-investigations',
  '978-1-68526-990-6',
  '{"en": "Financial Crime Investigations", "fr": "Investigations sur la Criminalité Financière"}',
  '{"en": "Cross-Border AML, Sovereign Oversight & Regulatory Enforcement", "fr": "LCB-FT Transfrontalière, Supervision Souveraine et Application Réglementaire"}',
  '{"en": "Examines transnational financial crime typologies, beneficial ownership transparency, and coordinated enforcement protocols for financial intelligence units and central african regulators.", "fr": "Examine les typologies de criminalité financière transnationale, la transparence des bénéficiaires effectifs et les protocoles de contrôle coordonné pour les cellules de renseignement financier."}',
  'Financial Integrity & AML',
  '/assets/books/financial-crime.svg',
  380,
  '2024-02-14',
  'Academic & Policy Press',
  false,
  'published'
)
ON CONFLICT (slug) DO NOTHING;
