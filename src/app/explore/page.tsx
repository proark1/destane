import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const tabs = [
  { label: "Ending Soon", icon: "timer", active: true },
  { label: "Recently Added", icon: "new_releases", active: false },
  { label: "Top Revenue", icon: "trending_up", active: false },
];

const projects = [
  {
    title: "AETHER DRIFT",
    genre: "Sci-Fi Epic",
    director: "Mika Tanaka",
    funded: 72,
    target: "$4.2M",
    raised: "$3.02M",
    roi: "18.4%",
    investors: 2840,
    daysLeft: 14,
    image: "https://lh3.googleusercontent.com/aida/AXQ1bvN7_W5bkV8s4rX_CG0WSrJwG_QeBmvDkEl1eAFvdLKTnHd0R4c0XQNPI5SYJCM3xnE_rOYGQcvNy8cKjEfrHpnihAJ=s512",
  },
  {
    title: "THE PROTOCOL",
    genre: "Cyber Thriller",
    director: "James Whitfield",
    funded: 91,
    target: "$1.8M",
    raised: "$1.64M",
    roi: "22.1%",
    investors: 1560,
    daysLeft: 5,
    image: "https://lh3.googleusercontent.com/aida/AXQ1bvOkO5TCMIx_0YISJJ_yCSXPQQkr0RjYVcfjJUZUOPRHXwYEKX0JcwzLx0L1BIy8x2q1vO4jCyP0I1d_ycJ1PL4FMKRM=s512",
  },
  {
    title: "ONYX GARDEN",
    genre: "Art House Drama",
    director: "Solange Mbeki",
    funded: 38,
    target: "$3.6M",
    raised: "$1.37M",
    roi: "15.7%",
    investors: 920,
    daysLeft: 31,
    image: "https://lh3.googleusercontent.com/aida/AXQ1bvMNQmTpGBK1OiYx6b8mpWUaS1x9VIaLMFOe90WACG1vhNqjGC-MBaLMj-HHacCmKL-3VIHwYG6zqPrYqD3m7hMt7r0=s512",
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <TopNav />

      {/* Page Content */}
      <div className="pt-24 pb-20 md:pb-12">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            Cinematic Marketplace
          </p>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-extrabold tracking-tighter">
            Explore Titles
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant mt-3 max-w-lg">
            Discover curated film productions seeking equity investment. Each title is vetted by our studio advisory board.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all ${
                  tab.active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-on-surface-variant/40 border border-outline-variant/10 hover:border-outline-variant/30 hover:text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.title}
                href="/invest"
                className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all no-underline"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                    {p.genre}
                  </span>
                  <span className="absolute top-3 right-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-primary/20 backdrop-blur-sm px-2.5 py-1 rounded-md text-primary font-bold">
                    {p.daysLeft}d left
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold tracking-tight text-on-surface">
                    {p.title}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60 mt-1">
                    Dir. {p.director}
                  </p>

                  {/* Stats Row */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Raised</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{p.raised}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Target</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{p.target}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Proj. ROI</p>
                      <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-green-400 mt-0.5">{p.roi}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60">{p.investors.toLocaleString()} investors</span>
                      <span className="font-[family-name:var(--font-inter)] text-[10px] text-primary font-bold">{p.funded}% funded</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-primary to-primary-container rounded-full"
                        style={{ width: `${p.funded}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-12">
            <button className="border border-outline-variant/30 text-on-surface-variant font-[family-name:var(--font-plus-jakarta)] font-bold px-8 py-3 rounded-md text-sm hover:border-primary/40 hover:text-primary transition-all">
              Load More Titles
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
