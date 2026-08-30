/**
 * Enquiry validation.
 *
 * Returns the same `ValidationError` shape the calculation engine uses, so
 * the form can render errors with the existing controls. Pure functions —
 * no DOM, no React — so every rule is directly testable.
 */

import type { ValidationError } from "../calculations/index.ts";
import {
  MAX_MESSAGE_LENGTH,
  type EnquiryData,
} from "./types.ts";

/* ── Field rules ──────────────────────────────────────────── */

/**
 * Deliberately permissive: enough digits to be dialable, and tolerant of
 * the spacing, dashes, brackets and leading +country people actually type.
 * Rejecting valid numbers is worse than accepting an odd one, since a
 * human reads every enquiry.
 */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Pragmatic email check. Full RFC 5322 conformance is neither achievable
 * with a regex nor useful here; this catches the typos that matter.
 */
export function isValidEmail(raw: string): boolean {
  const value = raw.trim();
  if (value.length > 254 || /\s/.test(value)) return false;
  return /^[^@]+@[^@.]+(\.[^@.]+)+$/.test(value);
}

const RANGES = {
  age: { min: 13, max: 100, label: "Age", unit: "years" },
  heightCm: { min: 100, max: 250, label: "Height", unit: "cm" },
  currentWeightKg: { min: 25, max: 300, label: "Current weight", unit: "kg" },
  targetWeightKg: { min: 25, max: 300, label: "Target weight", unit: "kg" },
} as const;

type RangeField = keyof typeof RANGES;

function checkRange(
  field: RangeField,
  value: number | null,
): ValidationError | null {
  if (value === null) return null; // optional — absence is fine
  const { min, max, label, unit } = RANGES[field];
  if (!Number.isFinite(value)) {
    return { field, message: `${label} must be a number.` };
  }
  if (value < min || value > max) {
    return {
      field,
      message: `${label} should be between ${min} and ${max} ${unit}.`,
    };
  }
  return null;
}

/* ── Whole-form validation ────────────────────────────────── */

/**
 * Required: name, a dialable phone number, and a primary goal. Email is
 * required only when it is the preferred way to be contacted; otherwise it
 * is optional but still checked if filled in. Everything else is optional
 * — the point is to lower the barrier to enquiring, not to interrogate.
 */
export function validateEnquiry(data: EnquiryData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Please enter your name." });
  }

  if (data.phone.trim() === "") {
    errors.push({ field: "phone", message: "Please enter a mobile number." });
  } else if (!isValidPhone(data.phone)) {
    errors.push({
      field: "phone",
      message: "That does not look like a valid mobile number.",
    });
  }

  const emailFilled = data.email.trim() !== "";
  if (data.contactMethod === "email" && !emailFilled) {
    errors.push({
      field: "email",
      message: "An email address is needed if you would like to be emailed.",
    });
  } else if (emailFilled && !isValidEmail(data.email)) {
    errors.push({ field: "email", message: "Please check your email address." });
  }

  if (data.primaryGoal === null) {
    errors.push({ field: "primaryGoal", message: "Please choose a main goal." });
  }

  for (const field of Object.keys(RANGES) as RangeField[]) {
    const error = checkRange(field, data[field]);
    if (error) errors.push(error);
  }

  if (data.additionalMessage.length > MAX_MESSAGE_LENGTH) {
    errors.push({
      field: "additionalMessage",
      message: `Please keep this under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  return errors;
}

/** Convenience for wiring a single field's message into the UI. */
export function errorFor(
  errors: ValidationError[],
  field: string,
): string | null {
  return errors.find((e) => e.field === field)?.message ?? null;
}
