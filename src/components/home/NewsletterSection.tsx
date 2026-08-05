import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { CraftMark } from "@/components/ui/CraftMark";

export function NewsletterSection() {
  return (
    <section className="paper-grain bg-accent py-16 md:py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
          <CraftMark className="mx-auto h-12 w-12" tone="indigo" />
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
            Stay Connected
          </p>
          <h2 className="text-h1 leading-[1.15] text-primary">
            Join the Khadeeja Empire world
          </h2>
          <p className="text-lead leading-relaxed text-primary/75">
            Be the first to discover new collections, stories from Banaras, and
            exclusive previews. No spam—just beautiful things.
          </p>
          <div className="home-newsletter-form mx-auto mt-2 w-full max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
