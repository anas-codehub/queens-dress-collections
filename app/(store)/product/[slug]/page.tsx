import type { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/store/product/product-details";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/shared/json-ld";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
  });

  if (!product) return { title: "Product Not Found" };

  const image = product.images[0]?.url;

  return {
    title: product.name,
    description:
      product.description ??
      `Shop ${product.name} at Queens Dress Collection. Premium women's fashion starting from ৳${product.price.toLocaleString()}.`,
    keywords: [
      product.name,
      product.category.name,
      "women's dress Bangladesh",
      "Queens Dress Collection",
      ...product.tags,
    ],
    openGraph: {
      title: `${product.name} | Queens Dress Collection`,
      description:
        product.description ??
        `Shop ${product.name} at Queens Dress Collection.`,
      url: `/product/${slug}`,
      type: "website",
      images: image
        ? [{ url: image, width: 800, height: 1067, alt: product.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description ??
        `Shop ${product.name} at Queens Dress Collection.`,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: true,
      variants: true,
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: true },
      },
    },
  });

  if (!product) notFound();

  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com";

  return (
    <>
      <ProductJsonLd product={product} url={`${BASE_URL}/product/${slug}`} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Shop", url: `${BASE_URL}/shop` },
          {
            name: product.category.name,
            url: `${BASE_URL}/shop?categories=${product.category.slug}`,
          },
          { name: product.name, url: `${BASE_URL}/product/${slug}` },
        ]}
      />
      <ProductDetails product={product} />
    </>
  );
}
