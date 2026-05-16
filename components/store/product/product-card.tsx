"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null | undefined;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const {
    addItem: addToWishlist,
    removeItem,
    isInWishlist,
  } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const wishlisted = isInWishlist(product.id);

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (wishlisted) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      });
      toast.success("Added to wishlist");
    }
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
    toast.success("Added to cart");
  }

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        {/* Image Container */}
        <div className="relative bg-brand-200 aspect-[3/4] overflow-hidden mb-3">
          {/* Placeholder — replace with Next Image when real photos available */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-4xl text-brand-400 select-none">
              QDC
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-brand-900 text-brand-100 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1">
                New
              </span>
            )}
            {product.isSale && discount && (
              <span className="bg-amber-700 text-amber-50 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1">
                -{discount}%
              </span>
            )}
          </div>

          {/* Action buttons — show on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className="w-8 h-8 bg-brand-50 flex items-center justify-center hover:bg-brand-900 hover:text-brand-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                size={14}
                strokeWidth={1.5}
                className={wishlisted ? "fill-brand-900 text-brand-900" : ""}
              />
            </motion.button>
          </div>

          {/* Add to cart — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-brand-900 text-brand-100 text-[10px] tracking-[0.15em] uppercase py-3 flex items-center justify-center gap-2 hover:bg-brand-800 transition-colors"
            >
              <ShoppingBag size={13} strokeWidth={1.5} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
            {product.category}
          </p>
          <h3 className="text-sm text-brand-800 tracking-wide mb-2 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brand-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-brand-400 line-through">
                ৳{product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
