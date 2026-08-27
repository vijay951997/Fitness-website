# Fit with Vijay — website

Marketing site for **Certified Personal Trainer Vijay**, Chennai.
Next.js 16 (App Router) + Tailwind CSS v4. Fully static — no server or
database needed to host it.

---

## Run it on your machine

```bash
npm run dev
```

Then open <http://localhost:3000>. Edits appear instantly.

---

## Changing the content

**Almost everything you'll want to change lives in one file:**

### [`src/config/site.ts`](src/config/site.ts)

| What you want to change      | Edit this                                    |
| ---------------------------- | -------------------------------------------- |
| WhatsApp number              | `whatsapp.number` (digits only, with `91`)   |
| Prices and what's included   | `plans`                                      |
| The three coaching services  | `services`                                   |
| FAQ questions and answers    | `faqs`                                       |
| Client reviews               | `testimonials`                               |
| Google review count          | `site.rating.count`                          |
| Instagram / YouTube links    | `social` (empty strings hide the links)      |
| Your domain, once you buy it | `site.url`                                   |

### Before you go live — a checklist

- [ ] Add your photos — see [`public/images/README.md`](public/images/README.md)
- [ ] **Replace the placeholder testimonials** in `site.ts` with real client
      quotes. They currently say "Add a real client quote here."
- [ ] Rewrite the About copy in [`src/components/About.tsx`](src/components/About.tsx)
      in your own words — especially the certifications list, which is a
      reasonable guess, not your actual qualifications.
- [ ] Confirm the price bands in `plans` match what you actually charge.
- [ ] Set `site.url` to your real domain, then redeploy.
- [ ] Add your website URL to your Google Business profile.

---

## Putting it online

The site builds to plain static files, so hosting is free.

### Easiest: Vercel

```bash
npx vercel
```

Follow the prompts. Push to GitHub afterwards and every push redeploys
automatically.

### Alternative: Netlify or Cloudflare Pages

Connect the GitHub repo and use:

- Build command: `npm run build`
- Output directory: `.next`

### Your own domain

Buy one (`fitwithvijay.in` costs roughly ₹700/year at GoDaddy, Hostinger or
Namecheap), add it in your host's dashboard, then update `site.url` in
`src/config/site.ts` and redeploy so the SEO tags point to the right place.

---

## What's already handled for you

- **Local SEO** — `LocalBusiness` structured data with your address, hours,
  geo-coordinates and 5.0 rating, so Google can show a rich result.
- **FAQ structured data** — your questions can appear directly in search.
- **Social preview card** — auto-generated at `/opengraph-image`, so the link
  looks good when shared on WhatsApp.
- **Sitemap and robots.txt** — generated automatically.
- **Mobile-first** — most of your visitors will be on a phone.
- **Accessibility** — keyboard navigation, focus rings, reduced-motion
  support, semantic headings.

---

## Project layout

```
src/
  app/
    layout.tsx            fonts, metadata, business structured data
    page.tsx              assembles the sections in order
    globals.css           colour palette and design tokens
    icon.svg              favicon
    opengraph-image.tsx   social share card
  components/             one file per section of the page
  config/site.ts          ← all your content lives here
public/images/            your photos
```
