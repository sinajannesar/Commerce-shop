const ErrorMessage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C1222] text-white" role="alert">
      <div className="p-8 rounded-xl bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border border-red-700/30 text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
          <svg className="w-20 h-20 relative z-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-300 mb-3">Error Loading Products</h2>
        <p className="text-red-200 opacity-90">Failed to load products</p>
        <button
          className="mt-6 px-5 py-2 bg-red-700/50 hover:bg-red-600/50 transition-colors rounded-lg text-white font-medium"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
  export default ErrorMessage;
  