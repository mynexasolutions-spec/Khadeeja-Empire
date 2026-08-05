import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export interface PublicReviewItem {
  id: string;
  authorName: string;
  quote: string;
  role?: string | null;
  rating?: number | null;
}

export function PublicReviews({ reviews }: { reviews: PublicReviewItem[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="paper-grain bg-bg py-16 md:py-24" aria-labelledby="home-reviews-title">
      <Container>
        <SectionHeading
          eyebrow="From Our Community"
          title="Worn and loved"
          description="Notes from women who have made Khadeeja Empire their own."
          className="mb-10"
        />
        <h2 id="home-reviews-title" className="sr-only">Customer reviews</h2>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {reviews.slice(0, 6).map((review) => (
            <figure key={review.id} className="craft-frame flex min-h-64 flex-col bg-surface p-6 md:p-8">
              {review.rating ? (
                <div className="mb-5 flex gap-1 text-accent" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={14} fill={index < review.rating! ? "currentColor" : "none"} aria-hidden="true" />
                  ))}
                </div>
              ) : null}
              <blockquote className="flex-1 font-display text-xl leading-relaxed text-primary">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <strong className="block text-sm text-ink">{review.authorName}</strong>
                {review.role ? <span className="text-xs text-muted">{review.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
