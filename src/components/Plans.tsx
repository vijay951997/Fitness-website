import { plans } from "@/config/site";
import { Reveal } from "./Reveal";
import {
  ArrowIcon,
  CheckIcon,
  Eyebrow,
  Heading,
  Lede,
  Section,
  cx,
} from "./ui";
import { EnquiryButton } from "./enquiry/EnquiryButton";

export function Plans() {
  return (
    <Section id="plans" tone="panel">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>Coaching plans</Eyebrow>
          <Heading>Straightforward monthly pricing</Heading>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="mt-7">
            Final pricing depends on your goal, your starting point and how much
            support you need. These are the bands most clients fall into.
          </Lede>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-px bg-bone-50/10 sm:mt-16 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 70}>
            <article
              className={cx(
                "relative flex h-full flex-col p-6 sm:p-9",
                plan.featured ? "bg-lime-400 text-ink-950" : "bg-ink-900",
              )}
            >
              {plan.featured && (
                <span className="label absolute top-0 right-0 bg-ink-950 px-3 py-2 text-lime-400">
                  Most chosen
                </span>
              )}

              <h3
                className={cx(
                  "display text-3xl",
                  plan.featured ? "text-ink-950" : "text-bone-50",
                )}
              >
                {plan.name}
              </h3>

              <p
                className={cx(
                  "mt-2 text-sm",
                  plan.featured ? "text-ink-950/70" : "text-bone-400",
                )}
              >
                {plan.blurb}
              </p>

              <p className="mt-6 flex flex-wrap items-baseline gap-2 sm:mt-8">
                <span
                  className={cx(
                    "display text-[2.25rem] leading-none sm:text-[2.75rem]",
                    plan.featured ? "text-ink-950" : "text-bone-50",
                  )}
                >
                  {plan.price}
                </span>
                <span
                  className={cx(
                    "label",
                    plan.featured ? "text-ink-950/60" : "text-bone-500",
                  )}
                >
                  {plan.cadence}
                </span>
              </p>

              <ul
                className={cx(
                  "mt-6 flex-1 space-y-3.5 border-t pt-6 sm:mt-8 sm:pt-7",
                  plan.featured ? "border-ink-950/20" : "border-bone-50/12",
                )}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={cx(
                      "flex gap-3 text-sm leading-relaxed",
                      plan.featured ? "text-ink-950/85" : "text-bone-100",
                    )}
                  >
                    <CheckIcon
                      className={cx(
                        "mt-0.5",
                        plan.featured ? "text-ink-950" : "text-lime-400",
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <EnquiryButton
                variant={plan.featured ? "dark" : "outline"}
                className="mt-7 w-full sm:mt-9"
                context={{ planName: plan.name, source: `${plan.name} plan` }}
              >
                Enquire
                {plan.featured ? null : <ArrowIcon />}
              </EnquiryButton>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={180}>
        <p className="label mt-10 text-center text-bone-400">
          Not sure which fits? Message me and we&apos;ll work it out on a call.
        </p>
      </Reveal>
    </Section>
  );
}
