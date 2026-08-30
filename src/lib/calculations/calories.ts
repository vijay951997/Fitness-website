/**
 * Calorie targets.
 *
 * Two paths are offered deliberately:
 *
 *  - `quickCalorieEstimate` preserves the site's original maths (body
 *    weight in pounds × 12 / 15 / 18). It needs only weight and a goal, so
 *    it stays useful as a no-friction estimate and keeps existing results
 *    reproducible.
 *  - `calculateCalorieTarget` is the full BMR/TDEE path and is what the
 *    planner uses.
 */

import { MIN_CALORIES, goal as goalById } from "./constants.ts";
import { calculateTdee, type TdeeInput } from "./tdee.ts";
import { checkNumber, collect } from "./validate.ts";
import { kgToLb, roundCalories } from "./units.ts";
import {
  fail,
  ok,
  type CalcResult,
  type GoalId,
  type Sex,
} from "./types.ts";

/* ── Quick estimate (the site's original calculation) ─────── */

export type QuickCalorieInput = { weightKg: number; goal: GoalId };

export type QuickCalorieOutput = {
  calories: number;
  weightKg: number;
  weightLb: number;
  goalLabel: string;
  factor: number;
};

export function quickCalorieEstimate(
  input: QuickCalorieInput,
): CalcResult<QuickCalorieOutput> {
  const errors = collect(
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
  );
  if (errors.length) return fail(errors);

  const g = goalById(input.goal);
  const weightLb = kgToLb(input.weightKg);

  return ok({
    calories: roundCalories(weightLb * g.quickFactor),
    weightKg: input.weightKg,
    weightLb,
    goalLabel: g.label,
    factor: g.quickFactor,
  });
}

/* ── Full estimate ────────────────────────────────────────── */

export type CalorieTargetInput = TdeeInput & { goal: GoalId };

export type CalorieTargetOutput = {
  bmr: number;
  tdee: number;
  maintenanceCalories: number;
  targetCalories: number;
  /** Negative for a deficit, positive for a surplus. */
  dailyAdjustment: number;
  goalLabel: string;
  activityLabel: string;
  /** Set when the target was raised to the safe floor for this sex. */
  flooredTo: number | null;
};

export function calculateCalorieTarget(
  input: CalorieTargetInput,
): CalcResult<CalorieTargetOutput> {
  const tdeeResult = calculateTdee(input);
  if (!tdeeResult.ok) return tdeeResult;

  const { bmr, tdee, activityLabel } = tdeeResult.data;
  const g = goalById(input.goal);

  const raw = tdee * g.tdeeMultiplier;
  const floor = minimumCalories(input.sex);

  // Never hand back a target below the safe floor. Surface that it was
  // raised so the UI can explain why the number is not what the
  // multiplier alone would give.
  const floored = raw < floor;
  const targetCalories = roundCalories(floored ? floor : raw);

  return ok({
    bmr,
    tdee,
    maintenanceCalories: tdee,
    targetCalories,
    dailyAdjustment: roundCalories(targetCalories - tdee),
    goalLabel: g.label,
    activityLabel,
    flooredTo: floored ? floor : null,
  });
}

export function minimumCalories(sex: Sex): number {
  return MIN_CALORIES[sex];
}
