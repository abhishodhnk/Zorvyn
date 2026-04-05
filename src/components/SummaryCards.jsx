import { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import { computeTotals, formatCurrency } from "../utils/aggregates";
import { CategorySpendBars } from "./CategorySpendBars";
import { SavingsRateCard } from "./SavingsRateCard";
import { RoleAccessCard } from "./RoleAccessCard";

export function SummaryCards() {
  const { state } = useDashboard();
  const { totalIncome, totalExpense, balance } = useMemo(
    () => computeTotals(state.transactions),
    [state.transactions]
  );

  return (
    <section
      id="overview"
      className="section section-overview"
      aria-labelledby="summary-heading"
    >
      <div className="overview-split">
        <div className="overview-col overview-col-main">
          <h2 id="summary-heading" className="overview-headline">
            Your money,
            <br />
            at a glance.
          </h2>
          <p className="overview-lede">
            Six-month-style mock data, spending breakdown, and balance
            trajectory — filters, CSV, and roles still work underneath.
          </p>
          <div className="overview-mini-stats">
            <article className="mini-stat">
              <p className="mini-stat-label">Balance</p>
              <p className="mini-stat-value mono stat-lime">
                {formatCurrency(balance)}
              </p>
            </article>
            <article className="mini-stat">
              <p className="mini-stat-label">Income</p>
              <p className="mini-stat-value mono stat-lime">
                {formatCurrency(totalIncome)}
              </p>
            </article>
            <article className="mini-stat">
              <p className="mini-stat-label">Expenses</p>
              <p className="mini-stat-value mono stat-rose">
                {formatCurrency(totalExpense)}
              </p>
            </article>
          </div>
          <CategorySpendBars transactions={state.transactions} />
        </div>
        <div className="overview-col overview-col-side">
          <SavingsRateCard transactions={state.transactions} />
          <RoleAccessCard />
        </div>
      </div>
    </section>
  );
}
