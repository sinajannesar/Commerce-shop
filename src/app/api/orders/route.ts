// // File: app/api/orders/route.ts

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOption";
// import { readUsersDb, writeUsersDb } from "@/lib/dbmaneger/usersDb";
// import { Order } from "@/types/types";

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     // Ensure the user is authenticated
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: "User is not authenticated" },
//         { status: 401 }
//       );
//     }

//     // Parse the order data from the request body
//     const orderData = await request.json();

//     // Validate order data
//     if (!orderData || !orderData.items || orderData.items.length === 0) {
//       return NextResponse.json(
//         { error: "Order data is incomplete" },
//         { status: 400 }
//       );
//     }

//     for (const item of orderData.items) {
//       if (
//         !item.name ||
//         typeof item.price !== "number" ||
//         typeof item.quantity !== "number"
//       ) {
//         return NextResponse.json(
//           { error: "Each item must have name, price, and quantity" },
//           { status: 400 }
//         );
//       }
//     }

//     // Calculate the total based on the items to ensure accuracy
//     const calculatedTotal = orderData.items.reduce(
//       (sum: number, item: { price: number; quantity: number }) =>
//         sum + item.price * item.quantity,
//       0
//     );

//     if (Math.abs(calculatedTotal - orderData.total) > 0.01) {
//       return NextResponse.json(
//         { error: "Total price doesn't match item prices" },
//         { status: 400 }
//       );
//     }

//     const db = await readUsersDb();

//     const user = db.users.find((u) => String(u.id) === String(session.user.id));

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const order: Order = {
//       id: Date.now() + Math.floor(Math.random() * 1000), 
//       userId: Number(session.user.id),
//       items: orderData.items,
//       total: calculatedTotal.toFixed(2), // U
//       status: "processing",
//       createdAt: new Date().toISOString(),
//     };

//     if (!db.orders) {
//       db.orders = [];
//     }

//     db.orders.push(order);

//     await writeUsersDb(db);

//     return NextResponse.json(
//       {
//         message: "Order created successfully",
//         orderId: order.id,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: "User is not authenticated" },
//         { status: 401 }
//       );
//     }

//     const db = await readUsersDb();

//     if (!db.orders) {
//       return NextResponse.json({ orders: [] }, { status: 200 });
//     }

//     const userOrders = db.orders.filter(
//       (order) => String(order.userId) === String(session.user.id)
//     );

//     return NextResponse.json({ orders: userOrders }, { status: 200 });
//   } catch (error) {
//     console.error("Error retrieving orders:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
