

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1222] via-[#0F1628] to-[#131B30] text-gray-200 mt-15">
      {/* Main Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-400">
              Welcome to Our Online Store
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8">
            We offer a wide range of products for all your needs.
            From electronics to clothing, home goods to accessories - everything you need in one place.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/products" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90">
              Shop Now
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-transparent border border-blue-500 text-blue-400 font-medium rounded-lg hover:bg-blue-900 hover:bg-opacity-20">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#1A2237] p-6 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Fast Shipping</h3>
            <p className="text-gray-400">Quick delivery to any location with our premium shipping service</p>
          </div>
          
          <div className="bg-[#1A2237] p-6 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Secure Payment</h3>
            <p className="text-gray-400">Shop with confidence using our secure payment methods</p>
          </div>
          
          <div className="bg-[#1A2237] p-6 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Quality Guarantee</h3>
            <p className="text-gray-400">All products come with quality assurance and warranty</p>
          </div>
        </div>
      </div>
    </div>
  );
}