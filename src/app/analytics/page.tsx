import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";

export default async function AnalyticsPage() {
  const user = await getSession();

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
              Analytics Screen
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

        {/* Revenue Chart */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                Total Revenue
              </p>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight">$3.24M</h3>
              <p className="font-[family-name:var(--font-inter)] text-xs text-primary">+18.2% vs prior period</p>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">Avg. Daily</p>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">$108K</p>
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
            <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">Feb 24</span>
            <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40">Mar 25</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Token Trading Volume */}
          <div className="glass-panel rounded-xl p-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-4">
              Token Trading Volume
            </p>
            <div className="space-y-4">
              {[
                { token: "MDP-X", name: "Midnight Protocol", price: "$12.84", change: "+4.2%", volume: "$1.2M", positive: true },
                { token: "CRM-X", name: "Crimson Meridian", price: "$8.42", change: "+1.8%", volume: "$842K", positive: true },
                { token: "NEX-X", name: "Neon Exodus", price: "$5.10", change: "-2.1%", volume: "$620K", positive: false },
              ].map((t) => (
                <div key={t.token} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">{t.token}</p>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">{t.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-inter)] text-sm font-medium">{t.price}</p>
                    <p className={`font-[family-name:var(--font-inter)] text-[10px] ${t.positive ? "text-primary" : "text-error"}`}>
                      {t.change} &middot; {t.volume}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Liquidity */}
          <div className="glass-panel rounded-xl p-6 flex flex-col">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Market Liquidity
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight text-primary mb-2">$8.4M</h3>
            <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mb-4">Total Pool Depth</p>
            <div className="flex-1 flex flex-col justify-end gap-2">
              {[
                { label: "Buy Orders", pct: 62, color: "bg-primary" },
                { label: "Sell Orders", pct: 38, color: "bg-tertiary" },
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
                <span className="font-[family-name:var(--font-inter)] text-on-surface-variant">Bid-Ask Spread</span>
                <span className="font-[family-name:var(--font-plus-jakarta)] font-bold">0.12%</span>
              </div>
            </div>
          </div>

          {/* Audience Sentiment Heatmap */}
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
              <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold text-primary">87%</p>
              <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">Overall Positive Sentiment</p>
            </div>
          </div>
        </div>

        {/* Asset Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "The Midnight Protocol",
              token: "MDP-X",
              marketCap: "$2.8M",
              holders: "1,242",
              dayVolume: "$420K",
              dayChange: "+4.2%",
              sparkline: [30, 45, 42, 55, 50, 62, 58, 70, 65, 72, 68, 80],
            },
            {
              title: "Crimson Meridian",
              token: "CRM-X",
              marketCap: "$1.6M",
              holders: "864",
              dayVolume: "$280K",
              dayChange: "+1.8%",
              sparkline: [40, 38, 45, 50, 48, 52, 55, 58, 54, 60, 62, 58],
            },
          ].map((asset) => (
            <div key={asset.token} className="glass-panel rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight">{asset.title}</h3>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-wider text-primary">{asset.token}</p>
                </div>
                <span className="font-[family-name:var(--font-inter)] text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {asset.dayChange}
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-16 mb-4">
                {asset.sparkline.map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/30 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-wider text-on-surface-variant/60">Market Cap</p>
                  <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">{asset.marketCap}</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-wider text-on-surface-variant/60">Holders</p>
                  <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">{asset.holders}</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-wider text-on-surface-variant/60">24h Volume</p>
                  <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">{asset.dayVolume}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
