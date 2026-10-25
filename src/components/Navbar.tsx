"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, History, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/analyze", label: "Analyze Room", icon: Sparkles },
    { href: "/history", label: "My Rooms", icon: History },
    { href: "/seo/feng-shui-bedroom-layout", label: "Feng Shui Guides", icon: Compass },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <span className="text-white font-serif font-black text-lg">風</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 bg-clip-text text-transparent">
              FengShui AI
            </span>
            <span className="text-[10px] block uppercase tracking-widest text-slate-400 font-medium">
              Spatial Chi Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/analyze"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Now</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 bg-slate-950 border-b border-slate-800 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-emerald-500 text-slate-950 shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free Analysis</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
