"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setUser(d.user); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-4 md:px-8 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-50 font-[family-name:var(--font-plus-jakarta)] tracking-tight">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
          DESTANE
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="/explore" className={`${pathname === "/explore" || pathname.startsWith("/explore/") ? "text-primary" : "text-[#f5f5f5]/60"} hover:text-primary transition-colors text-sm font-medium`}>
            Explore
          </Link>
          <Link href="/dashboard" className={`${pathname === "/dashboard" || pathname.startsWith("/dashboard/") ? "text-primary" : "text-[#f5f5f5]/60"} hover:text-primary transition-colors text-sm font-medium`}>
            Portfolio
          </Link>
          <Link href="/producer" className={`${pathname === "/producer" || pathname.startsWith("/producer/") ? "text-primary" : "text-[#f5f5f5]/60"} hover:text-primary transition-colors text-sm font-medium`}>
            Creators
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-surface-container-lowest border border-outline-variant/20 px-4 py-2 rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs w-48 text-on-surface ml-2"
              placeholder="Search productions..."
              aria-label="Search productions"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && searchValue.trim()) router.push(`/explore?search=${encodeURIComponent(searchValue.trim())}`); }}
            />
          </div>
          {!user ? (
            <Link href="/login" className="bg-linear-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-md font-bold text-sm tracking-tight">
              Sign In
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-on-surface-variant text-xs">
                Welcome, <span className="text-primary font-bold">{user.username}</span>
              </span>
              <button onClick={handleLogout} className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-md text-xs font-bold hover:text-primary transition-colors">
                Sign Out
              </button>
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" className="md:hidden flex flex-col gap-1.5 items-center justify-center w-10 h-10">
            <span className={`block w-5 h-0.5 bg-primary transition-all ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-5 h-0.5 bg-primary transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-primary transition-all ${mobileOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden fixed top-[64px] left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant/15 z-40 px-4 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/explore" onClick={() => setMobileOpen(false)} className={`${pathname === "/explore" || pathname.startsWith("/explore/") ? "text-primary" : "text-[#f5f5f5]/60"} hover:text-primary text-sm font-medium py-2`}>Explore</Link>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={`${pathname === "/dashboard" || pathname.startsWith("/dashboard/") ? "text-primary" : "text-[#f5f5f5]/60"} hover:text-primary text-sm font-medium py-2`}>Portfolio</Link>
            <Link href="/producer" onClick={() => setMobileOpen(false)} className={`${pathname === "/producer" || pathname.startsWith("/producer/") ? "text-primary" : "text-[#f5f5f5]/60"} hover:text-primary text-sm font-medium py-2`}>Creators</Link>
            {!user ? (
              <Link href="/login" className="bg-linear-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-md font-bold text-sm text-center mt-2">
                Sign In
              </Link>
            ) : (
              <button onClick={handleLogout} className="text-primary font-bold text-sm py-2 text-left">Sign Out</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
