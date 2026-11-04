import { Leaf, TrendingUp } from "lucide-react";

interface AIRecommendationsCardProps {
  recommendations?: { title: string; description: string }[];
}

const defaultRecommendations = [
    {
        title: "Increase protein",
        description: "Try adding a high-protein snack in the afternoon.",
        icon: TrendingUp,
    },
    {
        title: "Add more fiber",
        description: "Include veggies in your lunch and dinner.",
        icon: Leaf,
    },
];

const iconMap: Record<string, typeof TrendingUp> = {
  TrendingUp,
  Leaf,
};

export default function AIRecommendationsCard({
  recommendations: propRecs,
}: AIRecommendationsCardProps) {
    const recommendations = propRecs
      ? propRecs.map((r) => ({
          ...r,
          icon: iconMap[r.title === "Increase protein" ? "TrendingUp" : "Leaf"] ?? Leaf,
        }))
      : defaultRecommendations;
    return (
        <section className="mx-6 mt-4 rounded-[32px] border border-white bg-white/20 p-5 shadow-[0_24px_70px_rgba(20,83,45,0.10)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-600">
                    AI Recommendations
                </p>

                <button className="text-xs font-bold text-emerald-500">
                    View all
                </button>
            </div>

            <div className="space-y-3">
                {recommendations.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="flex items-center justify-between gap-4 rounded-[22px] border border-white/70 bg-white/20 p-4 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-emerald-400" />

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}