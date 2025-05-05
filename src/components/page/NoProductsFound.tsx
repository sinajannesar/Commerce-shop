const NoProductsFound = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-[#1A223C]/40 backdrop-blur-sm rounded-2xl border border-[#2A3454]/50">
      <div className="w-24 h-24 rounded-full bg-[#131B30] flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
      <p className="text-gray-400 max-w-md px-6">Try adjusting your search criteria or price range to find products.</p>
    </div>
  );
  export default NoProductsFound;
  