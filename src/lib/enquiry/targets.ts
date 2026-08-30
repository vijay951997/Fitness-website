/**
 * Nutrition targets for an enquiry.
 *
 * Derived from whatever is in the form *now*, not frozen when the dialog
 * opened. Someone can change their goal or correct their weight while
 * filling it in, and a target computed from the old values would
 * contradict the goal stated a few lines above it in the same message.
 */

import {
  calculateCalorieTarget,
  calculateMacros,
  type GoalId,
} from "../calculations/index.ts";
import type { EnquiryData, EnquiryTargets, PrimaryGoalId } from "./types.ts";

/**
 * The enquiry form offers two goals the calculators have no equivalent
 * for. "General fitness" is treated as maintenance, which is what it
 * amounts to nutritionally. "Other" is left unmapped: without knowing the
 * intent, any number would be invented.
 */
export function calculatorGoalFor(goal: PrimaryGoalId | null): GoalId | null {
  switch (goal) {
    case "loss":
    case "gain":
    case "muscle":
    case "maintenance":
      return goal;
    case "general":
      return "maintenance";
    default:
      return null;
  }
}

/** Returns null whenever a defensible figure cannot be produced. */
export function computeTargets(data: EnquiryData): EnquiryTargets | null {
  const goal = calculatorGoalFor(data.primaryGoal);
  if (
    goal === null ||
    data.sex === null ||
    data.age === null ||
    data.heightCm === null ||
    data.currentWeightKg === null ||
    data.activity === null
  ) {
    return null;
  }

  const target = calculateCalorieTarget({
    sex: data.sex,
    age: data.age,
    weightKg: data.currentWeightKg,
    heightCm: data.heightCm,
    activity: data.activity,
    goal,
  });
  if (!target.ok) return null;

  const macros = calculateMacros({
    calories: target.data.targetCalories,
    weightKg: data.currentWeightKg,
    goal,
  });
  if (!macros.ok) return null;

  return {
    calories: target.data.targetCalories,
    proteinG: macros.data.protein.grams,
    carbsG: macros.data.carbs.grams,
    fatG: macros.data.fat.grams,
  };
}
