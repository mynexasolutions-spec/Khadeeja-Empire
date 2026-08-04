"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  className?: string;
}

export function ImageWithFallback({
  fallbackSrc = "/assets/logo.png",
  className,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      src={error ? fallbackSrc : props.src}
      onError={() => setError(true)}
      className={cn(className)}
    />
  );
}
