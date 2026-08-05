import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="py-12 md:py-16">
      <Container>
        <h1 className="text-h1 text-ink mb-8">Checkout</h1>
        <CheckoutForm />
      </Container>
    </div>
  );
}
