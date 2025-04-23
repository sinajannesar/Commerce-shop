// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      role?: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    id: string;
    role?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  /** Extend the built-in JWT types */
  interface JWT {
    id: string;
    role?: string;
    provider?: string;
  }
}