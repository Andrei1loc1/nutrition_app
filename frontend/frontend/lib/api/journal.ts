/**
 * Journal API client.
 */
import { apiFetch } from "./client";
import type { MealData } from "@/lib/types";

export async function fetchJournalMeals(start: Date, end: Date): Promise<MealData[]> {
  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
  });
  const data = await apiFetch<{ data: MealData[] }>(`/api/journal?${params.toString()}`);
  return data.data ?? [];
}

export async function deleteJournalMeal(mealId: string): Promise<void> {
  await apiFetch(`/api/journal/${mealId}`, {
    method: "DELETE",
  });
}
