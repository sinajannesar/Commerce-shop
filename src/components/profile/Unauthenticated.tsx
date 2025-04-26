import Link from "next/link";

export default function Unauthenticated() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-bold text-white">Access Required</h2>
          <p className="mb-6 text-gray-300">Please log in to view your profile information.</p>
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
