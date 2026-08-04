"use client";

import { useState } from "react";
import { z } from "zod";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.errors[0].message);
      return;
    }
    setStatus("success");
    setMessage("Thank you for subscribing!");
    setEmail("");
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <div className="footer-form-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address for newsletter"
          aria-invalid={status === "error"}
          aria-describedby="newsletter-msg"
          required
          className="footer-form-input"
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          className="footer-form-button"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      {message && (
        <p
          id="newsletter-msg"
          className={cnText(status)}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}

function cnText(status: "idle" | "success" | "error") {
  if (status === "error") return "text-xs text-red-700";
  return "text-xs text-muted";
}
