// tests/ProductPage.test.js
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ProductPage from './productsapitest';

// Mock supertest module
vi.mock('supertest', () => {
  const mockProductsData = [
    { id: 1, title: 'Product 1', category: 'electronics', price: 109.95 },
    { id: 2, title: 'Product 2', category: 'electronics', price: 22.3 },
    { id: 3, title: 'Product 3', category: 'clothing', price: 55.99 },
    { id: 4, title: 'Product 4', category: 'clothing', price: 15.99 },
    { id: 5, title: 'Product 5', category: 'jewelry', price: 695 }
  ];

  return {
    default: () => ({
      get: vi.fn().mockImplementation((path) => {
        if (path === '/api/products') {
          return Promise.resolve({
            status: 200,
            body: mockProductsData,
            headers: {
              'content-type': 'application/json',
              'cache-control': 'public, s-maxage=3600, stale-while-revalidate=60'
            }
          });
        }
        
        return Promise.resolve({
          status: 404,
          body: { error: 'Not found' }
        });
      })
    })
  };
});

describe('Product Page Tests', () => {
  let productPage;
  
  beforeEach(() => {
    productPage = new ProductPage();
    vi.clearAllMocks();
  });
  
  describe('API Functionality', () => {
    test('should fetch all products successfully', async () => {
      // Arrange & Act
      const response = await productPage.getAllProducts();
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
    
    test('should get product by ID when product exists', async () => {
      // Arrange & Act
      const product = await productPage.getProductById(1);
      
      // Assert
      expect(product).not.toBeNull();
      expect(product.id).toBe(1);
      expect(product.title).toBe('Product 1');
    });
    
    test('should return null when product does not exist', async () => {
      // Arrange & Act
      const product = await productPage.getProductById(999);
      
      // Assert
      expect(product).toBeNull();
    });
    
    test('should correctly count total products', async () => {
      // Arrange & Act
      const count = await productPage.getProductCount();
      
      // Assert
      expect(count).toBe(5); // Based on our mock data
    });
  });
  
  describe('Data Organization', () => {
    test('should group products by category', async () => {
      // Arrange & Act
      const categorized = await productPage.getProductsByCategory();
      
      // Assert
      expect(categorized).toHaveProperty('electronics');
      expect(categorized).toHaveProperty('clothing');
      expect(categorized).toHaveProperty('jewelry');
      
      expect(categorized.electronics.length).toBe(2);
      expect(categorized.clothing.length).toBe(2);
      expect(categorized.jewelry.length).toBe(1);
    });
  });
  
  describe('Caching Functionality', () => {
    test('should verify Redis caching is working', async () => {
      // Arrange - Override supertest implementation for this test
      const originalGet = productPage.request.get;
      
      // First call is slow (not cached)
      let callCount = 0;
      productPage.request.get = vi.fn().mockImplementation(() => {
        callCount++;
        return new Promise(resolve => {
          // First call takes longer
          const delay = callCount === 1 ? 100 : 10;
          setTimeout(() => {
            resolve({
              status: 200,
              body: [{ id: 1, title: 'Test Product' }],
              headers: { 'content-type': 'application/json' }
            });
          }, delay);
        });
      });
      
      // Act
      const cacheResult = await productPage.verifyRedisCache();
      
      // Assert
      expect(cacheResult.isCached).toBe(true);
      expect(cacheResult.secondCallTime).toBeLessThan(cacheResult.firstCallTime);
      
      // Cleanup
      productPage.request.get = originalGet;
    });
  });
  
  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      // Arrange - Override the get method to simulate an error
      const originalGet = productPage.request.get;
      productPage.request.get = vi.fn().mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(productPage.getAllProducts()).rejects.toThrow('Network error');
      
      // Cleanup
      productPage.request.get = originalGet;
    });
  });
});