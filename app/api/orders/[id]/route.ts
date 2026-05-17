import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const order  = await db.order.findUnique({
      where:   { id },
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params
    const body   = await req.json()
    const order  = await db.order.update({
      where: { id },
      data:  body,
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}