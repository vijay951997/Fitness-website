"use client";

import { buildEnquiryMessage, type EnquiryData } from "@/lib/enquiry";

/**
 * The review step.
 *
 * Shows the actual text that will be sent rather than a prettified
 * restatement of the form. What you read here is exactly what lands in
 * WhatsApp, which is the honest thing to show before someone sends their
 * personal details to a stranger.
 */
export function EnquirySummary({ data }: { data: EnquiryData }) {
  const message = buildEnquiryMessage(data);

  return (
    <div>
      <p className="label text-bone-500">Your message</p>
      <p className="mt-2 text-sm leading-relaxed text-bone-400">
        This is exactly what will be sent. WhatsApp opens with it ready — you
        can still edit it there before pressing send.
      </p>

      <pre className="mt-4 max-h-[40vh] overflow-y-auto border border-bone-50/20 bg-ink-950 p-4 text-xs leading-relaxed whitespace-pre-wrap text-bone-100">
        {message}
      </pre>
    </div>
  );
}
