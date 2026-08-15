"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowLeft } from "lucide-react";

export function OtpLoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.trim().length < 10) {
      setError("Enter a valid phone number.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/customer/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStep("code");
      } else {
        setError(data.error || "Failed to request a code. Please try again.");
      }
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await fetch("/api/customer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        router.push(data.redirectTo || "/");
      } else {
        setError(data.error || "That code is invalid or has expired.");
      }
    });
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display text-ink mb-2">Phone OTP Login</h1>
        <p className="text-sm text-muted">Sign in with your phone number</p>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {step === "phone" ? (
        <form onSubmit={handleRequestCode} className="space-y-5 mb-3">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5 stroke-[1.5]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full h-12 pl-12 pr-4 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-[#2d2520] hover:bg-primary text-white font-semibold tracking-widest text-sm rounded-none transition-colors mt-1 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Please wait..." : "REQUEST CODE"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-5 mb-3">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]{5}"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter the 5-digit code"
              className="w-full h-12 px-4 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60 text-center tracking-[0.5em]"
              required
            />
            <p className="text-xs text-muted mt-2">
              Demo code:{" "}
              <span className="text-[#a46e38] font-semibold">12345</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-[#2d2520] hover:bg-primary text-white font-semibold tracking-widest text-sm rounded-none transition-colors mt-1 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Please wait..." : "VERIFY"}
          </button>

          <button
            type="button"
            onClick={() => setStep("phone")}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-[#a46e38] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to phone number
          </button>
        </form>
      )}
    </>
  );
}
