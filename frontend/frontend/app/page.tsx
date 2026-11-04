"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/home/HomeHeader";
import CaloriesCard from "@/components/home/CaloriesCard";
import MacroSummary from "@/components/home/MacroSummary";
import NutritionScoreCard from "@/components/home/NutritionScoreCard";
import RecentMealCard from "@/components/home/RecentMealCard";
import Toast from "@/components/ui/Toast";
import { useHomeData, useMacroPercentages } from "@/hooks/useHomeData";
import { formatMealTime, formatMealType } from "@/lib/api/home";
import { useUser } from "@/hooks/useUser";

export default function HomePage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [notifReady, setNotifReady] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/onboarding");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    const enabled = typeof window !== "undefined" && localStorage.getItem("neurosnap-notifications-enabled") === "true";
    setNotifReady(true);
    setShowToast(enabled);
  }, []);

  const { loading, error, totals, recentMeal, nutritionScore, scoreTrend } =
    useHomeData();

  const macros = useMacroPercentages(totals);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7FBF9] via-[#EAF7F1] to-[#DFF3EA]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-emerald-400/20 animate-emerald-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const macroItems = [
    {
      label: "Protein",
      value: `${Math.round(totals.proteinGrams)}g`,
      percent: macros.protein,
    },
    {
      label: "Carbs",
      value: `${Math.round(totals.carbsGrams)}g`,
      percent: macros.carbs,
    },
    {
      label: "Fats",
      value: `${Math.round(totals.fatGrams)}g`,
      percent: macros.fats,
    },
  ];

  return (
    <div className="space-y-4 pb-14">
      {notifReady && showToast && (
        <Toast
          message="Track your meal for today"
          onClose={() => setShowToast(false)}
        />
      )}
      <HomeHeader />
      <CaloriesCard consumed={totals.calories} />
      <MacroSummary macros={macroItems} />
      <NutritionScoreCard score={nutritionScore} trend={scoreTrend} />
      {recentMeal && (
        <RecentMealCard
          title={recentMeal.title}
          mealType={formatMealType(recentMeal.mealType)}
          time={formatMealTime(recentMeal.loggedAt)}
          calories={recentMeal.calories}
          imageUrl={recentMeal.imageUrl}
        />
      )}
      {!recentMeal && !loading && <RecentMealCard />}
    </div>
  );
}