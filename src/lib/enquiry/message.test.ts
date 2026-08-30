import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildEnquiryMessage } from "./message.ts";
import { createWhatsAppUrl, isWhatsAppUrlSafe } from "./delivery.ts";
import { EMPTY_ENQUIRY, type EnquiryData } from "./types.ts";

const base = (over: Partial<EnquiryData> = {}): EnquiryData => ({
  ...EMPTY_ENQUIRY,
  name: "John Doe",
  phone: "+91 98765 43210",
  primaryGoal: "loss",
  ...over,
});

describe("buildEnquiryMessage", () => {
  test("includes the details that were provided", () => {
    const msg = buildEnquiryMessage(
      base({
        email: "john@example.com",
        age: 28,
        sex: "male",
        heightCm: 175,
        currentWeightKg: 85,
        targetWeightKg: 75,
        activity: "moderate",
        experience: "beginner",
      }),
    );
    assert.match(msg, /Name: John Doe/);
    assert.match(msg, /Mobile: \+91 98765 43210/);
    assert.match(msg, /Email: john@example\.com/);
    assert.match(msg, /Age: 28/);
    assert.match(msg, /Gender: Male/);
    assert.match(msg, /Height: 175 cm/);
    assert.match(msg, /Current weight: 85 kg/);
    assert.match(msg, /Target weight: 75 kg/);
    assert.match(msg, /Activity level: Moderately active/);
    assert.match(msg, /Experience: Beginner/);
    assert.match(msg, /Primary goal: Weight loss/);
  });

  test("omits fields that were left empty", () => {
    const msg = buildEnquiryMessage(base());
    assert.doesNotMatch(msg, /Email:/);
    assert.doesNotMatch(msg, /Age:/);
    assert.doesNotMatch(msg, /Target weight:/);
  });

  test("drops a whole section when nothing in it was filled in", () => {
    const msg = buildEnquiryMessage(base());
    assert.doesNotMatch(msg, /FITNESS PROFILE/);
    assert.doesNotMatch(msg, /CALCULATED TARGETS/);
    assert.doesNotMatch(msg, /SERVICES INTERESTED IN/);
    assert.doesNotMatch(msg, /ADDITIONAL MESSAGE/);
    // The sections that always have content are still present.
    assert.match(msg, /CLIENT DETAILS/);
    assert.match(msg, /GOAL/);
  });

  test("never emits undefined, null, NaN or Infinity", () => {
    const hostile = base({
      age: Number.NaN,
      heightCm: Number.POSITIVE_INFINITY,
      currentWeightKg: Number.NEGATIVE_INFINITY,
      // Deliberately bypassing the type to mimic corrupt stored data.
      targetWeightKg: undefined as unknown as number,
      targets: {
        calories: Number.NaN,
        proteinG: 150,
        carbsG: Number.NaN,
        fatG: 70,
      },
    });
    const msg = buildEnquiryMessage(hostile);
    assert.doesNotMatch(msg, /undefined|null|NaN|Infinity/);
    // The valid figures in that same block still come through.
    assert.match(msg, /Protein: 150 g/);
    assert.match(msg, /Fat: 70 g/);
  });

  test("renders imperial units when that is what the visitor used", () => {
    const msg = buildEnquiryMessage(
      base({ units: "imperial", heightCm: 180, currentWeightKg: 80 }),
    );
    assert.match(msg, /Height: 5 ft 10\.9 in/);
    assert.match(msg, /Current weight: 176\.4 lb/);
    assert.doesNotMatch(msg, /80 kg/);
  });

  test("names the plan whose button was clicked", () => {
    const msg = buildEnquiryMessage(base({ planName: "Foundation" }));
    assert.match(msg, /ENQUIRING ABOUT\nPlan: Foundation/);
  });

  test("omits the plan section when the enquiry did not start from a plan", () => {
    const msg = buildEnquiryMessage(base());
    assert.doesNotMatch(msg, /ENQUIRING ABOUT/);
    assert.doesNotMatch(msg, /Plan:/);
  });

  test("lists selected services by their real names", () => {
    const msg = buildEnquiryMessage(
      base({ services: ["online-coaching", "nutrition-guidance"] }),
    );
    assert.match(msg, /SERVICES INTERESTED IN/);
    assert.match(msg, /- Personal Online Coaching/);
    assert.match(msg, /- Nutrition Guidance/);
  });

  test("ignores service ids that no longer exist", () => {
    const msg = buildEnquiryMessage(
      base({ services: ["online-coaching", "deleted-service"] }),
    );
    assert.match(msg, /- Personal Online Coaching/);
    assert.doesNotMatch(msg, /deleted-service/);
  });

  test("includes calculated targets when they came from the calculators", () => {
    const msg = buildEnquiryMessage(
      base({ targets: { calories: 2100, proteinG: 150, carbsG: 220, fatG: 70 } }),
    );
    assert.match(msg, /CALCULATED TARGETS/);
    assert.match(msg, /Daily calories: 2,100 kcal/);
    assert.match(msg, /Carbohydrates: 220 g/);
  });

  test("carries the free-text message through verbatim", () => {
    const msg = buildEnquiryMessage(
      base({ additionalMessage: "  I train at 6am & need a plan.  " }),
    );
    assert.match(msg, /ADDITIONAL MESSAGE\nI train at 6am & need a plan\./);
  });
});

describe("createWhatsAppUrl", () => {
  test("encodes newlines so the structure survives", () => {
    const url = createWhatsAppUrl("918056115687", "line one\nline two");
    assert.match(url, /^https:\/\/wa\.me\/918056115687\?text=/);
    assert.match(url, /%0A/);
    assert.doesNotMatch(url, /\n/);
  });

  test("escapes characters that would otherwise break the query string", () => {
    const url = createWhatsAppUrl("918056115687", "a & b ? c # d + e");
    assert.doesNotMatch(url.split("?text=")[1], /[&?#]/);
  });

  test("strips punctuation from the phone number", () => {
    const url = createWhatsAppUrl("+91 805-611 5687", "hi");
    assert.match(url, /wa\.me\/918056115687\?/);
  });

  test("survives a round trip", () => {
    const message = buildEnquiryMessage(
      base({ additionalMessage: "50% bodyweight? #goals & more" }),
    );
    const url = createWhatsAppUrl("918056115687", message);
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    assert.equal(decoded, message);
  });

  test("flags a URL too long to be relied on", () => {
    const short = createWhatsAppUrl("918056115687", "hello");
    assert.equal(isWhatsAppUrlSafe(short), true);
    const long = createWhatsAppUrl("918056115687", "x".repeat(5000));
    assert.equal(isWhatsAppUrlSafe(long), false);
  });
});
