/**
 * Enquiry module.
 *
 * Data model, validation, message building and delivery for the structured
 * enquiry form. Contains no React — the UI in `src/components/enquiry`
 * consumes this, never the other way round.
 */

export * from "./types.ts";
export * from "./validate.ts";
export * from "./targets.ts";
export * from "./message.ts";
export * from "./delivery.ts";
