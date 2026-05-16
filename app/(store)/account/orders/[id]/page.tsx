import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-indigo-100 text-indigo-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-300">
        <Link
          href="/account/orders"
          className="flex items-center gap-2 text-[11px] text-brand-500 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors mb-4 w-fit"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back to Orders
        </Link>
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          Order Details
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl lg:text-3xl text-brand-900">
            {order.orderNumber}
          </h1>
          <span
            className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        </div>
        <p className="text-[10px] text-brand-400 tracking-wide mt-1">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Items */}
        <div className="border border-brand-200 p-5">
          <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-4">
            Items Ordered
          </p>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-4 border-b border-brand-100 last:border-0 last:pb-0"
              >
                <div className="w-14 h-16 bg-brand-200 shrink-0 overflow-hidden">
                  {item.product.images[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-xs text-brand-400">
                        QDC
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-brand-800 font-medium tracking-wide">
                    {item.name}
                  </p>
                  <div className="flex gap-3 mt-1">
                    {item.size && (
                      <span className="text-[10px] text-brand-400">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-[10px] text-brand-400">
                        Color: {item.color}
                      </span>
                    )}
                    <span className="text-[10px] text-brand-400">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-brand-900">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="border border-brand-200 p-5">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-4">
              Order Summary
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-green-600 tracking-wide">
                  <span>Discount</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : `৳${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-brand-900 pt-2 border-t border-brand-200">
                <span>Total</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-500 tracking-wide pt-1">
                <span>Payment</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border border-brand-200 p-5">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-4">
              Delivery Address
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
              </p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="border border-brand-200 p-5 text-center">
          <p className="text-xs text-brand-500 tracking-wide mb-2">
            Need help with this order?
          </p>
          <Link
            href="/contact"
            className="text-[11px] text-brand-700 hover:text-brand-900 tracking-[0.12em] uppercase border-b border-brand-400 hover:border-brand-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
