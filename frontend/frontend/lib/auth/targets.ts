/**
 * Nutrition targets storage helpers.
 */
import { STORAGE_KEYS } from "@/lib/constants/app";

export interface Targets {
  target_calories: number;
  target_protein: number;
  target_fats: number;
  late_meal_threshold: number;
}

export function getStoredTargets(): Targets | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.TARGETS);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Targets;
  } catch {
    return null;
  }
}

export function setStoredTargets(targets: Targets): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
}
