import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol:  "https",
        hostname:  "res.cloudinary.com",
        port:      "",
        pathname:  "/**",
      },
      {
        protocol:  "https",
        hostname:  "images.unsplash.com",
        port:      "",
        pathname:  "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff"                       },
          { key: "X-Frame-Options",        value: "DENY"                          },
          { key: "X-XSS-Protection",       value: "1; mode=block"                 },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key:   "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL ?? "*",
          },
          {
            key:   "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
        ],
      },
    ]
  },
}

export default nextConfig