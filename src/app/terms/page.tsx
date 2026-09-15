import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to using this website and to estimates and services from The Grounds Guys of Davenport, FL.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="September 15, 2026"
      intro="Plain terms for using this website and requesting our services. If anything here is unclear, call us and we will walk you through it."
    >
      <h2>About us</h2>
      <p>
        {SITE.name} is an independently owned and operated franchise, licensed in Florida under license number{" "}
        {SITE.license}. These terms are between you and the local franchise, not the national Grounds Guys brand or
        Neighborly.
      </p>

      <h2>Estimates</h2>
      <ul>
        <li>Estimates are free on most services and are provided after we have seen the property.</li>
        <li>
          <strong>Irrigation repair is the exception.</strong> Diagnosing an irrigation system requires a paid diagnostic
          fee, which is not covered by the free estimate. We will confirm the fee with you before any diagnostic work
          begins.
        </li>
        <li>An estimate is valid for 30 days unless stated otherwise and may change if the scope of work changes.</li>
      </ul>

      <h2>Pricing and payment</h2>
      <p>
        All pricing is agreed upfront and in writing before work starts. Recurring maintenance is billed on the
        schedule agreed in your service plan. Invoices are due on receipt unless other terms are agreed.
      </p>

      <h2>Scheduling and access</h2>
      <p>
        We will agree a service window with you and arrive promptly within it. Weather and safety may require us to
        reschedule; we will let you know as early as we can. Please make sure our crew has safe access to the property
        and that pets are secured during visits.
      </p>

      <h2>Satisfaction guarantee</h2>
      <p>
        Our landscaping services come with a 100% customer satisfaction guarantee. If something is not right, tell us
        within 48 hours of the visit and we will come back and make it right at no charge.
      </p>

      <h2>Cancellations</h2>
      <p>
        You may cancel or reschedule a visit with at least 24 hours notice at no charge. Recurring plans can be cancelled
        with written notice before the next scheduled visit.
      </p>

      <h2>Use of this website</h2>
      <p>
        The content on this site is provided for general information about our services. You agree not to misuse the
        site, submit false information through the estimate form, or attempt to interfere with its operation. Photos and
        text are the property of the local franchise or the Grounds Guys brand and may not be reused without permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by Florida law, our liability for any claim relating to our services is limited to the
        amount you paid for the service in question. Nothing in these terms limits liability that cannot be limited by
        law.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Florida. Any dispute will be handled in the courts of Polk County, Florida.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: call {SITE.phone} or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
