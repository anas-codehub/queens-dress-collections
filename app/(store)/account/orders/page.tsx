import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export const metadata = {
  title: "My Orders",
};

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
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

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-300">
        <Link
          href="/account"
          className="flex items-center gap-2 text-[11px] text-brand-500 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors mb-4 w-fit"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Back to Account
        </Link>
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          My Account
        </p>
        <h1 className="font-serif text-3xl lg:text-4xl text-brand-900">
          My Orders
        </h1>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-20 border border-brand-200">
          <Package
            size={48}
            strokeWidth={1}
            className="text-brand-300 mx-auto mb-4"
          />
          <p className="font-serif text-2xl text-brand-700 mb-2">
            No orders yet
          </p>
          <p className="text-xs text-brand-400 tracking-wide mb-8">
            When you place an order it will appear here
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-brand-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-brand-100 border-b border-brand-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-xs text-brand-800 font-medium tracking-wide">
                    {order.orderNumber}
                  </p>
                  <span className="hidden sm:block text-brand-300">·</span>
                  <p className="text-[10px] text-brand-400 tracking-wide">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${paymentColors[order.paymentStatus]}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-5 py-4 flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {/* Image */}
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

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-xs text-brand-800 font-medium tracking-wide hover:text-brand-600 transition-colors truncate block"
                      >
                        {item.name}
                      </Link>
                      <div className="flex gap-3 mt-1">
                        {item.size && (
                          <span className="text-[10px] text-brand-400 tracking-wide">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[10px] text-brand-400 tracking-wide">
                            Color: {item.color}
                          </span>
                        )}
                        <span className="text-[10px] text-brand-400 tracking-wide">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-xs font-medium text-brand-900 shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-brand-200">
                <div className="flex items-center gap-4 text-xs text-brand-500 tracking-wide">
                  <span>
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                  <span>·</span>
                  <span>{order.paymentMethod}</span>
                  {order.shipping === 0 && (
                    <>
                      <span>·</span>
                      <span className="text-green-600">Free shipping</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-brand-900">
                    ৳{order.total.toLocaleString()}
                  </p>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase border-b border-brand-300 hover:border-brand-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
