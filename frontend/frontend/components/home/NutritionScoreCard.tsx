"use client";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
} from "recharts";

interface NutritionScoreCardProps {
  score?: number;
  trend?: number[];
}

const defaultData = [
    { value: 55 },
    { value: 62 },
    { value: 66 },
    { value: 69 },
    { value: 76 },
    { value: 88 },
    { value: 72 },
    { value: 84 },
];

export default function NutritionScoreCard({ score: propScore, trend: propTrend }: NutritionScoreCardProps) {
    const data = propTrend
      ? propTrend.map((v) => ({ value: v }))
      : defaultData;
    const score = propScore ?? 82;
    return (
        <section className="mx-6 mt-4 rounded-[28px] border border-white bg-white/20 p-5 shadow-[0_20px_60px_rgba(20,83,45,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
                <div>
                    <p className="mb-4 text-sm font-semibold text-zinc-600">
                        Nutrition Score
                    </p>

                    <div className="flex items-end gap-1">
            <span className="text-[36px] font-semibold leading-none text-zinc-900">
              {score}
            </span>
                        <span className="mb-1.5 text-sm font-medium text-zinc-400">
              /100
            </span>
                    </div>

                    <p className="mt-3 text-xs font-medium text-zinc-400">
                        Great job! You&apos;re on a healthy trend.
                    </p>
                </div>

                <div className="h-24 w-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={data}>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#22c55e"
                                strokeWidth={3}
                                fill="#22c55e"
                                fillOpacity={0.12}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}