import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { getDataProvider } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping & Returns",
};

export const dynamic = "force-dynamic";

export default async function ShippingReturnsPage() {
  const rates = await getDataProvider().listShippingRates({ active: true });
  const rate = rates[0];
  const shippingCopy = rate
    ? `${rate.name} costs ${formatPrice(rate.amount)}${rate.freeAbove != null ? `, with complimentary shipping on orders above ${formatPrice(rate.freeAbove)}` : ""}. ${rate.codAvailable ? "Cash on delivery is available." : "Cash on delivery is not currently available."}`
    : "Available delivery options and charges are shown securely during checkout.";
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-2xl">
        <h1 className="text-h1 text-ink mb-4">Shipping & Returns</h1>
        <p className="text-muted mb-10">Current delivery guidance and garment care information.</p>
        <Accordion
          items={[
            {
              title: "Shipping",
              content: (
                <p>
                  {shippingCopy} Orders are processed and dispatched from our studio in Banaras.
                </p>
              ),
              defaultOpen: true,
            },
            {
              title: "Returns & Exchanges",
              content: (
                <p>
                  We want you to love every piece. If you are not completely satisfied, returns
                  and exchange policies will be finalized with the client. Please reach out via
                  our contact page for any concerns.
                </p>
              ),
            },
            {
              title: "Care Instructions",
              content: (
                <p>
                  To preserve the quality of your garments, we recommend gentle hand wash or
                  dry clean for embroidered pieces. Specific care instructions for each product
                  will be confirmed by the client.
                </p>
              ),
            },
            {
              title: "Sizing & Fit",
              content: (
                <p>
                  Our sizes range from XS to XL. For detailed measurements and fit guidance,
                  please refer to the product description or contact us directly.
                </p>
              ),
            },
          ]}
        />
      </Container>
    </div>
  );
}
