import * as React from "react";

type Props = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  itemCount: number;
  district: string;
  paymentMethod: string;
};

export function AdminNewOrderEmail({
  orderNumber,
  customerName,
  customerPhone,
  total,
  itemCount,
  district,
  paymentMethod,
}: Props) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f7f6f3",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ padding: "40px 20px" }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="500"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    maxWidth: "500px",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0d5c8",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#2a1f14",
                          padding: "24px 32px",
                        }}
                      >
                        <h1
                          style={{
                            margin: 0,
                            color: "#c8b8a0",
                            fontFamily: "Georgia, serif",
                            fontSize: "20px",
                            letterSpacing: "3px",
                          }}
                        >
                          QDC Admin
                        </h1>
                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "#7a6a58",
                            fontSize: "10px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                          }}
                        >
                          New Order Received
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "32px" }}>
                        <p
                          style={{
                            margin: "0 0 24px",
                            color: "#3a2e24",
                            fontSize: "16px",
                          }}
                        >
                          🎉 New order <strong>{orderNumber}</strong> has been
                          placed!
                        </p>

                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            {[
                              { label: "Customer", value: customerName },
                              { label: "Phone", value: customerPhone },
                              {
                                label: "Items",
                                value: `${itemCount} item${itemCount !== 1 ? "s" : ""}`,
                              },
                              {
                                label: "Total",
                                value: `৳${total.toLocaleString()}`,
                              },
                              { label: "District", value: district },
                              { label: "Payment", value: paymentMethod },
                            ].map((row, i) => (
                              <tr
                                key={i}
                                style={{ borderBottom: "1px solid #f0ebe3" }}
                              >
                                <td
                                  style={{
                                    padding: "10px 0",
                                    color: "#a0907a",
                                    fontSize: "12px",
                                    width: "40%",
                                  }}
                                >
                                  {row.label}
                                </td>
                                <td
                                  style={{
                                    padding: "10px 0",
                                    color: "#2a1f14",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: "24px", textAlign: "center" }}>
                          <a
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#2a1f14",
                              color: "#f0ebe3",
                              padding: "12px 24px",
                              fontSize: "11px",
                              letterSpacing: "2px",
                              textTransform: "uppercase",
                              textDecoration: "none",
                            }}
                          >
                            View Order in Admin
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
