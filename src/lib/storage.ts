/**
 * Browser storage, wrapped.
 *
 * The site is a static export with no backend, so anything the visitor
 * enters can only live in their own browser. Every access is guarded:
 * `localStorage` throws outright in some contexts (private windows with
 * site data blocked, embedded webviews), and it does not exist at all
 * during the prerender.
 *
 * Everything goes through `read`/`write` so that swapping in an API later
 * means changing this file, not the components.
 */

const PREFIX = "fwv";

export function storageKey(name: string, version = 1): string {
  return `${PREFIX}.${name}.v${version}`;
}

export function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt JSON or storage disabled — behave as if nothing was saved.
    return fallback;
  }
}

export function write<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or storage disabled. The UI keeps working from
    // in-memory state; only persistence is lost.
    return false;
  }
}

export function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing useful to do.
  }
}
