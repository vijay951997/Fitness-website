"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site, waLink } from "@/config/site";
import { Button, WhatsAppIcon, cx } from "./ui";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-bone-50/10 bg-ink-950/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label={`${site.name} — home`}
          className="display py-2 text-xl text-bone-50 sm:text-2xl"
        >
          Fit with <span className="text-lime-400">Vijay</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label text-bone-300 transition-colors hover:text-lime-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <WhatsAppIcon />
            Enquire
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center border border-bone-50/20 text-bone-50 md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cx(
                  "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cx(
                  "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cx(
          "overflow-hidden bg-ink-950 transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-5 pb-6">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-bone-50/10 py-4"
            >
              <span className="label text-lime-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="display text-3xl text-bone-50 transition-colors group-hover:text-lime-400">
                {item.label}
              </span>
            </Link>
          ))}
          <Button
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="mt-6 w-full"
            onClick={() => setOpen(false)}
          >
            <WhatsAppIcon />
            Message on WhatsApp
          </Button>
        </nav>
      </div>
    </header>
  );
}
