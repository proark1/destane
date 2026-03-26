/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Control | DESTANE" };
import DashboardLayout from "@/components/DashboardLayout";
import AdminActions from "@/components/AdminActions";
import { getSession } from "@/lib/auth";
import { query, initDb } from "@/lib/db";

export default async function AdminPage() {
  const user = await getSession();
  await initDb();

  // Fetch platform stats
  const [usersRes, investmentRes, productionsRes, pendingRes, allProductionsRes] =
    await Promise.all([
      query("SELECT COUNT(*) AS count FROM users"),
      query("SELECT COALESCE(SUM(amount),0) AS total FROM investments"),
      query("SELECT COUNT(*) AS count FROM productions"),
      query("SELECT * FROM productions WHERE status = 'pending' ORDER BY created_at DESC"),
      query("SELECT * FROM productions ORDER BY created_at DESC"),
    ]);

  const totalUsers = parseInt(usersRes.rows[0].count);
  const totalAum = parseFloat(investmentRes.rows[0].total);
  const totalProductions = parseInt(productionsRes.rows[0].count);
  const pendingProductions = pendingRes.rows;
  const allProductions = allProductionsRes.rows;

  const kpis = [
    {
      label: "Total Platform AUM",
      value: `$${(totalAum / 1_000_000).toFixed(1)}M`,
      icon: "account_balance",
    },
    {
      label: "Active Users",
      value: totalUsers.toLocaleString(),
      icon: "groups",
    },
    {
      label: "Total Productions",
      value: totalProductions.toString(),
      icon: "movie",
    },
    {
      label: "Pending Approvals",
      value: pendingProductions.length.toString(),
      icon: "pending_actions",
    },
  ];

  const tabs = [
    { label: "Approval Queue", active: true },
    { label: "User Verification", active: false },
    { label: "Token Manager", active: false },
    { label: "Platform Config", active: false },
  ];

  const revenueDistribution = [
    { label: "Box Office", pct: 42, color: "bg-primary" },
    { label: "Streaming", pct: 28, color: "bg-tertiary" },
    { label: "Licensing", pct: 18, color: "bg-primary/60" },
    { label: "Merchandise", pct: 12, color: "bg-primary/30" },
  ];

  const complianceAlerts = [
    { title: "KYC Expiration Warning", description: "14 investor profiles require re-verification within 30 days", severity: "warning", time: "2h ago" },
    { title: "Token Issuance Limit", description: "CRM-X approaching maximum token supply cap (92% issued)", severity: "error", time: "5h ago" },
    { title: "Regulatory Filing Due", description: "Q1 2026 SEC Form D amendment due by April 15", severity: "info", time: "1d ago" },
  ];

  function formatCurrency(val: number) {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary">
                System Administration
              </p>
              <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-[10px] font-[family-name:var(--font-inter)] font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                All Systems Operational
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              Admin Control
            </h1>
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
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                tab.active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-on-surface-variant/40 border border-outline-variant/10 hover:border-outline-variant/30 hover:text-on-surface-variant"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Approval Queue Table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">Approval Queue</h3>
            <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-1">
              {pendingProductions.length} submission{pendingProductions.length !== 1 ? "s" : ""} awaiting review
            </p>
          </div>
          {pendingProductions.length === 0 ? (
            <div className="px-6 pb-6">
              <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60">No pending submissions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-outline-variant/10">
                    <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Project</th>
                    <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Funding Goal</th>
                    <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Genre</th>
                    <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Status</th>
                    <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-right px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProductions.map((item) => (
                    <tr key={item.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container-highest rounded overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <img src="/images/ui/film-reel.svg" alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-[family-name:var(--font-plus-jakarta)] font-bold">{item.title}</p>
                            <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">Dir. {item.director || "TBD"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-[family-name:var(--font-inter)] font-medium">
                        {formatCurrency(parseFloat(item.funding_goal))}
                      </td>
                      <td className="px-6 py-4 font-[family-name:var(--font-inter)] text-on-surface-variant text-xs">{item.genre || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <AdminActions productionId={item.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Productions Table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">All Productions</h3>
            <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-1">
              {allProductions.length} total production{allProductions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-outline-variant/10">
                  <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Title</th>
                  <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Genre</th>
                  <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Funding Goal</th>
                  <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Raised</th>
                  <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Status</th>
                  <th className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 text-left px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {allProductions.map((p) => {
                  const statusColor =
                    p.status === "funding" ? "bg-primary/10 text-primary" :
                    p.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    p.status === "rejected" ? "bg-red-500/10 text-red-400" :
                    p.status === "production" ? "bg-tertiary/10 text-tertiary" :
                    "bg-surface-container-highest/50 text-on-surface-variant";
                  return (
                    <tr key={p.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-[family-name:var(--font-plus-jakarta)] font-bold">{p.title}</p>
                        <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">Dir. {p.director || "TBD"}</p>
                      </td>
                      <td className="px-6 py-4 font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{p.genre || "N/A"}</td>
                      <td className="px-6 py-4 font-[family-name:var(--font-inter)] font-medium">{formatCurrency(parseFloat(p.funding_goal))}</td>
                      <td className="px-6 py-4 font-[family-name:var(--font-inter)] font-medium">{formatCurrency(parseFloat(p.funding_raised))}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                        {new Date(p.created_at).toLocaleDateString()}
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
          {/* Revenue Distribution */}
          <div className="glass-panel rounded-xl p-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Platform Analytics
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-6">
              Revenue Distribution
            </h3>
            <div className="space-y-4">
              {revenueDistribution.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{item.label}</span>
                    <span className="font-[family-name:var(--font-inter)] text-xs font-bold">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex justify-between text-xs">
              <span className="font-[family-name:var(--font-inter)] text-on-surface-variant">Total AUM</span>
              <span className="font-[family-name:var(--font-plus-jakarta)] font-bold text-primary">
                {formatCurrency(totalAum)}
              </span>
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="glass-panel rounded-xl p-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Regulatory
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
              Compliance Alerts
            </h3>
            <div className="space-y-4">
              {complianceAlerts.map((alert, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-outline-variant/10 last:border-0">
                  <span className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${
                    alert.severity === "error" ? "text-error" :
                    alert.severity === "warning" ? "text-yellow-400" :
                    "text-primary"
                  }`}>
                    {alert.severity === "error" ? "error" : alert.severity === "warning" ? "warning" : "info"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold truncate">{alert.title}</p>
                      <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/50 shrink-0">{alert.time}</span>
                    </div>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-0.5">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
