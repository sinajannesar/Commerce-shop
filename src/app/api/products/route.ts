import { NextResponse } from "next/server";
import { Product } from "@/types/types";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

let connectionPromise: Promise<void> | null = null;
const connectRedis = async () => {
  if (redisClient.isOpen) return;
  
  if (!connectionPromise) {
    connectionPromise = redisClient.connect()
      .then(() => console.log("Redis client connected"))
      .catch((err) => {
        console.error("Failed to connect to Redis:", err);
        throw err;
      })
      .finally(() => connectionPromise = null);
  }
  
  return connectionPromise;
};

const KEYS = {
  API_PRODUCTS: "api:products",
  LOCAL_PRODUCTS: "local:products",
  LAST_REFRESH_TIME: "api:last_refresh_time"
};

// Cache settings
const API_CACHE_TTL = 3600; // 1 hour TTL for Redis cache
const CACHE_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

async function fetchApiProducts(): Promise<Product[]> {
  console.log("Fetching products from external API");
  const response = await fetch("https://fakestoreapi.com/products", {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60"
    }
  });
  
  if (!response.ok) {
    throw new Error(`API fetch failed with status ${response.status}`);
  }
  
  const products = await response.json();
  if (!Array.isArray(products)) {
    throw new Error("API response is not an array");
  }
  
  return products;
}

async function shouldRefreshCache(): Promise<boolean> {
  try {
    const lastRefreshTime = await redisClient.get(KEYS.LAST_REFRESH_TIME);
    
    if (!lastRefreshTime) {
      return true;
    }
    
    const lastRefresh = parseInt(lastRefreshTime);
    const currentTime = Date.now();
    
    return (currentTime - lastRefresh) >= CACHE_REFRESH_INTERVAL;
  } catch (error) {
    console.error("Error checking cache refresh time:", error);
    return true; // If there's an error, refresh to be safe
  }
}

async function refreshCache(): Promise<Product[]> {
  console.log("Refreshing API products cache");
  const apiProducts = await fetchApiProducts();
  
  try {
    await redisClient.set(KEYS.API_PRODUCTS, JSON.stringify(apiProducts), {
      EX: API_CACHE_TTL
    });
    await redisClient.set(KEYS.LAST_REFRESH_TIME, Date.now().toString());
    console.log("API products cache refreshed and timestamp updated");
  } catch (redisError) {
    console.error("Failed to update cache during refresh:", redisError);
  }
  
  return apiProducts;
}

export async function fetchProducts(): Promise<Product[]> {
  let apiProducts: Product[] = [];
  let localProducts: Product[] = [];
  
  try {
    await connectRedis();
    
    try {
      // Check if we need to refresh the cache
      const needsRefresh = await shouldRefreshCache();
      
      if (needsRefresh) {
        apiProducts = await refreshCache();
      } else {
        // Try to get from cache first
        const cachedApiProducts = await redisClient.get(KEYS.API_PRODUCTS);
        
        if (cachedApiProducts) {
          apiProducts = JSON.parse(cachedApiProducts);
          console.log("API products loaded from Redis cache");
        } else {
          // Cache miss, fetch and store
          apiProducts = await fetchApiProducts();
          
          try {
            await redisClient.set(KEYS.API_PRODUCTS, JSON.stringify(apiProducts), {
              EX: API_CACHE_TTL
            });
            await redisClient.set(KEYS.LAST_REFRESH_TIME, Date.now().toString());
            console.log("API products fetched and cached in Redis");
          } catch (redisError) {
            console.error("Failed to store API products in Redis:", redisError);
          }
        }
      }
    } catch (apiProductsError) {
      console.error("Error getting API products from Redis:", apiProductsError);
      apiProducts = await fetchApiProducts();
    }
    
    try {
      const localProductsData = await redisClient.get(KEYS.LOCAL_PRODUCTS);
      localProducts = localProductsData
        ? JSON.parse(localProductsData)
        : [];
      
      if (!localProductsData) {
        await redisClient.set(KEYS.LOCAL_PRODUCTS, JSON.stringify([]));
        console.log("Local products initialized in Redis");
      }
    } catch (localProductsError) {
      console.error("Error getting local products from Redis:", localProductsError);
      localProducts = [];
    }
    
  } catch (connectionError) {
    console.error("Redis connection error:", connectionError);
    apiProducts = await fetchApiProducts();
  }
  
  return [...apiProducts, ...localProducts].filter(
    (product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
  );
}

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}