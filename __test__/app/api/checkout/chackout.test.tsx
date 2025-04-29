// __tests__/checkout/checkout.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CheckoutApi, CartItem, User } from "./chackoutApi";

describe("Checkout API", () => {
  const fakeUser: User = {
    id: 1,
    firstname: "Ali",
    lastname: "Rezaei",
    email: "ali@example.com",
    address: "Tehran",
    phonenumber: 1234567890,
    nashionalcode: "1234567890",
    city: "Tehran",
    postalcode: 1234567890,
  };

  const cartItems: CartItem[] = [
    {
      id: "1",
      name: "Product A",
      price: 10,
      quantity: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ returns Stripe checkout URL on success", async () => {
    const res = await CheckoutApi.postCheckout(
      cartItems,
      { user: { id: String(fakeUser.id) } },
      fakeUser
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.url).toBe("https://stripe.com/fake-checkout");
  });

  it("❌ returns 401 if user is not logged in", async () => {
    const res = await CheckoutApi.postCheckout(cartItems, null, fakeUser);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toMatch(/logged in/i);
  });

  it("❌ returns 400 if cart is empty", async () => {
    const res = await CheckoutApi.postCheckout([], { user: { id: "1" } }, fakeUser);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/empty/i);
  });
});
