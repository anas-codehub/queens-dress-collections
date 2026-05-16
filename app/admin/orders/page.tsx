import { db } from "@/lib/db";
import Link from "next/link";
import { Search } from "lucide-react";
import AdminOrdersTable from "@/components/admin/tables/orders-table";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      address: true,
      items: true,
    },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
            Manage
          </p>
          <h1 className="font-serif text-3xl text-brand-900">Orders</h1>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"
          />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            className="w-full bg-white border border-brand-300 pl-9 pr-4 py-2.5 text-xs text-brand-800 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
          />
        </div>
        <p className="text-[10px] text-brand-500 tracking-wide">
          {orders.length} orders
        </p>
      </div>

      {/* Table */}
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
