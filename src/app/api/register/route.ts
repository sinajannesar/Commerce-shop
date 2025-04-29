import { NextResponse } from "next/server";
import { User } from "@/types/types";
import { formDataSchema } from "@/schemas/registerschemas";
import { initUsersDb, writeUsersDb } from "@/lib/dbmaneger/usersDb";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const inputData = await request.json();
    const validationResult = formDataSchema.safeParse(inputData);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const validated = validationResult.data;
    const db = await initUsersDb();

    const duplicateUser = db.users.find(
      (user) => user.email === validated.email || user.phonenumber === validated.phonenumber
    );

    if (duplicateUser) {
      const duplicateField = duplicateUser.email === validated.email ? "email" : "phone number";
      return NextResponse.json(
        { error: `This ${duplicateField} has already been registered` },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: uuidv4(),
      ...validated,
      postalcode: '',
      city: '',
      address: '',
      nashionalcode: '',
      createdAt: new Date().toISOString(),
    };

    await writeUsersDb({ ...db, users: [...db.users, newUser] });

    const userWithoutPassword = {
      ...newUser,
      password: undefined, 
    };
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please sign in.",
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in registration handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
