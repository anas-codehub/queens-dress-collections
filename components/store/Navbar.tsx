"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useMounted } from "@/hooks/use-mounted";

const announcements = [
  "QUEENS DRESS COLLECTIONS",
  "DRESS FOR THE WOMEN YOU ARE",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );
  const mounted = useMounted();

  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openCart);

  const cartCount = mounted ? totalItems : 0;
  const wishCount = mounted ? wishlistCount : 0;

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rotating announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Close sidebar on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Announcement Bar ───────────────────────────────────────── */}
      <div className="bg-brand-900 text-brand-300 text-center py-2.5 text-[10px] tracking-[0.2em] uppercase overflow-hidden relative h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={announcementIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute"
          >
            {announcements[announcementIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Main Navbar ────────────────────────────────────────────── */}
      <nav
        className={`bg-brand-50 sticky top-0 z-50 border-b border-brand-300 transition-all duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(58,46,36,0.08)]" : ""}`}
      >
        {/* Top Row */}
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-[60px] lg:h-[68px]">
            {/* LEFT */}
            <div className="flex items-center w-1/3">
              {/* Hamburger — mobile */}
              <button
                className="lg:hidden text-brand-700 hover:text-brand-900 transition-colors p-1"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              {/* Store link — desktop */}
              <Link
                href="/store-locations"
                className="hidden lg:flex items-center gap-1.5 text-[10px] text-brand-500 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors group"
              >
                <MapPin
                  size={13}
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform"
                />
                Find a Store
              </Link>
            </div>

            {/* CENTER — Logo */}
            <div className="flex justify-center w-1/3">
              <Link
                href="/"
                className="font-serif text-2xl lg:text-3xl tracking-[0.3em] text-brand-900 uppercase hover:text-brand-700 transition-colors select-none"
              >
                QDC
              </Link>
            </div>

            {/* RIGHT — Icons */}
            <div className="flex items-center justify-end gap-3 lg:gap-5 w-1/3">
              <Link
                href="/search"
                className="text-brand-600 hover:text-brand-900 transition-colors p-1"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </Link>

              <Link
                href="/wishlist"
                className="hidden lg:flex relative text-brand-600 hover:text-brand-900 transition-colors p-1"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
                {wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-800 text-brand-50 text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="hidden lg:flex text-brand-600 hover:text-brand-900 transition-colors p-1"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>

              <button
                onClick={openCart}
                className="relative text-brand-600 hover:text-brand-900 transition-colors p-1"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-900 text-brand-50 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop Nav Links ─────────────────────────────────────── */}
        <div className="hidden lg:block border-t border-brand-200">
          <div className="max-w-7xl mx-auto px-10"></div>
        </div>
      </nav>

      {/* ── Mobile Sidebar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[280px] bg-brand-50 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-brand-300">
                <Link
                  href="/"
                  className="font-serif text-xl tracking-[0.25em] text-brand-900 uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  QDC
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-brand-500 hover:text-brand-900 transition-colors p-1"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Sidebar Nav */}

              {/* Sidebar Footer */}
              <div className="border-t border-brand-300 px-6 py-5 flex flex-col gap-4">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.1em] uppercase transition-colors"
                >
                  <User size={16} strokeWidth={1.5} />
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.1em] uppercase transition-colors"
                >
                  <Heart size={16} strokeWidth={1.5} />
                  Wishlist {wishCount > 0 && `(${wishCount})`}
                </Link>
                <Link
                  href="/store-locations"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.1em] uppercase transition-colors"
                >
                  <MapPin size={16} strokeWidth={1.5} />
                  Find a Store
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
