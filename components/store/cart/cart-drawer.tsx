"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
  } = useCartStore();

  const total = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-105 bg-brand-50 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-300">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={18}
                  strokeWidth={1.5}
                  className="text-brand-700"
                />
                <span className="text-[11px] text-brand-800 tracking-[0.18em] uppercase font-medium">
                  Your Cart ({items.length})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-brand-500 hover:text-brand-900 transition-colors p-1"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <ShoppingBag
                  size={40}
                  strokeWidth={1}
                  className="text-brand-300"
                />
                <p className="font-serif text-xl text-brand-700">
                  Your cart is empty
                </p>
                <p className="text-xs text-brand-400 tracking-wide text-center">
                  Looks like you haven't added anything yet.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 text-[11px] text-brand-700 tracking-[0.15em] uppercase border-b border-brand-400 pb-0.5 hover:text-brand-900 hover:border-brand-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4"
                      >
                        {/* Image */}
                        <div className="w-20 h-24 bg-brand-200 flex items-center justify-center shrink-0">
                          <span className="font-serif text-lg text-brand-400">
                            QDC
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-brand-800 tracking-wide font-medium mb-0.5">
                              {item.name}
                            </p>
                            <div className="flex gap-3 text-[10px] text-brand-400 tracking-wide">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity */}
                            <div className="flex items-center border border-brand-300">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                    item.variantId,
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-brand-600 hover:text-brand-900 hover:bg-brand-200 transition-colors"
                              >
                                <Minus size={11} strokeWidth={1.5} />
                              </button>
                              <span className="w-8 text-center text-[11px] text-brand-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                    item.variantId,
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-brand-600 hover:text-brand-900 hover:bg-brand-200 transition-colors"
                              >
                                <Plus size={11} strokeWidth={1.5} />
                              </button>
                            </div>

                            {/* Price + Remove */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-brand-900">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </span>
                              <button
                                onClick={() =>
                                  removeItem(item.productId, item.variantId)
                                }
                                className="text-brand-400 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-brand-300 px-6 py-5 flex flex-col gap-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-brand-600 tracking-[0.12em] uppercase">
                      Subtotal
                    </span>
                    <span className="text-sm font-medium text-brand-900">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-brand-400 tracking-wide">
                    Shipping & taxes calculated at checkout
                  </p>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 flex items-center justify-center hover:bg-brand-800 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* View Cart */}
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full text-center text-[11px] text-brand-600 tracking-[0.12em] uppercase border border-brand-300 py-3 hover:border-brand-700 hover:text-brand-900 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
