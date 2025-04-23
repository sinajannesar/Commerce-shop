// // src/lib/auth.ts
// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import { z } from 'zod';
// import { initUsersDb } from './dbmaneger/usersDb';

// // Schema for validating login credentials
// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(4, 'Password must be at least 4 characters'),
// });

// export const authOptions: NextAuthOptions = {
//   providers: [
//     // Credentials Provider
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         try {
//           // Validate credentials
//           const result = loginSchema.safeParse(credentials);
          
//           if (!result.success) {
//             console.error('Validation error:', result.error.flatten().fieldErrors);
//             return null;
//           }
          
//           const { email, password } = result.data;
          
//           // Get users from database
//           const db = await initUsersDb();
          
//           // Find user with matching email and password
//           const user = db.users.find(
//             (u) => u.email === email && u.password === password
//           );
          
//           if (!user) {
//             return null;
//           }
          
//           // Return user data without password
//           return {
//             id: String(user.id),
//             name: `${user.firstname} ${user.lastname}`,
//             email: user.email,
            
//           };
//         } catch (error) {
//           console.error('Authorization error:', error);
//           return null;
//         }
//       },
//     }),
    
//     // Google Provider - Uncomment and add your own credentials
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "select_account",
//         },
//       },
//     }),
//   ],
  
//   // Configure JWT session
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
  
//   // Custom pages
//   pages: {
//     signIn: '/login',
//     signOut: '/logout',
//     error: '/login', // Error code passed in query string as ?error=
//     newUser: '/register',
//   },
  
//   // Callbacks for JWT and session handling
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role || 'user';
//       }
//       if (account) {
//         token.provider = account.provider;
//       }
//       return token;
//     },
    
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         (session.user as any).role = (token as any).role;
//         (session.user as any).provider = (token as any).provider;
//       }
//       return session;
//     },
    
//     async signIn({ user, account, profile }) {
//       // For Google auth, you can create a new user if they don't exist
//       if (account?.provider === 'google') {
//         try {
//           const db = await initUsersDb();
//           const existingUser = db.users.find(u => u.email === user.email);
          
//           if (!existingUser && user.email) {
//             // You would implement your user creation logic here
//             // Example:
//             // await createUserFromOAuth({
//             //   firstname: profile?.given_name || user.name?.split(' ')[0] || '',
//             //   lastname: profile?.family_name || user.name?.split(' ')[1] || '',
//             //   email: user.email,
//             //   avatar: user.image || null,
//             //   provider: 'google',
//             // });
//           }
//         } catch (error) {
//           console.error('Error during OAuth sign in:', error);
//           return false;
//         }
//       }
//       return true;
//     },
//   },
  
//   // Secret for encryption
//   secret: process.env.NEXTAUTH_SECRET,
  
//   // Enable debug messages in development
//   debug: process.env.NODE_ENV === 'development',
// };