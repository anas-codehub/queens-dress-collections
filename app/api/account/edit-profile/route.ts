import { NextResponse } from "next/server"
import { db }           from "@/lib/db"
import { auth }         from "@/lib/auth"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { name } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    await db.user.update({
      where: { id: session.user.id },
      data:  { name: name.trim() },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}