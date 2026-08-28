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

      <div className="mt-10 border-t border-bone-50/12 sm:mt-16">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 70}>
            <article className="group relative grid gap-4 border-b border-bone-50/12 py-8 transition-colors duration-300 hover:bg-ink-800/60 sm:gap-6 md:grid-cols-12 md:gap-8 md:py-12">
              {/* Index */}
              <div className="md:col-span-2">
                <span className="display text-4xl text-bone-50/15 transition-colors duration-300 group-hover:text-lime-400 sm:text-5xl md:text-6xl">
                  {service.eyebrow}
                </span>
              </div>

              {/* Title + summary */}
              <div className="md:col-span-5">
                <h3 className="display text-2xl text-bone-50 sm:text-3xl md:text-4xl">
                  {service.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-pretty text-bone-300 sm:mt-4 sm:text-base">
                  {service.summary}
                </p>
                <p className="label mt-4 text-bone-500 sm:mt-5">{service.forWhom}</p>
                {"disclaimer" in service && service.disclaimer && (
                  <p className="mt-4 border-l-2 border-bone-50/20 pl-3 text-xs leading-relaxed text-bone-400 sm:mt-5">
                    {service.disclaimer
                      .split(/\*\*(.+?)\*\*/)
                      .map((part, idx) =>
                        idx % 2 === 1 ? (
                          <strong key={idx} className="text-bone-200">
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                  </p>
                )}
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
