"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/storefront/submissions";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.errors[0].message);
      return;
    }
    startTransition(async () => {
      const response = await subscribeToNewsletter({ email: result.data.email });
      setStatus(response.ok ? "success" : "error");
      setMessage(response.message);
      if (response.ok) setEmail("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full" noValidate>
      <div className="relative flex items-center rounded-lg border border-border/80 bg-white shadow-2xs overflow-hidden focus-within:border-[#b89565] transition-all">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address for newsletter"
          aria-invalid={status === "error"}
          aria-describedby="newsletter-msg"
          disabled={pending}
          required
          style={{ outline: "none", boxShadow: "none" }}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-transparent text-ink placeholder:text-muted/70 !outline-none border-none"
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          aria-busy={pending}
          disabled={pending}
          className="bg-[#b89565] hover:bg-[#a07e50] active:scale-95 text-white px-3.5 py-3 transition-colors flex items-center justify-center shrink-0"
        >
          <ArrowRight className={pending ? "animate-pulse w-4 h-4" : "w-4 h-4"} />
        </button>
      </div>
      {message && (
        <p
          id="newsletter-msg"
          className={status === "error" ? "text-xs text-red-600" : "text-xs text-emerald-600 font-medium"}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}

