/**
 * The enquiry data model.
 *
 * Kept deliberately separate from `Profile` (src/lib/profile.tsx): the
 * profile is the visitor's own calculator state and persists indefinitely,
 * whereas an enquiry is a one-off submission that also carries personal
 * contact details. The enquiry borrows from the profile at open time but
 * does not write back to it, so editing the form never disturbs someone's
 * saved calculator figures.
 */

import type {
  ActivityLevelId,
  Sex,
  UnitSystem,
} from "../calculations/index.ts";

export type PrimaryGoalId =
  | "loss"
  | "gain"
  | "muscle"
  | "general"
  | "maintenance"
  | "other";

export type ExperienceId = "beginner" | "intermediate" | "advanced";

export type ContactMethodId = "whatsapp" | "call" | "email";

export const PRIMARY_GOALS: readonly { id: PrimaryGoalId; label: string }[] = [
  { id: "loss", label: "Weight loss" },
  { id: "gain", label: "Weight gain" },
  { id: "muscle", label: "Muscle building" },
  { id: "general", label: "General fitness" },
  { id: "maintenance", label: "Maintenance" },
  { id: "other", label: "Other" },
] as const;

export const EXPERIENCE_LEVELS: readonly {
  id: ExperienceId;
  label: string;
  description: string;
}[] = [
  { id: "beginner", label: "Beginner", description: "New, or returning after a long break" },
  { id: "intermediate", label: "Intermediate", description: "Training consistently for a while" },
  { id: "advanced", label: "Advanced", description: "Years of structured training" },
] as const;

export const CONTACT_METHODS: readonly {
  id: ContactMethodId;
  label: string;
}[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Phone call" },
  { id: "email", label: "Email" },
] as const;

/** Nutrition targets carried over from the calculators, when available. */
export type EnquiryTargets = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type EnquiryData = {
  /* Personal details */
  name: string;
  phone: string;
  email: string;

  /* Fitness profile — all optional, mirroring the calculator profile */
  age: number | null;
  sex: Sex | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;
  activity: ActivityLevelId | null;
  experience: ExperienceId | null;

  /* Goal and interest */
  primaryGoal: PrimaryGoalId | null;
  /** Service ids from `services` in src/config/site.ts. */
  services: string[];
  /**
   * The pricing plan whose button was clicked, when the enquiry started
   * from the plans table. Tells the trainer which tier prompted it.
   */
  planName: string | null;
  contactMethod: ContactMethodId;

  /* Free text */
  additionalMessage: string;

  /* Context */
  units: UnitSystem;
  /** Computed from the profile at open time; null when not calculable. */
  targets: EnquiryTargets | null;
};

export const EMPTY_ENQUIRY: EnquiryData = {
  name: "",
  phone: "",
  email: "",
  age: null,
  sex: null,
  heightCm: null,
  currentWeightKg: null,
  targetWeightKg: null,
  activity: null,
  experience: null,
  primaryGoal: null,
  services: [],
  planName: null,
  contactMethod: "whatsapp",
  additionalMessage: "",
  units: "metric",
  targets: null,
};

/** Longest free-text message accepted, to keep the WhatsApp URL usable. */
export const MAX_MESSAGE_LENGTH = 1000;

/**
 * The calculators use a narrower goal vocabulary than the enquiry form.
 * This maps one onto the other so an existing profile pre-fills the goal.
 */
export function primaryGoalFromCalculatorGoal(
  goal: "loss" | "maintenance" | "gain" | "muscle",
): PrimaryGoalId {
  return goal;
}
