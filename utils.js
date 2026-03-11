// Shared utility helpers (formatting, dates, CSV/JSON export, currency)

export const CURRENCY = "AZN";

// ── Currency config ───────────────────────────────────────────
const CURRENCY_CONFIG = {
  AZN: { symbol: "₼", position: "after",  locale: "en-US", rate: 1       },
  USD: { symbol: "$", position: "before", locale: "en-US", rate: 0.588   },
  EUR: { symbol: "€", position: "before", locale: "de-DE", rate: 0.541   },
};

/**
 * Get the currently selected currency code from localStorage / html attr.
 * Falls back to AZN.
 */
export function getActiveCurrency() {
  return localStorage.getItem("wallet-currency") || "AZN";
}

/**
 * Convert a raw AZN value to the active currency and return the numeric result.
 */
export function convertAmount(aznValue) {
  const code = getActiveCurrency();
  const cfg  = CURRENCY_CONFIG[code] || CURRENCY_CONFIG.AZN;
  return aznValue * cfg.rate;
}

/**
 * Format a number as the active currency.
 * If `raw` is provided it is treated as AZN and converted first.
 *
 * Output example (AZN): "1,250.00 ₼"
 * Output example (USD): "$1,250.00" (Optionally with narrow-space)
 */
export function formatCurrency(value) {
  const code   = getActiveCurrency();
  const cfg    = CURRENCY_CONFIG[code] || CURRENCY_CONFIG.AZN;
  const number = Number.isFinite(value) ? value * cfg.rate : 0;

  const formatted = number.toLocaleString(cfg.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (cfg.position === "after") {
    return formatted + "\u202F" + cfg.symbol;
  }
  return cfg.symbol + formatted;
}

/**
 * Animate a numeric display element from its current value to `target`.
 * Uses requestAnimationFrame for silky smoothness.
 *
 * @param {HTMLElement} el        - Element whose textContent will be updated
 * @param {number}      target    - Final AZN value
 * @param {number}      duration  - Animation duration in ms (default 900)
 */
export function animateCounter(el, target, duration = 900) {
  if (!el) return;
  const start     = performance.now();
  const startVal  = 0;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current  = startVal + (target - startVal) * easeOutExpo(progress);
    el.textContent = formatCurrency(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = formatCurrency(target);
  }

  requestAnimationFrame(step);
}

export function parseNumber(value) {
  const n = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthKeyFromISO(dateISO) {
  if (!dateISO) return "";
  return dateISO.slice(0, 7); // YYYY-MM
}

export function deepClone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

export function downloadFile({ filename, content, mimeType }) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function toCSV(rows, { includeHeader = true } = {}) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape  = (value) => {
    if (value == null) return "";
    const s = String(value);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [];
  if (includeHeader) lines.push(headers.map(escape).join(","));
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(","));
  return lines.join("\n");
}

/**
 * Generate smart financial insights from analytics data.
 * Returns an array of insight strings.
 */
export function generateInsights(analytics) {
  const insights = [];
  const { byCategory, totalExpenses, totalIncome, net, byMonth } = analytics;

  // Highest spending category
  const catEntries = Object.entries(byCategory || {}).sort((a, b) => b[1] - a[1]);
  if (catEntries.length > 0) {
    const [topCat, topAmt] = catEntries[0];
    const pct = totalExpenses > 0 ? Math.round((topAmt / totalExpenses) * 100) : 0;
    insights.push(`Your highest spending category is ${capitalize(topCat)} (${pct}% of expenses).`);
  }

  // Savings rate
  if (totalIncome > 0) {
    const savingsRate = Math.round((net / totalIncome) * 100);
    if (savingsRate > 0) {
      insights.push(`You're saving ${savingsRate}% of your income. Keep it up!`);
    } else if (savingsRate < 0) {
      insights.push(`You're spending more than you earn. Consider reviewing your expenses.`);
    }
  }

  // Month-over-month expense change
  const monthKeys = Object.keys(byMonth || {}).sort();
  if (monthKeys.length >= 2) {
    const prev = byMonth[monthKeys[monthKeys.length - 2]]?.expense || 0;
    const curr = byMonth[monthKeys[monthKeys.length - 1]]?.expense || 0;
    if (prev > 0) {
      const change = Math.round(((curr - prev) / prev) * 100);
      if (Math.abs(change) >= 5) {
        insights.push(
          change > 0
            ? `Expenses rose ${change}% vs last month.`
            : `Expenses dropped ${Math.abs(change)}% vs last month. Great progress!`
        );
      }
    }
  }

  return insights;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
