import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body  = await req.json()
    const order = await db.order.update({
      where: { id: params.id },
      data:  body,
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const order = await db.order.findUnique({
      where:   { id: params.id },
      include: {
        user:    true,
        address: true,
        items:   { include: { product: true } },
        coupon:  true,
      },
    })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}