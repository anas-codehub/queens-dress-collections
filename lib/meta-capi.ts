const PIXEL_ID = process.env.META_PIXEL_ID
const TOKEN    = process.env.META_CAPI_TOKEN

type CAPIEvent = {
  event_name:  string
  event_time:  number
  user_data:   {
    em?:  string   // hashed email
    ph?:  string   // hashed phone
    client_ip_address?: string
    client_user_agent?: string
  }
  custom_data?: Record<string, any>
  event_source_url?: string
  action_source: string
}

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const buf     = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(data.toLowerCase().trim())
  )
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function sendCAPIEvent(params: {
  eventName:  string
  eventId:    string
  email?:     string
  phone?:     string
  ip?:        string
  userAgent?: string
  value?:     number
  currency?:  string
  orderId?:   string
  contentIds?: string[]
}) {
  if (!PIXEL_ID || !TOKEN) return

  try {
    const userData: CAPIEvent["user_data"] = {}

    if (params.email) userData.em = await hashData(params.email)
    if (params.phone) userData.ph = await hashData(params.phone)
    if (params.ip)    userData.client_ip_address = params.ip
    if (params.userAgent) userData.client_user_agent = params.userAgent

    const event: CAPIEvent = {
      event_name:        params.eventName,
      event_time:        Math.floor(Date.now() / 1000),
      action_source:     "website",
      user_data:         userData,
      event_source_url:  `${process.env.NEXT_PUBLIC_APP_URL}/`,
    }

    if (params.value || params.orderId) {
      event.custom_data = {
        value:       params.value,
        currency:    params.currency ?? "BDT",
        order_id:    params.orderId,
        content_ids: params.contentIds,
      }
    }

    await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ data: [event] }),
      }
    )
  } catch (e) {
    console.error("CAPI error:", e)
  }
}