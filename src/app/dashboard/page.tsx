export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard | DESTANE" };
import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";
import { query, initDb } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  await initDb();
  const user = await getSession();
  const displayName = user?.username ?? "Investor";

  // Fetch portfolio stats
  const statsResult = user
    ? await query(
        "SELECT COALESCE(SUM(amount),0) as total_invested, COUNT(*) as positions FROM investments WHERE user_id = $1",
        [user.id]
      )
    : null;

  const totalInvested = parseFloat(statsResult?.rows[0]?.total_invested ?? "0");
  const positions = parseInt(statsResult?.rows[0]?.positions ?? "0");

  // Fetch user investments with production details
  const investmentsResult = user
    ? await query(
        `SELECT i.*, p.title, p.genre, p.status as production_status, p.projected_roi, p.image_url
         FROM investments i
         JOIN productions p ON i.production_id = p.id
         WHERE i.user_id = $1
         ORDER BY i.invested_at DESC`,
        [user.id]
      )
    : null;

  const investments = investmentsResult?.rows ?? [];

  // Calculate portfolio value and projected earnings
  const portfolioValue = investments.reduce((sum: number, inv: { amount: string; projected_roi: string }) => {
    const amount = parseFloat(inv.amount);
    const roi = parseFloat(inv.projected_roi) / 100;
    return sum + amount * (1 + roi);
  }, 0);

  const projectedEarnings = investments.reduce((sum: number, inv: { amount: string; projected_roi: string }) => {
    const amount = parseFloat(inv.amount);
    const roi = parseFloat(inv.projected_roi) / 100;
    return sum + amount * roi;
  }, 0);

  // Fetch activity
  const activityResult = user
    ? await query(
        "SELECT * FROM activity_log WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
        [user.id]
      )
    : null;

  const activityRows = activityResult?.rows ?? [];

  const portfolioChange = totalInvested > 0 ? (((portfolioValue - totalInvested) / totalInvested) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, icon: "account_balance", change: `${positions} positions` },
    { label: "Portfolio Value", value: `$${Math.round(portfolioValue).toLocaleString()}`, icon: "trending_up", change: `+${portfolioChange}%` },
    { label: "Projected Earnings", value: `$${Math.round(projectedEarnings).toLocaleString()}`, icon: "rocket_launch", change: positions > 0 ? `${positions} titles` : "—" },
    { label: "Positions", value: String(positions), icon: "payments", change: positions > 0 ? "Active" : "None" },
  ];

  function timeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w ago`;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
              Institutional Dashboard
            </p>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              Portfolio Overview
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mt-2">
              Welcome back, <span className="text-primary font-bold">{displayName}</span>
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="glass-panel rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
                  <span className="font-[family-name:var(--font-inter)] text-[10px] text-green-400 font-bold">{s.change}</span>
                </div>
                <p className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight">{s.value}</p>
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Investment Timeline */}
          <div className="glass-panel rounded-xl p-8 mb-8">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">Investment Timeline</h3>
            {investments.length > 0 ? (
              <div className="space-y-4">
                {investments.map((inv: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-outline-variant/10 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">payments</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{inv.title}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(inv.invested_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-bold text-primary">${parseFloat(inv.amount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm">Your investment timeline will appear here after your first investment.</p>
            )}
          </div>

          {/* Owned Title Tokens */}
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">Owned Title Tokens</h2>
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((inv: { id: number; title: string; genre: string; image_url: string; equity_pct: string; projected_roi: string; production_status: string; amount: string }) => (
                  <div key={inv.id} className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="relative h-36 overflow-hidden">
                      {inv.image_url ? (
                        <img src={inv.image_url} alt={inv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">movie</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                        {inv.genre}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">{inv.title}</h3>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Equity</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-primary mt-0.5">{parseFloat(inv.equity_pct).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Proj. ROI</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-green-400 mt-0.5">{parseFloat(inv.projected_roi).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Status</p>
                          <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant mt-0.5 capitalize">{inv.production_status}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Invested</p>
                        <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">${parseFloat(inv.amount).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-10 text-center">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl mb-4 block">movie</span>
                <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-2">No investments yet</p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60 mb-6">
                  Start building your portfolio by exploring curated film productions.
                </p>
                <Link
                  href="/explore"
                  className="inline-block bg-primary text-on-primary font-[family-name:var(--font-plus-jakarta)] font-bold px-6 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
                >
                  Explore Titles
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6">
          {/* Compliance & Identity */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
              Compliance &amp; Identity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">KYC Verification</span>
                <Link href="/settings" className="font-[family-name:var(--font-inter)] text-[10px] font-bold text-yellow-400 hover:underline">Not Started — Begin Verification</Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">Accredited Investor</span>
                <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold text-yellow-400">Pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">Tax Documents</span>
                <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold text-yellow-400">Pending</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">history</span>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activityRows.length > 0 ? (
                activityRows.map((a: { id: number; message: string; type: string; created_at: string }, i: number) => (
                  <div key={a.id ?? i} className="flex items-center justify-between py-1.5 border-b border-outline-variant/10 last:border-0">
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface">{a.message}</p>
                      <p className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40 mt-0.5">{timeAgo(a.created_at)}</p>
                    </div>
                    <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/40 bg-surface-container-highest px-2 py-0.5 rounded">
                      {a.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant/40 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
