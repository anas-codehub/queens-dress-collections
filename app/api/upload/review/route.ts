import { NextResponse } from "next/server"
import { auth }         from "@/lib/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Please login" }, { status: 401 })
  }
  try {
    const formData = await req.formData()
    const file     = formData.get("file") as File

    if (!file)                          return NextResponse.json({ error: "No file" },          { status: 400 })
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Images only" },     { status: 400 })
    if (file.size > 3 * 1024 * 1024)   return NextResponse.json({ error: "Max 3MB" },           { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await cloudinary.uploader.upload(base64, {
      folder:         "queens-dress-collection/reviews",
      transformation: [
        { width: 600, height: 800, crop: "fill", gravity: "auto" },
        { quality: "auto:good", fetch_format: "auto" },
      ],
    })

    return NextResponse.json({ url: result.secure_url })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}