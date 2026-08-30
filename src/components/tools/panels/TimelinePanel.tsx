"use client";

import { useState } from "react";
import {
  calculateTimeline,
  kgToLb,
  round,
} from "@/lib/calculations";
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
import { useWeightField } from "../useWeightField";

export function TimelinePanel() {
  const { profile, update } = useProfile();
  const [dailyChange, setDailyChange] = useState("500");
  const targetId = useFieldId("target-weight");
  const changeId = useFieldId("daily-change");

  const target = useWeightField(profile.targetWeightKg, (kg) =>
    update({ targetWeightKg: kg }),
  );

  if (profile.weightKg === null) {
    return <EmptyState>Enter your current weight above.</EmptyState>;
  }

  const parsedChange =
    dailyChange.trim() === "" ? Number.NaN : Number.parseFloat(dailyChange);

  const result =
    profile.targetWeightKg === null
      ? null
      : calculateTimeline({
          currentWeightKg: profile.weightKg,
          targetWeightKg: profile.targetWeightKg,
          dailyCalorieChange: parsedChange,
        });

  const targetError =
    result && !result.ok
      ? (result.errors.find((e) => e.field === "targetWeightKg")?.message ??
        null)
      : null;
  const changeError =
    result && !result.ok
      ? (result.errors.find((e) => e.field === "dailyCalorieChange")?.message ??
        null)
      : null;

  return (
    <>
      <div className="mb-7 grid gap-6 sm:grid-cols-2">
        <Field label="Target weight" htmlFor={targetId} error={targetError}>
          <NumberInput
            id={targetId}
            value={target.displayValue}
            onChange={target.setFromDisplay}
            placeholder={target.imperial ? "154" : "70"}
            suffix={target.unit}
            invalid={Boolean(targetError)}
          />
        </Field>

        <Field
          label="Daily calorie change"
          htmlFor={changeId}
          error={changeError}
          hint="Your deficit if losing, or surplus if gaining."
        >
          <NumberInput
            id={changeId}
            value={dailyChange}
            onChange={setDailyChange}
            placeholder="500"
            suffix="kcal"
            invalid={Boolean(changeError)}
          />
        </Field>
      </div>

      {result === null ? (
        <EmptyState>
          Enter a target weight to see an estimated timeline.
        </EmptyState>
      ) : !result.ok ? (
        <ErrorList errors={result.errors} />
      ) : (
        <>
          <BigStat
            value={String(result.data.weeks)}
            unit={result.data.weeks === 1 ? "week" : "weeks"}
            caption={
              result.data.direction === "loss"
                ? "Estimated time to reach your target"
                : "Estimated time to gain that weight"
            }
          />
          <StatList
            rows={[
              {
                label: "To change",
                value: `${
                  target.imperial
                    ? round(kgToLb(result.data.weightDifferenceKg), 1)
                    : result.data.weightDifferenceKg
                } ${target.unit}`,
              },
              {
                label: "Per week",
                value: `${
                  target.imperial
                    ? round(kgToLb(Math.abs(result.data.weeklyChangeKg)), 2)
                    : Math.abs(result.data.weeklyChangeKg)
                } ${target.unit}`,
              },
              { label: "In months", value: `about ${result.data.months}` },
              { label: "Roughly by", value: result.data.estimatedDate },
            ]}
          />
          <Note>
            A projection, not a promise. It assumes you hold that calorie
            change every day and that roughly 7,700 kcal equals a kilogram of
            body fat. In practice progress is not linear: metabolism adapts as
            you lose, adherence varies, and water weight masks fat loss for
            weeks at a time. Treat the date as a direction of travel.
          </Note>
        </>
      )}
    </>
  );
}
