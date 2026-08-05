"use server";

import { z } from "zod";
import { ConflictError } from "../../lib/admin/errors";
import { getDataProvider } from "../../lib/data";

const subscriberSchema = z
  .object({
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    name: z.string().trim().min(2).max(120).optional(),
  })
  .strict();

const inquirySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    phone: z.string().trim().min(7).max(40).optional(),
    subject: z.string().trim().max(160).optional(),
    message: z.string().trim().min(10).max(5_000),
  })
  .strict();

export type SubmissionActionResult =
  | { ok: true; message: string; alreadyExists?: boolean }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function subscribeToNewsletter(input: {
  email: string;
  name?: string;
}): Promise<SubmissionActionResult> {
  const parsed = subscriberSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter a valid email address.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const provider = getDataProvider();
    const existing = (await provider.listSubscribers({ search: parsed.data.email })).find(
      (subscriber) => subscriber.email.toLowerCase() === parsed.data.email
    );
    if (existing) {
      return { ok: true, alreadyExists: true, message: "You are already subscribed." };
    }
    await provider.createSubscriber({
      email: parsed.data.email,
      name: parsed.data.name ?? null,
      source: "storefront",
    });
    return { ok: true, message: "Thank you for subscribing!" };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { ok: true, alreadyExists: true, message: "You are already subscribed." };
    }
    return { ok: false, message: "We could not save your subscription. Please try again." };
  }
}

export async function submitInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<SubmissionActionResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check your contact details and message.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await getDataProvider().createInquiry({
      ...parsed.data,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      status: "unread",
    });
    return { ok: true, message: "Thank you for reaching out. We will get back to you soon." };
  } catch {
    return { ok: false, message: "We could not send your message. Please try again." };
  }
}
