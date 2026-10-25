import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Compass } from "lucide-react";

interface GuideData {
  title: string;
  slug: string;
  subtitle: string;
  heroImg: string;
  afterImg: string;
  keyRule: string;
  commonMistakes: string[];
  remedies: string[];
  faq: Array<{ q: string; a: string }>;
}

const GUIDES: Record<string, GuideData> = {
  "feng-shui-bedroom-layout": {
    slug: "feng-shui-bedroom-layout",
    title: "Feng Shui Bedroom Layout: The Ultimate Guide to the Command Position",
    subtitle: "How to position your bed, avoid the coffin line, and eliminate sleep-disrupting Sha Chi.",
    heroImg: "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    keyRule: "Command Position: Place the head of the bed against a solid interior wall diagonal to the doorway. You must see the entrance clearly without being in direct line with the door opening.",
    commonMistakes: [
      "The Coffin Position: Sleeping with your feet pointing straight out the bedroom door.",
      "Headboard Under Window: Leaving your head vulnerable to drafty Chi leakage and lack of backing.",
      "Mirrors Facing the Bed: Reflecting sleeping bodies and amplifying restless nocturnal Chi.",
      "Overhead Beams: Heavy ceiling beams cutting horizontally across the chest or neck.",
    ],
    remedies: [
      "Center bed on a solid wall with at least 2 feet of walking space on each side for romantic balance.",
      "Use paired matching nightstands and soft 2700K warm lamps to anchor Earth element harmony.",
      "Clear all storage boxes from under the bed so Yin energy can circulate uninterrupted.",
    ],
    faq: [
      {
        q: "What if my bedroom is too small to move the bed out of the door line?",
        a: "Place a solid footboard, a bench, or a folding wooden screen between the foot of the bed and the door to deflect the rushing Sha Chi.",
      },
      {
        q: "Are mirrors in the bedroom completely forbidden?",
        a: "No, but they should be placed inside a wardrobe door or positioned on a wall where you cannot see your reflection from the pillow.",
      },
    ],
  },
  "feng-shui-desk-setup": {
    slug: "feng-shui-desk-setup",
    title: "Feng Shui for Desk & Home Office: Command Your Career Energy",
    subtitle: "Position your desk for authoritative focus, clear thinking, and professional advancement.",
    heroImg: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    keyRule: "Desk Command Position: Sit with a solid wall behind your back (The Tortoise) facing the room entryway diagonally, never with your back exposed to the entrance.",
    commonMistakes: [
      "Sitting with your back to the door (subconscious fight-or-flight startle response).",
      "Staring directly into a blank wall (metaphorically blocks career horizons and creative vision).",
      "Cluttered desk cords and wire nests (entangles mental focus and creates Si Chi).",
    ],
    remedies: [
      "Angle desk to face into the room with wide field of vision.",
      "Place a high-back ergonomic chair backed by a solid wall or sturdy bookcase.",
      "Keep the top-left corner (Wealth sector) activated with a healthy plant or desk lamp.",
    ],
    faq: [
      {
        q: "How do I fix a desk facing the wall if I cannot turn it around?",
        a: "Place a small convex mirror on your monitor or wall so you can see anyone approaching behind you without turning around.",
      },
    ],
  },
  "feng-shui-door-direction": {
    slug: "feng-shui-door-direction",
    title: "Feng Shui Front Door Compass Directions & The Nine Bagua Palaces",
    subtitle: "Identify which element rules your doorway and how to welcome prosperous Sheng Chi.",
    heroImg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    keyRule: "The Mouth of Chi: The main door is where all energy enters your dwelling. Its compass orientation dictates which Five-Element cures activate the household.",
    commonMistakes: [
      "Piled up shoes or umbrellas obstructing the inward swing of the front door.",
      "Direct front door to back window or sliding door alignment (Chi rush).",
      "Dimly lit entryway casting dark shadows on incoming opportunities.",
    ],
    remedies: [
      "Keep entryway threshold pristine and brightly illuminated with at least 500 lumens.",
      "Place a circular or oval welcome mat to soften and circulate incoming Chi.",
      "Add a healthy leafy plant near the entrance to welcome Sheng Chi.",
    ],
    faq: [
      {
        q: "How do I determine which way my front door faces?",
        a: "Stand inside your front door looking out toward the street with a compass held flat at waist level. The direction you look toward is your door facing direction.",
      },
    ],
  },
};

export function generateStaticParams() {
  return [
    { slug: "feng-shui-bedroom-layout" },
    { slug: "feng-shui-desk-setup" },
    { slug: "feng-shui-door-direction" },
  ];
}

export default async function SeoGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDES[slug];

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Compass className="w-4 h-4" />
            <span>Classical Feng Shui Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {guide.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {guide.subtitle}
          </p>
        </div>

        {/* Example Before/After Transformation Slider */}
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Real Layout Transformation Case Study</span>
          </h2>
          <BeforeAfterSlider
            originalUrl={guide.heroImg}
            afterUrl={guide.afterImg}
          />
        </div>

        {/* Key Classical Rule */}
        <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            The Fundamental Principle
          </div>
          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {guide.keyRule}
          </p>
        </div>

        {/* Common Mistakes */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Critical Feng Shui Mistakes to Avoid</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  !
                </span>
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Remedies */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Actionable Layout Remedies</span>
          </h3>
          <div className="space-y-2.5">
            {guide.remedies.map((remedy, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{remedy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {guide.faq.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-white">{item.q}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to analyze user's own room */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-black text-white">
            See Your Own Room Layout Analyzed
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Take a photo of your space now to receive your instant 0-100 Feng Shui score and AI layout rearrangement.
          </p>
          <div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Room Free</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
