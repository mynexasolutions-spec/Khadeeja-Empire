"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function IconButton({
  children,
  onClick,
  className,
  ariaLabel,
  type = "button",
  disabled,
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-ink transition-colors duration-200 hover:text-primary disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}