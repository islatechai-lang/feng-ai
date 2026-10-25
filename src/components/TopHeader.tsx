"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Crown } from "lucide-react";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 safe-top glass-panel border-b border-emerald-500/10">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-emerald-950/80 border border-emerald-500/30">
            <Image
              src="/logo.png"
              alt="FengShui AI Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">
                FengShui
              </span>
              <span className="text-[10px] font-black tracking-widest px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI
              </span>
            </div>
          </div>
        </Link>

        {/* Daily Chi / Pro Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-pill text-[10px] font-medium text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sheng Chi Flow</span>
          </div>

          <Link
            href="/account"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>PRO</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
