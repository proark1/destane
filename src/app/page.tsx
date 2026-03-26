/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { query, initDb } from "@/lib/db";

const steps = [
  { icon: "movie_filter", title: "Discover", description: "Browse curated film productions seeking investment." },
  { icon: "account_balance_wallet", title: "Invest", description: "Purchase fractional equity shares in productions you believe in." },
  { icon: "trending_up", title: "Earn", description: "Receive returns from box office revenue, streaming deals, and licensing." },
];

export default async function Home() {
  await initDb();

  // Fetch real stats
  const [investStats, userCount, prodCount] = await Promise.all([
    query("SELECT COALESCE(SUM(amount),0) as total, COUNT(DISTINCT user_id) as investors FROM investments"),
    query("SELECT COUNT(*) as count FROM users"),
    query("SELECT COUNT(*) as count FROM productions WHERE status IN ('funding','production')"),
  ]);

  const totalInvested = parseFloat(investStats.rows[0].total);
  const investorCount = parseInt(userCount.rows[0].count);
  const productionCount = parseInt(prodCount.rows[0].count);

  // Fetch top 3 funding productions
  const topProductions = await query(
    "SELECT * FROM productions WHERE status = 'funding' ORDER BY funding_raised DESC LIMIT 3"
  );

  const stats = [
    { value: totalInvested > 1000000 ? `$${(totalInvested / 1000000).toFixed(1)}M` : `$${totalInvested.toLocaleString()}`, label: "Total Invested" },
    { value: investorCount.toLocaleString(), label: "Active Investors" },
    { value: productionCount.toString(), label: "Productions" },
    { value: topProductions.rows.length > 0 ? `${(topProductions.rows.reduce((sum: number, p: { projected_roi: string }) => sum + parseFloat(p.projected_roi), 0) / topProductions.rows.length).toFixed(1)}%` : "0%", label: "Avg. Projected ROI" },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <TopNav />
      <MobileBottomNav />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-tertiary/5" />
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-tertiary/5 blur-[120px] rounded-full" />
        <img src="/images/ui/hero-pattern.svg" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <img src="/images/ui/destane-logo.svg" alt="" className="w-14 h-14 mx-auto mb-6" />
          <p className="font-[family-name:var(--font-inter)] text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6">
            The Future of Film Finance
          </p>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-6">
            Own a Piece of<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-container">
              Cinema History
            </span>
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-on-surface-variant text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Invest in curated film productions through regulated fractional equity.
            Transparent, secure, and built for the modern investor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="btn-gold text-on-primary font-[family-name:var(--font-plus-jakarta)] font-bold px-8 py-3.5 rounded-md text-sm shadow-lg shadow-primary/20 no-underline"
            >
              Explore Productions
            </Link>
            <Link
              href="/register"
              className="border border-outline-variant/30 text-on-surface font-[family-name:var(--font-plus-jakarta)] font-bold px-8 py-3.5 rounded-md text-sm hover:border-primary/40 transition-colors no-underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Credibility Bar */}
      <section className="border-y border-outline-variant/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-6 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-[family-name:var(--font-plus-jakarta)] text-xl md:text-2xl font-extrabold text-primary tracking-tight">
                {stat.value}
              </p>
              <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Productions */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
            Now Funding
          </p>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
            Featured Productions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topProductions.rows.map((prod: { id: number; title: string; genre: string; image_url: string; funding_goal: string; funding_raised: string }) => {
            const funded = parseFloat(prod.funding_raised) / parseFloat(prod.funding_goal) * 100;
            return (
              <Link
                key={prod.id}
                href={`/invest/${prod.id}`}
                className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all no-underline"
              >
                <div className="relative h-48 overflow-hidden">
                  {prod.image_url && (
                    <img
                      src={prod.image_url}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                    {prod.genre}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight text-on-surface">
                    {prod.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Goal: ${(parseFloat(prod.funding_goal) / 1000000).toFixed(1)}M</span>
                    <span className="text-primary font-bold">{funded.toFixed(0)}% funded</span>
                  </div>
                  <div className="mt-2 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-primary-container rounded-full"
                      style={{ width: `${Math.min(funded, 100)}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-outline-variant/10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              Simple &amp; Transparent
            </p>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="glass-panel rounded-xl p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                </div>
                <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-primary mb-2">
                  Step {i + 1}
                </p>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-on-surface-variant text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="glass-panel rounded-2xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
          <div className="relative z-10">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
              Ready to Invest in<br />
              <span className="text-primary">the Next Blockbuster?</span>
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-on-surface-variant text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Join thousands of investors building wealth through cinematic equity.
              Start with as little as $50.
            </p>
            <Link
              href="/register"
              className="btn-gold text-on-primary font-[family-name:var(--font-plus-jakarta)] font-bold px-10 py-4 rounded-md text-sm shadow-lg shadow-primary/20 no-underline inline-block"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* spacer for mobile bottom nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
