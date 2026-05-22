import * as React from "react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
};

type Props = {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    district: string;
  };
  paymentMethod: string;
};

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shipping,
  total,
  address,
  paymentMethod,
}: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#faf8f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Container */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#faf8f5", padding: "40px 20px" }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{ maxWidth: "600px", width: "100%" }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      backgroundColor: "#2a1f14",
                      padding: "32px 40px",
                      textAlign: "center",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        color: "#c8b8a0",
                        fontFamily: "Georgia, serif",
                        fontSize: "24px",
                        letterSpacing: "4px",
                      }}
                    >
                      QDC
                    </h1>
                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "#7a6a58",
                        fontSize: "11px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      Queens Dress Collection
                    </p>
                  </td>
                </tr>

                {/* Order Confirmed */}
                <tr>
                  <td
                    style={{
                      backgroundColor: "#f0ebe3",
                      padding: "32px 40px",
                      textAlign: "center",
                      borderBottom: "1px solid #e0d5c8",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#a0907a",
                        fontSize: "11px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                      }}
                    >
                      Order Confirmed
                    </p>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        color: "#2a1f14",
                        fontFamily: "Georgia, serif",
                        fontSize: "28px",
                      }}
                    >
                      Thank you, {customerName}!
                    </h2>
                    <p
                      style={{ margin: 0, color: "#7a6a58", fontSize: "13px" }}
                    >
                      Your order{" "}
                      <strong style={{ color: "#3a2e24" }}>
                        {orderNumber}
                      </strong>{" "}
                      has been placed successfully.
                    </p>
                  </td>
                </tr>

                {/* White card */}
                <tr>
                  <td
                    style={{ backgroundColor: "#ffffff", padding: "32px 40px" }}
                  >
                    {/* Items */}
                    <p
                      style={{
                        margin: "0 0 16px",
                        color: "#a0907a",
                        fontSize: "10px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                      }}
                    >
                      Items Ordered
                    </p>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ marginBottom: "24px" }}
                    >
                      {items.map((item, i) => (
                        <tr
                          key={i}
                          style={{ borderBottom: "1px solid #f0ebe3" }}
                        >
                          <td
                            style={{
                              padding: "12px 0",
                              color: "#3a2e24",
                              fontSize: "13px",
                            }}
                          >
                            <strong>{item.name}</strong>
                            <br />
                            <span
                              style={{ color: "#a0907a", fontSize: "11px" }}
                            >
                              {[
                                item.size && `Size: ${item.size}`,
                                item.color && `Color: ${item.color}`,
                                `Qty: ${item.quantity}`,
                              ]
                                .filter(Boolean)
                                .join("  ·  ")}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "12px 0",
                              color: "#3a2e24",
                              fontSize: "13px",
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </table>

                    {/* Totals */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        marginBottom: "24px",
                        borderTop: "1px solid #e0d5c8",
                        paddingTop: "16px",
                      }}
                    >
                      <tr>
                        <td
                          style={{
                            padding: "4px 0",
                            color: "#7a6a58",
                            fontSize: "12px",
                          }}
                        >
                          Subtotal
                        </td>
                        <td
                          style={{
                            padding: "4px 0",
                            color: "#3a2e24",
                            fontSize: "12px",
                            textAlign: "right",
                          }}
                        >
                          ৳{subtotal.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "4px 0",
                            color: "#7a6a58",
                            fontSize: "12px",
                          }}
                        >
                          Delivery
                        </td>
                        <td
                          style={{
                            padding: "4px 0",
                            color: "#3a2e24",
                            fontSize: "12px",
                            textAlign: "right",
                          }}
                        >
                          {shipping === 0
                            ? "Free"
                            : `৳${shipping.toLocaleString()}`}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "1px solid #e0d5c8" }}>
                        <td
                          style={{
                            padding: "12px 0 4px",
                            color: "#2a1f14",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          Total
                        </td>
                        <td
                          style={{
                            padding: "12px 0 4px",
                            color: "#2a1f14",
                            fontSize: "14px",
                            fontWeight: "bold",
                            textAlign: "right",
                          }}
                        >
                          ৳{total.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: "#a0907a", fontSize: "11px" }}>
                          Payment Method
                        </td>
                        <td
                          style={{
                            color: "#a0907a",
                            fontSize: "11px",
                            textAlign: "right",
                          }}
                        >
                          {paymentMethod}
                        </td>
                      </tr>
                    </table>

                    {/* Delivery Address */}
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: "#a0907a",
                        fontSize: "10px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                      }}
                    >
                      Delivery Address
                    </p>
                    <div
                      style={{
                        backgroundColor: "#faf8f5",
                        padding: "16px",
                        border: "1px solid #e0d5c8",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "#3a2e24",
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        {address.name}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#7a6a58",
                          fontSize: "12px",
                        }}
                      >
                        {address.phone}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#7a6a58",
                          fontSize: "12px",
                        }}
                      >
                        {address.line1}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#7a6a58",
                          fontSize: "12px",
                        }}
                      >
                        {address.city}, {address.district}
                      </p>
                    </div>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      backgroundColor: "#2a1f14",
                      padding: "24px 40px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#7a6a58",
                        fontSize: "11px",
                      }}
                    >
                      Questions? Reply to this email or contact us on WhatsApp.
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#5a4a3a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                      }}
                    >
                      © 2026 Queens Dress Collection. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
