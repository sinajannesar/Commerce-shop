import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers"
import AppShell from "@/lib/layout/AppShell";
export const metadata: Metadata = {
  title: "Shop - The Ultimate Online Store",
  description: "Discover the best deals on electronics, fashion, home essentials and more. Fast delivery. Secure checkout.",
  keywords: "online shopping, buy electronics, fashion deals, best prices, shop online, ecommerce, secure checkout, fast delivery",
  authors: [{ name: "Shop Team", url: "https://yourdomain.com" }],
  creator: "Shop Platform",
  openGraph: {
    title: "Shop - The Ultimate Online Store",
    description: "Your destination for top quality products at unbeatable prices.",
    url: "https://yourdomain.com",
    siteName: "Shop",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shop homepage preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop - The Ultimate Online Store",
    description: "Explore trending products with fast delivery and secure payment.",
    site: "@shop",
    creator: "@shop",
    images: ["https://yourdomain.com/twitter-image.jpg"],
  },
  metadataBase: new URL("https://yourdomain.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
