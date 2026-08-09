import Image from "next/image";
import { siteConfig } from "@/content/site";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        
        {/* Inner static circle with logo */}
        <div className="absolute inset-2 rounded-full bg-surface flex items-center justify-center overflow-hidden shadow-sm">
           <div className="relative w-20 h-20 flex items-center justify-center">
             <Image
               src={siteConfig.logo}
               alt="Loading..."
               className="object-contain"
             />
           </div>
        </div>
      </div>
    </div>
  );
}
