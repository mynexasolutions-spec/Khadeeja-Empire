import { Container } from "@/components/ui/Container";

export function BrandIntro() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <Container>
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.15em] text-muted font-medium">
            Khadeeja Empire
          </p>
          <h2 className="text-h1 text-ink leading-[1.15]">
            Rooted in Indian craft.
            <br />
            Designed for the way women dress now.
          </h2>
          <p className="text-lead text-muted leading-relaxed max-w-2xl mx-auto">
            From the artisanal spirit of Banaras to wardrobes across India, every
            piece is crafted with intention—comfortable, wearable, and made to
            be lived in.
          </p>
          {/* Developer note: All brand claims are editable until approved by the client. */}
        </div>
      </Container>
    </section>
  );
}