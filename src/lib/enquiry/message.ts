/**
 * Builds the enquiry message.
 *
 * Pure and UI-free, so it can be unit tested and so no component ever
 * assembles the text by hand.
 *
 * The governing rule: a field appears only when it holds a real value. A
 * blank line is better than "Target weight: undefined", and a whole
 * section is dropped when nothing inside it was filled in — Vijay reads
 * these on a phone, so noise is expensive.
 */

import {
  ACTIVITY_LEVELS,
  cmToFeetInches,
  kgToLb,
  round,
  type ActivityLevelId,
  type UnitSystem,
} from "../calculations/index.ts";
import { services } from "../../config/site.ts";
import {
  CONTACT_METHODS,
  EXPERIENCE_LEVELS,
  PRIMARY_GOALS,
  type EnquiryData,
} from "./types.ts";

/* ── Formatting helpers ───────────────────────────────────── */

/** Guards every number on its way into the message. */
function isReal(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatWeight(kg: number | null, units: UnitSystem): string | null {
  if (!isReal(kg)) return null;
  return units === "imperial"
    ? `${round(kgToLb(kg), 1)} lb`
    : `${round(kg, 1)} kg`;
}

function formatHeight(cm: number | null, units: UnitSystem): string | null {
  if (!isReal(cm)) return null;
  if (units === "imperial") {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet} ft ${inches} in`;
  }
  return `${round(cm, 1)} cm`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function activityLabel(id: ActivityLevelId | null): string | null {
  if (!id) return null;
  return ACTIVITY_LEVELS.find((a) => a.id === id)?.label ?? null;
}

function labelFrom(
  list: readonly { id: string; label: string }[],
  id: string | null,
): string | null {
  if (!id) return null;
  return list.find((item) => item.id === id)?.label ?? null;
}

/* ── Section assembly ─────────────────────────────────────── */

type Line = { label: string; value: string | null };

/**
 * Renders a titled block, or nothing at all when every line is empty.
 * This is what keeps the message free of hollow headings.
 */
function section(title: string, lines: Line[]): string | null {
  const filled = lines.filter(
    (line): line is { label: string; value: string } =>
      line.value !== null && line.value.trim() !== "",
  );
  if (filled.length === 0) return null;
  const body = filled.map((l) => `${l.label}: ${l.value}`).join("\n");
  return `${title}\n${body}`;
}

function listSection(title: string, items: string[]): string | null {
  if (items.length === 0) return null;
  return `${title}\n${items.map((i) => `- ${i}`).join("\n")}`;
}

function textSection(title: string, text: string): string | null {
  const trimmed = text.trim();
  return trimmed === "" ? null : `${title}\n${trimmed}`;
}

/* ── The builder ──────────────────────────────────────────── */

export function buildEnquiryMessage(data: EnquiryData): string {
  const units = data.units;

  const serviceNames: string[] = data.services.flatMap((id) => {
    const title = services.find((s) => s.id === id)?.title;
    return title ? [String(title)] : [];
  });

  const blocks: (string | null)[] = [
    "Hello, I would like to enquire about your fitness coaching services.",

    section("CLIENT DETAILS", [
      { label: "Name", value: data.name.trim() || null },
      { label: "Mobile", value: data.phone.trim() || null },
      { label: "Email", value: data.email.trim() || null },
    ]),

    section("FITNESS PROFILE", [
      { label: "Age", value: isReal(data.age) ? `${data.age}` : null },
      {
        label: "Gender",
        value: data.sex ? (data.sex === "male" ? "Male" : "Female") : null,
      },
      { label: "Height", value: formatHeight(data.heightCm, units) },
      {
        label: "Current weight",
        value: formatWeight(data.currentWeightKg, units),
      },
      {
        label: "Target weight",
        value: formatWeight(data.targetWeightKg, units),
      },
      { label: "Activity level", value: activityLabel(data.activity) },
      {
        label: "Experience",
        value: labelFrom(EXPERIENCE_LEVELS, data.experience),
      },
    ]),

    section("GOAL", [
      {
        label: "Primary goal",
        value: labelFrom(PRIMARY_GOALS, data.primaryGoal),
      },
    ]),

    data.targets
      ? section("CALCULATED TARGETS", [
          {
            label: "Daily calories",
            value: isReal(data.targets.calories)
              ? `${formatNumber(data.targets.calories)} kcal`
              : null,
          },
          {
            label: "Protein",
            value: isReal(data.targets.proteinG)
              ? `${data.targets.proteinG} g`
              : null,
          },
          {
            label: "Carbohydrates",
            value: isReal(data.targets.carbsG)
              ? `${data.targets.carbsG} g`
              : null,
          },
          {
            label: "Fat",
            value: isReal(data.targets.fatG) ? `${data.targets.fatG} g` : null,
          },
        ])
      : null,

    listSection("SERVICES INTERESTED IN", serviceNames),

    section("PREFERRED CONTACT", [
      {
        label: "Method",
        value: labelFrom(CONTACT_METHODS, data.contactMethod),
      },
    ]),

    textSection("ADDITIONAL MESSAGE", data.additionalMessage),

    "Thank you.",
  ];

  return blocks.filter((b): b is string => b !== null).join("\n\n");
}
