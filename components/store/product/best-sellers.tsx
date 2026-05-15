import ProductCard from "./product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "5",
    name: "Beige Slip Dress",
    slug: "beige-slip-dress",
    price: 4900,
    comparePrice: undefined,
    image: "",
    category: "Minimal",
    isNew: false,
    isSale: false,
  },
  {
    id: "6",
    name: "Nude Pleated Gown",
    slug: "nude-pleated-gown",
    price: 14200,
    comparePrice: 18000,
    image: "",
    category: "Occasion",
    isNew: false,
    isSale: true,
  },
  {
    id: "7",
    name: "Ivory Co-ord Set",
    slug: "ivory-coord-set",
    price: 8800,
    comparePrice: undefined,
    image: "",
    category: "Co-ords",
    isNew: false,
    isSale: false,
  },
  {
    id: "8",
    name: "Camel Wrap Midi",
    slug: "camel-wrap-midi",
    price: 6200,
    comparePrice: 7500,
    image: "",
    category: "Casual",
    isNew: false,
    isSale: true,
  },
];

export default function BestSellers() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
            Most Loved
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-900">
            Best Sellers
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-2 text-[11px] text-brand-600 hover:text-brand-900 tracking-[0.12em] uppercase transition-colors group"
        >
          View All
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
