import { z } from "zod";
import { SERVICE_OPTIONS } from "./site";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a phone number we can reach you on.")
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number.");

export const estimateSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(60),
  lastName: z.string().trim().min(1, "Last name is required.").max(60),
  email: z.string().trim().email("Enter a valid email address."),
  phone,
  street: z.string().trim().min(4, "Enter your street address.").max(120),
  zip: z.string().trim().regex(/^\d{5}$/, "Enter a five-digit ZIP code."),
  propertyType: z.enum(["residential", "commercial"], { message: "Choose residential or commercial." }),
  service: z.string().refine((v) => SERVICE_OPTIONS.includes(v), "Choose the service you need."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  // honeypot: bots fill it, people never see it
  company: z.string().max(0).optional().or(z.literal("")),
});

export type EstimateInput = z.infer<typeof estimateSchema>;
