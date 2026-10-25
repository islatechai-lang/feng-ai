import Link from "next/link";
import { Sparkles, ArrowRight, Compass, ShieldCheck, CheckCircle2, Eye, Bed, MoveRight, Star, Heart } from "lucide-react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 shadow-lg shadow-emerald-950/50 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Classical Bagua & Spatial AI Combined</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              Upload your room photo. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 bg-clip-text text-transparent">
                Unlock harmonious Chi.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Tell us which way your door faces. Get your instant Feng Shui score, identify the #1 energy leak, and see an AI-rearranged room with your bed and desk in the true Command Position.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/analyze"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-xl shadow-emerald-950/80 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Analyze My Room — Free</span>
              </Link>

              <Link
                href="/seo/feng-shui-bedroom-layout"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center justify-center gap-2"
              >
                <span>Read the Guide</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No signup required for first result</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Private & encrypted uploads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Classical Ba Zhai & Eight Mansions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Interactive Before/After Preview */}
        <section className="py-12 bg-slate-900/30 border-y border-slate-800/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Interactive Transformation
              </h2>
              <p className="text-2xl sm:text-3xl font-black text-white">
                See How Spatial Rearrangement Changes Everything
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Drag the slider below to see a real bedroom transformation: resolving the dangerous "coffin position" and moving the bed into the authoritative Command Position.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <BeforeAfterSlider
                originalUrl="https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80"
                afterUrl="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
          </div>
        </section>

        {/* How It Works (3 Simple Steps) */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Effortless 3-Step Flow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              From Photo to Harmonious Sanctuary
            </h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              No complex floorplan drafting needed. Our spatial AI reads your room geometry in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 hover:border-emerald-600/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-lg">
                01
              </div>
              <h4 className="text-lg font-bold text-white">1. Snap a Photo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take a quick photo of your bedroom, office desk, or living area showing where the furniture sits relative to the door.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 hover:border-emerald-600/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold font-mono text-lg">
                02
              </div>
              <h4 className="text-lg font-bold text-white">2. Align Compass & Intention</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tap your main doorway's compass direction (or use your phone's built-in compass sensor) and pick your goal: Wealth, Sleep, Career, or Love.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 hover:border-emerald-600/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-lg">
                03
              </div>
              <h4 className="text-lg font-bold text-white">3. Reveal Score & Rearrangement</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive your 0-100 score, discover the #1 critical energy leak, and see the exact photorealistic furniture moves to restore balance.
              </p>
            </div>
          </div>
        </section>

        {/* The 4 Classical Principles Checked */}
        <section className="py-20 bg-slate-900/40 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-14">
              <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Classical Depth
              </h2>
              <h3 className="text-3xl sm:text-4xl font-black text-white">
                What the AI Evaluates Behind the Scenes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">Command Position</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ensures bed or desk diagonal to the door with clear sightline without direct alignment.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Coffin Position & Mirrors</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Flags beds directly aligned with entry doorways or reflective surfaces bouncing nocturnal Chi.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">Five Elements & Colors</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Balances Wood, Fire, Earth, Metal, and Water elements tailored to your sector direction.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h4 className="text-sm font-bold text-white">Personal Kua Directions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates your Eight Mansions Kua number to reveal your personal Sheng Chi and Tian Yi directions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Testimonials */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Loved by Movers & Redecorators
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Trusted Across Singapore, Manila, Jakarta & Worldwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "I had terrible insomnia in my new BTO condo for months. The app flagged that my bed was in the 'coffin position' and reflecting a wardrobe mirror. Moving it diagonally changed my sleep in three days."
              </p>
              <div className="text-xs font-bold text-white">
                Cheryl T. <span className="text-slate-400 font-normal">• Singapore</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "As someone working remotely from Manila, having my desk facing the wall with my back to the door was making me anxious. The command position rearrangement gave me so much peace of mind."
              </p>
              <div className="text-xs font-bold text-white">
                Mateo R. <span className="text-slate-400 font-normal">• Manila, Philippines</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The 2D floorplan diagram alone is worth it. It clearly showed my partner and me how the rushing Chi was escaping through our living room balcony."
              </p>
              <div className="text-xs font-bold text-white">
                Dian S. <span className="text-slate-400 font-normal">• Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Align Your Room's Energy?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Get your room's Feng Shui score and #1 fix in 15 seconds. Completely free to start.
            </p>
            <div>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-950/80 transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Free Analysis</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
