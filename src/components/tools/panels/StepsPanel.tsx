"use client";

import { useState } from "react";
import {
  WALKING_PACES,
  calculateSteps,
  type WalkingPaceId,
} from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import {
  BigStat,
  EmptyState,
  ErrorList,
  Field,
  Note,
  NumberInput,
  Segmented,
  StatList,
  useFieldId,
} from "../controls";

export function StepsPanel() {
  const { profile } = useProfile();
  const [steps, setSteps] = useState("10000");
  const [pace, setPace] = useState<WalkingPaceId>("normal");
  const stepsId = useFieldId("steps");

  if (profile.weightKg === null) {
    return <EmptyState>Enter your weight above.</EmptyState>;
  }

  const parsed = steps.trim() === "" ? Number.NaN : Number.parseFloat(steps);

  const result = calculateSteps({
    steps: parsed,
    weightKg: profile.weightKg,
    heightCm: profile.heightCm ?? undefined,
    pace,
  });

  const stepsError = !result.ok
    ? (result.errors.find((e) => e.field === "steps")?.message ?? null)
    : null;

  const imperial = profile.units === "imperial";

  return (
    <>
      <div className="mb-7 grid gap-6 sm:grid-cols-2">
        <Field label="Steps today" htmlFor={stepsId} error={stepsError}>
          <NumberInput
            id={stepsId}
            value={steps}
            onChange={setSteps}
            placeholder="10000"
            invalid={Boolean(stepsError)}
          />
        </Field>

        <Segmented<WalkingPaceId>
          legend="Pace"
          value={pace}
          onChange={setPace}
          columns={3}
          options={WALKING_PACES.map((p) => ({
            id: p.id,
            label: p.label.split(" ")[0],
            description: p.label,
          }))}
        />
      </div>

      {!result.ok ? (
        <ErrorList errors={result.errors} />
      ) : (
        <>
          <BigStat
            value={result.data.caloriesBurned.toLocaleString("en-US")}
            unit="kcal burned"
            caption={`${result.data.steps.toLocaleString("en-US")} steps`}
          />
          <StatList
            rows={[
              {
                label: "Distance",
                value: imperial
                  ? `${result.data.distanceMiles} miles`
                  : `${result.data.distanceKm} km`,
              },
              { label: "Walking time", value: `${result.data.durationMinutes} min` },
              { label: "Stride", value: `${result.data.strideMetres} m` },
              { label: "Pace", value: result.data.paceLabel },
            ]}
          />
          <Note>
            An estimate. Stride is worked out from your height where you have
            entered it, otherwise an average is used, so distance can be off by
            a few percent. Note that a slower pace burns slightly more over the
            same number of steps: walking is least efficient at low speeds, so
            covering a fixed distance slowly costs more energy than striding
            it out.
            {profile.heightCm === null && (
              <> Add your height above for a sharper stride estimate.</>
            )}
          </Note>
        </>
      )}
    </>
  );
}
