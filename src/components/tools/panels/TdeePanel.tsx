"use client";

import { ACTIVITY_LEVELS, calculateTdee } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import { BigStat, EmptyState, ErrorList, Note, StatList } from "../controls";

export function TdeePanel() {
  const { profile, isComplete } = useProfile();

  if (!isComplete) {
    return (
      <EmptyState>
        Fill in your age, height and weight above, then pick the activity level
        that matches a typical week.
      </EmptyState>
    );
  }

  const result = calculateTdee({
    sex: profile.sex,
    age: profile.age as number,
    weightKg: profile.weightKg as number,
    heightCm: profile.heightCm as number,
    activity: profile.activity,
  });

  if (!result.ok) return <ErrorList errors={result.errors} />;

  const { bmr, tdee, activityFactor, activityLabel } = result.data;
  const level = ACTIVITY_LEVELS.find((a) => a.id === profile.activity);

  return (
    <>
      <BigStat
        value={tdee.toLocaleString("en-US")}
        unit="kcal / day"
        caption="Total daily energy expenditure"
      />
      <StatList
        rows={[
          { label: "BMR", value: `${bmr.toLocaleString("en-US")} kcal` },
          { label: "Activity", value: `${activityLabel} (x${activityFactor})` },
          {
            label: "Maintenance",
            value: `${tdee.toLocaleString("en-US")} kcal`,
          },
        ]}
      />
      <Note>
        {level?.description}. Eating around {tdee.toLocaleString("en-US")} kcal a
        day should hold your weight steady. Activity multipliers are broad
        averages — if your weight drifts over a few weeks at this intake, trust
        the scale over the estimate.
      </Note>
    </>
  );
}
