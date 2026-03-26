"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  productionId: number;
  tokenPrice: number;
  minInvestment: number;
  fundingGoal: number;
  fundingRaised: number;
  isAuthenticated: boolean;
}

export default function InvestForm({ productionId, tokenPrice, minInvestment, fundingGoal, fundingRaised, isAuthenticated }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState(minInvestment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const tokens = Math.floor(amount / tokenPrice);
  const remaining = fundingGoal - fundingRaised;

  async function handleInvest() {
    if (!isAuthenticated) { router.push("/login"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ production_id: productionId, amount }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-primary text-4xl mb-4">check_circle</span>
        <p className="text-lg font-bold text-on-surface">Investment Successful!</p>
        <p className="text-sm text-on-surface-variant mt-2">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <Link href="/login" className="w-full block btn-gold text-on-primary py-4 rounded-xl font-bold text-lg text-center">
          Sign In to Invest
        </Link>
      ) : (
        <>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Investment Amount (USD)</label>
            <input
              type="number"
              min={minInvestment}
              max={remaining}
              step={tokenPrice}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-lg text-on-surface font-bold focus:border-primary/40 focus:ring-0 focus:outline-none"
            />
            <p className="text-[10px] text-on-surface-variant mt-1">
              = {tokens} tokens ({((amount / fundingGoal) * 100).toFixed(2)}% equity)
            </p>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs">{error}</div>
          )}
          <button
            onClick={handleInvest}
            disabled={loading || amount < minInvestment}
            className="w-full btn-gold text-on-primary py-4 rounded-xl font-bold text-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : `Invest $${amount.toLocaleString()}`}
          </button>
        </>
      )}
    </div>
  );
}
