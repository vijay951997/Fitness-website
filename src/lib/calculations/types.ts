/**
 * Shared vocabulary for the calculation engine.
 *
 * Everything here is pure data — no React, no DOM. The engine is designed
 * to be callable from a server, a test runner or a component without
 * change, so nothing in `src/lib/calculations` may import from
 * `src/components`.
 */

export type Sex = "male" | "female";

export type UnitSystem = "metric" | "imperial";

export type ActivityLevelId =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "extra";

export type GoalId = "loss" | "maintenance" | "gain" | "muscle";

export type DeficitLevelId = "conservative" | "moderate" | "aggressive";

/** A single failed validation, addressed to the form field that caused it. */
export type ValidationError = {
  field: string;
  message: string;
};

/**
 * Every calculator returns this shape rather than throwing or returning
 * NaN. Callers must narrow on `ok`, which makes it impossible to render an
 * invalid result by accident.
 */
export type CalcResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: ValidationError[] };

export function ok<T>(data: T): CalcResult<T> {
  return { ok: true, data };
}

export function fail<T>(errors: ValidationError[]): CalcResult<T> {
  return { ok: false, errors };
}

/** Convenience for the common single-error case. */
export function failOne<T>(field: string, message: string): CalcResult<T> {
  return { ok: false, errors: [{ field, message }] };
}
