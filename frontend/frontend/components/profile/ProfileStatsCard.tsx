"use client";

import { Trophy, Camera, Target } from "lucide-react";
import { getStoredTargets } from "@/lib/auth/targets";

export default function ProfileStatsCard() {
  const targets = getStoredTargets();

  return (
    <div className="mx-6 mt-4 grid grid-cols-3 gap-3">
      <div className="rounded-[24px] border border-white bg-white/20 p-4 shadow-[0_10px_30px_rgba(20,83,45,0.05)] backdrop-blur-xl text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-orange-500 bg-orange-50">
          <Trophy className="h-4 w-4" />
        </div>
        <div className="text-lg font-bold text-zinc-900">
          {targets?.target_calories?.toLocaleString("en-US") ?? "—"}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Calories
        </div>
      </div>
      <div className="rounded-[24px] border border-white bg-white/20 p-4 shadow-[0_10px_30px_rgba(20,83,45,0.05)] backdrop-blur-xl text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-blue-500 bg-blue-50">
          <Camera className="h-4 w-4" />
        </div>
        <div className="text-lg font-bold text-zinc-900">
          {targets?.target_protein ?? "—"}g
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Protein
        </div>
      </div>
      <div className="rounded-[24px] border border-white bg-white/20 p-4 shadow-[0_10px_30px_rgba(20,83,45,0.05)] backdrop-blur-xl text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-emerald-500 bg-emerald-50">
          <Target className="h-4 w-4" />
        </div>
        <div className="text-lg font-bold text-zinc-900">
          {targets?.target_fats ?? "—"}g
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Fats
        </div>
      </div>
    </div>
  );
}