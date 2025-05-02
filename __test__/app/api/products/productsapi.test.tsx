// __test__/app/api/products/productsapi.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProductsApiPage } from './productsapitest';
import { Product } from '../../../../src/types/types';
import { Mock } from 'vitest';

// Mock the console methods
console.log = vi.fn();
console.error = vi.fn();

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: Product[] | { error: string }) => ({ data }))
  }
}));

describe('Products API', () => {
  let productsApiPage: ProductsApiPage;
  let GET: Mock;

  beforeEach(async () => {
    // Reset mocks
    vi.resetModules();
    
    // Setup the page object
    productsApiPage = new ProductsApiPage();
    await productsApiPage.setup();
    
    // Import the API module after the mocks are setup
    const apiModule = await import('../../../../src/app/api/products/route');
    GET = vi.fn(apiModule.GET) as Mock;
  });

  afterEach(async () => {
    // Cleanup
    await productsApiPage.teardown();
  });

  it('should return cached API products', async () => {
    // Arrange
    const mockProducts: Product[] = [
      { id: 1, title: 'Product 1', price: 10, description: 'Description 1', category: 'Category 1', image: 'image1.jpg', rating: { rate: 4.5, count: 10 } },
      { id: 2, title: 'Product 2', price: 20, description: 'Description 2', category: 'Category 2', image: 'image2.jpg', rating: { rate: 4.0, count: 20 } }
    ];
    
    productsApiPage.mockCachedApiProducts(mockProducts);
    productsApiPage.mockRedisAlreadyConnected();
    
    // Act
    const response = await GET();
    
    // Assert
    expect(response.data).toEqual(mockProducts);
    expect(console.log).toHaveBeenCalledWith('API products loaded from Redis cache');
  });
  
  it('should fetch products from API when cache is empty', async () => {
    // Arrange
    const mockProducts: Product[] = [
      { id: 1, title: 'Product 1', price: 10, description: 'Description 1', category: 'Category 1', image: 'image1.jpg', rating: { rate: 4.5, count: 10 } },
      { id: 2, title: 'Product 2', price: 20, description: 'Description 2', category: 'Category 2', image: 'image2.jpg', rating: { rate: 4.0, count: 20 } }
    ];
    
    productsApiPage.mockNoProducts();
    productsApiPage.mockApiResponse(mockProducts);
    
    // Act
    const response = await GET();
    
    // Assert
    expect(response.data).toEqual(mockProducts);
    expect(console.log).toHaveBeenCalledWith('API products fetched and cached in Redis');
  });
  
  it('should combine API and local products', async () => {
    // Arrange
    const apiProducts: Product[] = [
      { id: 1, title: 'API Product 1', price: 10, description: 'Description 1', category: 'Category 1', image: 'image1.jpg', rating: { rate: 4.5, count: 10 } },
      { id: 2, title: 'API Product 2', price: 20, description: 'Description 2', category: 'Category 2', image: 'image2.jpg', rating: { rate: 4.0, count: 20 } }
    ];
    
    const localProducts: Product[] = [
      { id: 3, title: 'Local Product 1', price: 30, description: 'Local Description 1', category: 'Local Category 1', image: 'local1.jpg', rating: { rate: 5.0, count: 5 } }
    ];
    
    productsApiPage.mockCombinedProducts(apiProducts, localProducts);
    
    // Act
    const response = await GET();
    
    // Assert
    expect(response.data).toEqual([...apiProducts, ...localProducts]);
  });
  
  it('should handle API fetch errors', async () => {
    // Arrange
    productsApiPage.mockNoProducts();
    productsApiPage.mockApiFetchFailure(500);
    
    // Act
    const response = await GET();
    
    // Assert
    expect(response.data).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
  
  it('should handle Redis connection errors', async () => {
    // Arrange
    const error = new Error('Redis connection error');
    productsApiPage.mockRedisConnectionFailure(error);
    
    // Act & Assert
    await expect(GET()).resolves.toBeDefined();
    expect(console.error).toHaveBeenCalled();
  });
  
  it('should handle non-array API response', async () => {
    // Arrange
    productsApiPage.mockNoProducts();
    
    // Use the getter method to access the protected mockFetch property
    const mockFetch = productsApiPage.getMockFetch();
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ error: 'Not an array' }) // Not an array
    });
    
    // Act
    const response = await GET();
    
    // Assert
    expect(response.data).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
  
  it('should remove duplicate products when combining', async () => {
    // Arrange
    const apiProducts: Product[] = [
      { id: 1, title: 'Product 1', price: 10, description: 'Description 1', category: 'Category 1', image: 'image1.jpg', rating: { rate: 4.5, count: 10 } },
      { id: 2, title: 'Product 2', price: 20, description: 'Description 2', category: 'Category 2', image: 'image2.jpg', rating: { rate: 4.0, count: 20 } }
    ];
    
    const localProducts: Product[] = [
      { id: 1, title: 'Updated Product 1', price: 15, description: 'Updated Description 1', category: 'Category 1', image: 'image1.jpg', rating: { rate: 4.5, count: 10 } },
      { id: 3, title: 'Local Product', price: 30, description: 'Local Description', category: 'Local Category', image: 'local.jpg', rating: { rate: 5.0, count: 5 } }
    ];
    
    productsApiPage.mockCombinedProducts(apiProducts, localProducts);
    
    // Act
    const response = await GET();
    
    // Assert
    // Should contain 3 products (unique by ID)
    expect(response.data.length).toBe(3);
    // Should contain the local version of product with ID 1
    expect(response.data.find(p => p.id === 1)?.title).toBe('Product 1');
  });
  
  it('should initialize local products if not exists', async () => {
    // Arrange
    const apiProducts: Product[] = [
      { id: 1, title: 'Product 1', price: 10, description: 'Description 1', category: 'Category 1', image: 'image1.jpg', rating: { rate: 4.5, count: 10 } }
    ];
    
    // Use the getter method to access the protected mockRedisGet property
    const mockRedisGet = productsApiPage.getMockRedisGet();
    mockRedisGet.mockImplementation((redisKey: string) => {
      if (redisKey === 'api:products') {
        return Promise.resolve(JSON.stringify(apiProducts));
      }
      if (redisKey === 'local:products') {
        return Promise.resolve(null); // Local products don't exist yet
      }
      return Promise.resolve(null);
    });
    
    // Act
    const response = await GET();
    
    // Assert
    expect(response.data).toEqual(apiProducts);
    expect(console.log).toHaveBeenCalledWith('Local products initialized in Redis');
  });
});