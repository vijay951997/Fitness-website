"use client";

import { useState } from "react";
import {
  DEFICIT_LEVELS,
  calculateDeficit,
  calculateTdee,
  kgToLb,
  round,
  type DeficitLevelId,
} from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import {
  BigStat,
  EmptyState,
  ErrorList,
  Note,
  Segmented,
  StatList,
} from "../controls";

export function DeficitPanel() {
  const { profile, isComplete } = useProfile();
  const [level, setLevel] = useState<DeficitLevelId>("moderate");

  if (!isComplete) {
    return (
      <EmptyState>
        Fill in your age, height and weight above to work out a safe deficit
        from your maintenance calories.
      </EmptyState>
    );
  }

  const tdee = calculateTdee({
    sex: profile.sex,
    age: profile.age as number,
    weightKg: profile.weightKg as number,
    heightCm: profile.heightCm as number,
    activity: profile.activity,
  });

  if (!tdee.ok) return <ErrorList errors={tdee.errors} />;

  const result = calculateDeficit({
    maintenanceCalories: tdee.data.maintenanceCalories,
    level,
    sex: profile.sex,
  });

  if (!result.ok) return <ErrorList errors={result.errors} />;

  const d = result.data;
  const imperial = profile.units === "imperial";
  const unit = imperial ? "lb" : "kg";
  const weeklyChange = Math.abs(d.weeklyWeightChangeKg);
  const weekly = imperial ? round(kgToLb(weeklyChange), 2) : weeklyChange;
  const chosen = DEFICIT_LEVELS.find((l) => l.id === level);
  const floor = profile.sex === "male" ? "1,500" : "1,200";

  return (
    <>
      <div className="mb-7">
        <Segmented<DeficitLevelId>
          legend="Deficit"
          value={level}
          onChange={setLevel}
          columns={3}
          options={DEFICIT_LEVELS.map((l) => ({
            id: l.id,
            label: l.label,
            description: l.description,
          }))}
        />
      </div>

      <BigStat
        value={d.targetCalories.toLocaleString("en-US")}
        unit="kcal / day"
        caption="Target intake"
      />

      <StatList
        rows={[
          {
            label: "Maintenance",
            value: `${d.maintenanceCalories.toLocaleString("en-US")} kcal`,
          },
          { label: "Daily deficit", value: `${d.dailyDeficit} kcal` },
          {
            label: "Weekly deficit",
            value: `${d.weeklyDeficit.toLocaleString("en-US")} kcal`,
          },
          { label: "Weekly change", value: `about ${weekly} ${unit}` },
        ]}
      />

      {d.noSafeDeficit ? (
        <p
          role="alert"
          className="mt-6 border border-lime-400/40 bg-lime-400/10 p-4 text-sm leading-relaxed text-lime-400"
        >
          <strong className="font-medium">No deficit recommended.</strong> Your
          maintenance is already at or below {floor} kcal, the lowest intake
          this tool will suggest without supervision. Eating less than you
          maintain on is not the right lever here — raising your activity, or
          speaking to a doctor or dietitian, is.
        </p>
      ) : d.adjustedForSafety ? (
        <p
          role="alert"
          className="mt-6 border border-lime-400/40 bg-lime-400/10 p-4 text-sm leading-relaxed text-lime-400"
        >
          <strong className="font-medium">Adjusted for safety.</strong> A{" "}
          {chosen?.label.toLowerCase()} deficit would have taken you below{" "}
          {floor} kcal, so the target was raised to that floor. Your actual
          deficit is {d.dailyDeficit} kcal, not the {chosen?.kcal} selected.
        </p>
      ) : null}

      <Note>
        {chosen?.description}. Weekly change assumes roughly 7,700 kcal per
        kilogram of fat. Real weight moves less tidily — water and glycogen
        shift first, and metabolism adapts downward as you lose, so expect the
        scale to stall for a week at a time even when the deficit is working.
      </Note>
    </>
  );
}
