"use client";

import ReportsHeader from "@/components/reports/ReportsHeader";
import WeeklyCaloriesCard from "@/components/reports/WeeklyCaloriesCard";
import MacroBalanceCard from "@/components/reports/MacroBalanceCard";
import AiRecommendationsCard from "@/components/reports/AIRecommendationsCard";
import BrainHealthCard from "@/components/home/BrainHealthCard";
import WeeklyReportDownloadCard from "@/components/reports/WeeklyReportDownloadCard";
import { useReports } from "@/hooks/useReports";

const macroColorMap: Record<string, string> = {
  protein: "#22c55e",
  carbs: "#38bdf8",
  fat: "#fbbf24",
};

export default function ReportsPage() {
  const {
    weeklyCalories,
    reportData,
    loading,
    error,
    dateRangeLabel,
    totalCalories,
    averageDailyCalories,
    brainHealthScore,
  } = useReports();

  const macroData = reportData
    ? [
        { name: "Protein", value: reportData.macroBalance.protein, color: macroColorMap.protein },
        { name: "Carbs", value: reportData.macroBalance.carbs, color: macroColorMap.carbs },
        { name: "Fats", value: reportData.macroBalance.fat, color: macroColorMap.fat },
      ]
    : undefined;

  const recs = reportData?.recommendations;

  return (
    <div className="space-y-4 pb-14">
        <ReportsHeader dateRangeLabel={dateRangeLabel} />
        <WeeklyCaloriesCard
          data={weeklyCalories ?? undefined}
          totalCalories={totalCalories}
          averageDailyCalories={averageDailyCalories}
        />
        <MacroBalanceCard data={macroData} />
        <AiRecommendationsCard recommendations={recs} />
        <BrainHealthCard score={brainHealthScore} />
        <WeeklyReportDownloadCard
          dateRangeLabel={dateRangeLabel}
          reportData={reportData}
          weeklyCalories={weeklyCalories}
          averageDailyCalories={averageDailyCalories}
          brainHealthScore={brainHealthScore}
        />
    </div>
  );
}