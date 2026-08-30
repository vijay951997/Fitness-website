/** Workout calories, steps, calorie deficit and weight-loss timeline. */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateWorkoutCalories } from "./workoutCalories.ts";
import { calculateSteps } from "./steps.ts";
import { calculateDeficit, calculateTimeline } from "./weightLoss.ts";
import { ACTIVITIES } from "../../data/activities.ts";

/* ── Workout calories ─────────────────────────────────────── */

describe("workout calories", () => {
  test("running (MET 10) for 30 min at 70kg burns 350 kcal", () => {
    const r = calculateWorkoutCalories({
      activityId: "running",
      weightKg: 70,
      durationMinutes: 30,
    });
    assert.ok(r.ok);
    assert.equal(r.data.met, 10);
    assert.equal(r.data.caloriesBurned, 350);
  });

  test("net burn subtracts resting expenditure of 1 MET", () => {
    const r = calculateWorkoutCalories({
      activityId: "running",
      weightKg: 70,
      durationMinutes: 30,
    });
    assert.ok(r.ok);
    assert.equal(r.data.netCaloriesBurned, 315);
  });

  test("burn scales linearly with duration", () => {
    const half = calculateWorkoutCalories({
      activityId: "cycling",
      weightKg: 70,
      durationMinutes: 30,
    });
    const full = calculateWorkoutCalories({
      activityId: "cycling",
      weightKg: 70,
      durationMinutes: 60,
    });
    assert.ok(half.ok && full.ok);
    assert.equal(full.data.caloriesBurned, half.data.caloriesBurned * 2);
  });

  test("heavier people burn more for the same session", () => {
    const light = calculateWorkoutCalories({
      activityId: "yoga",
      weightKg: 55,
      durationMinutes: 45,
    });
    const heavy = calculateWorkoutCalories({
      activityId: "yoga",
      weightKg: 95,
      durationMinutes: 45,
    });
    assert.ok(light.ok && heavy.ok);
    assert.ok(heavy.data.caloriesBurned > light.data.caloriesBurned);
  });

  test("an unknown activity is rejected", () => {
    assert.equal(
      calculateWorkoutCalories({
        activityId: "moon-walking",
        weightKg: 70,
        durationMinutes: 30,
      }).ok,
      false,
    );
  });

  test("negative duration is rejected", () => {
    assert.equal(
      calculateWorkoutCalories({
        activityId: "running",
        weightKg: 70,
        durationMinutes: -30,
      }).ok,
      false,
    );
  });

  test("every catalogued activity has a plausible MET and a unique id", () => {
    const ids = new Set<string>();
    for (const a of ACTIVITIES) {
      assert.ok(a.met > 0 && a.met < 25, a.id + " has an implausible MET");
      assert.ok(!ids.has(a.id), "duplicate activity id: " + a.id);
      ids.add(a.id);
    }
  });
});

/* ── Steps ────────────────────────────────────────────────── */

describe("steps to calories", () => {
  test("10,000 steps at 175cm covers about 7.26km", () => {
    const r = calculateSteps({ steps: 10000, weightKg: 70, heightCm: 175 });
    assert.ok(r.ok);
    assert.equal(r.data.strideMetres, 0.73);
    assert.equal(r.data.distanceKm, 7.26);
  });

  test("burns roughly 357 kcal at 70kg walking normally", () => {
    const r = calculateSteps({ steps: 10000, weightKg: 70, heightCm: 175 });
    assert.ok(r.ok);
    assert.ok(Math.abs(r.data.caloriesBurned - 357) <= 2);
  });

  test("falls back to an average stride when height is omitted", () => {
    const r = calculateSteps({ steps: 10000, weightKg: 70 });
    assert.ok(r.ok);
    assert.equal(r.data.strideMetres, 0.71);
  });

  test("zero steps is valid and burns nothing", () => {
    const r = calculateSteps({ steps: 0, weightKg: 70 });
    assert.ok(r.ok);
    assert.equal(r.data.distanceKm, 0);
    assert.equal(r.data.caloriesBurned, 0);
  });

  test("negative steps is rejected", () => {
    assert.equal(calculateSteps({ steps: -100, weightKg: 70 }).ok, false);
  });

  test("a faster pace covers the same steps in less time", () => {
    const slow = calculateSteps({ steps: 8000, weightKg: 70, pace: "slow" });
    const brisk = calculateSteps({ steps: 8000, weightKg: 70, pace: "brisk" });
    assert.ok(slow.ok && brisk.ok);
    assert.equal(slow.data.distanceKm, brisk.data.distanceKm);
    assert.ok(brisk.data.durationMinutes < slow.data.durationMinutes);
  });

  test("brisk walking burns more than a normal pace over the same steps", () => {
    const normal = calculateSteps({ steps: 8000, weightKg: 70, pace: "normal" });
    const brisk = calculateSteps({ steps: 8000, weightKg: 70, pace: "brisk" });
    assert.ok(normal.ok && brisk.ok);
    assert.ok(brisk.data.caloriesBurned > normal.data.caloriesBurned);
  });

  test("slow walking costs the most per kilometre", () => {
    // Not a bug: the energy cost of walking is U-shaped against speed.
    // Very slow walking is mechanically inefficient, so the Compendium MET
    // values make it the most expensive way to cover a fixed distance.
    const slow = calculateSteps({ steps: 8000, weightKg: 70, pace: "slow" });
    const normal = calculateSteps({ steps: 8000, weightKg: 70, pace: "normal" });
    assert.ok(slow.ok && normal.ok);
    assert.ok(slow.data.caloriesBurned > normal.data.caloriesBurned);
  });

  test("reports distance in miles as well as kilometres", () => {
    const r = calculateSteps({ steps: 10000, weightKg: 70, heightCm: 175 });
    assert.ok(r.ok);
    assert.ok(Math.abs(r.data.distanceMiles - 4.51) < 0.05);
  });
});

/* ── Calorie deficit ──────────────────────────────────────── */

describe("calorie deficit", () => {
  test("a moderate deficit of 500 from 2500 maintenance", () => {
    const r = calculateDeficit({
      maintenanceCalories: 2500,
      level: "moderate",
      sex: "male",
    });
    assert.ok(r.ok);
    assert.equal(r.data.targetCalories, 2000);
    assert.equal(r.data.dailyDeficit, 500);
    assert.equal(r.data.weeklyDeficit, 3500);
    assert.equal(r.data.weeklyWeightChangeKg, 0.45);
  });

  test("the three levels step up in order", () => {
    const levels = ["conservative", "moderate", "aggressive"] as const;
    const deficits = levels.map((level) => {
      const r = calculateDeficit({
        maintenanceCalories: 2500,
        level,
        sex: "male",
      });
      assert.ok(r.ok);
      return r.data.dailyDeficit;
    });
    assert.deepEqual(deficits, [250, 500, 750]);
  });

  test("clamps to the safe floor and flags that it did", () => {
    const r = calculateDeficit({
      maintenanceCalories: 1600,
      level: "aggressive",
      sex: "male",
    });
    assert.ok(r.ok);
    assert.equal(r.data.targetCalories, 1500);
    assert.equal(r.data.adjustedForSafety, true);
    assert.equal(r.data.dailyDeficit, 100);
  });

  test("never reports a negative deficit when maintenance is below the floor", () => {
    // A 60-year-old, 150cm, 40kg sedentary woman maintains on about 1052
    // kcal, which is already under the 1200 floor. Clamping the target up
    // to 1200 alone would yield a deficit of -148 and describe a surplus
    // as weight loss.
    const r = calculateDeficit({
      maintenanceCalories: 1052,
      level: "aggressive",
      sex: "female",
    });
    assert.ok(r.ok);
    assert.equal(r.data.noSafeDeficit, true);
    assert.equal(r.data.targetCalories, 1052, "target should equal maintenance");
    assert.equal(r.data.dailyDeficit, 0);
    assert.equal(r.data.weeklyWeightChangeKg, 0);
    assert.ok(r.data.dailyDeficit >= 0, "deficit must never be negative");
  });

  test("noSafeDeficit is false in the ordinary case", () => {
    const r = calculateDeficit({
      maintenanceCalories: 2759,
      level: "moderate",
      sex: "male",
    });
    assert.ok(r.ok);
    assert.equal(r.data.noSafeDeficit, false);
    assert.equal(r.data.dailyDeficit, 500);
  });

  test("women are clamped at 1200 rather than 1500", () => {
    const r = calculateDeficit({
      maintenanceCalories: 1400,
      level: "aggressive",
      sex: "female",
    });
    assert.ok(r.ok);
    assert.equal(r.data.targetCalories, 1200);
  });
});

/* ── Timeline ─────────────────────────────────────────────── */

describe("weight loss timeline", () => {
  test("82kg to 70kg at a 500 kcal deficit takes about 27 weeks", () => {
    const r = calculateTimeline({
      currentWeightKg: 82,
      targetWeightKg: 70,
      dailyCalorieChange: 500,
    });
    assert.ok(r.ok);
    assert.equal(r.data.weightDifferenceKg, 12);
    assert.equal(r.data.weeks, 27);
    assert.equal(r.data.direction, "loss");
    assert.ok(r.data.weeklyChangeKg < 0, "loss should be signed negative");
  });

  test("detects a gain goal and signs the change positive", () => {
    const r = calculateTimeline({
      currentWeightKg: 60,
      targetWeightKg: 68,
      dailyCalorieChange: 300,
    });
    assert.ok(r.ok);
    assert.equal(r.data.direction, "gain");
    assert.ok(r.data.weeklyChangeKg > 0);
  });

  test("identical current and target weights is an error", () => {
    assert.equal(
      calculateTimeline({
        currentWeightKg: 70,
        targetWeightKg: 70,
        dailyCalorieChange: 500,
      }).ok,
      false,
    );
  });

  test("a zero calorie change is rejected rather than dividing by zero", () => {
    assert.equal(
      calculateTimeline({
        currentWeightKg: 82,
        targetWeightKg: 70,
        dailyCalorieChange: 0,
      }).ok,
      false,
    );
  });

  test("returns a real ISO date, never an Invalid Date", () => {
    const r = calculateTimeline({
      currentWeightKg: 82,
      targetWeightKg: 70,
      dailyCalorieChange: 500,
    });
    assert.ok(r.ok);
    assert.match(r.data.estimatedDate, /^\d{4}-\d{2}-\d{2}$/);
  });
});
