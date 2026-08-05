import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { brandValues } from "@/content/catalog";

export function ValuesSection() {
  return (
    <section className="values-section border-y border-accent/40 bg-primary py-16 text-surface-elevated md:py-24">
      <Container>
        <SectionHeading
          eyebrow="What We Believe"
          title="The Khadeeja Philosophy"
          description="Three principles that guide every piece we create."
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {brandValues.map((value, i) => (
            <div
              key={value.title}
              className="flex flex-col gap-4 text-center md:text-left"
            >
              <span
                className="font-display text-5xl text-accent leading-none"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 text-surface-elevated">
                {value.title}
              </h3>
              <p className="text-surface-elevated/70 leading-relaxed text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
