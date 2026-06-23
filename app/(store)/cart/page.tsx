"use client";

import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const total = getTotalPrice();
  const shipping = 0;
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-24 flex flex-col items-center gap-5">
        <ShoppingBag size={48} strokeWidth={1} className="text-brand-300" />
        <h1 className="font-serif text-3xl text-brand-700">
          Your cart is empty
        </h1>
        <p className="text-xs text-brand-400 tracking-wide">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/shop"
          className="mt-4 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-300">
        <h1 className="font-serif text-3xl lg:text-4xl text-brand-900">
          Your Cart
        </h1>
        <p className="text-xs text-brand-500 tracking-wide mt-1">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Column Headers */}
          <div className="hidden sm:grid grid-cols-12 text-[10px] text-brand-400 tracking-[0.15em] uppercase pb-2 border-b border-brand-200">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {items.map((item) => (
            <motion.div
              key={`${item.productId}-${item.variantId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-12 gap-4 items-center py-4 border-b border-brand-200"
            >
              {/* Image + Name */}
              <div className="col-span-12 sm:col-span-6 flex gap-4 items-center">
                <div className="w-20 h-24 bg-brand-200 flex items-center justify-center shrink-0">
                  <span className="font-serif text-lg text-brand-400">QDC</span>
                </div>
                <div>
                  <p className="text-sm text-brand-800 font-medium tracking-wide mb-1">
                    {item.name}
                  </p>
                  <div className="flex flex-col gap-0.5">
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
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="flex items-center gap-1 text-[10px] text-brand-400 hover:text-red-500 transition-colors mt-2"
                  >
                    <Trash2 size={11} strokeWidth={1.5} />
                    Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="hidden sm:flex col-span-2 justify-center text-sm text-brand-700">
                ৳{item.price.toLocaleString()}
              </div>

              {/* Quantity */}
              <div className="col-span-6 sm:col-span-2 flex justify-center">
                <div className="flex items-center border border-brand-300">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity - 1,
                        item.variantId,
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-brand-600 hover:bg-brand-200 transition-colors"
                  >
                    <Minus size={11} strokeWidth={1.5} />
                  </button>
                  <span className="w-8 text-center text-xs text-brand-800">
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
                    className="w-8 h-8 flex items-center justify-center text-brand-600 hover:bg-brand-200 transition-colors"
                  >
                    <Plus size={11} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="col-span-6 sm:col-span-2 text-right text-sm font-medium text-brand-900">
                ৳{(item.price * item.quantity).toLocaleString()}
              </div>
            </motion.div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="self-start text-[10px] text-brand-400 hover:text-red-500 tracking-wide underline transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-100 border border-brand-300 p-6 sticky top-24">
            <h2 className="font-serif text-xl text-brand-900 mb-5">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-5 pb-5 border-b border-brand-300">
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Subtotal</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-600 tracking-wide">
                <span>Shipping</span>
                <span className="text-brand-400">Calculated at checkout</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-brand-400 tracking-wide">
                  Add ৳{(3000 - total).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-sm text-brand-900 font-medium tracking-wide">
                Total
              </span>
              <span className="text-sm text-brand-900 font-medium">
                ৳{(total + shipping).toLocaleString()}
              </span>
            </div>

            {/* Coupon TEMPORARY DISABLED*/}
            {/* <div className="flex gap-0 mb-5">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 bg-brand-50 border border-brand-300 px-3 py-2.5 text-xs text-brand-800 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
              />
              <button className="bg-brand-900 text-brand-100 text-[10px] tracking-[0.12em] uppercase px-4 hover:bg-brand-800 transition-colors">
                Apply
              </button>
            </div> */}

            <Link
              href="/checkout"
              className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 flex items-center justify-center gap-2 hover:bg-brand-800 transition-colors group"
            >
              Checkout
              <ArrowRight
                size={13}
                strokeWidth={1.5}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="/shop"
              className="w-full mt-3 text-center text-[11px] text-brand-600 tracking-[0.12em] uppercase block py-3 border border-brand-300 hover:border-brand-700 hover:text-brand-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
