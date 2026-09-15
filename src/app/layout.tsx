import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Logo from "@/components/site/Logo";
import Grain from "@/components/site/Grain";
import SmoothScroll from "@/components/site/SmoothScroll";
import CookieBanner from "@/components/site/CookieBanner";
import { SITE } from "@/lib/site";
import { getLogoSrc } from "@/lib/logo";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Lawn Care & Landscaping in Davenport, FL | The Grounds Guys of Davenport",
    template: "%s | The Grounds Guys of Davenport, FL",
  },
  description: SITE.description,
  keywords: [
    "lawn care Davenport FL",
    "landscaping Davenport FL",
    "lawn mowing Davenport",
    "irrigation repair Davenport FL",
    "landscapers Kissimmee FL",
    "sod installation Davenport",
    "The Grounds Guys Davenport",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    title: "Lawn Care & Landscaping in Davenport, FL | The Grounds Guys",
    description: SITE.description,
    images: [{ url: "/cta-wide-shot.jpg", width: 1672, height: 941, alt: "A Grounds Guys maintained lawn in Davenport, FL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lawn Care & Landscaping in Davenport, FL | The Grounds Guys",
    description: SITE.description,
    images: ["/cta-wide-shot.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#34531d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        <Nav logo={<Logo src={logoSrc} />} logoOnDark={<Logo src={logoSrc} onDark />} />
        {/* the header watches this to know when it has left the top of the page */}
        <div id="top-sentinel" aria-hidden className="pointer-events-none absolute left-0 top-0 h-[72px] w-px" />
        <main className="flex-1">{children}</main>
        <Footer logo={<Logo src={logoSrc} onDark />} />
        <CookieBanner />
        <Grain />
      </body>
    </html>
  );
}
