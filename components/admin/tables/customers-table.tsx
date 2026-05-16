"use client";

import { useState } from "react";
import { Eye, Mail } from "lucide-react";
import Link from "next/link";

type Customer = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: Date;
  _count: { orders: number };
  orders: { total: number }[];
};

export default function AdminCustomersTable({
  customers,
}: {
  customers: Customer[];
}) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search),
  );

  const totalSpent = (orders: { total: number }[]) =>
    orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-white border border-brand-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-200 bg-brand-50">
              {[
                "Customer",
                "Phone",
                "Orders",
                "Total Spent",
                "Joined",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-xs text-brand-400 tracking-wide"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                >
                  {/* Customer */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs text-brand-600 font-medium">
                          {(customer.name ?? customer.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-brand-800 font-medium tracking-wide">
                          {customer.name ?? "—"}
                        </p>
                        <p className="text-[10px] text-brand-400 tracking-wide mt-0.5">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4">
                    <p className="text-xs text-brand-600 tracking-wide">
                      {customer.phone ?? "—"}
                    </p>
                  </td>

                  {/* Orders */}
                  <td className="px-4 py-4">
                    <span className="text-xs text-brand-600 tracking-wide">
                      {customer._count.orders}
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-brand-900">
                      ৳{totalSpent(customer.orders).toLocaleString()}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-4">
                    <p className="text-[10px] text-brand-400 tracking-wide whitespace-nowrap">
                      {new Date(customer.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                        title="View Customer"
                      >
                        <Eye size={14} strokeWidth={1.5} />
                      </Link>
                      <Link
                        href={`mailto:${customer.email}`}
                        className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                        title="Email Customer"
                      >
                        <Mail size={14} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
