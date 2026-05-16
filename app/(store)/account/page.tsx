import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Package, Heart, MapPin, User, LogOut } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

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
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-300">
        <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
          My Account
        </p>
        <h1 className="font-serif text-3xl lg:text-4xl text-brand-900">
          Welcome, {user.name ?? "Queen"} 👑
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Quick Links */}
        <div className="flex flex-col gap-3">
          {[
            { icon: Package, label: "My Orders", href: "/account/orders" },
            { icon: Heart, label: "My Wishlist", href: "/wishlist" },
            { icon: MapPin, label: "My Addresses", href: "/account/addresses" },
            { icon: User, label: "Edit Profile", href: "/account/profile" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 border border-brand-300 text-xs text-brand-700 hover:bg-brand-200 hover:text-brand-900 tracking-wide transition-colors group"
            >
              <item.icon
                size={15}
                strokeWidth={1.5}
                className="text-brand-500 group-hover:text-brand-700 transition-colors"
              />
              {item.label}
            </Link>
          ))}

          {session.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3.5 bg-brand-900 text-brand-100 text-xs tracking-wide hover:bg-brand-800 transition-colors"
            >
              ⚙️ Admin Panel
            </Link>
          )}

          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3.5 border border-brand-300 text-xs text-brand-500 hover:text-red-500 hover:border-red-300 tracking-wide transition-colors"
            >
              <LogOut size={15} strokeWidth={1.5} />
              Sign Out
            </button>
          </form>
        </div>

        {/* RIGHT — Recent Orders */}
        <div className="lg:col-span-2">
          <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-4">
            Recent Orders
          </p>

          {user.orders.length === 0 ? (
            <div className="border border-brand-200 p-10 text-center">
              <Package
                size={32}
                strokeWidth={1}
                className="text-brand-300 mx-auto mb-3"
              />
              <p className="text-xs text-brand-400 tracking-wide mb-4">
                No orders yet
              </p>
              <Link
                href="/shop"
                className="text-[11px] text-brand-700 tracking-[0.15em] uppercase border-b border-brand-400 pb-0.5 hover:text-brand-900 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-brand-200 hover:bg-brand-50 transition-colors"
                >
                  <div>
                    <p className="text-xs text-brand-800 font-medium tracking-wide">
                      {order.orderNumber}
                    </p>
                    <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs font-medium text-brand-900">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              <Link
                href="/account/orders"
                className="text-[11px] text-brand-500 tracking-[0.12em] uppercase text-center hover:text-brand-900 transition-colors mt-2"
              >
                View All Orders →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
