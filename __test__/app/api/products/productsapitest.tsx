// pages/ProductPage.ts
import supertest from 'supertest';

// Define interfaces for better TypeScript support
export interface Product {
  id: number;
  title: string;
  category?: string;
  price: number;
  description?: string;
  image?: string;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export interface CacheResult {
  isCached: boolean;
  firstCallTime: number;
  secondCallTime: number;
}

export interface CategoryMap {
  [category: string]: Product[];
}

/**
 * Page Object Model for Products API
 * Encapsulates all product-related API interactions
 */
class ProductPage {
  // Fix: Use the exact type returned by supertest
  private request: ReturnType<typeof supertest>;
  
  constructor(baseUrl: string = process.env.BASE_URL || 'http://localhost:3000') {
    this.request = supertest(baseUrl);
  }

  /**
   * Fetches all products from the API
   * @returns Promise with response containing status and data
   */
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.request.get('/api/products');
      return {
        status: response.status,
        data: response.body as Product[],
        headers: response.headers as Record<string, string>
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Gets a product by its ID
   * @param id - Product ID to fetch
   * @returns Product if found, null otherwise
   */
  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.getAllProducts();
      if (response.status !== 200) {
        return null;
      }
      
      return response.data.find(product => product.id === id) || null;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Checks if API cache is working by measuring response times
   * @returns Result indicating if caching is working
   */
  async verifyRedisCache(): Promise<CacheResult> {
    try {
      // First call - might not be cached
      const startTime1 = Date.now();
      await this.getAllProducts();
      const firstCallTime = Date.now() - startTime1;
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Second call - should be cached
      const startTime2 = Date.now();
      await this.getAllProducts();
      const secondCallTime = Date.now() - startTime2;
      
      // If cache is working, second call should be significantly faster
      return {
        isCached: secondCallTime < firstCallTime * 0.8, // 20% faster is considered cached
        firstCallTime,
        secondCallTime
      };
    } catch (error) {
      console.error('Error verifying Redis cache:', error);
      throw error;
    }
  }

  /**
   * Gets the total count of products
   * @returns Total product count
   */
  async getProductCount(): Promise<number> {
    const response = await this.getAllProducts();
    return response.data.length;
  }

  /**
   * Groups products by category
   * @returns Products grouped by category
   */
  async getProductsByCategory(): Promise<CategoryMap> {
    const response = await this.getAllProducts();
    
    if (response.status !== 200) {
      throw new Error(`Failed to get products: ${response.status}`);
    }
    
    return response.data.reduce<CategoryMap>((categories, product) => {
      const category = product.category || 'uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(product);
      return categories;
    }, {});
  }
}

export default ProductPage;