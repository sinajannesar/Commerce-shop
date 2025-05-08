'use client'

import { useMemo } from 'react';
import { useFilterStore } from '@/lib/store/usefillterstore';

export const useProductFilter = (products = []) => {
  const { searchQuery, priceRange, setSearchQuery, setPriceRange } = useFilterStore();
  
  const initializePriceRange = useMemo(() => {
    return () => {
      if (products.length > 0) {
        const prices = products.map((p) => p.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
      }
    };
  }, [products, setPriceRange]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery.length === 0 ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
  }, [products, searchQuery, priceRange]);

  return {
    searchQuery,
    priceRange,
    setSearchQuery,
    setPriceRange,
    filteredProducts,
    initializePriceRange
  };
};



// const query = searchQuery.toLowerCase().trim();
// const matchesSearch = !query || product.title.toLowerCase().includes(query);