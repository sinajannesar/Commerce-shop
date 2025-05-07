'use client';

// src/app/products/ProductsList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/types';
import dynamic from 'next/dynamic';
import { useProductFilter } from '@/lib/hooks/useproductsfillter';

const NoProductsFound = dynamic(() => import('@/components/page/NoProductsFound'), { ssr: true });
const FilterPanelSkeleton = dynamic(() => import('@/components/page/FilterPanelSkeleton'), { ssr: true });
const LoadingSpinner = dynamic(() => import('@/components/page/LoadingSpinner'), { ssr: true });

const FilterPanel = dynamic(() => import('@/components/fillter/fillterpanel'), {
  loading: () => <FilterPanelSkeleton />
});

const ProductCard = dynamic(() => import('@/components/productscart/productcard'));

type ProductsListProps = {
  initialProducts: Product[];
};

export default function ProductsList({ initialProducts }: ProductsListProps) {
  const [filterVisible, setFilterVisible] = useState(false);
  const isLoading = false;
  const products = initialProducts;

  const {
    searchQuery,
    priceRange,
    setSearchQuery,
    setPriceRange,
    filteredProducts,
    initializePriceRange
  } = useProductFilter(products);

  const hasProducts = useMemo(() => filteredProducts.length > 0, [filteredProducts]);

  useEffect(() => {
    initializePriceRange();
  }, [products, initializePriceRange]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
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
        <div className="min-h-[500px] w-full">
          {hasProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative aspect-w-1 aspect-h-1"
                  aria-labelledby={`product-${product.id}`}
                  style={{ contain: 'layout' }}
                >
                  <div className="w-full h-full">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <NoProductsFound />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}