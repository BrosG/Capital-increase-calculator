/* shared.js — minimal helpers for the simple tool pages (FR + EUR fixed) */

const LOCALE = 'fr-FR';
const CURRENCY = 'EUR';

function fmtMoney(n, decimals = 0) {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency', currency: CURRENCY,
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
}
function fmtMoneyCompact(n) {
  if (!isFinite(n)) return '—';
  const abs = Math.abs(n);
  let decimals = 0;
  if (abs > 0 && abs < 1) decimals = 4;
  else if (abs < 10) decimals = 2;
  return fmtMoney(n, decimals);
}
function fmtNum(n, decimals = 0) {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
}
function fmtPct(n, decimals = 2) {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
}
function parseNum(s) {
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
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

/* Auto-format-on-blur for any input.numeric / .money inputs that have data-fmt */
function bindNumberInput(el, getter, setter, decimals = 0, onUpdate) {
  el.value = fmtNum(getter(), decimals);
  el.addEventListener('input', () => {
    setter(parseNum(el.value));
    if (onUpdate) onUpdate();
  });
  el.addEventListener('blur', () => {
    el.value = fmtNum(getter(), decimals);
  });
}
