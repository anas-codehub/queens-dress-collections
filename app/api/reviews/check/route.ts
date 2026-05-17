import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ canReview: false, hasReviewed: false })

  const { searchParams } = new URL(req.url)
  const productId        = searchParams.get("productId")

  if (!productId) return NextResponse.json({ canReview: false, hasReviewed: false })

  try {
    const [purchasedOrder, existingReview] = await Promise.all([
      db.order.findFirst({
        where: {
          userId: session.user.id,
          status: "DELIVERED",
          items:  { some: { productId } },
        },
      }),
      db.review.findFirst({
        where: { productId, userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      canReview:   !!purchasedOrder && !existingReview,
      hasReviewed: !!existingReview,
      isPurchased: !!purchasedOrder,
    })
  } catch {
    return NextResponse.json({ canReview: false, hasReviewed: false })
  }
}