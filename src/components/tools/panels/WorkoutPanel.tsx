"use client";

import { useState } from "react";
import { calculateWorkoutCalories } from "@/lib/calculations";
import { ACTIVITIES, ACTIVITY_GROUPS } from "@/data/activities";
import { useProfile } from "@/lib/profile";
import {
  BigStat,
  EmptyState,
  ErrorList,
  Field,
  Note,
  NumberInput,
  Select,
  StatList,
  useFieldId,
} from "../controls";

const GROUPS = ACTIVITY_GROUPS.map((group) => ({
  label: group,
  options: ACTIVITIES.filter((a) => a.group === group).map((a) => ({
    id: a.id,
    label: a.label,
  })),
}));

export function WorkoutPanel() {
  const { profile } = useProfile();
  const [activityId, setActivityId] = useState("weights");
  const [minutes, setMinutes] = useState("45");
  const activityFieldId = useFieldId("activity");
  const minutesId = useFieldId("duration");

  if (profile.weightKg === null) {
    return <EmptyState>Enter your weight above.</EmptyState>;
  }

  const parsed =
    minutes.trim() === "" ? Number.NaN : Number.parseFloat(minutes);

  const result = calculateWorkoutCalories({
    activityId,
    weightKg: profile.weightKg,
    durationMinutes: parsed,
  });

  const minutesError = !result.ok
    ? (result.errors.find((e) => e.field === "durationMinutes")?.message ?? null)
    : null;

  return (
    <>
      <div className="mb-7 grid gap-6 sm:grid-cols-2">
        <Field label="Activity" htmlFor={activityFieldId}>
          <Select
            id={activityFieldId}
            value={activityId}
            onChange={setActivityId}
            groups={GROUPS}
          />
        </Field>

        <Field label="Duration" htmlFor={minutesId} error={minutesError}>
          <NumberInput
            id={minutesId}
            value={minutes}
            onChange={setMinutes}
            placeholder="45"
            suffix="min"
            invalid={Boolean(minutesError)}
          />
        </Field>
      </div>

      {!result.ok ? (
        <ErrorList errors={result.errors} />
      ) : (
        <>
          <BigStat
            value={result.data.caloriesBurned.toLocaleString("en-US")}
            unit="kcal burned"
            caption={result.data.activityLabel}
          />
          <StatList
            rows={[
              { label: "Duration", value: `${result.data.durationMinutes} min` },
              { label: "Intensity", value: `${result.data.met} MET` },
              {
                label: "Per minute",
                value: `${result.data.caloriesPerMinute} kcal`,
              },
              {
                label: "Net of resting",
                value: `${result.data.netCaloriesBurned.toLocaleString("en-US")} kcal`,
              },
            ]}
          />
          <Note>
            Worked out from the activity&apos;s MET value against your body
            weight. The headline is gross burn — it includes the calories you
            would have used simply existing for that time. The net figure
            strips that out, and is the one to use if you are adding exercise
            back onto a calorie target, otherwise you double-count.
          </Note>
        </>
      )}
    </>
  );
}
