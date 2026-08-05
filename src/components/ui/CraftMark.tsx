import type { SVGProps } from "react";

type CraftMarkTone = "indigo" | "turmeric" | "madder" | "leaf";

interface CraftMarkProps extends SVGProps<SVGSVGElement> {
  tone?: CraftMarkTone;
}

export function CraftMark({ tone = "turmeric", className, ...props }: CraftMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className ? `craft-mark ${className}` : "craft-mark"}
      data-tone={tone}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="32" cy="32" r="7" />
      <path d="M32 7v13M32 44v13M7 32h13M44 32h13" />
      <path d="m14.3 14.3 9.2 9.2M40.5 40.5l9.2 9.2M49.7 14.3l-9.2 9.2M23.5 40.5l-9.2 9.2" />
      <path d="M32 25c-3.2 2.2-4.8 4.5-4.8 7s1.6 4.8 4.8 7c3.2-2.2 4.8-4.5 4.8-7S35.2 27.2 32 25Z" />
    </svg>
  );
}
