import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import Services from "@/components/sections/Services";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Cares from "@/components/sections/Cares";
import Testimonials from "@/components/sections/Testimonials";
import ServiceArea from "@/components/sections/ServiceArea";
import Faq from "@/components/sections/Faq";
import Estimate from "@/components/sections/Estimate";
import FinalCta from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <Services />
      <BeforeAfter />
      <Cares />
      <Testimonials />
      <ServiceArea />
      <Faq />
      <Estimate />
      <FinalCta />
    </>
  );
}
