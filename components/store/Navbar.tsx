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

const navLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Summer 2026", href: "/collections/summer-2026" },
      { label: "Evening Wear", href: "/collections/evening-wear" },
      { label: "Casual Edit", href: "/collections/casual-edit" },
      { label: "Bridal", href: "/collections/bridal" },
      { label: "Workwear", href: "/collections/workwear" },
    ],
  },
  {
    label: "Dresses",
    href: "/shop/dresses",
    children: [
      { label: "Maxi Dresses", href: "/shop/maxi-dresses" },
      { label: "Midi Dresses", href: "/shop/midi-dresses" },
      { label: "Mini Dresses", href: "/shop/mini-dresses" },
      { label: "Evening Gowns", href: "/shop/evening-gowns" },
      { label: "Casual Dresses", href: "/shop/casual-dresses" },
      { label: "Co-ord Sets", href: "/shop/coord-sets" },
    ],
  },
  {
    label: "Sale",
    href: "/sale",
    highlight: true,
  },
  { label: "About", href: "/about" },
];

const announcements = [
  "Free delivery on orders over ৳3,000",
  "Use code QUEEN20 for 20% off your first order",
  "New Summer 2026 Collection — Shop Now",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );

  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

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
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-800 text-brand-50 text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
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

              <Link
                href="/cart"
                className="relative text-brand-600 hover:text-brand-900 transition-colors p-1"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-brand-900 text-brand-50 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Desktop Nav Links ─────────────────────────────────────── */}
        <div className="hidden lg:block border-t border-brand-200">
          <div className="max-w-7xl mx-auto px-10">
            <div className="flex items-center justify-center gap-10 h-10">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`
                      relative flex items-center gap-1 text-[11px] tracking-[0.15em] uppercase transition-colors py-2 group
                      ${link.highlight ? "text-amber-700 hover:text-amber-900" : "text-brand-600 hover:text-brand-900"}
                    `}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={11}
                        strokeWidth={1.5}
                        className={`transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                      />
                    )}
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-900 group-hover:w-full transition-all duration-300" />
                  </Link>

                  {/* Mega Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 bg-brand-50 border border-brand-300 shadow-[0_8px_30px_rgba(58,46,36,0.1)] min-w-52 py-3 z-50"
                      >
                        {/* Triangle pointer */}
                        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-brand-50 border-l border-t border-brand-300 rotate-45" />
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-center px-5 py-2.5 text-[11px] text-brand-600 hover:text-brand-900 hover:bg-brand-200 tracking-[0.08em] transition-colors group/item"
                          >
                            <span className="w-0 group-hover/item:w-2 h-px bg-brand-600 mr-0 group-hover/item:mr-2 transition-all duration-200 inline-block" />
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
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
              <div className="flex-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <button
                      onClick={() => {
                        if (link.children) {
                          setOpenMobileDropdown(
                            openMobileDropdown === link.label
                              ? null
                              : link.label,
                          );
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      className={`
                        w-full flex items-center justify-between px-6 py-4 text-[11px] tracking-[0.18em] uppercase transition-colors border-b border-brand-200
                        ${link.highlight ? "text-amber-700" : "text-brand-800 hover:bg-brand-200"}
                      `}
                    >
                      {link.children ? (
                        <span>{link.label}</span>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="w-full text-left"
                        >
                          {link.label}
                        </Link>
                      )}
                      {link.children && (
                        <ChevronDown
                          size={13}
                          strokeWidth={1.5}
                          className={`transition-transform duration-200 ${openMobileDropdown === link.label ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {/* Mobile Sub-links */}
                    <AnimatePresence>
                      {link.children && openMobileDropdown === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-brand-100"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-10 py-3 text-[11px] text-brand-600 hover:text-brand-900 hover:bg-brand-200 tracking-[0.1em] transition-colors border-b border-brand-200"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

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
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
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
