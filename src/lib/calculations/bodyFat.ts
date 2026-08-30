/**
 * Body fat percentage, U.S. Navy circumference method.
 *
 * Accurate to roughly ±3–4% against hydrostatic weighing when the tape
 * measurements are taken carefully, which is good enough to track a trend
 * but not to treat as a precise figure.
 *
 * Male:   495 / (1.0324 − 0.19077·log10(waist − neck) + 0.15456·log10(height)) − 450
 * Female: 495 / (1.29579 − 0.35004·log10(waist + hip − neck) + 0.22100·log10(height)) − 450
 *
 * All measurements in centimetres.
 */

import { checkNumber, collect } from "./validate.ts";
import { roundBodyFat, roundWeight } from "./units.ts";
import {
  fail,
  failOne,
  ok,
  type CalcResult,
  type Sex,
} from "./types.ts";

export type BodyFatInput = {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  /** Required for women, ignored for men. */
  hipCm?: number;
  /** Optional — enables the fat mass / lean mass split. */
  weightKg?: number;
};

export type BodyFatOutput = {
  bodyFatPercent: number;
  category: string;
  /** Present only when a body weight was supplied. */
  fatMassKg: number | null;
  leanMassKg: number | null;
  method: "U.S. Navy";
};

const log10 = (n: number) => Math.log10(n);

export function calculateBodyFat(
  input: BodyFatInput,
): CalcResult<BodyFatOutput> {
  const female = input.sex === "female";

  const errors = collect(
    checkNumber("heightCm", input.heightCm, "heightCm", "height"),
    checkNumber("neckCm", input.neckCm, "neckCm", "neck measurement"),
    checkNumber("waistCm", input.waistCm, "waistCm", "waist measurement"),
    female
      ? checkNumber("hipCm", input.hipCm ?? Number.NaN, "hipCm", "hip measurement")
      : null,
    input.weightKg !== undefined
      ? checkNumber("weightKg", input.weightKg, "weightKg", "weight")
      : null,
  );
  if (errors.length) return fail(errors);

  // The logarithms are only defined for a positive girth difference, and a
  // waist at or below neck size means the tape was misread.
  const girth = female
    ? input.waistCm + (input.hipCm ?? 0) - input.neckCm
    : input.waistCm - input.neckCm;

  if (girth <= 0) {
    return failOne(
      "waistCm",
      "Waist must be larger than neck. Check your measurements.",
    );
  }

  const raw = female
    ? 495 /
        (1.29579 - 0.35004 * log10(girth) + 0.221 * log10(input.heightCm)) -
      450
    : 495 /
        (1.0324 - 0.19077 * log10(girth) + 0.15456 * log10(input.heightCm)) -
      450;

  if (!Number.isFinite(raw) || raw <= 0 || raw >= 75) {
    return failOne(
      "waistCm",
      "Those measurements produce an implausible result. Please re-check them.",
    );
  }

  const percent = roundBodyFat(raw);
  const weightKg = input.weightKg;

  return ok({
    bodyFatPercent: percent,
    category: bodyFatCategory(percent, input.sex),
    fatMassKg: weightKg ? roundWeight((percent / 100) * weightKg) : null,
    leanMassKg: weightKg ? roundWeight(weightKg * (1 - percent / 100)) : null,
    method: "U.S. Navy",
  });
}

/** Bands follow the American Council on Exercise categories. */
export function bodyFatCategory(percent: number, sex: Sex): string {
  const bands =
    sex === "male"
      ? [
          { max: 6, label: "Essential fat" },
          { max: 14, label: "Athletic" },
          { max: 18, label: "Fitness" },
          { max: 25, label: "Average" },
          { max: Infinity, label: "Above average" },
        ]
      : [
          { max: 14, label: "Essential fat" },
          { max: 21, label: "Athletic" },
          { max: 25, label: "Fitness" },
          { max: 32, label: "Average" },
          { max: Infinity, label: "Above average" },
        ];
  return bands.find((b) => percent < b.max)?.label ?? "Above average";
}
