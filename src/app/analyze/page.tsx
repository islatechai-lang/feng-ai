"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020e0c] flex items-center justify-center text-xs text-emerald-300">
      Opening Room Scanner...
    </div>
  );
}
