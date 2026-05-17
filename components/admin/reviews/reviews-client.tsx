"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Check, Trash2, Eye } from "lucide-react";
import Link from "next/link";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  photos: string[];
  isApproved: boolean;
  createdAt: Date;
  user: { name: string | null; email: string };
  product: { name: string; slug: string };
};

export default function AdminReviewsClient({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const filtered = reviews.filter((r) => {
    if (filter === "PENDING") return !r.isApproved;
    if (filter === "APPROVED") return r.isApproved;
    return true;
  });

  const pending = reviews.filter((r) => !r.isApproved).length;
  const approved = reviews.filter((r) => r.isApproved).length;

  async function handleApprove(id: string) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Review approved!");
      router.refresh();
    } catch {
      toast.error("Failed to approve");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Review deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: reviews.length, color: "text-brand-900" },
          { label: "Pending", value: pending, color: "text-amber-600" },
          { label: "Approved", value: approved, color: "text-green-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-brand-200 p-4"
          >
            <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase mb-1">
              {stat.label}
            </p>
            <p className={`font-serif text-2xl ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["ALL", "PENDING", "APPROVED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] tracking-[0.12em] uppercase px-4 py-2 border transition-colors ${
              filter === f
                ? "bg-brand-900 border-brand-900 text-brand-100"
                : "border-brand-300 text-brand-500 hover:border-brand-600"
            }`}
          >
            {f}
            {f === "PENDING" && pending > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-brand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-200 bg-brand-50">
                {[
                  "Customer",
                  "Product",
                  "Rating",
                  "Review",
                  "Photos",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-xs text-brand-400 tracking-wide"
                  >
                    No reviews found
                  </td>
                </tr>
              ) : (
                filtered.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                  >
                    {/* Customer */}
                    <td className="px-4 py-4">
                      <p className="text-xs text-brand-800 font-medium tracking-wide">
                        {review.user.name ?? "—"}
                      </p>
                      <p className="text-[10px] text-brand-400 tracking-wide">
                        {review.user.email}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/product/${review.product.slug}`}
                        target="_blank"
                        className="text-xs text-brand-700 hover:text-brand-900 tracking-wide underline"
                      >
                        {review.product.name}
                      </Link>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={11}
                            strokeWidth={1.5}
                            className={
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-brand-300"
                            }
                          />
                        ))}
                      </div>
                    </td>

                    {/* Review text */}
                    <td className="px-4 py-4 max-w-xs">
                      {review.title && (
                        <p className="text-xs text-brand-800 font-medium mb-0.5 truncate">
                          {review.title}
                        </p>
                      )}
                      <p className="text-[10px] text-brand-500 tracking-wide line-clamp-2">
                        {review.body}
                      </p>
                    </td>

                    {/* Photos */}
                    <td className="px-4 py-4">
                      {review.photos.length > 0 ? (
                        <div className="flex gap-1">
                          {review.photos.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => setActivePhoto(url)}
                              className="w-8 h-10 overflow-hidden"
                            >
                              <img
                                src={url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-brand-300">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <p className="text-[10px] text-brand-400 tracking-wide whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${
                          review.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {!review.isApproved && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="p-1.5 text-brand-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <Check size={14} strokeWidth={1.5} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <img
            src={activePhoto}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
