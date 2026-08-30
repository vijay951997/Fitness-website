/**
 * Unit conversion and rounding.
 *
 * The engine works exclusively in metric internally — kg, cm, ml, minutes.
 * Imperial input is converted at the boundary and converted back only for
 * display, so no formula ever has to know which unit system the user chose.
 */

import {
  CM_PER_INCH,
  GLASS_ML,
  INCHES_PER_FOOT,
  LB_PER_KG,
  ML_PER_FL_OZ,
} from "./constants.ts";

/* ── Mass ─────────────────────────────────────────────────── */

export const kgToLb = (kg: number) => kg * LB_PER_KG;
export const lbToKg = (lb: number) => lb / LB_PER_KG;

/* ── Length ───────────────────────────────────────────────── */

export const cmToInches = (cm: number) => cm / CM_PER_INCH;
export const inchesToCm = (inches: number) => inches * CM_PER_INCH;

export const feetInchesToCm = (feet: number, inches: number) =>
  inchesToCm(feet * INCHES_PER_FOOT + inches);

/** Splits a metric height into whole feet plus remaining inches. */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = round(totalInches - feet * INCHES_PER_FOOT, 1);
  // Rounding can push inches to exactly 12; carry it into feet.
  return inches >= INCHES_PER_FOOT
    ? { feet: feet + 1, inches: 0 }
    : { feet, inches };
}

/* ── Volume ───────────────────────────────────────────────── */

export const mlToLitres = (ml: number) => ml / 1000;
export const mlToFlOz = (ml: number) => ml / ML_PER_FL_OZ;
export const mlToGlasses = (ml: number) => ml / GLASS_ML;

/* ── Rounding ─────────────────────────────────────────────── */

/** Rounds to `dp` decimal places, avoiding binary float drift. */
export function round(value: number, dp = 0): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** dp;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Rounding conventions, fixed here so every calculator and every component
 * agrees on precision.
 */
export const roundCalories = (n: number) => Math.round(n);
export const roundGrams = (n: number) => Math.round(n);
export const roundWeight = (n: number) => round(n, 1);
export const roundBmi = (n: number) => round(n, 1);
export const roundBodyFat = (n: number) => round(n, 1);
export const roundLitres = (n: number) => round(n, 1);
export const roundDistance = (n: number) => round(n, 2);

/**
 * Guards a number on its way to the UI. Anything non-finite — NaN from a
 * malformed parse, Infinity from a divide by zero — becomes the fallback
 * rather than rendering as "NaN".
 */
export function safe(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}
