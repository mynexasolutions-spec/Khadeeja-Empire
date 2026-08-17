import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { getCurrentCustomer } from "@/lib/auth/customer";

export const metadata: Metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();

  return (
    <div className="py-4 md:py-8">
      <Container>
        <CheckoutForm lockedEmail={customer?.email ?? null} />
      </Container>
    </div>
  );
}
