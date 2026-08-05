import { Container } from "@/components/ui/Container";
import { CraftMark } from "@/components/ui/CraftMark";

export function BrandIntro() {
  return (
    <section className="paper-grain bg-surface py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
          <CraftMark className="mx-auto h-14 w-14" tone="turmeric" />
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">
            Khadeeja Empire
          </p>
          <h2 className="text-h1 leading-[1.15] text-primary">
            Rooted in Indian craft.
            <br />
            Designed for the way women dress now.
          </h2>
          <div className="stitch-rule mx-auto my-1 w-20" aria-hidden="true" />
          <p className="text-lead mx-auto max-w-2xl leading-relaxed text-muted">
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
