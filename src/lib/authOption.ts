// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { readUsersDb } from '@/lib/dbmaneger/usersDb';
import { User } from "@/types/types";

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  firstname?: string;
  lastname?: string;
  address?: string;
  phonenumber?: string;
  nashionalcode?: string;
  createdAt?: string;
  role?: string;
  provider?: string;
}

declare module "next-auth" {
  interface Session {
    user: AuthUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthUser;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const db = await readUsersDb();
          const user = db.users.find(
            (u: User) => u.email === credentials.email && u.password === credentials.password
          );

          if (!user) {
            return null;
          }

          const stringId = user.id.toString();
          
          return {
            id: stringId,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            phonenumber: user.phonenumber?.toString(),
            nashionalcode: user.nashionalcode,
            createdAt: user.createdAt,
            role: 'user',
            provider: 'credentials'
          } as AuthUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
   
  },
  secret: process.env.NEXTAUTH_SECRET
};
