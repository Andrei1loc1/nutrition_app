/**
 * Onboarding target calculations.
 * Pure BMR/TDEE/nutrition target math based on user profile data.
 */

export interface OnboardingFormData {
  displayName: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
  goal: string;
  sleepTime: string;
}

export interface NutritionTargets {
  target_calories: number;
  target_protein: number;
  target_fats: number;
  late_meal_threshold: number;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_MULTIPLIERS: Record<string, number> = {
  lose_weight: 0.8,
  maintain: 1.0,
  gain_muscle: 1.1,
  gain_weight: 1.15,
};

/**
 * Calculates personalized nutrition targets from onboarding form data.
 * Uses Mifflin-St Jeor BMR formula + TDEE + goal adjustment.
 */
export function calculateTargets(data: OnboardingFormData): NutritionTargets {
  const weight = Number(data.weight);
  const height = Number(data.height);
  const age = Number(data.age);
  const activity = data.activityLevel;
  const goal = data.goal;

  // Mifflin-St Jeor BMR (men)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activity] ?? 1.55);
  const target_calories = Math.round(tdee * (GOAL_MULTIPLIERS[goal] ?? 1.0));
  const target_protein = Math.round(weight * 2.0);
  const target_fats = Math.round((target_calories * 0.25) / 9);

  return {
    target_calories,
    target_protein,
    target_fats,
    late_meal_threshold: 22,
  };
}
