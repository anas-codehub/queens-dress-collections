    const BASE_URL  = process.env.STEADFAST_BASE_URL    ?? "https://portal.steadfast.com.bd/api/v1"
const API_KEY   = process.env.STEADFAST_API_KEY      ?? ""
const API_SECRET= process.env.STEADFAST_API_SECRET   ?? ""

const headers = {
  "Api-Key":    API_KEY,
  "Secret-Key": API_SECRET,
  "Content-Type": "application/json",
}

export async function createSteadfastOrder(params: {
  invoice:          string
  recipient_name:   string
  recipient_phone:  string
  recipient_address:string
  cod_amount:       number
  note?:            string
}) {
  const res = await fetch(`${BASE_URL}/create_order`, {
    method:  "POST",
    headers,
    body: JSON.stringify(params),
  })
  return res.json()
}

export async function getSteadfastStatus(invoice: string) {
  const res = await fetch(
    `${BASE_URL}/status_by_invoice/${invoice}`,
    { headers }
  )
  return res.json()
}

export async function getSteadfastBalance() {
  const res = await fetch(`${BASE_URL}/get_balance`, { headers })
  return res.json()
}