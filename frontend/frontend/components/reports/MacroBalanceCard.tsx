"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MacroBalanceCardProps {
  data?: { name: string; value: number; color: string }[];
}

const defaultData = [
    { name: "Protein", value: 29, color: "#22c55e" },
    { name: "Carbs", value: 52, color: "#38bdf8" },
    { name: "Fats", value: 19, color: "#fbbf24" },
];

export default function MacroBalanceCard({ data: propData }: MacroBalanceCardProps) {
    const data = propData ?? defaultData;
    return (
        <section className="mx-6 mt-4 rounded-[32px] border border-white bg-white/20 p-5 shadow-[0_24px_70px_rgba(20,83,45,0.10)] backdrop-blur-xl">
            <p className="mb-5 text-sm font-semibold text-zinc-600">
                Macro Balance
            </p>

            <div className="flex items-center justify-between gap-4">
                <div className="h-36 w-36">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={42}
                                outerRadius={62}
                                paddingAngle={2}
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth={2}
                            >
                                {data.map((item) => (
                                    <Cell key={item.name} fill={item.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 space-y-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                />
                                <span className="text-sm font-medium text-zinc-500">
                  {item.name}
                </span>
                            </div>

                            <span className="text-sm font-semibold text-zinc-700">
                {item.value}%
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}