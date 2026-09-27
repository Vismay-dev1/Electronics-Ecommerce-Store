"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckIcon, StarIcon } from "@/components/icons";
import { StarRating } from "@/components/star-rating";
import type { Review } from "@/lib/types";

function relativeDate(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "recently";
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function ReviewSection({
  productId,
  reviews,
  rating,
}: {
  productId: number;
  reviews: Review[];
  rating: number;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(4);
  const [formOpen, setFormOpen] = useState(false);
  const [starValue, setStarValue] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const distribution = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((review) => review.rating === stars).length,
    }));
    const total = reviews.length || 1;
    return buckets.map((bucket) => ({
      ...bucket,
      percent: Math.round((bucket.count / total) * 100),
    }));
  }, [reviews]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: starValue,
          author: formData.get("author"),
          location: formData.get("location"),
          title: formData.get("title"),
          body: formData.get("body"),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        return;
      }
      setMessage("Thank you — your review is live.");
      setFormOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="border-t border-ink-900/10 pt-14 md:pt-20"
    >
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div>
          <p className="eyebrow text-brand-500">Product reviews</p>
          <h2 className="mt-3 font-display text-3xl text-ink-900 md:text-4xl">
            Reviews
          </h2>
          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-6xl leading-none text-ink-900">
              {rating.toFixed(1)}
            </span>
            <div className="pb-1.5">
              <StarRating value={rating} size={16} />
              <p className="mt-1 text-xs text-ink-500">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <ul className="mt-7 flex flex-col gap-2">
            {distribution.map((bucket) => (
              <li key={bucket.stars} className="flex items-center gap-3">
                <span className="flex w-10 items-center gap-1 text-xs font-medium text-ink-600">
                  {bucket.stars}
                  <StarIcon className="h-3 w-3 text-brand-400" />
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/10">
                  <span
                    className="block h-full rounded-full bg-brand-400 transition-[width] duration-700"
                    style={{ width: `${bucket.percent}%` }}
                  />
                </span>
                <span className="w-8 text-right text-xs tabular-nums text-ink-400">
                  {bucket.count}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="mt-8 w-full rounded-full border border-ink-900 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-900 transition-all duration-300 hover:bg-ink-900 hover:text-cream-50"
          >
            {formOpen ? "Cancel" : "Write a review"}
          </button>

          {message && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
              <CheckIcon className="h-4 w-4" /> {message}
            </p>
          )}
        </div>

        <div>
          {formOpen && (
            <form
              onSubmit={submit}
              className="animate-pop-in mb-12 rounded-3xl border border-ink-900/10 bg-cream-100/70 p-6 md:p-8"
            >
              <h3 className="font-display text-xl text-ink-900">
                Share your experience
              </h3>
              <div className="mt-4 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarValue(star)}
                    aria-label={`Rate ${star} stars`}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <StarRating value={star <= starValue ? 1 : 0} size={26} />
                  </button>
                ))}
                <span className="ml-2 text-xs text-ink-500">
                  {starValue} / 5
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-500">
                    Your name
                  </span>
                  <input
                    name="author"
                    required
                    maxLength={60}
                    placeholder="Jordan P."
                    className="rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-500">
                    Location
                  </span>
                  <input
                    name="location"
                    maxLength={60}
                    placeholder="Austin, TX"
                    className="rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none"
                  />
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-500">
                  Headline
                </span>
                <input
                  name="title"
                  required
                  maxLength={90}
                  placeholder="Exactly what I hoped for"
                  className="rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none"
                />
              </label>

              <label className="mt-4 flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-500">
                  Your review
                </span>
                <textarea
                  name="body"
                  required
                  rows={4}
                  maxLength={900}
                  placeholder="Tell other families what you'd have wanted to know before buying."
                  className="resize-none rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm leading-relaxed text-ink-900 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none"
                />
              </label>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-brand-500 disabled:opacity-60"
              >
                {submitting ? "Publishing…" : "Publish review"}
              </button>
            </form>
          )}

          <ul className="flex flex-col divide-y divide-ink-900/10">
            {reviews.slice(0, visible).map((review) => (
              <li key={review.id} className="py-7 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-cream-50">
                      {review.author.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-900">
                        {review.author}
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-700">
                            <CheckIcon className="h-2.5 w-2.5" /> Verified
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink-400">
                        {review.location || "Customer"} ·{" "}
                        {relativeDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StarRating value={review.rating} size={13} />
                </div>
                <h4 className="mt-4 font-display text-lg text-ink-900">
                  {review.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {review.body}
                </p>
                <p className="mt-3 text-xs text-ink-400">
                  {review.helpfulCount} people found this helpful
                </p>
              </li>
            ))}
          </ul>

          {reviews.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink-900/15 px-6 py-10 text-center text-sm text-ink-500">
              No reviews yet — be the first to tell other households what you
              think.
            </p>
          )}

          {visible < reviews.length && (
            <button
              type="button"
              onClick={() => setVisible((value) => value + 5)}
              className="mt-8 w-full rounded-full border border-ink-900/15 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-800 transition-colors hover:border-ink-900"
            >
              Show {reviews.length - visible} more reviews
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
