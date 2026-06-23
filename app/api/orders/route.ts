import { NextResponse }                          from "next/server"
import { db }                                    from "@/lib/db"
import { auth }                                  from "@/lib/auth"
import { sendOrderConfirmation, sendAdminNewOrder } from "@/lib/emails/send"
import { sendCAPIEvent }                         from "@/lib/meta-capi"

function generateOrderNumber() {
  const date   = new Date()
  const year   = date.getFullYear()
  const month  = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 9000) + 1000
  return `QDC-${year}${month}-${random}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      items,
      shippingInfo,
      paymentMethod = "COD",
      subtotal,
      shipping,
      total,
      guestEmail,
    } = body

    if (!items?.length) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }
    if (!shippingInfo?.name || !shippingInfo?.phone || !shippingInfo?.line1) {
      return NextResponse.json({ error: "Shipping info required" }, { status: 400 })
    }

    // Check if logged in — optional
    const session = await auth()
    const userId  = session?.user?.id ?? null

    // Verify all products exist
const productIds  = items.map((i: any) => i.productId)
const dbProducts  = await db.product.findMany({
  where:  { id: { in: productIds } },
  select: { id: true },
})

const foundIds    = dbProducts.map((p) => p.id)
const missingIds  = productIds.filter((id: string) => !foundIds.includes(id))

if (missingIds.length > 0) {
  return NextResponse.json(
    { error: "Some products in your cart no longer exist. Please refresh and try again." },
    { status: 400 }
  )
}

    const orderNumber = generateOrderNumber()

    // Create or find address
    const address = await db.address.create({
      data: {
        name:       shippingInfo.name,
        phone:      shippingInfo.phone,
        line1:      shippingInfo.line1,
        line2:      shippingInfo.line2     ?? null,
        city:       shippingInfo.city      ?? "",
        district:   shippingInfo.district  ?? "",
        postalCode: shippingInfo.postalCode ?? null,
        isDefault:  false,
        userId:     userId,
      },
    })

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        addressId:     address.id,
        status:        "PENDING",
        paymentStatus: "UNPAID",
        paymentMethod,
        subtotal,
        shipping,
        discount:      0,
        total,
        guestName:     userId ? null : shippingInfo.name,
        guestPhone:    userId ? null : shippingInfo.phone,
        guestEmail:    userId ? null : (guestEmail ?? null),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name:      item.name,
            price:     item.price,
            quantity:  item.quantity,
            size:      item.size  ?? null,
            color:     item.color ?? null,
            image:     item.image ?? null,
          })),
        },
      },
    })

    // Send emails
    const emailTo = guestEmail ?? session?.user?.email ?? null

    if (emailTo) {
      sendOrderConfirmation({
        to:            emailTo,
        orderNumber:   order.orderNumber,
        customerName:  shippingInfo.name,
        items:         items.map((item: any) => ({
          name:     item.name,
          quantity: item.quantity,
          price:    item.price,
          size:     item.size  ?? null,
          color:    item.color ?? null,
        })),
        subtotal,
        shipping,
        total:         order.total,
        address:       shippingInfo,
        paymentMethod,
      })
    }

    sendAdminNewOrder({
      orderNumber:   order.orderNumber,
      customerName:  shippingInfo.name,
      customerPhone: shippingInfo.phone,
      total:         order.total,
      itemCount:     items.length,
      district:      shippingInfo.district ?? shippingInfo.city ?? "",
      paymentMethod,
    })

    // Server side tracking
    const ip        = req.headers.get("x-forwarded-for") ?? ""
    const userAgent = req.headers.get("user-agent")       ?? ""

    sendCAPIEvent({
      eventName:   "Purchase",
      eventId:     `purchase-${orderNumber}`,
      email:       emailTo ?? undefined,
      phone:       shippingInfo.phone,
      ip,
      userAgent,
      value:       total,
      currency:    "BDT",
      orderId:     orderNumber,
      contentIds:  items.map((i: any) => i.productId),
    })

    return NextResponse.json({
      success:     true,
      orderId:     order.id,
      orderNumber: order.orderNumber,
    })
  } catch (e) {
    console.error("Order error:", e)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const orders = await db.order.findMany({
      where:   { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items:   true,
        address: true,
      },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}