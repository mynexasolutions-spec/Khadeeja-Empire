import { Flower2, Shirt, Sun, Scissors, Coffee, Plane, Minus, Sparkles } from "lucide-react";
import type { ProductTag } from "@/types";

interface StyleDetailsProps {
  tags: ProductTag[];
}

const TAG_ICON_MAP: Record<string, typeof Flower2> = {
  Floral: Flower2,
  "Ethnic Wear": Shirt,
  "Summer Friendly": Sun,
  "Statement Piece": Scissors,
  Casual: Coffee,
  Travel: Plane,
  Minimal: Minus,
  "Banaras-inspired": Sparkles,
  Paisley: Sparkles,
  White: Minus,
  Halter: Shirt,
  "Indo-Western": Shirt,
  Summer: Sun,
  Statement: Scissors,
};

export function StyleDetails({ tags }: StyleDetailsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mt-6 rounded-md border border-border bg-surface p-5">
      <h4 className="font-display text-lg text-ink mb-4">Style Details</h4>
      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => {
          const Icon = TAG_ICON_MAP[tag] ?? Sparkles;
          return (
            <span
              key={tag}
              className="inline-flex items-center gap-2 text-[0.8125rem] text-ink"
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                style={{ color: "var(--color-maroon)" }}
              />
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
