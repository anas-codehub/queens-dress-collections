import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/store/product/product-details";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
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
