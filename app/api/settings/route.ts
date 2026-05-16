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

    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        db.siteSettings.upsert({
          where:  { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const settings = await db.siteSettings.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s) => { map[s.key] = s.value })
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}