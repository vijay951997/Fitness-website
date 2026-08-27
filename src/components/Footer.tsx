import Link from "next/link";
import { nav, site, social, waLink, whatsapp } from "@/config/site";
import { WhatsAppIcon } from "./ui";

export function Footer() {
  const socials = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="border-t border-bone-50/12 bg-ink-900 px-5 py-12 text-bone-400 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <p className="display text-2xl text-bone-50">
              Fit with <span className="text-lime-400">Vijay</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              Certified personal training, prehab &amp; rehab and nutrition
              coaching — from {site.city}, worldwide online.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label py-1.5 transition-colors hover:text-lime-400"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="label py-1.5 transition-colors hover:text-lime-400"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-lime-400"
            >
              <WhatsAppIcon />
              {whatsapp.display}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="py-1.5 transition-colors hover:text-lime-400"
            >
              {site.email}
            </a>
            {socials.length > 0 && (
              <div className="mt-1 flex gap-4">
                {socials.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize transition-colors hover:text-lime-400"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-bone-50/12 pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-bone-500">
            Training advice is not medical advice. Consult a doctor before
            starting a new programme.
          </p>
        </div>
      </div>
    </footer>
  );
}
