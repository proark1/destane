/* eslint-disable @next/next/no-img-element */
import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";

export default async function ProducerPage() {
  const user = await getSession();

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
            <button className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-5 py-2.5 rounded-md shadow-lg shadow-primary/20">
              Submit New Title
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Project Funding */}
          <div className="glass-panel rounded-xl p-6 md:col-span-2">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Active Project Funding
            </p>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-4">
              The Midnight Protocol
            </h3>
            <div className="flex items-end gap-3 mb-3">
              <span className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold text-primary">$4.2M</span>
              <span className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mb-1">of $6M goal</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-2">
              <div className="h-full bg-linear-to-r from-primary to-primary-container rounded-full" style={{ width: "72%" }} />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>72% funded</span>
              <span>18 days remaining</span>
            </div>
          </div>

          {/* Audience Reach */}
          <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Audience Reach
            </p>
            <div>
              <span className="font-[family-name:var(--font-plus-jakarta)] text-4xl font-extrabold text-primary">84.2K</span>
              <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-1">+12.4% vs last month</p>
            </div>
            <div className="flex items-end gap-1 h-16 mt-4">
              {[35, 50, 42, 60, 55, 72, 68, 80, 74, 90, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="glass-panel rounded-xl p-6 md:col-span-3">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-4">
              Monthly Revenue Distribution
            </p>
            <div className="flex items-end gap-2 h-32">
              {[
                { label: "Jan", h: 40 }, { label: "Feb", h: 55 }, { label: "Mar", h: 48 },
                { label: "Apr", h: 70 }, { label: "May", h: 65 }, { label: "Jun", h: 80 },
                { label: "Jul", h: 58 }, { label: "Aug", h: 90 }, { label: "Sep", h: 75 },
                { label: "Oct", h: 85 }, { label: "Nov", h: 92 }, { label: "Dec", h: 60 },
              ].map((bar) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-linear-to-t from-primary to-primary-container rounded-sm" style={{ height: `${bar.h}%` }} />
                  <span className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/50">{bar.label}</span>
                </div>
              ))}
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
                <tr className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 font-[family-name:var(--font-plus-jakarta)] font-bold">The Midnight Protocol</td>
                  <td className="px-6 py-4 text-on-surface-variant">Sci-Fi Thriller</td>
                  <td className="px-6 py-4"><span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">Funding</span></td>
                  <td className="px-6 py-4 text-right font-medium">$4.2M</td>
                  <td className="px-6 py-4 text-right text-primary font-bold">--</td>
                </tr>
                <tr className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 font-[family-name:var(--font-plus-jakarta)] font-bold">Crimson Meridian</td>
                  <td className="px-6 py-4 text-on-surface-variant">Drama</td>
                  <td className="px-6 py-4"><span className="text-[10px] uppercase tracking-wider bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-md">Production</span></td>
                  <td className="px-6 py-4 text-right font-medium">$2.4M</td>
                  <td className="px-6 py-4 text-right text-primary font-bold">+22.4%</td>
                </tr>
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
              {[
                { action: "New investment", investor: "BlackRock Ventures", amount: "$250K", time: "2h ago" },
                { action: "Due diligence request", investor: "Meridian Capital", amount: "--", time: "5h ago" },
                { action: "Distribution payout", investor: "All investors", amount: "$82K", time: "1d ago" },
                { action: "New investment", investor: "A16Z Media Fund", amount: "$500K", time: "2d ago" },
              ].map((item, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
