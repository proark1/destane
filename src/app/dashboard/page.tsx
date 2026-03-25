import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";

const stats = [
  { label: "Total Invested", value: "$420,000", icon: "account_balance", change: "+12.4%" },
  { label: "Portfolio Value", value: "$684,250", icon: "trending_up", change: "+62.9%" },
  { label: "Projected Earnings", value: "$1.2M", icon: "rocket_launch", change: "+18.7%" },
  { label: "Actual Payouts", value: "$58,900", icon: "payments", change: "+8.2%" },
];

const chartData = [
  { month: "Jul", value: 35 },
  { month: "Aug", value: 48 },
  { month: "Sep", value: 42 },
  { month: "Oct", value: 65 },
  { month: "Nov", value: 58 },
  { month: "Dec", value: 72 },
  { month: "Jan", value: 80 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 90 },
];

const ownedTitles = [
  { title: "Neon Horizon", genre: "Sci-Fi Thriller", equity: "2.4%", apy: "14.8%", status: "In Production", image: "https://lh3.googleusercontent.com/aida/AXQ1bvN7_W5bkV8s4rX_CG0WSrJwG_QeBmvDkEl1eAFvdLKTnHd0R4c0XQNPI5SYJCM3xnE_rOYGQcvNy8cKjEfrHpnihAJ=s512" },
  { title: "The Last Aria", genre: "Drama", equity: "1.1%", apy: "11.2%", status: "Post-Production", image: "https://lh3.googleusercontent.com/aida/AXQ1bvOkO5TCMIx_0YISJJ_yCSXPQQkr0RjYVcfjJUZUOPRHXwYEKX0JcwzLx0L1BIy8x2q1vO4jCyP0I1d_ycJ1PL4FMKRM=s512" },
];

const releases = [
  { title: "Neon Horizon", date: "Apr 12, 2026", type: "Theatrical" },
  { title: "The Last Aria", date: "Jun 08, 2026", type: "Streaming" },
  { title: "Crimson Meridian", date: "Sep 21, 2026", type: "Festival" },
];

const activity = [
  { text: "Dividend payout received", amount: "+$1,240", time: "2h ago" },
  { text: "New compliance doc signed", amount: "", time: "1d ago" },
  { text: "Portfolio rebalanced", amount: "", time: "3d ago" },
  { text: "Investment in Neon Horizon", amount: "-$25,000", time: "1w ago" },
];

export default async function DashboardPage() {
  const user = await getSession();
  const displayName = user?.username ?? "Investor";

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

          {/* Chart Section */}
          <div className="glass-panel rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">Revenue Performance</h2>
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">Monthly earnings (thousands)</p>
              </div>
              <div className="flex gap-2">
                {["6M", "1Y", "All"].map((period) => (
                  <button key={period} className={`font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest px-3 py-1 rounded-md ${period === "1Y" ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant/40 hover:text-on-surface-variant"}`}>
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-3 h-40">
              {chartData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-linear-to-t from-primary/60 to-primary" style={{ height: `${d.value}%` }} />
                  <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owned Title Tokens */}
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">Owned Title Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedTitles.map((t) => (
                <div key={t.title} className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="relative h-36 overflow-hidden">
                    <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                      {t.genre}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">{t.title}</h3>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Equity</p>
                        <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-primary mt-0.5">{t.equity}</p>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">APY</p>
                        <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-green-400 mt-0.5">{t.apy}</p>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Status</p>
                        <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant mt-0.5">{t.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              {[
                { label: "KYC Verification", status: "Verified", color: "text-green-400" },
                { label: "Accredited Investor", status: "Approved", color: "text-green-400" },
                { label: "Tax Documents", status: "Pending", color: "text-yellow-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{item.label}</span>
                  <span className={`font-[family-name:var(--font-inter)] text-[10px] font-bold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Releases */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
              Upcoming Releases
            </h3>
            <div className="space-y-4">
              {releases.map((r) => (
                <div key={r.title} className="flex items-start gap-3">
                  <div className="w-1 h-10 rounded-full bg-linear-to-b from-primary to-primary-container shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold tracking-tight">{r.title}</p>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60 mt-0.5">
                      {r.date} &middot; {r.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">history</span>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface">{a.text}</p>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40 mt-0.5">{a.time}</p>
                  </div>
                  {a.amount && (
                    <span className={`font-[family-name:var(--font-plus-jakarta)] text-xs font-bold ${a.amount.startsWith("+") ? "text-green-400" : "text-on-surface-variant"}`}>
                      {a.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
