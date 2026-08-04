import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.15em] text-muted font-medium">
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 max-w-2xl">{title}</h2>
      {description && (
        <p className="text-lead text-muted max-w-xl leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}