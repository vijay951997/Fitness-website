import { services, waLink } from "@/config/site";
import { Reveal } from "./Reveal";
import { ArrowIcon, Eyebrow, Heading, Lede, Section } from "./ui";

/**
 * Full-width numbered rows rather than three equal cards — gives each
 * service room to explain itself and reads like a programme listing.
 */
export function Services() {
  return (
    <Section id="services" tone="panel">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>What I coach</Eyebrow>
          <Heading>Three ways to work together</Heading>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="mt-7">
            Most clients combine all three. They&apos;re listed separately so
            you can see exactly what you&apos;re paying for.
          </Lede>
        </Reveal>
      </div>

      <div className="mt-16 border-t border-bone-50/12">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 70}>
            <article className="group relative grid gap-6 border-b border-bone-50/12 py-10 transition-colors duration-300 hover:bg-ink-800/60 md:grid-cols-12 md:gap-8 md:py-12">
              {/* Index */}
              <div className="md:col-span-2">
                <span className="display text-5xl text-bone-50/15 transition-colors duration-300 group-hover:text-lime-400 md:text-6xl">
                  {service.eyebrow}
                </span>
              </div>

              {/* Title + summary */}
              <div className="md:col-span-5">
                <h3 className="display text-3xl text-bone-50 sm:text-4xl">
                  {service.title}
                </h3>
                <p className="mt-4 leading-relaxed text-pretty text-bone-300">
                  {service.summary}
                </p>
                <p className="label mt-5 text-bone-500">{service.forWhom}</p>
              </div>

              {/* Inclusions */}
              <div className="md:col-span-5">
                <ul className="space-y-3">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-bone-100"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 bg-lime-400"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(
                    `Hi Vijay, I'd like to know more about your ${service.title} program.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* py-3.5 keeps this a comfortable touch target on phones */
                  className="label mt-4 inline-flex items-center gap-2 py-3.5 text-lime-400 transition-colors hover:text-lime-500"
                >
                  Ask about this
                  <ArrowIcon />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
