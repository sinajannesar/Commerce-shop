import { NextResponse } from 'next/server';
import { User } from '@/types/types';
import { formDataSchema } from '@/schemas/registerschemas';
import { initUsersDb, writeUsersDb } from '@/lib/dbmaneger/usersDb'; 

export async function POST(request: Request) {
  try {
    const inputData = await request.json();
    const validationResult = formDataSchema.safeParse(inputData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const db = await initUsersDb();

    if (db.users.some(user => user.email === inputData.email)) {
      return NextResponse.json(
        { error: 'This email has already been registered' },
        { status: 409 }
      );
    }

    if (db.users.some(user => user.phonenumber === inputData.phonenumber)) {
      return NextResponse.json(
        { error: 'This phone number has already been registered' },
        { status: 409 }
      );
    }

    const newUser: User = {
        id: Date.now(),
        ...validationResult.data,
        phonenumber: Number(validationResult.data.phonenumber), 
        address: "",
        nashionalcode:"", 
        createdAt: new Date().toISOString(),
      };

    db.users.push(newUser);
    await writeUsersDb(db);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please sign in.',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
