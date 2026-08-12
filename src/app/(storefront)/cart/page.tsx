import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Bag",
};

export default function CartPage() {
  return (
    <div className="py-8 md:py-12 bg-[#fcfaf7] min-h-screen">
      <Container>
        <nav className="flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium tracking-wide text-muted mb-4 md:mb-6">
          <Link href="/" className="hover:text-[#a27b53] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="opacity-40" />
          <span className="text-[#a27b53]">Cart</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
          <h1 className="text-3xl md:text-[40px] font-display font-medium text-ink">Shopping Bag</h1>
          <div className="flex items-center gap-2 text-[#a27b53]">
            <ShieldCheck size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium text-ink/80">Secure 100% safe & secure checkout</span>
          </div>
        </div>
        <CartView />
      </Container>
    </div>
  );
}
