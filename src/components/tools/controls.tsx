"use client";

import { useId, type ReactNode } from "react";
import { cx } from "../ui";

/**
 * Form primitives for the calculators.
 *
 * The visual language is lifted from the existing CalorieCalculator so the
 * tools look like the rest of the site: `.label` mono captions, square
 * corners, lime as the only accent, ink-950 input wells.
 */

/* ── Field wrapper ────────────────────────────────────────── */

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label block text-bone-500">
        {label}
      </label>
      {children}
      {/* Errors are announced and carry a text marker, so the message is
          never conveyed by colour alone. */}
      {error ? (
        <p role="alert" className="mt-2 flex gap-1.5 text-sm text-lime-400">
          <span aria-hidden>!</span>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs leading-relaxed text-bone-500">{hint}</p>
      ) : null}
    </div>
  );
}

/* ── Number input ─────────────────────────────────────────── */

export function NumberInput({
  value,
  onChange,
  placeholder,
  suffix,
  invalid,
  id,
  ariaLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  suffix?: string;
  invalid?: boolean;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="relative mt-3">
      <input
        id={id}
        aria-label={ariaLabel}
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={cx(
          "w-full border bg-ink-950 px-4 py-3.5 text-base text-bone-50 tabular-nums transition-colors placeholder:text-bone-500 focus:outline-none",
          suffix && "pr-14",
          invalid
            ? "border-lime-400"
            : "border-bone-50/25 focus:border-lime-400",
        )}
      />
      {suffix && (
        <span
          aria-hidden
          className="label pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-bone-500"
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

/* ── Segmented control ────────────────────────────────────── */

export type Segment<T extends string> = {
  id: T;
  label: string;
  description?: string;
};

export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns,
}: {
  legend: string;
  options: readonly Segment<T>[];
  value: T;
  onChange: (next: T) => void;
  /** Column count from `sm` up; below that it stacks or pairs. */
  columns?: 2 | 3 | 4 | 5;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
  } as const;

  return (
    <div role="group" aria-label={legend}>
      <span className="label block text-bone-500">{legend}</span>
      <div
        className={cx(
          "mt-3 grid gap-px border border-bone-50/25 bg-bone-50/15",
          options.length > 3 ? "grid-cols-2" : "",
          columns ? cols[columns] : "",
        )}
      >
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              title={option.description}
              onClick={() => onChange(option.id)}
              className={cx(
                "label px-2 py-3.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400",
                selected
                  ? "bg-lime-400 text-ink-950"
                  : "bg-ink-950 text-bone-300 hover:text-lime-400",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Buttons ──────────────────────────────────────────────── */

export function ToolButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "label inline-flex items-center justify-center gap-2.5 px-6 py-3.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime-400",
        variant === "primary"
          ? "bg-lime-400 text-ink-950 hover:-translate-y-0.5 hover:bg-lime-500"
          : "border border-bone-50/25 text-bone-50 hover:border-lime-400 hover:text-lime-400",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ── Result display ───────────────────────────────────────── */

/** The single big number a calculator exists to produce. */
export function BigStat({
  value,
  unit,
  caption,
}: {
  value: string;
  unit?: string;
  caption: string;
}) {
  return (
    <div>
      <p className="label text-bone-500">{caption}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="display text-[clamp(2.5rem,10vw,4rem)] leading-none text-lime-400">
          {value}
        </span>
        {unit && <span className="label text-bone-400">{unit}</span>}
      </p>
    </div>
  );
}

/** Supporting figures beneath the headline number. */
export function StatList({
  rows,
}: {
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-bone-50/12 pt-6 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="label text-bone-500">{row.label}</dt>
          <dd className="text-right tabular-nums text-bone-100 sm:text-left">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Shown before there is enough input to calculate anything. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-bone-400">{children}</p>
  );
}

/** Errors raised by the calculation engine. */
export function ErrorList({ errors }: { errors: { message: string }[] }) {
  return (
    <ul role="alert" className="space-y-2">
      {errors.map((e) => (
        <li key={e.message} className="flex gap-2 text-sm text-lime-400">
          <span aria-hidden>!</span>
          {e.message}
        </li>
      ))}
    </ul>
  );
}

/** Short caveat shown under a result. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 border-t border-bone-50/12 pt-5 text-xs leading-relaxed text-bone-500">
      {children}
    </p>
  );
}

/** Two-pane calculator layout: inputs on the left, results on the right. */
export function ToolLayout({
  inputs,
  results,
}: {
  inputs: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="grid gap-px bg-bone-50/10 lg:grid-cols-2">
      <div className="flex flex-col gap-7 bg-ink-900 p-6 sm:p-8">{inputs}</div>
      <div
        aria-live="polite"
        className="flex flex-col justify-center bg-ink-900 p-6 sm:p-8"
      >
        {results}
      </div>
    </div>
  );
}

/** Stable ids for label/input pairs inside a panel. */
export function useFieldId(name: string): string {
  const id = useId();
  return `${name}-${id}`;
}
