"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formDataSchema } from "@/schemas/registerschemas";
import Head from "next/head";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const rawData = Object.fromEntries(formData.entries());

      if (rawData.phonenumber) {
        rawData.phonenumber = String(rawData.phonenumber);
      }
      const validation = formDataSchema.safeParse(rawData);
      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }
      console.log(validation)

      const response = await fetch("api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      if (response.ok) {
        await signIn('credentials', {
          email: validation.data.email,
          password: validation.data.password,
          callbackUrl: '/dashboard',
        });
        
      } else {
        const data = await response.json();
        alert(data.error || 'Registration failed. Please try again.')
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed. Please try again.");
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | Your App Name</title>
        <meta name="description" content="Create a new account" />
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-black bg-opacity-60 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-800 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-gray-400 mt-2">Join us today and get started</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm mb-1">First name</label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm mb-1">Last name</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phonenumber" className="block text-sm mb-1">Phone number</label>
              <input
                id="phonenumber"
                name="phonenumber"
                type="tel"
                pattern="[0-9]{10,}"
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
                placeholder="09123456789"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 border-gray-600 bg-gray-800 focus:ring-purple-500 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" className="text-purple-400 hover:underline">Terms and Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
