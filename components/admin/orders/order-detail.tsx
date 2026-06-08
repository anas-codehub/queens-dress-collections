"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  product: {
    images: { url: string }[];
  };
};

type Order = {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentRef: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  address: {
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    district: string;
    postalCode: string | null;
  };
  coupon: {
    code: string;
    type: string;
    value: number;
  } | null;
  items: OrderItem[];
  steadfastConsignment: string | null;
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

export default function AdminOrderDetail({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [payment, setPayment] = useState(order.paymentStatus);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [sendingToSteadfast, setSendingToSteadfast] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus: payment, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order updated!");
      router.refresh();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendToSteadfast() {
    if (!confirm("Send this order to Steadfast for delivery?")) return;
    setSendingToSteadfast(true);
    try {
      const res = await fetch("/api/steadfast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to send to Steadfast");
        return;
      }
      toast.success(`Sent to Steadfast! Consignment: ${data.consignment_id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSendingToSteadfast(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 text-[11px] text-brand-500 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors w-fit"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Back to Orders
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT — Order Items + Summary */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Items */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Order Items ({order.items.length})
            </p>

            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-brand-100 last:border-0 last:pb-0"
                >
                  {/* Image */}
                  <div className="w-16 h-20 bg-brand-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product.images[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-sm text-brand-400">
                        QDC
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs text-brand-800 font-medium tracking-wide mb-1">
                      {item.name}
                    </p>
                    <div className="flex gap-3 text-[10px] text-brand-400 tracking-wide">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xs font-medium text-brand-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                      ৳{item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Order Summary
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-green-600 tracking-wide">
                  <span>
                    Discount
                    {order.coupon && (
                      <span className="ml-1 text-[10px] bg-green-100 px-1.5 py-0.5">
                        {order.coupon.code}
                      </span>
                    )}
                  </span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `৳${order.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-brand-900 pt-3 border-t border-brand-200">
                <span>Total</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-4">
              Order Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide resize-none"
              placeholder="Add internal notes about this order..."
            />
          </div>
        </div>

        {/* RIGHT — Customer + Status */}
        <div className="flex flex-col gap-6">
          {/* Order Status */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Order Status
            </p>

            <div className="flex flex-col gap-4">
              {/* Status */}
              <div>
                <label className="block text-[10px] text-brand-500 tracking-[0.12em] uppercase mb-1.5">
                  Fulfillment Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none bg-brand-50 border border-brand-300 px-4 py-2.5 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    strokeWidth={1.5}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none"
                  />
                </div>
                <div className="mt-2">
                  <span
                    className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-[10px] text-brand-500 tracking-[0.12em] uppercase mb-1.5">
                  Payment Status
                </label>
                <div className="relative">
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="w-full appearance-none bg-brand-50 border border-brand-300 px-4 py-2.5 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                  >
                    {["UNPAID", "PAID", "FAILED", "REFUNDED"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    strokeWidth={1.5}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none"
                  />
                </div>
                <div className="mt-2">
                  <span
                    className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${paymentColors[payment]}`}
                  >
                    {payment}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[10px] text-brand-500 tracking-[0.12em] uppercase mb-1.5">
                  Payment Method
                </label>
                <p className="text-xs text-brand-700 tracking-wide">
                  {order.paymentMethod}
                </p>
              </div>

              {order.paymentRef && (
                <div>
                  <label className="block text-[10px] text-brand-500 tracking-[0.12em] uppercase mb-1.5">
                    Payment Reference
                  </label>
                  <p className="text-xs text-brand-700 tracking-wide font-mono">
                    {order.paymentRef}
                  </p>
                </div>
              )}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.15em] uppercase py-3 hover:bg-brand-800 transition-colors disabled:opacity-70 mt-2"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              {/* Steadfast Button */}
              {!order.steadfastConsignment ? (
                <button
                  onClick={handleSendToSteadfast}
                  disabled={sendingToSteadfast}
                  className="w-full flex items-center justify-center gap-2 border border-brand-300 text-brand-700 text-[11px] tracking-[0.15em] uppercase py-3 hover:bg-brand-900 hover:text-brand-100 hover:border-brand-900 transition-colors disabled:opacity-50 mt-2"
                >
                  <Truck size={14} strokeWidth={1.5} />
                  {sendingToSteadfast ? "Sending..." : "Send to Steadfast"}
                </button>
              ) : (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 text-center">
                  <p className="text-[10px] text-green-600 tracking-wide uppercase font-medium mb-0.5">
                    Sent to Steadfast ✓
                  </p>
                  <p className="text-[11px] text-green-700 font-mono">
                    {order.steadfastConsignment}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Customer
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-brand-800 font-medium tracking-wide">
                {order.user.name ?? "—"}
              </p>
              <a
                href={`mailto:${order.user.email}`}
                className="text-xs text-brand-500 hover:text-brand-900 tracking-wide transition-colors"
              >
                {order.user.email}
              </a>
              {order.user.phone && (
                <p className="text-xs text-brand-500 tracking-wide">
                  {order.user.phone}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Shipping Address
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-brand-800 font-medium tracking-wide">
                {order.address.name}
              </p>
              <p className="text-xs text-brand-500 tracking-wide">
                {order.address.phone}
              </p>
              <p className="text-xs text-brand-500 tracking-wide">
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
              </p>
              <p className="text-xs text-brand-500 tracking-wide">
                {order.address.city}, {order.address.district}
                {order.address.postalCode && ` - ${order.address.postalCode}`}
              </p>
            </div>
          </div>

          {/* Order Meta */}
          <div className="bg-white border border-brand-200 p-6">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
              Order Info
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-brand-500 tracking-wide">Order ID</span>
                <span className="text-brand-800 font-mono text-[10px]">
                  {order.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-500 tracking-wide">Placed</span>
                <span className="text-brand-800 tracking-wide">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-brand-500 tracking-wide">Updated</span>
                <span className="text-brand-800 tracking-wide">
                  {new Date(order.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
