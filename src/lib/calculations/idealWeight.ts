/**
 * Healthy weight range for a given height.
 *
 * "Ideal weight" is a misnomer — the classic formulas (Devine, Robinson,
 * Miller, Hamwi) were derived for drug dosing, not health, and they
 * disagree with each other by several kilos. This module reports a BMI
 * based *range* as the headline, with the named formulas shown alongside
 * as reference points rather than as a single prescriptive number.
 */

import { HEALTHY_BMI } from "./constants.ts";
import { checkNumber, collect } from "./validate.ts";
import { cmToInches, roundWeight } from "./units.ts";
import { fail, ok, type CalcResult, type Sex } from "./types.ts";

export type IdealWeightInput = { heightCm: number; sex: Sex };

export type IdealWeightOutput = {
  /** The headline: the weight band matching a healthy BMI at this height. */
  healthyRangeKg: { min: number; max: number };
  /** Midpoint of the range, offered only as a rough centre of gravity. */
  midpointKg: number;
  /** Named formulas, for comparison. */
  formulas: { name: string; kg: number }[];
};

/** Inches of height above 5 feet — the input every classic formula uses. */
function inchesOverFiveFeet(heightCm: number): number {
  return Math.max(0, cmToInches(heightCm) - 60);
}

export function calculateIdealWeight(
  input: IdealWeightInput,
): CalcResult<IdealWeightOutput> {
  const errors = collect(
    checkNumber("heightCm", input.heightCm, "heightCm", "height"),
  );
  if (errors.length) return fail(errors);

  const heightM = input.heightCm / 100;
  const over = inchesOverFiveFeet(input.heightCm);
  const male = input.sex === "male";

  const formulas = [
    { name: "Devine", kg: (male ? 50 : 45.5) + 2.3 * over },
    { name: "Robinson", kg: (male ? 52 : 49) + (male ? 1.9 : 1.7) * over },
    { name: "Miller", kg: (male ? 56.2 : 53.1) + (male ? 1.41 : 1.36) * over },
    { name: "Hamwi", kg: (male ? 48 : 45.5) + (male ? 2.7 : 2.2) * over },
  ].map((f) => ({ name: f.name, kg: roundWeight(f.kg) }));

  const min = HEALTHY_BMI.min * heightM * heightM;
  const max = HEALTHY_BMI.max * heightM * heightM;

  return ok({
    healthyRangeKg: { min: roundWeight(min), max: roundWeight(max) },
    midpointKg: roundWeight((min + max) / 2),
    formulas,
  });
}
