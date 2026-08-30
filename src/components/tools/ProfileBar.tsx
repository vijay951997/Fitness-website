"use client";

import {
  ACTIVITY_LEVELS,
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  round,
  type ActivityLevelId,
  type Sex,
  type UnitSystem,
} from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import { Field, NumberInput, Segmented, useFieldId } from "./controls";

/**
 * The measurements shared by every calculator, entered once.
 *
 * Values are held in metric on the profile; this component converts only
 * for display, so switching units never changes the underlying figures.
 */
export function ProfileBar() {
  const { profile, update, hydrated } = useProfile();
  const ageId = useFieldId("age");
  const weightId = useFieldId("weight");
  const heightId = useFieldId("height");
  const feetId = useFieldId("feet");
  const inchesId = useFieldId("inches");

  const imperial = profile.units === "imperial";

  /* Weight, shown in the chosen unit. */
  const weightValue =
    profile.weightKg === null
      ? ""
      : String(
          imperial ? round(kgToLb(profile.weightKg), 1) : round(profile.weightKg, 1),
        );

  const setWeight = (raw: string) => {
    if (raw.trim() === "") return update({ weightKg: null });
    const n = Number.parseFloat(raw);
    if (Number.isNaN(n)) return update({ weightKg: null });
    update({ weightKg: imperial ? lbToKg(n) : n });
  };

  /* Height: a single cm field, or a feet + inches pair. */
  const { feet, inches } = profile.heightCm
    ? cmToFeetInches(profile.heightCm)
    : { feet: 0, inches: 0 };

  const setHeightCm = (raw: string) => {
    if (raw.trim() === "") return update({ heightCm: null });
    const n = Number.parseFloat(raw);
    update({ heightCm: Number.isNaN(n) ? null : n });
  };

  const setFeetInches = (nextFeet: number, nextInches: number) => {
    if (nextFeet <= 0 && nextInches <= 0) return update({ heightCm: null });
    update({ heightCm: round(feetInchesToCm(nextFeet, nextInches), 1) });
  };

  return (
    <div className="grid gap-px bg-bone-50/10">
      <div className="grid gap-6 bg-ink-900 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
        <Segmented<UnitSystem>
          legend="Units"
          value={profile.units}
          onChange={(units) => update({ units })}
          options={[
            { id: "metric", label: "Metric" },
            { id: "imperial", label: "Imperial" },
          ]}
        />

        <Segmented<Sex>
          legend="Sex"
          value={profile.sex}
          onChange={(sex) => update({ sex })}
          options={[
            { id: "male", label: "Male" },
            { id: "female", label: "Female" },
          ]}
        />

        <Field label="Age" htmlFor={ageId}>
          <NumberInput
            id={ageId}
            value={profile.age === null ? "" : String(profile.age)}
            onChange={(raw) => {
              const n = Number.parseFloat(raw);
              update({ age: raw.trim() === "" || Number.isNaN(n) ? null : n });
            }}
            placeholder="30"
            suffix="yrs"
          />
        </Field>

        <Field label="Weight" htmlFor={weightId}>
          <NumberInput
            id={weightId}
            value={weightValue}
            onChange={setWeight}
            placeholder={imperial ? "165" : "75"}
            suffix={imperial ? "lb" : "kg"}
          />
        </Field>

        {imperial ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Height" htmlFor={feetId}>
              <NumberInput
                id={feetId}
                ariaLabel="Height in feet"
                value={feet ? String(feet) : ""}
                onChange={(raw) =>
                  setFeetInches(Number.parseFloat(raw) || 0, inches)
                }
                placeholder="5"
                suffix="ft"
              />
            </Field>
            <Field label="&nbsp;" htmlFor={inchesId}>
              <NumberInput
                id={inchesId}
                ariaLabel="Height in inches"
                value={inches ? String(inches) : ""}
                onChange={(raw) =>
                  setFeetInches(feet, Number.parseFloat(raw) || 0)
                }
                placeholder="10"
                suffix="in"
              />
            </Field>
          </div>
        ) : (
          <Field label="Height" htmlFor={heightId}>
            <NumberInput
              id={heightId}
              value={profile.heightCm === null ? "" : String(profile.heightCm)}
              onChange={setHeightCm}
              placeholder="178"
              suffix="cm"
            />
          </Field>
        )}

        <div className="sm:col-span-2 lg:col-span-3">
          <Segmented<ActivityLevelId>
            legend="Activity level"
            value={profile.activity}
            onChange={(activity) => update({ activity })}
            columns={5}
            options={ACTIVITY_LEVELS.map((a) => ({
              id: a.id,
              label: a.label.replace(" active", ""),
              description: a.description,
            }))}
          />
        </div>
      </div>

      {hydrated && (
        <p className="bg-ink-900 px-6 pb-6 text-xs text-bone-500 sm:px-8">
          Your details stay in this browser only — nothing is uploaded.
        </p>
      )}
    </div>
  );
}
