import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./pitch.css";

const inter = Inter({
  variable: "--font-pitch-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-pitch-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* Sales-meeting deck. Unlinked, unindexed; reached by URL only. */
export const metadata: Metadata = {
  title: { absolute: "Let's talk about your phone calls — PVA Media" },
  description: "An AI receptionist for The Grounds Guys of Davenport.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: null },
};

export const viewport: Viewport = {
  themeColor: "#1C1C1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${mono.variable} pitch-root`}>{children}</div>;
}
