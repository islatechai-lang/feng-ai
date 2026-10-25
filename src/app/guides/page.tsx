import Link from "next/link";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { Bed, Briefcase, Compass, ArrowRight, Sparkles } from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      slug: "feng-shui-bedroom-layout",
      title: "Bedroom Command Position",
      subtitle: "Avoid the coffin line & eliminate sleep-disrupting Sha Chi.",
      icon: Bed,
      color: "text-indigo-400",
      bg: "from-indigo-950/40",
    },
    {
      slug: "feng-shui-desk-setup",
      title: "Home Office & Career Desk",
      subtitle: "Position your desk for executive focus & authority.",
      icon: Briefcase,
      color: "text-emerald-400",
      bg: "from-emerald-950/40",
    },
    {
      slug: "feng-shui-door-direction",
      title: "Front Door Compass Directions",
      subtitle: "Activate the Mouth of Chi to welcome wealth energy.",
      icon: Compass,
      color: "text-amber-400",
      bg: "from-amber-950/40",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-36 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Wisdom Library
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Feng Shui Guides
          </h1>
          <p className="text-xs text-slate-400">
            Master the foundational principles of spatial energy balance.
          </p>
        </div>

        <div className="space-y-3">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <Link
                key={g.slug}
                href={`/seo/${g.slug}`}
                className="block glass-panel hover:bg-emerald-950/30 p-4 rounded-3xl border border-emerald-500/15 transition active:scale-95 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-emerald-500/20 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${g.color}`} />
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {g.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-1">
                  {g.subtitle}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
