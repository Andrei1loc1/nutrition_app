"use client";

import { NUTRITION_GOALS } from "@/lib/constants/nutrition";

interface WeeklyCaloriesCardProps {
  data?: { day: string; calories: number }[];
  totalCalories?: number;
  averageDailyCalories?: number;
}

const defaultData = [
    { day: "Mon", calories: 2200 },
    { day: "Tue", calories: 1780 },
    { day: "Wed", calories: 1520 },
    { day: "Thu", calories: 1900 },
    { day: "Fri", calories: 1340 },
    { day: "Sat", calories: 1260 },
    { day: "Sun", calories: 1020 },
];

export default function WeeklyCaloriesCard({
  data: propData,
  totalCalories: propTotal,
  averageDailyCalories: propAvg,
}: WeeklyCaloriesCardProps) {
    const data = propData ?? defaultData;
    const goal = NUTRITION_GOALS.CALORIES;
    const max = NUTRITION_GOALS.CALORIES;
    const totalCalories = propTotal ?? data.reduce((s, d) => s + d.calories, 0);
    const averageDailyCalories = propAvg ?? Math.round(totalCalories / 7);

    return (
        <section className="mx-6 rounded-[32px] border border-white bg-white/20 p-5 shadow-[0_24px_70px_rgba(20,83,45,0.10)] backdrop-blur-xl">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-zinc-600">
                        Calories This Week
                    </p>

                    <div className="mt-2 flex items-end gap-1">
                        <h2 className="text-[34px] font-semibold leading-none tracking-tight text-zinc-900">
                            {totalCalories.toLocaleString("en-US")}
                        </h2>
                        <span className="mb-1 text-sm font-medium text-zinc-400">
              kcal
            </span>
                    </div>
                </div>

                <span className="mt-9 text-[11px] font-bold text-emerald-500">
          Avg. {averageDailyCalories.toLocaleString("en-US")} kcal/day
        </span>
            </div>

            <div className="relative h-36">
                <div className="absolute left-0 right-0 top-[28%] border-t border-dashed border-emerald-400/60" />

                <span className="absolute right-0 top-[22%] text-[11px] font-semibold text-zinc-500">
          {goal.toLocaleString("en-US")} Goal
        </span>

                <div className="flex h-full items-end justify-between pt-4">
                    {data.map((item) => (
                        <div key={item.day} className="flex h-full flex-col items-center justify-end gap-2">
                            <div className="flex h-24 items-end">
                                <div
                                    className="w-4 rounded-full bg-gradient-to-t from-emerald-300 via-emerald-400 to-emerald-500 shadow-[0_6px_14px_rgba(16,185,129,0.14)]"
                                    style={{ height: `${Math.max((item.calories / max) * 100, 18)}%` }}
                                />
                            </div>

                            <span className="text-[11px] font-semibold text-zinc-400">
                {item.day}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}