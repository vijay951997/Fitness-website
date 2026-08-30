/**
 * Body mass index, plus the healthy weight range that corresponds to it.
 *
 * BMI is a population screening tool. It takes no account of body
 * composition, so a muscular person can register as "overweight" while
 * carrying little fat. The UI must show that caveat alongside the number.
 */

import { BMI_CATEGORIES, HEALTHY_BMI } from "./constants.ts";
import { checkNumber, collect } from "./validate.ts";
import { roundBmi, roundWeight } from "./units.ts";
import { fail, ok, type CalcResult } from "./types.ts";

export type BmiInput = { weightKg: number; heightCm: number };

export type BmiOutput = {
  bmi: number;
  category: string;
  healthyRange: { min: number; max: number };
  /** The weight range, in kg, that would put this height in the healthy band. */
  healthyWeightKg: { min: number; max: number };
};

export function calculateBmi(input: BmiInput): CalcResult<BmiOutput> {
  const errors = collect(
    checkNumber("weightKg", input.weightKg, "weightKg", "weight"),
    checkNumber("heightCm", input.heightCm, "heightCm", "height"),
  );
  if (errors.length) return fail(errors);

  const heightM = input.heightCm / 100;
  const bmi = input.weightKg / (heightM * heightM);

  return ok({
    bmi: roundBmi(bmi),
    category: bmiCategory(bmi),
    healthyRange: { min: HEALTHY_BMI.min, max: HEALTHY_BMI.max },
    healthyWeightKg: {
      min: roundWeight(HEALTHY_BMI.min * heightM * heightM),
      max: roundWeight(HEALTHY_BMI.max * heightM * heightM),
    },
  });
}

export function bmiCategory(bmi: number): string {
  return (
    BMI_CATEGORIES.find((c) => bmi < c.max)?.label ??
    BMI_CATEGORIES[BMI_CATEGORIES.length - 1].label
  );
}
