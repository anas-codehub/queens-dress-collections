const GA_ID            = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GA_SECRET        = process.env.NEXT_PUBLIC_GA_MEASUREMENT_SECRET

export async function sendGAServerEvent(params: {
  name:        string
  clientId?:   string
  value?:      number
  currency?:   string
  transactionId?: string
  items?: {
    item_id:   string
    item_name: string
    price:     number
    quantity:  number
  }[]
}) {
  if (!GA_ID || !GA_SECRET) return

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_ID}&api_secret=${GA_SECRET}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: params.clientId ?? `server-${Date.now()}`,
          events: [{
            name:   params.name,
            params: {
              currency:       params.currency ?? "BDT",
              value:          params.value,
              transaction_id: params.transactionId,
              items:          params.items,
            },
          }],
        }),
      }
    )
  } catch (e) {
    console.error("GA MP error:", e)
  }
}