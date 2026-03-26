"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function NewProductionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/productions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        genre: form.get("genre"),
        description: form.get("description"),
        director: form.get("director"),
        starring: form.get("starring"),
        budget: Number(form.get("budget")),
        funding_goal: Number(form.get("funding_goal")),
        token_price: Number(form.get("token_price")) || 50,
        min_investment: Number(form.get("min_investment")) || 250,
        projected_roi: Number(form.get("projected_roi")) || 15,
        release_date: form.get("release_date"),
        revenue_share_pct: Number(form.get("revenue_share_pct")) || 15,
        image_url: form.get("image_url") || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/productions");
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <Link href="/producer" className="text-on-surface-variant text-xs hover:text-primary transition-colors">
            &larr; Back to Producer Portal
          </Link>
        </div>

        <p className="text-primary font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-[0.2em] mb-2">
          New Submission
        </p>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter text-on-surface mb-2">
          Submit a Production
        </h1>
        <p className="text-on-surface-variant text-sm mb-10">
          Your production will be submitted for review. Once approved, it will appear on the marketplace for investors.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel rounded-xl p-6 md:p-8 space-y-6">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold text-on-surface">Production Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Title *</label>
                <input name="title" required className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="Production title" />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Genre</label>
                <input name="genre" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="e.g. Sci-Fi Thriller" />
              </div>
            </div>

            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Description</label>
              <textarea name="description" rows={3} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none resize-none" placeholder="Describe your production..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Director</label>
                <input name="director" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="Director name" />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Starring</label>
                <input name="starring" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="Lead cast" />
              </div>
            </div>

            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Poster Image URL</label>
              <input name="image_url" type="url" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="https://..." />
            </div>

            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Target Release</label>
              <input name="release_date" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="e.g. Q4 2026" />
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 md:p-8 space-y-6">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold text-on-surface">Financial Structure</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Total Budget ($) *</label>
                <input name="budget" type="number" required min={1000} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="e.g. 2000000" />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Funding Goal ($) *</label>
                <input name="funding_goal" type="number" required min={1000} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" placeholder="e.g. 2000000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Token Price ($)</label>
                <input name="token_price" type="number" min={1} defaultValue={50} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Min Investment ($)</label>
                <input name="min_investment" type="number" min={1} defaultValue={250} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Revenue Share %</label>
                <input name="revenue_share_pct" type="number" min={1} max={100} defaultValue={15} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Projected ROI (%)</label>
              <input name="projected_roi" type="number" step="0.1" min={0} defaultValue={15} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-gold text-on-primary font-[family-name:var(--font-plus-jakarta)] font-bold py-3.5 rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
            <Link
              href="/producer"
              className="px-8 py-3.5 bg-surface-container-highest text-on-surface-variant font-bold rounded-md text-sm hover:text-on-surface transition-colors text-center no-underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
