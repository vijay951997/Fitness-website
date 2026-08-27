import { cx } from "./ui";

/** basePath is not applied to raw url() strings, so prefix them by hand. */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Photo frame with a graceful fallback.
 *
 * Drop a file at `public/images/vijay.jpg` (portrait crop, ~1200×1500)
 * and it appears automatically. Until then the layered gradient below
 * shows instead — a missing background image renders nothing at all,
 * so the page never shows a broken-image icon.
 */
export function Portrait({
  src = "/images/vijay.jpg",
  alt = "Vijay, certified personal trainer",
  className,
  monogram = "V",
  position = "center",
}: {
  src?: string;
  alt?: string;
  className?: string;
  monogram?: string;
  position?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cx(
        "relative isolate overflow-hidden bg-ink-800",
        "bg-[radial-gradient(90%_70%_at_60%_15%,var(--color-ink-600),transparent_60%),radial-gradient(80%_60%_at_25%_100%,var(--color-ink-950),transparent_55%)]",
        className,
      )}
    >
      {/* Fallback mark — hidden behind the photo once one exists */}
      <span
        aria-hidden
        className="display absolute inset-0 flex items-center justify-center text-[clamp(7rem,18vw,16rem)] leading-none text-bone-50/6 select-none"
      >
        {monogram}
      </span>

      {/* The photo */}
      <span
        aria-hidden
        className="absolute inset-0 bg-cover grayscale-[0.15] contrast-[1.05]"
        style={{
          backgroundImage: `url('${base}${src}')`,
          backgroundPosition: position,
        }}
      />
    </div>
  );
}
