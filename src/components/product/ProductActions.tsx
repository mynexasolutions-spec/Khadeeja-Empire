"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useUI } from "@/hooks/useUI";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
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
          <label className="text-sm font-medium text-ink" htmlFor="size-selector">
            Size {selectedSize && <span className="text-muted">— {selectedSize}</span>}
          </label>
          <div id="size-selector" className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
            {product.sizes.map((size) => (
              <button
                key={size}
                role="radio"
                aria-checked={selectedSize === size}
                onClick={() => {
                  setSelectedSize(size);
                  setError("");
                }}
                className={cn(
                  "min-w-[44px] min-h-[44px] px-4 border text-sm transition-colors",
                  selectedSize === size
                    ? "border-ink bg-ink text-surface-elevated"
                    : "border-border text-ink hover:border-ink"
                )}
              >
                {size}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-primary" role="alert">{error}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink" htmlFor="qty-selector">
          Quantity
        </label>
        <div id="qty-selector" className="flex items-center border border-border w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="w-11 h-11 flex items-center justify-center hover:text-primary transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
            className="w-11 h-11 flex items-center justify-center hover:text-primary transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={handleAddToBag} className="w-full">
          Add to Bag
        </Button>
        <Button href="/checkout" variant="outline" className="w-full">
          Buy Now
        </Button>
      </div>
    </div>
  );
}
