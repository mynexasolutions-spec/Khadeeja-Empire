import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const sizeMap: Record<Size, string> = {
  sm: "text-xs px-4 py-2.5 min-h-[36px]",
  md: "text-sm px-6 py-3 min-h-[44px]",
  lg: "text-sm px-8 py-4 min-h-[52px]",
};

const variantMap: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-primary transition-colors",
  outline:
    "bg-transparent text-ink border border-border-strong hover:border-ink hover:bg-surface transition-colors",
  ghost: "bg-transparent text-ink hover:text-primary transition-colors",
};

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  type?: never;
  onClick?: () => void;
  disabled?: never;
  ariaLabel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ariaLabel,
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-wide transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed",
    sizeMap[size],
    variantMap[variant],
    className
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes} aria-label={ariaLabel} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}