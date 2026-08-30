/**
 * Daily water target.
 *
 * Built up transparently so the UI can show its working:
 *   baseline (35 ml per kg) × activity multiplier + exercise allowance.
 *
 * Fluid also comes from food and other drinks, so this is a total intake
 * guide rather than a volume of plain water that must be drunk.
 */

import {
  WATER_ACTIVITY_MULTIPLIER,
  WATER_ML_PER_EXERCISE_MINUTE,
  WATER_ML_PER_KG,
} from "./constants.ts";
import { checkNonNegative, checkNumber, collect } from "./validate.ts";
import { mlToGlasses, mlToLitres, round, roundLitres } from "./units.ts";
import {
  fail,
  ok,
  type ActivityLevelId,
  type CalcResult,
} from "./types.ts";

export type WaterInput = {
  weightKg: number;
  activity: ActivityLevelId;
  /** Minutes of deliberate exercise on a typical day. */
  exerciseMinutes: number;
};

export type WaterOutput = {
  litres: number;
  millilitres: number;
  glasses: number;
  breakdown: {
    baselineMl: number;
    activityMl: number;
    exerciseMl: number;
    activityMultiplier: number;
  };
};

export function calculateWater(input: WaterInput): CalcResult<WaterOutput> {
  const errors = collect(
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
    checkNonNegative(
      "exerciseMinutes",
      input.exerciseMinutes,
      "durationMin",
      "exercise duration",
    ),
  );
  if (errors.length) return fail(errors);

  const multiplier = WATER_ACTIVITY_MULTIPLIER[input.activity] ?? 1;
  const baselineMl = input.weightKg * WATER_ML_PER_KG;
  const activityMl = baselineMl * multiplier - baselineMl;
  const exerciseMl = input.exerciseMinutes * WATER_ML_PER_EXERCISE_MINUTE;
  const totalMl = baselineMl + activityMl + exerciseMl;

  return ok({
    litres: roundLitres(mlToLitres(totalMl)),
    millilitres: Math.round(totalMl),
    glasses: Math.round(mlToGlasses(totalMl)),
    breakdown: {
      baselineMl: Math.round(baselineMl),
      activityMl: Math.round(activityMl),
      exerciseMl: Math.round(exerciseMl),
      activityMultiplier: round(multiplier, 2),
    },
  });
}
