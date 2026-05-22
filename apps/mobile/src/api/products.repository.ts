import { Product } from '@hoomy/shared';
import { mockProducts } from '@/mocks/homeData';

export interface ProductsRepository {
  listProductsBySupplier(supplierId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product>;
  listPopularProducts(): Promise<Product[]>;
  listAllProducts(): Promise<Product[]>;
}

export class MockProductsRepository implements ProductsRepository {
  async listProductsBySupplier(supplierId: string): Promise<Product[]> {
    // Можно логировать или управлять через параметры
    return mockProducts.filter((p) => p.supplierId === supplierId);
  }

  async getProduct(id: string): Promise<Product> {
    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return { ...product };
  }

  async listPopularProducts(): Promise<Product[]> {
    // Return first 5 products for mock popular list
    return mockProducts.slice(0, 5);
  }

  async listAllProducts(): Promise<Product[]> {
    return [...mockProducts];
  }
}

export const productsRepository = new MockProductsRepository();
