import { NextResponse } from "next/server";
import { Product } from "@/types/types";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

let redisConnectPromise: Promise<void> | null = null;
const connectRedis = async () => {
  if (redisClient.isOpen) return;

  if (!redisConnectPromise) {
    redisConnectPromise = redisClient
      .connect()
      .then(() => {
        console.log("Redis client connected");
      })
      .catch((err) => {
        console.error("Failed to connect to Redis:", err);
        throw err;
      })
      .finally(() => {
        redisConnectPromise = null;
      });
  }

  await redisConnectPromise;
};

connectRedis().catch((err) =>
  console.error("Initial Redis connection error:", err)
);

const API_PRODUCTS_KEY = "api:products";
const LOCAL_PRODUCTS_KEY = "local:products";
const API_CACHE_TTL = 3600;

async function fetchProducts(): Promise<Product[]> {
  console.log("fetchProducts function is called");

  try {
    await connectRedis();

    let apiProducts: Product[] = [];
    const cachedApiProducts = await redisClient.get(API_PRODUCTS_KEY);

    if (cachedApiProducts) {
      apiProducts = JSON.parse(cachedApiProducts);
      console.log("API products loaded from Redis cache");
    } else {
      const apiResponse = await fetch("https://fakestoreapi.com/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`API fetch failed with status ${apiResponse.status}`);
      }

      apiProducts = await apiResponse.json();

      if (!Array.isArray(apiProducts)) {
        throw new Error("API response is not an array");
      }

      await redisClient.set(API_PRODUCTS_KEY, JSON.stringify(apiProducts), {
        EX: API_CACHE_TTL,
      });
      console.log("API products fetched and cached in Redis");
    }

    const localProductsData = await redisClient.get(LOCAL_PRODUCTS_KEY);
    const localProducts: Product[] = localProductsData
      ? JSON.parse(localProductsData)
      : [];

    if (!localProductsData) {
      await redisClient.set(LOCAL_PRODUCTS_KEY, JSON.stringify([]));
      console.log("Local products initialized in Redis");
    } else {
      console.log("Local products loaded from Redis:", localProducts);
    }

    const combinedProducts = [...apiProducts, ...localProducts];
    const uniqueProducts = combinedProducts.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    return uniqueProducts;
  } catch (error) {
    console.error("Unknown Error:", error);
    return [];
  }
}

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}
