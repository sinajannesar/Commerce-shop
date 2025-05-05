const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#0C1222] text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-purple-500 border-r-blue-500 border-b-indigo-500 border-l-transparent animate-spin" />
          <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-indigo-400 border-r-transparent border-b-purple-400 border-l-blue-400 animate-spin" />
        </div>
        <p className="text-lg font-medium text-blue-300">Loading amazing products...</p>
      </div>
    </div>
  );
  export default LoadingSpinner;
  