import { db } from "@/lib/db";
import AdminReviewsClient from "@/components/admin/reviews/reviews-client";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Reviews</h1>
        <p className="text-xs text-brand-400 tracking-wide mt-1">
          Approve reviews before they appear on the store
        </p>
      </div>
      <AdminReviewsClient reviews={reviews} />
    </div>
  );
}
