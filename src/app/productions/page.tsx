import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";

const filterTabs = [
  { label: "All Projects", active: true, count: 4 },
  { label: "Active Productions", active: false, count: 2 },
  { label: "Funding", active: false, count: 1 },
  { label: "Drafts", active: false, count: 1 },
];

const projects = [
  {
    title: "Neon Horizon",
    genre: "Sci-Fi Thriller",
    status: "Production",
    statusColor: "bg-tertiary/10 text-tertiary",
    funded: 80,
    raised: "$4.8M",
    goal: "$6.0M",
    investors: 3240,
    director: "Mika Tanaka",
    nextMilestone: "Principal photography wrap",
    milestoneDate: "Apr 18, 2026",
    image: "https://lh3.googleusercontent.com/aida/AXQ1bvN7_W5bkV8s4rX_CG0WSrJwG_QeBmvDkEl1eAFvdLKTnHd0R4c0XQNPI5SYJCM3xnE_rOYGQcvNy8cKjEfrHpnihAJ=s512",
  },
  {
    title: "Crimson Meridian",
    genre: "Drama",
    status: "Funding",
    statusColor: "bg-primary/10 text-primary",
    funded: 54,
    raised: "$1.94M",
    goal: "$3.6M",
    investors: 1120,
    director: "Solange Mbeki",
    nextMilestone: "Funding round closes",
    milestoneDate: "May 02, 2026",
    image: "https://lh3.googleusercontent.com/aida/AXQ1bvOkO5TCMIx_0YISJJ_yCSXPQQkr0RjYVcfjJUZUOPRHXwYEKX0JcwzLx0L1BIy8x2q1vO4jCyP0I1d_ycJ1PL4FMKRM=s512",
  },
];

export default async function ProductionsPage() {
  const user = await getSession();

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
          <button className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-5 py-2.5 rounded-md shadow-lg shadow-primary/20">
            + New Production
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                  tab.active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-on-surface-variant/40 border border-outline-variant/10 hover:border-outline-variant/30 hover:text-on-surface-variant"
                }`}
              >
                {tab.label}
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${tab.active ? "bg-primary/20" : "bg-surface-container-highest/50"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 sm:max-w-xs">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">search</span>
              <input
                type="text"
                placeholder="Search productions..."
                className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg pl-10 pr-4 py-2.5 font-[family-name:var(--font-inter)] text-xs text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                  {p.genre}
                </span>
                <span className={`absolute top-3 right-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest backdrop-blur-sm px-2.5 py-1 rounded-md font-bold ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold tracking-tight">{p.title}</h3>
                <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60 mt-0.5">Dir. {p.director}</p>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Raised</p>
                    <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{p.raised}</p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Goal</p>
                    <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{p.goal}</p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Investors</p>
                    <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">{p.investors.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60">Progress</span>
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-primary font-bold">{p.funded}% funded</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-primary to-primary-container rounded-full" style={{ width: `${p.funded}%` }} />
                  </div>
                </div>

                {/* Milestone */}
                <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-wider text-on-surface-variant/50">Next Milestone</p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface mt-0.5">{p.nextMilestone}</p>
                  </div>
                  <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60">{p.milestoneDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
