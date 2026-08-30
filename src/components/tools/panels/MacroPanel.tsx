"use client";

import { useState } from "react";
import {
  GOALS,
  calculateCalorieTarget,
  calculateMacros,
  type GoalId,
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

/** Proportional bar showing how the calories split three ways. */
function MacroBar({
  protein,
  carbs,
  fat,
}: {
  protein: number;
  carbs: number;
  fat: number;
}) {
  const parts = [
    { label: "Protein", pct: protein, tone: "bg-lime-400" },
    { label: "Carbs", pct: carbs, tone: "bg-bone-300" },
    { label: "Fat", pct: fat, tone: "bg-bone-500" },
  ];

  return (
    <div className="mt-6">
      <div className="flex h-3 w-full overflow-hidden" aria-hidden>
        {parts.map((p) => (
          <span
            key={p.label}
            className={p.tone}
            style={{ width: `${Math.max(0, p.pct)}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {parts.map((p) => (
          <li key={p.label} className="label flex items-center gap-2 text-bone-400">
            <span aria-hidden className={`inline-block size-2.5 ${p.tone}`} />
            {p.label} {p.pct}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MacroPanel() {
  const { profile, update, isComplete } = useProfile();
  const [proteinPerKg, setProteinPerKg] = useState<number | null>(null);

  if (!isComplete) {
    return (
      <EmptyState>
        Fill in your details above to see a macronutrient split for your
        calorie target.
      </EmptyState>
    );
  }

  const target = calculateCalorieTarget({
    sex: profile.sex,
    age: profile.age as number,
    weightKg: profile.weightKg as number,
    heightCm: profile.heightCm as number,
    activity: profile.activity,
    goal: profile.goal,
  });

  if (!target.ok) return <ErrorList errors={target.errors} />;

  const macros = calculateMacros({
    calories: target.data.targetCalories,
    weightKg: profile.weightKg as number,
    goal: profile.goal,
    proteinPerKg: proteinPerKg ?? undefined,
  });

  if (!macros.ok) return <ErrorList errors={macros.errors} />;

  const { protein, carbs, fat, calories } = macros.data;

  return (
    <>
      <div className="mb-7">
        <Segmented<GoalId>
          legend="Goal"
          value={profile.goal}
          onChange={(goal) => update({ goal })}
          columns={4}
          options={GOALS.map((g) => ({
            id: g.id,
            label: g.label.replace("Weight ", ""),
            description: g.description,
          }))}
        />
      </div>

      <BigStat
        value={calories.toLocaleString("en-US")}
        unit="kcal / day"
        caption="Daily calorie target"
      />

      <MacroBar
        protein={protein.percent}
        carbs={carbs.percent}
        fat={fat.percent}
      />

      <StatList
        rows={[
          {
            label: "Protein",
            value: `${protein.grams} g · ${protein.calories} kcal`,
          },
          { label: "Carbs", value: `${carbs.grams} g · ${carbs.calories} kcal` },
          { label: "Fat", value: `${fat.grams} g · ${fat.calories} kcal` },
        ]}
      />

      <div className="mt-6">
        <label htmlFor="protein-slider" className="label block text-bone-500">
          Protein target — {macros.data.proteinPerKg} g per kg
        </label>
        <input
          id="protein-slider"
          type="range"
          min="1.2"
          max="2.6"
          step="0.1"
          value={proteinPerKg ?? macros.data.proteinPerKg}
          onChange={(e) => setProteinPerKg(Number.parseFloat(e.target.value))}
          className="mt-3 w-full accent-lime-400"
        />
      </div>

      <Note>
        Protein is set from your body weight, then fat takes a share of what is
        left and carbohydrate takes the rest. These are starting points, not
        prescriptions — adjust the protein slider and see how the split moves.
        {target.data.flooredTo !== null && (
          <>
            {" "}
            Your target was raised to {target.data.flooredTo} kcal, the lowest
            intake this tool will suggest without supervision.
          </>
        )}
      </Note>
    </>
  );
}
