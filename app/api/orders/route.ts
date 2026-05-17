import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Please login to place an order" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      items,
      shippingInfo,
      paymentMethod,
      subtotal,
      shipping,
      total,
      couponCode,
    } = body

    // Create address
    const address = await db.address.create({
      data: {
        userId:    session.user.id,
        name:      shippingInfo.name,
        phone:     shippingInfo.phone,
        line1:     shippingInfo.line1,
        line2:     shippingInfo.line2 || null,
        city:      shippingInfo.city,
        district:  shippingInfo.district,
        postalCode: shippingInfo.postalCode || null,
        isDefault: false,
      },
    })

    // Find coupon if provided
    let couponId   = null
    let discount   = 0

    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      })

      if (coupon && coupon.isActive) {
        couponId = coupon.id
        if (coupon.type === "PERCENT") {
          discount = (subtotal * coupon.value) / 100
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount)
          }
        } else {
          discount = coupon.value
        }

        // Increment usage count
        await db.coupon.update({
          where: { id: coupon.id },
          data:  { usedCount: { increment: 1 } },
        })
      }
    }

    // Generate order number
    const orderNumber = `QDC-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId:        session.user.id,
        addressId:     address.id,
        couponId,
        subtotal,
        discount,
        shipping,
        total:         total - discount,
        status:        "PENDING",
        paymentStatus: paymentMethod === "COD" ? "UNPAID" : "UNPAID",
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name:      item.name,
            image:     item.image || null,
            price:     item.price,
            quantity:  item.quantity,
            size:      item.size  || null,
            color:     item.color || null,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}