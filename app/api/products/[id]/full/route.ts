import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { variants, images, tags, coupons, ...data } = body

    await db.productVariant.deleteMany({ where: { productId: params.id } })
    await db.productImage.deleteMany({ where: { productId: params.id } })
    await db.coupon.deleteMany({ where: { productId: params.id } })

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        ...data,
        tags,
        variants: {
          create: variants.map(({ id, ...v }: any) => v),
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
    console.error(e)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}