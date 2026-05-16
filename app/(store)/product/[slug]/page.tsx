import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/store/product/product-details";

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

  return <ProductDetails product={product} />;
}
