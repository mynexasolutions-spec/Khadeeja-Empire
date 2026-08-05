import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Bag",
};

export default function CartPage() {
  return (
    <div className="py-12 md:py-16">
      <Container>
        <h1 className="text-h1 text-ink mb-8">Shopping Bag</h1>
        <CartView />
      </Container>
    </div>
  );
}
