/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

interface Production {
  id: number;
  title: string;
  genre: string;
  description: string;
  director: string;
  funding_goal: string;
  funding_raised: string;
  projected_roi: string;
  token_price: string;
  status: string;
  image_url: string;
  release_date: string;
}

const tabs = [
  { label: "All", icon: "grid_view", filter: "" },
  { label: "Funding", icon: "timer", filter: "funding" },
  { label: "In Production", icon: "movie", filter: "in_production" },
  { label: "Pending", icon: "new_releases", filter: "pending" },
];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState("funding");
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Explore | DESTANE";
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      let url = activeFilter
        ? `/api/productions?status=${activeFilter}`
        : `/api/productions`;

      if (searchQuery.trim()) {
        url += url.includes("?") ? `&search=${encodeURIComponent(searchQuery.trim())}` : `?search=${encodeURIComponent(searchQuery.trim())}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setProductions(data.productions ?? []);
        })
        .catch(() => {
          setProductions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(handler);
  }, [activeFilter, searchQuery]);

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

        {/* Search */}
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or genre..."
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-12 pr-4 py-3 font-[family-name:var(--font-inter)] text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/40 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.filter)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all min-h-[44px] ${
                  activeFilter === tab.filter
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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60">Loading productions...</p>
              </div>
            </div>
          ) : productions.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl mb-4 block">movie</span>
                <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-2">No productions found</p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-on-surface-variant/60">
                  Try a different filter or check back later.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productions.map((p) => {
                const goal = parseFloat(p.funding_goal);
                const raised = parseFloat(p.funding_raised);
                const fundedPct = goal > 0 ? Math.round((raised / goal) * 100) : 0;

                return (
                  <Link
                    key={p.id}
                    href={`/invest/${p.id}`}
                    className="glass-panel rounded-xl overflow-hidden group hover:border-primary/30 transition-all no-underline"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">movie</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-on-surface-variant">
                        {p.genre}
                      </span>
                      <span className="absolute top-3 right-3 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest bg-primary/20 backdrop-blur-sm px-2.5 py-1 rounded-md text-primary font-bold capitalize">
                        {p.status}
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
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">${raised.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Target</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold mt-0.5">${goal.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Proj. ROI</p>
                          <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-green-400 mt-0.5">{parseFloat(p.projected_roi).toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Token Price */}
                      <div className="mt-3">
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-widest text-on-surface-variant/50">Token Price</p>
                        <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-primary mt-0.5">${parseFloat(p.token_price).toLocaleString()}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant/60">{p.release_date}</span>
                          <span className="font-[family-name:var(--font-inter)] text-[10px] text-primary font-bold">{fundedPct}% funded</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-primary to-primary-container rounded-full"
                            style={{ width: `${fundedPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
