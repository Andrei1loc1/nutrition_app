"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredTargets, setStoredTargets, type Targets } from "@/lib/auth/targets";
import { NUTRITION_GOALS } from "@/lib/constants/nutrition";
import { ArrowLeft } from "lucide-react";

export default function EditGoalsPage() {
  const router = useRouter();
  const [targets, setTargets] = useState<Targets | null>(null);

  useEffect(() => {
    const stored = getStoredTargets();
    if (!stored) {
      router.replace("/onboarding");
      return;
    }
    setTargets(stored);
  }, [router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!targets) return;

    const form = e.currentTarget;
    const updated: Targets = {
      target_calories: Number((form.elements.namedItem("target_calories") as HTMLInputElement).value),
      target_protein: Number((form.elements.namedItem("target_protein") as HTMLInputElement).value),
      target_fats: Number((form.elements.namedItem("target_fats") as HTMLInputElement).value),
      late_meal_threshold: targets.late_meal_threshold,
    };

    setStoredTargets(updated);
    router.push("/profile");
  }

  if (!targets) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-6 px-6 relative">
      <div className="relative z-10 w-full max-w-[400px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/profile")}
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm text-zinc-700 hover:bg-white/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-zinc-900">Edit Goals</h1>
        </div>

        <div className="rounded-[32px] border border-white/60 bg-white/30 backdrop-blur-2xl p-6 shadow-[0_32px_80px_rgba(20,83,45,0.12)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Daily Calories (kcal)
              </label>
              <input
                type="number"
                name="target_calories"
                required
                min="500"
                max="15000"
                defaultValue={targets.target_calories ?? NUTRITION_GOALS.CALORIES}
                placeholder={`${NUTRITION_GOALS.CALORIES}`}
                className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Protein Target (g)
              </label>
              <input
                type="number"
                name="target_protein"
                required
                min="10"
                max="1000"
                defaultValue={targets.target_protein ?? NUTRITION_GOALS.PROTEIN}
                placeholder={`${NUTRITION_GOALS.PROTEIN}`}
                className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Fat Target (g)
              </label>
              <input
                type="number"
                name="target_fats"
                required
                min="5"
                max="500"
                defaultValue={targets.target_fats ?? NUTRITION_GOALS.FATS}
                placeholder={`${NUTRITION_GOALS.FATS}`}
                className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-[0_12px_40px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Save Goals
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
