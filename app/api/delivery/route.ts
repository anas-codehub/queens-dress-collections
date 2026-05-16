import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const zones = await db.deliveryZone.findMany()
    return NextResponse.json(zones)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body  = await req.json()
    const { zone, label, charge } = body

    const existing = await db.deliveryZone.findUnique({ where: { zone } })

    if (existing) {
      const updated = await db.deliveryZone.update({
        where: { zone },
        data:  { charge: parseFloat(charge), label },
      })
      return NextResponse.json(updated)
    }

    const created = await db.deliveryZone.create({
      data: { zone, label, charge: parseFloat(charge) },
    })
    return NextResponse.json(created)
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}