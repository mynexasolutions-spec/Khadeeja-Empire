import Link from "next/link";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/product/ReviewForm";
import type { ReviewRecord } from "@/lib/admin/types";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" style={{ color: "var(--color-maroon)" }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={14} fill={index < rating ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </div>
  );
}

function formatReviewDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  reviews: ReviewRecord[];
  isLoggedIn: boolean;
}

export function ProductReviews({ productId, productSlug, reviews, isLoggedIn }: ProductReviewsProps) {
  const approved = reviews.filter((r) => r.status === "approved");
  const average =
    approved.length > 0
      ? approved.reduce((sum, r) => sum + (r.rating || 0), 0) / approved.length
      : 0;

  return (
    <div className="mt-20 border-t border-border pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-h2 text-ink">Customer Reviews</h2>
          {approved.length > 0 ? (
            <div className="mt-2 flex items-center gap-2">
              <StarRow rating={Math.round(average)} />
              <span className="text-sm text-muted">
                {average.toFixed(1)} out of 5 &middot; {approved.length} review{approved.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">No reviews yet. Be the first to share your thoughts.</p>
          )}
        </div>
      </div>

      {approved.length > 0 ? (
        <div className="mb-10 flex flex-col gap-6">
          {approved.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
              <div className="flex items-center justify-between gap-4">
                <StarRow rating={review.rating || 0} />
                <span className="text-xs text-muted">{formatReviewDate(review.createdAt)}</span>
              </div>
              {review.title ? <p className="mt-2 font-semibold text-ink">{review.title}</p> : null}
              <p className="mt-1 text-sm leading-relaxed text-muted">{review.body}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink">{review.authorName}</p>
            </div>
          ))}
        </div>
      ) : null}

      {isLoggedIn ? (
        <ReviewForm productId={productId} productSlug={productSlug} />
      ) : (
        <div className="border border-border p-6 bg-surface text-sm text-muted">
          <Link
            href={`/login?next=/products/${productSlug}`}
            className="font-semibold hover:underline"
            style={{ color: "var(--color-maroon)" }}
          >
            Log in
          </Link>{" "}
          to write a review.
        </div>
      )}
    </div>
  );
}
