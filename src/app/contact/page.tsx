import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/layout/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Khadeeja Empire.",
};

export default function ContactPage() {
  return (
    <div className="py-12 md:py-16">
      <Container className="max-w-2xl">
        <h1 className="text-h1 text-ink mb-4">Get in Touch</h1>
        <p className="text-muted mb-10">
          Have a question about a product, an order, or a collaboration? We would love to hear from you.
        </p>
        <ContactForm />
      </Container>
    </div>
  );
}
