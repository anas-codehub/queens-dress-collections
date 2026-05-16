import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AdminOrderDetail from "@/components/admin/orders/order-detail";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      coupon: true,
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Orders
        </p>
        <h1 className="font-serif text-3xl text-brand-900">
          {order.orderNumber}
        </h1>
      </div>
      <AdminOrderDetail order={order} />
    </div>
  );
}
