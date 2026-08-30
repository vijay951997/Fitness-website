import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculatorGoalFor, computeTargets } from "./targets.ts";
import { EMPTY_ENQUIRY, type EnquiryData } from "./types.ts";

const complete = (over: Partial<EnquiryData> = {}): EnquiryData => ({
  ...EMPTY_ENQUIRY,
  name: "Test",
  phone: "9876543210",
  age: 30,
  sex: "male",
  heightCm: 180,
  currentWeightKg: 80,
  activity: "moderate",
  primaryGoal: "loss",
  ...over,
});

describe("calculatorGoalFor", () => {
  test("passes through the goals the calculators share", () => {
    assert.equal(calculatorGoalFor("loss"), "loss");
    assert.equal(calculatorGoalFor("gain"), "gain");
    assert.equal(calculatorGoalFor("muscle"), "muscle");
    assert.equal(calculatorGoalFor("maintenance"), "maintenance");
  });

  test("treats general fitness as maintenance", () => {
    assert.equal(calculatorGoalFor("general"), "maintenance");
  });

  test("refuses to guess for 'other' or an unset goal", () => {
    assert.equal(calculatorGoalFor("other"), null);
    assert.equal(calculatorGoalFor(null), null);
  });
});

describe("computeTargets", () => {
  test("computes from the values currently in the form", () => {
    const t = computeTargets(complete());
    assert.ok(t);
    // 80kg/180cm/30y male, moderate, weight loss → TDEE 2759 × 0.8
    assert.equal(t.calories, 2207);
    assert.equal(t.proteinG, 160);
  });

  test("follows the goal chosen in the enquiry, not the one seeded", () => {
    const loss = computeTargets(complete({ primaryGoal: "loss" }));
    const gain = computeTargets(complete({ primaryGoal: "gain" }));
    assert.ok(loss && gain);
    assert.ok(
      gain.calories > loss.calories,
      "a gain goal must not produce a deficit target",
    );
  });

  test("returns null rather than inventing a figure", () => {
    assert.equal(computeTargets(complete({ primaryGoal: "other" })), null);
    assert.equal(computeTargets(complete({ age: null })), null);
    assert.equal(computeTargets(complete({ currentWeightKg: null })), null);
    assert.equal(computeTargets(complete({ heightCm: null })), null);
    assert.equal(computeTargets(complete({ sex: null })), null);
    assert.equal(computeTargets(complete({ activity: null })), null);
  });

  test("rejects out-of-range values instead of returning nonsense", () => {
    const t = computeTargets(complete({ currentWeightKg: 0 }));
    assert.equal(t, null);
  });
});
