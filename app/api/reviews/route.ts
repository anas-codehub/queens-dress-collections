import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Please login to leave a review" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { productId, rating, title, body: reviewBody, photos, orderId } = body

    if (!productId || !rating) {
      return NextResponse.json({ error: "Product and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if customer has purchased this product
    const purchasedOrder = await db.order.findFirst({
      where: {
        userId: session.user.id,
        status: "DELIVERED",
        items: {
          some: { productId },
        },
      },
    })

    if (!purchasedOrder) {
      return NextResponse.json(
        { error: "You can only review products you have purchased and received" },
        { status: 403 }
      )
    }

    // Check if already reviewed
    const existingReview = await db.review.findFirst({
      where: {
        productId,
        userId: session.user.id,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    const review = await db.review.create({
      data: {
        productId,
        userId:    session.user.id,
        orderId:   purchasedOrder.id,
        rating,
        title:     title  || null,
        body:      reviewBody || null,
        photos:    photos || [],
        isApproved: false,
      },
    })

    return NextResponse.json(review)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId        = searchParams.get("productId")

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 })
  }

  try {
    const reviews = await db.review.findMany({
      where:   { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, image: true } } },
    })
    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}