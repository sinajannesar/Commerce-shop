// __test__/app/api/products/productsapitest.tsx
import { createClient } from 'redis';
import { Product } from '../../../../src/types/types';
import { vi } from 'vitest';
import { Mock } from 'vitest';

/**
 * Page Object Model for Products API interactions
 */
export class ProductsApiPage {
  private redisClient: ReturnType<typeof createClient>;
  private mockFetch: Mock;
  private mockRedisGet: Mock;
  private mockRedisSet: Mock;
  private mockRedisIsOpen: ReturnType<typeof vi.spyOn>;
  private mockRedisConnect: Mock;
  private mockRedisOn: Mock;
  private originalFetch: typeof global.fetch;
  
  constructor() {
    // Store original fetch
    this.originalFetch = global.fetch;
    
    // Setup mock redis client
    this.mockRedisGet = vi.fn();
    this.mockRedisSet = vi.fn();
    this.mockRedisConnect = vi.fn().mockResolvedValue(undefined);
    this.mockRedisOn = vi.fn();
    
    // Setup Redis client mock
    this.redisClient = {
      get: this.mockRedisGet,
      set: this.mockRedisSet,
      connect: this.mockRedisConnect,
      on: this.mockRedisOn,
      isOpen: false
    } as unknown as ReturnType<typeof createClient>;
    
    // Mock isOpen property
    this.mockRedisIsOpen = vi.spyOn(this.redisClient, 'isOpen', 'get');
    
    // Setup fetch mock
    this.mockFetch = vi.fn();
  }

  // Add these getter methods to provide access to the mock functions
  public getMockFetch(): Mock {
    return this.mockFetch;
  }

  public getMockRedisGet(): Mock {
    return this.mockRedisGet;
  }

  /**
   * Initialize the test environment
   */
  async setup() {
    // Mock redis
    vi.mock('redis', () => ({
      createClient: vi.fn().mockImplementation(() => this.redisClient)
    }));
    
    // Mock fetch
    global.fetch = this.mockFetch;
    
    // Mock environment variables
    process.env.REDIS_URL = 'redis://test-redis:6379';
    
    // Clear mock call history
    this.resetMocks();
    
    // Make sure redis.createClient returns the mock with 'on' properly defined
    const redis = await import('redis');
    (redis.createClient as Mock).mockReturnValue(this.redisClient);
  }

  /**
   * Reset all mocks to their initial state
   */
  resetMocks() {
    this.mockRedisGet.mockReset();
    this.mockRedisSet.mockReset();
    this.mockRedisConnect.mockReset().mockResolvedValue(undefined);
    this.mockRedisOn.mockReset();
    this.mockFetch.mockReset();
    this.mockRedisIsOpen.mockReturnValue(false);
  }

  /**
   * Clean up after tests
   */
  async teardown() {
    global.fetch = this.originalFetch;
    vi.restoreAllMocks();
    vi.resetModules();
  }

  /**
   * Mock Redis to return cached API products
   */
  mockCachedApiProducts(products: Product[]) {
    this.mockRedisGet.mockImplementation((redisKey: string) => {
      if (redisKey === 'api:products') {
        return Promise.resolve(JSON.stringify(products));
      }
      if (redisKey === 'local:products') {
        return Promise.resolve(JSON.stringify([]));
      }
      return Promise.resolve(null);
    });
  }

  /**
   * Mock Redis to return no cached API products but with local products
   */
  mockLocalProducts(products: Product[]) {
    this.mockRedisGet.mockImplementation((redisKey: string) => {
      if (redisKey === 'api:products') {
        return Promise.resolve(null);
      }
      if (redisKey === 'local:products') {
        return Promise.resolve(JSON.stringify(products));
      }
      return Promise.resolve(null);
    });
  }

  /**
   * Mock Redis to return both cached API products and local products
   */
  mockCombinedProducts(apiProducts: Product[], localProducts: Product[]) {
    this.mockRedisGet.mockImplementation((redisKey: string) => {
      if (redisKey === 'api:products') {
        return Promise.resolve(JSON.stringify(apiProducts));
      }
      if (redisKey === 'local:products') {
        return Promise.resolve(JSON.stringify(localProducts));
      }
      return Promise.resolve(null);
    });
  }

  /**
   * Mock Redis to return no products at all
   */
  mockNoProducts() {
    this.mockRedisGet.mockImplementation(() => {
      return Promise.resolve(null);
    });
  }

  /**
   * Mock fetch API to return products
   */
  mockApiResponse(products: Product[], status = 200) {
    this.mockFetch.mockResolvedValue({
      ok: status === 200,
      status,
      json: () => Promise.resolve(products)
    });
  }

  /**
   * Mock Redis to be already connected
   */
  mockRedisAlreadyConnected() {
    this.mockRedisIsOpen.mockReturnValue(true);
  }

  /**
   * Mock Redis connection failure
   */
  mockRedisConnectionFailure(error: Error) {
    this.mockRedisConnect.mockRejectedValue(error);
  }

  /**
   * Mock API fetch failure
   */
  mockApiFetchFailure(status = 500) {
    this.mockFetch.mockResolvedValue({
      ok: false,
      status
    });
  }
}

// Export the page object model class
export default ProductsApiPage;