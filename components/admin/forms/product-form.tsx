"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import slugify from "slugify";
import { motion } from "framer-motion";

type Category = {
  id: string;
  name: string;
};

type Variant = {
  id?: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
  price: number | null;
};

type ProductFormProps = {
  categories: Category[];
  product?: any;
};

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const editing = !!product;

  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [actualPrice, setActualPrice] = useState(
    product?.comparePrice?.toString() ?? "",
  );
  const [discountType, setDiscountType] = useState<
    "PERCENT" | "AMOUNT" | "NONE"
  >("NONE");
  const [discountValue, setDiscountValue] = useState("");
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",

    categoryId: product?.categoryId ?? "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? true,
    tags: product?.tags?.join(", ") ?? "",
  });

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.length > 0
      ? product.variants
      : [
          {
            size: "M",
            color: "Natural",
            colorHex: "#c8b8a0",
            sku: "",
            stock: 0,
            price: null,
          },
        ],
  );

  const [images, setImages] = useState<string[]>(
    product?.images?.map((i: any) => i.url) ?? [],
  );

  const [imageUrl, setImageUrl] = useState("");

  function update(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugify(name, { lower: true, strict: true }),
    }));
  }

  function addVariant() {
    setVariants((v) => [
      ...v,
      {
        size: "M",
        color: "",
        colorHex: "#c8b8a0",
        sku: "",
        stock: 0,
        price: null,
      },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((v) => v.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: string, value: any) {
    setVariants((v) =>
      v.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    setImages((imgs) => [...imgs, imageUrl.trim()]);
    setImageUrl("");
  }

  function removeImage(index: number) {
    setImages((imgs) => imgs.filter((_, i) => i !== index));
  }

  type CouponInput = {
    code: string;
    type: string;
    value: number;
    minOrder: number | null;
    usageLimit: number | null;
    expiresAt: string;
    isActive: boolean;
  };

  const [coupons, setCoupons] = useState<CouponInput[]>(
    product?.coupons?.map((c: any) => ({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      usageLimit: c.usageLimit,
      expiresAt: c.expiresAt
        ? new Date(c.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: c.isActive,
    })) ?? [],
  );

  function updateCoupon(index: number, field: string, value: any) {
    setCoupons((c) =>
      c.map((coupon, i) =>
        i === index ? { ...coupon, [field]: value } : coupon,
      ),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !price || !form.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const computedPrice = (() => {
      const ap = parseFloat(actualPrice || price);
      const sp = parseFloat(price);
      if (discountType === "PERCENT" && discountValue) {
        const discounted = sp - (sp * parseFloat(discountValue)) / 100;
        return Math.round(discounted);
      }
      if (discountType === "AMOUNT" && discountValue) {
        return Math.round(sp - parseFloat(discountValue));
      }
      return sp;
    })();

    try {
      const payload = {
        ...form,
        price: computedPrice,
        comparePrice:
          discountType !== "NONE"
            ? parseFloat(price)
            : parseFloat(actualPrice) || null,
        tags: form.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        variants,
        images,
        coupons: coupons.map((c) => ({
          ...c,
          code: c.code.toUpperCase(),
          expiresAt: c.expiresAt ? new Date(c.expiresAt) : null,
        })),
      };
      const url = editing
        ? `/api/products/${product.id}/full`
        : "/api/products";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(editing ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 xl:grid-cols-3 gap-6"
    >
      {/* LEFT — Main Info */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Basic Info */}
        <div className="bg-white border border-brand-200 p-6">
          <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
            Basic Information
          </h2>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="e.g. Linen Wrap Dress"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-500 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="auto-generated"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide resize-none"
                placeholder="Describe this product..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                placeholder="linen, summer, casual"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white border border-brand-200 p-6">
          <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
            Pricing
          </h2>

          <div className="flex flex-col gap-4">
            {/* Actual Price */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Actual Price (৳)
                <span className="ml-1 text-brand-400 normal-case tracking-normal font-normal">
                  — original / market price
                </span>
              </label>
              <input
                type="number"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors"
                placeholder="e.g. 9500"
                min={0}
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                Selling Price (৳) *
                <span className="ml-1 text-brand-400 normal-case tracking-normal font-normal">
                  — price before any discount
                </span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors"
                placeholder="e.g. 7200"
                min={0}
                required
              />
            </div>

            {/* Discount Section */}
            <div className="border-t border-brand-200 pt-4">
              <p className="text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-3">
                Discount (optional)
              </p>

              {/* Discount Type Toggle */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { id: "NONE", label: "No Discount" },
                  { id: "PERCENT", label: "By %" },
                  { id: "AMOUNT", label: "By ৳" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setDiscountType(opt.id as typeof discountType);
                      setDiscountValue("");
                    }}
                    className={`py-2.5 text-[10px] tracking-widest uppercase border transition-colors ${
                      discountType === opt.id
                        ? "bg-brand-900 border-brand-900 text-brand-100"
                        : "border-brand-300 text-brand-600 hover:border-brand-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Discount Value Input */}
              {discountType !== "NONE" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                    {discountType === "PERCENT"
                      ? "Discount Percentage (%)"
                      : "Discount Amount (৳)"}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors"
                    placeholder={
                      discountType === "PERCENT" ? "e.g. 20" : "e.g. 500"
                    }
                    min={0}
                    max={discountType === "PERCENT" ? 100 : undefined}
                  />
                </motion.div>
              )}
            </div>

            {/* Price Preview */}
            {(() => {
              const sp = parseFloat(price) || 0;
              const ap = parseFloat(actualPrice) || 0;
              const dv = parseFloat(discountValue) || 0;

              let finalPrice = sp;
              let savedAmount = 0;
              let discountPct = 0;
              let discountLabel = "";

              if (discountType === "PERCENT" && dv > 0) {
                savedAmount = Math.round((sp * dv) / 100);
                finalPrice = sp - savedAmount;
                discountPct = dv;
                discountLabel = `৳${savedAmount.toLocaleString()} (${dv}% off)`;
              } else if (discountType === "AMOUNT" && dv > 0) {
                savedAmount = dv;
                finalPrice = sp - dv;
                discountPct = sp > 0 ? Math.round((dv / sp) * 100) : 0;
                discountLabel = `৳${dv.toLocaleString()} (${discountPct}% off)`;
              }

              const profit = ap > 0 ? finalPrice - ap : null;
              const isLoss = profit !== null && profit < 0;
              const isProfit = profit !== null && profit >= 0;

              if (sp === 0) return null;

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-brand-300 bg-brand-50 p-4 mt-2"
                >
                  <p className="text-[10px] text-brand-500 tracking-[0.15em] uppercase mb-3">
                    Price Preview — how it appears on store
                  </p>

                  {/* Store display preview */}
                  <div className="flex items-center gap-3 flex-wrap mb-4 p-3 bg-white border border-brand-200">
                    <span className="text-xl font-medium text-brand-900">
                      ৳{finalPrice.toLocaleString()}
                    </span>
                    {ap > 0 && (
                      <span className="text-sm text-brand-400 line-through">
                        ৳{ap.toLocaleString()}
                      </span>
                    )}
                    {discountType !== "NONE" && savedAmount > 0 && ap === 0 && (
                      <span className="text-sm text-brand-400 line-through">
                        ৳{sp.toLocaleString()}
                      </span>
                    )}
                    {savedAmount > 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 tracking-wide font-medium">
                        {discountLabel}
                      </span>
                    )}
                  </div>

                  {/* Calculation breakdown */}
                  <div className="flex flex-col gap-1.5 border-t border-brand-200 pt-3">
                    {ap > 0 && (
                      <div className="flex justify-between text-[10px] text-brand-500 tracking-wide">
                        <span>Actual / Cost Price (admin only)</span>
                        <span>৳{ap.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] text-brand-500 tracking-wide">
                      <span>Selling Price</span>
                      <span>৳{sp.toLocaleString()}</span>
                    </div>
                    {savedAmount > 0 && (
                      <div className="flex justify-between text-[10px] text-amber-600 tracking-wide">
                        <span>Discount ({discountLabel})</span>
                        <span>− ৳{savedAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-brand-900 font-medium tracking-wide border-t border-brand-200 pt-1.5 mt-0.5">
                      <span>Customer Pays</span>
                      <span>৳{finalPrice.toLocaleString()}</span>
                    </div>

                    {/* Profit / Loss — only if actual price is set */}
                    {ap > 0 && (
                      <div
                        className={`flex justify-between text-xs font-medium tracking-wide border-t pt-1.5 mt-0.5 ${
                          isProfit
                            ? "border-green-200 text-green-700"
                            : "border-red-200 text-red-600"
                        }`}
                      >
                        <span>
                          {isProfit ? "Profit per sale" : "Loss per sale"}
                        </span>
                        <span>
                          {isProfit ? "+" : ""}৳{profit!.toLocaleString()}
                          {sp > 0 && (
                            <span className="ml-1 text-[9px] opacity-70">
                              ({Math.abs(Math.round((profit! / ap) * 100))}%{" "}
                              {isProfit ? "margin" : "loss"})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {ap === 0 && (
                      <p className="text-[9px] text-brand-400 tracking-wide mt-1 italic">
                        💡 Set Actual Price to see profit/loss calculation
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white border border-brand-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              Variants (Size / Color / Stock)
            </h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 text-[10px] text-brand-600 hover:text-brand-900 tracking-wide transition-colors border border-brand-300 px-3 py-1.5"
            >
              <Plus size={12} strokeWidth={1.5} />
              Add Variant
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {variants.map((variant, i) => (
              <div
                key={i}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-brand-50 border border-brand-200 relative"
              >
                {/* Size */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Size
                  </label>
                  <select
                    value={variant.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    className="w-full bg-white border border-brand-300 px-2 py-2 text-xs text-brand-800 outline-none focus:border-brand-700"
                  >
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                    className="w-full bg-white border border-brand-300 px-2 py-2 text-xs text-brand-800 outline-none focus:border-brand-700"
                    placeholder="Natural"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    className="w-full bg-white border border-brand-300 px-2 py-2 text-xs text-brand-800 outline-none focus:border-brand-700"
                    placeholder="QDC-001"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(i, "stock", parseInt(e.target.value))
                    }
                    className="w-full bg-white border border-brand-300 px-2 py-2 text-xs text-brand-800 outline-none focus:border-brand-700"
                    min={0}
                  />
                </div>

                {/* Price Override */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Price Override
                  </label>
                  <input
                    type="number"
                    value={variant.price ?? ""}
                    onChange={(e) =>
                      updateVariant(
                        i,
                        "price",
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    className="w-full bg-white border border-brand-300 px-2 py-2 text-xs text-brand-800 outline-none focus:border-brand-700"
                    placeholder="Optional"
                  />
                </div>

                {/* Remove */}
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="absolute top-2 right-2 text-brand-400 hover:text-red-500 transition-colors"
                  >
                    <X size={13} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-brand-200 p-6">
          <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
            Product Images
          </h2>

          {/* Add Image URL */}
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 bg-brand-50 border border-brand-300 px-4 py-2.5 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
              placeholder="Paste image URL..."
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImage())
              }
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-brand-900 text-brand-100 text-[10px] tracking-[0.12em] uppercase px-4 hover:bg-brand-800 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="aspect-square bg-brand-100 overflow-hidden">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} strokeWidth={2} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[8px] bg-brand-900 text-brand-100 px-1.5 py-0.5 tracking-wide">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="border-2 border-dashed border-brand-300 py-10 text-center">
              <p className="text-xs text-brand-400 tracking-wide">
                No images added yet
              </p>
              <p className="text-[10px] text-brand-300 mt-1 tracking-wide">
                Paste an image URL above to add images
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Settings */}
      <div className="flex flex-col gap-6">
        {/* Publish */}
        <div className="bg-white border border-brand-200 p-6">
          <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
            Publish
          </h2>

          <div className="flex flex-col gap-3 mb-5">
            {[
              { label: "Active", field: "isActive", desc: "Visible on store" },
              { label: "New", field: "isNew", desc: "Show New badge" },
              {
                label: "Featured",
                field: "isFeatured",
                desc: "Show on homepage",
              },
            ].map((toggle) => (
              <label
                key={toggle.field}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="text-xs text-brand-800 tracking-wide">
                    {toggle.label}
                  </p>
                  <p className="text-[10px] text-brand-400 tracking-wide">
                    {toggle.desc}
                  </p>
                </div>
                <div
                  onClick={() =>
                    update(
                      toggle.field,
                      !form[toggle.field as keyof typeof form],
                    )
                  }
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                    form[toggle.field as keyof typeof form]
                      ? "bg-brand-900"
                      : "bg-brand-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      form[toggle.field as keyof typeof form]
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-3.5 hover:bg-brand-800 transition-colors disabled:opacity-70"
          >
            {loading
              ? editing
                ? "Saving..."
                : "Creating..."
              : editing
                ? "Save Changes"
                : "Create Product"}
          </button>
        </div>

        {/* Category */}
        <div className="bg-white border border-brand-200 p-6">
          <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium mb-5">
            Category *
          </h2>
          {categories.length === 0 ? (
            <p className="text-xs text-brand-400 tracking-wide">
              No categories yet.{" "}
              <a href="/admin/categories" className="underline text-brand-600">
                Add one first
              </a>
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <div
                    onClick={() => update("categoryId", cat.id)}
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      form.categoryId === cat.id
                        ? "border-brand-900"
                        : "border-brand-400"
                    }`}
                  >
                    {form.categoryId === cat.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-900" />
                    )}
                  </div>
                  <span
                    onClick={() => update("categoryId", cat.id)}
                    className="text-xs text-brand-700 tracking-wide cursor-pointer hover:text-brand-900 transition-colors"
                  >
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Coupons */}
      <div className="bg-white border border-brand-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
            Coupons
          </h2>
          <button
            type="button"
            onClick={() =>
              setCoupons((c) => [
                ...c,
                {
                  code: "",
                  type: "PERCENT",
                  value: 0,
                  minOrder: null,
                  usageLimit: null,
                  expiresAt: "",
                  isActive: true,
                },
              ])
            }
            className="flex items-center gap-1.5 text-[10px] text-brand-600 hover:text-brand-900 tracking-wide border border-brand-300 px-3 py-1.5 transition-colors"
          >
            <Plus size={12} strokeWidth={1.5} />
            Add Coupon
          </button>
        </div>

        {coupons.length === 0 ? (
          <p className="text-[10px] text-brand-400 tracking-wide text-center py-4">
            No coupons for this product yet
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {coupons.map((coupon, i) => (
              <div
                key={i}
                className="p-4 bg-brand-50 border border-brand-200 relative flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCoupons((c) => c.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-2 right-2 text-brand-400 hover:text-red-500 transition-colors"
                >
                  <X size={13} strokeWidth={1.5} />
                </button>

                {/* Code */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Coupon Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon.code}
                      onChange={(e) =>
                        updateCoupon(i, "code", e.target.value.toUpperCase())
                      }
                      className="flex-1 bg-white border border-brand-300 px-3 py-2 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-widest uppercase"
                      placeholder="QUEEN20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateCoupon(
                          i,
                          "code",
                          "QUEEN" +
                            Math.random()
                              .toString(36)
                              .substring(2, 7)
                              .toUpperCase(),
                        )
                      }
                      className="text-[9px] text-brand-600 border border-brand-300 px-2 hover:border-brand-700 transition-colors whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Type */}
                <div className="grid grid-cols-2 gap-2">
                  {["PERCENT", "FIXED"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateCoupon(i, "type", t)}
                      className={`py-2 text-[9px] tracking-[0.1em] uppercase border transition-colors ${
                        coupon.type === t
                          ? "bg-brand-900 border-brand-900 text-brand-100"
                          : "border-brand-300 text-brand-600 hover:border-brand-600"
                      }`}
                    >
                      {t === "PERCENT" ? "% Off" : "৳ Fixed"}
                    </button>
                  ))}
                </div>

                {/* Value */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Value {coupon.type === "PERCENT" ? "(%)" : "(৳)"}
                  </label>
                  <input
                    type="number"
                    value={coupon.value || ""}
                    onChange={(e) =>
                      updateCoupon(i, "value", parseFloat(e.target.value))
                    }
                    className="w-full bg-white border border-brand-300 px-3 py-2 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                    placeholder={coupon.type === "PERCENT" ? "20" : "500"}
                    min={0}
                  />
                </div>

                {/* Min Order + Usage Limit */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                      Min Order (৳)
                    </label>
                    <input
                      type="number"
                      value={coupon.minOrder ?? ""}
                      onChange={(e) =>
                        updateCoupon(
                          i,
                          "minOrder",
                          e.target.value ? parseFloat(e.target.value) : null,
                        )
                      }
                      className="w-full bg-white border border-brand-300 px-3 py-2 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                      placeholder="Optional"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={coupon.usageLimit ?? ""}
                      onChange={(e) =>
                        updateCoupon(
                          i,
                          "usageLimit",
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="w-full bg-white border border-brand-300 px-3 py-2 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                      placeholder="Unlimited"
                      min={1}
                    />
                  </div>
                </div>

                {/* Expiry */}
                <div>
                  <label className="block text-[9px] text-brand-500 tracking-[0.12em] uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={coupon.expiresAt}
                    onChange={(e) =>
                      updateCoupon(i, "expiresAt", e.target.value)
                    }
                    className="w-full bg-white border border-brand-300 px-3 py-2 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                  />
                </div>

                {/* Active toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[10px] text-brand-600 tracking-wide">
                    Active
                  </span>
                  <div
                    onClick={() =>
                      updateCoupon(i, "isActive", !coupon.isActive)
                    }
                    className={`w-8 h-4 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                      coupon.isActive ? "bg-brand-900" : "bg-brand-300"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        coupon.isActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
