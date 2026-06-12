"use client";

import { useEffect, useRef, useState } from "react";
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
import ReviewsSection from "./reviews-section";
import { trackEvent } from "@/components/shared/meta-pixel";
import Image from "next/image";
import { trackGAEvent } from "@/components/shared/google-analytics";

type ProductWithDetails = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  description: string | null;
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
  variants: {
    id: string;
    size: string | null;
    color: string | null;
    colorHex: string | null;
    stock: number;
  }[];
  isNew: boolean;
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    user: { name: string | null };
  }[];
};

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

export default function ProductDetails({
  product,
}: {
  product: ProductWithDetails;
}) {
  // ─── Zoom state ───────────────────────────────────────────────────────────
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  // ─── Touch/swipe state ────────────────────────────────────────────────────
  const touchRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number>(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return; // ignore small swipes

    if (diff > 0) {
      // swipe left — next image
      setActiveImage((prev) =>
        prev < product.images.length - 1 ? prev + 1 : prev,
      );
    } else {
      // swipe right — prev image
      setActiveImage((prev) => (prev > 0 ? prev - 1 : prev));
    }
  }
  // ─── Track ViewContent on mount ─────────────────────────────────────────
  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "BDT",
    });
  }, [product.id]);

  // ─── Sizes & Colors from variants ───────────────────────────────────────
  const sizes = [
    ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
  ] as string[];

  const primaryImage =
    product.images.find((i) => i.isPrimary)?.url ??
    product.images[0]?.url ??
    "";

  const accordionItems = [
    {
      title: "Product Details",
      content: product.description
        ? product.description.split("\n").filter(Boolean)
        : ["Premium quality fabric", "Expertly crafted"],
    },
    {
      title: "Shipping & Returns",
      content: [
        "Free delivery on orders over ৳3,000",
        "Standard delivery 2-4 business days",
        "Free returns within 30 days",
      ],
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

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : null;

  // ─── State ────────────────────────────────────────────────────────────────
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);

  // ─── Store ────────────────────────────────────────────────────────────────
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const {
    addItem: addToWishlist,
    removeItem,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function handleAddToCart() {
    trackGAEvent("add_to_cart", {
      currency: "BDT",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: 1,
        },
      ],
    });

    if (!selectedSize && sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: primaryImage,
      price: product.price,
      size: selectedSize ?? undefined,

      quantity: 1,
    });
    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "BDT",
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
        image: primaryImage,
        price: product.price,
      });
      toast.success("Added to wishlist");
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10">
      {/* Breadcrumb */}
      <p className="text-[10px] text-brand-400 tracking-[0.12em] uppercase mb-8">
        Home / Shop / {product.category.name} / {product.name}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT — Images */}
        {/* LEFT — Images */}
        <div className="flex gap-3">
          {/* Thumbnails — desktop only */}
          {product.images.length > 1 && (
            <div className="hidden sm:flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 bg-brand-200 flex items-center justify-center border-2 transition-colors overflow-hidden relative shrink-0 ${
                    activeImage === i
                      ? "border-brand-900"
                      : "border-transparent hover:border-brand-400"
                  }`}
                >
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-serif text-sm text-brand-400">
                      QDC
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Main image with zoom */}
            <div
              className="bg-brand-200 aspect-[3/4] relative overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              {product.images[activeImage]?.url || primaryImage ? (
                <>
                  {/* Normal image */}
                  <Image
                    src={product.images[activeImage]?.url || primaryImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-opacity duration-200 ${zoomed ? "opacity-0" : "opacity-100"}`}
                    priority
                  />

                  {/* Zoomed image */}
                  {zoomed && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${product.images[activeImage]?.url || primaryImage})`,
                        backgroundSize: "250%",
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-6xl text-brand-400 select-none">
                    QDC
                  </span>
                </div>
              )}

              {product.isNew && (
                <span className="absolute top-4 left-4 bg-brand-900 text-brand-100 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 z-10">
                  New
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-amber-700 text-amber-50 text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 z-10">
                  -{discount}%
                </span>
              )}

              {/* Zoom hint */}
              {!zoomed && product.images[activeImage]?.url && (
                <div className="absolute bottom-3 right-3 bg-brand-50/80 px-2 py-1 text-[9px] text-brand-600 tracking-wide hidden sm:block">
                  Hover to zoom
                </div>
              )}
            </div>

            {/* Mobile swipe dots */}
            {product.images.length > 1 && (
              <div className="sm:hidden">
                {/* Swipeable thumbnails row */}
                <div
                  ref={touchRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-14 h-16 shrink-0 relative overflow-hidden border-2 transition-colors ${
                        activeImage === i
                          ? "border-brand-900"
                          : "border-transparent"
                      }`}
                    >
                      {img.url ? (
                        <Image
                          src={img.url}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-200 flex items-center justify-center">
                          <span className="font-serif text-xs text-brand-400">
                            QDC
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-1.5 mt-2">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`rounded-full transition-all ${
                        activeImage === i
                          ? "w-4 h-1.5 bg-brand-900"
                          : "w-1.5 h-1.5 bg-brand-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
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
            {product.category.name}
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
          {product.description && (
            <p className="text-xs text-brand-600 leading-relaxed tracking-wide mb-6 border-t border-brand-200 pt-6">
              {product.description}
            </p>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
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
                {sizes.map((size) => (
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
          )}

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

          {/* Reviews */}
          <ReviewsSection productId={product.id} />
        </motion.div>
      </div>
    </div>
  );
}
