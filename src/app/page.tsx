import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { EnquiryDialog } from "@/components/enquiry/EnquiryDialog";
import { Dashboard } from "@/components/tools/Dashboard";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { GoalsMarquee } from "@/components/GoalsMarquee";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Plans } from "@/components/Plans";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { faqs } from "@/config/site";

/** FAQ rich result — lets Google show the questions directly in search. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />

      <main>
        <Hero />
        <GoalsMarquee />
        <About />
        <Services />
        <Process />
        <Testimonials />
        <Plans />
        <Faq />
        <Dashboard />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
      <EnquiryDialog />
    </>
  );
}
