"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please enter at least 10 characters"),
});

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-surface border border-border text-center flex flex-col gap-3">
        <h2 className="text-h3 text-ink">Message Sent</h2>
        <p className="text-muted">Thank you for reaching out. We will get back to you soon.</p>
        <p className="text-xs text-muted">Frontend prototype: no message was actually sent.</p>
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
        className="px-4 py-3 border border-border bg-surface focus:border-ink outline-none transition-colors"
      />
      {errors[name] && <p className="text-sm text-primary" role="alert">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {field("name", "Your Name")}
      {field("email", "Email Address", "email")}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink">Message</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={!!errors.message}
          rows={5}
          className="px-4 py-3 border border-border bg-surface focus:border-ink outline-none transition-colors resize-y"
        />
        {errors.message && <p className="text-sm text-primary" role="alert">{errors.message}</p>}
      </div>
      <Button type="submit" className="w-full">Send Message</Button>
    </form>
  );
}
