import { Supplier } from '@hoomy/shared';

export class SuppliersService {
  async getSuppliers(): Promise<Supplier[]> {
    // This will initially use a mock repository, then HTTP/DB
    return [];
  }
}
