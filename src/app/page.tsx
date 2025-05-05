'use client'

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/types';
import dynamic from 'next/dynamic';
import { useFilterStore } from '@/lib/store/usefillterstore';
import useSWR from 'swr';
import { useMemo } from 'react';

const fetcher = (url) => fetch(url).then(res => res.json());

const FilterPanel = dynamic(() => import('@/components/fillter/fillterpanel'), {
  ssr: false,
  loading: () => <FilterPanelSkeleton />
});

const ProductCard = dynamic(() => import('@/components/productscart/productcard'));

const FilterPanelSkeleton = () => (
  <div className="flex flex-col gap-4 p-4 rounded-lg bg-[#1A223C]/40 backdrop-blur-sm border border-[#2A3454]/50">
    <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
    <div className="h-6 bg-gray-700/40 rounded w-2/3"></div>
    <div className="h-6 bg-gray-700/30 rounded w-5/6"></div>
    <div className="h-6 bg-gray-700/20 rounded w-1/2"></div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0C1222] text-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-indigo-500 border-l-transparent animate-spin" aria-hidden="true"></div>
        <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-indigo-400 border-r-transparent border-b-purple-400 border-l-blue-400 animate-spin" aria-hidden="true"></div>
      </div>
      <p className="text-lg font-medium text-blue-300" aria-live="polite">Loading amazing products...</p>
    </div>
  </div>
);

const ErrorMessage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C1222] text-white" role="alert" aria-live="assertive">
    <div className="p-8 rounded-xl bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border border-red-700/30 text-center max-w-md">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" aria-hidden="true"></div>
        <svg
          className="w-20 h-20 relative z-10 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-red-300 mb-3">Error Loading Products</h2>
      <p className="text-red-200 opacity-90">Failed to load products</p>
      <button
        className="mt-6 px-5 py-2 bg-red-700/50 hover:bg-red-600/50 transition-colors rounded-lg text-white font-medium"
        onClick={() => window.location.reload()}
        aria-label="Try Again"
      >
        Try Again
      </button>
    </div>
  </div>
);

const NoProductsFound = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-[#1A223C]/40 backdrop-blur-sm rounded-2xl border border-[#2A3454]/50">
    <div className="w-24 h-24 rounded-full bg-[#131B30] flex items-center justify-center mb-4">
      <svg className="w-12 h-12 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
    <p className="text-gray-400 max-w-md px-6">
      Try adjusting your search criteria or price range to find products.
    </p>
  </div>
);

// Main component with optimizations
export default function ProductsPage() {
  const { data: products = [], error, isLoading } = useSWR<Product[]>(
    '/api/products', 
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
      dedupingInterval: 60000
    }
  );

  const { searchQuery, priceRange, setSearchQuery, setPriceRange } = useFilterStore();
  const [filterVisible, setFilterVisible] = useState(false);

  // Use useEffect with proper dependencies
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, setPriceRange]);

  // Memoize filtered products to prevent recalculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery.length === 0 || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
  }, [products, searchQuery, priceRange]);

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error) {
    return <ErrorMessage />;
  }

  // Render main content
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

        <div className="flex flex-col md:flex-row gap-4">
          <FilterPanel
            products={products}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            filteredProducts={filteredProducts}
          />

          <div className="md:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative" aria-labelledby={`product-${product.id}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <NoProductsFound />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
