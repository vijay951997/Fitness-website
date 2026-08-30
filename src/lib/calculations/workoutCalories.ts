/**
 * Calories burned during an activity, from its MET value.
 *
 *   kcal = MET × body weight in kg × hours
 *
 * This is gross expenditure: it includes the calories you would have
 * burned anyway simply by being alive for that period. Net burn is also
 * reported, since that is the figure that matters when reconciling
 * exercise against a calorie target.
 */

import { findActivity } from "../../data/activities.ts";
import { checkNumber, collect } from "./validate.ts";
import { round, roundCalories } from "./units.ts";
import { failOne, fail, ok, type CalcResult } from "./types.ts";

export type WorkoutInput = {
  activityId: string;
  weightKg: number;
  durationMinutes: number;
};

export type WorkoutOutput = {
  activityLabel: string;
  met: number;
  durationMinutes: number;
  caloriesBurned: number;
  /** Gross burn minus resting expenditure over the same period. */
  netCaloriesBurned: number;
  caloriesPerMinute: number;
};

export function calculateWorkoutCalories(
  input: WorkoutInput,
): CalcResult<WorkoutOutput> {
  const errors = collect(
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
    checkNumber(
      "durationMinutes",
      input.durationMinutes,
      "durationMin",
      "duration",
    ),
  );
  if (errors.length) return fail(errors);

  const activity = findActivity(input.activityId);
  if (!activity) {
    return failOne("activityId", "Choose an activity from the list.");
  }

  const hours = input.durationMinutes / 60;
  const gross = activity.met * input.weightKg * hours;
  // Resting burn over the same window is 1 MET.
  const resting = 1 * input.weightKg * hours;

  return ok({
    activityLabel: activity.label,
    met: activity.met,
    durationMinutes: input.durationMinutes,
    caloriesBurned: roundCalories(gross),
    netCaloriesBurned: roundCalories(Math.max(0, gross - resting)),
    caloriesPerMinute: round(gross / input.durationMinutes, 1),
  });
}
