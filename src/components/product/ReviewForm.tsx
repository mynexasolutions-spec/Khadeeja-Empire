"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/(storefront)/products/[slug]/review-actions";

export function ReviewForm({ productId, productSlug }: { productId: string; productSlug: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (body.trim().length < 1) {
      setError("Please write a few words about the product.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("productSlug", productSlug);
    formData.append("rating", String(rating));
    formData.append("title", title);
    formData.append("body", body);

    startTransition(async () => {
      const res = await submitReview(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(res.success);
        setRating(0);
        setTitle("");
        setBody("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6 bg-surface">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Write a Review</h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Your Rating</label>
        <div className="flex gap-1" role="radiogroup" aria-label="Select a star rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
            >
              <Star
                size={22}
                strokeWidth={1.5}
                style={{ color: "var(--color-maroon)" }}
                fill={(hoverRating || rating) >= value ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your review"
          maxLength={240}
          className="h-11 px-4 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Your Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience with this product"
          rows={4}
          maxLength={5000}
          required
          className="px-4 py-3 bg-white border border-border rounded-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-ink placeholder:text-muted/60"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start h-11 px-6 bg-[#2d2520] hover:bg-primary text-white font-semibold tracking-widest text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
