export default function NoData() {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <div className="text-center">
            <svg className="mx-auto mb-4 h-16 w-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mb-2 text-xl font-medium text-white">No Profile Data</h3>
            <p className="text-gray-400">We couldnt find your user information. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
  