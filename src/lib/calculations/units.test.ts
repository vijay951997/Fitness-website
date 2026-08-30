import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  kgToLb,
  lbToKg,
  cmToInches,
  inchesToCm,
  feetInchesToCm,
  cmToFeetInches,
  mlToLitres,
  mlToGlasses,
  round,
  safe,
  roundWeight,
  roundBmi,
} from "./units.ts";

describe("mass conversion", () => {
  test("kg to lb", () => {
    assert.equal(round(kgToLb(70), 4), 154.3234);
  });
  test("round trips without drift", () => {
    assert.equal(round(lbToKg(kgToLb(70)), 6), 70);
  });
  test("zero converts to zero", () => {
    assert.equal(kgToLb(0), 0);
  });
});

describe("length conversion", () => {
  test("cm to inches", () => {
    assert.equal(round(cmToInches(180), 3), 70.866);
  });
  test("inches to cm", () => {
    assert.equal(round(inchesToCm(70), 1), 177.8);
  });
  test("feet and inches to cm", () => {
    assert.equal(round(feetInchesToCm(5, 10), 1), 177.8);
  });
  test("cm to feet and inches", () => {
    assert.deepEqual(cmToFeetInches(177.8), { feet: 5, inches: 10 });
  });
  test("never reports 12 inches instead of carrying a foot", () => {
    // Heights just under a whole foot are where naive rounding breaks.
    for (const cm of [182.7, 182.8, 182.87, 182.9]) {
      assert.ok(cmToFeetInches(cm).inches < 12, cm + "cm produced 12 inches");
    }
  });
});

describe("volume conversion", () => {
  test("ml to litres", () => assert.equal(mlToLitres(2500), 2.5));
  test("ml to 250ml glasses", () => assert.equal(mlToGlasses(2500), 10));
});

describe("rounding", () => {
  test("rounds to the given decimal places", () => {
    assert.equal(round(2.345, 2), 2.35);
    assert.equal(roundWeight(70.44), 70.4);
    assert.equal(roundBmi(24.6499), 24.6);
  });
  test("binary float drift does not swallow a digit", () => {
    assert.equal(round(1.005, 2), 1.01);
  });
  test("non-finite input rounds to zero rather than NaN", () => {
    assert.equal(round(Number.NaN, 2), 0);
    assert.equal(round(Infinity, 2), 0);
  });
  test("safe replaces non-finite values with a fallback", () => {
    assert.equal(safe(Number.NaN), 0);
    assert.equal(safe(Infinity, -1), -1);
    assert.equal(safe(42), 42);
  });
});
