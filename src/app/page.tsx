import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Online Store | The Best Online Shopping Experience</title>
        <meta
          name="description"
          content="Online store with fast delivery, secure payment, and quality assurance. Shop a wide range of products from electronics to clothing."
        />
        <meta
          name="keywords"
          content="online store, online shopping, electronics, clothing, quality products"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#0C1222] via-[#0F1628] to-[#131B30] text-gray-200 mt-15">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-400">
                Welcome to Our Online Store
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              Discover a curated selection of top-quality products—from electronics to fashion, home essentials, and more.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/products"
                aria-label="View our product catalog"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                aria-label="Contact us"
                className="px-8 py-4 bg-transparent border border-blue-500 text-blue-400 font-medium rounded-lg hover:bg-blue-900 hover:bg-opacity-20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Store Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <article className="bg-[#1A2237] p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Fast Delivery</h3>
              <p className="text-gray-400">Quick shipping to all regions with premium postal service</p>
            </article>

            <article className="bg-[#1A2237] p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Secure Payment</h3>
              <p className="text-gray-400">Shop confidently with trusted and secure payment methods</p>
            </article>

            <article className="bg-[#1A2237] p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Quality Guarantee</h3>
              <p className="text-gray-400">All products are backed by authenticity and quality assurance</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
