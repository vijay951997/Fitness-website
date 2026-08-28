import { site, testimonials } from "@/config/site";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading, Section, Stars } from "./ui";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section id="results" tone="ink" className="noise">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <Reveal className="max-w-xl">
          <Eyebrow>In their words</Eyebrow>
          <Heading>What clients say</Heading>
        </Reveal>

        <Reveal delay={80}>
          <a
            href={site.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex items-center gap-3 border border-bone-50/20 px-5 py-3.5 text-bone-100 transition-colors hover:border-lime-400 hover:text-lime-400"
          >
            <Stars className="text-lime-400" />
            {site.rating.value} on Google
          </a>
        </Reveal>
      </div>

      <div className="mt-9 grid gap-px bg-bone-50/10 sm:mt-14 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name + i} delay={i * 70}>
            <figure className="flex h-full flex-col bg-ink-900 p-6 sm:p-8">
              <Stars className="text-lime-400" />
              <blockquote className="mt-5 flex-1 text-[1.05rem] leading-relaxed text-pretty text-bone-100">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 border-t border-bone-50/12 pt-5">
                <p className="display text-xl text-bone-50">{t.name}</p>
                <p className="label mt-1.5 text-bone-500">{t.detail}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
