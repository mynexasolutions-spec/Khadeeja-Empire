"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useUI } from "@/hooks/useUI";
import { useWishlist } from "@/hooks/useWishlist";
import type { CustomerSummary } from "./Header";

export function MobileBottomNav({ customer }: { customer: CustomerSummary }) {
  const pathname = usePathname();
  const accountHref = customer ? "/account/orders" : "/login";
  const { openSearch } = useUI();
  const { itemCount } = useWishlist();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 pb-safe shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-[56px] px-1 sm:px-2">
        <Link 
          href="/" 
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-0.5 ${pathname === '/' ? 'text-ink' : 'text-muted hover:text-ink transition-colors'}`}
        >
          <Home size={22} strokeWidth={pathname === '/' ? 1.75 : 1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wide relative pb-0.5">
            Home
            {pathname === '/' && <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#a46e38] rounded-full" />}
          </span>
        </Link>
        
        <button 
          onClick={openSearch} 
          className="relative flex flex-col items-center justify-center w-full h-full space-y-0.5 text-muted hover:text-ink transition-colors"
        >
          <Search size={22} strokeWidth={1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wide relative pb-0.5">
            Search
          </span>
        </button>

        <Link 
          href="/shop" 
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-0.5 ${pathname === '/shop' || pathname.startsWith('/category/') ? 'text-ink' : 'text-muted hover:text-ink transition-colors'}`}
        >
          <ShoppingBag size={22} strokeWidth={pathname === '/shop' || pathname.startsWith('/category/') ? 1.75 : 1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wide relative pb-0.5">
            Shop
            {(pathname === '/shop' || pathname.startsWith('/category/')) && <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#a46e38] rounded-full" />}
          </span>
        </Link>

        <Link 
          href="/wishlist" 
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-0.5 ${pathname === '/wishlist' ? 'text-ink' : 'text-muted hover:text-ink transition-colors'}`}
        >
          <div className="relative">
            <Heart size={22} strokeWidth={pathname === '/wishlist' ? 1.75 : 1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#a46e38] text-white text-[9px] font-bold px-1 py-0.5 rounded-full flex items-center justify-center min-w-[16px]">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wide relative pb-0.5">
            Wishlist
            {pathname === '/wishlist' && <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#a46e38] rounded-full" />}
          </span>
        </Link>

        <Link
          href={accountHref}
          className={`relative flex flex-col items-center justify-center w-full h-full space-y-0.5 ${pathname === '/login' || pathname.startsWith('/account') ? 'text-ink' : 'text-muted hover:text-ink transition-colors'}`}
        >
          <User size={22} strokeWidth={pathname === '/login' || pathname.startsWith('/account') ? 1.75 : 1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wide relative pb-0.5">
            {customer ? "Account" : "Person"}
            {(pathname === '/login' || pathname.startsWith('/account')) && <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#a46e38] rounded-full" />}
          </span>
        </Link>
      </div>
    </div>
  );
}
