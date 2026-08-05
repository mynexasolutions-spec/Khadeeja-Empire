import { StoreShell } from "@/components/layout/StoreShell";
import { getDataProvider } from "@/lib/data";
import { toStorefrontCategory, toStorefrontProduct } from "@/lib/storefront/adapters";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = Date.now();
  const provider = getDataProvider();
  const [announcementRecords, productRecords, categoryRecords, discoveryRecords] = await Promise.all([
    provider.listAnnouncements({ active: true }),
    provider.listProducts({ active: true }),
    provider.listCategories({ active: true }),
    provider.listDiscoveryMenuEntries({ active: true }),
  ]);
  const announcements = announcementRecords
    .filter((item) => {
      const startsAt = item.startsAt ? Date.parse(item.startsAt) : null;
      const endsAt = item.endsAt ? Date.parse(item.endsAt) : null;
      return (!startsAt || startsAt <= now) && (!endsAt || endsAt > now);
    })
    .map((item) => item.text);

  const categories = categoryRecords.map(toStorefrontCategory);
  const discoveryLinks = discoveryRecords.map((entry) => ({ label: entry.label, href: entry.href }));
  return <StoreShell announcements={announcements} products={productRecords.map(toStorefrontProduct)} categories={categories} discoveryLinks={discoveryLinks}>{children}</StoreShell>;
}
