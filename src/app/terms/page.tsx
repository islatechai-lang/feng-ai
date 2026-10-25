import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>
        </div>

        <div className="prose prose-invert text-xs text-slate-300 leading-relaxed space-y-4">
          <h3 className="text-sm font-bold text-white">1. Agreement to Terms</h3>
          <p>
            By accessing or using FengShui AI, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our services.
          </p>

          <h3 className="text-sm font-bold text-white">2. Description of Service</h3>
          <p>
            FengShui AI provides automated spatial layout diagnoses and generative interior suggestions based on classical Feng Shui guidelines. One free analysis is offered per device/guest session, followed by optional single room unlocks, weekly mover passes, or annual subscriptions.
          </p>

          <h3 className="text-sm font-bold text-white">3. Fair Use & Image Generation Caps</h3>
          <p>
            To prevent server abuse and bot flooding, paid plans include fair-use caps on AI image generations (e.g. up to 15 image revisions per room on single unlocks, and 50 revisions per week on weekly passes). Automated scraping or reverse engineering of UnoRouter endpoints is strictly prohibited.
          </p>

          <h3 className="text-sm font-bold text-white">4. Subscriptions & Billing</h3>
          <p>
            Weekly passes and Annual Pro subscriptions automatically renew at the specified billing intervals unless canceled at least 24 hours prior to the next billing date. You can cancel your subscription at any time via your account billing portal.
          </p>

          <h3 className="text-sm font-bold text-white">5. Refunds</h3>
          <p>
            If you experience technical issues where the AI pipeline fails to produce your paid report, our support team will provide credits or a prompt refund upon request within 14 days of purchase.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
