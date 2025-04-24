import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { readUsersDb } from '@/lib/dbmaneger/usersDb';
import { User } from "@/types/types";
import { authOptions } from '@/lib/authOption';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
  
  try {
    const db = await readUsersDb();
    const user = db.users.find((u: User) => u.email === session.user?.email);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Remove password before sending
    const { password, ...userData } = user;
    void password; 
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}