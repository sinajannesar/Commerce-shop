import React, { useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceFilter = ({ priceRange, setPriceRange, products }) => {
  const prices = useMemo(() => products.map((p) => p.price), [products]);

  const priceBounds = useMemo(() => {
    if (prices.length === 0) return { min: 0, max: 1000 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [prices]);

  return (
    <div className="p-5">
      <h3 className="text-lg font-medium text-white mb-5 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12M12 6C13.1046 6 14 6.89543 14 8M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18ZM12 18C12 18 12 18 12 18ZM12 14V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Price Range
      </h3>

      <Slider
        range
        min={priceBounds.min}
        max={priceBounds.max}
        value={priceRange}
        onChange={setPriceRange}
        trackStyle={[{
          backgroundImage: 'linear-gradient(to right, #818cf8, #6366f1)',
          height: '6px'
        }]}
        handleStyle={[{
          borderColor: '#6366f1',
          backgroundColor: '#fff',
          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
          width: '18px',
          height: '18px',
          marginTop: '-6px'
        }, {
          borderColor: '#818cf8',
          backgroundColor: '#fff',
          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
          width: '18px',
          height: '18px',
          marginTop: '-6px'
        }]}
        railStyle={{
          backgroundColor: '#2A3454',
          height: '6px'
        }}
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

export default PriceFilter;
