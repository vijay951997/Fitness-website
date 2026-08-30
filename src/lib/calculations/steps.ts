/**
 * Steps to distance and calories.
 *
 * Stride length is estimated from height (about 0.415 × height) when it is
 * given, and falls back to a population average otherwise. Distance is
 * turned into walking time at the chosen pace, then costed with that
 * pace's MET value — which keeps this consistent with the workout
 * calculator rather than inventing a second method.
 */

import {
  DEFAULT_STRIDE_M,
  STRIDE_TO_HEIGHT_RATIO,
  WALKING_PACES,
  WALKING_SPEED_M_PER_MIN,
  type WalkingPaceId,
} from "./constants.ts";
import { checkNonNegative, checkNumber, collect } from "./validate.ts";
import { round, roundCalories, roundDistance } from "./units.ts";
import { fail, ok, type CalcResult } from "./types.ts";

export type StepsInput = {
  steps: number;
  weightKg: number;
  /** Optional: sharpens the stride estimate. */
  heightCm?: number;
  pace?: WalkingPaceId;
};

export type StepsOutput = {
  steps: number;
  distanceKm: number;
  distanceMiles: number;
  caloriesBurned: number;
  strideMetres: number;
  durationMinutes: number;
  paceLabel: string;
};

export function calculateSteps(input: StepsInput): CalcResult<StepsOutput> {
  const errors = collect(
    checkNonNegative("steps", input.steps, "steps", "step count"),
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
    input.heightCm !== undefined
      ? checkNumber("heightCm", input.heightCm, "heightCm", "height")
      : null,
  );
  if (errors.length) return fail(errors);

  const paceId: WalkingPaceId = input.pace ?? "normal";
  const pace =
    WALKING_PACES.find((p) => p.id === paceId) ?? WALKING_PACES[1];

  const strideM = input.heightCm
    ? (input.heightCm / 100) * STRIDE_TO_HEIGHT_RATIO
    : DEFAULT_STRIDE_M;

  const distanceM = input.steps * strideM;
  const minutes = distanceM / WALKING_SPEED_M_PER_MIN[paceId];
  const calories = pace.met * input.weightKg * (minutes / 60);

  return ok({
    steps: Math.round(input.steps),
    distanceKm: roundDistance(distanceM / 1000),
    distanceMiles: roundDistance(distanceM / 1609.34),
    caloriesBurned: roundCalories(calories),
    strideMetres: round(strideM, 2),
    durationMinutes: Math.round(minutes),
    paceLabel: pace.label,
  });
}
