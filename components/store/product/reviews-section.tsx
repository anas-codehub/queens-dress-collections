"use client";

import { useState, useEffect } from "react";
import { Star, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import ReviewForm from "./review-form";
import Link from "next/link";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  photos: string[];
  createdAt: string;
  user: { name: string | null; image: string | null };
};

type ReviewCheck = {
  canReview: boolean;
  hasReviewed: boolean;
  isPurchased: boolean;
};

export default function ReviewsSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [check, setCheck] = useState<ReviewCheck | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [reviewsRes, checkRes] = await Promise.all([
        fetch(`/api/reviews?productId=${productId}`),
        session
          ? fetch(`/api/reviews/check?productId=${productId}`)
          : Promise.resolve(null),
      ]);

      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);

      if (checkRes) {
        const checkData = await checkRes.json();
        setCheck(checkData);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [productId, session]);

  // Average rating
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="mt-10 border-t border-brand-200 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
            Customer Reviews
          </p>
          <h2 className="font-serif text-2xl text-brand-900">
            {reviews.length === 0
              ? "No reviews yet"
              : `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        {/* Write review button */}
        {session ? (
          check?.canReview &&
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-[11px] text-brand-700 tracking-[0.12em] uppercase border border-brand-300 px-4 py-2.5 hover:bg-brand-200 hover:text-brand-900 transition-colors"
            >
              Write a Review
            </button>
          )
        ) : (
          <Link
            href="/login"
            className="text-[11px] text-brand-500 tracking-[0.12em] uppercase border border-brand-300 px-4 py-2.5 hover:border-brand-700 transition-colors"
          >
            Login to Review
          </Link>
        )}

        {check?.hasReviewed && (
          <span className="text-[10px] text-brand-400 tracking-wide italic">
            You've reviewed this product
          </span>
        )}

        {check?.isPurchased === false && session && (
          <span className="text-[10px] text-brand-400 tracking-wide italic">
            Purchase this product to leave a review
          </span>
        )}
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-brand-100 border border-brand-200">
          {/* Average */}
          <div className="flex flex-col items-center justify-center gap-1 sm:w-32 shrink-0">
            <p className="font-serif text-5xl text-brand-900">
              {avgRating.toFixed(1)}
            </p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  strokeWidth={1.5}
                  className={
                    star <= Math.round(avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-brand-300"
                  }
                />
              ))}
            </div>
            <p className="text-[10px] text-brand-500 tracking-wide">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Distribution */}
          <div className="flex-1 flex flex-col gap-1.5">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="text-[10px] text-brand-500 w-4 text-right">
                  {d.star}
                </span>
                <Star
                  size={10}
                  strokeWidth={1.5}
                  className="text-amber-400 fill-amber-400 shrink-0"
                />
                <div className="flex-1 bg-brand-200 h-1.5">
                  <div
                    className="bg-brand-700 h-full transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-brand-400 w-5">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="border border-brand-300 p-6 bg-brand-50">
              <div className="flex items-center justify-between mb-5">
                <p className="font-serif text-lg text-brand-900">
                  Write Your Review
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-brand-400 hover:text-brand-900 transition-colors text-xs tracking-wide uppercase"
                >
                  Cancel
                </button>
              </div>
              <ReviewForm
                productId={productId}
                onSuccess={() => {
                  setShowForm(false);
                  fetchData();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-brand-200 rounded w-1/4 mb-2" />
              <div className="h-2 bg-brand-200 rounded w-full mb-1" />
              <div className="h-2 bg-brand-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 border border-brand-200">
          <Star
            size={32}
            strokeWidth={1}
            className="text-brand-300 mx-auto mb-3"
          />
          <p className="text-xs text-brand-400 tracking-wide">
            No reviews yet — be the first to review this product
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-brand-100 pb-6 last:border-0"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center shrink-0">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-brand-600 font-medium">
                        {(review.user.name ?? "A")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-brand-800 font-medium tracking-wide">
                      {review.user.name ?? "Anonymous"}
                    </p>
                    <p className="text-[9px] text-brand-400 tracking-wide">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      strokeWidth={1.5}
                      className={
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-brand-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Review Title */}
              {review.title && (
                <p className="text-xs text-brand-800 font-medium tracking-wide mb-1">
                  {review.title}
                </p>
              )}

              {/* Review Body */}
              <p className="text-xs text-brand-600 tracking-wide leading-relaxed mb-3">
                {review.body}
              </p>

              {/* Review Photos */}
              {review.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.photos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(url)}
                      className="w-16 h-20 overflow-hidden group relative"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <Camera
                          size={14}
                          strokeWidth={1.5}
                          className="text-white"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Photo Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={activePhoto}
              alt=""
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
