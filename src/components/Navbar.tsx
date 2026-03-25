"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-4 md:px-8 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-50 font-[family-name:var(--font-plus-jakarta)] tracking-tight">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary no-underline">
          DESTANE
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="/explore" className="text-[#f5f5f5]/60 hover:text-primary transition-colors text-sm font-medium">
            Watch
          </Link>
          <Link href="/dashboard" className="text-[#f5f5f5]/60 hover:text-primary transition-colors text-sm font-medium">
            Invest
          </Link>
          <Link href="/producer" className="text-[#f5f5f5]/60 hover:text-primary transition-colors text-sm font-medium">
            Creators
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:flex items-center bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs w-48 text-on-surface ml-2"
              placeholder="Search productions..."
              type="text"
            />
          </div>
          {!user ? (
            <Link
              href="/login"
              className="bg-linear-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-md font-bold text-sm tracking-tight no-underline hidden sm:inline-block"
            >
              Sign In
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-on-surface-variant text-xs">
                Welcome, <span className="text-primary font-bold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-md text-xs font-bold hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 items-center justify-center w-10 h-10"
          >
            <span className="block w-5 h-0.5 bg-primary"></span>
            <span className="block w-5 h-0.5 bg-primary"></span>
            <span className="block w-5 h-0.5 bg-primary"></span>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="md:hidden fixed top-[64px] left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant/15 z-40 px-4 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/explore" className="text-[#f5f5f5]/60 hover:text-primary text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Watch</Link>
            <Link href="/dashboard" className="text-[#f5f5f5]/60 hover:text-primary text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Invest</Link>
            <Link href="/producer" className="text-[#f5f5f5]/60 hover:text-primary text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Creators</Link>
            {!user ? (
              <Link href="/login" className="bg-linear-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-md font-bold text-sm text-center no-underline mt-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
            ) : (
              <button onClick={handleLogout} className="text-on-surface-variant text-sm font-medium py-2 text-left">Sign Out</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
