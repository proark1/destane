/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
export const metadata = { title: "Producer Portal | DESTANE" };
import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";
import { query, initDb } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProducerPage() {
  await initDb();
  const user = await getSession();
  if (!user) redirect("/login");

  // Fetch productions created by this user
  const prodResult = await query(
    "SELECT * FROM productions WHERE created_by = $1 ORDER BY created_at DESC",
    [user.id]
  );
  const productions = prodResult.rows;

  // Fetch aggregate investment stats for all user productions
  const productionIds = productions.map((p: { id: number }) => p.id);

  let totalRaised = 0;
  let totalGoal = 0;
  let totalInvestors = 0;
  const investmentsByProd: Record<number, { raised: number; investors: number }> = {};

  if (productionIds.length > 0) {
    const statsResult = await query(
      `SELECT
        production_id,
        COALESCE(SUM(amount), 0) as total_invested,
        COUNT(DISTINCT user_id) as investor_count
      FROM investments
      WHERE production_id = ANY($1)
      GROUP BY production_id`,
      [productionIds]
    );

    for (const row of statsResult.rows) {
      investmentsByProd[row.production_id] = {
        raised: parseFloat(row.total_invested),
        investors: parseInt(row.investor_count),
      };
    }

    for (const p of productions) {
      const fundingRaised = parseFloat(p.funding_raised);
      const fundingGoal = parseFloat(p.funding_goal);
      totalRaised += fundingRaised;
      totalGoal += fundingGoal;
      totalInvestors += investmentsByProd[p.id]?.investors || 0;
    }
  }

  const overallPct = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0;

  // Recent investments across all producer's productions
  interface ActivityItem {
    action: string;
    investor: string;
    amount: string;
    time: string;
  }
  let recentActivity: ActivityItem[] = [];
  if (productionIds.length > 0) {
    const recentResult = await query(
      `SELECT i.amount, i.invested_at, u.username, p.title
       FROM investments i
       JOIN users u ON u.id = i.user_id
       JOIN productions p ON p.id = i.production_id
       WHERE i.production_id = ANY($1)
       ORDER BY i.invested_at DESC
       LIMIT 5`,
      [productionIds]
    );
    recentActivity = recentResult.rows.map((r: { title: string; username: string; amount: string; invested_at: string }) => {
      const ago = getTimeAgo(new Date(r.invested_at));
      return {
        action: `Investment in ${r.title}`,
        investor: r.username,
        amount: `$${parseFloat(r.amount).toLocaleString()}`,
        time: ago,
      };
    });
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
              Executive Overview
            </p>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              Producer Portal
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="border border-outline-variant/30 text-on-surface font-[family-name:var(--font-inter)] text-xs font-medium px-5 py-2.5 rounded-md hover:border-primary/40 transition-colors">
              Export Report
            </button>
            <Link href="/producer/new" className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-5 py-2.5 rounded-md shadow-lg shadow-primary/20 no-underline">
              Submit New Title
            </Link>
          </div>
        </div>

        {productions.length === 0 ? (
          /* Empty State */
          <div className="glass-panel rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant/20 text-6xl mb-4 block">movie_creation</span>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mb-2">
              No Productions Yet
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant max-w-md mx-auto mb-6">
              You haven&apos;t created any productions yet. Submit your first title to start raising funds from the DESTANE investor community.
            </p>
            <button className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-6 py-3 rounded-md shadow-lg shadow-primary/20">
              Submit Your First Title
            </button>
          </div>
        ) : (
          <>
            {/* Summary Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aggregate Funding */}
              <div className="glass-panel rounded-xl p-6 md:col-span-2">
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                  Total Funding Across All Productions
                </p>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
                  {productions.length} Active Production{productions.length !== 1 ? "s" : ""}
                </h3>
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold text-primary">
                    ${totalRaised >= 1_000_000 ? `${(totalRaised / 1_000_000).toFixed(1)}M` : `${(totalRaised / 1_000).toFixed(0)}K`}
                  </span>
                  <span className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mb-1">
                    of ${totalGoal >= 1_000_000 ? `${(totalGoal / 1_000_000).toFixed(1)}M` : `${(totalGoal / 1_000).toFixed(0)}K`} goal
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-linear-to-r from-primary to-primary-container rounded-full" style={{ width: `${Math.min(overallPct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>{overallPct.toFixed(0)}% funded</span>
                  <span>{totalInvestors} investor{totalInvestors !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                  Total Investors
                </p>
                <div>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-4xl font-extrabold text-primary">{totalInvestors.toLocaleString()}</span>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-1">Across all productions</p>
                </div>
                <div className="flex items-end gap-1 h-16 mt-4">
                  {productions.map((p: { funding_goal: string; funding_raised: string }, i: number) => {
                    const pct = parseFloat(p.funding_goal) > 0 ? (parseFloat(p.funding_raised) / parseFloat(p.funding_goal)) * 100 : 0;
                    return <div key={i} className="flex-1 bg-primary/20 rounded-sm" style={{ height: `${Math.max(pct, 5)}%` }} />;
                  })}
                </div>
              </div>
            </div>

            {/* Active Portfolio Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-6 pb-4">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">Active Portfolio</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-outline-variant/10">
                      <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Title</th>
                      <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Genre</th>
                      <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Status</th>
                      <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-right px-6 py-3">Raised</th>
                      <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-right px-6 py-3">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productions.map((p: { id: number; title: string; genre: string; status: string; funding_raised: string; projected_roi: string }) => {
                      const raised = parseFloat(p.funding_raised);
                      const roi = parseFloat(p.projected_roi);
                      const statusColors: Record<string, string> = {
                        funding: "bg-primary/10 text-primary",
                        production: "bg-tertiary/10 text-tertiary",
                        completed: "bg-green-500/10 text-green-400",
                        pending: "bg-yellow-500/10 text-yellow-400",
                      };
                      const statusClass = statusColors[p.status] || "bg-surface-container-highest/50 text-on-surface-variant";
                      return (
                        <tr key={p.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-4">
                            <Link href={`/invest/${p.id}`} className="font-[family-name:var(--font-plus-jakarta)] font-bold hover:text-primary transition-colors">
                              {p.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant">{p.genre}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${statusClass}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            ${raised >= 1_000_000 ? `${(raised / 1_000_000).toFixed(1)}M` : `${(raised / 1_000).toFixed(0)}K`}
                          </td>
                          <td className="px-6 py-4 text-right text-primary font-bold">
                            {p.status === "funding" ? "--" : `+${roi}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Global Interest Heatmap */}
              <div className="glass-panel rounded-xl p-6">
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                  Global Interest
                </p>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
                  Audience Heatmap
                </h3>
                <div className="aspect-[16/9] bg-surface-container-highest/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <img src="/images/ui/world-map.svg" alt="Global Interest Map" className="w-full h-full object-contain opacity-40" />
                </div>
                <div className="flex gap-4 mt-4">
                  {[{ region: "North America", pct: "42%" }, { region: "Europe", pct: "31%" }, { region: "Asia-Pacific", pct: "19%" }].map((r) => (
                    <div key={r.region} className="text-center flex-1">
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-primary">{r.pct}</p>
                      <p className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/60 uppercase tracking-wider">{r.region}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investor Relations */}
              <div className="glass-panel rounded-xl p-6">
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                  Investor Relations
                </p>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/50 py-4 text-center">No recent investment activity</p>
                  ) : (
                    recentActivity.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-sm font-medium">{item.action}</p>
                          <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{item.investor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-primary">{item.amount}</p>
                          <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/50">{item.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}
