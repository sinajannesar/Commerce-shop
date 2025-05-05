'use client'

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/types';
import dynamic from 'next/dynamic';
import { useFilterStore } from '@/lib/store/usefillterstore';
import useSWR from 'swr';
import { useMemo } from 'react';


const ErrorMessage = dynamic(() => import('@/components/page/ErrorMessage'), { ssr: false });
const NoProductsFound = dynamic(() => import('@/components/page/NoProductsFound'), { ssr: false });
const LoadingSpinner = dynamic(() => import('@/components/page/LoadingSpinner'), { ssr: false });
const FilterPanelSkeleton = dynamic(() => import('@/components/page/FilterPanelSkeleton'), { ssr: false });

const FilterPanel = dynamic(() => import('@/components/fillter/fillterpanel'), {
  ssr: false,
  loading: () => <FilterPanelSkeleton />
})
const ProductCard = dynamic(() => import('@/components/productscart/productcard'));

const fetcher = (url) => fetch(url).then(res => res.json());

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
