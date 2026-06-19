import { NextResponse } from "next/server"
import { db }           from "@/lib/db"
import { auth }         from "@/lib/auth"
import bcrypt           from "bcryptjs"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Get user with password
    const user = await db.user.findUnique({
      where:  { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return NextResponse.json({ error: "No password set" }, { status: 400 })
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash and save new password
    const hashed = await bcrypt.hash(newPassword, 12)
    await db.user.update({
      where: { id: session.user.id },
      data:  { password: hashed },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}