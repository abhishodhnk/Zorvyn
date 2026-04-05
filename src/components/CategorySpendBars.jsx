import { useMemo } from "react";
import { spendingByCategory, formatCurrency } from "../utils/aggregates";

const BAR_COLORS = ["#a855f7", "#fb923c", "#f472b6", "#38bdf8", "#4ade80", "#818cf8"];

export function CategorySpendBars({ transactions }) {
  const rows = useMemo(() => {
    const list = spendingByCategory(transactions).slice(0, 6);
    const max = list.reduce((m, r) => Math.max(m, r.value), 1);
    return list.map((r, i) => ({
      ...r,
      pct: Math.round((r.value / max) * 100),
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));
  }, [transactions]);

  if (rows.length === 0) {
    return (
      <div className="cat-bars cat-bars-empty">
        <p>No expense categories to chart yet.</p>
      </div>
    );
  }

  return (
    <div className="cat-bars" role="img" aria-label="Spending by category">
      <p className="cat-bars-title">Spending mix</p>
      <ul className="cat-bars-list">
        {rows.map((r) => (
          <li key={r.name} className="cat-bar-row">
            <span className="cat-bar-name">{r.name}</span>
            <div className="cat-bar-track">
              <span
                className="cat-bar-fill"
                style={{
                  width: `${r.pct}%`,
                  background: r.color,
                }}
              />
            </div>
            <span className="cat-bar-amt mono">{formatCurrency(r.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
