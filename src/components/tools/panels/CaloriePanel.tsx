"use client";

import {
  GOALS,
  calculateCalorieTarget,
  quickCalorieEstimate,
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

/**
 * Daily calorie target.
 *
 * Shows two numbers on purpose. The headline uses BMR and TDEE, which
 * accounts for age, height and activity. The quick estimate below it is the
 * original body-weight calculation the site has always used — kept both so
 * the two can be compared, and so someone who has only entered their weight
 * still gets an answer.
 */
export function CaloriePanel() {
  const { profile, update, isComplete } = useProfile();

  if (profile.weightKg === null) {
    return <EmptyState>Enter your weight above to get started.</EmptyState>;
  }

  const quick = quickCalorieEstimate({
    weightKg: profile.weightKg,
    goal: profile.goal,
  });

  const full = isComplete
    ? calculateCalorieTarget({
        sex: profile.sex,
        age: profile.age as number,
        weightKg: profile.weightKg,
        heightCm: profile.heightCm as number,
        activity: profile.activity,
        goal: profile.goal,
      })
    : null;

  const goalControl = (
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
  );

  // Only weight so far — the quick estimate is all that can be offered.
  if (full === null) {
    if (!quick.ok) return <ErrorList errors={quick.errors} />;
    return (
      <>
        {goalControl}
        <BigStat
          value={quick.data.calories.toLocaleString("en-US")}
          unit="kcal / day"
          caption="Quick estimate"
        />
        <StatList
          rows={[
            { label: "Method", value: `body weight in lb × ${quick.data.factor}` },
            { label: "Goal", value: quick.data.goalLabel },
          ]}
        />
        <p className="mt-6 border border-bone-50/20 p-4 text-sm leading-relaxed text-bone-300">
          Add your <strong className="text-bone-50">age and height</strong>{" "}
          above for a considerably better estimate. Body weight alone cannot
          tell a 25-year-old from a 60-year-old, or someone sedentary from
          someone training six days a week.
        </p>
      </>
    );
  }

  if (!full.ok) return <ErrorList errors={full.errors} />;

  const f = full.data;
  const difference = quick.ok ? f.targetCalories - quick.data.calories : null;

  return (
    <>
      {goalControl}

      <BigStat
        value={f.targetCalories.toLocaleString("en-US")}
        unit="kcal / day"
        caption={`Daily target — ${f.goalLabel.toLowerCase()}`}
      />

      <StatList
        rows={[
          { label: "BMR", value: `${f.bmr.toLocaleString("en-US")} kcal` },
          {
            label: "Maintenance",
            value: `${f.maintenanceCalories.toLocaleString("en-US")} kcal`,
          },
          {
            label: f.dailyAdjustment < 0 ? "Daily deficit" : "Daily surplus",
            value:
              f.dailyAdjustment === 0
                ? "none"
                : `${Math.abs(f.dailyAdjustment)} kcal`,
          },
          { label: "Activity", value: f.activityLabel },
        ]}
      />

      {f.flooredTo !== null && (
        <p
          role="alert"
          className="mt-6 border border-lime-400/40 bg-lime-400/10 p-4 text-sm leading-relaxed text-lime-400"
        >
          <strong className="font-medium">Raised to a safe floor.</strong> Your
          goal would have put the target below {f.flooredTo.toLocaleString("en-US")}{" "}
          kcal, which is the lowest this tool will suggest without supervision.
        </p>
      )}

      {quick.ok && (
        <div className="mt-7 border-t border-bone-50/12 pt-6">
          <p className="label text-bone-500">Quick estimate, for comparison</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <span className="display text-3xl text-bone-100">
              {quick.data.calories.toLocaleString("en-US")}
            </span>
            <span className="label text-bone-500">
              kcal — body weight in lb × {quick.data.factor}
            </span>
          </p>
          {difference !== null && Math.abs(difference) >= 50 && (
            <p className="mt-3 text-sm leading-relaxed text-bone-400">
              The two differ by{" "}
              <span className="text-bone-100 tabular-nums">
                {Math.abs(difference)} kcal
              </span>
              . The headline figure is the one to trust — the quick estimate
              knows only your weight, so it cannot account for your age, height
              or how active you are.
            </p>
          )}
        </div>
      )}

      <Note>
        Built from Mifflin-St Jeor, scaled by your activity level, then
        adjusted for your goal. Treat it as a starting point and let the scale
        arbitrate: if your weight is not moving as expected after two or three
        consistent weeks, adjust by 100–200 kcal rather than starting again.
      </Note>
    </>
  );
}
