"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Home,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  BarChart3,
  Settings,
  Ticket,
  ChevronRight,
  Truck,
  Star,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Delivery", href: "/admin/delivery", icon: Truck },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile Top Bar — only shows on mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-brand-950 border-b border-brand-900 sticky top-0 z-40">
        <button
          onClick={() => setOpen(true)}
          className="text-brand-400 hover:text-brand-100 transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>

        <Link
          href="/admin"
          className="font-serif text-lg tracking-[0.2em] text-brand-300 uppercase"
        >
          QDC
        </Link>

        <Link
          href="/"
          className="text-brand-400 hover:text-brand-100 transition-colors p-1"
          aria-label="View store"
        >
          <Home size={20} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-64 bg-brand-950 z-50 lg:hidden flex flex-col border-r border-brand-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-brand-900">
                <div>
                  <p className="font-serif text-lg tracking-[0.2em] text-brand-300 uppercase">
                    QDC
                  </p>
                  <p className="text-[9px] text-brand-600 tracking-[0.15em] uppercase mt-0.5">
                    Admin Panel
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-brand-500 hover:text-brand-100 transition-colors p-1"
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                {navItems.map((item, i) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-3 text-[11px] tracking-[0.1em] uppercase rounded-sm transition-colors ${
                          active
                            ? "bg-brand-800 text-brand-300"
                            : "text-brand-500 hover:bg-brand-900 hover:text-brand-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            size={14}
                            strokeWidth={1.5}
                            className={
                              active ? "text-brand-400" : "text-brand-600"
                            }
                          />
                          {item.label}
                        </div>
                        {active && (
                          <ChevronRight
                            size={11}
                            strokeWidth={1.5}
                            className="text-brand-500"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t border-brand-900 px-3 py-4 flex flex-col gap-0.5">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-3 text-[11px] text-brand-500 hover:text-brand-300 hover:bg-brand-900 tracking-[0.1em] uppercase rounded-sm transition-colors"
                >
                  <Home size={14} strokeWidth={1.5} />
                  View Store
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-3 px-3 py-3 text-[11px] text-brand-500 hover:text-red-400 hover:bg-brand-900 tracking-[0.1em] uppercase w-full text-left rounded-sm transition-colors"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
