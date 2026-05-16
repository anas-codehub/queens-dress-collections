import { db } from "@/lib/db";
import DeliveryClient from "@/components/admin/delivery/delivery-client";

export default async function AdminDeliveryPage() {
  const zones = await db.deliveryZone.findMany();

  const chargeMap: Record<string, number> = {};
  zones.forEach((z) => {
    chargeMap[z.zone] = z.charge;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Delivery Charges</h1>
        <p className="text-xs text-brand-400 tracking-wide mt-1">
          Set delivery charges per zone. Customers will be charged automatically
          based on their district.
        </p>
      </div>
      <DeliveryClient chargeMap={chargeMap} />
    </div>
  );
}
