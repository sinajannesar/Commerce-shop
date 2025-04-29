import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import debounce from 'lodash.debounce';

const SearchInput = ({ inputValue, setInputValue, setSearchQuery }) => {
  const debouncedSetSearchQuery = React.useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    [setSearchQuery]
  );

  const handleSearch = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSetSearchQuery(newValue);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
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
  );
};

export default SearchInput;
