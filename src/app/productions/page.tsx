/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";
import { query, initDb } from "@/lib/db";
import Link from "next/link";

export default async function ProductionsPage() {
  const user = await getSession();
  await initDb();

  // Fetch productions for the current user, or all if no user
  const productionsRes = user
    ? await query("SELECT * FROM productions WHERE created_by = $1 ORDER BY created_at DESC", [user.id])
    : await query("SELECT * FROM productions ORDER BY created_at DESC");

  const productions = productionsRes.rows;

  // Fetch investor counts per production
  const investorCounts: Record<number, number> = {};
  if (productions.length > 0) {
    const ids = productions.map((p: { id: number }) => p.id);
    const countRes = await query(
      `SELECT production_id, COUNT(DISTINCT user_id) AS count FROM investments WHERE production_id = ANY($1) GROUP BY production_id`,
      [ids]
    );
    for (const row of countRes.rows) {
      investorCounts[row.production_id] = parseInt(row.count);
    }
  }

  function formatCurrency(val: number) {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  }

  function statusStyle(status: string) {
    switch (status) {
      case "funding": return "bg-primary/10 text-primary";
      case "production": return "bg-tertiary/10 text-tertiary";
      case "pending": return "bg-yellow-500/10 text-yellow-400";
      case "rejected": return "bg-red-500/10 text-red-400";
      default: return "bg-surface-container-highest/50 text-on-surface-variant";
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
              Executive Dashboard
            </p>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              Production Portfolio
            </h1>
          </div>
          <Link
            href="/producer"
            className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-5 py-2.5 rounded-md shadow-lg shadow-primary/20 text-center"
          >
            + New Production
          </Link>
        </div>

        {/* Empty State */}
        {productions.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">movie</span>
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mb-2">
              No Productions Yet
            </h3>
            <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60 max-w-md mx-auto mb-6">
              Submit your first production to start raising funds and building your audience on DESTANE.
            </p>
            <Link
              href="/producer"
              className="inline-block btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-6 py-3 rounded-md shadow-lg shadow-primary/20"
            >
              Submit Your First Production
            </Link>
          </div>
        ) : (
          <>
            {/* Filter summary */}
            <div className="flex items-center gap-4">
              <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">{productions.length}</span> production{productions.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productions.map((p: Record<string, string | number>) => {
                const fundingGoal = parseFloat(p.funding_goal as string) || 1;
                const fundingRaised = parseFloat(p.funding_raised as string) || 0;
                const fundedPct = Math.min(Math.round((fundingRaised / fundingGoal) * 100), 100);
                const investors = investorCounts[p.id as number] || 0;

                return (
                  <div key={p.id} className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url as string} alt={p.title as string} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-surface-container-highest to-surface-container-low flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">movie</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                        {p.genre || "Unspecified"}
                      </span>
                      <span className={`absolute top-3 right-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest backdrop-blur-sm px-2.5 py-1 rounded-md font-bold ${statusStyle(p.status as string)}`}>
                        {p.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold tracking-tight">{p.title}</h3>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60 mt-0.5">Dir. {p.director || "TBD"}</p>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Raised</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{formatCurrency(fundingRaised)}</p>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Goal</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{formatCurrency(fundingGoal)}</p>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Investors</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{investors.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60">Progress</span>
                          <span className="font-[family-name:var(--font-inter)] text-[10px] text-primary font-bold">{fundedPct}% funded</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-primary to-primary-container rounded-full" style={{ width: `${fundedPct}%` }} />
                        </div>
                      </div>

                      {/* Release Date */}
                      {p.release_date && (
                        <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                          <div>
                            <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-wider text-on-surface-variant/50">Release Target</p>
                            <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface mt-0.5">{p.release_date}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
