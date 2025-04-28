'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/types';
import dynamic from 'next/dynamic';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import debounce from 'lodash.debounce';
import { useFilterStore } from '@/lib/store/usefillterstore';

// Dynamically import ProductCard
const ProductCard = dynamic(() => import('@/components/productscart/productcard'), { ssr: true });

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery, priceRange, setSearchQuery, setPriceRange } = useFilterStore();
  
  // Add local input state to track what the user is typing
  const [inputValue, setInputValue] = useState(searchQuery);
  // State for filter panel visibility on mobile
  const [filterVisible, setFilterVisible] = useState(false);

  // Fetch products from API route
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const fetchedProducts: Product[] = await response.json();
        setProducts(fetchedProducts);
        setIsLoading(false);
        // Set initial price range based on products
        if (fetchedProducts.length > 0) {
          const prices = fetchedProducts.map((p) => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch {
        setError('Failed to load products');
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [setPriceRange]);

  // Sync local input value with store when searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Create debounced function to update store
  const debouncedSetSearchQuery = useMemo(
    () => debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    [setSearchQuery]
  );

  // Handle input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Update local state immediately
    setInputValue(newValue);
    // Update store with debounce
    debouncedSetSearchQuery(newValue);
  };

  // Clear search
  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  // Calculate min/max prices for slider
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Filter products based on search query and price range
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
  }, [products, searchQuery, priceRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0C1222] text-white">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-indigo-500 border-l-transparent animate-spin"></div>
            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-indigo-400 border-r-transparent border-b-purple-400 border-l-blue-400 animate-spin "></div>
          </div>
          <p className="text-lg font-medium text-blue-300">Loading amazing products...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C1222] text-white">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border border-red-700/30 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            <svg
              className="w-20 h-20 relative z-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
          <p className="text-red-200 opacity-90">{error}</p>
          <button 
            className="mt-6 px-5 py-2 bg-red-700/50 hover:bg-red-600/50 transition-colors rounded-lg text-white font-medium"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1222] via-[#0F1628] to-[#131B30] text-gray-200 mt-10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-400 ">
              Discover Premium Products
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Find the perfect item with our exclusive collection
          </p>
        </motion.div>

        {/* Filter Toggle for Mobile */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setFilterVisible(!filterVisible)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1A223C] rounded-lg border border-[#2A3454] text-blue-300"
          >
            <div className="flex items-center">
              <FiFilter className="mr-2" />
              <span>Filters</span>
            </div>
            <FiChevronDown className={`transition-transform ${filterVisible ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel */}
          <motion.div
            className={`${filterVisible ? 'block' : 'hidden'} md:block md:w-1/4`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#1A223C]/80 backdrop-blur-sm rounded-2xl border border-[#2A3454] overflow-hidden shadow-xl shadow-blue-900/10 mb-6">
              {/* Search Bar */}
              <div className="p-4 border-b border-[#2A3454]/70">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-blue-400/70" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    onChange={handleSearch}
                    value={inputValue}
                    className="w-full bg-[#131B30]/80 pl-10 pr-10 py-3 rounded-xl border border-[#2A3454]/70 focus:border-blue-500/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-200 placeholder-gray-500"
                  />
                  {inputValue && (
                    <button 
                      onClick={clearSearch} 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FiX className="text-gray-500 hover:text-blue-400 transition-colors" size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-5 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12M12 6C13.1046 6 14 6.89543 14 8M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18ZM12 18C12 18 12 18 12 18ZM12 14V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Price Range
                </h3>
                <div className="mb-8 px-1">
                  <Slider
                    range
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value as [number, number])}
                    trackStyle={[{ 
                      backgroundImage: 'linear-gradient(to right, #818cf8, #6366f1)', 
                      height: '6px'
                    }]}
                    handleStyle={[
                      { 
                        borderColor: '#6366f1', 
                        backgroundColor: '#fff', 
                        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
                        width: '18px',
                        height: '18px',
                        marginTop: '-6px'
                      },
                      { 
                        borderColor: '#818cf8', 
                        backgroundColor: '#fff', 
                        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
                        width: '18px',
                        height: '18px',
                        marginTop: '-6px'
                      }
                    ]}
                    railStyle={{ 
                      backgroundColor: '#2A3454', 
                      height: '6px' 
                    }}
                  />
                </div>

                <div className="flex justify-between">
                  <div className="bg-[#131B30] backdrop-blur-sm border border-[#2A3454]/80 px-4 py-2 rounded-lg font-medium text-white">
                    ${priceRange[0]}
                  </div>
                  <div className="bg-[#131B30] backdrop-blur-sm border border-[#2A3454]/80 px-4 py-2 rounded-lg font-medium text-white">
                    ${priceRange[1]}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 bg-[#1A223C]/40 backdrop-blur-sm rounded-xl p-4 border border-[#2A3454]/50">
              <p className="font-medium text-blue-300 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  layout
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="relative"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center bg-[#1A223C]/40 backdrop-blur-sm rounded-2xl border border-[#2A3454]/50"
                >
                  <div className="w-24 h-24 rounded-full bg-[#131B30] flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                  <p className="text-gray-400 max-w-md px-6">
                    Try adjusting your search criteria or price range to find products.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}