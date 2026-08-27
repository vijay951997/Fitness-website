import { process } from "@/config/site";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading, Lede, Section } from "./ui";

/** Lime band — the one bright section, so the page has a clear midpoint. */
export function Process() {
  return (
    <Section id="process" tone="lime">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow accent="ink">How it works</Eyebrow>
          <Heading className="text-ink-950">
            From first message to first result
          </Heading>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="mt-7 text-ink-950/70">
            No contracts before we&apos;ve spoken. No payment before you know
            exactly what you&apos;re getting.
          </Lede>
        </Reveal>
      </div>

      <ol className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((step, i) => (
          <Reveal key={step.step} delay={i * 70} as="li">
            <div className="border-t-2 border-ink-950 pt-5">
              <span className="display text-6xl text-ink-950/25">
                {step.step}
              </span>
              <h3 className="display mt-4 text-2xl text-ink-950">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-pretty text-ink-950/70">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
