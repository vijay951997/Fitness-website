/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE TO CHANGE THE WEBSITE.
 *  Almost every piece of text, price and link on the site lives
 *  here. You should rarely need to touch anything else.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Fit with Vijay",
  legalName: "Certified Personal Trainer Vijay",
  tagline: "Coaching that rebuilds the body, not just the physique",
  description:
    "Certified personal trainer in Chennai offering online coaching, prehab & rehab programming, and personalised nutrition. Posture correction, fat loss, body recomposition and injury recovery.",
  // Live URL — used for SEO tags, the sitemap and social preview links.
  // Change this (and basePath in next.config.ts) if you buy a domain.
  url: "https://vijay951997.github.io/Fitness-website",
  city: "Chennai",
  region: "Tamil Nadu",
  country: "India",
  addressLine: "250, Airport Colony, Heritage Jayendra Nagar, Sembakkam",
  postalCode: "600064",
  geo: { lat: 12.935649, lng: 80.165311 },
  hours: "Open 24 hours",
  rating: { value: "5.0", count: 12 }, // ← update count as reviews come in
  googleMapsUrl: "https://maps.app.goo.gl/GWVgmtLmCtpgyiLs5",
  email: "vijayakumar.d9597@gmail.com",
} as const;

/** WhatsApp — the primary call to action across the whole site. */
export const whatsapp = {
  number: "918056115687", // country code + number, digits only
  display: "+91 80561 15687",
  defaultMessage:
    "Hi Vijay, I found your website. I'd like to know more about your coaching programs.",
} as const;

export function waLink(message: string = whatsapp.defaultMessage) {
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** The detailed intake form you already use. */
export const enquiryFormUrl = "https://whatsform.com/1donJn";

export const nav = [
  { label: "About", href: "#about" },
  { label: "Coaching", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "Plans", href: "#plans" },
  { label: "FAQ", href: "#faq" },
] as const;

export const services = [
  {
    id: "online-coaching",
    eyebrow: "01",
    title: "Online Coaching",
    summary:
      "A programme built around your body, your schedule and the equipment you actually have — reviewed and adjusted every week.",
    points: [
      "Custom training plan updated week to week",
      "Video form checks on your main lifts",
      "Weekly check-in call and progress review",
      "Direct WhatsApp access between sessions",
    ],
    forWhom: "Best for working professionals training in a gym or at home.",
  },
  {
    id: "prehab-rehab",
    eyebrow: "02",
    title: "Prehab & Rehab",
    summary:
      "Corrective work for the aches that stop you training. We restore the movement first, then load it — so the problem stops coming back.",
    points: [
      "Movement and posture assessment",
      "Targeted corrective work for the weak link",
      "Safe return-to-lifting progression",
      "Desk-posture and daily-habit coaching",
    ],
    forWhom:
      "Best for back, shoulder, knee and neck niggles, and anyone returning after an injury.",
  },
  {
    id: "nutrition",
    eyebrow: "03",
    title: "Diet & Nutrition",
    summary:
      "A plan built from the food you already eat — South Indian meals, home cooking, eating out — not a list of things you'll quit in two weeks.",
    points: [
      "Calorie and macro targets set to your goal",
      "Meal structure around real Indian food",
      "Practical guidance for travel and eating out",
      "Adjusted as your weight and energy respond",
    ],
    forWhom: "Best for fat loss, body recomposition and sustainable habits.",
  },
] as const;

/** Goals — taken from your existing enquiry form. */
export const goals = [
  "Posture correction",
  "Fat loss",
  "Weight loss",
  "Body recomposition",
  "Injury prevention",
  "Injury recovery",
  "Strength & conditioning",
  "Six-pack / definition",
] as const;

export const process = [
  {
    step: "01",
    title: "Enquiry",
    body: "You send a message on WhatsApp or fill the detailed intake form. It takes about three minutes.",
  },
  {
    step: "02",
    title: "Assessment call",
    body: "We talk through your goal, training history, injuries, medical conditions and how much time you realistically have.",
  },
  {
    step: "03",
    title: "Your plan",
    body: "You receive a training programme and nutrition plan built specifically for you — not a template with your name on it.",
  },
  {
    step: "04",
    title: "Weekly coaching",
    body: "We review the week, check your form, adjust the load and keep going. The plan changes as you do.",
  },
] as const;

/**
 * Price bands mirror the ones on your enquiry form.
 * Adjust the numbers and inclusions freely.
 */
export const plans = [
  {
    id: "foundation",
    name: "Foundation",
    price: "₹4,000 – 5,000",
    cadence: "per month",
    blurb: "Structured training, self-managed.",
    features: [
      "Custom monthly training plan",
      "Exercise video library",
      "Monthly plan update",
      "WhatsApp support",
    ],
    featured: false,
  },
  {
    id: "coaching",
    name: "Coaching",
    price: "₹5,000 – 9,000",
    cadence: "per month",
    blurb: "Training plus nutrition, coached weekly.",
    features: [
      "Everything in Foundation",
      "Personalised nutrition plan",
      "Weekly check-in call",
      "Video form checks",
      "Prehab work built in",
    ],
    featured: true,
  },
  {
    id: "transformation",
    name: "Transformation",
    price: "₹10,000+",
    cadence: "per month",
    blurb: "Close, high-touch coaching for a defined outcome.",
    features: [
      "Everything in Coaching",
      "Full movement & posture assessment",
      "Dedicated rehab programming",
      "Twice-weekly check-ins",
      "Priority WhatsApp access",
    ],
    featured: false,
  },
] as const;

/**
 * ⚠️ REPLACE THESE WITH REAL CLIENT REVIEWS BEFORE GOING LIVE.
 * Use quotes from your Google reviews or ask clients for permission.
 * Set this to an empty array [] and the section disappears.
 */
export type Testimonial = { quote: string; name: string; detail: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Add a real client quote here. Copying one from your Google reviews is the easiest place to start.",
    name: "Client name",
    detail: "Goal · duration coached",
  },
  {
    quote:
      "A second real quote. Reviews that mention a specific result convert far better than general praise.",
    name: "Client name",
    detail: "Goal · duration coached",
  },
  {
    quote:
      "A third real quote. Ask clients to mention what changed for them week to week.",
    name: "Client name",
    detail: "Goal · duration coached",
  },
];

export const faqs = [
  {
    q: "Do I need a gym membership?",
    a: "No. Plans are built around whatever you have access to — a full gym, a small apartment gym, or a pair of dumbbells at home. Tell me what you have and the programme is written for it.",
  },
  {
    q: "I have an old injury. Can I still train?",
    a: "In most cases, yes — and training is often part of the fix. We start with an assessment, work around the injury, and rebuild strength in that area gradually. If something needs a doctor or physiotherapist first, I'll tell you honestly.",
  },
  {
    q: "How is online coaching different from a gym trainer?",
    a: "You get a plan built for your body and reviewed every single week, rather than whatever the floor trainer has time for. Form is checked over video, and you can message between sessions. It also costs considerably less than daily in-person sessions.",
  },
  {
    q: "Will I have to give up rice and Indian food?",
    a: "No. The nutrition plan is built around what you already eat. Rice, dosa, home-cooked meals and the occasional dinner out all fit — the structure and quantities change, not your entire culture of eating.",
  },
  {
    q: "How soon will I see results?",
    a: "Most clients feel stronger and move better within three to four weeks. Visible physical change typically shows from around eight to twelve weeks, depending on your starting point and how consistent you are.",
  },
  {
    q: "How do I get started?",
    a: "Message me on WhatsApp, or fill the enquiry form. We'll set up a short call to talk through your goal before you commit to anything.",
  },
] as const;

export const social = {
  instagram: "", // e.g. "https://instagram.com/yourhandle"
  youtube: "",
} as const;
