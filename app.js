/* ─────────────── Constants ─────────────── */
const STORAGE_KEY = 'capital-increase-calculator/state/v2';
const DEFAULTS = {
  lang: 'fr',
  currency: 'EUR',
  preMoney: 8_000_000,
  existingShares: 100_000,
  nominalValue: 1,
  existingHolders: [
    { name: 'Fondateur A',  shares: 55_000 },
    { name: 'Fondateur B',  shares: 35_000 },
    { name: 'ESOP / Pool',  shares: 10_000 },
  ],
  investors: [
    { name: 'Bpifrance — Fonds Innovation', amount: 1_500_000 },
    { name: 'Business Angel',               amount:   500_000 },
  ],
};

const SYMBOLS = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' };
const LOCALES_BY_LANG = { fr: 'fr-FR', en: 'en-US', de: 'de-DE', es: 'es-ES' };
const CURRENCY_LOCALES = { EUR: 'fr-FR', USD: 'en-US', GBP: 'en-GB', CHF: 'fr-CH' };

/* ─────────────── i18n dictionary ─────────────── */
const I18N = {
  fr: {
    meta_title: "Calcul d'Augmentation de Capital",
    app_title: "Augmentation de Capital",
    app_subtitle: "Pré-money · Prime d'émission · Dilution",

    section_assumptions: "Hypothèses",
    section_assumptions_sub: "Données de l'opération",
    section_holders: "Actionnaires existants",
    section_holders_sub: "Répartition du capital actuel",
    section_investors: "Investisseurs",
    section_investors_sub: "Souscripteurs de la nouvelle émission",

    label_preMoney: "Valorisation pré-money",
    label_preMoney_hint: "Valeur de l'entreprise avant l'opération",
    label_existingShares: "Actions existantes",
    label_existingShares_hint: "Avant l'opération",
    label_nominalValue: "Valeur nominale",
    label_nominalValue_hint: "Par action",

    holder_placeholder_name: "Nom de l'actionnaire",
    holder_placeholder_shares: "Nombre d'actions",
    investor_placeholder_name: "Nom de l'investisseur",
    investor_placeholder_amount: "Montant",

    button_addHolder: "Ajouter un actionnaire",
    button_addInvestor: "Ajouter un investisseur",
    button_reset: "Réinitialiser",
    button_export: "Exporter CSV",
    button_print: "Imprimer / PDF",

    result_postMoney: "Valorisation post-money",
    result_postMoney_sub: "Pré-money + investissement total",
    result_pricePerShare: "Prix par action",
    result_pricePerShare_sub: "Pré-money ÷ actions existantes",
    result_newShares: "Actions émises",
    result_newShares_sub: "Nouvelles actions créées",
    result_nominalIncrease: "Augmentation nominale",
    result_nominalIncrease_sub: "Impact sur le capital social",
    result_premiumTotal: "Prime d'émission",
    result_premiumTotal_sub: "Investissement − nominale",
    result_dilution: "Dilution des actionnaires existants",
    result_dilution_template:
      "Anciens actionnaires : 100 % → {existingPct} · Prime / action : {premiumPerShare}",

    legend_existing: "Anciens actionnaires",
    legend_new: "Nouveaux investisseurs",

    captable_title: "Table de capitalisation",
    captable_subtitle: "Avant et après l'opération",
    captable_holder: "Détenteur",
    captable_before_shares: "Actions avant",
    captable_after_shares: "Actions après",
    captable_distribution: "Répartition",
    captable_total: "Total",
    captable_new: "nouveau",

    warn_nominal: "La valeur nominale est supérieure au prix d'émission.",
    warn_holders: "La somme des actionnaires existants ne correspond pas au total d'actions.",

    footer_disclaimer: "Outil indicatif — à valider avec votre conseil juridique et Bpifrance le cas échéant.",
    footer_method: "Méthode : prix par action = pré-money ÷ actions, dilution full-dilution.",

    reset_confirm: "Réinitialiser toutes les valeurs ?",
    new_holder_default: "Nouvel actionnaire",
    new_investor_default: "Nouvel investisseur",
  },
  en: {
    meta_title: "Capital Increase Calculator",
    app_title: "Capital Increase",
    app_subtitle: "Pre-money · Issue premium · Dilution",

    section_assumptions: "Assumptions",
    section_assumptions_sub: "Round inputs",
    section_holders: "Existing shareholders",
    section_holders_sub: "Current cap table",
    section_investors: "Investors",
    section_investors_sub: "Subscribers of the new issuance",

    label_preMoney: "Pre-money valuation",
    label_preMoney_hint: "Company value before the round",
    label_existingShares: "Existing shares",
    label_existingShares_hint: "Before the round",
    label_nominalValue: "Nominal value",
    label_nominalValue_hint: "Par value per share",

    holder_placeholder_name: "Shareholder name",
    holder_placeholder_shares: "Number of shares",
    investor_placeholder_name: "Investor name",
    investor_placeholder_amount: "Amount",

    button_addHolder: "Add shareholder",
    button_addInvestor: "Add investor",
    button_reset: "Reset",
    button_export: "Export CSV",
    button_print: "Print / PDF",

    result_postMoney: "Post-money valuation",
    result_postMoney_sub: "Pre-money + total investment",
    result_pricePerShare: "Price per share",
    result_pricePerShare_sub: "Pre-money ÷ existing shares",
    result_newShares: "New shares",
    result_newShares_sub: "Newly issued shares",
    result_nominalIncrease: "Nominal increase",
    result_nominalIncrease_sub: "Impact on share capital",
    result_premiumTotal: "Issue premium",
    result_premiumTotal_sub: "Investment − nominal increase",
    result_dilution: "Existing-holder dilution",
    result_dilution_template:
      "Existing holders: 100% → {existingPct} · Premium per share: {premiumPerShare}",

    legend_existing: "Existing holders",
    legend_new: "New investors",

    captable_title: "Cap table",
    captable_subtitle: "Before and after the round",
    captable_holder: "Holder",
    captable_before_shares: "Shares before",
    captable_after_shares: "Shares after",
    captable_distribution: "Distribution",
    captable_total: "Total",
    captable_new: "new",

    warn_nominal: "Nominal value is greater than the issue price.",
    warn_holders: "Existing shareholders' shares don't match the declared total.",

    footer_disclaimer: "Indicative tool — verify with your legal counsel.",
    footer_method: "Method: price per share = pre-money ÷ shares, simple full-dilution.",

    reset_confirm: "Reset all values?",
    new_holder_default: "New shareholder",
    new_investor_default: "New investor",
  },
  de: {
    meta_title: "Kapitalerhöhungs-Rechner",
    app_title: "Kapitalerhöhung",
    app_subtitle: "Pre-Money · Agio · Verwässerung",

    section_assumptions: "Annahmen",
    section_assumptions_sub: "Eingaben der Runde",
    section_holders: "Bestehende Aktionäre",
    section_holders_sub: "Aktuelle Cap Table",
    section_investors: "Investoren",
    section_investors_sub: "Zeichner der neuen Emission",

    label_preMoney: "Pre-Money-Bewertung",
    label_preMoney_hint: "Unternehmenswert vor der Runde",
    label_existingShares: "Bestehende Aktien",
    label_existingShares_hint: "Vor der Runde",
    label_nominalValue: "Nennwert",
    label_nominalValue_hint: "Pro Aktie",

    holder_placeholder_name: "Name des Aktionärs",
    holder_placeholder_shares: "Anzahl Aktien",
    investor_placeholder_name: "Name des Investors",
    investor_placeholder_amount: "Betrag",

    button_addHolder: "Aktionär hinzufügen",
    button_addInvestor: "Investor hinzufügen",
    button_reset: "Zurücksetzen",
    button_export: "CSV exportieren",
    button_print: "Drucken / PDF",

    result_postMoney: "Post-Money-Bewertung",
    result_postMoney_sub: "Pre-Money + Gesamtinvestition",
    result_pricePerShare: "Preis pro Aktie",
    result_pricePerShare_sub: "Pre-Money ÷ bestehende Aktien",
    result_newShares: "Neue Aktien",
    result_newShares_sub: "Neu ausgegebene Aktien",
    result_nominalIncrease: "Nominalerhöhung",
    result_nominalIncrease_sub: "Auswirkung auf das Grundkapital",
    result_premiumTotal: "Agio gesamt",
    result_premiumTotal_sub: "Investition − Nominalerhöhung",
    result_dilution: "Verwässerung der Altaktionäre",
    result_dilution_template:
      "Altaktionäre: 100 % → {existingPct} · Agio pro Aktie: {premiumPerShare}",

    legend_existing: "Altaktionäre",
    legend_new: "Neue Investoren",

    captable_title: "Kapitalisierungstabelle",
    captable_subtitle: "Vor und nach der Runde",
    captable_holder: "Inhaber",
    captable_before_shares: "Aktien vorher",
    captable_after_shares: "Aktien nachher",
    captable_distribution: "Verteilung",
    captable_total: "Gesamt",
    captable_new: "neu",

    warn_nominal: "Nennwert ist größer als der Ausgabepreis.",
    warn_holders: "Summe der Aktionäre stimmt nicht mit der Gesamtzahl überein.",

    footer_disclaimer: "Indikatives Tool — mit Ihrem Rechtsbeistand zu prüfen.",
    footer_method: "Methode: Preis pro Aktie = Pre-Money ÷ Aktien, einfache Verwässerung.",

    reset_confirm: "Alle Werte zurücksetzen?",
    new_holder_default: "Neuer Aktionär",
    new_investor_default: "Neuer Investor",
  },
  es: {
    meta_title: "Calculadora de Ampliación de Capital",
    app_title: "Ampliación de Capital",
    app_subtitle: "Pre-money · Prima de emisión · Dilución",

    section_assumptions: "Hipótesis",
    section_assumptions_sub: "Datos de la ronda",
    section_holders: "Accionistas existentes",
    section_holders_sub: "Reparto del capital actual",
    section_investors: "Inversores",
    section_investors_sub: "Suscriptores de la nueva emisión",

    label_preMoney: "Valoración pre-money",
    label_preMoney_hint: "Valor de la empresa antes de la ronda",
    label_existingShares: "Acciones existentes",
    label_existingShares_hint: "Antes de la ronda",
    label_nominalValue: "Valor nominal",
    label_nominalValue_hint: "Por acción",

    holder_placeholder_name: "Nombre del accionista",
    holder_placeholder_shares: "Número de acciones",
    investor_placeholder_name: "Nombre del inversor",
    investor_placeholder_amount: "Cantidad",

    button_addHolder: "Añadir accionista",
    button_addInvestor: "Añadir inversor",
    button_reset: "Reiniciar",
    button_export: "Exportar CSV",
    button_print: "Imprimir / PDF",

    result_postMoney: "Valoración post-money",
    result_postMoney_sub: "Pre-money + inversión total",
    result_pricePerShare: "Precio por acción",
    result_pricePerShare_sub: "Pre-money ÷ acciones existentes",
    result_newShares: "Acciones emitidas",
    result_newShares_sub: "Nuevas acciones creadas",
    result_nominalIncrease: "Aumento nominal",
    result_nominalIncrease_sub: "Impacto en el capital social",
    result_premiumTotal: "Prima de emisión",
    result_premiumTotal_sub: "Inversión − aumento nominal",
    result_dilution: "Dilución de los accionistas existentes",
    result_dilution_template:
      "Accionistas antiguos: 100 % → {existingPct} · Prima por acción: {premiumPerShare}",

    legend_existing: "Accionistas antiguos",
    legend_new: "Nuevos inversores",

    captable_title: "Tabla de capitalización",
    captable_subtitle: "Antes y después de la ronda",
    captable_holder: "Titular",
    captable_before_shares: "Acciones antes",
    captable_after_shares: "Acciones después",
    captable_distribution: "Distribución",
    captable_total: "Total",
    captable_new: "nuevo",

    warn_nominal: "El valor nominal es mayor que el precio de emisión.",
    warn_holders: "La suma de accionistas no coincide con el total declarado.",

    footer_disclaimer: "Herramienta indicativa — verifique con su asesor legal.",
    footer_method: "Método: precio por acción = pre-money ÷ acciones, dilución simple.",

    reset_confirm: "¿Reiniciar todos los valores?",
    new_holder_default: "Nuevo accionista",
    new_investor_default: "Nuevo inversor",
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
    const parsed = JSON.parse(raw);
    return {
      lang: I18N[parsed.lang] ? parsed.lang : DEFAULTS.lang,
      currency: SYMBOLS[parsed.currency] ? parsed.currency : DEFAULTS.currency,
      preMoney: Number(parsed.preMoney) || 0,
      existingShares: Number(parsed.existingShares) || 0,
      nominalValue: Number(parsed.nominalValue) || 0,
      existingHolders: Array.isArray(parsed.existingHolders) && parsed.existingHolders.length
        ? parsed.existingHolders.map(h => ({ name: String(h.name ?? ''), shares: Number(h.shares) || 0 }))
        : structuredClone(DEFAULTS.existingHolders),
      investors: Array.isArray(parsed.investors)
        ? parsed.investors.map(i => ({ name: String(i.name ?? ''), amount: Number(i.amount) || 0 }))
        : structuredClone(DEFAULTS.investors),
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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

/* ─────────────── i18n DOM apply ─────────────── */
function applyI18n() {
  document.documentElement.lang = state.lang;
  document.title = t('meta_title');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll('#langPick button').forEach(b =>
    b.classList.toggle('on', b.dataset.lang === state.lang)
  );
}

/* ─────────────── Existing holders ─────────────── */
const holderListEl = document.getElementById('holderList');
function renderHolders() {
  holderListEl.innerHTML = '';
  state.existingHolders.forEach((h, i) => {
    const row = document.createElement('div');
    row.className = 'list-row';
    row.innerHTML = `
      <input type="text" class="name" placeholder="${escapeHtml(t('holder_placeholder_name'))}" value="${escapeHtml(h.name)}">
      <input type="text" class="amount" placeholder="${escapeHtml(t('holder_placeholder_shares'))}" value="${fmtNum(h.shares, 0)}" inputmode="decimal">
      <button class="del" title="Delete" aria-label="Delete">
        <span class="material-symbols-outlined" style="font-size:18px">close</span>
      </button>
    `;
    row.querySelector('.name').addEventListener('input', e => {
      state.existingHolders[i].name = e.target.value;
      saveState();
      compute();
    });
    const sharesInput = row.querySelector('.amount');
    sharesInput.addEventListener('input', e => {
      state.existingHolders[i].shares = parseNum(e.target.value);
      saveState();
      compute();
    });
    sharesInput.addEventListener('blur', e => {
      e.target.value = fmtNum(state.existingHolders[i].shares, 0);
    });
    row.querySelector('.del').addEventListener('click', () => {
      state.existingHolders.splice(i, 1);
      renderHolders();
      saveState();
      compute();
    });
    holderListEl.appendChild(row);
  });
}
document.getElementById('addHolder').addEventListener('click', () => {
  state.existingHolders.push({ name: t('new_holder_default'), shares: 0 });
  renderHolders();
  saveState();
  compute();
});

/* ─────────────── Investors ─────────────── */
const invListEl = document.getElementById('investorList');
function renderInvestors() {
  invListEl.innerHTML = '';
  state.investors.forEach((inv, i) => {
    const row = document.createElement('div');
    row.className = 'list-row';
    row.innerHTML = `
      <input type="text" class="name" placeholder="${escapeHtml(t('investor_placeholder_name'))}" value="${escapeHtml(inv.name)}">
      <input type="text" class="amount" placeholder="${escapeHtml(t('investor_placeholder_amount'))}" value="${fmtNum(inv.amount, 0)}" inputmode="decimal">
      <button class="del" title="Delete" aria-label="Delete">
        <span class="material-symbols-outlined" style="font-size:18px">close</span>
      </button>
    `;
    row.querySelector('.name').addEventListener('input', e => {
      state.investors[i].name = e.target.value;
      saveState();
      compute();
    });
    const amtInput = row.querySelector('.amount');
    amtInput.addEventListener('input', e => {
      state.investors[i].amount = parseNum(e.target.value);
      saveState();
      compute();
    });
    amtInput.addEventListener('blur', e => {
      e.target.value = fmtNum(state.investors[i].amount, 0);
    });
    row.querySelector('.del').addEventListener('click', () => {
      state.investors.splice(i, 1);
      renderInvestors();
      saveState();
      compute();
    });
    invListEl.appendChild(row);
  });
}
document.getElementById('addInv').addEventListener('click', () => {
  state.investors.push({ name: t('new_investor_default'), amount: 250_000 });
  renderInvestors();
  saveState();
  compute();
});

/* ─────────────── Main inputs ─────────────── */
function bindInput(id, key, decimals = 0) {
  const el = document.getElementById(id);
  el.value = fmtNum(state[key], decimals);
  el.addEventListener('input', () => {
    state[key] = parseNum(el.value);
    saveState();
    compute();
  });
  el.addEventListener('blur', () => {
    el.value = fmtNum(state[key], decimals);
  });
}
bindInput('preMoney', 'preMoney', 0);
bindInput('existingShares', 'existingShares', 0);
bindInput('nominalValue', 'nominalValue', 2);

/* ─────────────── Language picker ─────────────── */
document.getElementById('langPick').addEventListener('click', e => {
  const btn = e.target.closest('button[data-lang]');
  if (!btn) return;
  state.lang = btn.dataset.lang;
  saveState();
  applyI18n();
  renderHolders();
  renderInvestors();
  compute();
});

/* ─────────────── Currency picker ─────────────── */
function applyCurrencyUI() {
  document.querySelectorAll('#currencyPick button').forEach(b =>
    b.classList.toggle('on', b.dataset.cur === state.currency)
  );
  document.querySelectorAll('.cur-symbol').forEach(el => el.textContent = SYMBOLS[state.currency]);
  document.getElementById('preMoney').value       = fmtNum(state.preMoney, 0);
  document.getElementById('existingShares').value = fmtNum(state.existingShares, 0);
  document.getElementById('nominalValue').value   = fmtNum(state.nominalValue, 2);
}
document.getElementById('currencyPick').addEventListener('click', e => {
  const btn = e.target.closest('button[data-cur]');
  if (!btn) return;
  state.currency = btn.dataset.cur;
  saveState();
  applyCurrencyUI();
  renderHolders();
  renderInvestors();
  compute();
});

/* ─────────────── Reset / Print / Export ─────────────── */
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm(t('reset_confirm'))) return;
  Object.assign(state, structuredClone(DEFAULTS), { lang: state.lang, currency: state.currency });
  saveState();
  applyCurrencyUI();
  renderHolders();
  renderInvestors();
  compute();
});

document.getElementById('exportBtn').addEventListener('click', exportCSV);

function exportCSV() {
  const c = currentComputation();
  const existingTotal = state.existingHolders.reduce((s, h) => s + h.shares, 0) || c.Nex;

  const rows = [[
    t('captable_holder'),
    'Type',
    t('captable_before_shares'),
    '% ' + t('captable_before_shares'),
    t('captable_after_shares'),
    '% ' + t('captable_after_shares'),
  ]];

  state.existingHolders.forEach(h => {
    const beforeShares = (h.shares / existingTotal) * c.Nex;
    const beforePct = c.Nex > 0 ? beforeShares / c.Nex : 0;
    const afterPct = c.totalSharesAfter > 0 ? beforeShares / c.totalSharesAfter : 0;
    rows.push([
      h.name, t('section_holders'),
      beforeShares.toFixed(0),
      (beforePct * 100).toFixed(4) + '%',
      beforeShares.toFixed(0),
      (afterPct * 100).toFixed(4) + '%',
    ]);
  });

  state.investors.forEach((inv, i) => {
    const sh = c.invShares[i];
    const afterPct = c.totalSharesAfter > 0 ? sh / c.totalSharesAfter : 0;
    rows.push([
      inv.name, t('section_investors'),
      '0', '0%',
      sh.toFixed(0),
      (afterPct * 100).toFixed(4) + '%',
    ]);
  });

  const csv = rows
    .map(r => r.map(cell => {
      const s = String(cell);
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

/* ─────────────── Computation ─────────────── */
function currentComputation() {
  const pre = state.preMoney;
  const Nex = state.existingShares;
  const nom = state.nominalValue;
  const investment = state.investors.reduce((s, i) => s + (i.amount || 0), 0);

  const pricePerShare = (Nex > 0 && pre > 0) ? pre / Nex : 0;
  const postMoney = pre + investment;

  let totalNewShares = 0;
  const invShares = state.investors.map(inv => {
    const sh = pricePerShare > 0 ? inv.amount / pricePerShare : 0;
    totalNewShares += sh;
    return sh;
  });

  const totalSharesAfter = Nex + totalNewShares;
  const nominalIncrease = totalNewShares * nom;
  const premiumTotal = investment - nominalIncrease;
  const premiumPerShare = pricePerShare - nom;
  const investorOwnership = totalSharesAfter > 0 ? totalNewShares / totalSharesAfter : 0;
  const existingNewPct = 1 - investorOwnership;

  return {
    pre, Nex, nom, investment,
    pricePerShare, postMoney,
    invShares, totalNewShares, totalSharesAfter,
    nominalIncrease, premiumTotal, premiumPerShare,
    investorOwnership, existingNewPct,
  };
}

function compute() {
  const c = currentComputation();
  const $ = id => document.getElementById(id);

  $('r_postMoney').textContent       = fmtMoney(c.postMoney, 0);
  $('r_pricePerShare').textContent   = fmtMoney(c.pricePerShare, 2);
  $('r_newShares').textContent       = fmtNum(c.totalNewShares, 0);
  $('r_nominalIncrease').textContent = fmtMoney(c.nominalIncrease, 0);
  $('r_premiumTotal').textContent    = fmtMoney(c.premiumTotal, 0);

  // dilution bar
  const existingPctNum = c.totalSharesAfter > 0 ? c.existingNewPct * 100 : 100;
  const newPctNum = c.totalSharesAfter > 0 ? c.investorOwnership * 100 : 0;
  $('dilExisting').style.width = existingPctNum.toFixed(2) + '%';
  $('dilNew').style.width      = newPctNum.toFixed(2) + '%';
  $('legExistingPct').textContent = fmtPct(c.existingNewPct, 2);
  $('legNewPct').textContent      = fmtPct(c.investorOwnership, 2);

  $('r_dilutionSub').textContent = t('result_dilution_template', {
    existingPct: fmtPct(c.existingNewPct, 2),
    premiumPerShare: fmtMoney(c.premiumPerShare, 2),
  });

  $('warn').hidden = !(c.nom > c.pricePerShare && c.pricePerShare > 0);

  const holdersSum = state.existingHolders.reduce((s, h) => s + h.shares, 0);
  const mismatch = c.Nex > 0 && holdersSum > 0 && Math.abs(holdersSum - c.Nex) / c.Nex > 0.0001;
  $('warnHolders').hidden = !mismatch;

  renderCapTable(c);
}

function renderCapTable(c) {
  const body = document.getElementById('capBody');
  body.innerHTML = '';
  const palette = ['b-blue', 'b-yellow', 'b-red', 'b-green'];

  const existingTotal = state.existingHolders.reduce((s, h) => s + h.shares, 0) || c.Nex;

  state.existingHolders.forEach((h, idx) => {
    const beforeShares = (h.shares / existingTotal) * c.Nex;
    const beforePct = c.Nex > 0 ? beforeShares / c.Nex : 0;
    const afterShares = beforeShares;
    const afterPct = c.totalSharesAfter > 0 ? afterShares / c.totalSharesAfter : 0;
    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${escapeHtml(h.name)}</td>
        <td>${fmtNum(beforeShares, 0)}</td>
        <td>${fmtPct(beforePct, 2)}</td>
        <td>${fmtNum(afterShares, 0)}</td>
        <td>${fmtPct(afterPct, 2)}</td>
        <td class="bar-cell"><div class="bar ${palette[idx % palette.length]}"><span style="width:${(afterPct * 100).toFixed(2)}%"></span></div></td>
      </tr>
    `);
  });

  state.investors.forEach((inv, i) => {
    const sh = c.invShares[i];
    const afterPct = c.totalSharesAfter > 0 ? sh / c.totalSharesAfter : 0;
    body.insertAdjacentHTML('beforeend', `
      <tr class="investor">
        <td>${escapeHtml(inv.name)}<span class="new-tag">${escapeHtml(t('captable_new'))}</span></td>
        <td>—</td>
        <td>—</td>
        <td>${fmtNum(sh, 0)}</td>
        <td>${fmtPct(afterPct, 2)}</td>
        <td class="bar-cell"><div class="bar b-green"><span style="width:${(afterPct * 100).toFixed(2)}%"></span></div></td>
      </tr>
    `);
  });

  body.insertAdjacentHTML('beforeend', `
    <tr class="total">
      <td>${escapeHtml(t('captable_total'))}</td>
      <td>${fmtNum(c.Nex, 0)}</td>
      <td>${fmtPct(1, 2)}</td>
      <td>${fmtNum(c.totalSharesAfter, 0)}</td>
      <td>${fmtPct(1, 2)}</td>
      <td></td>
    </tr>
  `);
}

/* ─────────────── Boot ─────────────── */
applyI18n();
applyCurrencyUI();
renderHolders();
renderInvestors();
compute();
