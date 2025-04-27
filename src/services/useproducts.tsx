import { Product } from '@/types/types';
import { createClient } from 'redis';

// Redis client setup
const redisClient = createClient({ url: 'redis://localhost:6379' });

// Constants for Redis keys and TTL
const API_PRODUCTS_KEY = 'api:products';
const LOCAL_PRODUCTS_KEY = 'local:products';
const API_CACHE_TTL = 3600; // 1 hour TTL for API cache

export async function fetchProducts(): Promise<Product[]> {
  console.log('fetchProducts function is called');

  try {
    // Connect to Redis
    await redisClient.connect();

    // Step 1: Fetch API products (with caching)
    let apiProducts: Product[] = [];
    const cachedApiProducts = await redisClient.get(API_PRODUCTS_KEY);

    if (cachedApiProducts) {
      // If cached data exists, use it
      apiProducts = JSON.parse(cachedApiProducts);
      console.log('API products loaded from Redis cache');
    } else {
      // Fetch from API if not cached
      const apiResponse = await fetch('https://fakestoreapi.com/products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`API fetch failed with status ${apiResponse.status}`);
      }

      apiProducts = await apiResponse.json();

      if (!Array.isArray(apiProducts)) {
        throw new Error('API response is not an array');
      }

      await redisClient.set(API_PRODUCTS_KEY, JSON.stringify(apiProducts), {
        EX: API_CACHE_TTL,
      });
      console.log('API products fetched and cached in Redis');
    }

    const localProductsData = await redisClient.get(LOCAL_PRODUCTS_KEY);
    const localProducts: Product[] = localProductsData
      ? JSON.parse(localProductsData)
      : (() => {
          redisClient.set(LOCAL_PRODUCTS_KEY, JSON.stringify([]));
          console.log('Local products initialized in Redis');
          return [];
        })();

    if (localProductsData) {
      console.log('Local products loaded from Redis:', localProducts);
    }

    const combinedProducts = [...apiProducts, ...localProducts];
    const uniqueProducts = combinedProducts.filter(
      (product, index, self) => index === self.findIndex(p => p.id === product.id)
    );

    return uniqueProducts;
  } catch (error) {
    console.error('Unknown Error:', error);
    return [];
  } finally {
    // Disconnect Redis client
    await redisClient.disconnect();
  }
}

// // Helper function to add a local product to Redis
// export async function addLocalProduct(product: Product): Promise<void> {
//   try {
//     await redisClient.connect();
//     const localProductsData = await redisClient.get(LOCAL_PRODUCTS_KEY);
//     let localProducts: Product[] = localProductsData ? JSON.parse(localProductsData) : [];

//     // Add the new product
//     localProducts.push(product);
//     await redisClient.set(LOCAL_PRODUCTS_KEY, JSON.stringify(localProducts));
//     console.log('Local product added to Redis:', product);
//   } catch (error) {
//     console.error('Error adding local product to Redis:', error);
//   } finally {
//     await redisClient.disconnect();
//   }
// }