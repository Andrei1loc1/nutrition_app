/**
 * Client pentru predicția AI — comunică cu rutele interne /api/*.
 */
import { apiFetch } from "@/lib/api/client";
import type {
  PredictionResult,
  SavedScan,
  UploadedScanImage,
} from "@/lib/types";

export type { PredictionResult, SavedScan, UploadedScanImage };

export async function predictMeal(
  file: File,
  portion: string,
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await apiFetch<{ data: PredictionResult }>(`/api/predict?portion=${encodeURIComponent(portion)}`, {
    method: "POST",
    body: formData,
    // omit Content-Type so browser sets multipart boundary
  });

  return data.data;
}

export async function savePredictionScan(
  prediction: PredictionResult,
  image?: UploadedScanImage,
): Promise<SavedScan> {
  const data = await apiFetch<{ data: SavedScan }>("/api/scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      predictedLabel: prediction.food_class,
      confidence: prediction.confidence,
      portion: prediction.portion,
      nutrition: prediction.nutrition,
      image,
      rawPrediction: prediction,
    }),
  });

  return data.data;
}

export async function uploadScanImage(dataUrl: string): Promise<UploadedScanImage> {
  const data = await apiFetch<{ data: UploadedScanImage }>("/api/uploads/scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });

  return data.data;
}

export async function addScanToJournal(scanId: string, portionSize?: string) {
  const data = await apiFetch<{ data: unknown }>(`/api/scans/${scanId}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portionSize: portionSize || "medium" }),
  });

  return data.data;
}
