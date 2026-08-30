"use client";

import { calculateIdealWeight, kgToLb, round } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import { BigStat, EmptyState, ErrorList, Note, StatList } from "../controls";

export function IdealWeightPanel() {
  const { profile } = useProfile();

  if (profile.heightCm === null) {
    return <EmptyState>Enter your height above.</EmptyState>;
  }

  const result = calculateIdealWeight({
    heightCm: profile.heightCm,
    sex: profile.sex,
  });

  if (!result.ok) return <ErrorList errors={result.errors} />;

  const { healthyRangeKg, formulas } = result.data;
  const imperial = profile.units === "imperial";
  const unit = imperial ? "lb" : "kg";
  const conv = (kg: number) => (imperial ? round(kgToLb(kg), 1) : kg);

  const current = profile.weightKg;
  const inRange =
    current !== null &&
    current >= healthyRangeKg.min &&
    current <= healthyRangeKg.max;

  return (
    <>
      <BigStat
        value={`${conv(healthyRangeKg.min)}–${conv(healthyRangeKg.max)}`}
        unit={unit}
        caption="Healthy weight range for your height"
      />

      {current !== null && (
        <p className="mt-4 text-sm text-bone-300">
          You are currently{" "}
          <span className="text-bone-50 tabular-nums">
            {conv(current)} {unit}
          </span>
          {inRange
            ? " — inside this range."
            : current < healthyRangeKg.min
              ? ` — about ${round(Math.abs(conv(healthyRangeKg.min) - conv(current)), 1)} ${unit} below it.`
              : ` — about ${round(conv(current) - conv(healthyRangeKg.max), 1)} ${unit} above it.`}
        </p>
      )}

      <StatList
        rows={formulas.map((f) => ({
          label: f.name,
          value: `${conv(f.kg)} ${unit}`,
        }))}
      />

      <Note>
        There is no single ideal weight. The headline range is the weight that
        corresponds to a healthy BMI at your height, which is the most
        defensible answer. The four named formulas below it were originally
        derived for medication dosing rather than health, and they disagree
        with each other by several kilos — treat them as reference points, not
        targets.
      </Note>
    </>
  );
}
