/**
 * Calorie deficit and weight-change timeline.
 *
 * Both rest on the 7700 kcal ≈ 1 kg of fat approximation. Real weight
 * change is messier: water and glycogen move first, metabolism adapts
 * downward as weight falls, and adherence is never perfect. These are
 * projections, not promises, and the UI says so.
 */

import { KCAL_PER_KG_FAT, deficitLevel } from "./constants.ts";
import { minimumCalories } from "./calories.ts";
import { checkNumber, collect } from "./validate.ts";
import { round, roundCalories, roundWeight } from "./units.ts";
import {
  fail,
  failOne,
  ok,
  type CalcResult,
  type DeficitLevelId,
  type Sex,
} from "./types.ts";

/* ── Deficit ──────────────────────────────────────────────── */

export type DeficitInput = {
  maintenanceCalories: number;
  level: DeficitLevelId;
  sex: Sex;
};

export type DeficitOutput = {
  maintenanceCalories: number;
  targetCalories: number;
  dailyDeficit: number;
  weeklyDeficit: number;
  weeklyWeightChangeKg: number;
  levelLabel: string;
  /** True when the requested deficit was reduced to stay above the floor. */
  adjustedForSafety: boolean;
  /**
   * True when maintenance already sits at or below the safe floor, so no
   * deficit can be recommended at all.
   */
  noSafeDeficit: boolean;
};

export function calculateDeficit(
  input: DeficitInput,
): CalcResult<DeficitOutput> {
  const errors = collect(
    checkNumber(
      "maintenanceCalories",
      input.maintenanceCalories,
      "calories",
      "maintenance calories",
    ),
  );
  if (errors.length) return fail(errors);

  const level = deficitLevel(input.level);
  const floor = minimumCalories(input.sex);

  const requested = input.maintenanceCalories - level.kcal;

  // Raise to the floor, but never above maintenance. Someone very small or
  // elderly can have a maintenance level that already sits below the floor;
  // clamping up alone would produce a negative "deficit" and report a
  // surplus as weight loss. For them the honest answer is that no deficit
  // is advisable, so the target becomes maintenance and the deficit zero.
  const targetCalories = roundCalories(
    Math.min(Math.max(requested, floor), input.maintenanceCalories),
  );

  const adjustedForSafety = targetCalories > requested;
  const noSafeDeficit = input.maintenanceCalories <= floor;
  const dailyDeficit = roundCalories(input.maintenanceCalories - targetCalories);
  const weeklyDeficit = dailyDeficit * 7;

  return ok({
    maintenanceCalories: roundCalories(input.maintenanceCalories),
    targetCalories,
    dailyDeficit,
    weeklyDeficit,
    weeklyWeightChangeKg: round(weeklyDeficit / KCAL_PER_KG_FAT, 2),
    levelLabel: level.label,
    adjustedForSafety,
    noSafeDeficit,
  });
}

/* ── Timeline ─────────────────────────────────────────────── */

export type TimelineInput = {
  currentWeightKg: number;
  targetWeightKg: number;
  /** Positive number of kcal per day, in whichever direction the goal implies. */
  dailyCalorieChange: number;
};

export type TimelineOutput = {
  weightDifferenceKg: number;
  /** Signed: negative when losing, positive when gaining. */
  weeklyChangeKg: number;
  weeks: number;
  months: number;
  /** Human-readable, e.g. "about 14 weeks". */
  summary: string;
  direction: "loss" | "gain";
  estimatedDate: string;
};

export function calculateTimeline(
  input: TimelineInput,
): CalcResult<TimelineOutput> {
  const errors = collect(
    checkNumber(
      "currentWeightKg",
      input.currentWeightKg,
      "weightKg",
      "current weight",
    ),
    checkNumber(
      "targetWeightKg",
      input.targetWeightKg,
      "weightKg",
      "target weight",
    ),
  );
  if (errors.length) return fail(errors);

  if (input.currentWeightKg === input.targetWeightKg) {
    return failOne(
      "targetWeightKg",
      "Target weight is the same as your current weight.",
    );
  }
  if (!Number.isFinite(input.dailyCalorieChange) || input.dailyCalorieChange <= 0) {
    return failOne(
      "dailyCalorieChange",
      "Enter a daily calorie change greater than zero.",
    );
  }

  const difference = Math.abs(input.currentWeightKg - input.targetWeightKg);
  const direction =
    input.targetWeightKg < input.currentWeightKg ? "loss" : "gain";

  const weeklyChangeKg = (input.dailyCalorieChange * 7) / KCAL_PER_KG_FAT;
  const weeks = difference / weeklyChangeKg;

  const estimated = new Date();
  estimated.setDate(estimated.getDate() + Math.round(weeks * 7));

  return ok({
    weightDifferenceKg: roundWeight(difference),
    weeklyChangeKg: round(direction === "loss" ? -weeklyChangeKg : weeklyChangeKg, 2),
    weeks: Math.ceil(weeks),
    months: round(weeks / 4.345, 1),
    summary: `about ${Math.ceil(weeks)} week${Math.ceil(weeks) === 1 ? "" : "s"}`,
    direction,
    estimatedDate: estimated.toISOString().slice(0, 10),
  });
}
