import { Supplier } from '@hoomy/shared';
import { mockSuppliers } from '@/mocks/homeData';

export interface SuppliersRepository {
  listSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier>;
}

export class MockSuppliersRepository implements SuppliersRepository {
  async listSuppliers(): Promise<Supplier[]> {
    // Для имитации сетевой задержки можно добавить setTimeout
    return [...mockSuppliers];
  }

  async getSupplier(id: string): Promise<Supplier> {
    const supplier = mockSuppliers.find((s) => s.id === id);
    if (!supplier) {
      throw new Error(`Supplier with ID ${id} not found`);
    }
    return { ...supplier };
  }
}

export const suppliersRepository = new MockSuppliersRepository();
