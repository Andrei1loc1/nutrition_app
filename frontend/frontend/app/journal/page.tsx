"use client";

import { useUser } from "@/hooks/useUser";
import JournalHeader from "@/components/journal/JournalHeader";
import DailySummaryCard from "@/components/journal/DailySummaryCard";
import MealTimeline, { type JournalMeal } from "@/components/journal/MealTimeline";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJournalMeals } from "@/lib/api/journal";
import { mapToJournalMeal, calculateDailySummary } from "@/lib/services/journal/mappers";
import type { MealData } from "@/lib/types";

export default function JournalPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [meals, setMeals] = useState<MealData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/onboarding");
      return;
    }
    if (userLoading) return;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    fetchJournalMeals(start, end)
      .then((data) => setMeals(data))
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, [user, userLoading, router]);

  if (userLoading || loading) {
    return (
      <div className="space-y-4 pb-14">
        <JournalHeader />
        <div className="mx-6 flex items-center justify-center h-32">
          <div className="h-8 w-8 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  const summary = calculateDailySummary(meals);
  const timelineMeals: JournalMeal[] = meals.map(mapToJournalMeal);

  function handleMealDeleted(mealId: string) {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  }

  return (
    <div className="space-y-4 pb-14">
      <JournalHeader />
      <DailySummaryCard mealCount={meals.length} {...summary} />
      <MealTimeline meals={timelineMeals} onMealDeleted={handleMealDeleted} />
    </div>
  );
}
