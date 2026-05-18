/* ─────────────── Constants ─────────────── */
const STORAGE_KEY = 'capital-increase-calculator/state/v1';
const DEFAULTS = {
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
    { name: 'Seed Fund I',    amount: 1_500_000 },
    { name: 'Business Angel', amount:   500_000 },
  ],
};

const symbols = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' };
const locales = { EUR: 'fr-FR', USD: 'en-US', GBP: 'en-GB', CHF: 'fr-CH' };

/* ─────────────── State ─────────────── */
const state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    return {
      currency: parsed.currency || DEFAULTS.currency,
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

/* ─────────────── Formatting helpers ─────────────── */
const fmtMoney = (n, decimals = 0) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(locales[state.currency], {
    style: 'currency',
    currency: state.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
};
const fmtNum = (n, decimals = 0) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(locales[state.currency], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
};
const fmtPct = (n, decimals = 2) => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(locales[state.currency], {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
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

/* ─────────────── Existing holders rows ─────────────── */
const holderListEl = document.getElementById('holderList');
function renderHolders() {
  holderListEl.innerHTML = '';
  state.existingHolders.forEach((h, i) => {
    const row = document.createElement('div');
    row.className = 'investor-row';
    row.innerHTML = `
      <input type="text" class="name" placeholder="Nom de l'actionnaire" value="${escapeHtml(h.name)}">
      <input type="text" class="amount" placeholder="Actions" value="${fmtNum(h.shares, 0)}" inputmode="decimal">
      <button class="del" title="Supprimer" aria-label="Supprimer">×</button>
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
  state.existingHolders.push({ name: 'Nouvel actionnaire', shares: 0 });
  renderHolders();
  saveState();
  compute();
});

/* ─────────────── Investor rows ─────────────── */
const invListEl = document.getElementById('investorList');
function renderInvestors() {
  invListEl.innerHTML = '';
  state.investors.forEach((inv, i) => {
    const row = document.createElement('div');
    row.className = 'investor-row';
    row.innerHTML = `
      <input type="text" class="name" placeholder="Nom de l'investisseur" value="${escapeHtml(inv.name)}">
      <input type="text" class="amount" placeholder="Montant" value="${fmtNum(inv.amount, 0)}" inputmode="decimal">
      <button class="del" title="Supprimer" aria-label="Supprimer">×</button>
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
  state.investors.push({ name: 'Nouvel investisseur', amount: 250_000 });
  renderInvestors();
  saveState();
  compute();
});

/* ─────────────── Main inputs ─────────────── */
function bindInput(id, key, decimals = 0) {
  const el = document.getElementById(id);
  el.value = decimals > 0 ? fmtNum(state[key], decimals) : fmtNum(state[key], 0);
  el.addEventListener('input', () => {
    state[key] = parseNum(el.value);
    saveState();
    compute();
  });
  el.addEventListener('blur', () => {
    el.value = decimals > 0 ? fmtNum(state[key], decimals) : fmtNum(state[key], 0);
  });
}
bindInput('preMoney', 'preMoney', 0);
bindInput('existingShares', 'existingShares', 0);
bindInput('nominalValue', 'nominalValue', 2);

/* ─────────────── Currency picker ─────────────── */
function applyCurrencyUI() {
  document.querySelectorAll('#currencyPick button').forEach(b =>
    b.classList.toggle('on', b.dataset.cur === state.currency)
  );
  document.querySelectorAll('.cur-symbol').forEach(el => el.textContent = symbols[state.currency]);
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
  if (!confirm('Réinitialiser toutes les valeurs ?')) return;
  Object.assign(state, structuredClone(DEFAULTS));
  saveState();
  applyCurrencyUI();
  renderHolders();
  renderInvestors();
  compute();
});

document.getElementById('exportBtn').addEventListener('click', exportCSV);

function exportCSV() {
  const { Nex, totalSharesAfter, invShares } = currentComputation();
  const existingTotal = state.existingHolders.reduce((s, h) => s + h.shares, 0) || Nex;

  const rows = [['Detenteur', 'Type', 'Actions avant', '% avant', 'Actions apres', '% apres']];

  state.existingHolders.forEach(h => {
    const beforeShares = (h.shares / existingTotal) * Nex;
    const beforePct = Nex > 0 ? beforeShares / Nex : 0;
    const afterPct = totalSharesAfter > 0 ? beforeShares / totalSharesAfter : 0;
    rows.push([
      h.name,
      'Existant',
      beforeShares.toFixed(0),
      (beforePct * 100).toFixed(4) + '%',
      beforeShares.toFixed(0),
      (afterPct * 100).toFixed(4) + '%',
    ]);
  });

  state.investors.forEach((inv, i) => {
    const sh = invShares[i];
    const afterPct = totalSharesAfter > 0 ? sh / totalSharesAfter : 0;
    rows.push([
      inv.name,
      'Investisseur',
      '0',
      '0%',
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

/* ─────────────── Date label ─────────────── */
document.getElementById('todayLabel').textContent =
  new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

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
  $('r_dilution').textContent        = fmtPct(c.investorOwnership, 2);
  $('r_dilutionSub').textContent     =
    `Anciens actionnaires : 100 % → ${fmtPct(c.existingNewPct, 2)} · Prime / action : ${fmtMoney(c.premiumPerShare, 2)}`;

  document.getElementById('warn').classList.toggle('show', c.nom > c.pricePerShare && c.pricePerShare > 0);

  const holdersSum = state.existingHolders.reduce((s, h) => s + h.shares, 0);
  const mismatch = c.Nex > 0 && holdersSum > 0 && Math.abs(holdersSum - c.Nex) / c.Nex > 0.0001;
  document.getElementById('warnHolders').classList.toggle('show', mismatch);

  renderCapTable(c);
}

function renderCapTable(c) {
  const body = document.getElementById('capBody');
  body.innerHTML = '';
  const palette = ['', 'b-gold', 'b-green', 'b-accent'];

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
        <td>${escapeHtml(inv.name)} <span style="color:var(--muted); font-weight:400">· nouveau</span></td>
        <td>—</td>
        <td>—</td>
        <td>${fmtNum(sh, 0)}</td>
        <td>${fmtPct(afterPct, 2)}</td>
        <td class="bar-cell"><div class="bar b-accent"><span style="width:${(afterPct * 100).toFixed(2)}%"></span></div></td>
      </tr>
    `);
  });

  body.insertAdjacentHTML('beforeend', `
    <tr class="total">
      <td>Total</td>
      <td>${fmtNum(c.Nex, 0)}</td>
      <td>100,00 %</td>
      <td>${fmtNum(c.totalSharesAfter, 0)}</td>
      <td>100,00 %</td>
      <td></td>
    </tr>
  `);
}

/* ─────────────── Boot ─────────────── */
applyCurrencyUI();
renderHolders();
renderInvestors();
compute();
