"use client";

import { services } from "@/config/site";
import { cx } from "../ui";

/**
 * Multi-select over the site's real services.
 *
 * Options come from `services` in src/config/site.ts rather than a
 * hardcoded list, so adding or renaming a service updates the form and the
 * generated message together.
 *
 * Implemented as checkboxes rather than toggle buttons: multiple selection
 * is genuinely a checkbox group, and it gets keyboard behaviour and screen
 * reader semantics for free.
 */
export function ServiceSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <fieldset>
      <legend className="label text-bone-500">
        What are you interested in?
      </legend>
      <p className="mt-1 text-xs text-bone-500">Choose as many as apply.</p>

      <div className="mt-3 grid gap-px border border-bone-50/25 bg-bone-50/15 sm:grid-cols-2">
        {services.map((service) => {
          const checked = selected.includes(service.id);
          return (
            <label
              key={service.id}
              className={cx(
                "flex cursor-pointer items-start gap-3 p-4 transition-colors",
                checked
                  ? "bg-lime-400 text-ink-950"
                  : "bg-ink-950 text-bone-300 hover:text-lime-400",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(service.id)}
                className="mt-0.5 size-4 shrink-0 accent-lime-400"
              />
              <span>
                <span className="block text-sm leading-snug font-medium">
                  {service.title}
                </span>
                <span
                  className={cx(
                    "mt-1 block text-xs leading-snug",
                    checked ? "text-ink-950/70" : "text-bone-500",
                  )}
                >
                  {service.forWhom.replace(/^Best for /, "For ")}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
