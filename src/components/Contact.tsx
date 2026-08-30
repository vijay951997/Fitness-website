import { enquiryFormUrl, site, waLink, whatsapp } from "@/config/site";
import { Reveal } from "./Reveal";
import { ArrowIcon, Button, Eyebrow, Heading, StripeBar, WhatsAppIcon } from "./ui";

export function Contact() {
  const details = [
    {
      label: "WhatsApp",
      value: whatsapp.display,
      href: waLink(),
      external: true,
    },
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
    {
      label: "Based in",
      value: `${site.city}, ${site.region}`,
      href: site.googleMapsUrl,
      external: true,
    },
    {
      label: "Hours",
      value: site.availability.detail,
      href: null,
      external: false,
    },
  ];

  return (
    <section
      id="contact"
      className="noise relative isolate overflow-hidden bg-ink-950 text-bone-50"
    >
      <StripeBar />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:gap-14 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Get started</Eyebrow>
            <Heading className="text-[clamp(2.1rem,7vw,5.5rem)]">
              Tell me what you&apos;re
              <br />
              working <span className="text-lime-400">towards</span>
            </Heading>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-pretty text-bone-300 sm:mt-8 sm:text-lg">
              Send a message and we&apos;ll set up a short call. We&apos;ll talk
              through your goal, your injuries and your schedule before you
              commit to anything.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                <WhatsAppIcon />
                Message on WhatsApp
              </Button>
              <Button
                href={enquiryFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
              >
                Fill the enquiry form
                <ArrowIcon />
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-5">
          <dl className="border-t border-bone-50/12">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex flex-col gap-1 border-b border-bone-50/12 py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <dt className="label w-28 shrink-0 text-bone-500">{d.label}</dt>
                <dd className="text-[0.95rem] leading-relaxed text-bone-100">
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-block py-3 underline decoration-lime-400/50 underline-offset-4 transition-colors hover:text-lime-400"
                    >
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={site.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center justify-between gap-4 border border-bone-50/15 p-5 transition-colors hover:border-lime-400"
          >
            <span>
              <span className="display block text-xl text-bone-50">
                Find me on Google
              </span>
              <span className="label mt-1 block text-bone-500">
                Rated {site.rating.value} · {site.city}
              </span>
            </span>
            <ArrowIcon className="text-lime-400" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
