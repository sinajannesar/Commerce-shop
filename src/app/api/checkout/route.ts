import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/strip"; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOption";
import fs from "fs/promises"; 
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

interface UsersData {
  users: User[];
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Payment system configuration error" },
        { status: 500 }
      );
    }

    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      console.error("Session error:", error);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

    let userData: User | undefined;
    try {
      await fs.access(usersFilePath);
      
      const fileContent = await fs.readFile(usersFilePath, "utf-8");
      const parsedContent: UsersData = JSON.parse(fileContent);
      
      if (!parsedContent.users || !Array.isArray(parsedContent.users)) {
        throw new Error("Invalid users data structure");
      }
      
      userData = parsedContent.users.find(
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

    const requiredFields = ['firstname', 'lastname', 'email', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !userData[field as keyof User]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing user information: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    let requestBody;
    try {
      requestBody = await request.json();
    } catch  {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { items }: { items: CartItem[] } = requestBody;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        !item.id ||
        !item.name ||
        typeof item.price !== "number" ||
        item.price <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 99 
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
        product_data: { 
          name: item.name,
          metadata: {
            item_id: item.id
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const baseUrl = process.env.NEXTAUTH_URL || 
                   process.env.NEXT_PUBLIC_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   "http://localhost:3000";

    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cart`,
        customer_email: userData.email,
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'], 
        },
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
          itemCount: String(items.length),
          totalAmount: String(items.reduce((sum, item) => sum + (item.price * item.quantity), 0)),
        },
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), 
      });
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    if (!stripeSession.url) {
      return NextResponse.json(
        { error: "Failed to create checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      url: stripeSession.url,
      sessionId: stripeSession.id 
    });

  } catch (error) {
    console.error("Checkout error:", error);
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: "An error occurred during checkout",
        ...(isDevelopment && { details: String(error) })
      },
      { status: 500 }
    );
  }
}