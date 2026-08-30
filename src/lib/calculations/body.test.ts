/** BMI, water intake, ideal weight and body fat. */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateBmi, bmiCategory } from "./bmi.ts";
import { calculateWater } from "./water.ts";
import { calculateIdealWeight } from "./idealWeight.ts";
import { calculateBodyFat, bodyFatCategory } from "./bodyFat.ts";

/* ── BMI ──────────────────────────────────────────────────── */

describe("BMI", () => {
  test("80kg at 180cm is 24.7 and Normal", () => {
    const r = calculateBmi({ weightKg: 80, heightCm: 180 });
    assert.ok(r.ok);
    assert.equal(r.data.bmi, 24.7);
    assert.equal(r.data.category, "Normal");
  });

  test("reports the healthy weight band for that height", () => {
    const r = calculateBmi({ weightKg: 80, heightCm: 180 });
    assert.ok(r.ok);
    assert.equal(r.data.healthyWeightKg.min, 59.9);
    assert.equal(r.data.healthyWeightKg.max, 80.7);
  });

  test("categories switch at the documented boundaries", () => {
    assert.equal(bmiCategory(18.4), "Underweight");
    assert.equal(bmiCategory(18.5), "Normal");
    assert.equal(bmiCategory(24.9), "Normal");
    assert.equal(bmiCategory(25), "Overweight");
    assert.equal(bmiCategory(29.9), "Overweight");
    assert.equal(bmiCategory(30), "Obesity");
    assert.equal(bmiCategory(45), "Obesity");
  });

  test("rejects zero height rather than dividing by zero", () => {
    assert.equal(calculateBmi({ weightKg: 80, heightCm: 0 }).ok, false);
  });

  test("rejects negative weight", () => {
    assert.equal(calculateBmi({ weightKg: -5, heightCm: 180 }).ok, false);
  });
});

/* ── Water ────────────────────────────────────────────────── */

describe("water intake", () => {
  test("70kg, moderate activity, 30 minutes of exercise", () => {
    const r = calculateWater({
      weightKg: 70,
      activity: "moderate",
      exerciseMinutes: 30,
    });
    assert.ok(r.ok);
    assert.equal(r.data.breakdown.baselineMl, 2450);
    assert.equal(r.data.breakdown.activityMl, 245);
    assert.equal(r.data.breakdown.exerciseMl, 360);
    assert.equal(r.data.millilitres, 3055);
    assert.equal(r.data.litres, 3.1);
  });

  test("a glass is 250ml", () => {
    const r = calculateWater({
      weightKg: 70,
      activity: "sedentary",
      exerciseMinutes: 0,
    });
    assert.ok(r.ok);
    assert.equal(r.data.millilitres, 2450);
    assert.equal(r.data.glasses, 10);
  });

  test("zero exercise minutes is valid", () => {
    assert.ok(
      calculateWater({
        weightKg: 70,
        activity: "sedentary",
        exerciseMinutes: 0,
      }).ok,
    );
  });

  test("negative exercise duration is rejected", () => {
    assert.equal(
      calculateWater({
        weightKg: 70,
        activity: "sedentary",
        exerciseMinutes: -10,
      }).ok,
      false,
    );
  });

  test("more activity means more water", () => {
    const low = calculateWater({
      weightKg: 70,
      activity: "sedentary",
      exerciseMinutes: 0,
    });
    const high = calculateWater({
      weightKg: 70,
      activity: "extra",
      exerciseMinutes: 0,
    });
    assert.ok(low.ok && high.ok);
    assert.ok(high.data.millilitres > low.data.millilitres);
  });
});

/* ── Ideal weight ─────────────────────────────────────────── */

describe("ideal weight", () => {
  test("healthy band at 180cm is 59.9 to 80.7kg", () => {
    const r = calculateIdealWeight({ heightCm: 180, sex: "male" });
    assert.ok(r.ok);
    assert.equal(r.data.healthyRangeKg.min, 59.9);
    assert.equal(r.data.healthyRangeKg.max, 80.7);
  });

  test("Devine for a 180cm male is about 75kg", () => {
    const r = calculateIdealWeight({ heightCm: 180, sex: "male" });
    assert.ok(r.ok);
    const devine = r.data.formulas.find((f) => f.name === "Devine");
    assert.ok(devine);
    assert.ok(Math.abs(devine.kg - 75) < 0.2);
  });

  test("returns four named reference formulas", () => {
    const r = calculateIdealWeight({ heightCm: 170, sex: "female" });
    assert.ok(r.ok);
    assert.equal(r.data.formulas.length, 4);
  });

  test("female estimates fall below male at the same height", () => {
    const m = calculateIdealWeight({ heightCm: 175, sex: "male" });
    const f = calculateIdealWeight({ heightCm: 175, sex: "female" });
    assert.ok(m.ok && f.ok);
    assert.ok(f.data.formulas[0].kg < m.data.formulas[0].kg);
  });

  test("short heights never produce a negative weight", () => {
    const r = calculateIdealWeight({ heightCm: 140, sex: "female" });
    assert.ok(r.ok);
    for (const f of r.data.formulas) assert.ok(f.kg > 0);
  });

  test("rejects zero height", () => {
    assert.equal(calculateIdealWeight({ heightCm: 0, sex: "male" }).ok, false);
  });
});

/* ── Body fat ─────────────────────────────────────────────── */

describe("body fat (U.S. Navy)", () => {
  const maleInput = {
    sex: "male" as const,
    heightCm: 180,
    neckCm: 38,
    waistCm: 85,
  };

  test("male 180cm, neck 38, waist 85 is about 16.1%", () => {
    const r = calculateBodyFat(maleInput);
    assert.ok(r.ok);
    assert.ok(Math.abs(r.data.bodyFatPercent - 16.1) < 0.2);
  });

  test("female input without a hip measurement is rejected", () => {
    const r = calculateBodyFat({
      sex: "female",
      heightCm: 165,
      neckCm: 32,
      waistCm: 75,
    });
    assert.ok(!r.ok && r.errors.some((e) => e.field === "hipCm"));
  });

  test("female with hips produces a plausible figure", () => {
    const r = calculateBodyFat({
      sex: "female",
      heightCm: 165,
      neckCm: 32,
      waistCm: 75,
      hipCm: 95,
    });
    assert.ok(r.ok);
    assert.ok(r.data.bodyFatPercent > 10 && r.data.bodyFatPercent < 60);
  });

  test("fat mass and lean mass sum back to body weight", () => {
    const r = calculateBodyFat({ ...maleInput, weightKg: 80 });
    assert.ok(r.ok);
    const fat = r.data.fatMassKg as number;
    const lean = r.data.leanMassKg as number;
    assert.ok(Math.abs(fat + lean - 80) < 0.2);
  });

  test("omits the mass split when no weight is given", () => {
    const r = calculateBodyFat(maleInput);
    assert.ok(r.ok);
    assert.equal(r.data.fatMassKg, null);
    assert.equal(r.data.leanMassKg, null);
  });

  test("a waist smaller than the neck is rejected, not logged as NaN", () => {
    const r = calculateBodyFat({ ...maleInput, neckCm: 90, waistCm: 70 });
    assert.equal(r.ok, false);
  });

  test("categories differ by sex at the same percentage", () => {
    assert.equal(bodyFatCategory(12, "male"), "Athletic");
    assert.equal(bodyFatCategory(12, "female"), "Essential fat");
  });
});
