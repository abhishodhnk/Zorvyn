/** Pure helpers for dashboard metrics */

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function monthKey(iso) {
  return iso.slice(0, 7);
}

export function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function computeTotals(transactions) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return {
    totalIncome: income,
    totalExpense: expense,
    balance: income - expense,
  };
}

/** Running net balance end-of-month from sorted chronological tx */
export function balanceTrendByMonth(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const byMonth = new Map();
  for (const t of sorted) {
    const k = monthKey(t.date);
    if (!byMonth.has(k)) byMonth.set(k, { income: 0, expense: 0 });
    const bucket = byMonth.get(k);
    if (t.type === "income") bucket.income += t.amount;
    else bucket.expense += t.amount;
  }
  const keys = [...byMonth.keys()].sort();
  let running = 0;
  return keys.map((k) => {
    const { income, expense } = byMonth.get(k);
    running += income - expense;
    return {
      month: k,
      label: monthLabel(k),
      income,
      expense,
      netMonth: income - expense,
      balance: running,
    };
  });
}

export function spendingByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) || 0) + t.amount);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function filterAndSortTransactions(transactions, filters) {
  const { filterCategory, filterType, searchQuery, sortBy, sortDir } = filters;
  let list = transactions;

  if (filterCategory !== "all") {
    list = list.filter((t) => t.category === filterCategory);
  }
  if (filterType !== "all") {
    list = list.filter((t) => t.type === filterType);
  }
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (t) =>
        t.category.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q)) ||
        t.amount.toString().includes(q)
    );
  }

  const dir = sortDir === "asc" ? 1 : -1;
  list = [...list].sort((a, b) => {
    if (sortBy === "amount") return (a.amount - b.amount) * dir;
    return (new Date(a.date) - new Date(b.date)) * dir;
  });
  return list;
}

/** Expense totals for calendar month (1-based month from Date) */
export function expenseInMonth(transactions, year, monthIndex) {
  let sum = 0;
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const d = new Date(t.date + "T12:00:00");
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      sum += t.amount;
    }
  }
  return sum;
}

export function insightsFromTransactions(transactions) {
  const byCat = spendingByCategory(transactions);
  const highest = byCat[0] || null;

  const now = new Date();
  const thisM = expenseInMonth(
    transactions,
    now.getFullYear(),
    now.getMonth()
  );
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastM = expenseInMonth(
    transactions,
    prev.getFullYear(),
    prev.getMonth()
  );

  /** Compare current calendar month to previous, or fall back to last two months with expense data */
  let monthCompare = null;
  if (lastM > 0 || thisM > 0) {
    const pct =
      lastM > 0 ? Math.round(((thisM - lastM) / lastM) * 100) : null;
    monthCompare = { thisM, lastM, pct };
  } else {
    const months = new Map();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const k = monthKey(t.date);
      months.set(k, (months.get(k) || 0) + t.amount);
    }
    const keys = [...months.keys()].sort();
    if (keys.length >= 2) {
      const a = keys[keys.length - 2];
      const b = keys[keys.length - 1];
      monthCompare = {
        thisM: months.get(b),
        lastM: months.get(a),
        pct: Math.round(
          ((months.get(b) - months.get(a)) / Math.max(months.get(a), 1)) * 100
        ),
        fallbackLabel: `${monthLabel(a)} → ${monthLabel(b)}`,
      };
    } else if (keys.length === 1) {
      monthCompare = {
        thisM: months.get(keys[0]),
        lastM: 0,
        pct: null,
        fallbackLabel: monthLabel(keys[0]),
      };
    }
  }

  const totals = computeTotals(transactions);
  const savingsRate =
    totals.totalIncome > 0
      ? Math.round(
          ((totals.totalIncome - totals.totalExpense) / totals.totalIncome) *
            100
        )
      : null;

  return { highest, monthCompare, savingsRate, totals };
}

export function uniqueMonthKeysCount(transactions) {
  return new Set(transactions.map((t) => monthKey(t.date))).size;
}

export function uniqueExpenseCategoriesCount(transactions) {
  const s = new Set();
  for (const t of transactions) {
    if (t.type === "expense") s.add(t.category);
  }
  return s.size;
}

/** % change in cumulative balance between last two months in the trend */
export function lastBalanceTrendDeltaPercent(transactions) {
  const series = balanceTrendByMonth(transactions);
  if (series.length < 2) return null;
  const b0 = series[series.length - 2].balance;
  const b1 = series[series.length - 1].balance;
  if (b0 === 0) return b1 !== 0 ? null : 0;
  return Math.round(((b1 - b0) / Math.abs(b0)) * 1000) / 10;
}

export function newId() {
  return "t_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}
