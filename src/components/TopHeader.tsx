"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown } from "lucide-react";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#020e0c]/90 backdrop-blur-xl border-b border-emerald-500/15 safe-top">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-emerald-950/80 border border-emerald-500/30">
            <Image
              src="/logo.png"
              alt="FengShui AI Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-tight text-white">
              FengShui
            </span>
            <span className="text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI
            </span>
          </div>
        </Link>

        {/* Upgrade / Pro Plan Pill */}
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-teal-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Upgrade</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
