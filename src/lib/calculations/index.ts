/**
 * Public surface of the calculation engine.
 *
 * Components import from `@/lib/calculations` only — never from the
 * individual modules — so internals can be reorganised without touching
 * the UI.
 */

export * from "./types.ts";
export * from "./constants.ts";
export * from "./units.ts";
export * from "./validate.ts";

export * from "./bmr.ts";
export * from "./tdee.ts";
export * from "./calories.ts";
export * from "./macros.ts";
export * from "./bmi.ts";
export * from "./water.ts";
export * from "./idealWeight.ts";
export * from "./bodyFat.ts";
export * from "./weightLoss.ts";
export * from "./workoutCalories.ts";
export * from "./steps.ts";
