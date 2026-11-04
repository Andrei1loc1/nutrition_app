"use client";

import Image from "next/image";
import { Clock, Flame } from "lucide-react";
import DeleteMealButton from "@/components/journal/DeleteMealButton";

export type JournalMeal = {
    id: string;
    time: string;
    label: string;
    title: string;
    calories: number;
    image?: string | null;
    macros: string;
    portionSize?: string | null;
};

type MealTimelineProps = {
    meals: JournalMeal[];
    onMealDeleted?: (id: string) => void;
};

export default function MealTimeline({ meals, onMealDeleted }: MealTimelineProps) {
    function handleDeleted(mealId: string) {
        onMealDeleted?.(mealId);
    }

    if (meals.length === 0) {
        return (
            <section className="mx-6 mt-6 pb-32">
                <div className="rounded-[28px] border border-white bg-white/20 p-6 text-center shadow-[0_20px_60px_rgba(20,83,45,0.10)] backdrop-blur-xl">
                    <p className="text-sm font-semibold text-zinc-700">
                        No meals logged today
                    </p>
                    <p className="mt-2 text-xs font-medium text-zinc-400">
                        Scan a meal and add it to the journal to see it here.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-6 mt-6 pb-32">
            <div className="relative">
                <div className="absolute left-[14px] top-4 bottom-0 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500 from-[0%] via-emerald-500 via-[87%] to-transparent" />

                <div className="space-y-7">
                    {meals.map((meal) => (
                        <div key={meal.id} className="relative grid grid-cols-[28px_1fr] gap-4">
                            <div className="relative z-10 flex justify-center pt-1.5">
                                <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 " />
                            </div>

                            <div className="min-w-0">
                                <div className="mb-3 flex h-6 items-center gap-2">
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                                        {meal.label}
                                    </span>
                                    {meal.portionSize && (
                                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-600">
                                            {meal.portionSize}
                                        </span>
                                    )}

                                    <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        {meal.time}
                                    </span>
                                </div>

                                <div className="relative overflow-hidden rounded-[28px] border border-white bg-white/20 p-4 shadow-[0_20px_60px_rgba(20,83,45,0.10)] backdrop-blur-xl">
                                    <DeleteMealButton
                                        mealId={meal.id}
                                        mealTitle={meal.title}
                                        onDeleted={handleDeleted}
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border border-white/80 shadow-md">
                                             <Image
                                                 src={meal.image ?? "/images/pizza.jpg"}
                                                 alt={meal.title}
                                                 fill
                                                 sizes="80px"
                                                 className="object-cover"
                                             />
                                        </div>

                                        <div className="min-w-0 flex-1 pr-9">
                                            <h3 className="truncate text-[17px] font-semibold tracking-tight text-zinc-900">
                                                {meal.title}
                                            </h3>

                                            <p className="mt-2 flex items-center gap-1 text-sm font-bold text-emerald-500">
                                                <Flame className="h-4 w-4 fill-emerald-500" />
                                                {Math.round(meal.calories)} kcal
                                            </p>

                                            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                                                {meal.macros}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}