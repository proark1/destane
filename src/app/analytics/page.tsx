/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";
import { query, initDb } from "@/lib/db";

export default async function AnalyticsPage() {
  const user = await getSession();
  await initDb();

  // Fetch aggregate stats from DB
  const [revenueRes, investmentRes, topProductionsRes, recentInvestmentsRes] =
    await Promise.all([
      query("SELECT COALESCE(SUM(funding_raised),0) AS total FROM productions"),
      query("SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM investments"),
      query("SELECT * FROM productions ORDER BY funding_raised DESC LIMIT 5"),
      query(
        `SELECT i.*, p.title FROM investments i JOIN productions p ON i.production_id = p.id ORDER BY i.invested_at DESC LIMIT 5`
      ),
    ]);

  const totalRevenue = parseFloat(revenueRes.rows[0].total);
  const totalInvested = parseFloat(investmentRes.rows[0].total);
  const investmentCount = parseInt(investmentRes.rows[0].count);
  const topProductions = topProductionsRes.rows;
  const recentInvestments = recentInvestmentsRes.rows;

  function formatCurrency(val: number) {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  }

  const kpis = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: "payments",
      sub: "All-time funding raised",
    },
    {
      label: "Total Invested",
      value: formatCurrency(totalInvested),
      icon: "account_balance_wallet",
      sub: `${investmentCount.toLocaleString()} investments`,
    },
    {
      label: "Top Productions",
      value: topProductions.length.toString(),
      icon: "trending_up",
      sub: "By funding raised",
    },
    {
      label: "Recent Investments",
      value: recentInvestments.length.toString(),
      icon: "receipt_long",
      sub: "Latest transactions",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
              Performance Portal
            </p>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              Analytics
            </h1>
          </div>
          <div className="flex gap-1 bg-surface-container-highest/50 rounded-lg p-1">
            {["7D", "30D", "1Y"].map((period) => (
              <button
                key={period}
                className={`font-[family-name:var(--font-inter)] text-xs font-medium px-4 py-2 rounded-md transition-colors ${
                  period === "30D"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-primary text-xl">{k.icon}</span>
              </div>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight">{k.value}</p>
              <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">{k.label}</p>
              <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/40 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart (visual placeholder with real summary) */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                Total Revenue
              </p>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight">
                {formatCurrency(totalRevenue)}
              </h3>
              <p className="font-[family-name:var(--font-inter)] text-xs text-primary">
                {investmentCount.toLocaleString()} total investments
              </p>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">Avg. Investment</p>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
                {investmentCount > 0 ? formatCurrency(totalInvested / investmentCount) : "$0"}
              </p>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {[45, 62, 38, 70, 55, 80, 72, 90, 65, 85, 78, 92, 60, 88, 95, 70, 82, 75, 98, 68, 84, 90, 76, 88, 94, 72, 86, 80, 92, 78].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-linear-to-t from-primary to-primary-container/60 rounded-sm hover:from-primary hover:to-primary transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">Placeholder chart</span>
            <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">Real totals above</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Productions by Funding */}
          <div className="glass-panel rounded-xl p-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Leaderboard
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
              Top Productions by Funding
            </h3>
            {topProductions.length === 0 ? (
              <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60">No productions yet.</p>
            ) : (
              <div className="space-y-3">
                {topProductions.map((p: Record<string, string | number>, idx: number) => {
                  const raised = parseFloat(p.funding_raised as string) || 0;
                  const goal = parseFloat(p.funding_goal as string) || 1;
                  const pct = Math.min(Math.round((raised / goal) * 100), 100);
                  return (
                    <div key={p.id} className="flex items-center gap-3 py-3 border-b border-outline-variant/10 last:border-0">
                      <span className="font-[family-name:var(--font-plus-jakarta)] text-xs font-bold text-on-surface-variant/40 w-5 text-center">
                        {idx + 1}
                      </span>
                      <div className="w-8 h-8 bg-surface-container-highest rounded overflow-hidden flex-shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url as string} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <img src="/images/ui/film-reel.svg" alt="" className="w-full h-full object-cover opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold truncate">{p.title}</p>
                          <span className="font-[family-name:var(--font-inter)] text-xs font-bold text-primary shrink-0">
                            {formatCurrency(raised)}
                          </span>
                        </div>
                        <div className="mt-1.5 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-primary to-primary-container rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/50">
                            Goal: {formatCurrency(goal)}
                          </span>
                          <span className="font-[family-name:var(--font-inter)] text-[9px] text-primary font-bold">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Investments */}
          <div className="glass-panel rounded-xl p-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Activity
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
              Recent Investments
            </h3>
            {recentInvestments.length === 0 ? (
              <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60">No investments yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInvestments.map((inv: Record<string, string | number>) => {
                  const amount = parseFloat(inv.amount as string) || 0;
                  const date = inv.invested_at
                    ? new Date(inv.invested_at as string).toLocaleDateString()
                    : "N/A";
                  return (
                    <div key={inv.id} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-primary/20 to-tertiary/20 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-sm">arrow_upward</span>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">{inv.title}</p>
                          <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">{date}</p>
                        </div>
                      </div>
                      <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-primary">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between text-xs">
              <span className="font-[family-name:var(--font-inter)] text-on-surface-variant">Total Invested</span>
              <span className="font-[family-name:var(--font-plus-jakarta)] font-bold text-primary">
                {formatCurrency(totalInvested)}
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap & Liquidity Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Liquidity Placeholder */}
          <div className="glass-panel rounded-xl p-6 flex flex-col">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Market Liquidity
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight text-primary mb-2">
              {formatCurrency(totalInvested)}
            </h3>
            <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mb-4">Total Invested Capital</p>
            <div className="flex-1 flex flex-col justify-end gap-2">
              {[
                { label: "Funding Raised", pct: totalRevenue > 0 ? Math.min(Math.round((totalRevenue / (totalRevenue + totalInvested || 1)) * 100), 100) : 50, color: "bg-primary" },
                { label: "Direct Investment", pct: totalInvested > 0 ? Math.min(Math.round((totalInvested / (totalRevenue + totalInvested || 1)) * 100), 100) : 50, color: "bg-tertiary" },
              ].map((order) => (
                <div key={order.label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">{order.label}</span>
                    <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold">{order.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${order.color} rounded-full`} style={{ width: `${order.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant/10">
              <div className="flex justify-between text-xs">
                <span className="font-[family-name:var(--font-inter)] text-on-surface-variant">Total Transactions</span>
                <span className="font-[family-name:var(--font-plus-jakarta)] font-bold">{investmentCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Audience Sentiment Heatmap Placeholder */}
          <div className="glass-panel rounded-xl p-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-4">
              Audience Sentiment Heatmap
            </p>
            <div className="grid grid-cols-7 gap-1">
              {[
                0.9,0.7,0.5,0.8,0.6,0.4,0.7,
                0.6,0.8,0.9,0.5,0.7,0.8,0.6,
                0.4,0.6,0.7,0.9,0.8,0.5,0.9,
                0.8,0.5,0.6,0.7,0.9,0.7,0.4,
                0.7,0.9,0.8,0.6,0.5,0.8,0.7,
              ].map((intensity, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-primary"
                  style={{ opacity: intensity }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">Low</span>
              <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">High</span>
            </div>
            <div className="mt-3 pt-3 border-t border-outline-variant/10 text-center">
              <div className="flex items-center justify-center gap-2">
                <img src="/images/ui/shield-verified.svg" alt="Verified" className="w-4 h-4 opacity-60" />
                <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold text-primary">
                  {topProductions.length > 0 ? `${topProductions.length}` : "0"} Active
                </p>
              </div>
              <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">Top Funded Productions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
