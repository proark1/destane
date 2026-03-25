"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Explore", icon: "explore", href: "/explore" },
  { label: "Portfolio", icon: "account_balance_wallet", href: "/dashboard" },
  { label: "Create", icon: "movie_filter", href: "/producer" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-t border-outline-variant/15 flex justify-around py-3 px-4 z-50">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-[#f5f5f5]/40"}`}>
            <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
