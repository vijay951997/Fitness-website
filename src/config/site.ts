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
  { label: "Calculator", href: "#calculator" },
  { label: "Tools", href: "#dashboard" },
] as const;

export const services = [
  
{
id: "online-coaching",

eyebrow: "01",

title: "Personal Online Coaching",

summary:
  "Personalised one-on-one coaching built around your goals, lifestyle, schedule and the equipment you actually have access to. Every programme is structured to help you train with purpose, progress safely and stay consistent.",

points: [
  "Personalised training programme based on your goals",
  "Choose 2, 3 or 5 one-on-one coaching sessions per week",
  "Live exercise guidance and technique correction",
  "Training adapted to your gym, home or available equipment",
  "Regular progress tracking and performance reviews",
  "Programme adjustments as your strength and fitness improve",
  "WhatsApp support for questions and guidance between sessions",
  "Clear structure, accountability and long-term progression",
],

forWhom:
  "Best for beginners, busy professionals and anyone who wants structured, personalised coaching with regular accountability.",


},



{
id: "post-rehab-strength",

eyebrow: "02",

title: "Post-Rehab Strength Coaching",

summary:
  "Completed your initial physiotherapy but not yet confident about returning to regular training? This structured Phase 2 approach helps you gradually rebuild strength, stability, movement capacity and confidence before progressing back into normal exercise.",

points: [
  "Structured Phase 2 strength progression after initial physiotherapy",
  "Training designed around your current capacity and limitations",
  "Movement, mobility and stability-focused exercises",
  "Progressive strengthening of previously affected areas",
  "Exercise technique and movement quality guidance",
  "Gradual and structured return to gym or regular training",
  "Progressive load management based on your response to training",
  "Regular assessment and programme adjustments",
  "Coordination with your physiotherapy recommendations where appropriate",
],

forWhom:
  "Best for people who have completed their initial physiotherapy, have appropriate clearance to exercise and want structured guidance to rebuild strength and confidently return to training.",

disclaimer:
  "**Important:** Post-rehab strength coaching is not a replacement for medical care or physiotherapy. Coaching begins after the initial rehabilitation phase and appropriate clearance from your healthcare professional. If your condition requires further clinical assessment or treatment, you will be advised to consult your physiotherapist or doctor.",


},



{
id: "nutrition-guidance",

eyebrow: "03",

title: "Nutrition Guidance",

summary:
  "Practical nutrition guidance built around the food and lifestyle you already have. No extreme diets and no unnecessary restrictions — just a structured approach that supports your training, health and fitness goals.",

points: [
  "Nutrition guidance based on your individual fitness goal",
  "Practical meal structure using familiar Indian foods",
  "Rice, dosa, idli and home-cooked meals can all fit",
  "Portion awareness and calorie guidance",
  "Protein and macronutrient recommendations",
  "Strategies for eating out, travel and social occasions",
  "Guidance adjusted based on your progress and consistency",
  "Focus on sustainable habits rather than short-term dieting",
],

forWhom:
  "Best for fat loss, muscle building, body recomposition and anyone looking to build a healthier and more sustainable relationship with food.",


},



{
id: "fitness-consultation",

eyebrow: "04",

title: "Fitness Consultation",

summary:
  "Not sure where to start? Begin with a one-on-one consultation to understand your goals, assess your current routine and get clear guidance on the right next steps for your fitness journey.",

points: [
  "One-on-one consultation and goal discussion",
  "Review of your current fitness routine and lifestyle",
  "Discussion about your training history and experience",
  "Guidance based on your available time and equipment",
  "Discussion of previous injuries or training limitations",
  "Practical recommendations for your next steps",
  "Answers to your fitness and training questions",
  "Guidance on choosing the right coaching plan",
],

forWhom:
  "Best for anyone who wants professional guidance, clarity and a structured starting point before committing to regular coaching.",


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
body: "Send me a message on WhatsApp or fill out the enquiry form. Tell me a little about your goal, and we'll take it from there.",
},
{
step: "02",
title: "Consultation",
body: "We'll talk through your goals, training history, current fitness level, injuries or limitations, available equipment and how much time you can realistically commit.",
},
{
step: "03",
title: "Choose your coaching",
body: "Based on your goals and the level of support you need, we'll choose the right plan — from basic guidance to two, three or five one-on-one coaching sessions per week.",
},
{
step: "04",
title: "Your personalised plan",
body: "You receive a training programme built around you — your goal, schedule, fitness level and available equipment. Where included in your coaching plan, nutrition guidance is tailored to your lifestyle too.",
},
{
step: "05",
title: "Start training",
body: "Your coaching begins with structured sessions, form guidance and a clear plan to follow. No generic templates — everything is adjusted to your progress.",
},
{
step: "06",
title: "Track. Adjust. Progress.",
body: "We track your progress, review your performance, correct your technique and adjust the programme when needed. As you improve, your training evolves with you.",
},
] as const;

/**
 * Price bands mirror the ones on your enquiry form.
 * Adjust the numbers and inclusions freely.
 */
export const plans = [
 {
  id: "starter",
  name: "Starter",
  price: "₹1,000",
  cadence: "per month",
  blurb: "Get expert guidance and start your fitness journey with confidence.",
  features: [
    "Initial fitness consultation",
    "Goal and requirement discussion",
    "Basic workout guidance",
    "Training recommendations",
    "WhatsApp message support",
    "Ideal for beginners who need direction",
  ],
  featured: false,
},
{
  id: "foundation",
  name: "Foundation",
  price: "₹5,000",
  cadence: "per month",
  blurb: "Personalised guidance with two one-on-one coaching sessions every week.",
  features: [
    "Everything in Starter",
    "Customised training plan",
    "2 one-on-one sessions per week",
    "Weekly progress tracking",
    "Exercise form correction",
    "Personalised workout adjustments",
    "WhatsApp support",
  ],
  featured: false,
},
{
  id: "coaching",
  name: "Coaching",
  price: "₹8,000",
  cadence: "per month",
  blurb: "Consistent one-on-one coaching with three personalised sessions every week.",
  features: [
    "Everything in Foundation",
    "3 one-on-one sessions per week",
    "Personalised progression plan",
    "Detailed form and technique correction",
    "Weekly performance review",
    "Nutrition and lifestyle guidance",
    "Priority WhatsApp support",
  ],
  featured: true,
},
{
  id: "transformation",
  name: "Transformation",
  price: "₹10,000",
  cadence: "per month",
  blurb: "High-frequency personal coaching for maximum accountability and results.",
  features: [
    "Everything in Coaching",
    "5 one-on-one sessions per week",
    "Fully personalised workout programming",
    "Detailed goal and progress tracking",
    "Regular body and performance assessments",
    "Training plan adjustments based on progress",
    "Nutrition and lifestyle guidance",
    "Priority WhatsApp support",
    "Maximum accountability and personal attention",
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
      "I started my PT with Vijay in March. It’s been 3 months now and I could see my energy and flexibility has improved a lot, my body got toned and he tracks my daily plate, step count and gives feedback and suggests alternatives if needed. I have gained all these in the comfort of my home as an online training yet getting better results and everyone complimented for the visible changes they could see. Day by day, the intensity of workout is gradually increased by him which is pushing us towards our goal. The motivation and kind of attention he provides kept me going so far with good improvement. I have never been this continuous in improvising my fitness earlier but now with Vijay i came this far and i am confident that i will reach my fitness goal.",
    name: "Maha Nathan",
    detail: "Body recomp · 8 months",
  },
  {
    quote:
      "Mr. Vijay is an experienced trainer who understands your needs and recommends the right exercises tailored to them. His practical approach makes working with him easy, and he serves as an excellent guide for beginners also.",
    name: "Harry Harsha",
    detail: "Rehab+strength training · 6 monts",
  },
  
];

export const faqs = [
 {
  q: "Which plan should I choose?",

  a: "It depends on how much support and accountability you need. If you're just getting started, the Starter consultation is a good first step. For regular one-on-one coaching, you can choose between two, three, or five sessions per week. We can discuss your goals and recommend the right option.",
},
{
  q: "Are the coaching sessions online or in person?",

  a: "Sessions can be conducted online through video calls. You'll receive personalised guidance, exercise demonstrations, form correction and regular progress tracking from wherever you are.",
},
{
  q: "What happens during a one-on-one coaching session?",

  a: "Each session is focused on your individual programme. We'll work through your exercises, correct your form, adjust the intensity when needed and make sure you're progressing safely towards your goal.",
},
{
  q: "What if I miss a scheduled session?",

  a: "Life happens. If you let me know in advance, we'll try to reschedule the session based on availability. Regular communication helps us make sure you get the most out of your coaching plan.",
},
{
  q: "Do I get a personalised workout plan?",

  a: "Yes. Your training is built around your goal, current fitness level, available equipment, schedule and any limitations you may have. The plan can be adjusted as you progress.",
},
{
  q: "Do you provide nutrition guidance?",

  a: "Yes. Nutrition guidance is designed around your goal and your regular eating habits. The focus is on building sustainable habits rather than giving you an unrealistic crash diet.",
},
{
  q: "Do I need to be fit before joining?",

  a: "Not at all. You can start at your current fitness level. The programme is designed to progress gradually, whether you're a complete beginner, returning after a break or already training regularly.",
},
{
  q: "How long are the coaching sessions?",

  a: "Session duration depends on your training requirement and the type of coaching you choose. The focus is on quality training and making sure you get the guidance needed for that session.",
},
{
  q: "Can the programme be adjusted if my schedule changes?",

  a: "Yes. Your programme should fit into your life, not take over it. If your work schedule, travel or routine changes, we can adjust your training structure where possible.",
},
{
  q: "Will you track my progress?",

  a: "Yes. Progress is tracked through factors such as strength, performance, consistency, body measurements and other goal-specific markers. The goal is to focus on meaningful progress, not just the number on the weighing scale.",
},
{
  q: "Can I contact you between sessions?",

  a: "Yes. Depending on your coaching plan, you can use WhatsApp for questions, updates and support between your scheduled sessions.",
},
{
  q: "Is this only for weight loss?",

  a: "No. Coaching can be tailored for fat loss, muscle building, strength, improved fitness, better movement, returning to exercise or simply building a healthier and more consistent lifestyle.",
},
{
  q: "Do you guarantee results?",

  a: "No coach can honestly guarantee a specific result or timeline. Your progress depends on factors such as consistency, nutrition, sleep, effort and your starting point. What I can guarantee is personalised guidance, honest feedback and a programme designed around your goals.",
},
{
  q: "Can I upgrade my coaching plan later?",

  a: "Yes. If you feel you need more sessions, accountability or support, you can discuss upgrading your plan based on availability.",
},
{
  q: "What should I do before our first session?",

  a: "Come ready to discuss your goals, current routine, training experience, available equipment and any injuries or limitations that may affect your training. This helps me create a programme that actually fits you.",
},
{
  q: "How do I make payment?",

  a: "Payment details will be shared when you choose your coaching plan. Your slot and coaching schedule can be confirmed once the payment process is completed.",
},
{
  q: "Which app will we use for coaching?",

  a: "Online sessions and consultations are conducted through a convenient video calling platform, with WhatsApp used for communication, updates and ongoing support. You'll receive all joining details before your first session.",
},
] as const;

export const social = {
  instagram:"https://instagram.com/fitwithvijayawsom"

} as const;
