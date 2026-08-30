/** BMR, TDEE, calorie targets and macros. */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateBmr } from "./bmr.ts";
import { calculateTdee } from "./tdee.ts";
import { quickCalorieEstimate, calculateCalorieTarget } from "./calories.ts";
import { calculateMacros } from "./macros.ts";
import { ACTIVITY_LEVELS } from "./constants.ts";

const male = { sex: "male" as const, age: 30, weightKg: 80, heightCm: 180 };
const female = { sex: "female" as const, age: 30, weightKg: 65, heightCm: 165 };
const base = { ...male, activity: "moderate" as const };

/* ── BMR ──────────────────────────────────────────────────── */

describe("BMR (Mifflin-St Jeor)", () => {
  test("male: (10x80)+(6.25x180)-(5x30)+5 = 1780", () => {
    const r = calculateBmr(male);
    assert.ok(r.ok);
    assert.equal(r.data.bmr, 1780);
  });

  test("female: (10x65)+(6.25x165)-(5x30)-161 = 1370", () => {
    const r = calculateBmr(female);
    assert.ok(r.ok);
    assert.equal(r.data.bmr, 1370);
  });

  test("the sexes differ by exactly 166 at identical measurements", () => {
    const m = calculateBmr({ ...male, sex: "male" });
    const f = calculateBmr({ ...male, sex: "female" });
    assert.ok(m.ok && f.ok);
    assert.equal(m.data.bmr - f.data.bmr, 166);
  });

  test("rejects zero weight", () => {
    const r = calculateBmr({ ...male, weightKg: 0 });
    assert.ok(!r.ok && r.errors.some((e) => e.field === "weightKg"));
  });

  test("rejects negative height and NaN age", () => {
    assert.equal(calculateBmr({ ...male, heightCm: -180 }).ok, false);
    assert.equal(calculateBmr({ ...male, age: Number.NaN }).ok, false);
  });

  test("reports every invalid field at once", () => {
    const r = calculateBmr({ sex: "male", age: 0, weightKg: 0, heightCm: 0 });
    assert.ok(!r.ok);
    assert.equal(r.errors.length, 3);
  });

  test("accepts the documented boundary ages and rejects just outside", () => {
    assert.ok(calculateBmr({ ...male, age: 13 }).ok);
    assert.ok(calculateBmr({ ...male, age: 100 }).ok);
    assert.equal(calculateBmr({ ...male, age: 12 }).ok, false);
    assert.equal(calculateBmr({ ...male, age: 101 }).ok, false);
  });
});

/* ── TDEE ─────────────────────────────────────────────────── */

describe("TDEE", () => {
  test("1780 BMR x 1.55 (moderate) = 2759", () => {
    const r = calculateTdee(base);
    assert.ok(r.ok);
    assert.equal(r.data.tdee, 2759);
  });

  test("maintenance calories mirror TDEE", () => {
    const r = calculateTdee(base);
    assert.ok(r.ok);
    assert.equal(r.data.maintenanceCalories, r.data.tdee);
  });

  test("sedentary is 1.2 and extra active is 1.9", () => {
    const s = calculateTdee({ ...male, activity: "sedentary" });
    const e = calculateTdee({ ...male, activity: "extra" });
    assert.ok(s.ok && e.ok);
    assert.equal(s.data.activityFactor, 1.2);
    assert.equal(e.data.activityFactor, 1.9);
  });

  test("TDEE rises with every activity level", () => {
    const values = ACTIVITY_LEVELS.map((level) => {
      const r = calculateTdee({ ...male, activity: level.id });
      assert.ok(r.ok);
      return r.data.tdee;
    });
    for (let i = 1; i < values.length; i++) {
      assert.ok(values[i] > values[i - 1], "TDEE must rise with activity");
    }
  });

  test("propagates BMR validation failures", () => {
    assert.equal(calculateTdee({ ...base, weightKg: 0 }).ok, false);
  });
});

/* ── Quick estimate (the original site calculation) ───────── */

describe("quick estimate preserves the original behaviour", () => {
  test("70kg on weight loss still gives 1852 kcal", () => {
    const r = quickCalorieEstimate({ weightKg: 70, goal: "loss" });
    assert.ok(r.ok);
    assert.equal(r.data.calories, 1852);
    assert.equal(r.data.factor, 12);
  });

  test("maintenance uses factor 15, gain uses 18", () => {
    const m = quickCalorieEstimate({ weightKg: 70, goal: "maintenance" });
    const g = quickCalorieEstimate({ weightKg: 70, goal: "gain" });
    assert.ok(m.ok && g.ok);
    assert.equal(m.data.factor, 15);
    assert.equal(g.data.factor, 18);
    assert.equal(m.data.calories, Math.round(70 * 2.20462 * 15));
  });

  test("rejects zero weight", () => {
    assert.equal(quickCalorieEstimate({ weightKg: 0, goal: "loss" }).ok, false);
  });
});

/* ── Calorie target ───────────────────────────────────────── */

describe("calorie target (BMR/TDEE path)", () => {
  test("weight loss takes 80% of a 2759 TDEE", () => {
    const r = calculateCalorieTarget({ ...base, goal: "loss" });
    assert.ok(r.ok);
    assert.equal(r.data.targetCalories, Math.round(2759 * 0.8));
    assert.ok(r.data.dailyAdjustment < 0, "loss must be a deficit");
  });

  test("maintenance equals TDEE with no adjustment", () => {
    const r = calculateCalorieTarget({ ...base, goal: "maintenance" });
    assert.ok(r.ok);
    assert.equal(r.data.targetCalories, r.data.tdee);
    assert.equal(r.data.dailyAdjustment, 0);
  });

  test("muscle building sits between maintenance and weight gain", () => {
    const maintain = calculateCalorieTarget({ ...base, goal: "maintenance" });
    const muscle = calculateCalorieTarget({ ...base, goal: "muscle" });
    const gain = calculateCalorieTarget({ ...base, goal: "gain" });
    assert.ok(maintain.ok && muscle.ok && gain.ok);
    assert.ok(muscle.data.targetCalories > maintain.data.targetCalories);
    assert.ok(muscle.data.targetCalories < gain.data.targetCalories);
  });

  test("never returns a target below the safe floor", () => {
    const r = calculateCalorieTarget({
      sex: "female",
      age: 60,
      weightKg: 40,
      heightCm: 150,
      activity: "sedentary",
      goal: "loss",
    });
    assert.ok(r.ok);
    assert.ok(r.data.targetCalories >= 1200);
    assert.equal(r.data.flooredTo, 1200);
  });

  test("flooredTo is null when nothing was clamped", () => {
    const r = calculateCalorieTarget({ ...base, goal: "loss" });
    assert.ok(r.ok);
    assert.equal(r.data.flooredTo, null);
  });

  test("invalid input fails instead of returning NaN", () => {
    assert.equal(
      calculateCalorieTarget({ ...base, heightCm: 0, goal: "loss" }).ok,
      false,
    );
  });
});

/* ── Macros ───────────────────────────────────────────────── */

describe("macros", () => {
  const input = { calories: 2200, weightKg: 70, goal: "loss" as const };

  test("protein is anchored to body weight (2.0 g/kg on a loss goal)", () => {
    const r = calculateMacros(input);
    assert.ok(r.ok);
    assert.equal(r.data.protein.grams, 140);
    assert.equal(r.data.protein.calories, 560);
  });

  test("fat takes 30% of what is left after protein", () => {
    const r = calculateMacros(input);
    assert.ok(r.ok);
    assert.equal(r.data.fat.calories, Math.round((2200 - 560) * 0.3));
  });

  test("the three macros reconcile to the calorie target", () => {
    const r = calculateMacros(input);
    assert.ok(r.ok);
    const total =
      r.data.protein.calories + r.data.carbs.calories + r.data.fat.calories;
    assert.ok(Math.abs(total - 2200) <= 2, "should reconcile within rounding");
  });

  test("percentages total roughly 100", () => {
    const r = calculateMacros(input);
    assert.ok(r.ok);
    const pct =
      r.data.protein.percent + r.data.carbs.percent + r.data.fat.percent;
    assert.ok(Math.abs(pct - 100) < 0.5);
  });

  test("no macro goes negative on a very low target for a heavy client", () => {
    const r = calculateMacros({ calories: 800, weightKg: 120, goal: "loss" });
    assert.ok(r.ok);
    assert.ok(r.data.protein.grams >= 0);
    assert.ok(r.data.carbs.grams >= 0);
    assert.ok(r.data.fat.grams >= 0);
  });

  test("a custom protein target overrides the goal profile", () => {
    const r = calculateMacros({ ...input, proteinPerKg: 1.0 });
    assert.ok(r.ok);
    assert.equal(r.data.protein.grams, 70);
  });

  test("a loss goal sets more protein than a gain goal", () => {
    const loss = calculateMacros({ ...input, goal: "loss" });
    const gain = calculateMacros({ ...input, goal: "gain" });
    assert.ok(loss.ok && gain.ok);
    assert.ok(loss.data.protein.grams > gain.data.protein.grams);
  });

  test("rejects a zero calorie target", () => {
    assert.equal(calculateMacros({ ...input, calories: 0 }).ok, false);
  });
});
