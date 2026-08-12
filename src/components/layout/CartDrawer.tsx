"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useUI } from "@/hooks/useUI";
import { useCart } from "@/hooks/useCart";
import { Drawer } from "@/components/ui/Drawer";
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
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[15px] font-medium text-ink">Subtotal</span>
              <span className="text-[17px] font-bold text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-muted mb-3">
              Shipping and taxes calculated at checkout.
            </p>
            
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2 w-full bg-[#a27b53] text-white rounded-md py-2.5 md:py-3 text-[11px] md:text-[12px] font-bold tracking-[0.1em] hover:bg-[#8b6845] transition-colors shadow-sm hover:shadow-md mt-3"
            >
              <ShoppingBag size={14} />
              SECURE CHECKOUT
            </Link>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-[#d8b88d]/30" />
              <span className="text-[11px] text-muted lowercase">or</span>
              <div className="flex-1 h-[1px] bg-[#d8b88d]/30" />
            </div>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2 w-full bg-transparent border border-[#d8b88d]/50 text-ink rounded-md py-2.5 md:py-3 text-[11px] md:text-[12px] font-bold tracking-[0.1em] hover:bg-[#fcfaf7] transition-colors"
            >
              <ShoppingBag size={14} />
              VIEW FULL BAG
            </Link>
          </div>
        ) : undefined
      }
    >
      <div className="p-0" aria-live="polite" aria-atomic="false">
        {!isHydrated && (
          <p className="text-muted text-sm py-8 text-center">Loading bag…</p>
        )}

        {isHydrated && items.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
            <ShoppingBag size={40} className="text-muted/60" />
            <div>
              <p className="font-display text-xl text-ink mb-1">
                Your bag is empty
              </p>
              <p className="text-sm text-muted">
                Discover our latest collections
              </p>
            </div>
            <Link 
              href="/shop" 
              onClick={closeDrawer}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-[#2d2520] hover:bg-primary !text-white transition-colors duration-300 font-semibold text-xs tracking-widest uppercase mt-4"
            >
              Explore Shop
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <ul className="flex flex-col divide-y divide-[#d8b88d]/20 px-5">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-3 sm:py-4">
                <Link
                  href={`/products/${item.product.slug}`}
                  onClick={closeDrawer}
                  className="relative w-[84px] h-[104px] flex-shrink-0 overflow-hidden bg-surface rounded-md border border-[#d8b88d]/20"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="84px"
                    className="object-cover"
                  />
                </Link>
                
                <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeDrawer}
                      className="font-display text-base md:text-[17px] font-semibold text-ink hover:text-[#a27b53] transition-colors leading-tight line-clamp-2 pr-2"
                      title={item.product.name}
                    >
                      {item.product.name.length > 30 ? `${item.product.name.substring(0, 30)}...` : item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.product.name} from bag`}
                      className="text-muted hover:text-red-500 transition-colors flex-shrink-0 p-1.5 border border-[#d8b88d]/30 rounded-md bg-white shadow-sm active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <span className="text-[11px] text-muted mb-0.5">Size: {item.size}</span>
                  <span className="text-sm font-bold text-ink mb-2">
                    {formatPrice(item.product.price, item.product.currency)}
                  </span>
                  
                  <div className="flex items-center border border-[#d8b88d]/40 rounded-md w-fit bg-white">
                    <button
                      onClick={() =>
                        updateQuantity(item.key, item.quantity - 1)
                      }
                      aria-label={`Decrease quantity of ${item.product.name}`}
                      className="w-7 h-7 text-ink hover:text-[#a27b53] transition-colors flex items-center justify-center active:bg-gray-50"
                    >
                      <Minus size={12} strokeWidth={2.5} />
                    </button>
                    <span
                      className="w-7 text-[12px] font-medium text-center"
                      aria-label={`Quantity: ${item.quantity}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.key, item.quantity + 1)
                      }
                      aria-label={`Increase quantity of ${item.product.name}`}
                      className="w-7 h-7 text-ink hover:text-[#a27b53] transition-colors flex items-center justify-center active:bg-gray-50"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                    </button>
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