import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.15em] text-muted font-medium">
            Stay Connected
          </p>
          <h2 className="text-h1 text-ink leading-[1.15]">
            Join the Khadeeja Empire world
          </h2>
          <p className="text-lead text-muted leading-relaxed">
            Be the first to discover new collections, stories from Banaras, and
            exclusive previews. No spam—just beautiful things.
          </p>
          <div className="max-w-md mx-auto w-full mt-2 [&_*]:!text-ink [&_input]:!text-ink [&_input]:placeholder:!text-muted [&_.border-b]:!border-ink/30 [&_.border-b]:focus-within:!border-ink/60">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}