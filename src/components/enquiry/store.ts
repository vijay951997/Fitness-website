"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Open/close state for the enquiry dialog.
 *
 * A module-level store rather than context, matching `src/lib/profile.tsx`:
 * the dialog is mounted once at the page root, but the buttons that open it
 * are scattered across the header, hero, plans, services and contact
 * sections. A store means none of them need a provider threaded through.
 */

export type EnquiryContext = {
  /** Preselects a service, when opened from a specific service card. */
  serviceId?: string;
  /** Named plan, when opened from the pricing table. */
  planName?: string;
  /** Where the enquiry started, for the trainer's context. */
  source?: string;
};

type State = { open: boolean; context: EnquiryContext; openId: number };

const CLOSED: State = { open: false, context: {}, openId: 0 };

let state: State = CLOSED;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return CLOSED;
}

export function openEnquiry(context: EnquiryContext = {}): void {
  // A fresh id every time: the dialog is keyed on it, so each open mounts
  // a clean form even if the previous one was dismissed unusually.
  state = { open: true, context, openId: state.openId + 1 };
  emit();
}

export function closeEnquiry(): void {
  // Idempotent, and keeps the snapshot identity stable when already closed
  // so getSnapshot never hands React a new object on every call.
  if (!state.open) return;
  state = { ...CLOSED, openId: state.openId };
  emit();
}

export function useEnquiryDialog() {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const close = useCallback(() => closeEnquiry(), []);
  return { ...current, close };
}
