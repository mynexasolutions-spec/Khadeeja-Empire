import type { Metadata } from "next";
import { getDataProvider } from "@/lib/data";
import WishlistClient from "./WishlistClient";

import { toStorefrontProduct } from "@/lib/storefront/adapters";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage your saved items.",
};

export const dynamic = "force-dynamic";

export default function WishlistPage() {
  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-6 md:pt-10">
      <WishlistClient />
    </div>
  );
}
