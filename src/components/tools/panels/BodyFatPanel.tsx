"use client";

import { useState } from "react";
import { calculateBodyFat, kgToLb, round } from "@/lib/calculations";
import { useProfile } from "@/lib/profile";
import {
  BigStat,
  EmptyState,
  ErrorList,
  Field,
  Note,
  NumberInput,
  StatList,
  useFieldId,
} from "../controls";

/** Tape measurements, kept local — they are not part of the shared profile. */
type Tape = { neck: string; waist: string; hip: string };

export function BodyFatPanel() {
  const { profile } = useProfile();
  const [tape, setTape] = useState<Tape>({ neck: "", waist: "", hip: "" });
  const neckId = useFieldId("neck");
  const waistId = useFieldId("waist");
  const hipId = useFieldId("hip");

  const female = profile.sex === "female";
  const imperial = profile.units === "imperial";
  // The Navy formula is defined in centimetres; imperial users enter inches.
  const toCm = (raw: string) => {
    const n = Number.parseFloat(raw);
    if (Number.isNaN(n)) return Number.NaN;
    return imperial ? n * 2.54 : n;
  };
  const suffix = imperial ? "in" : "cm";

  if (profile.heightCm === null) {
    return <EmptyState>Enter your height above.</EmptyState>;
  }

  const entered =
    tape.neck.trim() !== "" &&
    tape.waist.trim() !== "" &&
    (!female || tape.hip.trim() !== "");

  const result = entered
    ? calculateBodyFat({
        sex: profile.sex,
        heightCm: profile.heightCm,
        neckCm: toCm(tape.neck),
        waistCm: toCm(tape.waist),
        hipCm: female ? toCm(tape.hip) : undefined,
        weightKg: profile.weightKg ?? undefined,
      })
    : null;

  const errorFor = (field: string) =>
    result && !result.ok
      ? (result.errors.find((e) => e.field === field)?.message ?? null)
      : null;

  const fmtMass = (kg: number) =>
    imperial ? `${round(kgToLb(kg), 1)} lb` : `${kg} kg`;

  return (
    <>
      <div className="mb-7 grid gap-6 sm:grid-cols-3">
        <Field label="Neck" htmlFor={neckId} error={errorFor("neckCm")}>
          <NumberInput
            id={neckId}
            value={tape.neck}
            onChange={(neck) => setTape((t) => ({ ...t, neck }))}
            placeholder={imperial ? "15" : "38"}
            suffix={suffix}
            invalid={Boolean(errorFor("neckCm"))}
          />
        </Field>

        <Field label="Waist" htmlFor={waistId} error={errorFor("waistCm")}>
          <NumberInput
            id={waistId}
            value={tape.waist}
            onChange={(waist) => setTape((t) => ({ ...t, waist }))}
            placeholder={imperial ? "33" : "85"}
            suffix={suffix}
            invalid={Boolean(errorFor("waistCm"))}
          />
        </Field>

        {female && (
          <Field label="Hips" htmlFor={hipId} error={errorFor("hipCm")}>
            <NumberInput
              id={hipId}
              value={tape.hip}
              onChange={(hip) => setTape((t) => ({ ...t, hip }))}
              placeholder={imperial ? "37" : "95"}
              suffix={suffix}
              invalid={Boolean(errorFor("hipCm"))}
            />
          </Field>
        )}
      </div>

      {result === null ? (
        <EmptyState>
          Measure your neck at its narrowest and your waist at the navel
          {female ? ", plus your hips at their widest" : ""}. Keep the tape
          level and snug without compressing the skin.
        </EmptyState>
      ) : !result.ok ? (
        <ErrorList errors={result.errors} />
      ) : (
        <>
          <BigStat
            value={String(result.data.bodyFatPercent)}
            unit="%"
            caption="Estimated body fat"
          />
          <p className="mt-4 inline-flex bg-lime-400 px-3 py-1.5 text-xs font-medium tracking-wide text-ink-950 uppercase">
            {result.data.category}
          </p>
          <StatList
            rows={[
              { label: "Method", value: result.data.method },
              ...(result.data.fatMassKg !== null
                ? [
                    {
                      label: "Fat mass",
                      value: fmtMass(result.data.fatMassKg),
                    },
                    {
                      label: "Lean mass",
                      value: fmtMass(result.data.leanMassKg as number),
                    },
                  ]
                : []),
            ]}
          />
          <Note>
            An estimate from tape measurements, accurate to roughly ±3–4%
            against laboratory methods when measured carefully. It is far more
            useful as a trend than as a single figure — measure the same way,
            at the same time of day, every few weeks, and watch the direction
            rather than the number.
          </Note>
        </>
      )}
    </>
  );
}
