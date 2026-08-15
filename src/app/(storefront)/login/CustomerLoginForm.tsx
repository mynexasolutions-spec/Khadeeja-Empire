"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { login, signup, resetPassword } from "./actions";
import { OtpLoginForm } from "./OtpLoginForm";

type AuthMode = "login" | "signup" | "forgot";
type AuthTab = "email" | "phone";

export function CustomerLoginForm({ next }: { next: string }) {
  const [tab, setTab] = useState<AuthTab>("email");
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (fullName) formData.append("fullName", fullName);
    if (next) formData.append("next", next);

    startTransition(async () => {
      if (mode === "login") {
        const res = await login(formData);
        if (res?.error) setError(res.error);
      } else if (mode === "signup") {
        const res = await signup(formData);
        if (res?.error) setError(res.error);
        if (res?.success) setSuccess(res.success);
      } else if (mode === "forgot") {
        const res = await resetPassword(formData);
        if (res?.error) setError(res.error);
        if (res?.success) setSuccess(res.success);
      }
    });
  };

  const toggleMode = () => setMode(mode === "login" ? "signup" : "login");

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-[480px] bg-white border border-border px-8 py-8 shadow-sm rounded-none">
        
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 mb-8">
          <button
            type="button"
            onClick={() => setTab("email")}
            className={`h-10 text-sm font-semibold tracking-widest uppercase rounded-none border transition-colors ${
              tab === "email"
                ? "bg-[#2d2520] text-white border-[#2d2520]"
                : "bg-white text-muted border-border hover:text-ink"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setTab("phone")}
            className={`h-10 text-sm font-semibold tracking-widest uppercase rounded-none border transition-colors ${
              tab === "phone"
                ? "bg-[#2d2520] text-white border-[#2d2520]"
                : "bg-white text-muted border-border hover:text-ink"
            }`}
          >
            Phone OTP
          </button>
        </div>

        {tab === "email" ? (
        <>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-ink mb-2">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h1>
          <p className="text-sm text-muted">
            {mode === "login" && "Login to continue to your account"}
            {mode === "signup" && "Join Khadeeja Empire and shop your favorites"}
            {mode === "forgot" && "Enter your email address to receive a password reset link."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-3">
          
          {/* Full Name (Signup only) */}
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-ink">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5 stroke-[1.5]" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full h-12 pl-12 pr-4 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60"
                  required
                />
              </div>
            </div>
          )}

          {/* Email (All modes) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5 stroke-[1.5]" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full h-12 pl-12 pr-4 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60"
                required
              />
            </div>
          </div>

          {/* Password (Login & Signup only) */}
          {mode !== "forgot" && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-ink">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5 stroke-[1.5]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "login" ? "Enter your password" : "Create a password"} 
                  className="w-full h-12 pl-12 pr-12 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 stroke-[1.5]" /> : <Eye className="h-5 w-5 stroke-[1.5]" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-muted flex items-center gap-1.5 mt-2">
                  <span className="text-[#a46e38] border border-[#a46e38] rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold">✓</span>
                  Password must be at least 6 characters
                </p>
              )}
            </div>
          )}

          {/* Forgot Password & Remember me (Login only) */}
          {mode === "login" && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary" />
                <span className="text-sm text-ink">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => setMode("forgot")}
                className="text-sm text-[#a46e38] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full h-12 bg-[#2d2520] hover:bg-primary text-white font-semibold tracking-widest text-sm rounded-none transition-colors mt-1 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Please wait..." : (
              <>
                {mode === "login" && "LOGIN"}
                {mode === "signup" && "SIGN UP"}
                {mode === "forgot" && "SEND RESET LINK"}
              </>
            )}
          </button>

        </form>

        {/* Footer Toggle */}
        <p className="text-center text-sm text-ink mt-8">
          {mode === "login" && "Don't have an account? "}
          {mode === "signup" && "Already have an account? "}
          {mode === "forgot" && "Remembered your password? "}
          
          <button 
            onClick={() => setMode(mode === "login" ? "signup" : "login")} 
            className="text-[#a46e38] font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>
        </>
        ) : (
          <OtpLoginForm next={next} />
        )}

      </section>
    </main>
  );
}

