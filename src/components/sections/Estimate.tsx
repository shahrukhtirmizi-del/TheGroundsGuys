"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckCircleIcon, InfoIcon, PhoneIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Reveal from "../ui/Reveal";
import { SERVICE_OPTIONS, SITE } from "@/lib/site";
import { estimateSchema, type EstimateInput } from "@/lib/estimate-schema";

type Errors = Partial<Record<keyof EstimateInput | "form", string>>;

const EMPTY: EstimateInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  zip: "",
  propertyType: "residential",
  service: "",
  notes: "",
  company: "",
};

/**
 * The free-estimate form. One clean card, validated with the same schema
 * the API uses, inline errors under each field, and a thank-you state that
 * replaces the form once the request has gone through.
 */
export default function Estimate() {
  const [values, setValues] = useState<EstimateInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function set<K extends keyof EstimateInput>(key: K, value: EstimateInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateField(key: keyof EstimateInput) {
    const result = estimateSchema.safeParse(values);
    if (result.success) {
      setErrors((e) => ({ ...e, [key]: undefined }));
      return;
    }
    const issue = result.error.issues.find((i) => i.path[0] === key);
    setErrors((e) => ({ ...e, [key]: issue?.message }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const result = estimateSchema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof EstimateInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; errors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setErrors({ ...(data.errors ?? {}), form: data.error ?? "Please check the highlighted fields." });
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setErrors({ form: `We couldn't send that just now. Please call ${SITE.phone} and we'll take the details by phone.` });
      setStatus("idle");
    }
  }

  const irrigation = values.service.toLowerCase().startsWith("irrigation");
  const fieldProps = (key: keyof EstimateInput) => ({
    "aria-invalid": Boolean(errors[key]) || undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    onBlur: () => {
      setTouched((t) => ({ ...t, [key]: true }));
      validateField(key);
    },
  });

  return (
    <section id="estimate" className="scroll-mt-20 py-20 md:py-28" style={{ background: "var(--bone-2)" }}>
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Reveal className="lg:sticky lg:top-28">
            <h2 className="h-section text-[var(--ink)]">
              Get your <span className="em text-[var(--green)]">free estimate.</span>
            </h2>
            <p className="lead mt-5 max-w-[42ch]">
              Tell us about the property and what you need. We&rsquo;ll come out, look it over and give you a clear,
              upfront price. No pressure, no surprises.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-[15px] text-[var(--ink-70)]">
              <p className="flex items-center gap-2.5">
                <CheckCircleIcon size={20} weight="fill" color="var(--green)" /> Free estimates on most services
              </p>
              <p className="flex items-center gap-2.5">
                <CheckCircleIcon size={20} weight="fill" color="var(--green)" /> Upfront pricing, in writing
              </p>
              <p className="flex items-center gap-2.5">
                <CheckCircleIcon size={20} weight="fill" color="var(--green)" /> 100% satisfaction guarantee
              </p>
            </div>
            <a href={SITE.phoneHref} className="btn btn-secondary mt-8">
              <PhoneIcon size={16} weight="fill" />
              Or call {SITE.phone}
            </a>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="rounded-[var(--r-card)] bg-[var(--white)] p-6 md:p-10" style={{ boxShadow: "var(--shadow-lift)", border: "1px solid var(--line)" }}>
            {status === "sent" ? (
              <div className="modal-panel py-8 text-center md:py-14" role="status" aria-live="polite">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--green-soft)" }}>
                  <CheckCircleIcon size={34} weight="fill" color="var(--green)" />
                </span>
                <h3 className="mt-6 text-[30px] font-bold tracking-tight text-[var(--ink)] md:text-[36px]">Thank you, {values.firstName}.</h3>
                <p className="mx-auto mt-3 max-w-[44ch] text-[16px] leading-relaxed text-[var(--ink-70)]">
                  Your request is in. We&rsquo;ll call or email within one business day to arrange a time to look at the
                  property. Need us sooner? Ring{" "}
                  <a href={SITE.phoneHref} className="font-semibold text-[var(--green)] underline underline-offset-2">
                    {SITE.phone}
                  </a>
                  .
                </p>
                {irrigation && (
                  <p className="mx-auto mt-5 flex max-w-[48ch] items-start gap-2 rounded-[var(--r-input)] p-4 text-left text-[14px] text-[var(--ink)]" style={{ background: "var(--yellow-soft)" }}>
                    <InfoIcon size={18} weight="fill" color="var(--green)" className="mt-[1px] shrink-0" />
                    A reminder that irrigation repair carries a paid diagnostic fee. We&rsquo;ll confirm the amount with you before booking.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setValues(EMPTY);
                    setTouched({});
                    setStatus("idle");
                  }}
                  className="btn btn-secondary mt-8"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" id="firstName" error={touched.firstName ? errors.firstName : undefined}>
                    <input id="firstName" className="field" autoComplete="given-name" value={values.firstName} onChange={(e) => set("firstName", e.target.value)} {...fieldProps("firstName")} />
                  </Field>
                  <Field label="Last name" id="lastName" error={touched.lastName ? errors.lastName : undefined}>
                    <input id="lastName" className="field" autoComplete="family-name" value={values.lastName} onChange={(e) => set("lastName", e.target.value)} {...fieldProps("lastName")} />
                  </Field>
                  <Field label="Email" id="email" error={touched.email ? errors.email : undefined}>
                    <input id="email" type="email" className="field" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => set("email", e.target.value)} {...fieldProps("email")} />
                  </Field>
                  <Field label="Phone number" id="phone" error={touched.phone ? errors.phone : undefined}>
                    <input id="phone" type="tel" className="field" autoComplete="tel" inputMode="tel" placeholder="(321) 555-0100" value={values.phone} onChange={(e) => set("phone", e.target.value)} {...fieldProps("phone")} />
                  </Field>
                  <Field label="Street address" id="street" error={touched.street ? errors.street : undefined} className="sm:col-span-2">
                    <input id="street" className="field" autoComplete="street-address" value={values.street} onChange={(e) => set("street", e.target.value)} {...fieldProps("street")} />
                  </Field>
                  <Field label="ZIP code" id="zip" error={touched.zip ? errors.zip : undefined}>
                    <input id="zip" className="field" autoComplete="postal-code" inputMode="numeric" maxLength={5} placeholder="33837" value={values.zip} onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))} {...fieldProps("zip")} />
                  </Field>

                  <div>
                    <span className="mb-2 block text-[13.5px] font-semibold text-[var(--ink)]">Property type</span>
                    <div role="radiogroup" aria-label="Property type" className="grid grid-cols-2 rounded-[var(--r-input)] p-1" style={{ background: "var(--bone-2)" }}>
                      {(["residential", "commercial"] as const).map((opt) => {
                        const on = values.propertyType === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => set("propertyType", opt)}
                            className="rounded-[10px] py-3 text-[14.5px] font-semibold capitalize transition-[background-color,color,box-shadow] duration-300"
                            style={{
                              background: on ? "var(--green)" : "transparent",
                              color: on ? "var(--on-dark)" : "var(--ink-55)",
                              boxShadow: on ? "var(--shadow-soft)" : "none",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Service needed" id="service" error={touched.service ? errors.service : undefined} className="sm:col-span-2">
                    <select id="service" className="field appearance-none pr-10" value={values.service} onChange={(e) => set("service", e.target.value)} {...fieldProps("service")}
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1l6 6 6-6' fill='none' stroke='%2334531d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 16px center",
                      }}
                    >
                      <option value="" disabled>
                        Choose a service
                      </option>
                      {SERVICE_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {irrigation && (
                    <p className="modal-panel flex items-start gap-2.5 rounded-[var(--r-input)] p-4 text-[14px] leading-snug text-[var(--ink)] sm:col-span-2" style={{ background: "var(--yellow-soft)" }}>
                      <InfoIcon size={18} weight="fill" color="var(--green)" className="mt-[1px] shrink-0" />
                      Irrigation repair requires a paid diagnostic fee and is not covered by the free estimate. We will confirm the fee with you before any work begins.
                    </p>
                  )}

                  <Field label="Anything else we should know?" id="notes" hint="Optional" className="sm:col-span-2">
                    <textarea id="notes" className="field min-h-[110px] resize-y" value={values.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
                  </Field>

                  {/* honeypot */}
                  <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
                    <label htmlFor="company">Company</label>
                    <input id="company" tabIndex={-1} autoComplete="off" value={values.company ?? ""} onChange={(e) => set("company", e.target.value)} />
                  </div>
                </div>

                {errors.form && (
                  <p role="alert" className="mt-5 flex items-start gap-2 rounded-[var(--r-input)] p-4 text-[14px]" style={{ background: "#fbe9e3", color: "#7f2d18" }}>
                    <WarningCircleIcon size={18} weight="fill" className="mt-[1px] shrink-0" />
                    {errors.form}
                  </p>
                )}

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="btn btn-primary !px-7 !py-[17px] !text-[16px]" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Request My Free Estimate"}
                    {status !== "sending" && <ArrowRightIcon size={16} weight="bold" />}
                  </button>
                  <p className="text-[12.5px] leading-snug text-[var(--ink-40)]">
                    By sending this you agree to our{" "}
                    <a href="/privacy" className="underline underline-offset-2">
                      privacy policy
                    </a>
                    . We never share your details.
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[13.5px] font-semibold text-[var(--ink)]">
        {label}
        {hint && <span className="text-[12px] font-normal text-[var(--ink-40)]">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error flex items-center gap-1.5" role="alert">
          <WarningCircleIcon size={14} weight="fill" />
          {error}
        </p>
      )}
    </div>
  );
}
