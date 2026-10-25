"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Compass, History, BookOpen, Crown } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Scan", icon: Sparkles, isCenter: true },
    { href: "/compass", label: "Compass", icon: Compass },
    { href: "/history", label: "Saved", icon: History },
    { href: "/guides", label: "Guides", icon: BookOpen },
    { href: "/account", label: "Upgrade", icon: Crown },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none safe-bottom">
      <div className="max-w-md mx-auto px-4 pb-3 pt-1 pointer-events-auto">
        <div className="glass-panel-elevated rounded-3xl px-2 py-2 flex items-center justify-around shadow-2xl relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === "/"
                ? pathname === "/" || pathname === "/analyze"
                : pathname.startsWith(tab.href);

            if (tab.isCenter) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-label={tab.label}
                  className="group relative -top-5 flex flex-col items-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isActive
                        ? "bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-200 text-slate-950 scale-105 shadow-emerald-500/40 ring-4 ring-emerald-950/80"
                        : "bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 hover:scale-105 shadow-emerald-950/80 ring-4 ring-slate-950/90"
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${
                      isActive ? "text-emerald-300" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                  isActive
                    ? "text-emerald-300"
                    : "text-slate-400 hover:text-slate-200 active:scale-95"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? "bg-emerald-500/20 shadow-sm shadow-emerald-500/20" : ""
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
