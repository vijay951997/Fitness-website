"use client";

import { calculateBmi, kgToLb, round } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import { BigStat, EmptyState, ErrorList, Note, StatList } from "../controls";
import { cx } from "../../ui";

/** Where the reading sits on the 15–40 scale, as a percentage. */
function markerPosition(bmi: number): number {
  const clamped = Math.min(40, Math.max(15, bmi));
  return ((clamped - 15) / 25) * 100;
}

const BANDS = [
  { label: "Under", width: 14, tone: "bg-bone-500" },
  { label: "Normal", width: 26, tone: "bg-lime-400" },
  { label: "Over", width: 20, tone: "bg-bone-400" },
  { label: "Obese", width: 40, tone: "bg-bone-500" },
];

export function BmiPanel() {
  const { profile } = useProfile();
  const hasBody = profile.heightCm !== null && profile.weightKg !== null;

  if (!hasBody) {
    return <EmptyState>Enter your height and weight above.</EmptyState>;
  }

  const result = calculateBmi({
    weightKg: profile.weightKg as number,
    heightCm: profile.heightCm as number,
  });

  if (!result.ok) return <ErrorList errors={result.errors} />;

  const { bmi, category, healthyWeightKg } = result.data;
  const imperial = profile.units === "imperial";
  const fmt = (kg: number) =>
    imperial ? `${round(kgToLb(kg), 1)} lb` : `${kg} kg`;

  return (
    <>
      <BigStat value={String(bmi)} caption="Body mass index" />

      {/* Category is stated in words, not signalled by colour alone. */}
      <p className="mt-4 inline-flex bg-lime-400 px-3 py-1.5 text-xs font-medium tracking-wide text-ink-950 uppercase">
        {category}
      </p>

      <div className="mt-6" aria-hidden>
        <div className="flex h-2 w-full overflow-hidden">
          {BANDS.map((band) => (
            <span
              key={band.label}
              className={cx(band.tone)}
              style={{ width: `${band.width}%` }}
            />
          ))}
        </div>
        <div className="relative mt-1 h-4">
          <span
            className="absolute top-0 -translate-x-1/2 text-lime-400"
            style={{ left: `${markerPosition(bmi)}%` }}
          >
            ▲
          </span>
        </div>
        <div className="label flex justify-between text-bone-500">
          <span>15</span>
          <span>40</span>
        </div>
      </div>

      <StatList
        rows={[
          { label: "Healthy BMI", value: "18.5 – 24.9" },
          {
            label: "Healthy weight",
            value: `${fmt(healthyWeightKg.min)} – ${fmt(healthyWeightKg.max)}`,
          },
        ]}
      />

      <Note>
        BMI is a screening measure for populations, not a measure of body fat.
        It cannot tell muscle from fat, so a well-trained person can read as
        &ldquo;overweight&rdquo; while carrying very little fat. Read it
        alongside your waist measurement and how your clothes fit, not on its
        own.
      </Note>
    </>
  );
}
