import { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import {
  insightsFromTransactions,
  formatCurrency,
} from "../utils/aggregates";

export function InsightsPanel() {
  const { state } = useDashboard();
  const insights = useMemo(
    () => insightsFromTransactions(state.transactions),
    [state.transactions]
  );

  const { highest, monthCompare, savingsRate } = insights;

  return (
    <section id="signals" className="section" aria-labelledby="insights-heading">
      <div className="section-intro">
        <p className="section-tag">Insights</p>
        <h2 id="insights-heading" className="mega-section-title">
          Signals
        </h2>
        <p className="section-lede">
          Quick reads from the mock set — category leaders, month compare,
          savings rate.
        </p>
      </div>
      <ul className="insight-list">
        <li className="insight-card">
          <span className="insight-badge">Category</span>
          {highest ? (
            <>
              <p className="insight-main">
                Highest spending: <strong>{highest.name}</strong>
              </p>
              <p className="insight-detail">
                {formatCurrency(highest.value)} total across expenses
              </p>
            </>
          ) : (
            <p className="insight-main">No expense categories yet.</p>
          )}
        </li>
        <li className="insight-card">
          <span className="insight-badge">Month over month</span>
          {monthCompare ? (
            <>
              <p className="insight-main">
                {monthCompare.fallbackLabel ? (
                  <>
                    Expense trend ({monthCompare.fallbackLabel}):{" "}
                    <strong>{formatCurrency(monthCompare.thisM)}</strong>
                  </>
                ) : (
                  <>
                    This month&apos;s expenses:{" "}
                    <strong>{formatCurrency(monthCompare.thisM)}</strong>
                  </>
                )}
              </p>
              <p className="insight-detail">
                {!monthCompare.fallbackLabel && monthCompare.lastM > 0 ? (
                  <>
                    vs last month {formatCurrency(monthCompare.lastM)}
                    {monthCompare.pct !== null && (
                      <>
                        {" "}
                        (
                        {monthCompare.pct > 0 ? "+" : ""}
                        {monthCompare.pct}%)
                      </>
                    )}
                  </>
                ) : monthCompare.fallbackLabel && monthCompare.lastM > 0 ? (
                  <>
                    Previous period {formatCurrency(monthCompare.lastM)}
                    {monthCompare.pct !== null && (
                      <>
                        {" "}
                        (
                        {monthCompare.pct > 0 ? "+" : ""}
                        {monthCompare.pct}%)
                      </>
                    )}
                  </>
                ) : (
                  <>Snapshot from mock data when calendar months have no match.</>
                )}
              </p>
            </>
          ) : (
            <p className="insight-main">
              Add expenses with dates to see monthly comparison.
            </p>
          )}
        </li>
        <li className="insight-card">
          <span className="insight-badge">Savings rate</span>
          {savingsRate !== null ? (
            <>
              <p className="insight-main">
                Net savings rate: <strong>{savingsRate}%</strong>
              </p>
              <p className="insight-detail">
                Portion of income not spent (all-time, mock data).
              </p>
            </>
          ) : (
            <p className="insight-main">No income recorded to compute rate.</p>
          )}
        </li>
      </ul>
    </section>
  );
}
