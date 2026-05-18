/* ─────────────── Constants ─────────────── */
const STORAGE_KEY = 'capital-increase-calculator/state/v4';

const SCENARIO_IDS = ['base', 'bull', 'bear'];
const SCENARIO_FIELDS = ['dossier', 'preMoney', 'existingShares', 'nominalValue',
                         'pool', 'existingHolders', 'convertibles', 'investors', 'exit'];

const BASE_SCENARIO = {
  dossier: {
    company:   '',
    date:      new Date().toISOString().slice(0, 10),
    reference: '',
    operator:  '',
  },

  preMoney: 8_000_000,
  existingShares: 100_000,
  nominalValue: 1,

  pool: {
    enabled: true,
    targetPct: 10,       // % of post-round fully-diluted shares
    timing: 'pre',       // 'pre' (founders dilute) | 'post' (everyone dilutes)
  },

  existingHolders: [
    { name: 'Fondateur A',    shares: 55_000, note: '' },
    { name: 'Fondateur B',    shares: 35_000, note: '' },
    { name: 'ESOP existant',  shares: 10_000, note: '' },
  ],

  convertibles: [
    {
      name: 'BSA AIR — Bpifrance Pré-Seed',
      type: 'bsa-air',     // 'bsa-air' | 'safe' | 'note'
      amount: 500_000,
      discountPct: 20,
      cap: 6_000_000,
      note: '',
    },
  ],

  investors: [
    {
      name: 'Bpifrance — Fonds Innovation',
      amount: 1_500_000,
      liqMultiple: 1,
      participation: 'non-participating',  // 'non-participating' | 'participating'
      note: '',
    },
    {
      name: 'Business Angel',
      amount: 500_000,
      liqMultiple: 1,
      participation: 'non-participating',
      note: '',
    },
  ],

  exit: {
    enabled: true,
    value: 30_000_000,
  },
};

const DEFAULTS = {
  lang: 'fr',
  currency: 'EUR',
  currentScenario: 'base',
  ...structuredClone(BASE_SCENARIO),
  scenarios: {
    base: structuredClone(BASE_SCENARIO),
    bull: structuredClone(BASE_SCENARIO),
    bear: structuredClone(BASE_SCENARIO),
  },
};

const SYMBOLS = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' };
const LOCALES_BY_LANG = { fr: 'fr-FR', en: 'en-US', de: 'de-DE', es: 'es-ES' };
const CURRENCY_LOCALES = { EUR: 'fr-FR', USD: 'en-US', GBP: 'en-GB', CHF: 'fr-CH' };

/* ─────────────── i18n dictionary ─────────────── */
const I18N = {
  fr: {
    meta_title: "Calcul d'Augmentation de Capital",
    app_title: "Augmentation de Capital",
    app_subtitle: "Pré-money · BSA AIR · ESOP · Dilution · Waterfall",

    section_assumptions: "Hypothèses du tour",
    section_assumptions_sub: "Pré-money · actions · nominale",
    section_pool: "Pool d'options (ESOP / BSPCE)",
    section_pool_sub: "Réservé aux salariés · BSPCE, AGA, BSA",
    section_holders: "Actionnaires existants",
    section_holders_sub: "Capital actuel · actions ordinaires",
    section_convertibles: "Obligations convertibles · BSA AIR",
    section_convertibles_sub: "Convertissent au prix du tour (décote + plafond)",
    section_investors: "Investisseurs · tour de financement",
    section_investors_sub: "Souscripteurs · actions de préférence",
    section_exit: "Scénario de sortie · waterfall",
    section_exit_sub: "Préférence de liquidation et participation",

    label_preMoney: "Valorisation pré-money",
    label_preMoney_hint: "Valeur entreprise avant l'opération (fully-diluted, ESOP inclus)",
    label_existingShares: "Actions existantes",
    label_existingShares_hint: "Total pré-opération",
    label_nominalValue: "Valeur nominale",
    label_nominalValue_hint: "Par action",

    label_poolTargetPct: "Cible post-tour",
    label_poolTargetPct_hint: "% du capital fully-diluted post-opération",
    label_poolTiming: "Création du pool",
    label_poolTiming_hint: "Pré-money : dilue les fondateurs · Post-money : dilue tous",
    poolTiming_pre: "Pré-money",
    poolTiming_post: "Post-money",

    label_exitValue: "Valeur de sortie (exit)",
    label_exitValue_hint: "Glisser pour explorer plusieurs scénarios",

    holder_placeholder_name: "Nom de l'actionnaire",
    holder_placeholder_shares: "Nombre d'actions",

    conv_placeholder_name: "Nom (ex. BSA AIR — Bpifrance Pré-Seed)",
    conv_placeholder_amount: "Montant",
    conv_placeholder_cap: "Plafond pré-money (vide = pas de cap)",
    conv_type_label: "Type",
    conv_type_bsaair: "BSA AIR",
    conv_type_safe: "SAFE",
    conv_type_note: "Obligation convertible (OC)",
    conv_discount_label: "Décote",
    conv_cap_label: "Plafond pré-money",

    investor_placeholder_name: "Nom de l'investisseur",
    investor_placeholder_amount: "Montant",
    investor_liqMult_label: "Pref. liq. (×)",
    investor_part_label: "Participation",
    part_non: "1× non-participante",
    part_participating: "Participante",

    button_addHolder: "Ajouter un actionnaire",
    button_addConv: "Ajouter une convertible / BSA AIR",
    button_addInvestor: "Ajouter un investisseur",
    button_reset: "Réinitialiser",
    button_export: "Exporter CSV",
    button_print: "Imprimer / PDF",

    result_postMoney: "Valorisation post-money",
    hero_eyebrow: "Vue d'ensemble · live",
    hero_investment: "Investissement total",
    hero_implied: "Post-money implicite (prix × actions)",
    hero_dilution: "Dilution fondateurs",

    section_metrics: "Indicateurs clés",
    section_metrics_sub: "Prix, dilution, augmentation, prime",

    result_pricePerShare: "Prix par action",
    result_pricePerShare_sub: "Pré-money ÷ FD pré-money",
    result_newShares: "Actions émises",
    result_newShares_sub: "Pool + conv. + nouveaux",
    result_nominalIncrease: "Augmentation nominale",
    result_nominalIncrease_sub: "Impact capital social",
    result_premiumTotal: "Prime d'émission",
    result_premiumTotal_sub: "Investissement − nominale",

    result_dilution_template:
      "Anciens actionnaires : 100 % → {existingPct} · Prime / action : {premiumPerShare} · Dilution fondateurs : {dilution}",

    legend_existing: "Actionnaires existants",
    legend_pool: "Pool ESOP",
    legend_conv: "Convertibles",
    legend_new: "Nouveaux investisseurs",

    captable_title: "Table de capitalisation",
    captable_subtitle: "Avant et après l'opération · fully-diluted",
    captable_holder: "Détenteur",
    captable_before_shares: "Avant",
    captable_after_shares: "Après",
    captable_distribution: "Répartition",
    captable_liqPref: "Liq. pref.",
    captable_total: "Total",

    waterfall_holder: "Détenteur",
    waterfall_shares: "Actions",
    waterfall_liqPref: "Pref.",
    waterfall_payout: "Reçu",
    waterfall_payoutPct: "% sortie",
    waterfall_treatment: "Traitement",
    treat_pref: "Liq. pref.",
    treat_convert: "Converti → ordinaire",
    treat_common: "Ordinaire (pro-rata)",
    wf_summary_pref: "Préférences payées",
    wf_summary_common: "Distribué aux ordinaires",
    wf_summary_exit: "Sortie",

    warn_nominal: "Valeur nominale supérieure au prix d'émission — émission impossible à ce nominal.",
    warn_holders: "La somme des actionnaires existants ne correspond pas au total d'actions déclaré.",
    warn_pool: "Taille de pool incompatible avec le tour : réduisez la cible.",

    footer_disclaimer: "Outil indicatif — à valider avec votre conseil juridique et Bpifrance le cas échéant.",
    footer_method: "Méthode : prix par action = pré-money ÷ actions fully-diluted, dilution full-dilution. Waterfall : préférence de liquidation 1× par défaut, non-cumulative, sans seniorité.",

    reset_confirm: "Réinitialiser toutes les valeurs ?",
    new_holder_default: "Nouvel actionnaire",
    new_investor_default: "Nouvel investisseur",
    new_conv_default: "Nouvelle convertible",

    section_dossier: "Dossier",
    section_dossier_sub: "Identification de l'opération · scénarios",
    dossier_company: "Société",
    dossier_date: "Date d'opération",
    dossier_reference: "Référence dossier",
    dossier_operator: "Opérateur",
    sc_base: "Base",
    sc_bull: "Bull",
    sc_bear: "Bear",

    note_label: "Note",
    note_placeholder: "Référence interne, dossier, commentaire back-office…",

    section_accounting: "Comptabilité & bilan capital social",
    section_accounting_sub: "Écritures · plan comptable général · variation",
    accounting_journal: "Écritures comptables (PCG)",
    accounting_account: "Compte",
    accounting_label: "Libellé",
    accounting_debit: "Débit",
    accounting_credit: "Crédit",
    acc_512: "Banque — nouvelle souscription en numéraire",
    acc_1675: "Emprunts obligataires convertibles — débouclage BSA AIR / SAFE / OC",
    acc_101: "Capital social — émission au pair",
    acc_1041: "Prime d'émission — au-delà du nominal",
    acc_total: "Total",
    acc_note_pool: "Pool d'options : {count} actions autorisées (réserve hors capital social, à émettre au fur et à mesure des attributions / exercices).",
    acc_note_conv: "Le compte 1675 correspond aux fonds reçus antérieurement au titre des BSA AIR / SAFE / OC, dont la conversion devient effective à la date de l'opération.",

    bilan_title: "Bilan capital social — variation",
    bilan_item: "Poste",
    bilan_before: "Avant",
    bilan_delta: "Variation",
    bilan_after: "Après",
    bilan_capital: "Capital social (101)",
    bilan_prime: "Prime d'émission (1041) — variation",
    bilan_shares: "Actions émises (cumul)",
    bilan_pool: "Pool autorisé hors capital social",

    section_recon: "Contrôles & réconciliation",
    section_recon_sub: "Invariants de cohérence · audit back-office",
    recon_sum_after: "Σ % post-opération = 100,00 %",
    recon_holders: "Détail actionnaires existants ≈ total déclaré",
    recon_price_check: "Prix × actions ≈ post-money implicite",
    recon_nominal: "Valeur nominale ≤ prix d'émission",
    recon_premium: "Prime d'émission ≥ 0",
    recon_pool: "Faisabilité du pool",
    recon_pool_ok: "Compatible avec la cible",
    recon_pool_warn: "Cible incompatible : p × (1 + Y) ≥ 1",
    recon_balance: "Cash reçu = capital + prime",

    conv_binding_cap: "Plafond engageant",
    conv_binding_discount: "Décote engageante",
    conv_binding_none: "Pas de contrainte",
    conv_eff_price: "Prix effectif",
    conv_eff_shares: "Actions",

    button_exportJson: "Exporter JSON",
    button_copy: "Copier",
    button_copied: "Copié",
    print_title: "Augmentation de capital",
    print_scenario: "Scénario",
    print_printedAt: "Édité le",

    tip_preMoney: "Valeur de l'entreprise AVANT que les nouveaux investisseurs n'apportent leur argent. Exemple : si l'entreprise vaut 8 M€ et qu'un investisseur apporte 2 M€, l'entreprise vaudra 10 M€ après l'opération (post-money).",
    tip_nominalValue: "Valeur 'comptable' d'une action, fixée dans les statuts. Souvent 1 € ou 0,10 €. À ne pas confondre avec le prix d'émission (= le prix réel payé par l'investisseur).",
    tip_poolTargetPct: "Pourcentage du capital total qui sera réservé aux salariés (BSPCE, stock-options, actions gratuites) APRÈS la levée. Typiquement 5 à 15 %.",
    tip_poolTiming: "Pré-money : le pool est créé AVANT l'opération, seuls les fondateurs sont dilués. Post-money : le pool est créé APRÈS, tout le monde est dilué. Pré-money est plus avantageux pour l'investisseur, post-money plus avantageux pour les fondateurs.",
    tip_conv_type: "BSA AIR : standard français (Bpifrance / French Tech). SAFE : équivalent américain. OC : obligation convertible (avec intérêts et échéance). Choisir selon le contrat signé.",
    tip_conv_discount: "Réduction sur le prix du prochain tour, accordée à l'investisseur en BSA AIR / SAFE pour récompenser sa prise de risque précoce. Typiquement 15 à 25 %. Mettre 0 si pas de décote.",
    tip_conv_cap: "Valorisation pré-money MAXIMUM à laquelle le BSA AIR / SAFE peut convertir. Si le tour se fait au-dessus, l'investisseur bénéficie quand même du plafond (= plus d'actions). Laisser vide si pas de plafond.",
    tip_investor_liqMult: "À la sortie (vente, IPO), l'investisseur récupère D'ABORD son apport × ce multiplicateur, avant le partage du reste. 1× = standard du marché. 2× ou plus = clauses agressives, rares.",
    tip_investor_part: "Non-participante : l'investisseur prend LE MEILLEUR entre sa préférence et son prorata (standard). Participante : il prend LES DEUX (sa préférence PUIS son prorata) — clause 'double dip' plus agressive.",
    tip_exitValue: "Montant total reçu lors d'une éventuelle revente / IPO de l'entreprise. Sert à simuler comment l'argent serait réparti entre actionnaires selon les préférences de liquidation.",
  },

  en: {
    meta_title: "Capital Increase Calculator",
    app_title: "Capital Increase",
    app_subtitle: "Pre-money · SAFE/BSA AIR · ESOP · Dilution · Waterfall",

    section_assumptions: "Round assumptions",
    section_assumptions_sub: "Pre-money · shares · par value",
    section_pool: "Option pool (ESOP)",
    section_pool_sub: "Employee equity reserve",
    section_holders: "Existing shareholders",
    section_holders_sub: "Current cap table · common stock",
    section_convertibles: "Convertibles · SAFE / BSA AIR / Notes",
    section_convertibles_sub: "Convert at the round price (discount + cap)",
    section_investors: "Investors · priced round",
    section_investors_sub: "Subscribers · preferred shares",
    section_exit: "Exit scenario · waterfall",
    section_exit_sub: "Liquidation preference and participation",

    label_preMoney: "Pre-money valuation",
    label_preMoney_hint: "Fully-diluted (incl. option pool)",
    label_existingShares: "Existing shares",
    label_existingShares_hint: "Before the round",
    label_nominalValue: "Par value",
    label_nominalValue_hint: "Per share",

    label_poolTargetPct: "Target post-round",
    label_poolTargetPct_hint: "% of fully-diluted post-round shares",
    label_poolTiming: "Pool timing",
    label_poolTiming_hint: "Pre-money dilutes founders · Post-money dilutes everyone",
    poolTiming_pre: "Pre-money",
    poolTiming_post: "Post-money",

    label_exitValue: "Exit value",
    label_exitValue_hint: "Drag to explore scenarios",

    holder_placeholder_name: "Shareholder name",
    holder_placeholder_shares: "Number of shares",

    conv_placeholder_name: "Name (e.g. SAFE — Lead Seed)",
    conv_placeholder_amount: "Amount",
    conv_placeholder_cap: "Pre-money cap (blank = no cap)",
    conv_type_label: "Type",
    conv_type_bsaair: "BSA AIR",
    conv_type_safe: "SAFE",
    conv_type_note: "Convertible note",
    conv_discount_label: "Discount",
    conv_cap_label: "Pre-money cap",

    investor_placeholder_name: "Investor name",
    investor_placeholder_amount: "Amount",
    investor_liqMult_label: "Liq. pref. (×)",
    investor_part_label: "Participation",
    part_non: "1× non-participating",
    part_participating: "Participating",

    button_addHolder: "Add shareholder",
    button_addConv: "Add convertible / SAFE",
    button_addInvestor: "Add investor",
    button_reset: "Reset",
    button_export: "Export CSV",
    button_print: "Print / PDF",

    result_postMoney: "Post-money valuation",
    hero_eyebrow: "Overview · live",
    hero_investment: "Total investment",
    hero_implied: "Implied post-money (price × shares)",
    hero_dilution: "Founder dilution",

    section_metrics: "Key metrics",
    section_metrics_sub: "Price, dilution, capital increase, premium",

    result_pricePerShare: "Price per share",
    result_pricePerShare_sub: "Pre-money ÷ FD pre-money",
    result_newShares: "New shares issued",
    result_newShares_sub: "Pool + convertibles + new",
    result_nominalIncrease: "Nominal capital increase",
    result_nominalIncrease_sub: "Impact on share capital",
    result_premiumTotal: "Issue premium",
    result_premiumTotal_sub: "Investment − nominal",

    result_dilution_template:
      "Existing holders: 100% → {existingPct} · Premium / share: {premiumPerShare} · Founder dilution: {dilution}",

    legend_existing: "Existing holders",
    legend_pool: "ESOP pool",
    legend_conv: "Convertibles",
    legend_new: "New investors",

    captable_title: "Capitalization table",
    captable_subtitle: "Before and after · fully-diluted",
    captable_holder: "Holder",
    captable_before_shares: "Before",
    captable_after_shares: "After",
    captable_distribution: "Distribution",
    captable_liqPref: "Liq. pref.",
    captable_total: "Total",

    waterfall_holder: "Holder",
    waterfall_shares: "Shares",
    waterfall_liqPref: "Pref.",
    waterfall_payout: "Receives",
    waterfall_payoutPct: "% exit",
    waterfall_treatment: "Treatment",
    treat_pref: "Liq. pref.",
    treat_convert: "Converted → common",
    treat_common: "Common (pro-rata)",
    wf_summary_pref: "Preferences paid",
    wf_summary_common: "Distributed to common",
    wf_summary_exit: "Exit",

    warn_nominal: "Par value exceeds issue price — issuance impossible at this par.",
    warn_holders: "Existing shareholders' shares don't match the declared total.",
    warn_pool: "Pool target incompatible with the round — lower the target.",

    footer_disclaimer: "Indicative tool — verify with your legal counsel.",
    footer_method: "Method: price/share = pre-money ÷ FD shares; waterfall: 1× non-cumulative liq. pref. by default, no seniority.",

    reset_confirm: "Reset all values?",
    new_holder_default: "New shareholder",
    new_investor_default: "New investor",
    new_conv_default: "New convertible",

    section_dossier: "Deal record",
    section_dossier_sub: "Operation identification · scenarios",
    dossier_company: "Company",
    dossier_date: "Operation date",
    dossier_reference: "Reference / case ID",
    dossier_operator: "Operator",
    sc_base: "Base",
    sc_bull: "Bull",
    sc_bear: "Bear",

    note_label: "Note",
    note_placeholder: "Reference, dossier, back-office comment…",

    section_accounting: "Accounting & share-capital balance",
    section_accounting_sub: "Journal entries · French GAAP · variation",
    accounting_journal: "Journal entries (PCG)",
    accounting_account: "Account",
    accounting_label: "Label",
    accounting_debit: "Debit",
    accounting_credit: "Credit",
    acc_512: "Bank — new cash subscription",
    acc_1675: "Convertible-note liability — BSA AIR / SAFE / OC settlement",
    acc_101: "Share capital — issuance at par",
    acc_1041: "Share premium — above par",
    acc_total: "Total",
    acc_note_pool: "Option pool: {count} authorized shares (reserve, outside share capital, to be issued upon grant/exercise).",
    acc_note_conv: "Account 1675 clears the convertible liability (BSA AIR / SAFE / OC funds received earlier) into equity at this closing.",

    bilan_title: "Share-capital balance — variation",
    bilan_item: "Item",
    bilan_before: "Before",
    bilan_delta: "Delta",
    bilan_after: "After",
    bilan_capital: "Share capital (101)",
    bilan_prime: "Share premium (1041) — delta",
    bilan_shares: "Shares issued (cumulative)",
    bilan_pool: "Authorized pool (off-balance)",

    section_recon: "Checks & reconciliation",
    section_recon_sub: "Consistency invariants · back-office audit",
    recon_sum_after: "Σ % post-round = 100.00%",
    recon_holders: "Existing-holder detail ≈ declared total",
    recon_price_check: "Price × shares ≈ implied post-money",
    recon_nominal: "Par value ≤ issue price",
    recon_premium: "Share premium ≥ 0",
    recon_pool: "Pool feasibility",
    recon_pool_ok: "Compatible with target",
    recon_pool_warn: "Target infeasible: p × (1 + Y) ≥ 1",
    recon_balance: "Cash received = capital + premium",

    conv_binding_cap: "Cap binding",
    conv_binding_discount: "Discount binding",
    conv_binding_none: "No binding constraint",
    conv_eff_price: "Effective price",
    conv_eff_shares: "Shares",

    button_exportJson: "Export JSON",
    button_copy: "Copy",
    button_copied: "Copied",
    print_title: "Capital increase",
    print_scenario: "Scenario",
    print_printedAt: "Edited on",

    tip_preMoney: "Company value BEFORE new investors put in their money. Example: if the company is worth €8M and an investor adds €2M, post-money is €10M.",
    tip_nominalValue: "Accounting 'par' value of a share, set in the articles of association. Often €1 or €0.10. Not to be confused with the issue price (= what the investor actually pays).",
    tip_poolTargetPct: "Percentage of total post-round capital reserved for employees (stock options, BSPCE in France). Typically 5–15%.",
    tip_poolTiming: "Pre-money: pool created BEFORE the round, only founders are diluted. Post-money: pool created AFTER, everyone is diluted. Pre-money is investor-friendly, post-money is founder-friendly.",
    tip_conv_type: "BSA AIR: French standard (Bpifrance / French Tech). SAFE: US equivalent. Convertible note: with interest and maturity. Pick based on the signed contract.",
    tip_conv_discount: "Reduction on the next-round price granted to the SAFE/BSA AIR investor to reward early risk-taking. Typically 15–25%. Enter 0 if no discount.",
    tip_conv_cap: "Maximum pre-money valuation at which the SAFE/BSA AIR can convert. If the round is above the cap, the investor still benefits from the cap (= more shares). Leave blank if uncapped.",
    tip_investor_liqMult: "At exit (sale, IPO), the investor first recovers their investment × this multiplier, before the remainder is split. 1× = market standard. 2× or more = aggressive, uncommon.",
    tip_investor_part: "Non-participating: investor takes THE BEST of liq pref or pro-rata (standard). Participating: takes BOTH (liq pref THEN pro-rata of remainder) — 'double dip', more aggressive.",
    tip_exitValue: "Total amount received in a potential sale/IPO of the company. Used to simulate how the proceeds would be split among shareholders given the liquidation preferences.",
  },

  de: {
    meta_title: "Kapitalerhöhungs-Rechner",
    app_title: "Kapitalerhöhung",
    app_subtitle: "Pre-Money · SAFE · ESOP · Verwässerung · Waterfall",

    section_assumptions: "Annahmen der Runde",
    section_assumptions_sub: "Pre-Money · Aktien · Nennwert",
    section_pool: "Optionspool (ESOP)",
    section_pool_sub: "Reserviert für Mitarbeiter",
    section_holders: "Bestehende Aktionäre",
    section_holders_sub: "Aktuelle Cap Table · Stammaktien",
    section_convertibles: "Wandelanleihen · SAFE",
    section_convertibles_sub: "Wandlung zum Rundenpreis (Discount + Cap)",
    section_investors: "Investoren · Finanzierungsrunde",
    section_investors_sub: "Zeichner · Vorzugsaktien",
    section_exit: "Exit-Szenario · Waterfall",
    section_exit_sub: "Liquidationspräferenz und Partizipation",

    label_preMoney: "Pre-Money-Bewertung",
    label_preMoney_hint: "Voll verwässert (inkl. ESOP)",
    label_existingShares: "Bestehende Aktien",
    label_existingShares_hint: "Vor der Runde",
    label_nominalValue: "Nennwert",
    label_nominalValue_hint: "Pro Aktie",

    label_poolTargetPct: "Ziel post-Runde",
    label_poolTargetPct_hint: "% voll verwässerter Aktien post-Runde",
    label_poolTiming: "Pool-Zeitpunkt",
    label_poolTiming_hint: "Pre-Money: verwässert Gründer · Post-Money: verwässert alle",
    poolTiming_pre: "Pre-Money",
    poolTiming_post: "Post-Money",

    label_exitValue: "Exit-Wert",
    label_exitValue_hint: "Zum Erkunden ziehen",

    holder_placeholder_name: "Name des Aktionärs",
    holder_placeholder_shares: "Anzahl Aktien",

    conv_placeholder_name: "Name (z.B. SAFE — Lead Seed)",
    conv_placeholder_amount: "Betrag",
    conv_placeholder_cap: "Pre-Money Cap (leer = kein Cap)",
    conv_type_label: "Typ",
    conv_type_bsaair: "BSA AIR",
    conv_type_safe: "SAFE",
    conv_type_note: "Wandeldarlehen",
    conv_discount_label: "Discount",
    conv_cap_label: "Pre-Money Cap",

    investor_placeholder_name: "Name des Investors",
    investor_placeholder_amount: "Betrag",
    investor_liqMult_label: "Liq.-Pref. (×)",
    investor_part_label: "Partizipation",
    part_non: "1× nicht-partizipierend",
    part_participating: "Partizipierend",

    button_addHolder: "Aktionär hinzufügen",
    button_addConv: "Wandelanleihe hinzufügen",
    button_addInvestor: "Investor hinzufügen",
    button_reset: "Zurücksetzen",
    button_export: "CSV exportieren",
    button_print: "Drucken / PDF",

    result_postMoney: "Post-Money-Bewertung",
    hero_eyebrow: "Überblick · live",
    hero_investment: "Gesamtinvestition",
    hero_implied: "Implizit (Preis × Aktien)",
    hero_dilution: "Gründer-Verwässerung",

    section_metrics: "Kennzahlen",
    section_metrics_sub: "Preis, Verwässerung, Kapitalerhöhung, Agio",

    result_pricePerShare: "Preis pro Aktie",
    result_pricePerShare_sub: "Pre-Money ÷ FD Pre-Money",
    result_newShares: "Neue Aktien",
    result_newShares_sub: "Pool + Wandel + Neue",
    result_nominalIncrease: "Nominalerhöhung",
    result_nominalIncrease_sub: "Auswirkung Grundkapital",
    result_premiumTotal: "Agio",
    result_premiumTotal_sub: "Investition − Nennwert",

    result_dilution_template:
      "Altaktionäre: 100 % → {existingPct} · Agio/Aktie: {premiumPerShare} · Gründer-Verwässerung: {dilution}",

    legend_existing: "Altaktionäre",
    legend_pool: "ESOP-Pool",
    legend_conv: "Wandel",
    legend_new: "Neue Investoren",

    captable_title: "Kapitalisierungstabelle",
    captable_subtitle: "Vor und nach der Runde · voll verwässert",
    captable_holder: "Inhaber",
    captable_before_shares: "Vorher",
    captable_after_shares: "Nachher",
    captable_distribution: "Verteilung",
    captable_liqPref: "Liq.-Pref.",
    captable_total: "Gesamt",

    waterfall_holder: "Inhaber",
    waterfall_shares: "Aktien",
    waterfall_liqPref: "Pref.",
    waterfall_payout: "Erhält",
    waterfall_payoutPct: "% Exit",
    waterfall_treatment: "Behandlung",
    treat_pref: "Liq.-Pref.",
    treat_convert: "Gewandelt → Stamm",
    treat_common: "Stamm (Pro-rata)",
    wf_summary_pref: "Präferenzen gezahlt",
    wf_summary_common: "Verteilt an Stamm",
    wf_summary_exit: "Exit",

    warn_nominal: "Nennwert übersteigt Ausgabepreis — Emission unmöglich.",
    warn_holders: "Aktionärssumme stimmt nicht mit Gesamtzahl überein.",
    warn_pool: "Pool-Ziel unverträglich — Ziel senken.",

    footer_disclaimer: "Indikatives Tool — mit Rechtsbeistand zu prüfen.",
    footer_method: "Methode: Preis/Aktie = Pre-Money ÷ FD-Aktien; Waterfall: 1× nicht-kumulativ, keine Seniorität.",

    reset_confirm: "Alle Werte zurücksetzen?",
    new_holder_default: "Neuer Aktionär",
    new_investor_default: "Neuer Investor",
    new_conv_default: "Neue Wandelanleihe",

    section_dossier: "Dossier",
    section_dossier_sub: "Identifikation der Transaktion · Szenarien",
    dossier_company: "Gesellschaft",
    dossier_date: "Transaktionsdatum",
    dossier_reference: "Referenz / Vorgangsnummer",
    dossier_operator: "Bearbeiter",
    sc_base: "Base",
    sc_bull: "Bull",
    sc_bear: "Bear",

    note_label: "Notiz",
    note_placeholder: "Referenz, Vorgang, Back-Office-Kommentar…",

    section_accounting: "Buchhaltung & Grundkapital",
    section_accounting_sub: "Buchungssätze · franz. GAAP · Veränderung",
    accounting_journal: "Buchungssätze (PCG)",
    accounting_account: "Konto",
    accounting_label: "Bezeichnung",
    accounting_debit: "Soll",
    accounting_credit: "Haben",
    acc_512: "Bank — neue Bareinzahlung",
    acc_1675: "Wandelanleihe-Verbindlichkeit — Abwicklung BSA AIR / SAFE / OC",
    acc_101: "Grundkapital — Emission zum Nennwert",
    acc_1041: "Agio — über Nennwert",
    acc_total: "Gesamt",
    acc_note_pool: "Optionspool: {count} genehmigte Aktien (Reserve, außerhalb Grundkapital, bei Gewährung/Ausübung auszugeben).",
    acc_note_conv: "Konto 1675 löst die vor dem Closing erhaltenen Wandelbeträge (BSA AIR / SAFE / OC) in Eigenkapital auf.",

    bilan_title: "Grundkapital — Veränderung",
    bilan_item: "Position",
    bilan_before: "Vorher",
    bilan_delta: "Veränderung",
    bilan_after: "Nachher",
    bilan_capital: "Grundkapital (101)",
    bilan_prime: "Agio (1041) — Veränderung",
    bilan_shares: "Ausgegebene Aktien (kumuliert)",
    bilan_pool: "Genehmigter Pool (außerhalb Bilanz)",

    section_recon: "Kontrollen & Abstimmung",
    section_recon_sub: "Konsistenz-Invarianten · Back-Office-Audit",
    recon_sum_after: "Σ % post-Runde = 100,00 %",
    recon_holders: "Aktionärsdetail ≈ deklarierte Summe",
    recon_price_check: "Preis × Aktien ≈ implizit post-Money",
    recon_nominal: "Nennwert ≤ Ausgabepreis",
    recon_premium: "Agio ≥ 0",
    recon_pool: "Pool-Machbarkeit",
    recon_pool_ok: "Mit Ziel kompatibel",
    recon_pool_warn: "Ziel unrealisierbar: p × (1 + Y) ≥ 1",
    recon_balance: "Cash erhalten = Kapital + Agio",

    conv_binding_cap: "Cap bindend",
    conv_binding_discount: "Discount bindend",
    conv_binding_none: "Keine Bindung",
    conv_eff_price: "Effektivpreis",
    conv_eff_shares: "Aktien",

    button_exportJson: "JSON exportieren",
    button_copy: "Kopieren",
    button_copied: "Kopiert",
    print_title: "Kapitalerhöhung",
    print_scenario: "Szenario",
    print_printedAt: "Bearbeitet am",

    tip_preMoney: "Unternehmenswert VOR der Kapitalrunde. Beispiel: bei 8 Mio € Pre-Money und 2 Mio € neuem Kapital ergibt sich ein Post-Money von 10 Mio €.",
    tip_nominalValue: "Nennwert pro Aktie laut Satzung. Oft 1 € oder 0,10 €. Nicht zu verwechseln mit dem Ausgabepreis (was der Investor tatsächlich zahlt).",
    tip_poolTargetPct: "Prozentsatz des Gesamtkapitals nach der Runde, der für Mitarbeiter reserviert ist (Stock Options, BSPCE in Frankreich). Typischerweise 5–15%.",
    tip_poolTiming: "Pre-Money: Pool wird VOR der Runde erstellt, nur Gründer verwässern. Post-Money: Pool wird DANACH erstellt, alle verwässern. Pre-Money ist investorenfreundlich, Post-Money gründerfreundlich.",
    tip_conv_type: "BSA AIR: französischer Standard (Bpifrance / French Tech). SAFE: US-Pendant. Wandeldarlehen: mit Zinsen und Laufzeit. Wählen Sie nach Vertrag.",
    tip_conv_discount: "Preisnachlass auf den Rundenpreis als Belohnung für frühes Risiko. Typischerweise 15–25%. 0 eingeben, wenn kein Discount.",
    tip_conv_cap: "Maximaler Pre-Money-Wert, zu dem das SAFE/BSA AIR wandeln darf. Liegt die Runde darüber, profitiert der Investor weiterhin vom Cap (= mehr Aktien). Leer = kein Cap.",
    tip_investor_liqMult: "Beim Exit (Verkauf, IPO) erhält der Investor ZUERST sein Investment × diesen Multiplikator, bevor der Rest verteilt wird. 1× = Marktstandard. 2× oder mehr = aggressiv, selten.",
    tip_investor_part: "Nicht-partizipierend: Investor wählt das BESSERE aus Liq.-Pref. oder Pro-rata (Standard). Partizipierend: nimmt BEIDES (Liq.-Pref. PLUS Pro-rata) — 'Double-Dip', aggressiver.",
    tip_exitValue: "Gesamtbetrag, der bei einem Verkauf/IPO des Unternehmens erlöst wird. Simuliert, wie der Erlös unter den Aktionären gemäß den Liquidationspräferenzen verteilt würde.",
  },

  es: {
    meta_title: "Calculadora de Ampliación de Capital",
    app_title: "Ampliación de Capital",
    app_subtitle: "Pre-money · SAFE · ESOP · Dilución · Waterfall",

    section_assumptions: "Hipótesis de la ronda",
    section_assumptions_sub: "Pre-money · acciones · valor nominal",
    section_pool: "Pool de opciones (ESOP)",
    section_pool_sub: "Reservado para empleados",
    section_holders: "Accionistas existentes",
    section_holders_sub: "Capital actual · acciones ordinarias",
    section_convertibles: "Convertibles · SAFE",
    section_convertibles_sub: "Convierten al precio de la ronda (descuento + cap)",
    section_investors: "Inversores · ronda con precio",
    section_investors_sub: "Suscriptores · acciones preferentes",
    section_exit: "Escenario de salida · waterfall",
    section_exit_sub: "Preferencia de liquidación y participación",

    label_preMoney: "Valoración pre-money",
    label_preMoney_hint: "Totalmente diluido (ESOP incl.)",
    label_existingShares: "Acciones existentes",
    label_existingShares_hint: "Antes de la ronda",
    label_nominalValue: "Valor nominal",
    label_nominalValue_hint: "Por acción",

    label_poolTargetPct: "Objetivo post-ronda",
    label_poolTargetPct_hint: "% de las acciones FD post-ronda",
    label_poolTiming: "Momento del pool",
    label_poolTiming_hint: "Pre-money: diluye fundadores · Post-money: diluye a todos",
    poolTiming_pre: "Pre-money",
    poolTiming_post: "Post-money",

    label_exitValue: "Valor de salida",
    label_exitValue_hint: "Deslizar para explorar escenarios",

    holder_placeholder_name: "Nombre del accionista",
    holder_placeholder_shares: "Número de acciones",

    conv_placeholder_name: "Nombre (p. ej. SAFE — Lead Seed)",
    conv_placeholder_amount: "Cantidad",
    conv_placeholder_cap: "Cap pre-money (vacío = sin cap)",
    conv_type_label: "Tipo",
    conv_type_bsaair: "BSA AIR",
    conv_type_safe: "SAFE",
    conv_type_note: "Préstamo convertible",
    conv_discount_label: "Descuento",
    conv_cap_label: "Cap pre-money",

    investor_placeholder_name: "Nombre del inversor",
    investor_placeholder_amount: "Cantidad",
    investor_liqMult_label: "Pref. liq. (×)",
    investor_part_label: "Participación",
    part_non: "1× no participante",
    part_participating: "Participante",

    button_addHolder: "Añadir accionista",
    button_addConv: "Añadir convertible / SAFE",
    button_addInvestor: "Añadir inversor",
    button_reset: "Reiniciar",
    button_export: "Exportar CSV",
    button_print: "Imprimir / PDF",

    result_postMoney: "Valoración post-money",
    hero_eyebrow: "Resumen · en vivo",
    hero_investment: "Inversión total",
    hero_implied: "Post-money implícito (precio × acciones)",
    hero_dilution: "Dilución fundadores",

    section_metrics: "Indicadores clave",
    section_metrics_sub: "Precio, dilución, ampliación, prima",

    result_pricePerShare: "Precio por acción",
    result_pricePerShare_sub: "Pre-money ÷ acciones FD pre-money",
    result_newShares: "Nuevas acciones",
    result_newShares_sub: "Pool + convertibles + nuevos",
    result_nominalIncrease: "Aumento nominal",
    result_nominalIncrease_sub: "Impacto capital social",
    result_premiumTotal: "Prima de emisión",
    result_premiumTotal_sub: "Inversión − nominal",

    result_dilution_template:
      "Accionistas antiguos: 100 % → {existingPct} · Prima/acción: {premiumPerShare} · Dilución fundadores: {dilution}",

    legend_existing: "Accionistas existentes",
    legend_pool: "Pool ESOP",
    legend_conv: "Convertibles",
    legend_new: "Nuevos inversores",

    captable_title: "Tabla de capitalización",
    captable_subtitle: "Antes y después · totalmente diluido",
    captable_holder: "Titular",
    captable_before_shares: "Antes",
    captable_after_shares: "Después",
    captable_distribution: "Distribución",
    captable_liqPref: "Pref. liq.",
    captable_total: "Total",

    waterfall_holder: "Titular",
    waterfall_shares: "Acciones",
    waterfall_liqPref: "Pref.",
    waterfall_payout: "Recibe",
    waterfall_payoutPct: "% salida",
    waterfall_treatment: "Tratamiento",
    treat_pref: "Pref. liq.",
    treat_convert: "Convertido → ordinaria",
    treat_common: "Ordinaria (prorrata)",
    wf_summary_pref: "Preferencias pagadas",
    wf_summary_common: "Distribuido a ordinarios",
    wf_summary_exit: "Salida",

    warn_nominal: "Valor nominal supera el precio de emisión — emisión imposible.",
    warn_holders: "La suma de accionistas no coincide con el total declarado.",
    warn_pool: "Tamaño de pool incompatible — reducir el objetivo.",

    footer_disclaimer: "Herramienta indicativa — verifique con su asesor legal.",
    footer_method: "Método: precio/acción = pre-money ÷ acciones FD; waterfall: 1× no acumulativa.",

    reset_confirm: "¿Reiniciar todos los valores?",
    new_holder_default: "Nuevo accionista",
    new_investor_default: "Nuevo inversor",
    new_conv_default: "Nuevo convertible",

    section_dossier: "Expediente",
    section_dossier_sub: "Identificación de la operación · escenarios",
    dossier_company: "Sociedad",
    dossier_date: "Fecha de operación",
    dossier_reference: "Referencia / expediente",
    dossier_operator: "Operador",
    sc_base: "Base",
    sc_bull: "Bull",
    sc_bear: "Bear",

    note_label: "Nota",
    note_placeholder: "Referencia, expediente, comentario back-office…",

    section_accounting: "Contabilidad & capital social",
    section_accounting_sub: "Asientos · PCG francés · variación",
    accounting_journal: "Asientos contables (PCG)",
    accounting_account: "Cuenta",
    accounting_label: "Concepto",
    accounting_debit: "Debe",
    accounting_credit: "Haber",
    acc_512: "Banco — nueva suscripción en efectivo",
    acc_1675: "Pasivo convertible — liquidación BSA AIR / SAFE / OC",
    acc_101: "Capital social — emisión al nominal",
    acc_1041: "Prima de emisión — sobre nominal",
    acc_total: "Total",
    acc_note_pool: "Pool de opciones: {count} acciones autorizadas (reserva, fuera del capital social, a emitir al ejercitar).",
    acc_note_conv: "La cuenta 1675 liquida los fondos convertibles (BSA AIR / SAFE / OC) recibidos previamente en patrimonio en el cierre.",

    bilan_title: "Capital social — variación",
    bilan_item: "Concepto",
    bilan_before: "Antes",
    bilan_delta: "Variación",
    bilan_after: "Después",
    bilan_capital: "Capital social (101)",
    bilan_prime: "Prima de emisión (1041) — variación",
    bilan_shares: "Acciones emitidas (acumulado)",
    bilan_pool: "Pool autorizado (fuera de balance)",

    section_recon: "Controles & reconciliación",
    section_recon_sub: "Invariantes de consistencia · auditoría back-office",
    recon_sum_after: "Σ % post-ronda = 100,00 %",
    recon_holders: "Accionistas existentes ≈ total declarado",
    recon_price_check: "Precio × acciones ≈ post-money implícito",
    recon_nominal: "Valor nominal ≤ precio de emisión",
    recon_premium: "Prima de emisión ≥ 0",
    recon_pool: "Viabilidad del pool",
    recon_pool_ok: "Compatible con el objetivo",
    recon_pool_warn: "Objetivo inviable: p × (1 + Y) ≥ 1",
    recon_balance: "Cash recibido = capital + prima",

    conv_binding_cap: "Cap vinculante",
    conv_binding_discount: "Descuento vinculante",
    conv_binding_none: "Sin restricción",
    conv_eff_price: "Precio efectivo",
    conv_eff_shares: "Acciones",

    button_exportJson: "Exportar JSON",
    button_copy: "Copiar",
    button_copied: "Copiado",
    print_title: "Ampliación de capital",
    print_scenario: "Escenario",
    print_printedAt: "Editado el",

    tip_preMoney: "Valor de la empresa ANTES de que entren los nuevos inversores. Ejemplo: si la empresa vale 8 M€ y un inversor aporta 2 M€, el post-money será 10 M€.",
    tip_nominalValue: "Valor nominal de una acción según los estatutos. A menudo 1 € o 0,10 €. No confundir con el precio de emisión (lo que realmente paga el inversor).",
    tip_poolTargetPct: "Porcentaje del capital total post-ronda reservado a empleados (stock options, BSPCE en Francia). Normalmente 5–15%.",
    tip_poolTiming: "Pre-money: el pool se crea ANTES de la ronda, solo los fundadores se diluyen. Post-money: se crea DESPUÉS, todos se diluyen. Pre-money favorece al inversor, post-money a los fundadores.",
    tip_conv_type: "BSA AIR: estándar francés (Bpifrance / French Tech). SAFE: equivalente estadounidense. Préstamo convertible: con intereses y vencimiento. Elegir según el contrato firmado.",
    tip_conv_discount: "Descuento sobre el precio de la próxima ronda, otorgado al inversor SAFE/BSA AIR por su riesgo temprano. Normalmente 15–25%. Poner 0 si no hay descuento.",
    tip_conv_cap: "Valoración pre-money MÁXIMA a la que el SAFE/BSA AIR puede convertir. Si la ronda es superior al cap, el inversor se beneficia del cap (= más acciones). Dejar vacío si no hay cap.",
    tip_investor_liqMult: "Al salir (venta, IPO), el inversor recupera PRIMERO su aporte × este multiplicador, antes del reparto. 1× = estándar de mercado. 2× o más = agresivo, poco común.",
    tip_investor_part: "No participante: el inversor toma LO MEJOR entre preferencia o prorrata (estándar). Participante: toma AMBOS (preferencia Y prorrata) — 'double dip', más agresivo.",
    tip_exitValue: "Importe total recibido en una posible venta/IPO de la empresa. Sirve para simular cómo se repartiría el dinero entre los accionistas según las preferencias de liquidación.",
  },
};

const t = (key, vars) => {
  let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.fr[key] || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  }
  return s;
};

/* ─────────────── State ─────────────── */
const state = loadState();

function sanitizeScenario(p) {
  p = p || {};
  return {
    dossier: {
      company:   String((p.dossier && p.dossier.company)   ?? ''),
      date:      String((p.dossier && p.dossier.date)      ?? BASE_SCENARIO.dossier.date),
      reference: String((p.dossier && p.dossier.reference) ?? ''),
      operator:  String((p.dossier && p.dossier.operator)  ?? ''),
    },
    preMoney: Number(p.preMoney) || 0,
    existingShares: Number(p.existingShares) || 0,
    nominalValue: Number(p.nominalValue) || 0,
    pool: {
      enabled: !!(p.pool && p.pool.enabled),
      targetPct: Number(p.pool && p.pool.targetPct) || 0,
      timing: (p.pool && (p.pool.timing === 'post' || p.pool.timing === 'pre'))
        ? p.pool.timing : BASE_SCENARIO.pool.timing,
    },
    existingHolders: Array.isArray(p.existingHolders) && p.existingHolders.length
      ? p.existingHolders.map(h => ({
          name: String(h.name ?? ''),
          shares: Number(h.shares) || 0,
          note: String(h.note ?? ''),
        }))
      : structuredClone(BASE_SCENARIO.existingHolders),
    convertibles: Array.isArray(p.convertibles)
      ? p.convertibles.map(c => ({
          name: String(c.name ?? ''),
          type: ['bsa-air','safe','note'].includes(c.type) ? c.type : 'bsa-air',
          amount: Number(c.amount) || 0,
          discountPct: Number(c.discountPct) || 0,
          cap: Number(c.cap) || 0,
          note: String(c.note ?? ''),
        }))
      : structuredClone(BASE_SCENARIO.convertibles),
    investors: Array.isArray(p.investors)
      ? p.investors.map(i => ({
          name: String(i.name ?? ''),
          amount: Number(i.amount) || 0,
          liqMultiple: Number(i.liqMultiple) || 1,
          participation: i.participation === 'participating' ? 'participating' : 'non-participating',
          note: String(i.note ?? ''),
        }))
      : structuredClone(BASE_SCENARIO.investors),
    exit: {
      enabled: !!(p.exit && p.exit.enabled),
      value: Number(p.exit && p.exit.value) || 0,
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Also try previous schema version for migration
    const rawLegacy = raw ? null : localStorage.getItem('capital-increase-calculator/state/v3');
    if (!raw && !rawLegacy) return structuredClone(DEFAULTS);
    const p = JSON.parse(raw || rawLegacy);

    const currentScenario = SCENARIO_IDS.includes(p.currentScenario) ? p.currentScenario : 'base';
    const scenarios = {};
    SCENARIO_IDS.forEach(id => {
      scenarios[id] = sanitizeScenario(
        (p.scenarios && p.scenarios[id]) || (id === currentScenario ? p : null)
      );
    });
    const active = scenarios[currentScenario];

    return {
      lang: I18N[p.lang] ? p.lang : DEFAULTS.lang,
      currency: SYMBOLS[p.currency] ? p.currency : DEFAULTS.currency,
      currentScenario,
      ...structuredClone(active),
      scenarios,
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

function snapshotCurrent() {
  const snap = {};
  SCENARIO_FIELDS.forEach(k => { snap[k] = structuredClone(state[k]); });
  return snap;
}

function saveState() {
  // Mirror current top-level into the active scenario slot
  state.scenarios[state.currentScenario] = snapshotCurrent();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function applyScenarioFields(scn) {
  SCENARIO_FIELDS.forEach(k => { state[k] = structuredClone(scn[k]); });
}

function switchScenario(newId) {
  if (!SCENARIO_IDS.includes(newId)) return;
  if (newId === state.currentScenario) return;
  // Save current to active slot
  state.scenarios[state.currentScenario] = snapshotCurrent();
  // Switch
  state.currentScenario = newId;
  // Load target into top-level
  applyScenarioFields(state.scenarios[newId]);
  saveState();
  // Re-render everything
  applyCurrencyUI();
  syncPoolTimingUI();
  syncDossierUI();
  syncScenarioUI();
  renderHolders();
  renderConvertibles();
  renderInvestors();
  compute();
}

/* ─────────────── Formatting ─────────────── */
const numLocale = () => CURRENCY_LOCALES[state.currency];

const fmtMoney = (n, decimals = 0) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(numLocale(), {
    style: 'currency', currency: state.currency,
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
};
const fmtMoneyCompact = (n) => {
  if (!isFinite(n)) return '—';
  const abs = Math.abs(n);
  let decimals = 0;
  if (abs > 0 && abs < 1) decimals = 4;
  else if (abs < 10) decimals = 2;
  return fmtMoney(n, decimals);
};
const fmtNum = (n, decimals = 0) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(numLocale(), {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
};
const fmtPct = (n, decimals = 2) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(numLocale(), {
    style: 'percent',
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
};
const parseNum = (s) => {
  if (s == null) return 0;
  const cleaned = String(s).replace(/[^\d.,-]/g, '').replace(/\s/g, '');
  let normalized = cleaned;
  const lastComma = normalized.lastIndexOf(',');
  const lastDot   = normalized.lastIndexOf('.');
  if (lastComma > lastDot) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else {
    normalized = normalized.replace(/,/g, '');
  }
  const n = parseFloat(normalized);
  return isNaN(n) ? 0 : n;
};
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );

/* ─────────────── i18n DOM apply ─────────────── */
function applyI18n() {
  document.documentElement.lang = state.lang;
  document.title = t('meta_title');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-tip]').forEach(el => {
    el.setAttribute('data-tip', t(el.dataset.i18nTip));
  });
  document.querySelectorAll('#langPick button').forEach(b =>
    b.classList.toggle('on', b.dataset.lang === state.lang)
  );
}

/* ─────────────── Render: holders ─────────────── */
const holderListEl = document.getElementById('holderList');
function renderHolders() {
  holderListEl.innerHTML = '';
  state.existingHolders.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'row-card';
    card.innerHTML = `
      <div class="row-main">
        <input type="text" class="name" placeholder="${escapeHtml(t('holder_placeholder_name'))}" value="${escapeHtml(h.name)}">
        <input type="text" class="amount" placeholder="${escapeHtml(t('holder_placeholder_shares'))}" value="${fmtNum(h.shares, 0)}" inputmode="decimal">
        <button class="del" aria-label="Delete" title="Delete">
          <span class="material-symbols-outlined" style="font-size:18px">close</span>
        </button>
      </div>
      <div class="row-note">
        <label>${escapeHtml(t('note_label'))}</label>
        <textarea class="note" rows="2" placeholder="${escapeHtml(t('note_placeholder'))}">${escapeHtml(h.note || '')}</textarea>
      </div>
    `;
    card.querySelector('.name').addEventListener('input', e => {
      state.existingHolders[i].name = e.target.value;
      saveState(); compute();
    });
    const sharesInput = card.querySelector('.amount');
    sharesInput.addEventListener('input', e => {
      state.existingHolders[i].shares = parseNum(e.target.value);
      saveState(); compute();
    });
    sharesInput.addEventListener('blur', e => {
      e.target.value = fmtNum(state.existingHolders[i].shares, 0);
    });
    card.querySelector('.note').addEventListener('input', e => {
      state.existingHolders[i].note = e.target.value;
      saveState();
    });
    card.querySelector('.del').addEventListener('click', () => {
      state.existingHolders.splice(i, 1);
      renderHolders(); saveState(); compute();
    });
    holderListEl.appendChild(card);
  });
}
document.getElementById('addHolder').addEventListener('click', () => {
  state.existingHolders.push({ name: t('new_holder_default'), shares: 0, note: '' });
  renderHolders(); saveState(); compute();
});

/* ─────────────── Render: convertibles ─────────────── */
const convListEl = document.getElementById('convList');
function renderConvertibles() {
  convListEl.innerHTML = '';
  state.convertibles.forEach((cv, i) => {
    const card = document.createElement('div');
    card.className = 'row-card';
    card.innerHTML = `
      <div class="row-main">
        <input type="text" class="name" placeholder="${escapeHtml(t('conv_placeholder_name'))}" value="${escapeHtml(cv.name)}">
        <input type="text" class="amount" placeholder="${escapeHtml(t('conv_placeholder_amount'))}" value="${fmtNum(cv.amount, 0)}" inputmode="decimal">
        <button class="del" aria-label="Delete" title="Delete">
          <span class="material-symbols-outlined" style="font-size:18px">close</span>
        </button>
      </div>
      <div class="row-extra row-extra-3">
        <div class="mini">
          <label>
            <span>${escapeHtml(t('conv_type_label'))}</span>
            <button type="button" class="help-btn" data-tip="${escapeHtml(t('tip_conv_type'))}" aria-label="?">?</button>
          </label>
          <select class="type">
            <option value="bsa-air" ${cv.type === 'bsa-air' ? 'selected' : ''}>${escapeHtml(t('conv_type_bsaair'))}</option>
            <option value="safe"    ${cv.type === 'safe'    ? 'selected' : ''}>${escapeHtml(t('conv_type_safe'))}</option>
            <option value="note"    ${cv.type === 'note'    ? 'selected' : ''}>${escapeHtml(t('conv_type_note'))}</option>
          </select>
        </div>
        <div class="mini">
          <label>
            <span>${escapeHtml(t('conv_discount_label'))} (%)</span>
            <button type="button" class="help-btn" data-tip="${escapeHtml(t('tip_conv_discount'))}" aria-label="?">?</button>
          </label>
          <input type="text" class="discount numeric" value="${fmtNum(cv.discountPct, 0)}" inputmode="decimal">
        </div>
        <div class="mini">
          <label>
            <span>${escapeHtml(t('conv_cap_label'))}</span>
            <button type="button" class="help-btn" data-tip="${escapeHtml(t('tip_conv_cap'))}" aria-label="?">?</button>
          </label>
          <input type="text" class="cap numeric" placeholder="${escapeHtml(t('conv_placeholder_cap'))}" value="${cv.cap > 0 ? fmtNum(cv.cap, 0) : ''}" inputmode="decimal">
        </div>
      </div>
      <div class="conv-detail" data-conv-detail></div>
      <div class="row-note">
        <label>${escapeHtml(t('note_label'))}</label>
        <textarea class="note" rows="2" placeholder="${escapeHtml(t('note_placeholder'))}">${escapeHtml(cv.note || '')}</textarea>
      </div>
    `;
    card.querySelector('.name').addEventListener('input', e => {
      state.convertibles[i].name = e.target.value; saveState(); compute();
    });
    card.querySelector('.amount').addEventListener('input', e => {
      state.convertibles[i].amount = parseNum(e.target.value); saveState(); compute();
    });
    card.querySelector('.amount').addEventListener('blur', e => {
      e.target.value = fmtNum(state.convertibles[i].amount, 0);
    });
    card.querySelector('.type').addEventListener('change', e => {
      state.convertibles[i].type = e.target.value; saveState(); compute();
    });
    card.querySelector('.discount').addEventListener('input', e => {
      state.convertibles[i].discountPct = parseNum(e.target.value); saveState(); compute();
    });
    card.querySelector('.discount').addEventListener('blur', e => {
      e.target.value = fmtNum(state.convertibles[i].discountPct, 0);
    });
    card.querySelector('.cap').addEventListener('input', e => {
      state.convertibles[i].cap = parseNum(e.target.value); saveState(); compute();
    });
    card.querySelector('.cap').addEventListener('blur', e => {
      e.target.value = state.convertibles[i].cap > 0 ? fmtNum(state.convertibles[i].cap, 0) : '';
    });
    card.querySelector('.note').addEventListener('input', e => {
      state.convertibles[i].note = e.target.value;
      saveState();
    });
    card.querySelector('.del').addEventListener('click', () => {
      state.convertibles.splice(i, 1);
      renderConvertibles(); saveState(); compute();
    });
    convListEl.appendChild(card);
  });
}
document.getElementById('addConv').addEventListener('click', () => {
  state.convertibles.push({
    name: t('new_conv_default'),
    type: 'bsa-air',
    amount: 250_000,
    discountPct: 20,
    cap: 0,
    note: '',
  });
  renderConvertibles(); saveState(); compute();
});

/* ─────────────── Render: investors ─────────────── */
const invListEl = document.getElementById('investorList');
function renderInvestors() {
  invListEl.innerHTML = '';
  state.investors.forEach((inv, i) => {
    const card = document.createElement('div');
    card.className = 'row-card';
    card.innerHTML = `
      <div class="row-main">
        <input type="text" class="name" placeholder="${escapeHtml(t('investor_placeholder_name'))}" value="${escapeHtml(inv.name)}">
        <input type="text" class="amount" placeholder="${escapeHtml(t('investor_placeholder_amount'))}" value="${fmtNum(inv.amount, 0)}" inputmode="decimal">
        <button class="del" aria-label="Delete" title="Delete">
          <span class="material-symbols-outlined" style="font-size:18px">close</span>
        </button>
      </div>
      <div class="row-extra row-extra-2">
        <div class="mini">
          <label>
            <span>${escapeHtml(t('investor_liqMult_label'))}</span>
            <button type="button" class="help-btn" data-tip="${escapeHtml(t('tip_investor_liqMult'))}" aria-label="?">?</button>
          </label>
          <input type="text" class="liq numeric" value="${fmtNum(inv.liqMultiple, 2)}" inputmode="decimal">
        </div>
        <div class="mini">
          <label>
            <span>${escapeHtml(t('investor_part_label'))}</span>
            <button type="button" class="help-btn" data-tip="${escapeHtml(t('tip_investor_part'))}" aria-label="?">?</button>
          </label>
          <select class="part">
            <option value="non-participating" ${inv.participation === 'non-participating' ? 'selected' : ''}>${escapeHtml(t('part_non'))}</option>
            <option value="participating"     ${inv.participation === 'participating'     ? 'selected' : ''}>${escapeHtml(t('part_participating'))}</option>
          </select>
        </div>
      </div>
      <div class="row-note">
        <label>${escapeHtml(t('note_label'))}</label>
        <textarea class="note" rows="2" placeholder="${escapeHtml(t('note_placeholder'))}">${escapeHtml(inv.note || '')}</textarea>
      </div>
    `;
    card.querySelector('.name').addEventListener('input', e => {
      state.investors[i].name = e.target.value; saveState(); compute();
    });
    card.querySelector('.amount').addEventListener('input', e => {
      state.investors[i].amount = parseNum(e.target.value); saveState(); compute();
    });
    card.querySelector('.amount').addEventListener('blur', e => {
      e.target.value = fmtNum(state.investors[i].amount, 0);
    });
    card.querySelector('.liq').addEventListener('input', e => {
      state.investors[i].liqMultiple = parseNum(e.target.value); saveState(); compute();
    });
    card.querySelector('.liq').addEventListener('blur', e => {
      e.target.value = fmtNum(state.investors[i].liqMultiple, 2);
    });
    card.querySelector('.part').addEventListener('change', e => {
      state.investors[i].participation = e.target.value; saveState(); compute();
    });
    card.querySelector('.note').addEventListener('input', e => {
      state.investors[i].note = e.target.value;
      saveState();
    });
    card.querySelector('.del').addEventListener('click', () => {
      state.investors.splice(i, 1);
      renderInvestors(); saveState(); compute();
    });
    invListEl.appendChild(card);
  });
}
document.getElementById('addInv').addEventListener('click', () => {
  state.investors.push({
    name: t('new_investor_default'),
    amount: 250_000,
    liqMultiple: 1,
    participation: 'non-participating',
    note: '',
  });
  renderInvestors(); saveState(); compute();
});

/* ─────────────── Main inputs ─────────────── */
function bindInput(id, getter, setter, decimals = 0) {
  const el = document.getElementById(id);
  el.value = fmtNum(getter(), decimals);
  el.addEventListener('input', () => {
    setter(parseNum(el.value));
    saveState(); compute();
  });
  el.addEventListener('blur', () => {
    el.value = fmtNum(getter(), decimals);
  });
}
/* ─── Dossier inputs ──────────────── */
function bindDossierText(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = state.dossier[key] || '';
  el.addEventListener('input', () => {
    state.dossier[key] = el.value;
    saveState();
  });
}
bindDossierText('dossierCompany',   'company');
bindDossierText('dossierReference', 'reference');
bindDossierText('dossierOperator',  'operator');
{
  const dateEl = document.getElementById('dossierDate');
  if (dateEl) {
    dateEl.value = state.dossier.date || '';
    dateEl.addEventListener('input', () => {
      state.dossier.date = dateEl.value;
      saveState();
    });
  }
}

function syncDossierUI() {
  const fields = { dossierCompany: 'company', dossierDate: 'date',
                   dossierReference: 'reference', dossierOperator: 'operator' };
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.value = state.dossier[key] || '';
  });
}

/* ─── Scenario picker ─────────────── */
document.getElementById('scenarioPick').addEventListener('click', e => {
  const btn = e.target.closest('button[data-sc]');
  if (!btn) return;
  switchScenario(btn.dataset.sc);
});

function syncScenarioUI() {
  document.querySelectorAll('#scenarioPick button').forEach(b =>
    b.classList.toggle('on', b.dataset.sc === state.currentScenario));
}

bindInput('preMoney',       () => state.preMoney,       v => state.preMoney = v, 0);
bindInput('existingShares', () => state.existingShares, v => state.existingShares = v, 0);
bindInput('nominalValue',   () => state.nominalValue,   v => state.nominalValue = v, 2);
bindInput('poolTargetPct',  () => state.pool.targetPct, v => state.pool.targetPct = v, 1);
bindInput('exitValue',      () => state.exit.value,     v => state.exit.value = v, 0);

/* ─────────────── Pool toggles ─────────────── */
const poolEnabledEl = document.getElementById('poolEnabled');
const poolBodyEl = document.getElementById('poolBody');
poolEnabledEl.addEventListener('change', () => {
  state.pool.enabled = poolEnabledEl.checked;
  poolBodyEl.classList.toggle('disabled', !state.pool.enabled);
  saveState(); compute();
});

document.getElementById('poolTiming').addEventListener('click', e => {
  const btn = e.target.closest('button[data-val]');
  if (!btn) return;
  state.pool.timing = btn.dataset.val;
  document.querySelectorAll('#poolTiming button').forEach(b =>
    b.classList.toggle('on', b === btn));
  saveState(); compute();
});

/* ─────────────── Exit toggle / slider ─────────────── */
const exitEnabledEl = document.getElementById('exitEnabled');
const exitBodyEl = document.getElementById('exitBody');
exitEnabledEl.addEventListener('change', () => {
  state.exit.enabled = exitEnabledEl.checked;
  exitBodyEl.classList.toggle('disabled', !state.exit.enabled);
  saveState(); compute();
});

const exitSliderEl = document.getElementById('exitSlider');
function syncExitSlider(c) {
  const baseTotalInvest = (c && c.totalInvestment) || 0;
  // Stable scale based on total investment (≈25× return ceiling) so dragging doesn't drift.
  const maxExit = Math.max(baseTotalInvest * 25, 10_000_000);
  exitSliderEl.max = 100;
  const pct = Math.min(100, Math.max(0, (state.exit.value / maxExit) * 100));
  exitSliderEl.value = pct;
  exitSliderEl.style.setProperty('--val', pct + '%');
  exitSliderEl.dataset.max = String(maxExit);
}
exitSliderEl.addEventListener('input', () => {
  const maxExit = Number(exitSliderEl.dataset.max) || 100_000_000;
  const pct = Number(exitSliderEl.value) / 100;
  state.exit.value = Math.round(pct * maxExit);
  document.getElementById('exitValue').value = fmtNum(state.exit.value, 0);
  exitSliderEl.style.setProperty('--val', (pct * 100) + '%');
  saveState(); compute();
});

/* ─────────────── Currency / Language ─────────────── */
function applyCurrencyUI() {
  document.querySelectorAll('#currencyPick button').forEach(b =>
    b.classList.toggle('on', b.dataset.cur === state.currency)
  );
  document.querySelectorAll('.cur-symbol').forEach(el => el.textContent = SYMBOLS[state.currency]);
  document.getElementById('preMoney').value       = fmtNum(state.preMoney, 0);
  document.getElementById('existingShares').value = fmtNum(state.existingShares, 0);
  document.getElementById('nominalValue').value   = fmtNum(state.nominalValue, 2);
  document.getElementById('poolTargetPct').value  = fmtNum(state.pool.targetPct, 1);
  document.getElementById('exitValue').value      = fmtNum(state.exit.value, 0);
}
document.getElementById('currencyPick').addEventListener('click', e => {
  const btn = e.target.closest('button[data-cur]');
  if (!btn) return;
  state.currency = btn.dataset.cur;
  saveState(); applyCurrencyUI();
  renderHolders(); renderConvertibles(); renderInvestors();
  compute();
});
document.getElementById('langPick').addEventListener('click', e => {
  const btn = e.target.closest('button[data-lang]');
  if (!btn) return;
  state.lang = btn.dataset.lang;
  saveState();
  applyI18n();
  syncPoolTimingUI();
  renderHolders(); renderConvertibles(); renderInvestors();
  compute();
});

function syncPoolTimingUI() {
  document.querySelectorAll('#poolTiming button').forEach(b =>
    b.classList.toggle('on', b.dataset.val === state.pool.timing));
  poolEnabledEl.checked = state.pool.enabled;
  poolBodyEl.classList.toggle('disabled', !state.pool.enabled);
  exitEnabledEl.checked = state.exit.enabled;
  exitBodyEl.classList.toggle('disabled', !state.exit.enabled);
}

/* ─────────────── Reset / Print / Export ─────────────── */
document.getElementById('printBtn').addEventListener('click', () => {
  updatePrintHeader();
  window.print();
});

/* ─── Copy-to-clipboard for tables (TSV → Excel paste) ─── */
function tableToTSV(tableEl) {
  if (!tableEl) return '';
  const rows = Array.from(tableEl.querySelectorAll('tr'));
  return rows.map(row =>
    Array.from(row.querySelectorAll('th, td'))
      .map(cell => {
        const txt = cell.textContent.replace(/\s+/g, ' ').trim();
        return txt === '' || txt === '—' ? txt : txt;
      })
      .join('\t')
  ).join('\n');
}

document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.dataset.copy;
    const table = document.getElementById(targetId);
    if (!table) return;
    const tsv = tableToTSV(table);
    try {
      await navigator.clipboard.writeText(tsv);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = tsv;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    btn.classList.add('done');
    const label = btn.querySelector('span:last-child');
    const originalText = label ? label.textContent : '';
    if (label) label.textContent = t('button_copied');
    setTimeout(() => {
      btn.classList.remove('done');
      if (label) label.textContent = originalText;
    }, 1400);
  });
});

/* ─── Print-only letterhead ─── */
function updatePrintHeader() {
  const $ = id => document.getElementById(id);
  const d = state.dossier || {};
  $('ph_company').textContent   = d.company   || '—';
  $('ph_reference').textContent = d.reference || '—';
  $('ph_operator').textContent  = d.operator  || '—';
  $('ph_scenario').textContent  = t('sc_' + state.currentScenario);
  $('ph_date').textContent      = formatDateFR(d.date);
  $('ph_printedAt').textContent = formatDateFR(new Date().toISOString().slice(0, 10))
    + ' ' + new Date().toLocaleTimeString(LOCALES_BY_LANG[state.lang] || 'fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateFR(isoDate) {
  if (!isoDate) return '—';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString(LOCALES_BY_LANG[state.lang] || 'fr-FR',
      { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return isoDate; }
}
window.addEventListener('beforeprint', updatePrintHeader);
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm(t('reset_confirm'))) return;
  const lang = state.lang, currency = state.currency;
  const currentScenario = state.currentScenario;
  // Reset only the active scenario; preserve other scenarios
  const preservedScenarios = state.scenarios;
  preservedScenarios[currentScenario] = structuredClone(BASE_SCENARIO);
  Object.assign(state, structuredClone(DEFAULTS), {
    lang, currency, currentScenario,
    scenarios: preservedScenarios,
  });
  applyScenarioFields(preservedScenarios[currentScenario]);
  saveState();
  applyCurrencyUI(); syncPoolTimingUI(); syncDossierUI(); syncScenarioUI();
  renderHolders(); renderConvertibles(); renderInvestors();
  compute();
});

document.getElementById('exportBtn').addEventListener('click', exportCSV);
document.getElementById('exportJsonBtn').addEventListener('click', exportJSON);

function exportJSON() {
  const c = currentComputation();
  const payload = {
    timestamp: new Date().toISOString(),
    currency: state.currency,
    inputs: structuredClone(state),
    outputs: {
      preMoney: c.V,
      postMoneyHeadline: c.postMoney,
      postMoneyImplied: c.postImplied,
      pricePerShare: c.P_round,
      fdPreMoneyShares: c.FD_pre,
      totalSharesAfter: c.totalSharesAfter,
      newSharesIssued: c.totalConvShares + c.totalNewShares,
      poolShares: c.totalPoolPost,
      capitalIncreaseNominal: (c.totalConvShares + c.totalNewShares) * c.nom,
      premiumTotal: c.premiumTotal,
      premiumPerShare: c.premiumPerShare,
      founderDilution: c.dilution,
      existingHolderPctAfter: c.existingNewPct,
      capTable: c.capRows.map(r => ({
        name: r.name,
        class: r.classKey,
        classLabel: r.classLabel,
        beforeShares: r.beforeShares,
        beforePct: r.beforePct,
        afterShares: r.afterShares,
        afterPct: r.afterPct,
        liqPref: r.liqPref,
        participation: r.participation,
      })),
      convertibles: state.convertibles.map((cv, i) => ({
        name: cv.name,
        type: cv.type,
        amount: cv.amount,
        discountPct: cv.discountPct,
        cap: cv.cap || null,
        effectivePrice: c.FD_pre > 0 && c.convRates[i] && isFinite(c.convRates[i].effDenom)
          ? c.convRates[i].effDenom / c.FD_pre : null,
        binding: c.convRates[i] && c.convRates[i].usingCap && cv.cap > 0
          ? 'cap' : (cv.discountPct > 0 ? 'discount' : 'none'),
        sharesIssued: c.convShares[i],
      })),
      waterfall: c.waterfall.map(w => ({
        name: w.name,
        shares: w.shares,
        liqPref: w.liqPref,
        payout: w.payout,
        payoutPct: w.payoutPct,
        treatment: w.treatmentLabel,
      })),
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cap-table-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const c = currentComputation();
  const rows = [[
    t('captable_holder'), 'Type',
    t('captable_before_shares'), '%',
    t('captable_after_shares'), '%',
    t('captable_liqPref'),
  ]];

  c.capRows.forEach(r => {
    rows.push([
      r.name, r.classLabel,
      r.beforeShares.toFixed(0),
      (r.beforePct * 100).toFixed(4) + '%',
      r.afterShares.toFixed(0),
      (r.afterPct * 100).toFixed(4) + '%',
      r.liqPref ? r.liqPref.toFixed(0) : '0',
    ]);
  });

  if (state.exit.enabled) {
    rows.push([]);
    rows.push([t('section_exit'), t('label_exitValue'), state.exit.value.toFixed(0)]);
    rows.push([
      t('waterfall_holder'),
      t('waterfall_shares'),
      t('waterfall_liqPref'),
      t('waterfall_payout'),
      t('waterfall_payoutPct'),
      t('waterfall_treatment'),
    ]);
    c.waterfall.forEach(w => {
      rows.push([
        w.name,
        w.shares.toFixed(0),
        w.liqPref.toFixed(0),
        w.payout.toFixed(0),
        (w.payoutPct * 100).toFixed(4) + '%',
        w.treatmentLabel,
      ]);
    });
  }

  const csv = rows
    .map(r => r.map(cell => {
      const s = String(cell ?? '');
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(';'))
    .join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cap-table-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─────────────── Math: round computation ─────────────── */
function currentComputation() {
  const E   = Math.max(0, state.existingShares);
  const V   = Math.max(0, state.preMoney);
  const nom = Math.max(0, state.nominalValue);
  const pRaw = state.pool.enabled ? state.pool.targetPct / 100 : 0;
  const p   = Math.max(0, Math.min(0.95, pRaw));
  const timing = state.pool.timing;

  // Effective per-dollar conversion denom for each convertible
  // shares_i = amount_i * basis_shares / effDenom_i
  // where effDenom_i = min(V*(1-d_i), cap_i || Infinity)
  const convRates = state.convertibles.map(c => {
    const discountFactor = 1 - Math.min(0.99, Math.max(0, (c.discountPct || 0) / 100));
    const capDenom = (c.cap && c.cap > 0) ? c.cap : Infinity;
    const discountDenom = V > 0 ? V * discountFactor : Infinity;
    const effDenom = Math.min(discountDenom, capDenom);
    return {
      effDenom,
      usingCap: capDenom < discountDenom,
      discountDenom, capDenom,
    };
  });

  // Y = sum(C_i / effDenom_i) + sum(I_j) / V
  // shares-per-basis-share unit (basis = FD_pre for pre-timing, E for post-timing)
  const convFactorSum = state.convertibles.reduce((s, c, i) => {
    if (!isFinite(convRates[i].effDenom)) return s;
    return s + (c.amount / convRates[i].effDenom);
  }, 0);
  const newSum = V > 0
    ? state.investors.reduce((s, i) => s + (i.amount || 0), 0) / V
    : 0;
  const Y = convFactorSum + newSum;

  let pool, FD_pre, P_round, poolPostRound, poolFeasible = true;

  if (timing === 'pre') {
    const denom = 1 - p * (1 + Y);
    if (p > 0 && denom > 0) {
      pool = E * p * (1 + Y) / denom;
    } else if (p === 0) {
      pool = 0;
    } else {
      pool = 0; poolFeasible = false;
    }
    FD_pre = E + pool;
    P_round = FD_pre > 0 ? V / FD_pre : 0;
    poolPostRound = pool;
  } else {
    FD_pre = E;
    P_round = FD_pre > 0 ? V / FD_pre : 0;
    pool = 0;
    poolPostRound = 0; // computed below
  }

  // Compute conv and new shares
  const convShares = state.convertibles.map((c, i) => {
    const eff = convRates[i].effDenom;
    if (!isFinite(eff) || eff <= 0) return 0;
    return c.amount * FD_pre / eff;
  });
  const totalConvShares = convShares.reduce((s, x) => s + x, 0);

  const newShares = state.investors.map(inv =>
    P_round > 0 ? (inv.amount || 0) / P_round : 0);
  const totalNewShares = newShares.reduce((s, x) => s + x, 0);

  let totalSharesAfter, totalPoolPost;
  if (timing === 'pre') {
    totalPoolPost = pool;
    totalSharesAfter = E + pool + totalConvShares + totalNewShares;
  } else {
    const subTotal = E + totalConvShares + totalNewShares;
    poolPostRound = p > 0 && p < 1 ? subTotal * p / (1 - p) : 0;
    totalPoolPost = poolPostRound;
    totalSharesAfter = subTotal + poolPostRound;
  }

  const newInvestment = state.investors.reduce((s, i) => s + (i.amount || 0), 0);
  const convInvestment = state.convertibles.reduce((s, c) => s + (c.amount || 0), 0);
  const totalInvestment = newInvestment + convInvestment;
  const postMoney = V + totalInvestment;
  const postImplied = P_round * totalSharesAfter;

  const totalIssuedShares = totalPoolPost + totalConvShares + totalNewShares;
  const issuedSharesSold = totalConvShares + totalNewShares;
  const nominalIncrease = totalIssuedShares * nom;
  const premiumTotal = totalInvestment - issuedSharesSold * nom;
  const premiumPerShare = P_round - nom;

  const existingNewPct = totalSharesAfter > 0 ? E / totalSharesAfter : 1;
  const dilution = 1 - existingNewPct;

  // ── Build cap rows ────────────────────────────────────
  const capRows = [];
  const existingTotal = state.existingHolders.reduce((s, h) => s + h.shares, 0) || E;

  state.existingHolders.forEach(h => {
    const beforeShares = existingTotal > 0 ? (h.shares / existingTotal) * E : 0;
    const beforePct = E > 0 ? beforeShares / E : 0;
    const afterPct = totalSharesAfter > 0 ? beforeShares / totalSharesAfter : 0;
    capRows.push({
      name: h.name,
      classKey: 'common', classLabel: 'AO',
      beforeShares, beforePct,
      afterShares: beforeShares, afterPct,
      liqPref: 0,
      participation: 'common',
      barClass: 'b-blue',
    });
  });

  if (totalPoolPost > 0) {
    capRows.push({
      name: 'Pool ESOP / BSPCE',
      classKey: 'pool', classLabel: 'ESOP',
      beforeShares: 0, beforePct: 0,
      afterShares: totalPoolPost,
      afterPct: totalSharesAfter > 0 ? totalPoolPost / totalSharesAfter : 0,
      liqPref: 0,
      participation: 'common',
      barClass: 'b-yellow',
    });
  }

  state.convertibles.forEach((cv, i) => {
    const sh = convShares[i];
    capRows.push({
      name: cv.name,
      classKey: 'conv', classLabel: convTypeLabel(cv.type),
      beforeShares: 0, beforePct: 0,
      afterShares: sh,
      afterPct: totalSharesAfter > 0 ? sh / totalSharesAfter : 0,
      liqPref: cv.amount || 0,             // BSA AIR / SAFE: assume 1× non-cumulative converted to preferred
      participation: 'non-participating',
      multiple: 1,
      barClass: 'b-purple',
    });
  });

  state.investors.forEach((inv, i) => {
    const sh = newShares[i];
    capRows.push({
      name: inv.name,
      classKey: 'pref', classLabel: 'AP',
      beforeShares: 0, beforePct: 0,
      afterShares: sh,
      afterPct: totalSharesAfter > 0 ? sh / totalSharesAfter : 0,
      liqPref: (inv.amount || 0) * (inv.liqMultiple || 1),
      participation: inv.participation,
      multiple: inv.liqMultiple || 1,
      barClass: 'b-green',
    });
  });

  // ── Waterfall ─────────────────────────────────────────
  const exitValue = Math.max(0, state.exit.value);
  const waterfall = computeWaterfall(capRows, exitValue, state.exit.enabled);

  return {
    E, V, nom, p, timing,
    pool, FD_pre, P_round, poolPostRound, totalPoolPost,
    convShares, convRates, totalConvShares,
    newShares, totalNewShares,
    totalSharesAfter,
    newInvestment, convInvestment, totalInvestment,
    postMoney, postImplied,
    totalIssuedShares,
    nominalIncrease, premiumTotal, premiumPerShare,
    existingNewPct, dilution,
    poolFeasible,
    capRows, waterfall, exitValue,
  };
}

function convTypeLabel(type) {
  if (type === 'safe') return 'SAFE';
  if (type === 'note') return 'OC';
  return 'BSA AIR';
}

/* ─────────────── Waterfall ─────────────── */
function computeWaterfall(capRows, exitValue, enabled) {
  const holders = capRows.map(r => ({
    name: r.name,
    classKey: r.classKey,
    classLabel: r.classLabel,
    shares: r.afterShares,
    afterPct: r.afterPct,
    liqPref: r.liqPref || 0,
    participation: r.participation,
    multiple: r.multiple || 0,
    payout: 0,
    payoutPct: 0,
    takingPref: false,
    converted: false,
    treatmentLabel: '',
  }));

  if (!enabled || exitValue <= 0) return holders;

  const totalShares = holders.reduce((s, h) => s + h.shares, 0);
  if (totalShares <= 0) return holders;

  // Initial conversion decisions (per-investor independent heuristic)
  holders.forEach(h => {
    if (h.participation === 'participating') {
      h._takeLPref = h.liqPref > 0;
    } else if (h.participation === 'non-participating') {
      const proRataFull = (h.shares / totalShares) * exitValue;
      h._takeLPref = h.liqPref > proRataFull;
    } else {
      h._takeLPref = false;
    }
  });

  // One safety re-check pass (per math sanity check): if a non-participating
  // investor converts, other non-participants' pro-rata might shift slightly,
  // so re-evaluate once.
  for (let pass = 0; pass < 2; pass++) {
    const convertedShares = holders.reduce((s, h) =>
      s + ((!h._takeLPref || h.participation === 'participating') ? h.shares : 0), 0);

    let stable = true;
    holders.forEach(h => {
      if (h.participation !== 'non-participating') return;
      // If they convert: would join common pool (only converters share remainder)
      const lprefTaken = holders.reduce((s, x) =>
        s + (x !== h && x._takeLPref ? x.liqPref : 0), 0);
      const remainderIfConvert = Math.max(0, exitValue - lprefTaken);
      const converterShares = convertedShares + (h._takeLPref ? h.shares : 0);
      const proRataIfConvert = converterShares > 0
        ? (h.shares / converterShares) * remainderIfConvert : 0;
      const newDecision = h.liqPref > proRataIfConvert;
      if (newDecision !== h._takeLPref) { h._takeLPref = newDecision; stable = false; }
    });
    if (stable) break;
  }

  const totalLPrefTaken = holders.reduce((s, h) => s + (h._takeLPref ? h.liqPref : 0), 0);

  if (totalLPrefTaken >= exitValue) {
    // Scale liq prefs pro-rata; common gets nothing
    holders.forEach(h => {
      h.payout = h._takeLPref && totalLPrefTaken > 0
        ? (h.liqPref / totalLPrefTaken) * exitValue : 0;
      h.payoutPct = exitValue > 0 ? h.payout / exitValue : 0;
      h.takingPref = h._takeLPref;
      h.converted = h.participation === 'non-participating' && !h._takeLPref;
      h.treatmentLabel = h.takingPref ? labelPref() : labelCommon();
    });
    return holders;
  }

  // Pay liq prefs and split remainder
  const remainder = Math.max(0, exitValue - totalLPrefTaken);
  const proRataParticipants = holders.filter(h =>
    !h._takeLPref || h.participation === 'participating');
  const proRataShares = proRataParticipants.reduce((s, h) => s + h.shares, 0);

  holders.forEach(h => {
    let payout = h._takeLPref ? h.liqPref : 0;
    if ((!h._takeLPref || h.participation === 'participating') && proRataShares > 0) {
      payout += (h.shares / proRataShares) * remainder;
    }
    h.payout = payout;
    h.payoutPct = exitValue > 0 ? payout / exitValue : 0;
    h.takingPref = h._takeLPref;
    h.converted = h.participation === 'non-participating' && !h._takeLPref;
    if (h.participation === 'participating' && h._takeLPref) {
      h.treatmentLabel = labelParticipating();
    } else if (h.takingPref) {
      h.treatmentLabel = labelPref();
    } else if (h.converted) {
      h.treatmentLabel = labelConverted();
    } else {
      h.treatmentLabel = labelCommon();
    }
  });

  return holders;
}

function labelPref()         { return t('treat_pref'); }
function labelConverted()    { return t('treat_convert'); }
function labelCommon()       { return t('treat_common'); }
function labelParticipating(){ return t('treat_pref') + ' + ' + t('treat_common'); }

/* ─────────────── Render results ─────────────── */
function compute() {
  const c = currentComputation();
  const $ = id => document.getElementById(id);

  // Hero
  $('r_postMoney').textContent   = fmtMoney(c.postMoney, 0);
  $('r_totalInvest').textContent = fmtMoney(c.totalInvestment, 0);
  $('r_postImplied').textContent = fmtMoney(c.postImplied, 0);
  $('r_heroDilution').textContent = fmtPct(c.dilution, 2);

  // Sticky summary bar
  $('ss_postMoney').textContent = fmtMoney(c.postMoney, 0);
  $('ss_price').textContent     = fmtMoneyCompact(c.P_round);
  const pctNewForSticky = c.totalSharesAfter > 0 ? c.totalNewShares / c.totalSharesAfter : 0;
  $('ss_dilNew').textContent    = fmtPct(pctNewForSticky, 2);

  // Stats
  $('r_pricePerShare').textContent   = fmtMoneyCompact(c.P_round);
  $('r_newShares').textContent       = fmtNum(c.totalIssuedShares, 0);
  $('r_nominalIncrease').textContent = fmtMoney(c.nominalIncrease, 0);
  $('r_premiumTotal').textContent    = fmtMoney(c.premiumTotal, 0);

  // Dilution bar
  const pctExisting = c.totalSharesAfter > 0 ? c.E / c.totalSharesAfter : 1;
  const pctPool = c.totalSharesAfter > 0 ? c.totalPoolPost / c.totalSharesAfter : 0;
  const pctConv = c.totalSharesAfter > 0 ? c.totalConvShares / c.totalSharesAfter : 0;
  const pctNew  = c.totalSharesAfter > 0 ? c.totalNewShares / c.totalSharesAfter : 0;
  $('dilExisting').style.width = (pctExisting * 100).toFixed(2) + '%';
  $('dilPool').style.width     = (pctPool     * 100).toFixed(2) + '%';
  $('dilConv').style.width     = (pctConv     * 100).toFixed(2) + '%';
  $('dilNew').style.width      = (pctNew      * 100).toFixed(2) + '%';
  $('legExistingPct').textContent = fmtPct(pctExisting, 2);
  $('legPoolPct').textContent     = fmtPct(pctPool, 2);
  $('legConvPct').textContent     = fmtPct(pctConv, 2);
  $('legNewPct').textContent      = fmtPct(pctNew, 2);

  $('r_dilutionSub').textContent = t('result_dilution_template', {
    existingPct: fmtPct(c.existingNewPct, 2),
    premiumPerShare: fmtMoneyCompact(c.premiumPerShare),
    dilution: fmtPct(c.dilution, 2),
  });

  // Alerts
  $('warn').hidden = !(c.nom > c.P_round && c.P_round > 0);
  const holdersSum = state.existingHolders.reduce((s, h) => s + h.shares, 0);
  const mismatch = c.E > 0 && holdersSum > 0 && Math.abs(holdersSum - c.E) / c.E > 0.0001;
  $('warnHolders').hidden = !mismatch;
  $('warnPool').hidden = c.poolFeasible;

  // Cap table
  renderCapTable(c);

  // Waterfall
  renderWaterfall(c);
  syncExitSlider(c);

  // Back-office views
  renderAccounting(c);
  renderBilan(c);
  renderConvDetails(c);
  renderReconciliation(c);
}

function renderAccounting(c) {
  const body = document.getElementById('accountingBody');
  if (!body) return;
  body.innerHTML = '';

  const issued = c.totalConvShares + c.totalNewShares;
  const newCash = c.newInvestment;       // priced round only — actual cash on the closing date
  const convDebouclage = c.convInvestment; // BSA AIR / SAFE liability cleared to equity, not new cash
  const totalDebit = newCash + convDebouclage;
  const capIncrease = issued * c.nom;
  const premium = totalDebit - capIncrease;

  if (totalDebit === 0 && issued === 0) {
    body.insertAdjacentHTML('beforeend', `
      <tr><td colspan="4" class="label-col" style="text-align:center; color:var(--on-surface-3)">—</td></tr>
    `);
  } else {
    const debitRows = [];
    if (newCash > 0) {
      debitRows.push(`
        <tr>
          <td>512</td>
          <td class="label-col">${escapeHtml(t('acc_512'))}</td>
          <td>${fmtMoney(newCash, 0)}</td>
          <td>—</td>
        </tr>
      `);
    }
    if (convDebouclage > 0) {
      debitRows.push(`
        <tr>
          <td>1675</td>
          <td class="label-col">${escapeHtml(t('acc_1675'))}</td>
          <td>${fmtMoney(convDebouclage, 0)}</td>
          <td>—</td>
        </tr>
      `);
    }
    body.insertAdjacentHTML('beforeend', `
      ${debitRows.join('')}
      <tr class="credit">
        <td>101</td>
        <td class="label-col">${escapeHtml(t('acc_101'))}</td>
        <td>—</td>
        <td>${fmtMoney(capIncrease, 0)}</td>
      </tr>
      <tr class="credit">
        <td>1041</td>
        <td class="label-col">${escapeHtml(t('acc_1041'))}</td>
        <td>—</td>
        <td>${fmtMoney(premium, 0)}</td>
      </tr>
      <tr class="subtotal">
        <td colspan="2">${escapeHtml(t('acc_total'))}</td>
        <td>${fmtMoney(totalDebit, 0)}</td>
        <td>${fmtMoney(capIncrease + premium, 0)}</td>
      </tr>
    `);
  }

  const notes = [];
  if (c.totalPoolPost > 0) {
    notes.push(t('acc_note_pool', { count: fmtNum(c.totalPoolPost, 0) }));
  }
  if (convDebouclage > 0) {
    notes.push(t('acc_note_conv'));
  }
  document.getElementById('accountingNote').textContent = notes.join(' · ');
}

function renderBilan(c) {
  const body = document.getElementById('bilanBody');
  if (!body) return;
  body.innerHTML = '';

  const issued = c.totalConvShares + c.totalNewShares;
  const capBefore = c.E * c.nom;
  const capDelta  = issued * c.nom;
  const capAfter  = capBefore + capDelta;

  body.insertAdjacentHTML('beforeend', `
    <tr class="bilan-delta">
      <td class="label-col">${escapeHtml(t('bilan_capital'))}</td>
      <td>${fmtMoney(capBefore, 0)}</td>
      <td>${fmtMoney(capDelta, 0)}</td>
      <td>${fmtMoney(capAfter, 0)}</td>
    </tr>
    <tr class="bilan-delta">
      <td class="label-col">${escapeHtml(t('bilan_prime'))}</td>
      <td>—</td>
      <td>${fmtMoney(c.premiumTotal, 0)}</td>
      <td>—</td>
    </tr>
    <tr>
      <td class="label-col">${escapeHtml(t('bilan_shares'))}</td>
      <td>${fmtNum(c.E, 0)}</td>
      <td>${fmtNum(issued, 0)}</td>
      <td>${fmtNum(c.E + issued, 0)}</td>
    </tr>
    <tr>
      <td class="label-col">${escapeHtml(t('bilan_pool'))}</td>
      <td>—</td>
      <td>${fmtNum(c.totalPoolPost, 0)}</td>
      <td>${fmtNum(c.totalPoolPost, 0)}</td>
    </tr>
  `);
}

function renderConvDetails(c) {
  state.convertibles.forEach((cv, i) => {
    const card = convListEl.children[i];
    if (!card) return;
    const detail = card.querySelector('[data-conv-detail]');
    if (!detail) return;

    const rate = c.convRates[i];
    const shares = c.convShares[i];
    if (!rate || !isFinite(rate.effDenom) || c.FD_pre <= 0) {
      detail.innerHTML = '';
      return;
    }

    const effPrice = rate.effDenom / c.FD_pre;
    const hasCap = cv.cap && cv.cap > 0;
    const hasDisc = (cv.discountPct || 0) > 0;
    let pillLabel, pillClass;
    if (hasCap && rate.usingCap) {
      pillLabel = t('conv_binding_cap'); pillClass = 'pill-cap';
    } else if (hasDisc) {
      pillLabel = t('conv_binding_discount'); pillClass = 'pill-disc';
    } else {
      pillLabel = t('conv_binding_none'); pillClass = 'pill-none';
    }

    detail.innerHTML = `
      <span class="pill ${pillClass}">${escapeHtml(pillLabel)}</span>
      <span>${escapeHtml(t('conv_eff_price'))}: <b>${escapeHtml(fmtMoneyCompact(effPrice))}</b></span>
      <span>·</span>
      <span>${escapeHtml(t('conv_eff_shares'))}: <b>${escapeHtml(fmtNum(shares, 0))}</b></span>
    `;
  });
}

function renderReconciliation(c) {
  const el = document.getElementById('reconList');
  if (!el) return;
  el.innerHTML = '';

  const checks = [];

  const sumAfterPct = c.capRows.reduce((s, r) => s + (r.afterPct || 0), 0);
  checks.push({
    title: t('recon_sum_after'),
    detail: fmtPct(sumAfterPct, 4),
    status: Math.abs(sumAfterPct - 1) < 0.0001 ? 'ok' : 'error',
  });

  const holdersSum = state.existingHolders.reduce((s, h) => s + h.shares, 0);
  let holdersStatus = 'ok';
  let holdersDetail = `${fmtNum(holdersSum, 0)} = ${fmtNum(c.E, 0)}`;
  if (c.E > 0 && holdersSum > 0) {
    const delta = holdersSum - c.E;
    if (Math.abs(delta) / c.E > 0.0001) {
      holdersStatus = 'warn';
      holdersDetail = `${fmtNum(holdersSum, 0)} ≠ ${fmtNum(c.E, 0)} (Δ ${fmtNum(delta, 0)})`;
    }
  }
  checks.push({ title: t('recon_holders'), detail: holdersDetail, status: holdersStatus });

  const implied = c.P_round * c.totalSharesAfter;
  checks.push({
    title: t('recon_price_check'),
    detail: `${fmtMoneyCompact(c.P_round)} × ${fmtNum(c.totalSharesAfter, 0)} = ${fmtMoney(implied, 0)}`,
    status: 'ok',
  });

  let nomStatus = 'ok';
  let nomDetail = `${fmtMoneyCompact(c.nom)} ≤ ${fmtMoneyCompact(c.P_round)}`;
  if (c.nom > c.P_round && c.P_round > 0) {
    nomStatus = 'error';
    nomDetail = `${fmtMoneyCompact(c.nom)} > ${fmtMoneyCompact(c.P_round)}`;
  }
  checks.push({ title: t('recon_nominal'), detail: nomDetail, status: nomStatus });

  checks.push({
    title: t('recon_premium'),
    detail: fmtMoney(c.premiumTotal, 0),
    status: c.premiumTotal >= 0 ? 'ok' : 'error',
  });

  if (state.pool.enabled) {
    checks.push({
      title: t('recon_pool'),
      detail: c.poolFeasible ? t('recon_pool_ok') : t('recon_pool_warn'),
      status: c.poolFeasible ? 'ok' : 'error',
    });
  }

  const issuedSold = c.totalConvShares + c.totalNewShares;
  const lhs = issuedSold * c.nom + c.premiumTotal;
  const rhs = c.totalInvestment;
  const balDelta = Math.abs(lhs - rhs);
  checks.push({
    title: t('recon_balance'),
    detail: `${fmtMoney(lhs, 0)} = ${fmtMoney(rhs, 0)}`,
    status: balDelta < 1 ? 'ok' : 'warn',
  });

  checks.forEach(chk => {
    const icon = chk.status === 'ok' ? 'check_circle' : chk.status === 'warn' ? 'warning' : 'cancel';
    const li = document.createElement('li');
    li.className = `recon-item ${chk.status}`;
    li.innerHTML = `
      <span class="material-symbols-outlined recon-icon">${icon}</span>
      <div class="recon-text">
        <span class="recon-title">${escapeHtml(chk.title)}</span>
        <span class="recon-detail">${escapeHtml(chk.detail)}</span>
      </div>
    `;
    el.appendChild(li);
  });
}

function renderCapTable(c) {
  const body = document.getElementById('capBody');
  body.innerHTML = '';
  c.capRows.forEach(r => {
    const tagClass =
      r.classKey === 'common' ? 'tag-common' :
      r.classKey === 'pool'   ? 'tag-pool'   :
      r.classKey === 'conv'   ? 'tag-conv'   :
      r.classKey === 'pref'   ? 'tag-pref'   : 'tag-common';
    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${escapeHtml(r.name)} <span class="tag ${tagClass}">${escapeHtml(r.classLabel)}</span></td>
        <td>${r.beforeShares > 0 ? fmtNum(r.beforeShares, 0) : '—'}</td>
        <td>${r.beforeShares > 0 ? fmtPct(r.beforePct, 2) : '—'}</td>
        <td>${fmtNum(r.afterShares, 0)}</td>
        <td>${fmtPct(r.afterPct, 2)}</td>
        <td>${r.liqPref > 0 ? fmtMoney(r.liqPref, 0) : '—'}</td>
        <td class="bar-cell"><div class="bar ${r.barClass}"><span style="width:${(r.afterPct * 100).toFixed(2)}%"></span></div></td>
      </tr>
    `);
  });
  body.insertAdjacentHTML('beforeend', `
    <tr class="total">
      <td>${escapeHtml(t('captable_total'))}</td>
      <td>${fmtNum(c.E, 0)}</td>
      <td>${fmtPct(1, 2)}</td>
      <td>${fmtNum(c.totalSharesAfter, 0)}</td>
      <td>${fmtPct(1, 2)}</td>
      <td>—</td>
      <td></td>
    </tr>
  `);
}

function renderWaterfall(c) {
  const body = document.getElementById('waterfallBody');
  const sumEl = document.getElementById('waterfallSummary');
  body.innerHTML = '';
  sumEl.innerHTML = '';

  if (!state.exit.enabled) return;

  let prefPaid = 0, commonDist = 0;
  c.waterfall.forEach(w => {
    if (w.takingPref) prefPaid += Math.min(w.payout, w.liqPref);
    const fromCommon = w.payout - Math.min(w.payout, w.takingPref ? w.liqPref : 0);
    commonDist += Math.max(0, fromCommon);

    const trClass =
      w.participation === 'participating' && w.takingPref ? 'treat-pref' :
      w.takingPref                                        ? 'treat-pref' :
      w.converted                                          ? 'treat-convert' : 'treat-common';
    body.insertAdjacentHTML('beforeend', `
      <tr class="${trClass}">
        <td>${escapeHtml(w.name)} <span class="tag tag-${w.classKey === 'common' ? 'common' : w.classKey === 'pool' ? 'pool' : w.classKey === 'conv' ? 'conv' : 'pref'}">${escapeHtml(w.classLabel)}</span></td>
        <td>${fmtNum(w.shares, 0)}</td>
        <td>${fmtPct(w.afterPct, 2)}</td>
        <td>${w.liqPref > 0 ? fmtMoney(w.liqPref, 0) : '—'}</td>
        <td>${fmtMoney(w.payout, 0)}</td>
        <td>${fmtPct(w.payoutPct, 2)}</td>
        <td>${escapeHtml(w.treatmentLabel)}</td>
      </tr>
    `);
  });

  sumEl.innerHTML = `
    <div class="wf-stat">
      <span class="k">${escapeHtml(t('wf_summary_exit'))}</span>
      <span class="v">${fmtMoney(state.exit.value, 0)}</span>
    </div>
    <div class="wf-stat">
      <span class="k">${escapeHtml(t('wf_summary_pref'))}</span>
      <span class="v">${fmtMoney(prefPaid, 0)}</span>
    </div>
    <div class="wf-stat">
      <span class="k">${escapeHtml(t('wf_summary_common'))}</span>
      <span class="v">${fmtMoney(commonDist, 0)}</span>
    </div>
  `;
}

/* ─────────────── Sticky summary on scroll ─────────────── */
const stickySummaryEl = document.getElementById('stickySummary');
function updateStickySummary() {
  const heroBlock = document.querySelector('.hero-block');
  if (!heroBlock || !stickySummaryEl) return;
  const heroBottom = heroBlock.getBoundingClientRect().bottom;
  stickySummaryEl.classList.toggle('show', heroBottom < 0);
}
window.addEventListener('scroll', updateStickySummary, { passive: true });
window.addEventListener('resize', updateStickySummary);

/* ─────────────── Boot ─────────────── */
applyI18n();
applyCurrencyUI();
syncPoolTimingUI();
syncDossierUI();
syncScenarioUI();
renderHolders();
renderConvertibles();
renderInvestors();
compute();
updateStickySummary();
