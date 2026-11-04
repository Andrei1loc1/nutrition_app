"use client";

import { useState, useEffect, useMemo } from "react";
import {
  fetchTodayTotals,
  fetchRecentMeal,
  fetchDailyCaloriesHistory,
  fetchBackendInputs,
  fetchMealFoodClasses,
  type DailyTotals,
  type RecentMealResult,
} from "@/lib/api/home";
import { fetchHealthyScore, fetchMindScore } from "@/lib/api/backend";
import {
  calculateScoreTrend,
  calculateMacroPercentages,
} from "@/lib/services/nutrition/calculations";

export interface HomeData {
  loading: boolean;
  error: string | null;
  totals: DailyTotals;
  recentMeal: RecentMealResult | null;
  nutritionScore: number;
  scoreTrend: number[];
  brainHealthScore: number;
}

export function useHomeData(): HomeData {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<DailyTotals>({
    calories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    mealCount: 0,
  });
  const [recentMeal, setRecentMeal] = useState<RecentMealResult | null>(null);
  const [dailyHistory, setDailyHistory] = useState<number[]>([]);
  const [nutritionScore, setNutritionScore] = useState(0);
  const [brainHealthScore, setBrainHealthScore] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [totalsRes, recentRes, historyRes, inputs] = await Promise.all([
          fetchTodayTotals(),
          fetchRecentMeal(),
          fetchDailyCaloriesHistory(8),
          fetchBackendInputs(7),
        ]);

        if (!cancelled) {
          setTotals(totalsRes);
          setRecentMeal(recentRes);
          setDailyHistory(historyRes);
        }

        if (totalsRes.mealCount === 0) {
          if (!cancelled) setLoading(false);
          return;
        }

        const [scoreRes, mindFoodClasses] = await Promise.all([
          fetchHealthyScore(inputs),
          fetchMealFoodClasses(7),
        ]);
        if (!cancelled) {
          setNutritionScore(scoreRes.healthy_score);
        }

        const mindRes = await fetchMindScore(mindFoodClasses);
        if (!cancelled) {
          setBrainHealthScore(Math.round(mindRes.brain_nutrition_score));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const scoreTrend = useMemo(() => calculateScoreTrend(dailyHistory), [dailyHistory]);

  return { loading, error, totals, recentMeal, nutritionScore, scoreTrend, brainHealthScore };
}

export function useMacroPercentages(totals: DailyTotals) {
  return useMemo(() => calculateMacroPercentages(totals), [totals]);
}
