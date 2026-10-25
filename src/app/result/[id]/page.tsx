"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { AnnotatedPhoto } from "@/components/AnnotatedPhoto";
import { FloorPlanDiagram } from "@/components/FloorPlanDiagram";
import { LuckyGuide } from "@/components/LuckyGuide";
import { PaywallModal } from "@/components/PaywallModal";
import { ShareCardModal } from "@/components/ShareCardModal";
import { FengShuiResult, IssueSeverity } from "@/types";
import {
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  Compass,
  Layers,
  Share2,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ResultContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const analysisId = resolvedParams.id;
  const searchParams = useSearchParams();

  // Result state
  const [record, setRecord] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"slider" | "annotated" | "diagram" | "guide">("slider");

  // Modals
  const [showPaywall, setShowPaywall] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Check if redirected from Stripe success with ?unlocked=true
    const queryUnlocked = searchParams.get("unlocked") === "true";

    // Load analysis from sessionStorage or localStorage
    let loaded: any = null;
    try {
      const sessionData = sessionStorage.getItem(`analysis_${analysisId}`);
      if (sessionData) {
        loaded = JSON.parse(sessionData);
      } else {
        const storedList = JSON.parse(localStorage.getItem("fengshui_analyses") || "[]");
        loaded = storedList.find((item: any) => item.id === analysisId);
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }

    if (loaded) {
      if (queryUnlocked) {
        loaded.isUnlocked = true;
        setIsUnlocked(true);
      } else {
        setIsUnlocked(loaded.isUnlocked || false);
      }
      setRecord(loaded);
    } else {
      // Create fallback demo record if navigated directly
      const fallbackRecord = {
        id: analysisId,
        roomType: "bedroom",
        doorDirection: "SW",
        goal: "sleep",
        birthYear: 1993,
        originalImageUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80",
        editedImageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
        score: 54,
        isUnlocked: queryUnlocked,
        result: {
          score: 54,
          grade: "D",
          summary: "Your bedroom suffers from direct doorway Sha Chi alignment ('Coffin Position') and an unshielded reflective mirror.",
          biggestProblem: {
            title: "Critical: The 'Coffin Position' (Bed in Line with Door)",
            description: "Your bed is placed directly in line with the entryway, with the feet pointing straight out the door. In classical Feng Shui, rushing energy (Sha Chi) enters violently through the doorway like a wind tunnel, striking your body while you sleep.",
            quickFix: "Shift the bed diagonally opposite the doorway against a solid interior wall.",
            severity: "critical" as IssueSeverity,
          },
          issues: [
            {
              id: "coffin_position",
              title: "Critical: The 'Coffin Position' (Bed in Line with Door)",
              severity: "critical" as IssueSeverity,
              what: "Your bed is placed directly in line with the entryway.",
              why: "Sha Chi rushes through the open doorway like a wind tunnel, disrupting deep REM rejuvenation.",
              fix: "Shift bed diagonally opposite the doorway against a solid wall.",
              whichObject: "Bed",
              pinCoordinates: { x: 50, y: 70 },
            },
            {
              id: "mirror_facing_bed",
              title: "Mirror Reflecting the Sleeping Area",
              severity: "warning" as IssueSeverity,
              what: "A dresser mirror directly reflects your bed.",
              why: "Mirrors bounce dynamic Water Chi, causing nighttime restlessness and insomnia.",
              fix: "Relocate mirror to adjacent wall away from sleeping sightlines.",
              whichObject: "Mirror",
              pinCoordinates: { x: 25, y: 35 },
            },
            {
              id: "clutter_and_chi_choke",
              title: "Stagnant Chi Accumulation (Clutter)",
              severity: "warning" as IssueSeverity,
              what: "Under-bed storage and clothes hamper blocking floor pathway.",
              why: "Creates stagnant Si Chi that leads to mental fog and sluggish mornings.",
              fix: "Clear under-bed floor so Yin Chi can circulate smoothly.",
              whichObject: "Floor & Pathways",
              pinCoordinates: { x: 30, y: 80 },
            },
          ],
          suggestedMoves: [
            {
              item: "King Bed",
              from: "Direct line with the entrance doorway",
              to: "Diagonally across from the door against the solid North-East wall with clear view of entry",
              reason: "Establishes True Command Position and eliminates Sha Chi.",
            },
            {
              item: "Vanity Mirror",
              from: "Directly reflecting the mattress",
              to: "Beside door away from sleep sightlines",
              reason: "Prevents restless nocturnal Chi bounce.",
            },
          ],
          luckyGuide: {
            primaryElement: "earth",
            luckyColors: ["Soft Taupe", "Warm Linen", "Dusty Rose"],
            luckyDirections: ["SW", "NE", "NW", "W"],
            decorSuggestions: [
              {
                item: "Air-purifying ZZ Plant",
                element: "wood",
                placement: "Corner near doorway",
                purpose: "Filters environmental toxins and lifts sluggish corner Chi",
                color: "Emerald Green",
              },
            ],
          },
        },
      };
      setRecord(fallbackRecord);
      setIsUnlocked(queryUnlocked);
    }

    // Fire celebratory confetti on score reveal
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#14b8a6", "#f59e0b"],
    });
  }, [analysisId, searchParams]);

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    if (record) {
      const updated = { ...record, isUnlocked: true };
      setRecord(updated);
      try {
        sessionStorage.setItem(`analysis_${analysisId}`, JSON.stringify(updated));
        const stored = JSON.parse(localStorage.getItem("fengshui_analyses") || "[]");
        localStorage.setItem(
          "fengshui_analyses",
          JSON.stringify(stored.map((a: any) => (a.id === analysisId ? updated : a)))
        );
      } catch (e) {
        console.warn(e);
      }
    }
    // Confetti burst for unlock!
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#10b981", "#3b82f6", "#ec4899", "#f59e0b"],
    });
  };

  if (!record) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Loading room analysis...
      </div>
    );
  }

  const result: FengShuiResult = record.result;
  const score = result.score;
  const grade = result.grade;
  const biggestProblem = result.biggestProblem;

  // Score color badge
  const scoreBadgeBg =
    score >= 80 ? "text-emerald-400 border-emerald-500/50" : score >= 60 ? "text-amber-400 border-amber-500/50" : "text-rose-400 border-rose-500/50";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Summary Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                Spatial Feng Shui Diagnosis
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-mono capitalize text-slate-400">
                {record.roomType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Room Analysis & Alignment Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {result.summary}
            </p>
          </div>

          {/* Overall Score Dial */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Feng Shui Score
              </div>
              <div className={`text-3xl sm:text-4xl font-black font-mono flex items-baseline justify-center gap-1 ${scoreBadgeBg}`}>
                <span>{score}</span>
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">
                Grade: <span className="font-mono text-emerald-400">{grade}</span>
              </div>
            </div>

            <div className="border-l border-slate-800 pl-4 space-y-1">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share Card</span>
              </button>

              {!isUnlocked && (
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Full</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section: #1 Biggest Problem (Always Free) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-slate-950 border border-rose-800/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Primary Energy Leak Identified</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
              Severity: Critical
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {biggestProblem.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {biggestProblem.description}
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-200">
              <strong className="text-emerald-400 block mb-0.5">Recommended Remedy:</strong>
              {biggestProblem.quickFix}
            </div>
          </div>
        </div>

        {/* Unlocked / Locked Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("slider")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "slider"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Before / After Transformation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isUnlocked) setShowPaywall(true);
              else setActiveTab("annotated");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "annotated"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {!isUnlocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>Annotated Problem Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isUnlocked) setShowPaywall(true);
              else setActiveTab("diagram");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "diagram"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {!isUnlocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>2D Floor Plan (Before vs After)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isUnlocked) setShowPaywall(true);
              else setActiveTab("guide");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "guide"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {!isUnlocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>Lucky Directions & Kua</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === "slider" && (
          <div className="space-y-6">
            <BeforeAfterSlider
              originalUrl={record.originalImageUrl}
              afterUrl={record.editedImageUrl}
              isLocked={!isUnlocked}
              onUnlockClick={() => setShowPaywall(true)}
            />

            {/* Teaser of More Issues Found if Free/Locked */}
            {!isUnlocked && (
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">
                      Additional Issues Detected in Your Room ({result.issues.length - 1} More)
                    </h4>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Locked
                  </span>
                </div>

                <div className="space-y-2.5">
                  {result.issues.slice(1).map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between select-none filter blur-[4px] hover:blur-[3px] transition"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase">
                          {issue.severity} Issue
                        </span>
                        <div className="text-xs font-bold text-white">
                          {issue.title}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaywall(true)}
                    className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 shadow-xl shadow-emerald-950/60 transition active:scale-95"
                  >
                    Unlock All {result.issues.length} Issues & Cures ($3.99)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Annotated Photo (Paid) */}
        {activeTab === "annotated" && isUnlocked && (
          <AnnotatedPhoto
            imageUrl={record.originalImageUrl}
            issues={result.issues}
          />
        )}

        {/* Tab 3: Floor Plan Diagram (Paid) */}
        {activeTab === "diagram" && isUnlocked && (
          <FloorPlanDiagram
            beforeSvg={result.svgLayoutDiagram?.beforeSvg || record.svgBefore || ""}
            afterSvg={result.svgLayoutDiagram?.afterSvg || record.svgAfter || ""}
            suggestedMoves={result.suggestedMoves}
          />
        )}

        {/* Tab 4: Lucky Guide & Kua (Paid) */}
        {activeTab === "guide" && isUnlocked && (
          <LuckyGuide
            primaryElement={result.luckyGuide.primaryElement}
            luckyColors={result.luckyGuide.luckyColors}
            luckyDirections={result.luckyGuide.luckyDirections}
            kuaInfo={result.luckyGuide.kuaInfo}
            decorSuggestions={result.luckyGuide.decorSuggestions}
          />
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUnlockSuccess={handleUnlockSuccess}
        analysisId={analysisId}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        score={score}
        grade={grade}
        roomType={record.roomType}
        goal={record.goal}
        originalUrl={record.originalImageUrl}
        afterUrl={record.editedImageUrl}
      />

      <Footer />
    </div>
  );
}

export default function ResultPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          Loading room analysis...
        </div>
      }
    >
      <ResultContent {...props} />
    </Suspense>
  );
}
