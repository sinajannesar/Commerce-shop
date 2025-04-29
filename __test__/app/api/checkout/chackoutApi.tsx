import { POST } from "../../../../src/app/api/checkout/route";
import { vi } from "vitest";
// import  {stripe}  from "../../../../src/lib/strip";
import fs from "fs";
import * as auth from "next-auth/next";
import { Session } from "next-auth";


export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface UserSession {
  user: {
    id: string;
  };
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  phonenumber: number;
  nashionalcode: string;
  city: string;
  postalcode: number;
}

export class CheckoutApi {
  static async postCheckout(
    cartItems: CartItem[],
    sessionUser: Session | null = null,
    mockUser?: User
  ) {
    // Mock session
    vi.spyOn(auth, "getServerSession").mockResolvedValue(sessionUser as Session | null);

    // Mock fs
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({ users: [mockUser] })
    );

    // Mock Stripe
    // vi.spyOn(stripe.checkout.sessions, "create").mockResolvedValue({
    //     id: "cs_test_123",
    //     object: "checkout.session",
    //     url: "https://stripe.com/fake-checkout",
    //     payment_status: "unpaid",
    //     mode: "payment",
    //     status: "open",
    //     amount_total: 2000,
    //     currency: "usd",
    //     customer: "cus_test_123",
    //     customer_email: "ali@example.com",
    //     metadata: {},
    //     // add other required fields if needed
    //   } as unknown as Stripe.Checkout.Session);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ items: cartItems }),
      headers: { "Content-Type": "application/json" },
    });

    return await POST(req);
  }
}
