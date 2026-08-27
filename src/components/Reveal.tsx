"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fades content in as it scrolls into view.
 *
 * Deliberately fail-safe: the animation is decorative, so every path that
 * can't run it properly falls back to simply showing the content. Content
 * must never be left at opacity 0 — a browser or crawler that defers
 * IntersectionObserver callbacks (a background tab, a print renderer)
 * would otherwise capture a blank page.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("reveal-in");

    // 1. No observer support, or the visitor prefers less motion.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show();
      return;
    }

    // 2. Page isn't being rendered (background tab, headless capture).
    //    Observer callbacks and rAF are both suspended here, so reveal
    //    outright — there is nobody watching the animation anyway.
    if (document.visibilityState === "hidden") {
      show();
      return;
    }

    // 3. Already on screen at mount. Reveal on the next frame rather than
    //    waiting for the observer, so above-the-fold content can't stall.
    //    The double rAF lets the opacity-0 state paint first, which keeps
    //    the CSS transition intact.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(show));
      return () => cancelAnimationFrame(raf);
    }

    // 4. Below the fold — the normal path.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);

    // Safety net: if the observer somehow never fires, show it anyway.
    const timer = window.setTimeout(show, 4000);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
