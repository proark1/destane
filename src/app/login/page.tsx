/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Sign In | DESTANE"; }, []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-surface-container-lowest">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full" />
      <img src="/images/ui/auth-bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" aria-hidden="true" />

      <div className="mb-12 text-center relative z-10">
        <img src="/images/ui/destane-logo.svg" alt="" className="w-12 h-12 mb-4" />
        <Link href="/" className="font-[family-name:var(--font-plus-jakarta)] font-extrabold text-2xl tracking-tighter text-primary">
          DESTANE
        </Link>
        <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mt-2">
          Cinematic Securities Platform
        </p>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-xl p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold text-on-surface tracking-tighter">
              Welcome Back
            </h2>
            <p className="text-on-surface-variant mt-2 text-sm">Sign in to access your portfolio and investments.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-fixed/40 focus:ring-0 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-fixed/40 focus:ring-0 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold text-on-primary font-[family-name:var(--font-plus-jakarta)] font-bold py-3.5 rounded-md transition-all active:scale-95 shadow-lg shadow-primary/10 text-sm disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-on-surface-variant text-xs">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">Create one</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center gap-2 opacity-50">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest">Secured with AES-256 Encryption</span>
        </div>
      </div>
    </div>
  );
}
