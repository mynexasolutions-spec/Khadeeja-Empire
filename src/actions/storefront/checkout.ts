"use server";

import { z } from "zod";
import { ConflictError } from "../../lib/admin/errors";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { getDataProvider } from "../../lib/data";
import {
  buildCheckoutQuote,
  checkoutAddress,
  checkoutInputSchema,
  checkoutOrderNumber,
  CheckoutError,
  previewCoupon,
  publicOrder,
  type CheckoutInput,
  type CouponPreviewResult,
} from "./checkout-core";

export type CheckoutActionResult =
  | { ok: true; order: ReturnType<typeof publicOrder>; replayed: boolean }
  | {
      ok: false;
      code: "VALIDATION" | "UNAUTHENTICATED" | "CART" | "PROVIDER";
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function previewCouponAction(code: string, subtotal: number): Promise<CouponPreviewResult> {
  try {
    return await previewCoupon(getDataProvider(), code, subtotal);
  } catch {
    return { valid: false, message: "We could not check that coupon right now. Please try again." };
  }
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutActionResult> {
  const parsed = checkoutInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Check the highlighted checkout details and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let userEmail: string;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return { ok: false, code: "UNAUTHENTICATED", message: "Sign in to place your order." };
    }
    userEmail = user.email;
  } catch {
    return { ok: false, code: "PROVIDER", message: "Checkout configuration is unavailable." };
  }

  const provider = getDataProvider();
  const customers = await provider.listCustomers({ search: userEmail });
  const customer = customers.find((c) => c.email === userEmail);
  if (!customer || !customer.phone) {
    return { ok: false, code: "UNAUTHENTICATED", message: "Your customer profile is incomplete. Please contact support." };
  }
  const session = { customerId: customer.id, phone: customer.phone };

  const orderNumber = checkoutOrderNumber(session.customerId, parsed.data.idempotencyKey);
  try {
    const existing = await provider.getOrder(orderNumber);
    if (existing) {
      if (existing.customerId !== session.customerId) {
        return { ok: false, code: "PROVIDER", message: "This checkout attempt could not be verified." };
      }
      return { ok: true, order: publicOrder(existing), replayed: true };
    }

    await provider.updateCustomer(session.customerId, {
      name: parsed.data.customer.name,
      email: parsed.data.customer.email,
      phone: session.phone,
      status: "active",
    });

    const quote = await buildCheckoutQuote(provider, parsed.data);
    const address = checkoutAddress(
      session.customerId,
      session.phone,
      parsed.data.customer.name,
      parsed.data.shippingAddress,
      orderNumber
    );
    const order = await provider.createOrder({
      orderNumber,
      customerId: session.customerId,
      status: "confirmed",
      paymentStatus: "pending",
      paymentMethod: "cod",
      currency: quote.currency,
      subtotal: quote.subtotal,
      shipping: quote.shipping,
      discount: quote.discount,
      total: quote.total,
      couponCode: quote.couponCode,
      shippingAddress: address,
      billingAddress: address,
      notes: parsed.data.notes ?? null,
      items: quote.items,
    });
    if (quote.couponId) {
      await provider.incrementCouponUse(quote.couponId);
    }
    return { ok: true, order: publicOrder(order), replayed: false };
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { ok: false, code: "CART", message: error.message };
    }
    if (error instanceof ConflictError) {
      try {
        const existing = await getDataProvider().getOrder(orderNumber);
        if (existing?.customerId === session.customerId) {
          return { ok: true, order: publicOrder(existing), replayed: true };
        }
      } catch {
        // The stable generic error below covers a failed conflict lookup.
      }
    }
    if (error instanceof z.ZodError) {
      return { ok: false, code: "VALIDATION", message: "The checkout details are invalid." };
    }
    return { ok: false, code: "PROVIDER", message: "We could not place your order. Please try again." };
  }
}
