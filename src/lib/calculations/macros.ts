/**
 * Macronutrient split.
 *
 * Protein is anchored to body weight rather than to a share of calories,
 * which is the more defensible approach: protein need tracks lean mass,
 * not how much you happen to be eating. Fat then takes a set share of the
 * calories left over, and carbohydrate takes the remainder.
 */

import { KCAL_PER_GRAM, MACRO_PROFILES } from "./constants.ts";
import { checkNumber, collect } from "./validate.ts";
import { roundCalories, roundGrams, round } from "./units.ts";
import { fail, ok, type CalcResult, type GoalId } from "./types.ts";

export type MacroInput = {
  calories: number;
  weightKg: number;
  goal: GoalId;
  /** Overrides the profile default, for the "adjust it yourself" control. */
  proteinPerKg?: number;
  fatShareOfRemainder?: number;
};

export type MacroGram = {
  grams: number;
  calories: number;
  /** Share of total calories, 0–100. */
  percent: number;
};

export type MacroOutput = {
  calories: number;
  protein: MacroGram;
  carbs: MacroGram;
  fat: MacroGram;
  proteinPerKg: number;
  profileLabel: string;
};

export function calculateMacros(input: MacroInput): CalcResult<MacroOutput> {
  const errors = collect(
    checkNumber("calories", input.calories, "calories", "calorie target"),
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
  );
  if (errors.length) return fail(errors);

  const profile = MACRO_PROFILES[input.goal] ?? MACRO_PROFILES.maintenance;
  const proteinPerKg = input.proteinPerKg ?? profile.proteinPerKg;
  const fatShare = input.fatShareOfRemainder ?? profile.fatShareOfRemainder;

  const proteinGrams = input.weightKg * proteinPerKg;
  let proteinCalories = proteinGrams * KCAL_PER_GRAM.protein;

  // At a very low calorie target with a heavy client, protein alone could
  // exceed the budget. Cap it at 80% so fat and carbs stay non-negative.
  const proteinCap = input.calories * 0.8;
  const cappedProteinCalories = Math.min(proteinCalories, proteinCap);
  proteinCalories = cappedProteinCalories;

  const remaining = Math.max(0, input.calories - proteinCalories);
  const fatCalories = remaining * fatShare;
  const carbCalories = remaining - fatCalories;

  const macro = (calories: number, perGram: number): MacroGram => ({
    grams: roundGrams(calories / perGram),
    calories: roundCalories(calories),
    percent: round((calories / input.calories) * 100, 1),
  });

  return ok({
    calories: roundCalories(input.calories),
    protein: macro(proteinCalories, KCAL_PER_GRAM.protein),
    carbs: macro(carbCalories, KCAL_PER_GRAM.carbs),
    fat: macro(fatCalories, KCAL_PER_GRAM.fat),
    proteinPerKg: round(proteinCalories / KCAL_PER_GRAM.protein / input.weightKg, 2),
    profileLabel: profile.label,
  });
}
