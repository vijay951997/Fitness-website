import { faqs } from "@/config/site";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading, Section } from "./ui";

export function Faq() {
  return (
    <Section id="faq" tone="ink" className="noise">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Questions</Eyebrow>
          <Heading>Before you ask</Heading>
          <p className="mt-6 leading-relaxed text-bone-300">
            Anything not covered here — just message me. I answer these myself.
          </p>
        </Reveal>

        <div className="border-t border-bone-50/12 lg:col-span-8">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 50}>
              <details className="group border-b border-bone-50/12">
                <summary className="flex cursor-pointer list-none items-baseline gap-3 py-5 text-left sm:gap-5 sm:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="label shrink-0 text-lime-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display flex-1 text-lg text-bone-50 transition-colors group-hover:text-lime-400 sm:text-2xl">
                    {faq.q}
                  </h3>
                  <span
                    aria-hidden
                    className="relative mt-2 size-4 shrink-0 text-lime-400"
                  >
                    <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rotate-90 bg-current transition-transform duration-300 group-open:rotate-0" />
                  </span>
                </summary>
                <p className="pb-6 text-[0.95rem] leading-relaxed text-pretty text-bone-300 sm:pl-11 sm:pr-10 sm:text-[0.98rem]">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
