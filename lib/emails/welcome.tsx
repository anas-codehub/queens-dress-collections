import * as React from "react";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#faf8f5",
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
                  width="560"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ maxWidth: "560px", width: "100%" }}
                >
                  <tbody>
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

                    <tr>
                      <td
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "40px",
                          textAlign: "center",
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
                          Welcome to the Queens Circle
                        </p>
                        <h2
                          style={{
                            margin: "0 0 16px",
                            color: "#2a1f14",
                            fontFamily: "Georgia, serif",
                            fontSize: "26px",
                          }}
                        >
                          Hello, {name}! 👑
                        </h2>
                        <p
                          style={{
                            margin: "0 0 24px",
                            color: "#7a6a58",
                            fontSize: "13px",
                            lineHeight: "1.8",
                          }}
                        >
                          Thank you for joining Queens Dress Collection. You now
                          have access to exclusive collections, early arrivals,
                          and special offers crafted exclusively for you.
                        </p>

                        <a
                          href={process.env.NEXT_PUBLIC_APP_URL}
                          style={{
                            display: "inline-block",
                            backgroundColor: "#2a1f14",
                            color: "#f0ebe3",
                            padding: "14px 32px",
                            fontSize: "11px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            textDecoration: "none",
                          }}
                        >
                          Start Shopping
                        </a>

                        <p
                          style={{
                            margin: "32px 0 0",
                            color: "#a0907a",
                            fontSize: "12px",
                            lineHeight: "1.8",
                            fontStyle: "italic",
                          }}
                        >
                          "Timeless elegance, crafted exclusively for her."
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          backgroundColor: "#2a1f14",
                          padding: "20px 40px",
                          textAlign: "center",
                        }}
                      >
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
