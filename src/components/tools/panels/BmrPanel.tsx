"use client";

import { calculateBmr } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import { BigStat, EmptyState, ErrorList, Note, StatList } from "../controls";

export function BmrPanel() {
  const { profile, isComplete } = useProfile();

  if (!isComplete) {
    return (
      <EmptyState>
        Fill in your age, height and weight above to see your basal metabolic
        rate.
      </EmptyState>
    );
  }

  const result = calculateBmr({
    sex: profile.sex,
    age: profile.age as number,
    weightKg: profile.weightKg as number,
    heightCm: profile.heightCm as number,
  });

  if (!result.ok) return <ErrorList errors={result.errors} />;

  const { bmr, formula } = result.data;

  return (
    <>
      <BigStat
        value={bmr.toLocaleString("en-US")}
        unit="kcal / day"
        caption="Basal metabolic rate"
      />
      <StatList
        rows={[
          { label: "Formula", value: formula },
          {
            label: "Per hour",
            value: `${Math.round(bmr / 24).toLocaleString("en-US")} kcal`,
          },
        ]}
      />
      <Note>
        This is roughly what your body burns over 24 hours at complete rest —
        keeping your heart beating, lungs working and temperature steady. It
        does not include any movement, so it is a floor, not a target. Eating
        at this level every day would leave you in a substantial deficit.
      </Note>
    </>
  );
}
