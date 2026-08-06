"use client";

import { useState } from "react";
import { ShoppingBag, Ruler, Scissors, Truck, RotateCcw } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUI } from "@/hooks/useUI";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart();
  const { openCart } = useUI();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleAddToBag = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    addItem(product, selectedSize || "One Size", quantity);
    showToast(`${product.name} added to your bag`);
    openCart();
  };

  return (
    <div className="flex flex-col gap-5">
      {product.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">Size</label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
            {product.sizes.map((size) => (
              <button
                key={size}
                role="radio"
                aria-checked={selectedSize === size}
                onClick={() => {
                  setSelectedSize(size);
                  setError("");
                }}
                className={`min-w-[44px] h-11 px-4 border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  selectedSize === size
                    ? "text-white"
                    : "border-border text-ink hover:border-[var(--color-maroon)]"
                }`}
                style={
                  selectedSize === size
                    ? {
                        backgroundColor: "var(--color-maroon)",
                        borderColor: "var(--color-maroon)",
                      }
                    : {}
                }
              >
                {size}
              </button>
            ))}
          </div>
          {error && (
            <p className="text-sm text-[var(--color-maroon)]" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-size-guide"))}
            className="inline-flex items-center gap-2 mt-1 text-[0.8125rem] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
            style={{ color: "var(--color-maroon)" }}
          >
            <Ruler size={16} strokeWidth={1.5} />
            Size Guide
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Quantity</label>
        <div className="inline-flex items-center border border-border rounded-sm mt-1 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="w-11 h-11 flex items-center justify-center text-lg text-ink hover:bg-surface transition-colors"
          >
            −
          </button>
          <span
            className="w-12 text-center text-sm font-medium text-ink"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
            className="w-11 h-11 flex items-center justify-center text-lg text-ink hover:bg-surface transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <button
          type="button"
          onClick={handleAddToBag}
          className="h-12 flex items-center justify-center gap-2 rounded-sm font-semibold text-sm uppercase tracking-wide text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          style={{
            backgroundColor: "var(--color-maroon)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-maroon-deep)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-maroon)")
          }
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          Add to Bag
        </button>
        <a
          href="/checkout"
          className="h-12 flex items-center justify-center gap-2 rounded-sm font-semibold text-sm uppercase tracking-wide border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          style={{
            borderColor: "var(--color-maroon)",
            color: "var(--color-maroon)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(122,31,31,0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Buy Now
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-2 py-4 px-5 rounded-md border border-border bg-surface">
        <div className="flex items-center gap-2">
          <Scissors size={18} strokeWidth={1.5} style={{ color: "var(--color-maroon)" }} />
          <span className="text-xs font-medium text-ink">Made to Order</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={18} strokeWidth={1.5} style={{ color: "var(--color-maroon)" }} />
          <span className="text-xs font-medium text-ink">7-10 Days Dispatch</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={18} strokeWidth={1.5} style={{ color: "var(--color-maroon)" }} />
          <span className="text-xs font-medium text-ink">Easy Returns</span>
        </div>
      </div>
    </div>
  );
}