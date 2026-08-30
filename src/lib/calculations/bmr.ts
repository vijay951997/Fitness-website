/**
 * Basal metabolic rate — the energy the body uses at complete rest.
 *
 * Mifflin-St Jeor (1990) is the default: it is the equation most dietetic
 * bodies now recommend for healthy adults, and it is more accurate than
 * Harris-Benedict for modern populations.
 */

import { collect, checkNumber } from "./validate.ts";
import { roundCalories } from "./units.ts";
import { ok, fail, type CalcResult, type Sex } from "./types.ts";

export type BmrInput = {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
};

export type BmrOutput = {
  bmr: number;
  /** Which equation produced the number, for display. */
  formula: "Mifflin-St Jeor";
};

/**
 * Male:   (10 × kg) + (6.25 × cm) − (5 × age) + 5
 * Female: (10 × kg) + (6.25 × cm) − (5 × age) − 161
 */
export function calculateBmr(input: BmrInput): CalcResult<BmrOutput> {
  const errors = collect(
    checkNumber("age", input.age, "age", "age"),
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
    checkNumber("heightCm", input.heightCm, "heightCm", "height"),
  );
  if (errors.length) return fail(errors);

  const base =
    10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  const bmr = input.sex === "male" ? base + 5 : base - 161;

  return ok({ bmr: roundCalories(bmr), formula: "Mifflin-St Jeor" });
}
