"use client";

import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAddToCart(item: (typeof items)[0]) {
    addToCart({
      id: item.productId,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
    });
    removeItem(item.productId);
    toast.success("Moved to cart!");
    openCart();
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-5 lg:px-10 py-24 flex flex-col items-center gap-5">
        <Heart size={48} strokeWidth={1} className="text-brand-300" />
        <h1 className="font-serif text-3xl text-brand-700">
          Your wishlist is empty
        </h1>
        <p className="text-xs text-brand-400 tracking-wide">
          Save items you love and come back to them later.
        </p>
        <Link
          href="/shop"
          className="mt-4 flex items-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase px-8 py-4 hover:bg-brand-800 transition-colors group"
        >
          Start Shopping
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-brand-300 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Saved Items
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl text-brand-900">
            My Wishlist
          </h1>
        </div>
        <button
          onClick={() => {
            clearWishlist();
            toast.success("Wishlist cleared");
          }}
          className="text-[10px] text-brand-400 hover:text-red-500 tracking-wide underline transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              <Link href={`/product/${item.productId}`} className="block">
                {/* Image */}
                <div className="relative bg-brand-200 aspect-[3/4] overflow-hidden mb-3">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-3xl text-brand-400">
                        QDC
                      </span>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(item.productId);
                      toast.success("Removed from wishlist");
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-brand-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
                  >
                    <Heart
                      size={14}
                      strokeWidth={1.5}
                      className="fill-current"
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="mb-3">
                  <h3 className="text-xs text-brand-800 tracking-wide mb-1 group-hover:text-brand-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm font-medium text-brand-900">
                    ৳{item.price.toLocaleString()}
                  </p>
                </div>
              </Link>

              {/* Add to Cart button */}
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full flex items-center justify-center gap-2 bg-brand-900 text-brand-100 text-[10px] tracking-[0.15em] uppercase py-2.5 hover:bg-brand-800 transition-colors"
              >
                <ShoppingBag size={12} strokeWidth={1.5} />
                Move to Cart
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
