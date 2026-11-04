import { STORAGE_KEYS } from "@/lib/constants/app";

export interface ProfileData {
  displayName: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  activityLevel: string;
  sleepTime: string;
}

export function getStoredProfile(): ProfileData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProfileData;
  } catch {
    return null;
  }
}

export function setStoredProfile(data: ProfileData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data));
}