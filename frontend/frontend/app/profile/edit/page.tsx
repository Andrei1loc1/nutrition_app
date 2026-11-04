"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredProfile, setStoredProfile, ProfileData } from "@/lib/auth/profile";
import { getStoredUser, setStoredUser } from "@/lib/auth/user";

const fieldDelay = (index: number) => `${100 + index * 100}ms`;

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const stored = getStoredProfile();
    if (!stored) {
      router.push("/onboarding");
      return;
    }
    setProfile(stored);
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;

    const updated: ProfileData = {
      displayName: profile.displayName,
      age: Number(profile.age),
      weight: Number(profile.weight),
      height: Number(profile.height),
      goal: profile.goal,
      activityLevel: profile.activityLevel,
      sleepTime: profile.sleepTime,
    };

    setStoredProfile(updated);

    const user = getStoredUser();
    if (user && user.displayName !== updated.displayName) {
      setStoredUser({ ...user, displayName: updated.displayName });
    }

    router.push("/profile");
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-16 px-6 relative">
      <div className="relative z-10 w-full max-w-[400px] mx-auto">
        <div
          className="flex items-center gap-3 mb-8 animate-field-enter"
          style={{ animationDelay: "0ms" }}
        >
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm border border-white/40 hover:bg-white/60 transition-all"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-zinc-800">Edit Profile</h1>
        </div>

        <div
          className="rounded-[32px] border border-white/60 bg-white/30 backdrop-blur-2xl p-6 shadow-[0_32px_80px_rgba(20,83,45,0.12)] animate-field-enter"
          style={{ animationDelay: "100ms" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-field-enter" style={{ animationDelay: fieldDelay(0) }}>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Your Name
              </label>
              <input
                type="text"
                name="displayName"
                required
                value={profile.displayName}
                onChange={handleChange}
                placeholder="e.g. Alex"
                className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="animate-field-enter" style={{ animationDelay: fieldDelay(1) }}>
                <label className="mb-2 block text-sm font-semibold text-zinc-600">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="10"
                  max="120"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="28"
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                />
              </div>

              <div className="animate-field-enter" style={{ animationDelay: fieldDelay(2) }}>
                <label className="mb-2 block text-sm font-semibold text-zinc-600">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  required
                  min="30"
                  max="300"
                  value={profile.weight}
                  onChange={handleChange}
                  placeholder="70"
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
                />
              </div>
            </div>

            <div className="animate-field-enter" style={{ animationDelay: fieldDelay(3) }}>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                required
                min="100"
                max="250"
                value={profile.height}
                onChange={handleChange}
                placeholder="175"
                className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
              />
            </div>

            <div className="animate-field-enter" style={{ animationDelay: fieldDelay(4) }}>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Your Goal
              </label>
              <div className="relative">
                <select
                  name="goal"
                  required
                  value={profile.goal}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 appearance-none backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all cursor-pointer"
                >
                  <option value="lose_weight">Lose weight</option>
                  <option value="maintain">Maintain weight</option>
                  <option value="gain_muscle">Build muscle</option>
                  <option value="gain_weight">Gain weight</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="animate-field-enter" style={{ animationDelay: fieldDelay(5) }}>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Activity Level
              </label>
              <div className="relative">
                <select
                  name="activityLevel"
                  required
                  value={profile.activityLevel}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 appearance-none backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all cursor-pointer"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly active</option>
                  <option value="moderate">Moderately active</option>
                  <option value="active">Very active</option>
                  <option value="very_active">Extra active</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="animate-field-enter" style={{ animationDelay: fieldDelay(6) }}>
              <label className="mb-2 block text-sm font-semibold text-zinc-600">
                Bedtime
              </label>
              <input
                type="time"
                name="sleepTime"
                required
                value={profile.sleepTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-zinc-900 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
              />
            </div>

            <div className="pt-4 animate-field-enter" style={{ animationDelay: "800ms" }}>
              <button
                type="submit"
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-[0_12px_40px_rgba(16,185,129,0.35)] hover:shadow-[0_16px_48px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
