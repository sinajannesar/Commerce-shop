import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Premium Products | YourStore',
  description: 'Explore high-quality, handpicked products that suit your style and needs. Shop premium items now at YourStore.',
  keywords: ['premium products', 'exclusive items', 'online store', 'YourStore', 'buy products online'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Discover Premium Products | YourStore',
    description: 'Explore high-quality, handpicked products that suit your style and needs.',
    url: 'https://yourstore.com/products',
    siteName: 'YourStore',
    type: 'website',
    images: [
      {
        url: 'https://yourstore.com/og-image.jpg', // یه تصویر og خوب بذار
        width: 1200,
        height: 630,
        alt: 'Premium Products at YourStore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Premium Products | YourStore',
    description: 'Shop premium items now at YourStore.',
    images: ['https://yourstore.com/og-image.jpg'],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#0C1222] text-gray-200">
      {children}
    </main>
  );
}
