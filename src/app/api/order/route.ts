import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import { readUsersDb, writeUsersDb } from "@/lib/dbmaneger/usersDb";
import { Order } from "@/types/types";
export async function POST(request: Request) {
  try {
    // دریافت سشن کاربر - fixed parameter usage
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "کاربر وارد نشده است" },
        { status: 401 }
      );
    }

    // دریافت داده‌های سفارش از body
    const orderData = await request.json();

    // چک کردن داده‌های سفارش
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: "اطلاعات سفارش ناقص است" },
        { status: 400 }
      );
    }

    const db = await readUsersDb();

   
    const user = db.users.find((u) => String(u.id) === String(session.user.id));

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const order: Order = {
      id: Date.now(),
      items: JSON.stringify(orderData.items),
      total: orderData.total.toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Fixed database update logic
    // Initialize orders array if it doesn't exist
    db.orders = [];
    if (!db.orders) {
    }

    // Add the new order to the orders array
    db.orders.push(order);

    // Write the updated database
    await writeUsersDb(db);

    return NextResponse.json(
      { message: "سفارش با موفقیت ثبت شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
