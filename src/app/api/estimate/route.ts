import { NextResponse } from "next/server";
import { estimateSchema } from "@/lib/estimate-schema";
import { SITE } from "@/lib/site";

/**
 * Receives the free-estimate form. Validates server-side, then delivers the
 * lead by whichever channel is configured:
 *   - RESEND_API_KEY + ESTIMATE_TO_EMAIL: emails the request via Resend
 *   - ESTIMATE_WEBHOOK_URL: POSTs the JSON to a webhook (Zapier, Make, CRM)
 * With neither set (local dev, first deploy) the lead is logged so nothing
 * is silently dropped, and the visitor still sees the thank-you state.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = estimateSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead = parsed.data;
  if (lead.company) {
    // honeypot tripped: pretend success so the bot moves on
    return NextResponse.json({ ok: true });
  }

  const submittedAt = new Date().toISOString();
  const summary = [
    `New free estimate request (${lead.propertyType})`,
    ``,
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Address: ${lead.street}, ${lead.zip}`,
    `Service: ${lead.service}`,
    lead.notes ? `Notes: ${lead.notes}` : null,
    ``,
    `Submitted: ${submittedAt}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const { RESEND_API_KEY, ESTIMATE_TO_EMAIL, ESTIMATE_FROM_EMAIL, ESTIMATE_WEBHOOK_URL } = process.env;

  try {
    if (RESEND_API_KEY && ESTIMATE_TO_EMAIL) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ESTIMATE_FROM_EMAIL ?? "Estimates <onboarding@resend.dev>",
          to: ESTIMATE_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: lead.email,
          subject: `Free estimate: ${lead.firstName} ${lead.lastName} (${lead.service})`,
          text: summary,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
    } else if (ESTIMATE_WEBHOOK_URL) {
      const res = await fetch(ESTIMATE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, submittedAt, site: SITE.name }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } else {
      console.log("[estimate] no delivery channel configured; lead follows\n" + summary);
    }
  } catch (err) {
    console.error("[estimate] delivery failed", err);
    return NextResponse.json(
      { ok: false, error: `We couldn't send that just now. Please call ${SITE.phone} and we'll take the details by phone.` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
