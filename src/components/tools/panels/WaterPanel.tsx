"use client";

import { useState } from "react";
import { calculateWater } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import {
  BigStat,
  EmptyState,
  ErrorList,
  Field,
  Note,
  NumberInput,
  StatList,
  useFieldId,
} from "../controls";

export function WaterPanel() {
  const { profile } = useProfile();
  const [minutes, setMinutes] = useState("30");
  const minutesId = useFieldId("exercise");

  if (profile.weightKg === null) {
    return <EmptyState>Enter your weight above.</EmptyState>;
  }

  const parsed = minutes.trim() === "" ? 0 : Number.parseFloat(minutes);

  const result = calculateWater({
    weightKg: profile.weightKg,
    activity: profile.activity,
    exerciseMinutes: Number.isNaN(parsed) ? Number.NaN : parsed,
  });

  return (
    <>
      <div className="mb-7">
        <Field
          label="Exercise on a typical day"
          htmlFor={minutesId}
          error={
            !result.ok
              ? (result.errors.find((e) => e.field === "exerciseMinutes")
                  ?.message ?? null)
              : null
          }
        >
          <NumberInput
            id={minutesId}
            value={minutes}
            onChange={setMinutes}
            placeholder="30"
            suffix="min"
            invalid={!result.ok}
          />
        </Field>
      </div>

      {!result.ok ? (
        <ErrorList errors={result.errors} />
      ) : (
        <>
          <BigStat
            value={String(result.data.litres)}
            unit="litres / day"
            caption="Estimated water target"
          />
          <StatList
            rows={[
              {
                label: "Millilitres",
                value: `${result.data.millilitres.toLocaleString("en-US")} ml`,
              },
              {
                label: "Glasses",
                value: `${result.data.glasses} × 250 ml`,
              },
              {
                label: "Baseline",
                value: `${result.data.breakdown.baselineMl.toLocaleString("en-US")} ml`,
              },
              {
                label: "From exercise",
                value: `+${result.data.breakdown.exerciseMl.toLocaleString("en-US")} ml`,
              },
            ]}
          />
          <Note>
            Worked out as 35 ml per kg of body weight, scaled by your activity
            level, plus 12 ml for each minute of exercise. This is total daily
            fluid — tea, coffee, milk and the water in your food all count
            toward it, so it is not 3 litres of plain water on top of
            everything else. Hot, humid weather pushes it higher.
          </Note>
        </>
      )}
    </>
  );
}
