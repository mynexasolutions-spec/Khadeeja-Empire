"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, itemCount, removeItem, updateQuantity, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return <p className="text-muted py-12 text-center">Loading your bag…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <ShoppingBag size={48} className="text-muted" />
        <div>
          <p className="text-h3 text-ink mb-2">Your bag is empty</p>
          <p className="text-muted">Discover our latest collections and find something you love.</p>
        </div>
        <Button href="/shop">Explore Shop</Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 py-6 first:pt-0">
              <Link
                href={`/products/${item.product.slug}`}
                className="relative w-28 h-36 flex-shrink-0 overflow-hidden bg-surface"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-display text-lg text-ink hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-muted">Size: {item.size}</span>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.product.name}`}
                    className="text-muted hover:text-primary p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
                <span className="text-sm font-medium text-ink">
                  {formatPrice(item.product.price, item.product.currency)}
                </span>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 flex items-center justify-center hover:text-primary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-9 h-9 flex items-center justify-center hover:text-primary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={clearCart}
          className="mt-6 text-sm text-muted hover:text-primary transition-colors link-underline"
        >
          Clear bag
        </button>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-surface p-6 flex flex-col gap-4 sticky top-24">
          <h2 className="text-h3">Order Summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Items ({itemCount})</span>
            <span className="text-ink font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Shipping</span>
            <span className="text-ink">Calculated at checkout</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between">
            <span className="font-medium text-ink">Subtotal</span>
            <span className="font-display text-xl text-ink">{formatPrice(subtotal)}</span>
          </div>
          <Button href="/checkout" className="w-full">Proceed to Checkout</Button>
          <Link href="/shop" className="text-sm text-center text-ink hover:text-primary transition-colors link-underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
