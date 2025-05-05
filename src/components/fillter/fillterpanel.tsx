import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import debounce from 'lodash.debounce';
import 'rc-slider/assets/index.css';

const Slider = dynamic(() => import('rc-slider'), { ssr: false });

const PriceFilter = ({ priceRange, setPriceRange, products }) => {
  const prices = useMemo(() => products.map((p) => p.price), [products]);

  const priceBounds = useMemo(() => {
    const minPrice = Math.floor(Math.min(...prices) || 0);
    const maxPrice = Math.ceil(Math.max(...prices) || 1000);
    return { min: minPrice, max: maxPrice };
  }, [prices]);

  return (
    <div className="p-5">
      <h1 className="text-lg font-medium text-white mb-5 flex items-center">
        <FiSearch className="w-5 h-5 mr-2 text-blue-400" />
        Price Range
      </h1>
      <Slider
        range
        aria-label="Price Range"
        min={priceBounds.min}
        max={priceBounds.max}
        value={priceRange}
        onChange={setPriceRange}
        trackStyle={[{ backgroundImage: 'linear-gradient(to right, #818cf8, #6366f1)', height: '6px' }]}
        handleStyle={[
          { borderColor: '#6366f1', backgroundColor: '#fff', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)', width: '18px', height: '18px', marginTop: '-6px' },
          { borderColor: '#818cf8', backgroundColor: '#fff', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)', width: '18px', height: '18px', marginTop: '-6px' },
        ]}
        railStyle={{ backgroundColor: '#2A3454', height: '6px' }}
      />
      <div className="flex justify-between mt-6">
        <div className="bg-[#131B30] backdrop-blur-sm border border-[#2A3454]/80 px-4 py-2 rounded-lg font-medium text-white">
          ${priceRange[0]}
        </div>
        <div className="bg-[#131B30] backdrop-blur-sm border border-[#2A3454]/80 px-4 py-2 rounded-lg font-medium text-white">
          ${priceRange[1]}
        </div>
      </div>
    </div>
  );
};

export default function FilterPanel({
  products,
  filterVisible,
  setFilterVisible,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  filteredProducts,
}) {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const debouncedSetSearchQuery = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    [setSearchQuery]
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [debouncedSetSearchQuery]);

  const handleSearch = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSetSearchQuery(newValue);
  }, [debouncedSetSearchQuery]);

  const clearSearch = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <>
      <div className="md:hidden mb-4">
        <button onClick={() => setFilterVisible(!filterVisible)} className="w-full flex items-center justify-between px-4 py-3 bg-[#1A223C] rounded-lg border border-[#2A3454] text-blue-300">
          <div className="flex items-center">
            <FiFilter className="mr-2" />
            <span>Filters</span>
          </div>
          <FiChevronDown className={`transition-transform ${filterVisible ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <motion.div key={filterVisible ? 'open' : 'closed'} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className={`${filterVisible ? 'block' : 'hidden'} md:block md:w-1/4`}>
        <div className="bg-[#1A223C]/80 backdrop-blur-sm rounded-2xl border border-[#2A3454] overflow-hidden shadow-xl shadow-blue-900/10 mb-6">
          <div className="p-4 border-b border-[#2A3454]/70">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-blue-400/70" size={18} />
              </div>
              <input
                type="text"
                aria-label="Search products"
                placeholder="Search products..."
                onChange={handleSearch}
                value={inputValue}
                className="w-full bg-[#131B30]/80 pl-10 pr-10 py-3 rounded-xl border border-[#2A3454]/70 focus:border-blue-500/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-200 placeholder-gray-500"
              />
              {inputValue && (
                <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <FiX className="text-gray-500 hover:text-blue-400 transition-colors" size={18} />
                </button>
              )}
            </div>
          </div>
          <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} products={products} />
        </div>
        <div className="mb-6 bg-[#1A223C]/40 backdrop-blur-sm rounded-xl p-4 border border-[#2A3454]/50">
          <p className="font-medium text-blue-300 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {filteredProducts.length} Results
          </p>
        </div>
      </motion.div>
    </>
  );
}
