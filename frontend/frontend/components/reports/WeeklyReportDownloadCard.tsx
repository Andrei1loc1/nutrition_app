import { Download, FileSpreadsheet } from "lucide-react";
import { downloadCSV } from "@/lib/utils/csv";
import type { ReportData, DailyCalories } from "@/lib/types";

interface Props {
  dateRangeLabel: string;
  reportData: ReportData | null;
  weeklyCalories: DailyCalories[] | null;
  averageDailyCalories: number;
  brainHealthScore: number;
}

export default function WeeklyReportDownloadCard({
  dateRangeLabel,
  reportData,
  weeklyCalories,
  averageDailyCalories,
  brainHealthScore,
}: Props) {
  const handleDownload = () => {
    if (!reportData || !weeklyCalories) return;

    const rows: Record<string, string | number>[] = [];

        rows.push({ Section: "Summary", Label: "Month", Value: dateRangeLabel });
    rows.push({ Section: "Summary", Label: "Meal Count", Value: reportData.mealCount });
    rows.push({ Section: "Summary", Label: "Avg Daily Calories", Value: averageDailyCalories });
    rows.push({ Section: "Summary", Label: "Brain Health Score", Value: brainHealthScore });

    rows.push({ Section: "Totals", Label: "Total Calories", Value: reportData.totals.calories });
    rows.push({ Section: "Totals", Label: "Total Protein (g)", Value: reportData.totals.proteinGrams });
    rows.push({ Section: "Totals", Label: "Total Carbs (g)", Value: reportData.totals.carbsGrams });
    rows.push({ Section: "Totals", Label: "Total Fat (g)", Value: reportData.totals.fatGrams });

    rows.push({ Section: "Macro Balance (%)", Label: "Protein %", Value: reportData.macroBalance.protein });
    rows.push({ Section: "Macro Balance (%)", Label: "Carbs %", Value: reportData.macroBalance.carbs });
    rows.push({ Section: "Macro Balance (%)", Label: "Fat %", Value: reportData.macroBalance.fat });

    weeklyCalories.forEach((d) => {
      rows.push({ Section: "Daily Calories", Label: d.day, Value: d.calories });
    });

    reportData.recommendations.forEach((rec) => {
      rows.push({ Section: "Recommendations", Label: rec.title, Value: rec.description });
    });

    const monthSlug = dateRangeLabel.replace(/\s/g, "_").replace(/\//g, "-");
    downloadCSV(["Section", "Label", "Value"], rows, `monthly_report_${monthSlug}`);
  };

  return (
    <section className="mx-6 mt-4 rounded-[32px] border border-white bg-white/20 p-5 shadow-[0_24px_70px_rgba(20,83,45,0.10)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-600">
            Monthly Report
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            {dateRangeLabel}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-zinc-400">
            Export all your monthly nutrition data
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={!reportData || !weeklyCalories}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[20px] border border-white/70 bg-emerald-500/80 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          CSV
        </button>
      </div>
    </section>
  );
}
