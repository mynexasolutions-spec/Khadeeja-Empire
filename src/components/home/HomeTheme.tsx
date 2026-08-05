import type { ReactNode } from "react";

interface HomeThemeProps {
  children: ReactNode;
  className?: string;
}

export function HomeTheme({ children, className }: HomeThemeProps) {
  return (
    <div
      className={className ? `home-theme ${className}` : "home-theme"}
      data-theme="sun-dyed-atelier"
      data-testid="home-theme"
    >
      {children}
    </div>
  );
}
