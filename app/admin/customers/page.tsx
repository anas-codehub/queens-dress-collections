import { db } from "@/lib/db";
import AdminCustomersTable from "@/components/admin/tables/customers-table";
import { Search } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true },
      },
      orders: {
        select: { total: true },
      },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
            Manage
          </p>
          <h1 className="font-serif text-3xl text-brand-900">Customers</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400"
          />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full bg-white border border-brand-300 pl-9 pr-4 py-2.5 text-xs text-brand-800 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
          />
        </div>
        <p className="text-[10px] text-brand-500 tracking-wide">
          {customers.length} customers
        </p>
      </div>

      <AdminCustomersTable customers={customers} />
    </div>
  );
}
