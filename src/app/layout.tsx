import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

/** Heavy condensed display face — headlines only, always uppercase. */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Used for eyebrows, indices and stats — gives the data an athletic feel. */
const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Certified Personal Trainer in ${site.city}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "personal trainer Chennai",
    "online fitness coach India",
    "posture correction Chennai",
    "injury rehab training",
    "diet plan Chennai",
    "fat loss coach",
    "certified personal trainer Sembakkam",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Certified Personal Trainer in ${site.city}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Certified Personal Trainer in ${site.city}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

/** Structured data so Google shows the rating, address and hours in search. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  additionalType: "https://schema.org/SportsActivityLocation",
  "@id": `${site.url}/#business`,
  name: site.name,
  alternateName: site.legalName,
  description: site.description,
  url: site.url,
  telephone: "+918056115687",
  email: site.email,
  priceRange: "₹₹",
  image: `${site.url}/images/vijay.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  hasMap: site.googleMapsUrl,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating.value,
    reviewCount: site.rating.count,
    bestRating: "5",
  },
  areaServed: [
    { "@type": "City", name: "Chennai" },
    { "@type": "Country", name: "India" },
  ],
  makesOffer: [
    "Online personal training",
    "Prehab and rehab programming",
    "Diet and nutrition coaching",
  ].map((n) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: n },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables must live on <html> so that the `--font-display` /
    // `--font-sans` tokens declared on :root can resolve them.
    <html
      lang="en-IN"
      className={`${anton.variable} ${inter.variable} ${mono.variable}`}
    >
      <head>
        {/* Without JS the reveal class never gets its counterpart, so
            neutralise it outright — content must never stay invisible. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled object — safe to inject.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
