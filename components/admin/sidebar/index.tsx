"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Ticket,
  Home,
  Truck,
  Star,
  Mail,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },

  { label: "Reviews", href: "/admin/reviews", icon: Star },

  { label: "Delivery", href: "/admin/delivery", icon: Truck },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 min-h-screen bg-brand-950 flex-col sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-brand-900">
        <p className="font-serif text-lg tracking-[0.2em] text-brand-200 uppercase">
          QDC
        </p>
        <p className="text-[9px] text-brand-600 tracking-[0.15em] uppercase mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 text-[11px] tracking-widest uppercase transition-colors group rounded-sm ${
                active
                  ? "bg-brand-800 text-brand-100"
                  : "text-brand-500 hover:bg-brand-900 hover:text-brand-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={15}
                  strokeWidth={1.5}
                  className={
                    active
                      ? "text-brand-300"
                      : "text-brand-600 group-hover:text-brand-400"
                  }
                />
                {item.label}
              </div>
              {active && (
                <ChevronRight
                  size={12}
                  strokeWidth={1.5}
                  className="text-brand-500"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-brand-900 flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] text-brand-600 hover:text-brand-300 tracking-widest uppercase transition-colors"
        >
          <Home size={15} strokeWidth={1.5} />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-[11px] text-brand-600 hover:text-red-400 tracking-widest uppercase transition-colors w-full text-left"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
