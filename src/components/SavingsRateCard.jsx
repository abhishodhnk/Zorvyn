import { insightsFromTransactions } from "../utils/aggregates";

export function SavingsRateCard({ transactions }) {
  const { savingsRate } = insightsFromTransactions(transactions);
  const pct =
    savingsRate != null ? Math.min(100, Math.max(0, savingsRate)) : 0;

  return (
    <article className="savings-hero" aria-labelledby="savings-heading">
      <p id="savings-heading" className="savings-hero-kicker">
        Savings rate
      </p>
      <p className="savings-hero-value">
        {savingsRate != null ? `${savingsRate}%` : "—"}
      </p>
      <p className="savings-hero-copy">
        Of income not spent (all-time mock). Above 20% is a solid habit.
      </p>
      <div
        className="savings-ring"
        style={{ "--savings-pct": String(pct) }}
        role="img"
        aria-label={
          savingsRate != null
            ? `Savings ring ${savingsRate} percent`
            : "Savings ring no data"
        }
      >
        <div className="savings-ring-hole" />
      </div>
    </article>
  );
}
