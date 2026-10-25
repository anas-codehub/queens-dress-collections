import { NextResponse }                             from "next/server"
import { db }                                       from "@/lib/db"
import { auth }                                     from "@/lib/auth"
import { sendOrderConfirmation, sendAdminNewOrder } from "@/lib/emails/send"
import { sendCAPIEvent }                            from "@/lib/meta-capi"

// Must match DELIVERY_ZONES labels in checkout/page.tsx
const ZONE_CHARGES: Record<string, number> = {
  "Inside Dhaka":  60,
  "Sub Dhaka":     100,
  "Outside Dhaka": 120,
}

function generateOrderNumber() {
  const date   = new Date()
  const year   = date.getFullYear()
  const month  = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 90000) + 10000
  return `QDC-${year}${month}-${random}`
}

// Convert Bangla digits (০-৯) to English (0-9)
function toEnglishDigits(value: string) {
  return value
    .split("")
    .map((c) => {
      const i = "০১২৩৪৫৬৭৮৯".indexOf(c)
      return i >= 0 ? String(i) : c
    })
    .join("")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shippingInfo, guestEmail } = body

    // ─── Basic validation ──────────────────────────────────────────────────
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }
    if (items.length > 50) {
      return NextResponse.json({ error: "Too many items" }, { status: 400 })
    }
    if (!shippingInfo?.name || !shippingInfo?.phone || !shippingInfo?.line1) {
      return NextResponse.json({ error: "Shipping info required" }, { status: 400 })
    }

    const name = String(shippingInfo.name).trim()
    if (!/^[\u0980-\u09FF a-zA-Z\s]+$/.test(name)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 })
    }

    // Normalize phone to English digits — Steadfast needs English digits
    const phone = toEnglishDigits(String(shippingInfo.phone)).replace(/\D/g, "")
    if (phone.length !== 11) {
      return NextResponse.json({ error: "Phone must be 11 digits" }, { status: 400 })
    }

    // Delivery charge comes from the zone, never from the browser
    const serverShipping = ZONE_CHARGES[shippingInfo.district]
    if (serverShipping === undefined) {
      return NextResponse.json({ error: "Invalid delivery zone" }, { status: 400 })
    }

    // Validate quantities
    for (const i of items) {
      if (!i.productId || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 20) {
        return NextResponse.json({ error: "Invalid item quantity" }, { status: 400 })
      }
    }

    // ─── Optional login ────────────────────────────────────────────────────
    const session = await auth()
    const userId  = session?.user?.id ?? null

    // ─── Verify products + get prices from DB ─────────────────────────────
    const productIds = [...new Set<string>(items.map((i: any) => i.productId))]
    const dbProducts = await db.product.findMany({
      where:  { id: { in: productIds }, isActive: true },
      select: { id: true, price: true },
    })

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products in your cart are no longer available. Please refresh and try again." },
        { status: 400 }
      )
    }

    const priceMap = new Map(dbProducts.map((p) => [p.id, p.price]))

    const orderItems = items.map((i: any) => ({
      productId: i.productId as string,
      name:      String(i.name ?? ""),
      price:     priceMap.get(i.productId) as number, // DB price, not browser price
      quantity:  i.quantity as number,
      size:      i.size  ?? null,
      color:     i.color ?? null,
      image:     i.image ?? null,
    }))

    const serverSubtotal = orderItems.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    )
    const serverTotal = serverSubtotal + serverShipping

    // ─── Create address + order together ──────────────────────────────────
    const orderNumber = generateOrderNumber()
    const email       = guestEmail && /^\S+@\S+\.\S+$/.test(guestEmail) ? guestEmail : null

    const order = await db.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          name,
          phone,
          line1:      String(shippingInfo.line1).trim(),
          line2:      shippingInfo.line2      ?? null,
          city:       shippingInfo.city       ?? "",
          district:   shippingInfo.district   ?? "",
          postalCode: shippingInfo.postalCode ?? null,
          isDefault:  false,
          userId,
        },
      })

      return tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId:     address.id,
          status:        "PENDING",
          paymentStatus: "UNPAID",
          paymentMethod: "COD", // COD only
          subtotal:      serverSubtotal,
          shipping:      serverShipping,
          discount:      0,
          total:         serverTotal,
          guestName:     userId ? null : name,
          guestPhone:    userId ? null : phone,
          guestEmail:    userId ? null : email,
          items:         { create: orderItems },
        },
      })
    })

    // ─── Emails (never block or fail the order) ───────────────────────────
    const emailTo = email ?? session?.user?.email ?? null
    const address = { ...shippingInfo, name, phone }

    if (emailTo) {
      sendOrderConfirmation({
        to:            emailTo,
        orderNumber:   order.orderNumber,
        customerName:  name,
        items:         orderItems.map((i: any) => ({
          name:     i.name,
          quantity: i.quantity,
          price:    i.price,
          size:     i.size,
          color:    i.color,
        })),
        subtotal:      serverSubtotal,
        shipping:      serverShipping,
        total:         serverTotal,
        address,
        paymentMethod: "COD",
      }).catch(() => {})
    }

    sendAdminNewOrder({
      orderNumber:   order.orderNumber,
      customerName:  name,
      customerPhone: phone,
      total:         serverTotal,
      itemCount:     orderItems.length,
      district:      shippingInfo.district ?? "",
      paymentMethod: "COD",
    }).catch(() => {})

    // ─── Server-side tracking (Meta CAPI) ─────────────────────────────────
    const ip        = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim()
    const userAgent = req.headers.get("user-agent") ?? ""

    sendCAPIEvent({
      eventName:  "Purchase",
      eventId:    `purchase-${order.orderNumber}`,
      email:      emailTo ?? undefined,
      phone,
      ip,
      userAgent,
      value:      serverTotal,
      currency:   "BDT",
      orderId:    order.orderNumber,
      contentIds: productIds,
    }).catch(() => {})

    return NextResponse.json({
      success:     true,
      orderId:     order.id,
      orderNumber: order.orderNumber,
      total:       serverTotal, // checkout uses this for the Pixel Purchase value
    })
  } catch (e) {
    console.error("Order error:", e)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const orders = await db.order.findMany({
      where:   { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true, address: true },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}