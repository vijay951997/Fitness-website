/**
 * Input guards shared by every calculator.
 *
 * Each helper returns a `ValidationError` or `null`, so a calculator can
 * collect several problems and report them all at once rather than
 * surfacing them one refresh at a time.
 */

import type { ValidationError } from "./types.ts";

/** Plausible human ranges, in metric. Deliberately generous. */
export const LIMITS = {
  age: { min: 13, max: 100 },
  weightKg: { min: 25, max: 350 },
  heightCm: { min: 100, max: 250 },
  neckCm: { min: 20, max: 80 },
  waistCm: { min: 40, max: 200 },
  hipCm: { min: 50, max: 200 },
  durationMin: { min: 1, max: 600 },
  steps: { min: 0, max: 200_000 },
  calories: { min: 500, max: 10_000 },
} as const;

export type LimitKey = keyof typeof LIMITS;

function err(field: string, message: string): ValidationError {
  return { field, message };
}

/**
 * The common case: a required number that must be finite and inside a
 * named range. Returns the first problem found, or null when valid.
 */
export function checkNumber(
  field: string,
  value: number,
  limit: LimitKey,
  label: string,
): ValidationError | null {
  if (!Number.isFinite(value)) {
    return err(field, `Enter a ${label}.`);
  }
  if (value <= 0) {
    return err(field, `${capitalise(label)} must be greater than zero.`);
  }
  const { min, max } = LIMITS[limit];
  if (value < min || value > max) {
    return err(field, `${capitalise(label)} should be between ${min} and ${max}.`);
  }
  return null;
}

/** Like `checkNumber` but allows zero — for steps, duration and similar. */
export function checkNonNegative(
  field: string,
  value: number,
  limit: LimitKey,
  label: string,
): ValidationError | null {
  if (!Number.isFinite(value)) {
    return err(field, `Enter a ${label}.`);
  }
  if (value < 0) {
    return err(field, `${capitalise(label)} cannot be negative.`);
  }
  const { max } = LIMITS[limit];
  if (value > max) {
    return err(field, `${capitalise(label)} should be ${max} or less.`);
  }
  return null;
}

/** Drops the nulls so a calculator can build its error list in one pass. */
export function collect(
  ...checks: (ValidationError | null)[]
): ValidationError[] {
  return checks.filter((c): c is ValidationError => c !== null);
}

/**
 * Parses free text from an input element. Empty strings and junk become
 * NaN, which the checks above turn into a readable message.
 */
export function parseNumber(input: string | number): number {
  if (typeof input === "number") return input;
  const trimmed = input.trim();
  if (trimmed === "") return Number.NaN;
  return Number.parseFloat(trimmed);
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
