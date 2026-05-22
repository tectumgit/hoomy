export type SupplierStatus = 'approved' | 'pending' | 'blocked';
export type ProductStatus = 'active' | 'out_of_stock';
export type ProductUnit = 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'pack' | 'box' | 'crate' | 'bag' | 'set';

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  iconEmoji?: string;
}

export interface DeliveryWindow {
  id: string;
  date: string;
  label: string;
  timeFrom: string;
  timeTo: string;
  deadlineLabel: string;
}

export interface Supplier {
  id: string;
  name: string;
  logoUrl: string;
  coverUrl: string;
  description: string;
  city: string;
  districts: string[];
  rating: number;
  reviewsCount: number;
  minOrderAmountKopecks: number;
  baseDeliveryFeeKopecks: number;
  freeDeliveryFromKopecks?: number;
  deliveryDays: string[];
  deliveryWindows: DeliveryWindow[];
  categories: string[];
  status: SupplierStatus;
  boostLevel?: number;
  popularityScore?: number;
  distanceKm?: number;
}

export interface Product {
  id: string;
  supplierId: string;
  categoryId: string;
  name: string;
  imageUrl: string;
  description: string;
  priceKopecks: number;
  discountPriceKopecks?: number;
  isPopular?: boolean;
  popularityScore?: number;
  unit: ProductUnit;
  minQuantity: number;
  orderStep: number;
  stockQuantity: number;
  storageConditions?: string;
  status: ProductStatus;
}

export interface CartItem {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  unitPriceKopecks: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPriceKopecks: number;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  status: string;
  deliveryDate: string;
  deliveryWindowLabel: string;
  itemsTotalKopecks: number;
  deliveryFeeKopecks: number;
  totalKopecks: number;
  items: OrderItem[];
}

export interface Order {
  id: string;
  number: string;
  status: string;
  totalKopecks: number;
  supplierOrders: SupplierOrder[];
}
