// import { NextResponse } from 'next/server';
// import { readUsersDb } from '@/lib/dbmaneger/usersDb';
// import { User } from '@/types/types';

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     const db = await readUsersDb();
//     const user = db.users.find(
//       (u: User) => u.email === email && u.password === password
//     );

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     const userData = { ...user };
//     delete userData.password;
//         return NextResponse.json(
//       { success: true, user: userData },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
