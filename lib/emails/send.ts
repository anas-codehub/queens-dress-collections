import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM_EMAIL  ?? "orders@queensdresscollection.com"
const ADMIN  = process.env.RESEND_ADMIN_EMAIL ?? "admin@queensdresscollection.com"
const APP    = process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com"

// ─── Shared Styles ────────────────────────────────────────────────────────────
const styles = {
  body:    `margin:0;padding:0;background:#faf8f5;font-family:Arial,sans-serif;`,
  wrapper: `padding:40px 20px;`,
  header:  `background:#2a1f14;padding:32px 40px;text-align:center;`,
  logo:    `margin:0;color:#c8b8a0;font-family:Georgia,serif;font-size:24px;letter-spacing:4px;`,
  sublogo: `margin:8px 0 0;color:#7a6a58;font-size:11px;letter-spacing:2px;text-transform:uppercase;`,
  footer:  `background:#2a1f14;padding:20px 40px;text-align:center;`,
  footerText: `margin:0;color:#5a4a3a;font-size:10px;letter-spacing:1px;`,
  card:    `background:#ffffff;padding:32px 40px;`,
  label:   `margin:0 0 12px;color:#a0907a;font-size:10px;letter-spacing:3px;text-transform:uppercase;`,
  btn:     `display:inline-block;background:#2a1f14;color:#f0ebe3;padding:12px 28px;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;`,
}

// ─── Order Confirmation ───────────────────────────────────────────────────────
export async function sendOrderConfirmation(params: {
  to:            string
  orderNumber:   string
  customerName:  string
  items:         { name: string; quantity: number; price: number; size?: string | null; color?: string | null }[]
  subtotal:      number
  shipping:      number
  total:         number
  address:       { name: string; phone: string; line1: string; city: string; district: string }
  paymentMethod: string
}) {
  const itemRows = params.items.map((item) => {
    const meta = [
      item.size  ? `Size: ${item.size}`   : "",
      item.color ? `Color: ${item.color}` : "",
      `Qty: ${item.quantity}`,
    ].filter(Boolean).join(" · ")

    return `
      <tr style="border-bottom:1px solid #f0ebe3;">
        <td style="padding:12px 0;color:#3a2e24;font-size:13px;">
          <strong>${item.name}</strong><br/>
          <span style="color:#a0907a;font-size:11px;">${meta}</span>
        </td>
        <td style="padding:12px 0;color:#3a2e24;font-size:13px;text-align:right;font-weight:bold;">
          ৳${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
  }).join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="${styles.body}">
      <table width="100%" cellpadding="0" cellspacing="0" style="${styles.wrapper}">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <tr><td style="${styles.header}">
              <h1 style="${styles.logo}">QDC</h1>
              <p style="${styles.sublogo}">Queens Dress Collection</p>
            </td></tr>

            <tr><td style="background:#f0ebe3;padding:32px 40px;text-align:center;border-bottom:1px solid #e0d5c8;">
              <p style="margin:0 0 8px;color:#a0907a;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Order Confirmed</p>
              <h2 style="margin:0 0 8px;color:#2a1f14;font-family:Georgia,serif;font-size:26px;">Thank you, ${params.customerName}!</h2>
              <p style="margin:0;color:#7a6a58;font-size:13px;">Your order <strong style="color:#3a2e24;">${params.orderNumber}</strong> has been placed successfully.</p>
            </td></tr>

            <tr><td style="${styles.card}">

              <p style="${styles.label}">Items Ordered</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${itemRows}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-top:1px solid #e0d5c8;padding-top:16px;">
                <tr>
                  <td style="padding:4px 0;color:#7a6a58;font-size:12px;">Subtotal</td>
                  <td style="padding:4px 0;color:#3a2e24;font-size:12px;text-align:right;">৳${params.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#7a6a58;font-size:12px;">Delivery</td>
                  <td style="padding:4px 0;color:#3a2e24;font-size:12px;text-align:right;">${params.shipping === 0 ? "Free" : `৳${params.shipping.toLocaleString()}`}</td>
                </tr>
                <tr style="border-top:1px solid #e0d5c8;">
                  <td style="padding:12px 0 4px;color:#2a1f14;font-size:14px;font-weight:bold;">Total</td>
                  <td style="padding:12px 0 4px;color:#2a1f14;font-size:14px;font-weight:bold;text-align:right;">৳${params.total.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color:#a0907a;font-size:11px;">Payment Method</td>
                  <td style="color:#a0907a;font-size:11px;text-align:right;">${params.paymentMethod}</td>
                </tr>
              </table>

              <p style="${styles.label}">Delivery Address</p>
              <div style="background:#faf8f5;padding:16px;border:1px solid #e0d5c8;">
                <p style="margin:0;color:#3a2e24;font-size:13px;font-weight:bold;">${params.address.name}</p>
                <p style="margin:4px 0 0;color:#7a6a58;font-size:12px;">${params.address.phone}</p>
                <p style="margin:4px 0 0;color:#7a6a58;font-size:12px;">${params.address.line1}</p>
                <p style="margin:4px 0 0;color:#7a6a58;font-size:12px;">${params.address.city}, ${params.address.district}</p>
              </div>

            </td></tr>

            <tr><td style="${styles.footer}">
              <p style="margin:0 0 8px;color:#7a6a58;font-size:11px;">Questions? Reply to this email or contact us on WhatsApp.</p>
              <p style="${styles.footerText}">© 2026 Queens Dress Collection. All rights reserved.</p>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from:    `Queens Dress Collection <${FROM}>`,
      to:      params.to,
      subject: `Order Confirmed — ${params.orderNumber} 🛍️`,
      html,
    })
  } catch (e) {
    console.error("Failed to send order confirmation:", e)
  }
}

// ─── Admin New Order Notification ─────────────────────────────────────────────
export async function sendAdminNewOrder(params: {
  orderNumber:   string
  customerName:  string
  customerPhone: string
  total:         number
  itemCount:     number
  district:      string
  paymentMethod: string
}) {
  const rows = [
    { label: "Customer",  value: params.customerName  },
    { label: "Phone",     value: params.customerPhone },
    { label: "Items",     value: `${params.itemCount} item${params.itemCount !== 1 ? "s" : ""}` },
    { label: "Total",     value: `৳${params.total.toLocaleString()}` },
    { label: "District",  value: params.district      },
    { label: "Payment",   value: params.paymentMethod },
  ].map((r) => `
    <tr style="border-bottom:1px solid #f0ebe3;">
      <td style="padding:10px 0;color:#a0907a;font-size:12px;width:40%;">${r.label}</td>
      <td style="padding:10px 0;color:#2a1f14;font-size:12px;font-weight:bold;">${r.value}</td>
    </tr>
  `).join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="${styles.body}">
      <table width="100%" cellpadding="0" cellspacing="0" style="${styles.wrapper}">
        <tr><td align="center">
          <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;background:#ffffff;border:1px solid #e0d5c8;">

            <tr><td style="${styles.header}">
              <h1 style="${styles.logo}">QDC Admin</h1>
              <p style="${styles.sublogo}">New Order Received</p>
            </td></tr>

            <tr><td style="${styles.card}">
              <p style="margin:0 0 24px;color:#3a2e24;font-size:16px;">
                🎉 New order <strong>${params.orderNumber}</strong> has been placed!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
              <div style="margin-top:24px;text-align:center;">
                <a href="${APP}/admin/orders" style="${styles.btn}">View Order in Admin</a>
              </div>
            </td></tr>

            <tr><td style="${styles.footer}">
              <p style="${styles.footerText}">Queens Dress Collection Admin System</p>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from:    `QDC System <${FROM}>`,
      to:      ADMIN,
      subject: `🛒 New Order: ${params.orderNumber} — ৳${params.total.toLocaleString()}`,
      html,
    })
  } catch (e) {
    console.error("Failed to send admin notification:", e)
  }
}

// ─── Welcome Email ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(params: {
  to:   string
  name: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="${styles.body}">
      <table width="100%" cellpadding="0" cellspacing="0" style="${styles.wrapper}">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

            <tr><td style="${styles.header}">
              <h1 style="${styles.logo}">QDC</h1>
              <p style="${styles.sublogo}">Queens Dress Collection</p>
            </td></tr>

            <tr><td style="background:#ffffff;padding:40px;text-align:center;">
              <p style="margin:0 0 8px;color:#a0907a;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Welcome to the Queens Circle</p>
              <h2 style="margin:0 0 16px;color:#2a1f14;font-family:Georgia,serif;font-size:26px;">Hello, ${params.name}! 👑</h2>
              <p style="margin:0 0 24px;color:#7a6a58;font-size:13px;line-height:1.8;">
                Thank you for joining Queens Dress Collection. You now have access to exclusive collections, early arrivals, and special offers crafted exclusively for you.
              </p>
              <a href="${APP}" style="${styles.btn}">Start Shopping</a>
              <p style="margin:32px 0 0;color:#a0907a;font-size:12px;line-height:1.8;font-style:italic;">
                "Timeless elegance, crafted exclusively for her."
              </p>
            </td></tr>

            <tr><td style="${styles.footer}">
              <p style="${styles.footerText}">© 2026 Queens Dress Collection. All rights reserved.</p>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from:    `Queens Dress Collection <${FROM}>`,
      to:      params.to,
      subject: "Welcome to Queens Dress Collection 👑",
      html,
    })
  } catch (e) {
    console.error("Failed to send welcome email:", e)
  }
}