import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const tabs = [
  { label: "Overview", active: true },
  { label: "Financials", active: false },
  { label: "Team", active: false },
  { label: "Documents", active: false },
];

const revenueModel = [
  { source: "Theatrical Release", share: "35%", icon: "theaters" },
  { source: "Streaming Licensing", share: "28%", icon: "smart_display" },
  { source: "International Distribution", share: "22%", icon: "public" },
  { source: "Merchandise & Ancillary", share: "15%", icon: "storefront" },
];

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <TopNav />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida/AXQ1bvOkO5TCMIx_0YISJJ_yCSXPQQkr0RjYVcfjJUZUOPRHXwYEKX0JcwzLx0L1BIy8x2q1vO4jCyP0I1d_ycJ1PL4FMKRM=s512"
            alt="The Last Protocol"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#131313]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 w-full">
          <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-md text-primary font-bold inline-block mb-4">
            Now Funding
          </span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.95]">
            The Last Protocol
          </h1>
          <div className="flex flex-wrap gap-6 mt-4 font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
            <span>
              <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Director</span>
              <br />
              <span className="text-on-surface font-bold mt-0.5 inline-block">James Whitfield</span>
            </span>
            <span>
              <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Starring</span>
              <br />
              <span className="text-on-surface font-bold mt-0.5 inline-block">Elena Voss, Marcus Reid</span>
            </span>
            <span>
              <span className="text-on-surface-variant/50 uppercase tracking-widest text-[9px]">Budget</span>
              <br />
              <span className="text-on-surface font-bold mt-0.5 inline-block">$1.8M</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 md:pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-outline-variant/15 mb-8 overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest font-bold px-5 py-3 whitespace-nowrap transition-all border-b-2 ${
                    tab.active
                      ? "text-primary border-primary"
                      : "text-on-surface-variant/40 border-transparent hover:text-on-surface-variant"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Vision */}
            <div className="mb-10">
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight mb-4">
                Vision
              </h2>
              <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant leading-relaxed mb-4">
                The Last Protocol is a cyber-thriller set in 2049, where a rogue AI architect discovers that the
                global financial system runs on a single, decaying protocol written decades ago. When she attempts
                to patch it, she triggers a cascade that threatens to erase the digital economy entirely.
              </p>
              <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant leading-relaxed">
                Blending the tension of a heist film with the philosophical weight of speculative fiction, this
                production has already secured distribution interest from three major streaming platforms and a
                commitment for a 2,400-screen theatrical window.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Projected ROI", value: "22.1%", color: "text-green-400" },
                { label: "Token Holders", value: "1,560", color: "text-on-surface" },
                { label: "Est. Revenue", value: "$8.4M", color: "text-on-surface" },
                { label: "Payout Start", value: "Q3 2027", color: "text-primary" },
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
                    <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-primary">78%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-primary to-primary-container rounded-full" style={{ width: "78%" }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/40">$1.40M raised</span>
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/40">of $1.80M</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 py-4 border-y border-outline-variant/10">
                  {[
                    { label: "Token Price", value: "$50.00" },
                    { label: "Min. Entry", value: "$250 (5 tokens)" },
                    { label: "Equity per Token", value: "0.0028%" },
                    { label: "Days Remaining", value: "5" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">{d.label}</span>
                      <span className="font-[family-name:var(--font-plus-jakarta)] text-xs font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Invest Button */}
                <Link
                  href="/login"
                  className="block w-full btn-gold text-on-primary font-[family-name:var(--font-plus-jakarta)] font-bold px-6 py-3.5 rounded-md text-sm text-center shadow-lg shadow-primary/20 no-underline"
                >
                  Invest Now
                </Link>
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
