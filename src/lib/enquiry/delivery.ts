/**
 * Delivery: turning a built message into a WhatsApp URL.
 *
 * Kept out of the components so URL construction is tested once rather
 * than repeated at every call site.
 */

import { whatsapp } from "../../config/site.ts";
import { buildEnquiryMessage } from "./message.ts";
import type { EnquiryData } from "./types.ts";

/**
 * wa.me tolerates long text, but browsers and some in-app webviews start
 * truncating or refusing very long URLs. The form caps the free-text field
 * well below this; the guard is here so a future caller cannot silently
 * produce a link that fails to open.
 */
export const MAX_WHATSAPP_URL_LENGTH = 4000;

/**
 * Builds a wa.me link.
 *
 * `encodeURIComponent` handles the whole payload: newlines become %0A so
 * the structure survives, and every character a visitor might type —
 * ampersands, hashes, emoji, quotes — is escaped rather than breaking out
 * of the query string.
 */
export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** True when the resulting link is short enough to be relied on. */
export function isWhatsAppUrlSafe(url: string): boolean {
  return url.length <= MAX_WHATSAPP_URL_LENGTH;
}

/** The whole pipeline: enquiry data in, openable link out. */
export function createEnquiryUrl(data: EnquiryData): string {
  return createWhatsAppUrl(whatsapp.number, buildEnquiryMessage(data));
}
