"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types/types";
import Link from "next/link";

export default function ProfilePage() {
  const { status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data as User);
      }
    };

    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-indigo-500"></div>
          <p className="text-lg font-medium text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <div className="text-center">
            <h2 className="mb-6 text-2xl font-bold text-white">Access Required</h2>
            <p className="mb-6 text-gray-300">Please log in to view your profile information.</p>
            <Link href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <div className="text-center">
            <svg className="mx-auto mb-4 h-16 w-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mb-2 text-xl font-medium text-white">No Profile Data</h3>
            <p className="text-gray-400">We couldnt find your user information. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-2xl bg-gray-800 shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-10">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
                  {user.firstname && user.lastname ? `${user.firstname[0]}${user.lastname[0]}` : "?"}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold text-white">
                {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : "User Profile"}
              </h1>
              <p className="text-indigo-200">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US") : "Unknown"}</p>
            </div>
          </div>

          <div className="divide-y divide-gray-700 px-6 py-4">
            <div className="flex items-center py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900/30 text-indigo-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Email</p>
                <p className="text-base text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900/30 text-indigo-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Phone</p>
                <p className="text-base text-white">{user.phonenumber || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900/30 text-indigo-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Address</p>
                <p className="text-base text-white">{user.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 px-6 py-4">
            <button className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}