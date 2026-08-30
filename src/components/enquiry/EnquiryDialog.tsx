"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACTIVITY_LEVELS,
  calculateCalorieTarget,
  calculateMacros,
  kgToLb,
  lbToKg,
  round,
  cmToFeetInches,
  feetInchesToCm,
  type ActivityLevelId,
  type Sex,
} from "@/lib/calculations";
import {
  CONTACT_METHODS,
  EMPTY_ENQUIRY,
  EXPERIENCE_LEVELS,
  MAX_MESSAGE_LENGTH,
  PRIMARY_GOALS,
  buildEnquiryMessage,
  createWhatsAppUrl,
  errorFor,
  isWhatsAppUrlSafe,
  validateEnquiry,
  type ContactMethodId,
  type EnquiryData,
  type ExperienceId,
  type PrimaryGoalId,
} from "@/lib/enquiry";
import { useProfile } from "@/lib/profile";
import { read, remove, storageKey, write } from "@/lib/storage";
import { whatsapp } from "@/config/site";
import { WhatsAppIcon, cx } from "../ui";
import {
  Field,
  NumberInput,
  Segmented,
  TextArea,
  TextInput,
  useFieldId,
} from "../tools/controls";
import { EnquirySummary } from "./EnquirySummary";
import { ServiceSelector } from "./ServiceSelector";
import { closeEnquiry, useEnquiryDialog, type EnquiryContext } from "./store";

const DRAFT_KEY = storageKey("enquiry-draft");

/** Only the parts of a draft worth restoring — never the derived targets. */
type Draft = Omit<EnquiryData, "targets">;

const STEPS = ["Your details", "Your goal", "Review"] as const;

/**
 * Seeds the form from the visitor's calculator profile, then lets a saved
 * draft override it. Numbers stay metric internally; only the inputs
 * convert, exactly as the calculators do.
 */
function initialData(
  profile: ReturnType<typeof useProfile>["profile"],
  isComplete: boolean,
  preselectedService?: string,
): EnquiryData {
  let targets: EnquiryData["targets"] = null;

  if (isComplete) {
    const target = calculateCalorieTarget({
      sex: profile.sex,
      age: profile.age as number,
      weightKg: profile.weightKg as number,
      heightCm: profile.heightCm as number,
      activity: profile.activity,
      goal: profile.goal,
    });
    if (target.ok) {
      const macros = calculateMacros({
        calories: target.data.targetCalories,
        weightKg: profile.weightKg as number,
        goal: profile.goal,
      });
      if (macros.ok) {
        targets = {
          calories: target.data.targetCalories,
          proteinG: macros.data.protein.grams,
          carbsG: macros.data.carbs.grams,
          fatG: macros.data.fat.grams,
        };
      }
    }
  }

  // `sex`, `activity` and `goal` have defaults in the profile rather than
  // being nullable, so an untouched profile would hand us "male",
  // "moderate" and "loss" and the message would assert them as the
  // visitor's answers. Only carry them across once there is evidence the
  // calculators were actually used.
  const usedCalculators =
    profile.age !== null ||
    profile.heightCm !== null ||
    profile.weightKg !== null;

  const seeded: EnquiryData = {
    ...EMPTY_ENQUIRY,
    age: profile.age,
    sex: usedCalculators ? profile.sex : null,
    heightCm: profile.heightCm,
    currentWeightKg: profile.weightKg,
    targetWeightKg: profile.targetWeightKg,
    activity: usedCalculators ? profile.activity : null,
    primaryGoal: usedCalculators ? profile.goal : null,
    units: profile.units,
    targets,
    services: preselectedService ? [preselectedService] : [],
  };

  const draft = read<Partial<Draft> | null>(DRAFT_KEY, null);
  if (!draft) return seeded;

  // A saved draft wins for anything the visitor actually typed, but the
  // freshly computed targets always win — a stale calorie figure would be
  // worse than none.
  return {
    ...seeded,
    ...draft,
    targets,
    services:
      preselectedService && !draft.services?.includes(preselectedService)
        ? [...(draft.services ?? []), preselectedService]
        : (draft.services ?? seeded.services),
  };
}

/**
 * Mount gate.
 *
 * The inner component is mounted only while the dialog is open, so its
 * `useState` initialisers seed the form fresh on every open. That replaces
 * an effect that wrote state on the `open` transition, which React 19
 * rightly flags as cascading renders.
 */
export function EnquiryDialog() {
  const { open, context, openId } = useEnquiryDialog();
  if (!open) return null;
  return <EnquiryDialogInner key={openId} context={context} />;
}

function EnquiryDialogInner({ context }: { context: EnquiryContext }) {
  const { profile, isComplete } = useProfile();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Seeded once, at mount: profile values pre-fill the form, a saved draft
  // overrides them, and later profile edits must not clobber typing.
  const [data, setData] = useState<EnquiryData>(() =>
    initialData(profile, isComplete, context.serviceId),
  );
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = validateEnquiry(data);
  const err = (field: string) =>
    showErrors ? errorFor(errors, field) : null;

  const set = useCallback(
    (patch: Partial<EnquiryData>) => setData((d) => ({ ...d, ...patch })),
    [],
  );

  // Drive the native modal, and own every route out of it.
  //
  // Dismissal is deliberately driven by React state rather than the
  // dialog's own `close` event: that event does not bubble, so React's
  // onClose never sees it, and some Chromium builds do not dispatch it at
  // all. Unmounting removes the element, which is unambiguous everywhere.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";

    // Escape: intercept before the browser dismisses the element itself,
    // so the store and the DOM can never disagree about what is open.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeEnquiry();
      }
    };
    // Belt and braces for browsers that route Escape through `cancel`.
    const onCancel = (event: Event) => {
      event.preventDefault();
      closeEnquiry();
    };
    // Clicking the backdrop lands on the dialog element itself, since the
    // visible panel is an inner div.
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) closeEnquiry();
    };

    dialog.addEventListener("keydown", onKeyDown);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);

    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onClick);
      document.body.style.overflow = "";
    };
  }, []);

  // Persist a draft so an accidental close does not lose everything.
  useEffect(() => {
    if (sent) return;
    write(DRAFT_KEY, { ...data, targets: undefined });
  }, [data, sent]);

  const message = buildEnquiryMessage(data);
  const url = createWhatsAppUrl(whatsapp.number, message);
  const tooLong = !isWhatsAppUrlSafe(url);

  function next() {
    // Step 0 gates on the personal fields; step 1 on the goal.
    const stepFields =
      step === 0 ? ["name", "phone", "email"] : ["primaryGoal"];
    const blocking = errors.filter((e) => stepFields.includes(e.field));
    if (blocking.length > 0) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function send() {
    if (errors.length > 0) {
      setShowErrors(true);
      return;
    }
    setSent(true);
    remove(DRAFT_KEY); // clear personal details once submitted
    window.open(url, "_blank", "noopener,noreferrer");
    closeEnquiry();
  }

  /* ── Unit-aware inputs ─────────────────────────────────── */
  const imperial = data.units === "imperial";
  const weightUnit = imperial ? "lb" : "kg";
  const showWeight = (kg: number | null) =>
    kg === null ? "" : String(imperial ? round(kgToLb(kg), 1) : round(kg, 1));
  const parseWeight = (raw: string): number | null => {
    if (raw.trim() === "") return null;
    const n = Number.parseFloat(raw);
    if (Number.isNaN(n)) return null;
    return imperial ? lbToKg(n) : n;
  };
  const { feet, inches } = data.heightCm
    ? cmToFeetInches(data.heightCm)
    : { feet: 0, inches: 0 };

  const nameId = useFieldId("enq-name");
  const phoneId = useFieldId("enq-phone");
  const emailId = useFieldId("enq-email");
  const ageId = useFieldId("enq-age");
  const heightId = useFieldId("enq-height");
  const weightId = useFieldId("enq-weight");
  const targetId = useFieldId("enq-target");
  const msgId = useFieldId("enq-msg");

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="enquiry-title"
      className="m-auto w-[min(46rem,calc(100vw-1.5rem))] bg-transparent p-0 text-bone-50 backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[min(85vh,52rem)] flex-col border border-bone-50/15 bg-ink-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-bone-50/12 p-5 sm:p-6">
          <div>
            <h2 id="enquiry-title" className="display text-2xl sm:text-3xl">
              Start your enquiry
            </h2>
            <p className="label mt-2 text-bone-500">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => closeEnquiry()}
            aria-label="Close enquiry form"
            className="flex size-10 shrink-0 items-center justify-center border border-bone-50/20 text-bone-300 transition-colors hover:border-lime-400 hover:text-lime-400"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-px bg-bone-50/10" aria-hidden>
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cx(
                "h-1 flex-1",
                i <= step ? "bg-lime-400" : "bg-ink-700",
              )}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {step === 0 && (
            <div className="grid gap-6">
              <Field label="Full name" htmlFor={nameId} error={err("name")}>
                <TextInput
                  id={nameId}
                  value={data.name}
                  onChange={(name) => set({ name })}
                  placeholder="Your name"
                  autoComplete="name"
                  invalid={Boolean(err("name"))}
                  maxLength={80}
                />
              </Field>

              <Field
                label="Mobile number"
                htmlFor={phoneId}
                error={err("phone")}
                hint="Include your country code if you are outside India."
              >
                <TextInput
                  id={phoneId}
                  type="tel"
                  inputMode="tel"
                  value={data.phone}
                  onChange={(phone) => set({ phone })}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  invalid={Boolean(err("phone"))}
                  maxLength={20}
                />
              </Field>

              <Field
                label="Email"
                htmlFor={emailId}
                error={err("email")}
                hint={
                  data.contactMethod === "email"
                    ? undefined
                    : "Optional unless you would rather be emailed."
                }
              >
                <TextInput
                  id={emailId}
                  type="email"
                  inputMode="email"
                  value={data.email}
                  onChange={(email) => set({ email })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  invalid={Boolean(err("email"))}
                  maxLength={254}
                />
              </Field>

              <Segmented<ContactMethodId>
                legend="How should Vijay reply?"
                value={data.contactMethod}
                onChange={(contactMethod) => set({ contactMethod })}
                columns={3}
                options={CONTACT_METHODS.map((m) => ({
                  id: m.id,
                  label: m.label,
                }))}
              />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6">
              <div>
                <Segmented<PrimaryGoalId>
                  legend="Main goal"
                  value={data.primaryGoal ?? ("" as PrimaryGoalId)}
                  onChange={(primaryGoal) => set({ primaryGoal })}
                  columns={3}
                  options={PRIMARY_GOALS.map((g) => ({
                    id: g.id,
                    label: g.label,
                  }))}
                />
                {err("primaryGoal") && (
                  <p role="alert" className="mt-2 flex gap-1.5 text-sm text-lime-400">
                    <span aria-hidden>!</span>
                    {err("primaryGoal")}
                  </p>
                )}
              </div>

              <Segmented<ExperienceId>
                legend="Training experience"
                value={data.experience ?? ("" as ExperienceId)}
                onChange={(experience) => set({ experience })}
                columns={3}
                options={EXPERIENCE_LEVELS.map((e) => ({
                  id: e.id,
                  label: e.label,
                  description: e.description,
                }))}
              />

              <ServiceSelector
                selected={data.services}
                onChange={(services) => set({ services })}
              />

              <details className="border border-bone-50/20" open={!isComplete}>
                <summary className="label cursor-pointer p-4 text-bone-300 [&::-webkit-details-marker]:hidden">
                  Fitness details{" "}
                  {isComplete && (
                    <span className="text-lime-400">
                      — filled in from your calculator
                    </span>
                  )}
                </summary>

                <div className="grid gap-5 border-t border-bone-50/12 p-4 sm:grid-cols-2">
                  <Field label="Age" htmlFor={ageId} error={err("age")}>
                    <NumberInput
                      id={ageId}
                      value={data.age === null ? "" : String(data.age)}
                      onChange={(raw) => {
                        const n = Number.parseFloat(raw);
                        set({
                          age: raw.trim() === "" || Number.isNaN(n) ? null : n,
                        });
                      }}
                      placeholder="30"
                      suffix="yrs"
                      invalid={Boolean(err("age"))}
                    />
                  </Field>

                  <Segmented<Sex>
                    legend="Gender"
                    value={data.sex ?? ("" as Sex)}
                    onChange={(sex) => set({ sex })}
                    options={[
                      { id: "male", label: "Male" },
                      { id: "female", label: "Female" },
                    ]}
                  />

                  {imperial ? (
                    <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                      <Field label="Height" error={err("heightCm")}>
                        <NumberInput
                          ariaLabel="Height in feet"
                          value={feet ? String(feet) : ""}
                          onChange={(raw) =>
                            set({
                              heightCm: round(
                                feetInchesToCm(
                                  Number.parseFloat(raw) || 0,
                                  inches,
                                ),
                                1,
                              ),
                            })
                          }
                          placeholder="5"
                          suffix="ft"
                        />
                      </Field>
                      <Field label="&nbsp;">
                        <NumberInput
                          ariaLabel="Height in inches"
                          value={inches ? String(inches) : ""}
                          onChange={(raw) =>
                            set({
                              heightCm: round(
                                feetInchesToCm(
                                  feet,
                                  Number.parseFloat(raw) || 0,
                                ),
                                1,
                              ),
                            })
                          }
                          placeholder="10"
                          suffix="in"
                        />
                      </Field>
                    </div>
                  ) : (
                    <Field
                      label="Height"
                      htmlFor={heightId}
                      error={err("heightCm")}
                    >
                      <NumberInput
                        id={heightId}
                        value={
                          data.heightCm === null ? "" : String(data.heightCm)
                        }
                        onChange={(raw) => {
                          const n = Number.parseFloat(raw);
                          set({
                            heightCm:
                              raw.trim() === "" || Number.isNaN(n) ? null : n,
                          });
                        }}
                        placeholder="175"
                        suffix="cm"
                        invalid={Boolean(err("heightCm"))}
                      />
                    </Field>
                  )}

                  <Field
                    label="Current weight"
                    htmlFor={weightId}
                    error={err("currentWeightKg")}
                  >
                    <NumberInput
                      id={weightId}
                      value={showWeight(data.currentWeightKg)}
                      onChange={(raw) =>
                        set({ currentWeightKg: parseWeight(raw) })
                      }
                      placeholder={imperial ? "185" : "85"}
                      suffix={weightUnit}
                      invalid={Boolean(err("currentWeightKg"))}
                    />
                  </Field>

                  <Field
                    label="Target weight"
                    htmlFor={targetId}
                    error={err("targetWeightKg")}
                  >
                    <NumberInput
                      id={targetId}
                      value={showWeight(data.targetWeightKg)}
                      onChange={(raw) =>
                        set({ targetWeightKg: parseWeight(raw) })
                      }
                      placeholder={imperial ? "165" : "75"}
                      suffix={weightUnit}
                      invalid={Boolean(err("targetWeightKg"))}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Segmented<ActivityLevelId>
                      legend="Activity level"
                      value={data.activity ?? ("" as ActivityLevelId)}
                      onChange={(activity) => set({ activity })}
                      columns={5}
                      options={ACTIVITY_LEVELS.map((a) => ({
                        id: a.id,
                        label: a.label.replace(" active", ""),
                        description: a.description,
                      }))}
                    />
                  </div>
                </div>
              </details>

              <Field
                label="Anything else?"
                htmlFor={msgId}
                error={err("additionalMessage")}
                hint={`Optional — ${MAX_MESSAGE_LENGTH - data.additionalMessage.length} characters left.`}
              >
                <TextArea
                  id={msgId}
                  value={data.additionalMessage}
                  onChange={(additionalMessage) => set({ additionalMessage })}
                  placeholder="Tell Vijay more about your goal, injuries, or schedule."
                  maxLength={MAX_MESSAGE_LENGTH}
                  invalid={Boolean(err("additionalMessage"))}
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <EnquirySummary data={data} />

              {showErrors && errors.length > 0 && (
                <ul
                  role="alert"
                  className="border border-lime-400/40 bg-lime-400/10 p-4 text-sm text-lime-400"
                >
                  {errors.map((e) => (
                    <li key={e.field + e.message} className="flex gap-2">
                      <span aria-hidden>!</span>
                      {e.message}
                    </li>
                  ))}
                </ul>
              )}

              {tooLong && (
                <p role="alert" className="text-sm text-lime-400">
                  That message is too long to send reliably through WhatsApp.
                  Please shorten the &ldquo;anything else&rdquo; note.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-bone-50/12 p-5 sm:p-6">
          {step === STEPS.length - 1 && (
            <p className="mb-4 text-xs leading-relaxed text-bone-500">
              By sending this enquiry you agree to be contacted about your
              fitness enquiry. Your details are sent directly to Vijay over
              WhatsApp and are not stored on any server.
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="label bg-lime-400 px-6 py-3.5 text-ink-950 transition-colors hover:bg-lime-500 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime-400"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={send}
                disabled={tooLong}
                className="label inline-flex items-center justify-center gap-2.5 bg-lime-400 px-6 py-3.5 text-ink-950 transition-colors hover:bg-lime-500 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <WhatsAppIcon />
                Send enquiry
              </button>
            )}

            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowErrors(false);
                  setStep((s) => s - 1);
                }}
                className="label border border-bone-50/25 px-6 py-3.5 text-bone-50 transition-colors hover:border-lime-400 hover:text-lime-400"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
