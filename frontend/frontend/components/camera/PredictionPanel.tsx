"use client";

import { Camera, Sparkles } from "lucide-react";
import type { PredictionResult } from "@/lib/types";

interface PredictionPanelProps {
  topPredictions: PredictionResult[];
  selectedPrediction: PredictionResult | null;
  prediction: string | null;
  predictionInfo: PredictionResult | null;
  isPredicting: boolean;
  savedScanId: string | null;
  isAddingToJournal: boolean;
  journalStatus: string | null;
  capturedImage: string | null;
  onSelectPrediction: (pred: PredictionResult) => void;
  onAddToJournal: (pred: PredictionResult) => void;
}

export default function PredictionPanel({
  topPredictions,
  selectedPrediction,
  prediction,
  predictionInfo,
  isPredicting,
  savedScanId,
  isAddingToJournal,
  journalStatus,
  capturedImage,
  onSelectPrediction,
  onAddToJournal,
}: PredictionPanelProps) {
  return (
    <div className="absolute inset-x-5 bottom-[7.2rem] z-30 mx-auto max-w-md">
      <div className="rounded-[1.6rem] border border-white/40 bg-white/10 p-3.5 text-white shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl pointer-events-auto">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-100">
            <Sparkles size={14} />
            Vision Detection
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-400/20 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
            <span className="text-[11px] font-semibold text-emerald-50">Live</span>
          </div>
        </div>

        {topPredictions.length > 0 ? (
          <TopPredictionsGrid
            predictions={topPredictions}
            selected={selectedPrediction}
            isAdding={isAddingToJournal}
            journalStatus={journalStatus}
            onSelect={onSelectPrediction}
            onAdd={onAddToJournal}
          />
        ) : (
          <SinglePredictionView
            prediction={prediction}
            predictionInfo={predictionInfo}
            isPredicting={isPredicting}
            savedScanId={savedScanId}
            isAdding={isAddingToJournal}
            journalStatus={journalStatus}
            capturedImage={capturedImage}
            onAdd={onAddToJournal}
          />
        )}
      </div>
    </div>
  );
}

function TopPredictionsGrid({
  predictions,
  selected,
  isAdding,
  journalStatus,
  onSelect,
  onAdd,
}: {
  predictions: PredictionResult[];
  selected: PredictionResult | null;
  isAdding: boolean;
  journalStatus: string | null;
  onSelect: (pred: PredictionResult) => void;
  onAdd: (pred: PredictionResult) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {predictions.map((pred, index) => (
          <button
            key={index}
            onClick={() => onSelect(pred)}
            className={`flex flex-col items-center rounded-xl border p-2 transition ${
              selected === pred
                ? "border-emerald-400 bg-emerald-400/20"
                : "border-white/20 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="mb-1 text-[10px] font-semibold text-emerald-200">
              {pred.confidence?.toFixed(0)}%
            </div>
            <div className="text-center text-[11px] font-medium leading-tight text-white">
              {pred.display_name ||
                pred.food_class
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
            </div>
            {pred.nutrition && (
              <div className="mt-1 text-[9px] text-white/60">
                {pred.nutrition.calories} kcal
              </div>
            )}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => onAdd(selected)}
            disabled={isAdding || journalStatus === "Added to journal"}
            className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAdding ? "Adding..." : "Add to Journal"}
          </button>
          {journalStatus && (
            <span className="text-[11px] font-semibold text-emerald-100/80">
              {journalStatus}
            </span>
          )}
        </div>
      )}
    </>
  );
}

function SinglePredictionView({
  prediction,
  predictionInfo,
  isPredicting,
  savedScanId,
  isAdding,
  journalStatus,
  capturedImage,
  onAdd,
}: {
  prediction: string | null;
  predictionInfo: PredictionResult | null;
  isPredicting: boolean;
  savedScanId: string | null;
  isAdding: boolean;
  journalStatus: string | null;
  capturedImage: string | null;
  onAdd: (pred: PredictionResult) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/35 bg-white/20 text-white backdrop-blur-xl">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured meal" className="h-full w-full object-cover" />
        ) : (
          <Camera size={21} />
        )}
      </div>

      {prediction && (
        <div className="flex flex-col items-start space-y-1">
          <span className="text-sm font-semibold text-white">
            {prediction
              .replaceAll("_", " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            {predictionInfo?.confidence && (
              <span className="ml-1 text-xs font-medium text-emerald-200/80">
                ({predictionInfo.confidence}%)
              </span>
            )}
          </span>

          {predictionInfo?.nutrition && (
            <NutritionBadges nutrition={predictionInfo.nutrition} />
          )}

          {savedScanId && predictionInfo && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onAdd(predictionInfo)}
                disabled={isAdding || journalStatus === "Added to journal"}
                className="rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-bold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAdding ? "Adding..." : "Add to Journal"}
              </button>
              {journalStatus && (
                <span className="text-[11px] font-semibold text-emerald-100/80">
                  {journalStatus}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        {isPredicting && (
          <p className="text-[11px] font-semibold text-emerald-100">Saving scan...</p>
        )}
        {!capturedImage && !isPredicting && (
          <>
            <h3 className="truncate text-sm font-semibold">Ready to scan meal</h3>
            <p className="mt-0.5 text-[11px] font-medium text-white/65">
              Point camera at your food
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function NutritionBadges({
  nutrition,
}: {
  nutrition: { calories?: number; protein?: number; carbs?: number; fats?: number };
}) {
  const items = [
    nutrition.calories !== undefined && `${nutrition.calories} kcal`,
    nutrition.protein !== undefined && `${nutrition.protein} g protein`,
    nutrition.carbs !== undefined && `${nutrition.carbs} g carbs`,
    nutrition.fats !== undefined && `${nutrition.fats} g fats`,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((text) => (
        <span
          key={text}
          className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-2xl"
        >
          {text}
        </span>
      ))}
    </div>
  );
}
