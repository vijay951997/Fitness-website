/**
 * Every magic number the engine uses, in one place.
 *
 * Sources are named so the figures can be checked and adjusted without
 * reading the calculation code.
 */

import type { ActivityLevelId, DeficitLevelId, GoalId } from "./types.ts";

/* ── Unit conversion ──────────────────────────────────────── */

export const LB_PER_KG = 2.20462;
export const CM_PER_INCH = 2.54;
export const INCHES_PER_FOOT = 12;
export const ML_PER_FL_OZ = 29.5735;
export const GLASS_ML = 250; // a "glass" is defined as 250 ml throughout

/* ── Energy ───────────────────────────────────────────────── */

/**
 * Energy in roughly 1 kg of body fat. The familiar "3500 kcal per pound"
 * rule of thumb. It is an approximation: real weight change also involves
 * water, glycogen and lean tissue, and the body adapts over time.
 */
export const KCAL_PER_KG_FAT = 7700;
export const KCAL_PER_LB_FAT = 3500;

/* ── Activity ─────────────────────────────────────────────── */

export type ActivityLevel = {
  id: ActivityLevelId;
  label: string;
  factor: number;
  description: string;
};

export const ACTIVITY_LEVELS: readonly ActivityLevel[] = [
  {
    id: "sedentary",
    label: "Sedentary",
    factor: 1.2,
    description: "Desk job, little or no exercise",
  },
  {
    id: "light",
    label: "Lightly active",
    factor: 1.375,
    description: "Light exercise 1–3 days a week",
  },
  {
    id: "moderate",
    label: "Moderately active",
    factor: 1.55,
    description: "Moderate exercise 3–5 days a week",
  },
  {
    id: "very",
    label: "Very active",
    factor: 1.725,
    description: "Hard exercise 6–7 days a week",
  },
  {
    id: "extra",
    label: "Extra active",
    factor: 1.9,
    description: "Physical job, or training twice a day",
  },
] as const;

export function activityLevel(id: ActivityLevelId): ActivityLevel {
  return ACTIVITY_LEVELS.find((a) => a.id === id) ?? ACTIVITY_LEVELS[0];
}

/* ── Goals ────────────────────────────────────────────────── */

export type Goal = {
  id: GoalId;
  label: string;
  /** Applied to TDEE. 0.8 means "eat 80% of maintenance". */
  tdeeMultiplier: number;
  /** Legacy multiplier applied to body weight in POUNDS. */
  quickFactor: number;
  description: string;
};

export const GOALS: readonly Goal[] = [
  {
    id: "loss",
    label: "Weight loss",
    tdeeMultiplier: 0.8,
    quickFactor: 12,
    description: "A moderate deficit of roughly 20% below maintenance",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    tdeeMultiplier: 1,
    quickFactor: 15,
    description: "Hold your current weight",
  },
  {
    id: "gain",
    label: "Weight gain",
    tdeeMultiplier: 1.15,
    quickFactor: 18,
    description: "A surplus of roughly 15% above maintenance",
  },
  {
    id: "muscle",
    label: "Muscle building",
    tdeeMultiplier: 1.1,
    quickFactor: 16,
    description: "A smaller surplus to favour lean mass over fat",
  },
] as const;

export function goal(id: GoalId): Goal {
  return GOALS.find((g) => g.id === id) ?? GOALS[1];
}

/* ── Deficit levels ───────────────────────────────────────── */

export type DeficitLevel = {
  id: DeficitLevelId;
  label: string;
  /** Daily deficit in kcal. */
  kcal: number;
  description: string;
};

export const DEFICIT_LEVELS: readonly DeficitLevel[] = [
  {
    id: "conservative",
    label: "Conservative",
    kcal: 250,
    description: "About 0.25 kg a week — easiest to sustain",
  },
  {
    id: "moderate",
    label: "Moderate",
    kcal: 500,
    description: "About 0.5 kg a week — the usual recommendation",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    kcal: 750,
    description: "About 0.75 kg a week — harder to hold, more muscle loss",
  },
] as const;

export function deficitLevel(id: DeficitLevelId): DeficitLevel {
  return DEFICIT_LEVELS.find((d) => d.id === id) ?? DEFICIT_LEVELS[1];
}

/* ── Safety floors ────────────────────────────────────────── */

/**
 * Widely cited lower bounds for unsupervised dieting. The engine refuses
 * to return a target below these rather than quietly producing an unsafe
 * number.
 */
export const MIN_CALORIES = { male: 1500, female: 1200 } as const;

/* ── Macronutrients ───────────────────────────────────────── */

export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;

/**
 * Protein targets in grams per kg of body weight, and the share of the
 * remaining calories given to fat. Carbohydrate takes whatever is left.
 */
export const MACRO_PROFILES: Record<
  GoalId,
  { proteinPerKg: number; fatShareOfRemainder: number; label: string }
> = {
  loss: { proteinPerKg: 2.0, fatShareOfRemainder: 0.3, label: "Higher protein" },
  maintenance: {
    proteinPerKg: 1.6,
    fatShareOfRemainder: 0.3,
    label: "Balanced",
  },
  gain: { proteinPerKg: 1.6, fatShareOfRemainder: 0.25, label: "Higher carb" },
  muscle: {
    proteinPerKg: 2.0,
    fatShareOfRemainder: 0.25,
    label: "Muscle building",
  },
};

/* ── BMI ──────────────────────────────────────────────────── */

export const BMI_CATEGORIES = [
  { max: 18.5, label: "Underweight" },
  { max: 25, label: "Normal" },
  { max: 30, label: "Overweight" },
  { max: Infinity, label: "Obesity" },
] as const;

export const HEALTHY_BMI = { min: 18.5, max: 24.9 } as const;

/* ── Water ────────────────────────────────────────────────── */

/** Baseline daily intake, before activity, in ml per kg of body weight. */
export const WATER_ML_PER_KG = 35;
/** Extra intake per minute of exercise, in ml. */
export const WATER_ML_PER_EXERCISE_MINUTE = 12;
/** Multiplier applied to the baseline for each activity level. */
export const WATER_ACTIVITY_MULTIPLIER: Record<ActivityLevelId, number> = {
  sedentary: 1,
  light: 1.05,
  moderate: 1.1,
  very: 1.15,
  extra: 1.2,
};

/* ── Steps ────────────────────────────────────────────────── */

/** Stride length as a fraction of standing height, walking at a normal pace. */
export const STRIDE_TO_HEIGHT_RATIO = 0.415;
/** Fallback stride in metres when height is not supplied. */
export const DEFAULT_STRIDE_M = 0.71;

export type WalkingPaceId = "slow" | "normal" | "brisk";

export const WALKING_PACES: readonly {
  id: WalkingPaceId;
  label: string;
  met: number;
}[] = [
  { id: "slow", label: "Slow (3 km/h)", met: 2.8 },
  { id: "normal", label: "Normal (5 km/h)", met: 3.5 },
  { id: "brisk", label: "Brisk (6.5 km/h)", met: 5.0 },
] as const;

/** Average walking speed in metres per minute, used to turn steps into time. */
export const WALKING_SPEED_M_PER_MIN: Record<WalkingPaceId, number> = {
  slow: 50,
  normal: 83,
  brisk: 108,
};
