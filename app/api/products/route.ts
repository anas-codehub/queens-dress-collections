import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { variants, images, tags, coupons, ...data } = body

    const product = await db.product.create({
      data: {
        ...data,
        tags,
        variants: {
          create: variants,
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
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}