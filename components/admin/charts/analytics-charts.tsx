"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

type Props = {
  data: {
    stats: {
      orders: number;
      revenue: number;
      customers: number;
      products: number;
    };
    ordersByStatus: { status: string; _count: { status: number } }[];
    ordersByDay: { date: string; orders: number; revenue: number }[];
    topProducts: { productId: string; _sum: { quantity: number | null } }[];
  };
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PROCESSING: "#8b5cf6",
  SHIPPED: "#6366f1",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
  REFUNDED: "#6b7280",
};

export default function AnalyticsCharts({ data }: Props) {
  const { stats, ordersByStatus, ordersByDay } = data;

  const statCards = [
    {
      label: "Total Revenue",
      value: `৳${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Total Orders",
      value: stats.orders.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      label: "Customers",
      value: stats.customers.toString(),
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "Active Products",
      value: stats.products.toString(),
      icon: Package,
      color: "text-amber-500",
    },
  ];

  const pieData = ordersByStatus.map((s) => ({
    name: s.status,
    value: s._count.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-brand-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase">
                {card.label}
              </p>
              <card.icon size={16} strokeWidth={1.5} className={card.color} />
            </div>
            <p className="font-serif text-2xl text-brand-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Orders Chart */}
      <div className="bg-white border border-brand-200 p-6">
        <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-6">
          Last 7 Days — Revenue & Orders
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ordersByDay}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c8b8a0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c8b8a0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7a6a58" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7a6a58" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#a0907a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#a0907a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#faf8f5",
                border: "1px solid #e0d5c8",
                borderRadius: "0",
                fontSize: "11px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#c8b8a0"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              name="Revenue (৳)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#7a6a58"
              strokeWidth={2}
              fill="url(#ordersGrad)"
              name="Orders"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status Pie */}
        <div className="bg-white border border-brand-200 p-6">
          <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-6">
            Orders by Status
          </p>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-xs text-brand-400 tracking-wide">
                No orders yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLORS[entry.name] ?? "#c8b8a0"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#faf8f5",
                    border: "1px solid #e0d5c8",
                    fontSize: "11px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Daily Orders Bar */}
        <div className="bg-white border border-brand-200 p-6">
          <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-6">
            Daily Orders — Last 7 Days
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#a0907a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#a0907a" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#faf8f5",
                  border: "1px solid #e0d5c8",
                  fontSize: "11px",
                }}
              />
              <Bar
                dataKey="orders"
                fill="#c8b8a0"
                name="Orders"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
