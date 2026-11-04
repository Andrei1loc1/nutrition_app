"use client";

import { useState, useEffect, useMemo } from "react";
import {
  fetchReport,
  fetchWeeklyCalories,
  getMonthRange,
  formatMonthRange,
  type ReportData,
  type DailyCalories,
} from "@/lib/api/reports";
import { fetchBackendInputs, fetchMealFoodClasses } from "@/lib/api/home";
import { fetchRecommendation, fetchMindScore } from "@/lib/api/backend";
import {
  mapAgentToRecommendation,
  calculateTotalCalories,
  calculateAverageDailyCalories,
} from "@/lib/services/reports/builder";

export interface ReportState {
  reportData: ReportData | null;
  weeklyCalories: DailyCalories[] | null;
  loading: boolean;
  error: string | null;
  dateRangeLabel: string;
  rangeStart: string;
  rangeEnd: string;
  totalCalories: number;
  averageDailyCalories: number;
  brainHealthScore: number;
}

export function useReports(): ReportState {
  const { start, end } = useMemo(() => getMonthRange(), []);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [weeklyCalories, setWeeklyCalories] = useState<DailyCalories[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brainHealthScore, setBrainHealthScore] = useState(0);

  const dateRangeLabel = useMemo(() => formatMonthRange(start, end), [start, end]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [report, calories, inputs] = await Promise.all([
          fetchReport(start, end),
          fetchWeeklyCalories(start, end),
          fetchBackendInputs(7),
        ]);

        if (cancelled) return;

        let recommendations = report.recommendations;

        try {
          const recRes = await fetchRecommendation(inputs);
          recommendations = [mapAgentToRecommendation(recRes)];
        } catch {
          // fallback to server-side recommendations
        }

        try {
          const mindFoodClasses = await fetchMealFoodClasses(7);
          const mindRes = await fetchMindScore(mindFoodClasses);
          if (!cancelled) {
            setBrainHealthScore(Math.round(mindRes.brain_nutrition_score));
            recommendations = [
              ...recommendations,
              { title: "Brain nutrition", description: mindRes.recommendation },
            ];
          }
        } catch {
          // fallback — brainHealthScore stays 0
        }

        if (!cancelled) {
          setReportData({ ...report, recommendations });
          setWeeklyCalories(calories);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load report");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [start, end]);

  const totalCalories = useMemo(
    () => calculateTotalCalories(weeklyCalories, reportData?.totals.calories),
    [weeklyCalories, reportData]
  );

  const averageDailyCalories = useMemo(() => {
    const activeDays = weeklyCalories?.filter((d) => d.calories > 0).length ?? null;
    return calculateAverageDailyCalories(totalCalories, activeDays);
  }, [totalCalories, weeklyCalories]);

  return {
    reportData,
    weeklyCalories,
    loading,
    error,
    dateRangeLabel,
    rangeStart: start,
    rangeEnd: end,
    totalCalories,
    averageDailyCalories,
    brainHealthScore,
  };
}
