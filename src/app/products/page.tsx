import React from 'react';
import { Product } from '@/types/types';
import ProductsList from './clientproducts';
import { fetchProducts  } from "@/app/api/products/route"; 

export default async function ProductsPage() {
    const products: Product[] = await fetchProducts();
    if (!products || products.length === 0) {
        return (
          <div className="min-h-screen flex items-center justify-center text-white">
            <p>No products found.</p>
          </div>
        );
      }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0C1222] via-[#0F1628] to-[#131B30] text-gray-200 mt-15">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-400">
                            Discover Premium Products
                        </span>
                    </h1>
                    <p className="text-base text-gray-400 max-w-2xl mx-auto">
                        Find the perfect item with our exclusive collection
                    </p>
                </div>


                <ProductsList initialProducts={products} />
            </div>
        </div>
    );
}