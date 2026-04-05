import { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import {
  computeTotals,
  formatCurrency,
  lastBalanceTrendDeltaPercent,
} from "../utils/aggregates";

export function HeroLanding() {
  const { state } = useDashboard();
  const { balance, totalIncome, totalExpense } = useMemo(
    () => computeTotals(state.transactions),
    [state.transactions]
  );
  const balStr = formatCurrency(balance);
  const delta = useMemo(
    () => lastBalanceTrendDeltaPercent(state.transactions),
    [state.transactions]
  );

  return (
    <section className="hero-landing" aria-labelledby="hero-heading">
      <div className="hero-grid hero-grid-fintrack">
        <div className="hero-copy">
          <p className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Personal finance dashboard
          </p>
          <h2 id="hero-heading" className="hero-display">
            <span className="hero-outline">Know your</span>
            <span className="hero-solid">Money</span>
          </h2>
          <p className="hero-body">
            Track income, expenses, and spending patterns. Role-based access,
            quick insights, and clean tables — all client-side mock data for
            the Zorvyn assignment.
          </p>
          <div className="hero-actions">
            <a className="btn btn-lime hero-cta" href="#overview">
              Open dashboard →
            </a>
            <a className="btn btn-outline hero-cta-secondary" href="#viz">
              Explore features
            </a>
          </div>
        </div>
        <aside className="hero-preview" aria-label="Dashboard preview">
          <p className="hero-preview-label">Total balance</p>
          <p className="hero-preview-balance mono">{balStr}</p>
          {delta != null && (
            <p
              className={`hero-preview-trend ${delta >= 0 ? "is-up" : "is-down"}`}
            >
              {delta >= 0 ? "↑" : "↓"}{" "}
              {delta >= 0 ? "+" : ""}
              {Math.abs(delta)}% vs prior month in data
            </p>
          )}
          <div className="hero-preview-cards">
            <div className="hero-preview-card">
              <p className="hero-preview-card-label">Monthly income</p>
              <p className="hero-preview-card-val mono stat-lime">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="hero-preview-card">
              <p className="hero-preview-card-label">Expenses</p>
              <p className="hero-preview-card-val stat-rose mono">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
