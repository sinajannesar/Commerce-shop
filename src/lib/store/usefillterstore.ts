import { create } from 'zustand';
import { Product } from '@/types/types';

interface FilterState {
  searchQuery: string;
  priceRange: [number, number];
  products: Product[];
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setProducts: (products: Product[]) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  priceRange: [0, 1000],
  products: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriceRange: (range) => set({ priceRange: range }),
  setProducts: (products) => set({ products }),
}));