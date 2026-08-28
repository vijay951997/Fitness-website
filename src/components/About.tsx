import { site } from "@/config/site";
import { Portrait } from "./Portrait";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading, Section } from "./ui";

const credentials = [
  "Certified personal trainer",
  "Corrective exercise & posture",
  "Injury-aware programming",
  "Nutrition for Indian diets",
];

/**
 * ✏️  The copy below is a well-informed draft, not your actual story.
 *     Rewrite it in your own words — especially the credentials list.
 */
export function About() {
  return (
    <Section id="about" tone="ink" className="noise">
      <div className="grid gap-9 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>The coach</Eyebrow>
            <Heading>
              I care more about how you move
              <br className="hidden sm:block" /> than how you look
            </Heading>
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-7 max-w-2xl space-y-5 text-base leading-relaxed text-pretty text-bone-300 sm:mt-9 sm:text-lg">
              <p>
                I&apos;m Vijay, a certified personal trainer based in Sembakkam,
                Chennai. Most people who come to me have tried a gym before.
                They stopped because something started hurting, because the plan
                didn&apos;t fit their life, or because nobody ever explained why
                they were doing any of it.
              </p>
              <p>
                My approach starts with the body you have today — your posture,
                your old injuries, your desk job, your sleep. We fix the
                movement first. Then we load it.{" "}
                <span className="text-bone-50">
                  Strength built on a foundation that works is strength you
                  keep.
                </span>
              </p>
              <p>
                Everything is built for one person at a time. No copied
                templates, no generic diet charts, and no pretending that a busy
                professional in Chennai can eat like a bodybuilder in
                California.
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <ul className="mt-9 grid gap-px border border-bone-50/10 bg-bone-50/10 sm:mt-11 sm:grid-cols-2">
              {credentials.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 bg-ink-900 px-5 py-4"
                >
                  <span className="label text-lime-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-bone-100">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-5">
          <div className="relative h-full min-h-[17rem] sm:min-h-[26rem]">
            <Portrait
              src="/images/vijay-coaching.jpg"
              alt="Vijay coaching a client"
              className="h-full w-full"
              position="center 30%"
            />
            <div className="absolute bottom-0 left-0 bg-lime-400 px-5 py-4 sm:px-6 sm:py-5">
              <p className="display text-3xl text-ink-950 sm:text-4xl">
                {site.hours.replace("Open ", "")}
              </p>
              <p className="label mt-1 text-ink-950/65">Coach availability</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
