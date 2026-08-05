"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { submitInquiry } from "@/actions/storefront/submissions";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please enter at least 10 characters"),
  phone: z.string().max(40).optional(),
  subject: z.string().max(240).optional(),
});

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    startTransition(async () => {
      const response = await submitInquiry({
        ...result.data,
        phone: result.data.phone || undefined,
        subject: result.data.subject || undefined,
      });
      if (response.ok) {
        setSubmitted(true);
        return;
      }
      setErrors(
        Object.fromEntries(
          Object.entries(response.fieldErrors ?? {}).map(([key, messages]) => [key, messages?.[0] ?? "Invalid value"])
        )
      );
      setSubmitError(response.message);
    });
  };

  if (submitted) {
    return (
      <div className="p-8 bg-surface border border-border text-center flex flex-col gap-3">
        <h2 className="text-h3 text-ink">Message Sent</h2>
        <p className="text-muted">Thank you for reaching out. We will get back to you soon.</p>
      </div>
    );
  }

  const field = (name: keyof typeof form, label: string, type = "text") => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        disabled={pending}
        className="px-4 py-3 border border-border bg-surface focus:border-ink outline-none transition-colors"
      />
      {errors[name] && <p id={`${name}-error`} className="text-sm text-primary" role="alert">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {field("name", "Your Name")}
      {field("email", "Email Address", "email")}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("phone", "Phone Number (optional)", "tel")}
        {field("subject", "Subject (optional)")}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink">Message</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          disabled={pending}
          rows={5}
          className="px-4 py-3 border border-border bg-surface focus:border-ink outline-none transition-colors resize-y"
        />
        {errors.message && <p id="message-error" className="text-sm text-primary" role="alert">{errors.message}</p>}
      </div>
      {submitError && <p className="text-sm text-primary" role="alert">{submitError}</p>}
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Sending…" : "Send Message"}</Button>
    </form>
  );
}
