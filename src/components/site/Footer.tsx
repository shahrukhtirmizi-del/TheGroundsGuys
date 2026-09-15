import Link from "next/link";
import type { ReactNode } from "react";
import { NAV, SITE } from "@/lib/site";

export default function Footer({ logo }: { logo: ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative" style={{ background: "var(--green-deeper)", color: "var(--on-dark)" }}>
      <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            {logo}
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed" style={{ color: "var(--on-dark-70)" }}>
              Locally owned and operated lawn care and landscaping for Davenport, FL. Part of the Grounds Guys and
              Neighborly family of home service brands.
            </p>
            <p className="mt-5 text-[13px]" style={{ color: "var(--on-dark-50)" }}>
              License # {SITE.license}
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--yellow-muted)" }}>
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={`/${n.href}`} className="nav-link !p-0" style={{ color: "var(--on-dark)" }}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#estimate" className="nav-link !p-0" style={{ color: "var(--on-dark)" }}>
                  Free Estimate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--yellow-muted)" }}>
              Hours
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {SITE.hours.map((h) => (
                <li key={h.days}>
                  <div style={{ color: "var(--on-dark)" }}>{h.days}</div>
                  <div className="text-[14px]" style={{ color: "var(--on-dark-70)" }}>
                    {h.time}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--yellow-muted)" }}>
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <a href={SITE.phoneHref} className="nav-link !p-0 font-semibold" style={{ color: "var(--on-dark)" }}>
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="nav-link !p-0 break-all" style={{ color: "var(--on-dark)" }}>
                  {SITE.email}
                </a>
              </li>
              <li style={{ color: "var(--on-dark-70)" }}>
                Davenport, FL {SITE.zip}
                <br />
                Serving Davenport, Intercession City, Kissimmee and Loughman
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-4 border-t pt-6 text-[13px] md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--line-dark)", color: "var(--on-dark-50)" }}
        >
          <p>
            &copy; {year} {SITE.name}. Independently owned and operated franchise.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="nav-link !p-0">
              Privacy Policy
            </Link>
            <Link href="/terms" className="nav-link !p-0">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
