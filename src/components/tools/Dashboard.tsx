"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";
import { Eyebrow, Heading, Lede, Section, cx } from "../ui";
import { ProfileBar } from "./ProfileBar";
import { BmrPanel } from "./panels/BmrPanel";
import { TdeePanel } from "./panels/TdeePanel";
import { BmiPanel } from "./panels/BmiPanel";
import { MacroPanel } from "./panels/MacroPanel";
import { WaterPanel } from "./panels/WaterPanel";
import { IdealWeightPanel } from "./panels/IdealWeightPanel";
import { DeficitPanel } from "./panels/DeficitPanel";
import { TimelinePanel } from "./panels/TimelinePanel";
import { BodyFatPanel } from "./panels/BodyFatPanel";
import { WorkoutPanel } from "./panels/WorkoutPanel";
import { StepsPanel } from "./panels/StepsPanel";

type Tool = {
  id: string;
  label: string;
  title: string;
  blurb: string;
  Panel: () => React.JSX.Element;
};

const TOOLS: Tool[] = [
  {
    id: "bmr",
    label: "BMR",
    title: "Basal metabolic rate",
    blurb: "What your body burns at complete rest.",
    Panel: BmrPanel,
  },
  {
    id: "tdee",
    label: "TDEE",
    title: "Total daily energy expenditure",
    blurb: "Your maintenance calories, once activity is counted.",
    Panel: TdeePanel,
  },
  {
    id: "macros",
    label: "Macros",
    title: "Calories and macros",
    blurb: "A protein, carbohydrate and fat split for your goal.",
    Panel: MacroPanel,
  },
  {
    id: "bmi",
    label: "BMI",
    title: "Body mass index",
    blurb: "A screening figure, with its limitations stated.",
    Panel: BmiPanel,
  },
  {
    id: "water",
    label: "Water",
    title: "Daily water target",
    blurb: "Scaled to your weight, activity and training time.",
    Panel: WaterPanel,
  },
  {
    id: "ideal-weight",
    label: "Weight range",
    title: "Healthy weight range",
    blurb: "The band that matches a healthy BMI at your height.",
    Panel: IdealWeightPanel,
  },
  {
    id: "deficit",
    label: "Deficit",
    title: "Calorie deficit",
    blurb: "How far below maintenance to eat, and what that means per week.",
    Panel: DeficitPanel,
  },
  {
    id: "timeline",
    label: "Timeline",
    title: "Weight change timeline",
    blurb: "Roughly how long your target might take.",
    Panel: TimelinePanel,
  },
  {
    id: "body-fat",
    label: "Body fat",
    title: "Body fat percentage",
    blurb: "Estimated from tape measurements, U.S. Navy method.",
    Panel: BodyFatPanel,
  },
  {
    id: "workout",
    label: "Workout",
    title: "Workout calories",
    blurb: "Energy cost of a session, from its MET value.",
    Panel: WorkoutPanel,
  },
  {
    id: "steps",
    label: "Steps",
    title: "Steps to calories",
    blurb: "Distance and energy from a day's step count.",
    Panel: StepsPanel,
  },
];

/**
 * Tabbed calculator dashboard.
 *
 * One shared profile feeds every tool, so measurements are entered once.
 * Results recompute as the profile changes — there is no Calculate button
 * to press, which removes a step on a phone.
 */
export function Dashboard() {
  const [activeId, setActiveId] = useState(TOOLS[0].id);
  const active = TOOLS.find((t) => t.id === activeId) ?? TOOLS[0];
  const ActivePanel = active.Panel;

  return (
    <Section id="dashboard" tone="panel">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>Free tools</Eyebrow>
          <Heading>Your numbers, worked out</Heading>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="mt-7">
            Enter your details once and every calculator updates. Nothing is
            sent anywhere — the maths runs in your browser and your details
            stay on this device.
          </Lede>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="mt-10 sm:mt-14">
          <ProfileBar />
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-10">
          {/* Horizontally scrollable so eleven tabs never wrap into an
              unusable stack — this matters on desktop too, not just phones. */}
          <div
            role="tablist"
            aria-label="Calculators"
            className="-mx-5 flex gap-px overflow-x-auto bg-bone-50/10 px-5 sm:mx-0 sm:px-0"
          >
            {TOOLS.map((tool) => {
              const selected = tool.id === active.id;
              return (
                <button
                  key={tool.id}
                  role="tab"
                  id={`tab-${tool.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${tool.id}`}
                  onClick={() => setActiveId(tool.id)}
                  className={cx(
                    "label shrink-0 px-5 py-4 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime-400",
                    selected
                      ? "bg-lime-400 text-ink-950"
                      : "bg-ink-900 text-bone-300 hover:text-lime-400",
                  )}
                >
                  {tool.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            className="border-t border-bone-50/10 bg-ink-900 p-6 sm:p-8"
          >
            <div className="mb-7">
              <h3 className="display text-2xl text-bone-50 sm:text-3xl">
                {active.title}
              </h3>
              <p className="mt-2 text-sm text-bone-400">{active.blurb}</p>
            </div>

            <ActivePanel />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-bone-500">
          These calculations provide estimates for general informational
          purposes and are not medical advice. Individual requirements vary
          with body composition, metabolism, medication and health conditions.
          Speak to a doctor or dietitian before making significant changes, and{" "}
          <a
            href="#contact"
            className="text-bone-300 underline decoration-lime-400/50 underline-offset-4 transition-colors hover:text-lime-400"
          >
            book a consultation
          </a>{" "}
          for a plan built around you.
        </p>
      </Reveal>
    </Section>
  );
}
