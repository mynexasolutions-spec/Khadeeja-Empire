"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, MoveLeft, MoveRight } from "lucide-react";

const DEMO_OTP = "12345";

export function CustomerLoginForm({ next }: { next: string }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/customer/request-otp", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? "We could not start sign-in.");
      setStep("otp");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not start sign-in.");
    } finally {
      setPending(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/customer/verify-otp", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, code, next }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        redirectTo?: string;
      } | null;
      if (!response.ok) throw new Error(result?.error ?? "That code could not be verified.");
      window.location.assign(result?.redirectTo ?? "/");
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "That code could not be verified."
      );
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-[62vh] items-center justify-center px-4 py-16 sm:px-6">
      <section
        aria-labelledby="customer-login-title"
        className="w-full max-w-[440px] border border-border bg-surface px-7 py-9 shadow-[0_18px_60px_rgba(75,47,31,0.09)] sm:px-10 sm:py-11"
      >
        <div className="mb-9 border-b border-border pb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Khadeeja Empire
          </p>
          <h1 id="customer-login-title" className="text-h2 text-ink">
            Your place, held.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in with your phone to keep your orders and saved details together.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 border border-[#c9968e] bg-[#fbebe7] px-4 py-3 text-sm leading-5 text-maroon">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <div>
              <label htmlFor="customer-phone" className="mb-2 block text-sm font-medium text-ink">
                Phone number
              </label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                required
                className="min-h-12 w-full border border-border-strong bg-surface-elevated px-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-ink px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {pending ? "Preparing code" : "Continue"}
              {!pending && <MoveRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-5">
            <div className="border border-[#d7c7b7] bg-[#f5f0e8] px-4 py-3 text-sm leading-5 text-muted">
              Demo sign-in code: <strong className="font-semibold text-ink">{DEMO_OTP}</strong>
            </div>
            <div>
              <label htmlFor="customer-otp" className="mb-2 block text-sm font-medium text-ink">
                Five-digit code
              </label>
              <input
                id="customer-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{5}"
                maxLength={5}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                required
                className="min-h-12 w-full border border-border-strong bg-surface-elevated px-4 text-center text-lg tracking-[0.32em] text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-ink px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {pending ? "Verifying" : "Sign in"}
              {!pending && <MoveRight className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setCode("");
                setStep("phone");
              }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm text-muted transition hover:text-primary"
            >
              <MoveLeft className="h-4 w-4" aria-hidden="true" />
              Use a different number
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
