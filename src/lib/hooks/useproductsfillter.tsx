// src/lib/hooks/useproductsfillter.ts
import { useState, useCallback, useMemo } from 'react';
import { Product } from '@/types/types';

interface PriceRange {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
}

export function useProductFilter(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 1000,
    currentMin: 0,
    currentMax: 1000,
  });

  const initializePriceRange = useCallback(() => {
    if (products && products.length > 0) {
      const prices = products.map((product) => product.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      
      setPriceRange({
        min: minPrice,
        max: maxPrice,
        currentMin: minPrice,
        currentMax: maxPrice,
      });
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // فیلتر بر اساس قیمت
      const matchesPrice = 
        product.price >= priceRange.currentMin && 
        product.price <= priceRange.currentMax;
      
      return matchesSearch && matchesPrice;
    });
  }, [products, searchQuery, priceRange.currentMin, priceRange.currentMax]);

  return {
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    filteredProducts,
    initializePriceRange,
  };
}