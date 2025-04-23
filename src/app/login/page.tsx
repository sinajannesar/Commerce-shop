"use client";
import Head from 'next/head';
import LoginForm from '@/components/auth/loginform/loginform';

export default function LoginPage() {
  return (
    <>
            <Head>
                <title>Login | Shop</title>
                <meta name="description" content="Login to access your account" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 `}>
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <LoginForm />
                </div>
            </div>
        </>
  );
}
