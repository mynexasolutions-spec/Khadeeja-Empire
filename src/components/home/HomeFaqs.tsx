import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqRecord } from "@/lib/admin/types";

export function HomeFaqs({ faqs }: { faqs: FaqRecord[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="bg-surface py-10 md:py-14" aria-labelledby="home-faq-title">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Good to Know"
          title="Frequently asked questions"
          description="A few helpful details before you choose your piece."
          className="mb-10"
        />
        <h2 id="home-faq-title" className="sr-only">Frequently asked questions</h2>
        <div className="divide-y divide-border border-y border-border">
          {faqs.slice(0, 8).map((faq) => (
            <details key={faq.id} className="group py-1">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-display text-xl text-primary marker:content-none">
                {faq.question}
                <span className="text-2xl font-light text-accent transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
