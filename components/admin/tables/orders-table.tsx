"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
  guestName: string | null;
  guestEmail: string | null;
  address: { city: string; district: string };
  items: { id: string }[];
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const allStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filtered =
    filterStatus === "ALL"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  async function handleStatusChange(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL", ...allStatuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors ${
              filterStatus === s
                ? "bg-brand-900 border-brand-900 text-brand-100"
                : "border-brand-300 text-brand-500 hover:border-brand-600 hover:text-brand-800"
            }`}
          >
            {s}
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
                  "Order",
                  "Customer",
                  "Location",
                  "Items",
                  "Total",
                  "Payment",
                  "Status",
                  "Date",
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
                    colSpan={9}
                    className="text-center py-12 text-xs text-brand-400 tracking-wide"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="px-4 py-4">
                      <p className="text-xs font-medium text-brand-900 tracking-wide">
                        {order.orderNumber}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <p className="text-xs text-brand-800 tracking-wide">
                        {order.user?.name ?? order.guestName ?? "—"}
                      </p>
                      <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                        {order.user?.email ?? order.guestEmail ?? "—"}
                      </p>
                    </td>
                    {/* Location */}
                    <td className="px-4 py-4">
                      <p className="text-xs text-brand-600 tracking-wide whitespace-nowrap">
                        {order.address.city}, {order.address.district}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-4">
                      <span className="text-xs text-brand-600 tracking-wide">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-brand-900">
                        ৳{order.total.toLocaleString()}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 w-fit ${paymentColors[order.paymentStatus]}`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[9px] text-brand-400 tracking-wide uppercase">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updating === order.id}
                          className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1.5 pr-6 appearance-none cursor-pointer outline-none border-0 ${statusColors[order.status]} disabled:opacity-50`}
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={10}
                          strokeWidth={1.5}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60"
                        />
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <p className="text-[10px] text-brand-400 tracking-wide whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors inline-flex"
                        title="View Order"
                      >
                        <Eye size={14} strokeWidth={1.5} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
