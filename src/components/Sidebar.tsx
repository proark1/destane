"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Productions", icon: "movie_filter", href: "/productions" },
  { label: "Marketplace", icon: "explore", href: "/explore" },
  { label: "Analytics", icon: "insights", href: "/analytics" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setUser(d.user); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-md bg-surface-container"
      >
        <span className="material-symbols-outlined text-primary">menu</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 border-r border-outline-variant/10 bg-surface-container-lowest flex flex-col py-6 z-50 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <button onClick={() => setOpen(false)} className="md:hidden absolute top-4 right-4 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="px-6 mb-10">
          <Link href="/" className="text-lg font-black text-primary-container font-[family-name:var(--font-plus-jakarta)] tracking-tighter">
            DESTANE
          </Link>
          <p className="text-[10px] font-[family-name:var(--font-inter)] uppercase tracking-[0.2em] text-on-surface-variant/60 mt-1">
            Cinematic Studio
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 font-[family-name:var(--font-plus-jakarta)] text-sm uppercase tracking-widest transition-all duration-200 ${
                  active
                    ? "bg-surface-container text-primary border-l-4 border-primary font-bold"
                    : "text-[#f5f5f5]/40 hover:bg-surface-container-low hover:translate-x-1"
                }`}
              >
                <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="px-6 py-4 border-t border-outline-variant/10">
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">Signed in as</p>
            <p className="text-sm text-primary font-bold mt-1">{user.username}</p>
            <button onClick={handleLogout} className="mt-2 text-xs text-on-surface-variant/40 hover:text-primary transition-colors">
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
