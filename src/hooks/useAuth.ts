// // src/hooks/useAuth.ts
// 'use client';

// import { useSession, signIn, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export function useAuth() {
//   const { data: session, status } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
  
//   const isAuthenticated = status === 'authenticated';
//   const isLoading = status === 'loading';
  
//   const login = async (email: string, password: string, redirectUrl?: string) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const result = await signIn('credentials', {
//         redirect: false,
//         email,
//         password,
//       });
      
//       if (result?.error) {
//         setError('Invalid email or password');
//         return false;
//       }
      
//       if (redirectUrl) {
//         router.push(redirectUrl);
//       }
      
//       return true;
//     } catch  {
//       setError('An unexpected error occurred');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const logout = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };
  
//   const socialLogin = async (provider: string) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       await signIn(provider, { callbackUrl: '/dashboard' });
//       return true;
//     } catch  {
//       setError(`Failed to login with ${provider}`);
//       setLoading(false);
//       return false;
//     }
//   };
  
//   return {
//     user: session?.user,
//     isAuthenticated,
//     isLoading: isLoading || loading,
//     error,
//     login,
//     logout,
//     socialLogin,
//   };
// }

// // Example guard hook for protected client components
// export function useRequireAuth(redirectTo = '/login') {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();
  
//   if (!isLoading && !isAuthenticated) {
//     router.push(redirectTo);
//   }
  
//   return { isAuthenticated, isLoading };
// }