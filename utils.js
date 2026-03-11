// Shared utility helpers (formatting, dates, CSV/JSON export)

export const CURRENCY = "AZN";

/**
 * Format a number as Azerbaijani Manat.
 *
 * Output:  "1,250.00 ₼"
 *   • Comma  → thousands separator   (1,250)
 *   • Dot    → decimal separator     (.00)
 *   • ₼      → symbol after the amount, separated by a thin non-breaking space (U+202F)
 *
 * We use "en-US" locale explicitly (not the system locale) so the
 * comma/dot format is always consistent regardless of the user's OS
 * language settings.  Then we append the ₼ symbol manually instead of
 * relying on Intl's AZN rendering, which varies across browsers/OS versions
 * (some output "AZN", some "man.", few show "₼" correctly).
 */
export function formatCurrency(value) {
  const number = Number.isFinite(value) ? value : 0;
  const formatted = number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // U+202F = NARROW NO-BREAK SPACE — standard fintech thin-space before/after currency symbol
  return formatted + "\u202F\u20BC";
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
  // Use native structuredClone when available; fall back to JSON round-trip.
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

export function downloadFile({ filename, content, mimeType }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function toCSV(rows, { includeHeader = true } = {}) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    if (value == null) return "";
    const s = String(value);
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [];
  if (includeHeader) {
    lines.push(headers.map(escape).join(","));
  }
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}