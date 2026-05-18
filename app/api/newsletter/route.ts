import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body   = await req.json()
    const parsed = z.object({ email: z.string().email() }).safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return NextResponse.json({ error: "Already subscribed!" }, { status: 400 })
    }

    await db.newsletterSubscriber.create({
      data: { email: parsed.data.email },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}