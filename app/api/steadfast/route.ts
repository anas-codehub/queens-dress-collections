import { NextResponse }          from "next/server"
import { db }                    from "@/lib/db"
import { auth }                  from "@/lib/auth"
import { createSteadfastOrder }  from "@/lib/steadfast"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { orderId } = await req.json()

    const order = await db.order.findUnique({
      where:   { id: orderId },
      include: {
        address: true,
        items:   true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.steadfastConsignment) {
      return NextResponse.json(
        { error: "Already sent to Steadfast" },
        { status: 400 }
      )
    }

    const result = await createSteadfastOrder({
      invoice:           order.orderNumber,
      recipient_name:    order.address.name,
      recipient_phone:   order.address.phone,
      recipient_address: `${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""}, ${order.address.city}, ${order.address.district}`,
      cod_amount:        order.paymentMethod === "COD" ? order.total : 0,
      note:              order.notes ?? `Order ${order.orderNumber} — ${order.items.length} item(s)`,
    })

    if (result.status !== 200) {
      return NextResponse.json(
        { error: result.message ?? "Steadfast error" },
        { status: 400 }
      )
    }

    // Save consignment ID to order
    await db.order.update({
      where: { id: orderId },
      data:  {
        steadfastConsignment: result.consignment?.consignment_id?.toString() ?? "",
        status: "PROCESSING",
      },
    })

    return NextResponse.json({
      success:        true,
      consignment_id: result.consignment?.consignment_id,
      tracking_code:  result.consignment?.tracking_code,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}