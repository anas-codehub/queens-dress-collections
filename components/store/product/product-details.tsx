"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Truck,
  RefreshCw,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "sonner";

// Placeholder product — will come from DB later
const product = {
  id: "1",
  name: "Linen Wrap Dress",
  slug: "linen-wrap-dress",
  price: 7200,
  comparePrice: 9500,
  category: "Casual",
  description: `A beautifully crafted linen wrap dress that effortlessly blends comfort with elegance. 
  The relaxed silhouette drapes gracefully, making it perfect for both casual outings and semi-formal occasions.
  Made from 100% premium linen with a soft inner lining for all-day comfort.`,
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Natural", hex: "#c8b8a0" },
    { name: "Ivory", hex: "#f5f0ea" },
    { name: "Caramel", hex: "#b07850" },
  ],
  images: ["", "", "", ""],
  isNew: true,
  isSale: true,
  details: [
    "100% Premium Linen",
    "Relaxed wrap silhouette",
    "Adjustable tie waist",
    "Available in 3 colors",
    "Machine washable",
    "Model is 5'8\" wearing size S",
  ],
  shipping:
    "Free delivery on orders over ৳3,000. Standard delivery 2-4 business days.",
};

const accordionItems = [
  { title: "Product Details", content: product.details },
  {
    title: "Shipping & Returns",
    content: [product.shipping, "Free returns within 30 days."],
  },
  {
    title: "Size Guide",
    content: [
      'XS: Bust 32", Waist 24"',
      'S: Bust 34", Waist 26"',
      'M: Bust 36", Waist 28"',
      'L: Bust 38", Waist 30"',
    ],
  },
];

function Accordion({ title, content }: { title: string; content: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-[11px] text-brand-800 tracking-[0.15em] uppercase font-medium">
          {title}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={1.5}
          className={`text-brand-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-4"
        >
          <ul className="flex flex-col gap-2">
            {content.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[11px] text-brand-600 tracking-wide leading-relaxed"
              >
                <span className="text-brand-400 mt-0.5">—</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

export default function ProductDetails({ slug }: { slug: string }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const {
    addItem: addToWishlist,
    removeItem,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : null;

  function handleAddToCart() {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: selectedSize,
      color: selectedColor.name,
      quantity: 1,
    });
    toast.success("Added to cart");
    openCart();
  }

  function handleWishlist() {
    if (isWishlisted) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
      });
      toast.success("Added to wishlist");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10">
      {/* Breadcrumb */}
      <p className="text-[10px] text-brand-400 tracking-[0.12em] uppercase mb-8">
        Home / Shop / {product.category} / {product.name}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT — Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          <div className="hidden sm:flex flex-col gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 bg-brand-200 flex items-center justify-center border-2 transition-colors ${
                  activeImage === i
                    ? "border-brand-900"
                    : "border-transparent hover:border-brand-400"
                }`}
              >
                <span className="font-serif text-sm text-brand-400">QDC</span>
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 bg-brand-200 aspect-[3/4] flex items-center justify-center relative overflow-hidden">
            <span className="font-serif text-6xl text-brand-400 select-none">
              QDC
            </span>
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-brand-900 text-brand-100 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1">
                New
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-amber-700 text-amber-50 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* RIGHT — Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          {/* Category */}
          <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-2">
            {product.category}
          </p>

          {/* Name */}
          <h1 className="font-serif text-3xl lg:text-4xl text-brand-900 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-medium text-brand-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-brand-400 line-through">
                ৳{product.comparePrice.toLocaleString()}
              </span>
            )}
            {discount && (
              <span className="text-xs text-amber-700 tracking-wide">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-brand-600 leading-relaxed tracking-wide mb-6 border-t border-brand-200 pt-6">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="mb-5">
            <p className="text-[10px] text-brand-700 tracking-[0.15em] uppercase mb-3">
              Color —{" "}
              <span className="text-brand-500">{selectedColor.name}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name
                      ? "border-brand-900 scale-110"
                      : "border-transparent hover:border-brand-400"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-brand-700 tracking-[0.15em] uppercase">
                Size{" "}
                {selectedSize && (
                  <span className="text-brand-500">— {selectedSize}</span>
                )}
              </p>
              <button className="text-[10px] text-brand-500 hover:text-brand-900 underline tracking-wide transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 text-[11px] tracking-wide border transition-colors ${
                    selectedSize === size
                      ? "bg-brand-900 border-brand-900 text-brand-50"
                      : "border-brand-300 text-brand-600 hover:border-brand-700 hover:text-brand-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors"
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`w-14 flex items-center justify-center border transition-colors ${
                isWishlisted
                  ? "bg-brand-900 border-brand-900 text-brand-50"
                  : "border-brand-300 text-brand-600 hover:border-brand-900 hover:text-brand-900"
              }`}
              aria-label="Wishlist"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                className={isWishlisted ? "fill-current" : ""}
              />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 py-5 border-t border-brand-200 mb-5">
            {[
              { icon: Truck, label: "Free Delivery", sub: "Over ৳3,000" },
              { icon: RefreshCw, label: "Free Returns", sub: "30 days" },
              { icon: Shield, label: "Secure Pay", sub: "100% safe" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center text-center gap-1.5"
              >
                <badge.icon
                  size={16}
                  strokeWidth={1.5}
                  className="text-brand-500"
                />
                <p className="text-[10px] text-brand-700 tracking-wide font-medium">
                  {badge.label}
                </p>
                <p className="text-[9px] text-brand-400 tracking-wide">
                  {badge.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div className="border-t border-brand-200">
            {accordionItems.map((item) => (
              <Accordion
                key={item.title}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
