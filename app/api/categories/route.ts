import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body     = await req.json()
    const category = await db.category.create({ data: body })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}