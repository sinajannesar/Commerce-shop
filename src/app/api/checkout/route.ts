import { NextResponse } from "next/server";
import { stripe } from "@/lib/strip";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOption";
import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "db", "users.json");

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  address: string;
  phonenumber: number;
  nashionalcode: string;
  city: string;
  postalcode: number;
  createdAt?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

     let userData: User | undefined;
    try {
      const fileContent = fs.readFileSync(usersFilePath, "utf-8");
      const parsedContent = JSON.parse(fileContent);
      const users: User[] = parsedContent.users;
      userData = users.find(
        (user) => user.id === Number(session.user.id)
      );
    } catch (error) {
      console.error("Error reading users.json:", error);
      return NextResponse.json(
        { error: "Failed to load user data" },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        { error: "User information not found" },
        { status: 404 }
      );
    }

    const { items }: { items: CartItem[] } = await request.json();
    if (!items?.length) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        !item.name ||
        typeof item.price !== "number" ||
        item.price <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid cart item data" },
          { status: 400 }
        );
      }
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const baseUrl = process.env.NEXT_URL || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        userId: String(userData.id),
        userEmail: userData.email,
        userFirstname: userData.firstname,
        userLastname: userData.lastname,
        userAddress: userData.address,
        userCity: userData.city,
        userPostalCode: String(userData.postalcode),
        userPhoneNumber: String(userData.phonenumber),
        userNationalCode: userData.nashionalcode,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An error occurred during checkout", details: String(error) },
      { status: 500 }
    );
  }
}
