import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ── Section shell ─────────────────────────────────────────── */

export function Section({
  id,
  children,
  className,
  tone = "ink",
  full = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "ink" | "panel" | "lime" | "bone";
  full?: boolean;
}) {
  const tones = {
    ink: "bg-ink-900 text-bone-50",
    panel: "bg-ink-850 text-bone-50",
    lime: "bg-lime-400 text-ink-950",
    bone: "bg-bone-50 text-ink-950",
  } as const;

  return (
    <section
      id={id}
      className={cx(
        "relative isolate overflow-hidden px-5 py-20 sm:px-8 sm:py-28",
        tones[tone],
        className,
      )}
    >
      <div className={cx("relative z-10", full ? "" : "mx-auto w-full max-w-7xl")}>
        {children}
      </div>
    </section>
  );
}

/* ── Eyebrow: mono label with an index rule ────────────────── */

export function Eyebrow({
  children,
  accent = "lime",
}: {
  children: ReactNode;
  accent?: "lime" | "ink";
}) {
  return (
    <p
      className={cx(
        "label mb-6 flex items-center gap-3",
        accent === "lime" ? "text-lime-400" : "text-ink-950/70",
      )}
    >
      <span
        aria-hidden
        className={cx(
          "inline-block h-2.5 w-2.5",
          accent === "lime" ? "bg-lime-400" : "bg-ink-950",
        )}
      />
      {children}
    </p>
  );
}

/* ── Headings ──────────────────────────────────────────────── */

export function Heading({
  children,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        "display text-balance",
        Tag === "h1"
          ? "text-[clamp(3rem,9vw,7.5rem)]"
          : "text-[clamp(2.25rem,5.5vw,4.5rem)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "max-w-2xl text-lg leading-relaxed text-pretty text-bone-300 sm:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ── Buttons — sharp corners, solid fills ──────────────────── */

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: "lime" | "outline" | "bone" | "dark";
  size?: "md" | "lg";
};

export function Button({
  variant = "lime",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime-400";

  const variants = {
    lime: "bg-lime-400 text-ink-950 hover:bg-lime-500 hover:-translate-y-0.5",
    outline:
      "border border-bone-50/25 text-bone-50 hover:border-lime-400 hover:text-lime-400",
    bone: "bg-bone-50 text-ink-950 hover:bg-white hover:-translate-y-0.5",
    dark: "bg-ink-950 text-bone-50 hover:bg-ink-800 hover:-translate-y-0.5",
  } as const;

  const sizes = {
    md: "px-6 py-3.5",
    lg: "px-8 py-4.5 text-sm",
  } as const;

  return (
    <Link
      className={cx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/* ── Divider: thin hazard-striped bar ──────────────────────── */

export function StripeBar({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("stripes h-1.5 w-full opacity-70", className)} />
  );
}

/* ── Icons ─────────────────────────────────────────────────── */

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cx("size-[1.25em]", className)}
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23z" />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
      className={cx(
        "size-[1.05em] transition-transform duration-200 group-hover:translate-x-1",
        className,
      )}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      aria-hidden
      className={cx("size-4 shrink-0", className)}
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function Stars({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex gap-0.5", className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
          <path d="m12 2 2.9 6.26 6.6.72-4.9 4.5 1.35 6.52L12 16.8l-5.95 3.2L7.4 13.5 2.5 8.98l6.6-.72z" />
        </svg>
      ))}
    </span>
  );
}
