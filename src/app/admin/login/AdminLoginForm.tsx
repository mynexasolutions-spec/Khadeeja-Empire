"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, MoveRight } from "lucide-react";
import { loginAdmin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-[calc(100dvh-2rem)] items-center justify-center px-4 py-12 sm:px-6">
      <section
        aria-labelledby="admin-login-title"
        className="w-full max-w-[440px] border border-[#d7c7b7] bg-[#fffaf3] px-7 py-9 shadow-[0_18px_60px_rgba(75,47,31,0.11)] sm:px-10 sm:py-11"
      >
        <div className="mb-9 border-b border-[#d7c7b7] pb-7">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8f4338]">
            Khadeeja Empire
          </p>
          <p className="font-display text-3xl leading-none tracking-[-0.03em] text-[#2d2520]">
            The atelier desk
          </p>
          <p className="mt-3 text-sm leading-6 text-[#6e5e53]">Sign in to manage your store.</p>
        </div>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="next" value={next} />

          {state.error && (
            <div
              role="alert"
              className="border border-[#c9968e] bg-[#fbebe7] px-4 py-3 text-sm leading-5 text-[#7a1f1f]"
            >
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#2d2520]">
              Email address
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="min-h-12 w-full border border-[#c4b2a1] bg-[#fffdf9] px-4 text-sm text-[#2d2520] outline-none transition focus:border-[#8f4338] focus:ring-2 focus:ring-[#ad8150]/30"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#2d2520]">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="min-h-12 w-full border border-[#c4b2a1] bg-[#fffdf9] px-4 pr-12 text-sm text-[#2d2520] outline-none transition focus:border-[#8f4338] focus:ring-2 focus:ring-[#ad8150]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-[#6e5e53] transition hover:text-[#8f4338]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#8f4338] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#6f302a] disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Checking access
              </>
            ) : (
              <>
                Enter admin
                <MoveRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
