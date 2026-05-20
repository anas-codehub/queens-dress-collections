import { db } from "@/lib/db";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUp,
  Clock,
} from "lucide-react";
import AdminRecentOrders from "@/components/admin/tables/recent-orders";
import AdminTopProducts from "@/components/admin/tables/top-products";

async function getStats() {
  const [orders, customers, products, revenue] = await Promise.all([
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count({ where: { isActive: true } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  const pendingOrders = await db.order.count({
    where: { status: "PENDING" },
  });

  return {
    orders,
    customers,
    products,
    revenue: revenue._sum.total ?? 0,
    pendingOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Revenue",
      value: `৳${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      change: "+12% this month",
      up: true,
    },
    {
      label: "Total Orders",
      value: stats.orders.toString(),
      icon: ShoppingBag,
      change: `${stats.pendingOrders} pending`,
      up: true,
    },
    {
      label: "Customers",
      value: stats.customers.toString(),
      icon: Users,
      change: "+8% this month",
      up: true,
    },
    {
      label: "Active Products",
      value: stats.products.toString(),
      icon: Package,
      change: "In store",
      up: true,
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Overview
        </p>
        <h1 className="font-serif text-2xl lg:text-3xl text-brand-900">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-brand-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase">
                {card.label}
              </p>
              <card.icon
                size={16}
                strokeWidth={1.5}
                className="text-brand-400"
              />
            </div>
            <p className="font-serif text-2xl text-brand-900 mb-2">
              {card.value}
            </p>
            <div className="flex items-center gap-1">
              {card.up && (
                <ArrowUp size={11} strokeWidth={2} className="text-green-500" />
              )}
              <p className="text-[10px] text-brand-400 tracking-wide">
                {card.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AdminRecentOrders />
        <AdminTopProducts />
      </div>
    </div>
  );
}
