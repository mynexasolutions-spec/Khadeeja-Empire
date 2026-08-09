"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/content/site";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for exactly 1.6 seconds on every route change
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-300">
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Outer spinning circle */}
          <div className="absolute inset-0 rounded-full border-2 border-border border-t-primary animate-spin"></div>
          
          {/* Inner static circle with logo */}
          <div className="absolute inset-2 rounded-full bg-surface flex items-center justify-center overflow-hidden shadow-sm">
             <div className="relative w-20 h-20 flex items-center justify-center">
               <Image
                 src={siteConfig.logo}
                 alt="Loading..."
                 fill
                 className="object-contain p-2"
               />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="animate-in fade-in duration-500">{children}</div>;
}
