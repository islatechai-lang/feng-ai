import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Legal Disclaimer</span>
          </div>
          <h1 className="text-3xl font-black text-white">Traditional Practice Disclaimer</h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>
        </div>

        <div className="prose prose-invert text-xs text-slate-300 leading-relaxed space-y-4">
          <p>
            The services, analyses, scorecards, layout diagrams, and recommendations provided by <strong>FengShui AI</strong> are rooted in classical Chinese spatial traditions—including the Bagua (Eight Trigrams), Ba Zhai (Eight Mansions), and Form School Feng Shui—and are provided strictly for <strong>cultural appreciation, entertainment, and personal aesthetic inspiration</strong>.
          </p>

          <h3 className="text-sm font-bold text-white pt-2">No Professional Advice</h3>
          <p>
            The content provided through this application is not intended to replace or serve as professional architectural engineering, structural consultation, interior construction, medical diagnosis or treatment, financial planning, or legal advice.
          </p>

          <h3 className="text-sm font-bold text-white pt-2">No Guarantee of Life Outcomes</h3>
          <p>
            While classical Feng Shui holds that spatial balance harmonizes Chi (life-force energy), FengShui AI makes no guarantees, representations, or warranties regarding specific real-world outcomes, including but not limited to wealth accumulation, romantic relationships, medical recovery, or career promotions.
          </p>

          <h3 className="text-sm font-bold text-white pt-2">Safety & Structural Responsibility</h3>
          <p>
            Users are solely responsible for ensuring that any physical moving of furniture, electrical fixtures, lighting, or structural alterations conforms to local building safety codes, fire escape requirements, and physical load-bearing limits. Never block designated fire exit corridors or emergency pathways regardless of Feng Shui layout suggestions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
