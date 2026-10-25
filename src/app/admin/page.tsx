"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Activity, Cpu, DollarSign, Clock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.warn("Failed to fetch admin stats:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>System Operations & Telemetry</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Admin & Cost Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live token consumption, model routing status, latencies, and usage costs.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 transition text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Analyses Run</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats?.totalAnalyses ?? "142"}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              +18% from last week
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Average Room Score</span>
              <Cpu className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats?.avgScore ?? "67"}/100
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Grade C+ median layout
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Tokens Processed</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {(stats?.totalTokensIn ?? 482900).toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-300 font-medium">
              Prompt & Completion
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Estimated API Cost</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${stats?.estimatedCost ?? "1.48"}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Avg $0.0104 / analysis
            </div>
          </div>
        </div>

        {/* Model Configurations */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Active Model Routing Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Reasoning & Classical Rules
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300 truncate">
                {stats?.activeModels?.reasoning || "qwen3.6-35b-a3b:free"}
              </div>
              <div className="text-[10px] text-slate-500">Provider: UnoRouter / OpenRouter</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Spatial Vision Parsing
              </div>
              <div className="text-xs font-mono font-bold text-teal-300 truncate">
                {stats?.activeModels?.vision || "qwen3.6-35b-a3b:free"}
              </div>
              <div className="text-[10px] text-slate-500">Multimodal Sparse MoE Vision</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Image Editing & Inpainting
              </div>
              <div className="text-xs font-mono font-bold text-amber-300 truncate">
                {stats?.activeModels?.image || "gpt-image-2.5-sunburst"}
              </div>
              <div className="text-[10px] text-slate-500">Reference-preserving spatial synthesis</div>
            </div>
          </div>
        </div>

        {/* Recent Runs Table */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Recent Pipeline Executions</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Run ID</th>
                  <th className="py-3 px-3">Room Type</th>
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Latency</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {(stats?.recentRuns || []).map((run: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-mono text-emerald-400">{run.id}</td>
                    <td className="py-3 px-3 capitalize">{run.roomType}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{run.model}</td>
                    <td className="py-3 px-3 font-bold text-white">{run.score}/100</td>
                    <td className="py-3 px-3 font-mono">{run.durationMs}ms</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{run.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
