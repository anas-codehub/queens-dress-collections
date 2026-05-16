import { db } from "@/lib/db";
import AnalyticsCharts from "@/components/admin/charts/analytics-charts";

async function getAnalyticsData() {
  const [
    orders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    ordersByStatus,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count({ where: { isActive: true } }),
    db.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    db.order.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      select: { total: true, createdAt: true, status: true },
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  // Group orders by day for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const ordersByDay = last7Days.map((day) => ({
    date: day.slice(5),
    orders: recentOrders.filter(
      (o) => o.createdAt.toISOString().split("T")[0] === day,
    ).length,
    revenue: recentOrders
      .filter((o) => o.createdAt.toISOString().split("T")[0] === day)
      .reduce((sum, o) => sum + o.total, 0),
  }));

  return {
    stats: {
      orders,
      revenue: totalRevenue._sum.total ?? 0,
      customers: totalCustomers,
      products: totalProducts,
    },
    ordersByStatus,
    ordersByDay,
    topProducts,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Insights
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Analytics</h1>
      </div>
      <AnalyticsCharts data={data} />
    </div>
  );
}
