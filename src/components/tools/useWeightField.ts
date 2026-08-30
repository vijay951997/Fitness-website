"use client";

import { kgToLb, lbToKg, round } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";

/**
 * A weight input that reads and writes the profile in metric while showing
 * whichever unit is selected.
 *
 * Shared by the target-weight fields in the timeline and deficit panels so
 * the conversion round-trip lives in one place rather than in each panel.
 */
export function useWeightField(
  valueKg: number | null,
  onChangeKg: (next: number | null) => void,
) {
  const { profile } = useProfile();
  const imperial = profile.units === "imperial";

  const displayValue =
    valueKg === null
      ? ""
      : String(imperial ? round(kgToLb(valueKg), 1) : round(valueKg, 1));

  const setFromDisplay = (raw: string) => {
    if (raw.trim() === "") return onChangeKg(null);
    const n = Number.parseFloat(raw);
    if (Number.isNaN(n)) return onChangeKg(null);
    onChangeKg(imperial ? lbToKg(n) : n);
  };

  return {
    imperial,
    unit: imperial ? "lb" : "kg",
    displayValue,
    setFromDisplay,
    /** Converts a stored metric value for display in the active unit. */
    toDisplay: (kg: number) => (imperial ? round(kgToLb(kg), 1) : round(kg, 1)),
  };
}
