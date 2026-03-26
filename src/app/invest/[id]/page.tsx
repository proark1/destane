/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import InvestForm from "@/components/InvestForm";
import { getSession } from "@/lib/auth";
import { query, initDb } from "@/lib/db";

const revenueModel = [
  { source: "Theatrical Release", share: "35%", icon: "theaters" },
  { source: "Streaming Licensing", share: "28%", icon: "smart_display" },
  { source: "International Distribution", share: "22%", icon: "public" },
  { source: "Merchandise & Ancillary", share: "15%", icon: "storefront" },
];

export default async function InvestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await initDb();
  const { id } = await params;
  const user = await getSession();

  const prodResult = await query("SELECT * FROM productions WHERE id = $1", [id]);
  const production = prodResult.rows[0];

  if (!production) {
    return (
      <div className="min-h-screen bg-surface-container-lowest text-on-surface">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span className="material-symbols-outlined text-on-surface-variant text-6xl">movie_off</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-extrabold tracking-tight">Production Not Found</h1>
          <p className="text-on-surface-variant text-sm">The production you are looking for does not exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const investorResult = await query(
    "SELECT COUNT(DISTINCT user_id) FROM investments WHERE production_id = $1",
    [id]
  );
  const investorCount = parseInt(investorResult.rows[0].count) || 0;

  const fundingGoal = parseFloat(production.funding_goal);
  const fundingRaised = parseFloat(production.funding_raised);
  const fundingPct = fundingGoal > 0 ? ((fundingRaised / fundingGoal) * 100).toFixed(1) : "0";
  const tokenPrice = parseFloat(production.token_price);
  const minInvestment = parseFloat(production.min_investment);
  const projectedRoi = parseFloat(production.projected_roi);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <TopNav />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={production.image_url || "/images/ui/placeholder.jpg"}
            alt={production.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#131313]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 w-full">
          <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-md text-primary font-bold inline-block mb-4">
            {production.status === "funding" ? "Now Funding" : production.status}
          </span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.95]">
            {production.title}
          </h1>
          <div className="flex flex-wrap gap-6 mt-4 font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
            {production.director && (
              <span>
                <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Director</span>
                <br />
                <span className="text-on-surface font-bold mt-0.5 inline-block">{production.director}</span>
              </span>
            )}
            {production.starring && (
              <span>
                <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Starring</span>
                <br />
                <span className="text-on-surface font-bold mt-0.5 inline-block">{production.starring}</span>
              </span>
            )}
            {production.budget && (
              <span>
                <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Budget</span>
                <br />
                <span className="text-on-surface font-bold mt-0.5 inline-block">
                  ${Number(production.budget).toLocaleString()}
                </span>
              </span>
            )}
            {production.genre && (
              <span>
                <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Genre</span>
                <br />
                <span className="text-on-surface font-bold mt-0.5 inline-block">{production.genre}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 md:pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Vision */}
            <div className="mb-10">
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mb-4">
                Vision
              </h2>
              <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant leading-relaxed">
                {production.description || "No description available."}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Projected ROI", value: `${projectedRoi}%`, color: "text-green-400" },
                { label: "Investors", value: investorCount.toLocaleString(), color: "text-on-surface" },
                { label: "Token Price", value: `$${tokenPrice.toLocaleString()}`, color: "text-on-surface" },
                { label: "Min Investment", value: `$${minInvestment.toLocaleString()}`, color: "text-primary" },
              ].map((m) => (
                <div key={m.label} className="glass-panel rounded-xl p-4">
                  <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">{m.label}</p>
                  <p className={`font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold tracking-tight mt-1 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue Sharing Model */}
            <div className="mb-10">
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mb-4">
                Revenue Sharing Model
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {revenueModel.map((r) => (
                  <div key={r.source} className="glass-panel rounded-xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-lg">{r.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{r.source}</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold tracking-tight text-primary">{r.share}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Disclosure */}
            <div className="glass-panel rounded-xl p-5 border-l-2 border-primary/30">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold tracking-tight mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-400 text-lg">warning</span>
                Risk Disclosure
              </h3>
              <p className="font-[family-name:var(--font-inter)] text-[11px] text-on-surface-variant/60 leading-relaxed">
                All investments carry risk, including the potential loss of principal. Past performance of similar
                productions does not guarantee future results. Revenue projections are estimates based on market
                analysis and are not guaranteed. Please review the full offering memorandum before investing.
              </p>
            </div>
          </div>

          {/* Investment Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="glass-panel rounded-xl p-6">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-5">
                  Invest in This Title
                </h3>

                {/* Funding Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60">Funded</span>
                    <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-primary">{fundingPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-primary to-primary-container rounded-full" style={{ width: `${Math.min(parseFloat(fundingPct), 100)}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/40">${fundingRaised.toLocaleString()} raised</span>
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/40">of ${fundingGoal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 py-4 border-y border-outline-variant/10">
                  {[
                    { label: "Token Price", value: `$${tokenPrice.toFixed(2)}` },
                    { label: "Min. Entry", value: `$${minInvestment.toLocaleString()} (${Math.ceil(minInvestment / tokenPrice)} tokens)` },
                    { label: "Revenue Share", value: `${production.revenue_share_pct}%` },
                    { label: "Release", value: production.release_date || "TBD" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{d.label}</span>
                      <span className="font-[family-name:var(--font-plus-jakarta)] text-xs font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Invest Form */}
                <InvestForm
                  productionId={production.id}
                  tokenPrice={tokenPrice}
                  minInvestment={minInvestment}
                  fundingGoal={fundingGoal}
                  fundingRaised={fundingRaised}
                  isAuthenticated={!!user}
                />

                <p className="font-[family-name:var(--font-inter)] text-[9px] text-on-surface-variant/40 text-center mt-3">
                  Regulated by SEC. Accredited investors only.
                </p>
              </div>

              {/* Share */}
              <div className="glass-panel rounded-xl p-5 flex items-center justify-between">
                <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">Share this production</span>
                <div className="flex gap-2">
                  {["share", "bookmark_border"].map((icon) => (
                    <button
                      key={icon}
                      className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center hover:bg-primary/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
