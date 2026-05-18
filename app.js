/* ─────────────── Constants ─────────────── */
const STORAGE_KEY = 'capital-increase-calculator/state/v3';

const DEFAULTS = {
  lang: 'fr',
  currency: 'EUR',

  preMoney: 8_000_000,
  existingShares: 100_000,
  nominalValue: 1,

  pool: {
    enabled: true,
    targetPct: 10,       // % of post-round fully-diluted shares
    timing: 'pre',       // 'pre' (founders dilute) | 'post' (everyone dilutes)
  },

  existingHolders: [
    { name: 'Fondateur A',    shares: 55_000 },
    { name: 'Fondateur B',    shares: 35_000 },
    { name: 'ESOP existant',  shares: 10_000 },
  ],

  convertibles: [
    {
      name: 'BSA AIR — Bpifrance Pré-Seed',
      type: 'bsa-air',     // 'bsa-air' | 'safe' | 'note'
      amount: 500_000,
      discountPct: 20,
      cap: 6_000_000,
    },
  ],

  investors: [
    {
      name: 'Bpifrance — Fonds Innovation',
      amount: 1_500_000,
      liqMultiple: 1,
      participation: 'non-participating',  // 'non-participating' | 'participating'
    },
    {
      name: 'Business Angel',
      amount: 500_000,
      liqMultiple: 1,
      participation: 'non-participating',
    },
  ],

  exit: {
    enabled: true,
    value: 30_000_000,
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
    conv_placeholder_discount: "Décote",
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
    hero_investment: "Investissement total",
    hero_implied: "Post-money implicite (prix × actions)",

    result_pricePerShare: "Prix par action",
    result_pricePerShare_sub: "Pré-money ÷ FD pré-money",
    result_newShares: "Actions émises",
    result_newShares_sub: "Pool + conv. + nouveaux",
    result_nominalIncrease: "Augmentation nominale",
    result_nominalIncrease_sub: "Impact capital social",
    result_premiumTotal: "Prime d'émission",
    result_premiumTotal_sub: "Investissement − nominale",

    result_dilution: "Répartition post-opération",
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
    conv_placeholder_discount: "Discount",
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
    hero_investment: "Total investment",
    hero_implied: "Implied post-money (price × shares)",

    result_pricePerShare: "Price per share",
    result_pricePerShare_sub: "Pre-money ÷ FD pre-money",
    result_newShares: "New shares issued",
    result_newShares_sub: "Pool + convertibles + new",
    result_nominalIncrease: "Nominal capital increase",
    result_nominalIncrease_sub: "Impact on share capital",
    result_premiumTotal: "Issue premium",
    result_premiumTotal_sub: "Investment − nominal",

    result_dilution: "Post-round breakdown",
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
    conv_placeholder_discount: "Discount",
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
    hero_investment: "Gesamtinvestition",
    hero_implied: "Implizit (Preis × Aktien)",

    result_pricePerShare: "Preis pro Aktie",
    result_pricePerShare_sub: "Pre-Money ÷ FD Pre-Money",
    result_newShares: "Neue Aktien",
    result_newShares_sub: "Pool + Wandel + Neue",
    result_nominalIncrease: "Nominalerhöhung",
    result_nominalIncrease_sub: "Auswirkung Grundkapital",
    result_premiumTotal: "Agio",
    result_premiumTotal_sub: "Investition − Nennwert",

    result_dilution: "Aufteilung post-Runde",
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
    conv_placeholder_discount: "Descuento",
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
    hero_investment: "Inversión total",
    hero_implied: "Post-money implícito (precio × acciones)",

    result_pricePerShare: "Precio por acción",
    result_pricePerShare_sub: "Pre-money ÷ acciones FD pre-money",
    result_newShares: "Nuevas acciones",
    result_newShares_sub: "Pool + convertibles + nuevos",
    result_nominalIncrease: "Aumento nominal",
    result_nominalIncrease_sub: "Impacto capital social",
    result_premiumTotal: "Prima de emisión",
    result_premiumTotal_sub: "Inversión − nominal",

    result_dilution: "Reparto post-operación",
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

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const p = JSON.parse(raw);
    return {
      lang: I18N[p.lang] ? p.lang : DEFAULTS.lang,
      currency: SYMBOLS[p.currency] ? p.currency : DEFAULTS.currency,
      preMoney: Number(p.preMoney) || 0,
      existingShares: Number(p.existingShares) || 0,
      nominalValue: Number(p.nominalValue) || 0,
      pool: {
        enabled: !!(p.pool && p.pool.enabled),
        targetPct: Number(p.pool && p.pool.targetPct) || 0,
        timing: (p.pool && (p.pool.timing === 'post' || p.pool.timing === 'pre'))
          ? p.pool.timing : DEFAULTS.pool.timing,
      },
      existingHolders: Array.isArray(p.existingHolders) && p.existingHolders.length
        ? p.existingHolders.map(h => ({ name: String(h.name ?? ''), shares: Number(h.shares) || 0 }))
        : structuredClone(DEFAULTS.existingHolders),
      convertibles: Array.isArray(p.convertibles)
        ? p.convertibles.map(c => ({
            name: String(c.name ?? ''),
            type: ['bsa-air','safe','note'].includes(c.type) ? c.type : 'bsa-air',
            amount: Number(c.amount) || 0,
            discountPct: Number(c.discountPct) || 0,
            cap: Number(c.cap) || 0,
          }))
        : structuredClone(DEFAULTS.convertibles),
      investors: Array.isArray(p.investors)
        ? p.investors.map(i => ({
            name: String(i.name ?? ''),
            amount: Number(i.amount) || 0,
            liqMultiple: Number(i.liqMultiple) || 1,
            participation: i.participation === 'participating' ? 'participating' : 'non-participating',
          }))
        : structuredClone(DEFAULTS.investors),
      exit: {
        enabled: !!(p.exit && p.exit.enabled),
        value: Number(p.exit && p.exit.value) || 0,
      },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
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
    card.querySelector('.del').addEventListener('click', () => {
      state.existingHolders.splice(i, 1);
      renderHolders(); saveState(); compute();
    });
    holderListEl.appendChild(card);
  });
}
document.getElementById('addHolder').addEventListener('click', () => {
  state.existingHolders.push({ name: t('new_holder_default'), shares: 0 });
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
          <label>${escapeHtml(t('conv_type_label'))}</label>
          <select class="type">
            <option value="bsa-air" ${cv.type === 'bsa-air' ? 'selected' : ''}>${escapeHtml(t('conv_type_bsaair'))}</option>
            <option value="safe"    ${cv.type === 'safe'    ? 'selected' : ''}>${escapeHtml(t('conv_type_safe'))}</option>
            <option value="note"    ${cv.type === 'note'    ? 'selected' : ''}>${escapeHtml(t('conv_type_note'))}</option>
          </select>
        </div>
        <div class="mini">
          <label>${escapeHtml(t('conv_discount_label'))} (%)</label>
          <input type="text" class="discount numeric" value="${fmtNum(cv.discountPct, 0)}" inputmode="decimal">
        </div>
        <div class="mini">
          <label>${escapeHtml(t('conv_cap_label'))}</label>
          <input type="text" class="cap numeric" placeholder="${escapeHtml(t('conv_placeholder_cap'))}" value="${cv.cap > 0 ? fmtNum(cv.cap, 0) : ''}" inputmode="decimal">
        </div>
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
          <label>${escapeHtml(t('investor_liqMult_label'))}</label>
          <input type="text" class="liq numeric" value="${fmtNum(inv.liqMultiple, 2)}" inputmode="decimal">
        </div>
        <div class="mini">
          <label>${escapeHtml(t('investor_part_label'))}</label>
          <select class="part">
            <option value="non-participating" ${inv.participation === 'non-participating' ? 'selected' : ''}>${escapeHtml(t('part_non'))}</option>
            <option value="participating"     ${inv.participation === 'participating'     ? 'selected' : ''}>${escapeHtml(t('part_participating'))}</option>
          </select>
        </div>
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
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm(t('reset_confirm'))) return;
  const lang = state.lang, currency = state.currency;
  Object.assign(state, structuredClone(DEFAULTS), { lang, currency });
  saveState();
  applyCurrencyUI(); syncPoolTimingUI();
  renderHolders(); renderConvertibles(); renderInvestors();
  compute();
});

document.getElementById('exportBtn').addEventListener('click', exportCSV);

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
  $('r_postMoney').textContent  = fmtMoney(c.postMoney, 0);
  $('r_totalInvest').textContent = fmtMoney(c.totalInvestment, 0);
  $('r_postImplied').textContent = fmtMoney(c.postImplied, 0);

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

/* ─────────────── Boot ─────────────── */
applyI18n();
applyCurrencyUI();
syncPoolTimingUI();
renderHolders();
renderConvertibles();
renderInvestors();
compute();
