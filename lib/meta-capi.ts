const PIXEL_ID = process.env.META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_TEST_EVENT_CODE; // optional, only for testing
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdress.com";

type CAPIEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  action_source: string;
  event_source_url: string;
  user_data: {
    em?: string[];
    ph?: string[];
    country?: string[];
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
  };
  custom_data?: Record<string, any>;
};

async function hashData(data: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data.toLowerCase().trim()),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Meta wants digits only, with country code and no leading zero.
// 01712345678 -> 8801712345678
function normalizeBDPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return "880" + digits.slice(1);
  return "880" + digits;
}

export async function sendCAPIEvent(params: {
  eventName: string;
  eventId: string;
  email?: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  value?: number;
  currency?: string;
  orderId?: string;
  contentIds?: string[];
  sourceUrl?: string;
}) {
  if (!PIXEL_ID || !TOKEN) return;

  try {
    const userData: CAPIEvent["user_data"] = {
      country: [await hashData("bd")],
    };

    if (params.email) userData.em = [await hashData(params.email)];
    if (params.phone)
      userData.ph = [await hashData(normalizeBDPhone(params.phone))];
    if (params.ip) userData.client_ip_address = params.ip;
    if (params.userAgent) userData.client_user_agent = params.userAgent;
    if (params.fbp) userData.fbp = params.fbp;
    if (params.fbc) userData.fbc = params.fbc;

    const event: CAPIEvent = {
      event_name: params.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: params.eventId, // must match the browser eventID
      action_source: "website",
      event_source_url: params.sourceUrl ?? `${APP_URL}/checkout`,
      user_data: userData,
    };

    // For Purchase, value and currency must always be present
    if (params.eventName === "Purchase") {
      event.custom_data = {
        value: Number(params.value ?? 0),
        currency: params.currency ?? "BDT",
        order_id: params.orderId,
        content_ids: params.contentIds,
        content_type: "product",
        num_items: params.contentIds?.length,
      };
    }

    const body: Record<string, any> = { data: [event] };
    if (TEST_CODE) body.test_event_code = TEST_CODE;

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      console.error("CAPI rejected:", res.status, await res.text());
    }
  } catch (e) {
    console.error("CAPI error:", e);
  }
}