import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority }: ProductCardProps) {
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-product overflow-hidden bg-surface"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority={priority}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-surface-elevated/95 text-ink text-xs uppercase tracking-wider px-3 py-1 font-medium">
            {product.badge === "new" && "New"}
            {product.badge === "featured" && "Featured"}
            {product.badge === "sale" && "Sale"}
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-1 pt-3">
        <span className="text-xs uppercase tracking-wide text-muted">
          {product.category.replace(/-/g, " ")}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-lg text-ink hover:text-primary transition-colors leading-snug"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-ink font-medium">{formatPrice(product.price, product.currency)}</span>
          {product.priceStatus === "demo" && (
            <span className="text-xs text-muted">(Demo price)</span>
          )}
        </div>
      </div>
    </article>
  );
}