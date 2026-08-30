"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type {
  ActivityLevelId,
  GoalId,
  Sex,
  UnitSystem,
} from "./calculations/index.ts";
import { read, storageKey, write } from "./storage.ts";

/**
 * The measurements every calculator shares.
 *
 * Held once and reused across the dashboard so a visitor enters their
 * details a single time. Stored in metric regardless of the unit system on
 * screen — conversion happens at the input boundary only.
 *
 * Numbers are nullable because "not filled in yet" is a real state and must
 * not be confused with zero.
 */
export type Profile = {
  units: UnitSystem;
  sex: Sex;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  activity: ActivityLevelId;
  goal: GoalId;
};

export const EMPTY_PROFILE: Profile = {
  units: "metric",
  sex: "male",
  age: null,
  heightCm: null,
  weightKg: null,
  activity: "moderate",
  goal: "loss",
};

const KEY = storageKey("profile");

/**
 * A module-level store rather than React state.
 *
 * `localStorage` is external mutable state that does not exist during the
 * static prerender, which is precisely the case `useSyncExternalStore` was
 * added for: it serves `EMPTY_PROFILE` on the server, swaps to the stored
 * value after hydration, and does so without an effect that writes state.
 * Keeping it at module scope also means every calculator shares one
 * profile with no provider to thread through the tree.
 */
let snapshot: Profile | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Must return a referentially stable value or React will loop. */
function getSnapshot(): Profile {
  if (snapshot === null) snapshot = read<Profile>(KEY, EMPTY_PROFILE);
  return snapshot;
}

function getServerSnapshot(): Profile {
  return EMPTY_PROFILE;
}

function setProfile(next: Profile): void {
  snapshot = next;
  write(KEY, next);
  for (const listener of listeners) listener();
}

export function useProfile() {
  const profile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // False during the prerender and the first client render, true once
  // hydrated — the same signal, without a second store.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile({ ...getSnapshot(), ...patch });
  }, []);

  const reset = useCallback(() => setProfile(EMPTY_PROFILE), []);

  return useMemo(
    () => ({
      profile,
      update,
      reset,
      hydrated,
      isComplete:
        profile.age !== null &&
        profile.heightCm !== null &&
        profile.weightKg !== null,
    }),
    [profile, update, reset, hydrated],
  );
}
