export default function Loading() {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-indigo-500"></div>
          <p className="text-lg font-medium text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }
  