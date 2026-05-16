import { db } from "@/lib/db";
import { Ticket } from "lucide-react";
import Link from "next/link";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: { select: { orders: true } },
    },
  });

  const activeCoupons = coupons.filter((c) => c.isActive);
  const expiredCoupons = coupons.filter(
    (c) => c.expiresAt && new Date(c.expiresAt) < new Date(),
  );
  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Overview
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Coupons</h1>
        <p className="text-xs text-brand-400 tracking-wide mt-1">
          Coupons are created per product. Go to a product to add or edit
          coupons.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Coupons",
            value: coupons.length,
            color: "text-brand-900",
          },
          {
            label: "Active",
            value: activeCoupons.length,
            color: "text-green-600",
          },
          {
            label: "Expired",
            value: expiredCoupons.length,
            color: "text-red-500",
          },
          { label: "Total Used", value: totalUsed, color: "text-brand-900" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-brand-200 p-5"
          >
            <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase mb-2">
              {stat.label}
            </p>
            <p className={`font-serif text-2xl ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-brand-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-200">
          <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
            All Coupons
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-200 bg-brand-50">
                {[
                  "Code",
                  "Product",
                  "Discount",
                  "Min Order",
                  "Used",
                  "Limit",
                  "Expires",
                  "Status",
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
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <Ticket
                      size={32}
                      strokeWidth={1}
                      className="text-brand-300 mx-auto mb-3"
                    />
                    <p className="text-xs text-brand-400 tracking-wide">
                      No coupons yet
                    </p>
                    <p className="text-[10px] text-brand-300 tracking-wide mt-1">
                      Go to a product to create coupons
                    </p>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired =
                    coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isLimitReached =
                    coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

                  return (
                    <tr
                      key={coupon.id}
                      className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                    >
                      {/* Code */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-brand-900 tracking-widest bg-brand-100 px-2 py-1">
                            {coupon.code}
                          </span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-4">
                        {coupon.product ? (
                          <Link
                            href={`/admin/products/${coupon.product.id}`}
                            className="text-xs text-brand-700 hover:text-brand-900 underline tracking-wide transition-colors"
                          >
                            {coupon.product.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-brand-400 tracking-wide">
                            Global
                          </span>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-brand-800 tracking-wide">
                          {coupon.type === "PERCENT"
                            ? `${coupon.value}% off`
                            : `৳${coupon.value} off`}
                        </span>
                      </td>

                      {/* Min Order */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-brand-500 tracking-wide">
                          {coupon.minOrder ? `৳${coupon.minOrder}` : "—"}
                        </span>
                      </td>

                      {/* Used */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-brand-600 tracking-wide">
                          {coupon.usedCount}
                        </span>
                      </td>

                      {/* Limit */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-brand-500 tracking-wide">
                          {coupon.usageLimit ?? "∞"}
                        </span>
                      </td>

                      {/* Expires */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] tracking-wide whitespace-nowrap ${
                            isExpired ? "text-red-500" : "text-brand-400"
                          }`}
                        >
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "No expiry"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${
                            isExpired || isLimitReached
                              ? "bg-red-100 text-red-600"
                              : coupon.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isExpired
                            ? "Expired"
                            : isLimitReached
                              ? "Limit Reached"
                              : coupon.isActive
                                ? "Active"
                                : "Disabled"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
