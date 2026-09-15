import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Grounds Guys of Davenport, FL collects, uses and protects the information you share with us.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 15, 2026"
      intro="We collect only what we need to give you an estimate and do the work well. This page explains what that is, how it is used and the choices you have."
    >
      <h2>Who we are</h2>
      <p>
        {SITE.name} is an independently owned and operated franchise of The Grounds Guys, part of the Neighborly family
        of home service brands. You can reach us at {SITE.phone} or <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Estimate requests.</strong> Your name, email, phone number, property address, property type and the
          service you are interested in, plus any notes you add.
        </li>
        <li>
          <strong>Address checks.</strong> The address or ZIP code you type into the service-area tool is sent to a
          mapping service (OpenStreetMap Nominatim) to find its location. It is not stored by us.
        </li>
        <li>
          <strong>Usage data.</strong> If you accept cookies, we may use basic analytics to understand how the site is
          used (pages visited, device type, approximate region). No analytics run if you decline.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you about your estimate and schedule a visit.</li>
        <li>To provide and improve our lawn care and landscaping services.</li>
        <li>To keep records we are required to keep for tax, licensing and insurance purposes.</li>
      </ul>
      <p>We do not sell your personal information, and we do not share it with third parties for their own marketing.</p>

      <h2>Who we share it with</h2>
      <p>
        Your details may be handled by service providers who help us run the site and the business, such as our email
        delivery provider, our website hosting provider (Vercel) and the Grounds Guys franchisor for reporting. Each is
        bound to use the information only on our behalf.
      </p>

      <h2>Cookies</h2>
      <p>
        The site sets a single cookie-style preference in your browser to remember whether you accepted or declined
        cookies. Optional analytics cookies are only set after you accept. You can clear them at any time through your
        browser settings.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to see, correct or delete the personal information we hold about you by calling {SITE.phone} or
        emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We will respond within 30 days.
      </p>

      <h2>Retention and security</h2>
      <p>
        We keep estimate requests for as long as needed to serve you and meet our legal obligations, then delete them.
        Information is transmitted over HTTPS and stored with reputable providers who maintain industry-standard
        safeguards.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes we will update the date at the top of this page. Continued use of the site after a change means you accept the updated policy.</p>
    </LegalPage>
  );
}
