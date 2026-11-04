import { Flame, Utensils } from "lucide-react";

type DailySummaryCardProps = {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    mealCount: number;
};

import { NUTRITION_GOALS } from "@/lib/constants/nutrition";

export default function DailySummaryCard({
    calories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    mealCount,
}: DailySummaryCardProps) {
    const macros = [
        { label: "Protein", value: `${Math.round(proteinGrams)}g` },
        { label: "Carbs", value: `${Math.round(carbsGrams)}g` },
        { label: "Fats", value: `${Math.round(fatGrams)}g` },
    ];
    const progress = Math.min((calories / NUTRITION_GOALS.CALORIES) * 100, 100);

    return (
        <section className="mx-6 rounded-[32px] border border-white bg-white/20 p-5 shadow-[0_24px_70px_rgba(20,83,45,0.10)] backdrop-blur-xl">
            <div className="mb-5 flex items-start justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
                        <Utensils className="h-3.5 w-3.5" />
                        Daily Summary
                    </div>

                    <div className="flex items-end gap-1">
                        <h2 className="text-[42px] font-semibold leading-none tracking-tight text-zinc-900">
                            {Math.round(calories).toLocaleString("en-US")}
                        </h2>
                        <span className="mb-1.5 text-base font-medium text-zinc-400">
                            kcal
                        </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-zinc-400">
                        {mealCount} {mealCount === 1 ? "meal" : "meals"} logged today
                    </p>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 text-white shadow-[0_16px_40px_rgba(16,185,129,0.35)]">
                    <Flame className="h-8 w-8 fill-white" />
                </div>
            </div>

            <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-emerald-50">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="grid grid-cols-3 gap-3">
                {macros.map((macro) => (
                    <div
                        key={macro.label}
                        className="rounded-[22px] border border-white/60 bg-white/20 p-3 shadow-sm"
                    >
                        <p className="text-xs font-medium text-zinc-400">
                            {macro.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-zinc-900">
                            {macro.value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
