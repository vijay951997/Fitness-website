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
        // A square lime block reads as a stray tile over body copy on a
        // phone, so it is a compact circle there and the labelled pill
        // only appears once there is room for it.
        "label group fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center gap-3 rounded-full bg-lime-400 text-ink-950 shadow-xl shadow-black/40 transition-all duration-300 hover:bg-lime-500 sm:right-8 sm:bottom-8 sm:size-auto sm:rounded-none sm:px-5 sm:py-4",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppIcon className="size-6 sm:size-5" />
      <span className="hidden sm:inline">Chat with Vijay</span>
    </a>
  );
}
