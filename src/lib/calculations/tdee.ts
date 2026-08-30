/**
 * Total daily energy expenditure — BMR scaled by how active the person is.
 * TDEE is also their maintenance calorie level.
 */

import { activityLevel } from "./constants.ts";
import { calculateBmr, type BmrInput } from "./bmr.ts";
import { roundCalories } from "./units.ts";
import { ok, type ActivityLevelId, type CalcResult } from "./types.ts";

export type TdeeInput = BmrInput & { activity: ActivityLevelId };

export type TdeeOutput = {
  bmr: number;
  tdee: number;
  /** Same number as `tdee`, named for the UI that talks about maintenance. */
  maintenanceCalories: number;
  activityFactor: number;
  activityLabel: string;
};

export function calculateTdee(input: TdeeInput): CalcResult<TdeeOutput> {
  const bmrResult = calculateBmr(input);
  if (!bmrResult.ok) return bmrResult;

  const level = activityLevel(input.activity);
  const tdee = roundCalories(bmrResult.data.bmr * level.factor);

  return ok({
    bmr: bmrResult.data.bmr,
    tdee,
    maintenanceCalories: tdee,
    activityFactor: level.factor,
    activityLabel: level.label,
  });
}
