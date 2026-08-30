import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  errorFor,
  isValidEmail,
  isValidPhone,
  validateEnquiry,
} from "./validate.ts";
import { EMPTY_ENQUIRY, type EnquiryData } from "./types.ts";

const valid = (over: Partial<EnquiryData> = {}): EnquiryData => ({
  ...EMPTY_ENQUIRY,
  name: "John Doe",
  phone: "9876543210",
  primaryGoal: "loss",
  ...over,
});

describe("isValidPhone", () => {
  test("accepts the formats people actually type", () => {
    for (const n of [
      "9876543210",
      "+91 98765 43210",
      "+91-98765-43210",
      "(044) 2345 6789",
    ]) {
      assert.equal(isValidPhone(n), true, n);
    }
  });

  test("rejects too few or too many digits", () => {
    assert.equal(isValidPhone("123"), false);
    assert.equal(isValidPhone("1234567890123456789"), false);
    assert.equal(isValidPhone(""), false);
    assert.equal(isValidPhone("not a number"), false);
  });
});

describe("isValidEmail", () => {
  test("accepts ordinary addresses", () => {
    assert.equal(isValidEmail("john@example.com"), true);
    assert.equal(isValidEmail("a.b+tag@sub.example.co.in"), true);
  });

  test("rejects malformed ones", () => {
    for (const e of ["john", "john@", "@example.com", "john@example", "a b@c.com"]) {
      assert.equal(isValidEmail(e), false, e);
    }
  });
});

describe("validateEnquiry", () => {
  test("passes with the minimum required set", () => {
    assert.deepEqual(validateEnquiry(valid()), []);
  });

  test("requires a name, phone and goal", () => {
    const errors = validateEnquiry({
      ...EMPTY_ENQUIRY,
      name: "",
      phone: "",
      primaryGoal: null,
    });
    assert.ok(errorFor(errors, "name"));
    assert.ok(errorFor(errors, "phone"));
    assert.ok(errorFor(errors, "primaryGoal"));
  });

  test("email is optional by default", () => {
    assert.deepEqual(validateEnquiry(valid({ email: "" })), []);
  });

  test("email becomes required when it is the preferred contact", () => {
    const errors = validateEnquiry(valid({ contactMethod: "email", email: "" }));
    assert.ok(errorFor(errors, "email"));
  });

  test("a filled-in email is still checked even when optional", () => {
    const errors = validateEnquiry(valid({ email: "nope" }));
    assert.ok(errorFor(errors, "email"));
  });

  test("optional measurements may be absent", () => {
    assert.deepEqual(
      validateEnquiry(valid({ age: null, heightCm: null, currentWeightKg: null })),
      [],
    );
  });

  test("rejects measurements outside a plausible range", () => {
    assert.ok(errorFor(validateEnquiry(valid({ age: 4 })), "age"));
    assert.ok(errorFor(validateEnquiry(valid({ age: 130 })), "age"));
    assert.ok(errorFor(validateEnquiry(valid({ heightCm: 40 })), "heightCm"));
    assert.ok(
      errorFor(validateEnquiry(valid({ currentWeightKg: 0 })), "currentWeightKg"),
    );
    assert.ok(
      errorFor(validateEnquiry(valid({ targetWeightKg: 500 })), "targetWeightKg"),
    );
  });

  test("rejects a non-finite measurement", () => {
    assert.ok(errorFor(validateEnquiry(valid({ age: Number.NaN })), "age"));
  });

  test("caps the free-text message", () => {
    const errors = validateEnquiry(
      valid({ additionalMessage: "x".repeat(1001) }),
    );
    assert.ok(errorFor(errors, "additionalMessage"));
  });
});
