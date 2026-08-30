"use client";

import { useEffect, useState } from "react";
import { telLink, waLink, whatsapp } from "@/config/site";
import { PhoneIcon, WhatsAppIcon, cx } from "./ui";

/**
 * Floating contact buttons: tap to call, and tap to chat.
 *
 * These stay a direct line rather than opening the enquiry form — someone
 * who just wants to ring should not be made to fill anything in. The
 * structured form is reached from the "Start your enquiry" buttons.
 *
 * They appear once the visitor has scrolled past the hero, so they never
 * compete with the hero's own calls to action.
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
    <div
      className={cx(
        "fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 sm:right-8 sm:bottom-8",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <a
        href={telLink()}
        aria-label={`Call Vijay on ${whatsapp.display}`}
        className="label group flex size-14 items-center justify-center gap-3 rounded-full border border-lime-400/40 bg-ink-950 text-lime-400 shadow-xl shadow-black/40 transition-colors hover:border-lime-400 hover:bg-ink-800 sm:size-auto sm:rounded-none sm:px-5 sm:py-4"
      >
        <PhoneIcon className="size-6 sm:size-5" />
        <span className="hidden sm:inline">Call</span>
      </a>

      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Vijay on WhatsApp"
        className="label group flex size-14 items-center justify-center gap-3 rounded-full bg-lime-400 text-ink-950 shadow-xl shadow-black/40 transition-colors hover:bg-lime-500 sm:size-auto sm:rounded-none sm:px-5 sm:py-4"
      >
        <WhatsAppIcon className="size-6 sm:size-5" />
        <span className="hidden sm:inline">Chat with Vijay</span>
      </a>
    </div>
  );
}
