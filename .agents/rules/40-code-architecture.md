# Rule: Code architecture

## Monorepo target

Use:

```text
apps/mobile
apps/web
packages/shared
packages/db
packages/config
```

Do not create unrelated app roots.

## TypeScript

* Use TypeScript everywhere.
* Avoid `any` unless there is a narrow documented reason.
* Define shared domain types in `packages/shared`.
* Keep enum/string unions centralized.

## Frontend structure

Use feature folders:

```text
features/
  suppliers/
  products/
  cart/
  checkout/
  orders/
  auth/
```

Each feature can contain:

```text
components/
hooks/
repositories/
types.ts
schemas.ts
```

## Repository pattern

Create interfaces that can be backed by mocks first and HTTP later.

Example:

```ts
export interface SuppliersRepository {
  listSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier>;
}
```

Then:

```text
mockSuppliersRepository
httpSuppliersRepository later
```

## Business logic

Keep business logic outside React components:

* quantity validation;
* cart grouping;
* totals;
* supplier min order;
* delivery window availability.

Good locations:

```text
features/cart/cart-calculations.ts
features/products/quantity-rules.ts
packages/shared/domain/
```

## Naming

Prefer domain language:

* supplier;
* supplierOrder;
* minQuantity;
* orderStep;
* deliveryWindow;
* minOrderAmountKopecks.

Avoid vague names:

* itemData;
* thing;
* deliveryInfo on product;
* shopOrder if the docs say supplierOrder.
