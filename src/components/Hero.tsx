import { enquiryFormUrl, site, waLink } from "@/config/site";
import { Portrait } from "./Portrait";
import { Reveal } from "./Reveal";
import { ArrowIcon, Button, Stars, StripeBar, WhatsAppIcon } from "./ui";

const stats = [
  { v: "5.0", l: "Google rating" },
  { v: "1:1", l: "Every plan bespoke" },
  { v: "24/7", l: "Coach on WhatsApp" },
  { v: "3", l: "Coaching tracks" },
];

export function Hero() {
  return (
    <section className="noise relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink-950 pt-28">
      {/* Full-bleed photo, anchored right on wide screens */}
      <div className="absolute inset-0 -z-10">
        <Portrait
          className="size-full"
          position="60% 25%"
          alt="Vijay, certified personal trainer in Chennai"
        />
        {/* Scrims: dark from the left so the headline always has contrast */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40 lg:via-ink-950/70 lg:to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink-950 to-transparent"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-12 sm:px-8 sm:pb-14">
        <Reveal>
          <p className="label mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-bone-300">
            <span className="flex items-center gap-2 bg-lime-400 px-2.5 py-1.5 text-ink-950">
              <Stars />
              {site.rating.value}
            </span>
            <span>Certified personal trainer</span>
            <span aria-hidden className="text-lime-400">
              /
            </span>
            <span>
              {site.city}, {site.region}
            </span>
          </p>
        </Reveal>

        <Reveal delay={70}>
          {/* Line breaks are forced only from `sm` up; on phones the
              headline wraps naturally, which reads better than a fixed
              break landing mid-phrase. */}
          <h1 className="display text-[clamp(3rem,9vw,7.5rem)] text-balance">
            Train for a body{" "}
            <br className="hidden sm:inline" />
            that <span className="text-lime-400">lasts</span> — not one{" "}
            <br className="hidden sm:inline" />
            that breaks
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-pretty text-bone-300 sm:text-xl">
            Online coaching, prehab &amp; rehab, and nutrition built around the
            food you already eat. Coached one-to-one from Chennai.
          </p>
        </Reveal>

        <Reveal delay={210}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              <WhatsAppIcon />
              Start on WhatsApp
            </Button>
            <Button
              href={enquiryFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
            >
              Get a plan quote
              <ArrowIcon />
            </Button>
          </div>
        </Reveal>
      </div>

      <StripeBar />

      {/* Stat rail across the base of the hero */}
      <Reveal>
        <dl className="grid grid-cols-2 divide-x divide-y divide-bone-50/10 border-t border-bone-50/10 bg-ink-900/80 backdrop-blur-sm sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.l} className="px-5 py-6 sm:px-8">
              <dt className="display text-4xl text-bone-50 sm:text-5xl">
                {s.v}
              </dt>
              <dd className="label mt-2 text-bone-400">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
