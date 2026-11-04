import { CalendarDays, BarChart3 } from "lucide-react";

interface ReportsHeaderProps {
  dateRangeLabel?: string;
}

export default function ReportsHeader({ dateRangeLabel = "May 14 - May 20" }: ReportsHeaderProps) {
    return (
        <header className="px-6 pt-12 pb-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Insights
                    </div>

                    <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-zinc-900">
                        Weekly Reports
                    </h1>

                    <p className="mt-1 text-sm font-medium text-zinc-400">
                        {dateRangeLabel}
                    </p>
                </div>

                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/20 shadow-[0_14px_35px_rgba(20,83,45,0.10)] backdrop-blur-xl">
                    <CalendarDays className="h-5 w-5 text-emerald-500" />
                </button>
            </div>
        </header>
    );
}