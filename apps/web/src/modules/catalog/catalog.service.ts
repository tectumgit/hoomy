import { Product } from '@hoomy/shared';

export class CatalogService {
  async getProducts(): Promise<Product[]> {
    // This will initially use a mock repository, then HTTP/DB
    return [];
  }
}
