// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  
  interface Session {
    user: {
      id: string;
      role?: string;
      provider?: string;
    } & DefaultSession["user"];
  }

 
  interface User {
    id: string;
    role?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    provider?: string;
  }
}