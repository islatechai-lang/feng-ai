"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
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
  ArrowRight,
  Check,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  Flame,
  Leaf,
  Droplet,
  Mountain,
  CircleDot,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ResultContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const analysisId = resolvedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Result state
  const [record, setRecord] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "checklist" | "floorplan" | "kua" | "remedies">("visual");

  // Interactive Checklist State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Modals
  const [showPaywall, setShowPaywall] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const queryUnlocked = searchParams.get("unlocked") === "true";

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
      // High quality fallback demo
      const fallbackRecord = {
        id: analysisId,
        roomType: "bedroom",
        doorDirection: "SW",
        goal: "sleep",
        birthYear: 1996,
        originalImageUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80",
        editedImageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
        score: 54,
        isUnlocked: queryUnlocked,
        result: {
          score: 54,
          grade: "D",
          summary: "Your space suffers from direct doorway Sha Chi alignment ('Coffin Position') and an unshielded reflective mirror facing the sleeping area.",
          biggestProblem: {
            title: "Critical: The 'Coffin Position' (Bed in Line with Door)",
            description: "Your bed is placed directly in line with the entryway, with the feet pointing straight out the door. In classical Feng Shui, rushing energy (Sha Chi) strikes your body while sleeping, preventing restorative deep sleep.",
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
              fix: "Shift bed diagonally opposite the doorway against a solid interior wall.",
              whichObject: "Bed",
              pinCoordinates: { x: 50, y: 70 },
            },
            {
              id: "mirror_facing_bed",
              title: "Mirror Directly Reflecting the Bed",
              severity: "warning" as IssueSeverity,
              what: "A dresser mirror directly reflects your sleeping body.",
              why: "Mirrors bounce dynamic Water Chi, causing nighttime restlessness, anxiety, and insomnia.",
              fix: "Angle or relocate mirror away from your direct sleeping sightlines.",
              whichObject: "Mirror",
              pinCoordinates: { x: 25, y: 35 },
            },
            {
              id: "clutter_and_chi_choke",
              title: "Stagnant Chi Accumulation (Under-Bed Clutter)",
              severity: "warning" as IssueSeverity,
              what: "Under-bed storage blocking floor circulation.",
              why: "Creates stagnant Si Chi that causes brain fog and morning fatigue.",
              fix: "Clear under-bed floor so Yin Chi can circulate smoothly.",
              whichObject: "Floor & Pathways",
              pinCoordinates: { x: 30, y: 80 },
            },
          ],
          suggestedMoves: [
            {
              item: "Bed",
              from: "Direct line with the entrance doorway",
              to: "Diagonally across from the door against the solid North-East wall with clear view of entry",
              reason: "Establishes True Command Position, protects aura, eliminates Sha Chi.",
            },
            {
              item: "Vanity Mirror",
              from: "Directly reflecting the mattress",
              to: "Beside door away from sleep sightlines",
              reason: "Prevents restless nocturnal Chi bounce.",
            },
            {
              item: "Storage Boxes",
              from: "Beneath the bed frame",
              to: "Inside closed wardrobe",
              reason: "Restores continuous Chi circulation around your aura.",
            },
          ],
          luckyGuide: {
            primaryElement: "earth",
            luckyColors: ["Soft Taupe", "Warm Linen", "Dusty Terracotta"],
            luckyDirections: ["SW", "NE", "NW", "W"],
            decorSuggestions: [
              {
                item: "Air-purifying Jade Plant",
                element: "wood",
                placement: "South-East Wealth Corner",
                purpose: "Attracts prosperous growth energy and cleanses indoor air toxins",
                color: "Emerald Green",
              },
              {
                item: "Warm 2700K Ceramic Table Lamp",
                element: "fire",
                placement: "Beside bed on solid nightstand",
                purpose: "Softens aggressive Metal Chi and creates tranquil Yin ambiance",
                color: "Warm Cream / Amber",
              },
            ],
          },
        },
      };
      setRecord(fallbackRecord);
      setIsUnlocked(queryUnlocked);
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#14b8a6", "#f59e0b"],
    });
  }, [analysisId, searchParams]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

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

  const scoreBadgeBg =
    score >= 80
      ? "text-emerald-400 border-emerald-500/50"
      : score >= 60
      ? "text-amber-400 border-amber-500/50"
      : "text-rose-400 border-rose-500/50";

  return (
    <div className="min-h-screen flex flex-col bg-[#020e0c] text-slate-100 pb-28 selection:bg-emerald-500 selection:text-slate-950">
      <TopHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 space-y-4">
        {/* 1. Master Score & Room Diagnosis Header */}
        <div className="glass-panel-elevated p-4 rounded-3xl border border-emerald-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                AI Feng Shui Audit
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono capitalize text-slate-400">
                {record.roomType}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold glass-pill text-slate-200 hover:text-white transition"
              >
                <Share2 className="w-3 h-3 text-emerald-400" />
                <span>Share</span>
              </button>

              {!isUnlocked && (
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 transition shadow font-mono"
                >
                  <Unlock className="w-3 h-3 text-slate-950" />
                  <span>PRO $3.99</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="space-y-1">
              <h1 className="text-lg font-black text-white tracking-tight">
                Chi Energy Status
              </h1>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Score Ring */}
            <div className="p-3 rounded-2xl glass-panel border border-emerald-500/30 text-center shrink-0">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                Chi Score
              </div>
              <div className={`text-2xl font-black font-mono leading-none ${scoreBadgeBg}`}>
                {score}
              </div>
              <div className="text-[9px] font-mono text-emerald-300 font-bold mt-1">
                Grade {grade}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Critical Energy Leak #1 (Always Free) */}
        <div className="glass-panel p-4 rounded-3xl border border-rose-500/25 space-y-2.5 shadow-lg bg-rose-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>#1 Critical Energy Leak</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
              Immediate Fix
            </span>
          </div>

          <h3 className="text-sm font-bold text-white leading-tight">
            {biggestProblem.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {biggestProblem.description}
          </p>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-xs text-slate-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <strong className="text-emerald-400 block mb-0.5 font-bold">
                Recommended Solution:
              </strong>
              {biggestProblem.quickFix}
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="glass-pill p-1 rounded-2xl flex items-center gap-1 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`flex-1 py-1.5 px-2 rounded-xl transition whitespace-nowrap text-center ${
              activeTab === "visual"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Visual Edit
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`flex-1 py-1.5 px-2 rounded-xl transition whitespace-nowrap text-center ${
              activeTab === "checklist"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Action Plan
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isUnlocked) setShowPaywall(true);
              else setActiveTab("floorplan");
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1 ${
              activeTab === "floorplan"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {!isUnlocked && <Lock className="w-3 h-3 text-amber-400" />}
            <span>2D Layout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isUnlocked) setShowPaywall(true);
              else setActiveTab("kua");
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl transition whitespace-nowrap flex items-center justify-center gap-1 ${
              activeTab === "kua"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {!isUnlocked && <Lock className="w-3 h-3 text-amber-400" />}
            <span>Kua Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("remedies")}
            className={`flex-1 py-1.5 px-2 rounded-xl transition whitespace-nowrap text-center ${
              activeTab === "remedies"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cures
          </button>
        </div>

        {/* Tab 1: Visual Relayout (Before / After Slider) */}
        {activeTab === "visual" && (
          <div className="space-y-4">
            <BeforeAfterSlider
              originalUrl={record.originalImageUrl}
              afterUrl={record.editedImageUrl}
              isLocked={false}
            />

            {/* Suggested Furniture Shifts Card */}
            <div className="glass-panel p-4 rounded-3xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Furniture Relocations Made</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {result.suggestedMoves.length} moves
                </span>
              </div>

              <div className="space-y-2">
                {result.suggestedMoves.map((move, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-emerald-500/15 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">
                        {move.item}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                        Command Position
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-500 line-through mr-1">
                        {move.from}
                      </span>
                      <span className="text-emerald-400 font-medium">
                        ➜ {move.to}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-0.5">
                      {move.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Teaser Banner if Free */}
            {!isUnlocked && (
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-950 to-teal-950/40 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      Unlock Master Feng Shui Pack
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    $3.99 Single
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Includes 2D architectural blueprint vectors, personal Kua directions, all {result.issues.length} detected hazards, and printable PDF audit report.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Full Analysis ($3.99)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Interactive Priority Action Checklist */}
        {activeTab === "checklist" && (
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-3xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Actionable Harmonization Plan</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {Object.values(completedSteps).filter(Boolean).length} / {result.issues.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {result.issues.map((issue, idx) => {
                  const isDone = !!completedSteps[issue.id];
                  return (
                    <div
                      key={issue.id}
                      onClick={() => toggleStep(issue.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                        isDone
                          ? "bg-emerald-950/40 border-emerald-500/50 opacity-80"
                          : "bg-slate-950/70 border-slate-800 hover:border-emerald-500/30"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                          isDone
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : "border border-slate-600 bg-slate-900"
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isDone ? "line-through text-slate-400" : "text-white"
                            }`}
                          >
                            {issue.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              issue.severity === "critical"
                                ? "bg-rose-950/80 text-rose-300"
                                : "bg-amber-950/80 text-amber-300"
                            }`}
                          >
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {issue.fix}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 2D Layout & Chi Vectors (Paid) */}
        {activeTab === "floorplan" && isUnlocked && (
          <FloorPlanDiagram
            beforeSvg={result.svgLayoutDiagram?.beforeSvg || record.svgBefore || ""}
            afterSvg={result.svgLayoutDiagram?.afterSvg || record.svgAfter || ""}
            suggestedMoves={result.suggestedMoves}
          />
        )}

        {/* Tab 4: Kua Map & Five Elements (Paid) */}
        {activeTab === "kua" && isUnlocked && (
          <LuckyGuide
            primaryElement={result.luckyGuide.primaryElement}
            luckyColors={result.luckyGuide.luckyColors}
            luckyDirections={result.luckyGuide.luckyDirections}
            kuaInfo={result.luckyGuide.kuaInfo}
            decorSuggestions={result.luckyGuide.decorSuggestions}
          />
        )}

        {/* Tab 5: Cures & Curated Decor */}
        {activeTab === "remedies" && (
          <div className="space-y-3">
            <div className="glass-panel p-4 rounded-3xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Personalized Energy Cures</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Targeted Elements
                </span>
              </div>

              <div className="space-y-3">
                {result.luckyGuide.decorSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">
                        {item.item}
                      </span>
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        {item.element} Element
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-400">Placement:</strong>{" "}
                      {item.placement}
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {item.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Rescan or Re-check */}
        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 transition py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Room</span>
          </button>
        </div>
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

      <BottomNav />
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
