"use client";

import { Target, Weight, Zap } from "lucide-react";
import { getStoredTargets } from "@/lib/auth/targets";
import { getStoredProfile } from "@/lib/auth/profile";

export default function GoalSettingsCard() {
  const targets = getStoredTargets();
  const profile = getStoredProfile();

  const goals = [
    { label: "Daily Calories", value: targets ? `${targets.target_calories.toLocaleString("en-US")} kcal` : "Not set", icon: Zap, color: "text-amber-500" },
    { label: "Protein Target", value: targets ? `${targets.target_protein}g` : "Not set", icon: Target, color: "text-emerald-500" },
    { label: "Current Weight", value: profile ? `${profile.weight} kg` : "Not set", icon: Weight, color: "text-sky-500" },
  ];

  return (
    <div className="mx-6 mt-4 rounded-[28px] border border-white bg-white/20 p-6 shadow-[0_20px_60px_rgba(20,83,45,0.08)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">My Goals</h3>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.label} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/80">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${goal.color} bg-zinc-50`}>
                <goal.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-zinc-600">{goal.label}</span>
            </div>
            <span className="text-sm font-bold text-zinc-900">{goal.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}