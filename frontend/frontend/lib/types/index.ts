/**
 * Centralized TypeScript domain types.
 * Single source of truth for data structures shared across
 * frontend modules, hooks, components, and API clients.
 */

// ─── Nutrition ─────────────────────────────────────────────────
export interface NutritionTotals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MacroItem {
  label: string;
  value: string;
  percent: number;
}

// ─── Meals ─────────────────────────────────────────────────────
export interface MealItemData {
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  portionSize?: string | null;
}

export interface MealData {
  id: string;
  mealType: string;
  title: string;
  loggedAt: string;
  notes: string | null;
  items: MealItemData[];
  sourceScan?: { image?: { url: string } | null } | null;
}

export interface DailyTotals extends NutritionTotals {
  mealCount: number;
}

export interface RecentMealResult {
  title: string;
  mealType: string;
  loggedAt: string;
  calories: number;
  imageUrl: string | null;
}

// ─── Journal (UI-facing) ───────────────────────────────────────
export interface JournalMeal {
  id: string;
  time: string;
  label: string;
  title: string;
  calories: number;
  image?: string | null;
  macros: string;
  portionSize: string | null;
}

// ─── Reports ──────────────────────────────────────────────────
export interface ReportTotals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface ReportData {
  title: string;
  range: { start: string; end: string };
  mealCount: number;
  totals: ReportTotals;
  macroBalance: { protein: number; carbs: number; fat: number };
  recommendations: { title: string; description: string }[];
}

export interface DailyCalories {
  day: string;
  calories: number;
}

// ─── Backend (Python) ─────────────────────────────────────────
export interface HealthyScoreInput {
  calories: number;
  protein: number;
  fats: number;
  target_calories: number;
  target_protein: number;
  target_fats: number;
  late_meals_count: number;
  days_on_target: number;
}

export interface HealthyScoreResult {
  healthy_score: number;
  sub_scores: {
    calories: number;
    protein: number;
    fats: number;
    meal_timing: number;
    consistency: number;
  };
}

export interface RecommendationResult {
  selected_agent: string;
  state: string;
  action: string;
  recommendation: string;
  all_agents: Record<string, unknown>;
}

export interface MindScoreInput {
  meals: { food_class: string }[];
}

export interface MindScoreResult {
  brain_nutrition_score: number;
  positive_score: number;
  negative_score: number;
  pattern: string;
  category_counts: Record<string, number>;
  recommendation: string;
}

// ─── Prediction (AI Scan) ────────────────────────────────────
export interface PredictionResult {
  food_class?: string;
  display_name?: string;
  confidence?: number;
  portion?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  top_predictions?: PredictionResult[];
}

export interface SavedScan {
  id: string;
  status: string;
}

export interface UploadedScanImage {
  url: string;
  mimeType?: string;
  sizeBytes?: number;
}

// ─── User ────────────────────────────────────────────────────
export interface StoredUser {
  id: string;
  displayName: string;
}
