import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PUT(
  req: Request,
   { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { variants, images, tags, coupons, ...data } = body

    await db.productVariant.deleteMany({ where: { productId: id } })
    await db.productImage.deleteMany({ where: { productId: id } })
    await db.coupon.deleteMany({ where: { productId: id } })

    const product = await db.product.update({
      where: { id: id },
      data: {
        ...data,
        tags,
       variants: {
  create: variants.map((v: any) => {
    const { id, ...rest } = v
    return rest
  }),
},
        images: {
          create: images.map((url: string, i: number) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
        coupons: {
          create: coupons ?? [],
        },
      },
    })

    return NextResponse.json(product)
 } catch (e) {
  console.error("Full update error:", e)
  return NextResponse.json(
    { error: e instanceof Error ? e.message : "Failed to update" },
    { status: 500 }
  )
}
}