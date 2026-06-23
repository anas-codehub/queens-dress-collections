import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default async function AdminRecentOrders() {
  const orders = await db.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="bg-white border border-brand-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] text-brand-800 tracking-[0.15em] uppercase font-medium">
          Recent Orders
        </h2>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-[10px] text-brand-500 hover:text-brand-900 tracking-wide transition-colors"
        >
          View all <ArrowRight size={11} strokeWidth={1.5} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-xs text-brand-400 tracking-wide py-4 text-center">
          No orders yet
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between py-3 border-b border-brand-100 hover:bg-brand-50 -mx-2 px-2 transition-colors"
            >
              <div>
                <p className="text-xs text-brand-800 font-medium tracking-wide">
                  {order.orderNumber}
                </p>
                <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                  {order.user?.name ?? order.user?.email ?? "Unknown user"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[9px] tracking-widest uppercase px-2 py-1 ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
                <span className="text-xs font-medium text-brand-900">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
