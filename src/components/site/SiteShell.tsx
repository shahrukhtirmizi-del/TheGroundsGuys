import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Logo from "@/components/site/Logo";
import Grain from "@/components/site/Grain";
import SmoothScroll from "@/components/site/SmoothScroll";
import CookieBanner from "@/components/site/CookieBanner";
import { SITE } from "@/lib/site";
import { getLogoSrc } from "@/lib/logo";

/**
 * The marketing site's chrome: header, footer, smooth scroll, cookie banner,
 * grain and the LocalBusiness JSON-LD. Used by the (site) route group layout
 * and by the root 404, so standalone routes such as /pitch can opt out.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const logoSrc = getLogoSrc();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LandscapeService",
    name: SITE.name,
    telephone: "+1-321-339-1627",
    email: SITE.email,
    url: SITE.url,
    image: `${SITE.url}/cta-wide-shot.jpg`,
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressLocality: "Davenport", addressRegion: "FL", postalCode: "33837", addressCountry: "US" },
    areaServed: ["Davenport, FL", "Intercession City, FL", "Kissimmee, FL", "Loughman, FL"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "07:00", closes: "15:00" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", reviewCount: "45" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SmoothScroll />
      <Nav logo={<Logo src={logoSrc} />} logoOnDark={<Logo src={logoSrc} onDark />} />
      {/* the header watches this to know when it has left the top of the page */}
      <div id="top-sentinel" aria-hidden className="pointer-events-none absolute left-0 top-0 h-[72px] w-px" />
      <main className="flex-1">{children}</main>
      <Footer logo={<Logo src={logoSrc} onDark />} />
      <CookieBanner />
      <Grain />
    </>
  );
}
