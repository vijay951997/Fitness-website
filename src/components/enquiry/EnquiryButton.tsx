"use client";

import type { ReactNode } from "react";
import { cx } from "../ui";
import { openEnquiry, type EnquiryContext } from "./store";

/**
 * Opens the enquiry dialog.
 *
 * Styled to match `Button` in ../ui.tsx, but rendered as a real `<button>`
 * rather than a link — it triggers a dialog, not a navigation, so it must
 * not be an anchor.
 */
export function EnquiryButton({
  children,
  context,
  variant = "lime",
  size = "md",
  className,
  onClick,
}: {
  children: ReactNode;
  context?: EnquiryContext;
  variant?: "lime" | "outline" | "bone" | "dark";
  size?: "md" | "lg";
  className?: string;
  /** Extra behaviour for the caller, e.g. closing a mobile menu. */
  onClick?: () => void;
}) {
  const variants = {
    lime: "bg-lime-400 text-ink-950 hover:bg-lime-500 hover:-translate-y-0.5",
    outline:
      "border border-bone-50/25 text-bone-50 hover:border-lime-400 hover:text-lime-400",
    bone: "bg-bone-50 text-ink-950 hover:bg-white hover:-translate-y-0.5",
    dark: "bg-ink-950 text-bone-50 hover:bg-ink-800 hover:-translate-y-0.5",
  } as const;

  const sizes = { md: "px-6 py-3.5", lg: "px-8 py-4.5 text-sm" } as const;

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openEnquiry(context);
      }}
      className={cx(
        "group inline-flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime-400",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
