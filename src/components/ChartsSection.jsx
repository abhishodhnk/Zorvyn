import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useDashboard } from "../context/DashboardContext";
import {
  balanceTrendByMonth,
  spendingByCategory,
  formatCurrency,
} from "../utils/aggregates";

const PIE_COLORS = [
  "#a855f7",
  "#fb923c",
  "#f472b6",
  "#38bdf8",
  "#4ade80",
  "#818cf8",
  "#facc15",
  "#94a3b8",
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey}>
          {p.name}: {formatCurrency(Number(p.value))}
        </p>
      ))}
    </div>
  );
}

export function ChartsSection() {
  const { state } = useDashboard();
  const trend = useMemo(
    () => balanceTrendByMonth(state.transactions),
    [state.transactions]
  );
  const pieData = useMemo(
    () => spendingByCategory(state.transactions),
    [state.transactions]
  );

  const emptyTrend = trend.length === 0;
  const emptyPie = pieData.length === 0;

  return (
    <section id="viz" className="section section-charts" aria-labelledby="charts-heading">
      <div className="charts-feature-head">
        <p className="section-tag">Features</p>
        <h2 id="charts-heading" className="mega-section-title">
          Trends &amp; breakdown
        </h2>
        <p className="section-lede charts-feature-lede">
          Balance over time plus category split — same data as the bars above,
          different lens.
        </p>
      </div>
      <div className="card-grid card-grid-2 charts-row">
        <article className="panel chart-panel">
          <h3 className="panel-title">Balance trend</h3>
          <p className="panel-desc">
            Cumulative net balance at the end of each month (time-based).
          </p>
          {emptyTrend ? (
            <p className="empty-inline">Not enough data for a trend yet.</p>
          ) : (
            <div className="chart-wrap" role="img" aria-label="Balance trend chart">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={trend}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dfff1f" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#dfff1f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                    }
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Balance"
                    stroke="#dfff1f"
                    strokeWidth={2}
                    fill="url(#balFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
        <article className="panel chart-panel">
          <h3 className="panel-title">Spending by category</h3>
          <p className="panel-desc">
            Expense breakdown — categorical view.
          </p>
          {emptyPie ? (
            <p className="empty-inline">No expenses to chart.</p>
          ) : (
            <div className="chart-wrap" role="img" aria-label="Spending pie chart">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={84}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={pieData[i].name}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
