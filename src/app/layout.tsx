import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

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
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
