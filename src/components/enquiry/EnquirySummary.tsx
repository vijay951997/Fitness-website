"use client";

import { ACTIVITY_LEVELS, kgToLb, round } from "@/lib/calculations";
import { services } from "@/config/site";
import {
  CONTACT_METHODS,
  EXPERIENCE_LEVELS,
  PRIMARY_GOALS,
  type EnquiryData,
} from "@/lib/enquiry";

/**
 * The review step: a compact read-back of what the visitor entered.
 *
 * Deliberately not the raw generated message — that was a wall of text on
 * a phone. This mirrors the same conditional rule as the message builder:
 * a row appears only when it has a real value, so an empty answer is never
 * shown as blank.
 */
function label(
  list: readonly { id: string; label: string }[],
  id: string | null,
): string | null {
  return id ? (list.find((i) => i.id === id)?.label ?? null) : null;
}

export function EnquirySummary({ data }: { data: EnquiryData }) {
  const imperial = data.units === "imperial";
  const weight = (kg: number | null) =>
    kg === null || !Number.isFinite(kg)
      ? null
      : imperial
        ? `${round(kgToLb(kg), 1)} lb`
        : `${round(kg, 1)} kg`;

  const rows: { label: string; value: string | null }[] = [
    { label: "Name", value: data.name.trim() || null },
    { label: "Mobile", value: data.phone.trim() || null },
    { label: "Email", value: data.email.trim() || null },
    {
      label: "Goal",
      value: label(PRIMARY_GOALS, data.primaryGoal),
    },
    {
      label: "Experience",
      value: label(EXPERIENCE_LEVELS, data.experience),
    },
    {
      label: "Age",
      value:
        data.age !== null && Number.isFinite(data.age) ? `${data.age}` : null,
    },
    { label: "Current weight", value: weight(data.currentWeightKg) },
    { label: "Target weight", value: weight(data.targetWeightKg) },
    {
      label: "Activity",
      value: data.activity
        ? (ACTIVITY_LEVELS.find((a) => a.id === data.activity)?.label ?? null)
        : null,
    },
    {
      label: "Reply by",
      value: label(CONTACT_METHODS, data.contactMethod),
    },
  ].filter((row) => row.value !== null);

  const chosen = data.services
    .map((id) => services.find((s) => s.id === id)?.title)
    .filter(Boolean);

  return (
    <div>
      <p className="label text-bone-500">Check your details</p>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="label text-bone-500">{row.label}</dt>
            <dd className="break-words text-bone-100">{row.value}</dd>
          </div>
        ))}
      </dl>

      {chosen.length > 0 && (
        <div className="mt-5 border-t border-bone-50/12 pt-4">
          <p className="label text-bone-500">Interested in</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {chosen.map((title) => (
              <li
                key={title}
                className="border border-lime-400/40 px-2.5 py-1 text-xs text-lime-400"
              >
                {title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.targets && (
        <p className="mt-5 border-t border-bone-50/12 pt-4 text-sm text-bone-400">
          Your calculated targets are included —{" "}
          <span className="text-bone-100">
            {data.targets.calories.toLocaleString("en-US")} kcal
          </span>
          , {data.targets.proteinG}g protein, {data.targets.carbsG}g carbs,{" "}
          {data.targets.fatG}g fat.
        </p>
      )}

      <p className="mt-5 text-sm leading-relaxed text-bone-400">
        WhatsApp will open with this written out in full. You can read it over
        and edit it there before you press send.
      </p>
    </div>
  );
}
