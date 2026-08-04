"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useUI } from "@/hooks/useUI";
import { useCart } from "@/hooks/useCart";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { openDrawer, closeDrawer } = useUI();
  const { items, subtotal, itemCount, removeItem, updateQuantity, isHydrated } =
    useCart();

  const open = openDrawer === "cart";

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      side="right"
      title={`Shopping Bag${itemCount > 0 ? ` (${itemCount})` : ""}`}
      ariaLabel="Shopping bag"
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="text-lg font-medium text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-muted">
              Shipping and taxes calculated at checkout.
            </p>
            <Button href="/checkout" className="w-full" onClick={closeDrawer}>
              Proceed to Checkout
            </Button>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="text-sm text-center text-ink hover:text-primary transition-colors link-underline"
            >
              View Full Bag
            </Link>
          </div>
        ) : undefined
      }
    >
      <div className="p-6" aria-live="polite" aria-atomic="false">
        {!isHydrated && (
          <p className="text-muted text-sm py-8 text-center">Loading bag…</p>
        )}

        {isHydrated && items.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <ShoppingBag size={40} className="text-muted" />
            <div>
              <p className="font-display text-xl text-ink mb-1">
                Your bag is empty
              </p>
              <p className="text-sm text-muted">
                Discover our latest collections
              </p>
            </div>
            <Button href="/shop" variant="outline" onClick={closeDrawer}>
              Explore Shop
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4">
                <Link
                  href={`/products/${item.product.slug}`}
                  onClick={closeDrawer}
                  className="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-surface"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeDrawer}
                      className="font-display text-base text-ink hover:text-primary transition-colors leading-snug"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.product.name} from bag`}
                      className="text-muted hover:text-primary transition-colors flex-shrink-0 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-muted">Size: {item.size}</span>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(item.product.price, item.product.currency)}
                  </span>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.key, item.quantity - 1)
                        }
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        className="p-1.5 text-ink hover:text-primary transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className="px-3 text-sm font-medium min-w-[32px] text-center"
                        aria-label={`Quantity: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                        aria-label={`Increase quantity of ${item.product.name}`}
                        className="p-1.5 text-ink hover:text-primary transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Drawer>
  );
}