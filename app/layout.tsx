import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Queens Dress Collection — Premium Women's Fashion",
    template: "%s | Queens Dress Collection",
  },
  description:
    "Discover timeless women's fashion at Queens Dress Collection. Shop premium dresses, evening gowns, co-ord sets and more. Free delivery on orders over ৳3,000.",
  keywords: [
    "women's dresses Bangladesh",
    "premium dresses",
    "evening gowns",
    "maxi dresses",
    "midi dresses",
    "women's fashion Bangladesh",
    "Queens Dress Collection",
    "online dress shop Bangladesh",
    "co-ord sets",
    "casual dresses",
  ],
  authors: [{ name: "Queens Dress Collection" }],
  creator: "Queens Dress Collection",
  publisher: "Queens Dress Collection",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Queens Dress Collection",
    title: "Queens Dress Collection — Premium Women's Fashion",
    description:
      "Discover timeless women's fashion. Shop premium dresses, evening gowns, co-ord sets and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Queens Dress Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Queens Dress Collection — Premium Women's Fashion",
    description:
      "Discover timeless women's fashion. Shop premium dresses, evening gowns, co-ord sets and more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${playfair.variable} antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
