import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
  priorityCount?: number;
}

const colMap = {
  2: "grid-cols-2",
  3: "sm:grid-cols-2 md:grid-cols-3",
  4: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({
  products,
  className,
  columns = 4,
  priorityCount = 0,
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-x-4 gap-y-8 grid-cols-2", colMap[columns], className)}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}