import Link from "next/link";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">風</span>
              </div>
              <span className="font-bold text-white text-base">FengShui AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Classical Bagua and Eight Mansions principles powered by advanced spatial vision AI to harmonize your living and workspaces.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Encrypted & Private Uploads</span>
            </div>
          </div>

          {/* Quick Guides */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Guides & Principles
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/seo/feng-shui-bedroom-layout" className="hover:text-emerald-400 transition-colors">
                  Bedroom Command Position
                </Link>
              </li>
              <li>
                <Link href="/seo/feng-shui-desk-setup" className="hover:text-emerald-400 transition-colors">
                  Home Office & Career Chi
                </Link>
              </li>
              <li>
                <Link href="/seo/feng-shui-door-direction" className="hover:text-emerald-400 transition-colors">
                  Front Door Compass Sectors
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-emerald-400 transition-colors">
                  Analyze Your Room Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Trust & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
                  Traditional Practice Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy (GDPR / CCPA)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  System Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Your Privacy Guarantee
            </h5>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Your room photos are analyzed securely and never shared or sold. Temporary analysis photos are automatically purged after 30 days. You may request immediate deletion at any time.
            </p>
          </div>
        </div>

        {/* Traditional practice disclaimer banner */}
        <div className="border-t border-slate-900 pt-6 text-[11px] text-slate-500 leading-relaxed text-center">
          <p>
            <strong>Disclaimer:</strong> This application provides interior spatial layout recommendations rooted in classical Chinese Feng Shui traditions (Bagua, Ba Zhai, Form School) for entertainment, inspirational, and cultural purposes only. It is not professional architectural, structural engineering, medical, financial, or psychological advice.
          </p>
          <p className="mt-2 text-slate-600">
            © 2026 FengShui AI. Crafted with harmony & intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
