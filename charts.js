// Chart.js integration and updates

import { formatCurrency } from "./utils.js";

let categoryChart;
let monthlyChart;
let walletChart;
let analyticsMonthlyChart;
let analyticsCategoryChart;
let netWorthChart;
let savingsRateChart;

export function initCharts(analytics) {
  if (!window.Chart) return;

  const categoryCtx = document.getElementById("chart-category");
  const monthlyCtx = document.getElementById("chart-monthly");
  const walletCtx = document.getElementById("chart-wallets");

  const categoryData = toCategoryData(analytics.byCategory);
  const monthlyData = toMonthlyData(analytics.byMonth);
  const walletData = toWalletData(analytics.byWalletSpending);

  if (categoryCtx) categoryChart = new Chart(categoryCtx, {
    type: "pie",
    data: {
      labels: categoryData.labels,
      datasets: [
        {
          label: "Spending by category",
          data: categoryData.values,
          backgroundColor: categoryData.colors,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          align: "center",
          labels: {
            color: "#e2e8f0",
            usePointStyle: true,
            boxWidth: 8,
            padding: 16,
            font: {
              family: "DM Sans, system-ui, -apple-system, sans-serif",
              size: 11,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(13,17,23,0.97)",
          borderColor: "rgba(99,179,237,0.35)",
          borderWidth: 1,
          padding: 10,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (ctx) =>
              `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
          },
        },
      },
      layout: {
        padding: {
          top: 4,
          right: 12,
          bottom: 4,
          left: 12,
        },
      },
      maintainAspectRatio: false,
    },
  });

  if (monthlyCtx) monthlyChart = new Chart(monthlyCtx, {
    type: "bar",
    data: {
      labels: monthlyData.labels,
      datasets: [
        {
          label: "Income",
          data: monthlyData.income,
          backgroundColor: "rgba(52, 211, 153, 0.88)",
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 32,
        },
        {
          label: "Expenses",
          data: monthlyData.expense,
          backgroundColor: "rgba(248, 113, 113, 0.90)",
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 32,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 8,
          right: 16,
          left: 4,
          bottom: 0,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#64748b",
            padding: 6,
            font: {
              family: "DM Sans, system-ui, -apple-system, sans-serif",
              size: 11,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: "#64748b",
            padding: 6,
            font: {
              family: "DM Sans, system-ui, -apple-system, sans-serif",
              size: 11,
            },
            callback: (value) => formatCurrency(value),
          },
          grid: {
            color: "rgba(99,179,237,0.09)",
            drawBorder: false,
            borderDash: [4, 4],
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "#e2e8f0",
            usePointStyle: true,
            boxWidth: 8,
            padding: 12,
            font: {
              family: "DM Sans, system-ui, -apple-system, sans-serif",
              size: 11,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(13,17,23,0.97)",
          borderColor: "rgba(99,179,237,0.35)",
          borderWidth: 1,
          padding: 10,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
    },
  });

  if (walletCtx) walletChart = new Chart(walletCtx, {
    type: "doughnut",
    data: {
      labels: walletData.labels,
      datasets: [
        {
          label: "Wallet distribution",
          data: walletData.values,
          backgroundColor: walletData.colors,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          align: "center",
          labels: {
            color: "#e2e8f0",
            usePointStyle: true,
            boxWidth: 8,
            padding: 16,
            font: {
              family: "DM Sans, system-ui, -apple-system, sans-serif",
              size: 11,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(13,17,23,0.97)",
          borderColor: "rgba(99,179,237,0.35)",
          borderWidth: 1,
          padding: 10,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (ctx) =>
              `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
          },
        },
      },
      cutout: "55%",
      layout: {
        padding: {
          top: 4,
          right: 12,
          bottom: 4,
          left: 12,
        },
      },
      maintainAspectRatio: false,
    },
  });

  // ── Analytics page charts ────────────────────────────────────
  const analyticsMonthlyCtx  = document.getElementById("chart-monthly-2");
  const analyticsCategoryCtx = document.getElementById("chart-category-2");
  const netWorthCtx          = document.getElementById("chart-networth");
  const savingsRateCtx       = document.getElementById("chart-savings-rate");

  const netWorthData   = toNetWorthData(analytics.byMonth, analytics.totalBalance);
  const savingsData    = toSavingsRateData(analytics.byMonth);

  // ── Net Worth Trend (line) ──────────────────────────────────
  if (netWorthCtx) {
    netWorthChart = new Chart(netWorthCtx, {
      type: "line",
      data: {
        labels: netWorthData.labels,
        datasets: [{
          label: "Net Worth",
          data: netWorthData.values,
          borderColor: "#63B3ED",
          backgroundColor: "rgba(99,179,237,0.10)",
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#63B3ED",
          pointBorderColor: "#0d1117",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeInOutQuart" },
        layout: { padding: { top: 8, right: 16, left: 4, bottom: 0 } },
        scales: {
          x: {
            ticks: { color: "#64748b", padding: 6, font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 } },
            grid: { display: false, drawBorder: false },
          },
          y: {
            ticks: { color: "#64748b", padding: 6, font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 }, callback: (v) => formatCurrency(v) },
            grid: { color: "rgba(99,179,237,0.09)", drawBorder: false, borderDash: [4, 4] },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(13,17,23,0.97)",
            borderColor: "rgba(99,179,237,0.35)",
            borderWidth: 1, padding: 10,
            titleColor: "#e2e8f0", bodyColor: "#94a3b8",
            callbacks: { label: (ctx) => `Net Worth: ${formatCurrency(ctx.parsed.y)}` },
          },
        },
      },
    });
  }

  // ── Income vs Expenses (bar) ────────────────────────────────
  if (analyticsMonthlyCtx) {
    analyticsMonthlyChart = new Chart(analyticsMonthlyCtx, {
      type: "bar",
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: "Income",
            data: monthlyData.income,
            backgroundColor: "rgba(52, 211, 153, 0.88)",
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 40,
          },
          {
            label: "Expenses",
            data: monthlyData.expense,
            backgroundColor: "rgba(248, 113, 113, 0.90)",
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeInOutQuart" },
        layout: { padding: { top: 8, right: 16, left: 4, bottom: 0 } },
        scales: {
          x: {
            ticks: { color: "#64748b", padding: 6, font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 } },
            grid: { display: false, drawBorder: false },
          },
          y: {
            ticks: { color: "#64748b", padding: 6, font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 }, callback: (v) => formatCurrency(v) },
            grid: { color: "rgba(99,179,237,0.09)", drawBorder: false, borderDash: [4, 4] },
          },
        },
        plugins: {
          legend: {
            position: "top", align: "end",
            labels: { color: "#e2e8f0", usePointStyle: true, boxWidth: 8, padding: 12,
              font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 } },
          },
          tooltip: {
            backgroundColor: "rgba(13,17,23,0.97)",
            borderColor: "rgba(99,179,237,0.35)",
            borderWidth: 1, padding: 10,
            titleColor: "#e2e8f0", bodyColor: "#94a3b8",
            callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` },
          },
        },
      },
    });
  }

  // ── Spending by Category (donut) ────────────────────────────
  if (analyticsCategoryCtx) {
    analyticsCategoryChart = new Chart(analyticsCategoryCtx, {
      type: "doughnut",
      data: {
        labels: categoryData.labels,
        datasets: [{
          label: "Spending by category",
          data: categoryData.values,
          backgroundColor: categoryData.colors,
        }],
      },
      options: {
        cutout: "55%",
        plugins: {
          legend: {
            position: "bottom", align: "center",
            labels: { color: "#e2e8f0", usePointStyle: true, boxWidth: 8, padding: 16,
              font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 } },
          },
          tooltip: {
            backgroundColor: "rgba(13,17,23,0.97)",
            borderColor: "rgba(99,179,237,0.35)",
            borderWidth: 1, padding: 10,
            titleColor: "#e2e8f0", bodyColor: "#94a3b8",
            callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}` },
          },
        },
        layout: { padding: { top: 4, right: 12, bottom: 4, left: 12 } },
        maintainAspectRatio: false,
      },
    });
  }

  // ── Savings Rate (line, %) ──────────────────────────────────
  if (savingsRateCtx) {
    savingsRateChart = new Chart(savingsRateCtx, {
      type: "line",
      data: {
        labels: savingsData.labels,
        datasets: [{
          label: "Savings Rate",
          data: savingsData.values,
          borderColor: "#34d399",
          backgroundColor: "rgba(52,211,153,0.10)",
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#34d399",
          pointBorderColor: "#0d1117",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeInOutQuart" },
        layout: { padding: { top: 8, right: 16, left: 4, bottom: 0 } },
        scales: {
          x: {
            ticks: { color: "#64748b", padding: 6, font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 } },
            grid: { display: false, drawBorder: false },
          },
          y: {
            min: -100,
            max: 100,
            ticks: { color: "#64748b", padding: 6, font: { family: "DM Sans, system-ui, -apple-system, sans-serif", size: 11 }, callback: (v) => v + "%" },
            grid: { color: "rgba(99,179,237,0.09)", drawBorder: false, borderDash: [4, 4] },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(13,17,23,0.97)",
            borderColor: "rgba(52,211,153,0.35)",
            borderWidth: 1, padding: 10,
            titleColor: "#e2e8f0", bodyColor: "#94a3b8",
            callbacks: { label: (ctx) => `Savings Rate: ${ctx.parsed.y.toFixed(1)}%` },
          },
        },
      },
    });
  }
}

export function updateCharts(analytics) {
  if (!window.Chart) return;

  const categoryData = toCategoryData(analytics.byCategory);
  const monthlyData = toMonthlyData(analytics.byMonth);
  const walletData = toWalletData(analytics.byWalletSpending);

  if (categoryChart) {
    categoryChart.data.labels = categoryData.labels;
    categoryChart.data.datasets[0].data = categoryData.values;
    categoryChart.data.datasets[0].backgroundColor = categoryData.colors;
    categoryChart.update();
  }

  if (monthlyChart) {
    monthlyChart.data.labels = monthlyData.labels;
    monthlyChart.data.datasets[0].data = monthlyData.income;
    monthlyChart.data.datasets[1].data = monthlyData.expense;
    monthlyChart.update();
  }

  if (walletChart) {
    walletChart.data.labels = walletData.labels;
    walletChart.data.datasets[0].data = walletData.values;
    walletChart.data.datasets[0].backgroundColor = walletData.colors;
    walletChart.update();
  }

  const netWorthData = toNetWorthData(analytics.byMonth, analytics.totalBalance);
  const savingsData  = toSavingsRateData(analytics.byMonth);

  if (netWorthChart) {
    netWorthChart.data.labels = netWorthData.labels;
    netWorthChart.data.datasets[0].data = netWorthData.values;
    netWorthChart.update();
  }

  if (analyticsMonthlyChart) {
    analyticsMonthlyChart.data.labels = monthlyData.labels;
    analyticsMonthlyChart.data.datasets[0].data = monthlyData.income;
    analyticsMonthlyChart.data.datasets[1].data = monthlyData.expense;
    analyticsMonthlyChart.update();
  }

  if (analyticsCategoryChart) {
    analyticsCategoryChart.data.labels = categoryData.labels;
    analyticsCategoryChart.data.datasets[0].data = categoryData.values;
    analyticsCategoryChart.data.datasets[0].backgroundColor = categoryData.colors;
    analyticsCategoryChart.update();
  }

  if (savingsRateChart) {
    savingsRateChart.data.labels = savingsData.labels;
    savingsRateChart.data.datasets[0].data = savingsData.values;
    savingsRateChart.update();
  }
}

function toCategoryData(byCategory) {
  const entries = Object.entries(byCategory || {}).sort((a, b) => b[1] - a[1]);
  const labels = entries.map(([key]) => key);
  const values = entries.map(([, value]) => value);
  const colors = generateColors(values.length);
  return { labels, values, colors };
}

function toMonthlyData(byMonth) {
  const keys = Object.keys(byMonth || {}).sort();
  const income = keys.map((k) => byMonth[k].income || 0);
  const expense = keys.map((k) => byMonth[k].expense || 0);
  return { labels: keys, income, expense };
}

function toWalletData(byWalletSpending) {
  const entries = Object.entries(byWalletSpending || {}).sort((a, b) => b[1] - a[1]);
  const labels = entries.map(([name]) => name);
  const values = entries.map(([, value]) => value);
  const colors = generateColors(values.length);
  return { labels, values, colors };
}

/** Net Worth per month: work backwards from current totalBalance */
function toNetWorthData(byMonth, totalBalance) {
  const keys = Object.keys(byMonth || {}).sort();
  if (!keys.length) return { labels: [], values: [] };

  // Compute cumulative net per month in chronological order
  const monthlyNet = keys.map((k) => (byMonth[k].income || 0) - (byMonth[k].expense || 0));
  const totalNet   = monthlyNet.reduce((s, v) => s + v, 0);

  // The balance before the first recorded month
  const baseBalance = totalBalance - totalNet;

  const values = [];
  let running = baseBalance;
  for (const net of monthlyNet) {
    running += net;
    values.push(Math.round(running * 100) / 100);
  }

  return { labels: keys, values };
}

/** Savings rate per month: (income - expense) / income * 100 */
function toSavingsRateData(byMonth) {
  const keys = Object.keys(byMonth || {}).sort();
  const values = keys.map((k) => {
    const inc = byMonth[k].income || 0;
    const exp = byMonth[k].expense || 0;
    if (inc === 0) return 0;
    return Math.round(((inc - exp) / inc) * 1000) / 10;  // one decimal
  });
  return { labels: keys, values };
}

function generateColors(count) {
  const baseColors = [
    "#63B3ED",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#22d3ee",
  ];
  if (count <= baseColors.length) return baseColors.slice(0, count);
  const colors = [];
  for (let i = 0; i < count; i += 1) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}