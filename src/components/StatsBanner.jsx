import { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import {
  insightsFromTransactions,
  uniqueMonthKeysCount,
  uniqueExpenseCategoriesCount,
} from "../utils/aggregates";

export function StatsBanner() {
  const { state } = useDashboard();
  const stats = useMemo(() => {
    const months = uniqueMonthKeysCount(state.transactions);
    const cats = uniqueExpenseCategoriesCount(state.transactions);
    const { savingsRate } = insightsFromTransactions(state.transactions);
    return {
      months: months || 0,
      cats: cats || 0,
      savings: savingsRate != null ? `${savingsRate}%` : "—",
    };
  }, [state.transactions]);

  return (
    <section className="stats-banner" aria-label="At a glance metrics">
      <div className="stats-banner-inner">
        <div className="stats-banner-item">
          <span className="stats-banner-value">{stats.months}</span>
          <span className="stats-banner-label">Months of data</span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-value">{stats.cats}</span>
          <span className="stats-banner-label">Spending categories</span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-value">{stats.savings}</span>
          <span className="stats-banner-label">Savings rate</span>
        </div>
        <div className="stats-banner-item">
          <span className="stats-banner-value">100%</span>
          <span className="stats-banner-label">Client-side · no backend</span>
        </div>
      </div>
    </section>
  );
}
