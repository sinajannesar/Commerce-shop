import { NextResponse } from "next/server";
import { Product } from "@/types/types";

let cachedProducts: Product[] | null = null;
let lastFetchedTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; 

async function fetchApiProducts(): Promise<Product[]> {
  console.log("Fetching products from external API");

  const response = await fetch("https://fakestoreapi.com/products", {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 3600, 
      tags: ['products'],
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

export async function fetchProducts(): Promise<Product[]> {
  const now = Date.now();

  if (cachedProducts && now - lastFetchedTime < CACHE_DURATION) {
    console.log("Serving products from memory cache");
    return cachedProducts;
  }

  const freshProducts = await fetchApiProducts();
  cachedProducts = freshProducts;
  lastFetchedTime = now;

  return freshProducts;
}

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60"
      }
    });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
