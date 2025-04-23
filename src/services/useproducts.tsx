import { Product, DatabaseUser } from '@/types/types';
import { readProductsDb, initProductsDb } from '../lib/dbmaneger/dbproducts';

export async function fetchProducts(): Promise<Product[]> {
  console.log('fetchProducts function is called');

  try {
    const apiResponse = await fetch('https://fakestoreapi.com/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`API fetch failed with status ${apiResponse.status}`);
    }

    const apiProducts: Product[] = await apiResponse.json();

    if (!Array.isArray(apiProducts)) {
      throw new Error('API response is not an array');
    }

    let localProducts: Product[] = [];

    if (typeof window === 'undefined') {
      try {
        const localDb: DatabaseUser = await readProductsDb();
        localProducts = Array.isArray(localDb.products) ? localDb.products : [];
        console.log('Local DB Products:', localProducts);
      } catch (err) {
        console.warn('Local DB not found, initializing...', err);
        const initializedDb = await initProductsDb();
        localProducts = initializedDb.products;
      }
    }

    const combinedProducts = [...apiProducts, ...localProducts];
    const uniqueProducts = combinedProducts.filter(
      (product, index, self) => index === self.findIndex(p => p.id === product.id)
    );

    return uniqueProducts;
  } catch (error) {
    console.error('Unknown Error:', error);
    return [];
  }
}
