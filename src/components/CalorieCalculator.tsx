"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading, Lede, Section, cx } from "./ui";

/** All maths runs locally — no APIs, no persistence. */
const LB_PER_KG = 2.20462;

const GOALS = [
  { id: "loss", label: "Weight loss", factor: 12 },
  { id: "maintenance", label: "Maintenance", factor: 15 },
  { id: "gain", label: "Weight gain", factor: 18 },
] as const;

type GoalId = (typeof GOALS)[number]["id"];
type Unit = "kg" | "lb";

type Result = {
  kg: number;
  lb: number;
  goalLabel: string;
  calories: number;
};

/** Grouped whole number, e.g. 1852 → "1,852". */
const grouped = (n: number) => Math.round(n).toLocaleString("en-US");

/** One decimal place, trailing ".0" trimmed. */
const oneDp = (n: number) => {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
};

const segment =
  "label py-3.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400";

const action =
  "group inline-flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase transition-all duration-200 px-6 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime-400";

export function CalorieCalculator() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [goalId, setGoalId] = useState<GoalId>("maintenance");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  function calculate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = Number.parseFloat(weight);
    if (!weight.trim() || Number.isNaN(value) || value <= 0) {
      setError("Enter a body weight greater than zero.");
      setResult(null);
      return;
    }

    setError(null);
    const lb = unit === "kg" ? value * LB_PER_KG : value;
    const kg = unit === "kg" ? value : value / LB_PER_KG;
    const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[1];

    setResult({
      kg,
      lb,
      goalLabel: goal.label,
      calories: Math.round(lb * goal.factor),
    });
    setRunId((n) => n + 1);
  }

  function reset() {
    setWeight("");
    setUnit("kg");
    setGoalId("maintenance");
    setResult(null);
    setError(null);
  }

  return (
    <Section id="calculator" tone="panel">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>Free tool</Eyebrow>
          <Heading>Daily calorie calculator</Heading>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="mt-7">
            A quick, body-weight estimate of where your daily calories could sit
            for fat loss, maintenance or lean gain. No sign-up, no email — the
            maths runs entirely in your browser.
          </Lede>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="mt-10 grid gap-px bg-bone-50/10 sm:mt-16 lg:grid-cols-2">
          {/* ── Inputs ───────────────────────────────────────── */}
          <form
            onSubmit={calculate}
            noValidate
            className="flex flex-col gap-7 bg-ink-900 p-6 sm:p-9"
          >
            <div>
              <label htmlFor="cc-weight" className="label text-bone-500">
                Body weight
              </label>
              <input
                id="cc-weight"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === "kg" ? "e.g. 70" : "e.g. 154"}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "cc-error" : undefined}
                className="mt-3 w-full border border-bone-50/25 bg-ink-950 px-4 py-3.5 text-base text-bone-50 tabular-nums transition-colors placeholder:text-bone-500 focus:border-lime-400 focus:outline-none"
              />
              {error && (
                <p
                  id="cc-error"
                  role="alert"
                  className="mt-2 text-sm text-lime-400"
                >
                  {error}
                </p>
              )}
            </div>

            <div role="group" aria-label="Weight unit">
              <span className="label text-bone-500">Unit</span>
              <div className="mt-3 grid grid-cols-2 gap-px border border-bone-50/25 bg-bone-50/15">
                {(["kg", "lb"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    aria-pressed={unit === u}
                    onClick={() => setUnit(u)}
                    className={cx(
                      segment,
                      unit === u
                        ? "bg-lime-400 text-ink-950"
                        : "bg-ink-950 text-bone-300 hover:text-lime-400",
                    )}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div role="group" aria-label="Goal">
              <span className="label text-bone-500">Goal</span>
              <div className="mt-3 grid gap-px border border-bone-50/25 bg-bone-50/15 sm:grid-cols-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={goalId === g.id}
                    onClick={() => setGoalId(g.id)}
                    className={cx(
                      segment,
                      goalId === g.id
                        ? "bg-lime-400 text-ink-950"
                        : "bg-ink-950 text-bone-300 hover:text-lime-400",
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className={cx(
                  action,
                  "bg-lime-400 text-ink-950 hover:-translate-y-0.5 hover:bg-lime-500",
                )}
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={reset}
                className={cx(
                  action,
                  "border border-bone-50/25 text-bone-50 hover:border-lime-400 hover:text-lime-400",
                )}
              >
                Reset
              </button>
            </div>
          </form>

          {/* ── Result ───────────────────────────────────────── */}
          <div
            aria-live="polite"
            className="flex flex-col justify-center bg-ink-900 p-6 sm:p-9"
          >
            {result ? (
              <ResultReveal key={runId}>
                <p className="label text-bone-500">
                  Your estimated daily calorie target
                </p>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="display text-[clamp(2.75rem,11vw,4.5rem)] leading-none text-lime-400">
                    {grouped(result.calories)}
                  </span>
                  <span className="label text-bone-400">kcal / day</span>
                </p>

                <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-bone-50/12 pt-6 text-sm">
                  <dt className="label text-bone-500">Weight</dt>
                  <dd className="tabular-nums text-bone-100">
                    {oneDp(result.kg)} kg · {oneDp(result.lb)} lb
                  </dd>
                  <dt className="label text-bone-500">Goal</dt>
                  <dd className="text-bone-100">{result.goalLabel}</dd>
                </dl>
              </ResultReveal>
            ) : (
              <p className="text-sm leading-relaxed text-bone-400">
                Enter your body weight, choose your unit and goal, then press
                Calculate. Your estimate appears here.
              </p>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-bone-500">
          This calculator provides an estimated starting point based on body
          weight and your selected goal. Individual calorie requirements may vary
          depending on factors such as age, activity level, body composition,
          metabolism and overall health. For a personalised plan,{" "}
          <a
            href="#contact"
            className="text-bone-300 underline decoration-lime-400/50 underline-offset-4 transition-colors hover:text-lime-400"
          >
            book a consultation
          </a>
          .
        </p>
      </Reveal>
    </Section>
  );
}

/**
 * Reuses the site's `.reveal` fade. Remounted via `key` on each calculation
 * so a fresh result slides in; `.reveal` is forced visible under
 * `prefers-reduced-motion` by globals.css, so this stays fail-safe.
 */
function ResultReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add("reveal-in")),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
