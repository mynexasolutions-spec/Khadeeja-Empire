"use client";

import { useState } from "react";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
});

export function CheckoutForm() {
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", pincode: "",
  });

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
    setPlaced(true);
    clearCart();
  };

  if (!isHydrated) {
    return <p className="text-muted py-12 text-center">Loading…</p>;
  }

  if (placed) {
    return (
      <div className="max-w-md mx-auto text-center py-16 flex flex-col gap-4">
        <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-h2 text-ink">Order Confirmed</h2>
        <p className="text-muted">Thank you for your order. A confirmation email will be sent shortly.</p>
        <p className="text-xs text-muted bg-surface p-4 border border-border">
          Frontend prototype: no real order was placed and no payment was processed.
        </p>
        <Button href="/shop" variant="outline" className="mt-4">Continue Shopping</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col gap-4">
        <p className="text-h3 text-ink">Your bag is empty</p>
        <Button href="/shop">Explore Shop</Button>
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
        className="px-4 py-3 border border-border bg-surface focus:border-ink outline-none transition-colors"
      />
      {errors[name] && <p id={`${name}-error`} className="text-sm text-primary" role="alert">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-4">
          <h2 className="text-h3">Contact Details</h2>
          {field("name", "Full Name")}
          {field("email", "Email", "email")}
          {field("phone", "Phone Number", "tel")}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-h3">Shipping Address</h2>
          {field("address", "Street Address")}
          <div className="grid sm:grid-cols-2 gap-4">
            {field("city", "City")}
            {field("pincode", "Pincode")}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-h3">Payment</h2>
          <div className="p-6 border border-border bg-surface">
            <p className="text-sm text-muted">
              This is a frontend prototype. No real payment will be processed.
              Do not enter real payment information.
            </p>
          </div>
        </div>
        <Button type="submit" className="w-full">Place Demo Order</Button>
      </form>

      <div className="lg:col-span-1">
        <div className="bg-surface p-6 flex flex-col gap-4 sticky top-24">
          <h2 className="text-h3">Order Summary</h2>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between text-sm">
                <span className="text-muted">{item.product.name} × {item.quantity}</span>
                <span className="text-ink font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4 flex justify-between">
            <span className="font-medium text-ink">Total</span>
            <span className="font-display text-xl text-ink">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
