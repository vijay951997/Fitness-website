"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/config/site";
import { WhatsAppIcon, cx } from "./ui";

/**
 * Floating WhatsApp button. Appears once the visitor has scrolled past
 * the hero, so it never competes with the hero's own call to action.
 */
export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Vijay on WhatsApp"
      className={cx(
        "label group fixed right-5 bottom-5 z-50 flex items-center gap-3 bg-lime-400 px-4 py-4 text-ink-950 shadow-xl shadow-black/40 transition-all duration-300 hover:bg-lime-500 sm:right-8 sm:bottom-8 sm:pr-5",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppIcon className="size-5" />
      <span className="hidden sm:inline">Chat with Vijay</span>
    </a>
  );
}
