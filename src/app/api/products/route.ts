import { NextResponse } from "next/server";
import { Product } from "@/types/types";

// Configuration
const API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || "https://fakestoreapi.com",
  timeout: parseInt(process.env.API_TIMEOUT || "10000"),
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || "3"),
  retryDelay: parseInt(process.env.API_RETRY_DELAY || "1000"),
};

// Custom error classes
class APIError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: Error) {
    super(message);
    this.name = "APIError";
  }
}

class TimeoutError extends Error {
  constructor(message: string = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

// Utility functions
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface UnknownProduct {
  [key: string]: unknown;
}
const isValidProduct = (product: UnknownProduct): boolean => {
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product.id === 'number' &&
    typeof product.title === 'string' &&
    typeof product.price === 'number' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.image === 'string'
  );
};

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Retry logic
async function fetchWithRetry<T>(
  fetchFunction: () => Promise<T>,
  maxAttempts: number = API_CONFIG.retryAttempts,
  delay: number = API_CONFIG.retryDelay
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`API fetch attempt ${attempt}/${maxAttempts}`);
      return await fetchFunction();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        console.error(`All ${maxAttempts} attempts failed. Last error:`, lastError.message);
        throw lastError;
      }

      const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
      console.warn(`Attempt ${attempt} failed: ${lastError.message}. Retrying in ${waitTime}ms...`);
      await sleep(waitTime);
    }
  }

  throw lastError!;
}

async function fetchApiProducts(): Promise<Product[]> {
  const startTime = Date.now();
  console.log("🚀 Starting API fetch from", API_CONFIG.baseUrl);

  const fetchFunction = async () => {
    const response = await fetchWithTimeout(
      `${API_CONFIG.baseUrl}/products`,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "NextJS-App/1.0",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60"
        },
      },
      API_CONFIG.timeout
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new APIError(
        `API request failed: ${response.status} ${response.statusText}. ${errorText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new APIError("API response is not an array");
    }

    // Validate each product
    const validProducts = data.filter((product, index) => {
      const isValid = isValidProduct(product);
      if (!isValid) {
        console.warn(`⚠️  Invalid product at index ${index}:`, product);
      }
      return isValid;
    });

    if (validProducts.length === 0) {
      throw new APIError("No valid products found in API response");
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Successfully fetched ${validProducts.length} products in ${duration}ms`);
    
    return validProducts;
  };

  return await fetchWithRetry(fetchFunction);
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    return await fetchApiProducts();
  } catch (error) {
    console.error("❌ Error in fetchProducts:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const products = await fetchProducts();
    
    return NextResponse.json(
      { 
        success: true, 
        data: products, 
        count: products.length,
        timestamp: new Date().toISOString()
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error("❌ API route error:", error);
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString()
    };

    if (error instanceof TimeoutError) {
      return NextResponse.json(errorResponse, { status: 408 });
    }
    
    if (error instanceof APIError && error.statusCode) {
      return NextResponse.json(errorResponse, { status: error.statusCode });
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}