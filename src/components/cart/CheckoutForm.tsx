"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { placeDemoOrder, type CheckoutActionResult } from "@/actions/storefront/checkout";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  address2: z.string(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(4, "Valid pincode is required"),
  couponCode: z.string(),
});

type Confirmation = Extract<CheckoutActionResult, { ok: true }>["order"];

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [pending, startTransition] = useTransition();
  const attemptKey = useRef<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", address2: "", city: "", state: "", pincode: "", couponCode: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.errors.forEach((error) => { if (error.path[0]) nextErrors[String(error.path[0])] = error.message; });
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    if (!attemptKey.current) attemptKey.current = crypto.randomUUID();
    startTransition(async () => {
      const result = await placeDemoOrder({
        idempotencyKey: attemptKey.current,
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, size: item.size || undefined })),
        customer: { name: parsed.data.name, email: parsed.data.email },
        shippingAddress: { line1: parsed.data.address, line2: parsed.data.address2 || undefined, city: parsed.data.city, state: parsed.data.state, postalCode: parsed.data.pincode, country: "IN" },
        couponCode: parsed.data.couponCode || undefined,
      });
      if (!result.ok) {
        if (result.code === "UNAUTHENTICATED") {
          router.push("/login?next=/checkout");
          return;
        }
        setSubmitError(result.message);
        if (result.fieldErrors) setErrors(Object.fromEntries(Object.entries(result.fieldErrors).map(([key, value]) => [key, value?.[0] || "Invalid value"])));
        return;
      }
      setConfirmation(result.order);
      clearCart();
    });
  };

  if (!isHydrated) return <p className="py-12 text-center text-muted">Loading…</p>;
  if (confirmation) return <div className="mx-auto flex max-w-md flex-col gap-4 py-16 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div><h2 className="text-h2 text-ink">Order confirmed</h2><p className="text-muted">Your demo order <strong className="text-ink">#{confirmation.orderNumber}</strong> has been saved.</p><p className="border border-border bg-surface p-4 text-sm text-muted">Mock payment successful. No real payment method or financial details were collected. Total: {formatPrice(confirmation.total, confirmation.currency)}</p><Button href="/shop" variant="outline" className="mt-4">Continue shopping</Button></div>;
  if (items.length === 0) return <div className="flex flex-col gap-4 py-16 text-center"><p className="text-h3 text-ink">Your bag is empty</p><Button href="/shop">Explore shop</Button></div>;

  const field = (name: keyof typeof form, label: string, type = "text") => <div className="flex flex-col gap-1.5"><label htmlFor={name} className="text-sm font-medium text-ink">{label}</label><input id={name} name={name} type={type} value={form[name]} onChange={(event)=>setForm({...form,[name]:event.target.value})} aria-invalid={!!errors[name]} aria-describedby={errors[name]?`${name}-error`:undefined} className="border border-border bg-surface px-4 py-3 outline-none transition-colors focus:border-ink"/>{errors[name]&&<p id={`${name}-error`} className="text-sm text-primary" role="alert">{errors[name]}</p>}</div>;

  return <div className="grid gap-8 lg:grid-cols-3"><form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-2" noValidate><div className="flex flex-col gap-4"><h2 className="text-h3">Contact details</h2>{field("name","Full name")}{field("email","Email","email")}{field("phone","Phone number","tel")}</div><div className="flex flex-col gap-4"><h2 className="text-h3">Shipping address</h2>{field("address","Street address")}{field("address2","Apartment, suite, etc. (optional)")}<div className="grid gap-4 sm:grid-cols-3">{field("city","City")}{field("state","State")}{field("pincode","Pincode")}</div></div><div className="flex flex-col gap-4"><h2 className="text-h3">Offer</h2>{field("couponCode","Coupon code (optional)")}<div className="border border-border bg-surface p-6"><p className="text-sm text-muted">Demo payment only. No card, bank, UPI, or other real payment details are requested.</p></div></div>{submitError&&<p className="border border-primary/30 bg-surface p-4 text-sm text-primary" role="alert">{submitError}</p>}<Button type="submit" className="w-full" disabled={pending}>{pending?"Placing demo order…":"Place demo order"}</Button></form><div className="lg:col-span-1"><div className="sticky top-24 flex flex-col gap-4 bg-surface p-6"><h2 className="text-h3">Order summary</h2><ul className="flex flex-col gap-3">{items.map(item=><li key={item.key} className="flex justify-between text-sm"><span className="text-muted">{item.product.name} × {item.quantity}</span><span className="font-medium text-ink">{formatPrice(item.product.price*item.quantity)}</span></li>)}</ul><div className="flex justify-between border-t border-border pt-4"><span className="font-medium text-ink">Estimated subtotal</span><span className="font-display text-xl text-ink">{formatPrice(subtotal)}</span></div><p className="text-xs text-muted">Shipping and coupon discounts are calculated securely when the order is placed.</p></div></div></div>;
}
